
// const colors = ["#D32F2F", "#FBC02D", "#1976D2", "#8BC34A"];
const colors = ["#1666AF", "#4D2888", "#2B804F", "#545454", "#18808D", "#FA6900", "#F9BF3B"];


let layouts = [];
let svgs = [];

function skillsInit() {

    if(!$(".word-cloud").length) return;
    /*
    $(".word-cloud").on("mouseenter", function() {
        //SwitchToCloudLayout($(this).data("number"))
        if(!("ontouchstart" in document.documentElement)) {
            SwitchToRandomScatter($(this).data("number"))
        }
    })
    $(".word-cloud").on("mouseleave", function() {
        //SwitchToRandomScatter($(this).data("number"))
    })
     */

    // Word cloud data grouped by category
    // Word cloud data grouped by category

    window.svgWidth = parseInt($(".word-cloud").first().width(), 10);
// Word cloud layout configuration
    //window.svgHeight = parseInt($(".word-cloud").first().height(), 10);
    const factor = (window.innerWidth<450) ? 140 : 40;
    window.svgHeight = parseInt((window.innerWidth*factor)/window.svgWidth, 10);

    skillMap.forEach((category, index) => {
        // Create SVG element once
        svgs[index] = d3.select("#word-cloud-" + index)
            .attr("width", window.svgWidth)
            .attr("height", window.svgHeight);
        svgs[index].append("g")
            .attr("transform", `translate(${window.svgWidth / 2},${window.svgHeight / 2})`);

        // Generate the word cloud
        layouts[index] = d3.layout.cloud()
            .size([window.svgWidth, window.svgHeight])
            .words(category.words)
            .padding(10)
            .rotate((d, i) => ((i !== 0) ? (Math.round(Math.random()) * 0) : 0))
            .fontSize((d, i) => fontSize(d, i, 'cloud'))
            .on("end", (words) => redrawWords(words, index, 'coud'));
        window.currentState = 'cloud';

        layouts[index].start();

    })

    SwitchToRandomScatter();
}

function redrawWords(words, index, setState) {
    let $wc = $(".word-cloud").first();
    window.svgWidth = parseInt($wc.width(), 10);
    window.svgHeight = parseInt($wc.first().height(), 10);

    let group = svgs[index].select("g");
    let texts = group.selectAll("text")
        .data(words, d => d.text);  // Assuming each word's text is unique

    // Exit phase for removed words
    texts.exit().remove();

    // Enter phase for new words
    texts.enter().append("text");

    let targetTransform = window.currentState === 'cloud' ? `translate(${window.svgWidth / 2},${window.svgHeight / 2})` : "translate(0,0)";

    group.transition()
        .duration(1000)  // 1 second transition, adjust as desired
        .attr("transform", targetTransform);

    // Update phase for all words
    texts.transition()
        .duration(1000)
        .style("font-size", (d, i) => fontSize(d, i, setState))
//        .style("fill", window.currentState === 'scatter' ? '#545454' : colors[index])
        .style("fill", "white")
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .attr("font-weight", (d, i) => i !== 0 ? "normal" : "bold")
        .style("font-family", 'Poppins,sans-serif')

        .text((d, i) => {
            if (window.currentState === 'scatter') return d.text;
            if (i === 0) return d.text + ":";
            else if (i === texts[0].length-1) return d.text;
            else return d.text + ",";
        });
}

function scatterLayout(words) {
    let usedAreas = [];

    words.forEach((d) => {
        let wordWidth, wordHeight, randomX, randomY, isOverlapping;
        let watchdog = 0;
        do {

//            d.size = Math.random() * (d.size - 20) + 20;
            wordWidth = computeTextWidth(d.text, fontSize(d, 1, 'scatter'));
            wordHeight = d.size;
            randomX = Math.random() * (window.svgWidth - wordWidth);
            randomY = Math.random() * (window.svgHeight - wordHeight);

            isOverlapping = usedAreas.some(area =>
                randomX < area.x + area.width &&
                randomX + wordWidth > area.x &&
                randomY < area.y + area.height &&
                randomY + wordHeight > area.y
            );

            if (!isOverlapping || watchdog > 30) {
                isOverlapping = false;
                usedAreas.push({
                    x: randomX,
                    y: randomY,
                    width: wordWidth,
                    height: wordHeight
                });
            }
            watchdog++;

        } while (isOverlapping);

        d.x = randomX + wordWidth / 2;
        d.y = randomY + wordHeight / 2;
    });
    return words;
}

function computeTextWidth(text, fontSize) {
    // Create a temporary SVG to measure the text width
    let tempSvg = d3.select("body").append("svg");
    let tempText = tempSvg.append("text").attr("font-size", fontSize).text(text);
    let width = tempText.node().getComputedTextLength();
    tempSvg.remove();
    return width;
}

function flowLayout(words) {


    let containerWidth = window.svgWidth;
    let currentX = 0;
    let currentY = 7;
    let lineSpacing = 8; // Spacing between words

    let largestY = 0;

    words.forEach((d, i) => {
        let wordSpacing = d.size / 1.4
        let wordWidth = computeTextWidth(d.text, fontSize(d, i, 'structured') + "px") + wordSpacing;  // Compute the width of the word

        if (d.size > largestY) largestY = d.size;

        // If the word doesn't fit on the current line, wrap to the next line
        if (currentX + wordWidth > containerWidth) {
            currentX = 0;  // Reset X for the new line
            currentY += largestY + lineSpacing;  // Move Y to the next line
            largestY = 0;
        }

        d.x = currentX + wordWidth / 2;  // Set word's x position
        d.y = currentY + (largestY ? largestY : d.size) / 1.2 + 5;  // Center the text on its y position

        currentX += wordWidth;  // Move the X position for the next word
    });
    return words;
}

function rowLayout(words) {
    let accumulatedHeight = -1 * words[0].size;
    let spacing = window.svgWidth / 75; // Additional spacing between rows, adjust as desired

    words.forEach((d) => {
        d.x = 0;  // start from the left edge
        d.y = accumulatedHeight + d.size / 2;  // Center the text on its y position
        accumulatedHeight += d.size + spacing;  // Update accumulated height
    });
    return words;
}

window.SwitchToRowLayout = function () {

    $(".word-cloud").off("mouseenter")

    window.currentState = 'structured';
    skillMap.forEach((category, index) => {
        layouts[index].rotate(0).start();

        let words = flowLayout(category.words)

        redrawWords(words, index, 'structured');
    });

    setTimeout(function() {
        $(".word-cloud").on("mouseenter", function() {
            return;
            //SwitchToCloudLayout($(this).data("number"))
            if(!("ontouchstart" in document.documentElement)) {
                SwitchToRandomScatter($(this).data("number"));
            }
        })
    }, 1000)
}

window.SwitchToCloudLayout = function (index) {
    window.currentState = 'cloud';

    function transformToCloud(index) {
        // Stop any ongoing transitions
        svgs[index].selectAll("text").interrupt();
        let category = skillMap[index];
        layouts[index]
            .stop()
            .words(category.words)
            .rotate((d, i) => ((i !== 0) ? (Math.round(Math.random()) * 0) : 0))
            .on("end", (words) => {
                redrawWords(words, index, 'cloud');
            })
            .start();
    }

    if (index === undefined) {
        skillMap.forEach((category, index) => {
            transformToCloud(index);
        });
    } else {
        transformToCloud(index);
    }
}

window.SwitchToRandomScatter = function (index) {
    window.currentState = 'scatter';

    setTimeout(()=>{
        $switchContainer.removeClass('active');
    }, 600)

    function transofrmToTandom(index) {
        let category = skillMap[index];
        svgs[index].selectAll("text").interrupt();

        svgs[index].size([window.svgWidth, window.svgHeight])
        let words = scatterLayout(category.words);
        redrawWords(words, index, 'scatter');
    }

    if (index === undefined) {
        skillMap.forEach((category, index) => {
            transofrmToTandom(index);
        });
    } else {
        transofrmToTandom(index);
    }
}


window.currentState = 'cloud';

function fontSize(d, i, currentState) {

    let ratio = window.svgWidth / 700;

    let size;

    if(currentState === 'scatter')  {
        if(i === 0) {
           size = 60 * ratio;
        } else {
            // size = d.setSize * ratio;
            size = d.setSize * ratio;
        }
    } else {
        //size = d.setSize * ratio;
        size = d.setSize * ratio;
    }
    return size
}

let $switchContainer
let $trackContainer
$(document).ready(function () {
    skillsInit();
    $(window).resize(function () {
        let $wc = $(".word-cloud").first();
        window.svgWidth = parseInt($wc.width(), 10);
        window.svgHeight = parseInt($wc.height(), 10);

        skillMap.forEach((category, index) => {
            svgs[index] = d3.select("#word-cloud-" + index)
                .attr("width", window.svgWidth - 10)
                .attr("height", window.svgHeight - 10);
        });
        SwitchToRandomScatter();
    });


    $switchContainer = $('.switch');
    $trackContainer = $('.switch-container');
    $trackContainer.on('mousedown touchstart', (event) => {
        $switchContainer.toggleClass('active');

        setTimeout(() => {
            if($switchContainer.hasClass("active")) {
                SwitchToRowLayout();
            } else {
                SwitchToRandomScatter()
            }
        }, 320)

        event.preventDefault();
        return false;
    });
    $switchContainer.on('touchmove', (event) => {
        event.preventDefault();
    })
    $trackContainer.on('touchmove', (event) => {
        event.preventDefault();
    })

    let $labels = $(".skillmap .switch .label");
    $labels.first().click(()=>{
        switchTo('chaos');
        window.gtag('event', 'interact_skillmap', {
            'event_category': 'Skill map interaction',
            'event_label': 'User interacted with skill map',
        });
        return false;
    })
    $labels.last().click(()=>{
        switchTo('organized');
        window.gtag('event', 'interact_skillmap', {
            'event_category': 'Skill map interaction',
            'event_label': 'User interacted with skill map',
        });
        return false;
    })

    function switchTo(state) {

        // User discovered the feature
        $(window).off("scroll",  forciblyOrganize);

        if(state === 'organized') {
            $switchContainer.addClass('active');
            SwitchToRowLayout();
        } else {
            $switchContainer.removeClass('active');
            SwitchToRandomScatter()
        }
    }

    function forciblyOrganize() {
        if(window.currentState !== 'organized') {
            if($(".switch").offset().top - $(".switch .label").height()*4 - window.scrollY < $("h2.attachedHeading").reduce((accumulator, currentValue) => accumulator +  $(currentValue).height(), 0)) {
                $(window).off("scroll",  forciblyOrganize);
                switchTo("organized")
            }
        }

    }
    $(window).on("scroll",  forciblyOrganize);

})
