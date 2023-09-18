const headingSelector = "h2";

let headingStates = Array($(headingSelector).length);

let currentThemeColor = 0;
let currentThemeColorDir = 1;

let headingTopPadding;
let firstHeadingAdd;
let headingHeight;

let viewportHeight;
let viewportMid;

let prevWindowSize = {
    width: window.innerWidth,
    height: window.innerHeight,
};

let $headings;

let x=0;
window.navigationInit = function () {

    $headings = $(headingSelector);
    headingStates = Array($headings.length);

    $headings.css({
        /* opacity: 1, */
        transform: 'translateY(0)',
        top: 0,
        position: 'relative',
        height: 'auto',
    }).removeClass("attachedHeading").removeClass("currentHeading");

    viewportHeight = $(this).height();
    viewportMid = viewportHeight * 0.7;

    headingTopPadding   = parseInt($headings.last().css("padding-top"), 10);
    headingHeight       = Math.ceil($headings.last().height()*0.8);
    $headings.filter(":not(.heading1 h2)").css("height", headingHeight + "px");

    firstHeadingAdd     = Math.ceil($headings.first().height()) - headingHeight;
    $headings.first().css("height", headingHeight + firstHeadingAdd + "px");

    $headings.off("click touchend", clickHandler);
    $headings.each(function (index) {
        let $currentHeading = $(this);
        $currentHeading.parents(".heading,.heading1").css(
            "height", headingHeight + (index===0 ? firstHeadingAdd : 0) + "px"
        )
        $currentHeading.css("z-index", 100-index);

        $currentHeading.on("click touchend", {index: index}, clickHandler);
    });

    $(window).off('scroll', scrollHandler).on('scroll', scrollHandler);
    $(window).trigger('scroll');

};

const clickHandler = function (event) {

    if(!$(this).hasClass("attachedHeading")) return;

    let index = event.data.index;
    window.scrollTo({
        top: index===0 ? 0 :
            ($(this).parents(".heading,.heading1").offset().top -
                headingHeight*(index-1) - firstHeadingAdd + headingTopPadding),
        behavior: "smooth"}
    )

}
const scrollHandler = function () {
    const scrollTop = Math.trunc($(this).scrollTop());

    // Meta theme-color:
    currentThemeColor+= (currentThemeColorDir * 2) ;
    if(currentThemeColor>255) {
        currentThemeColorDir *= -1;
        currentThemeColor = 255
    }
    if(currentThemeColor<1) {
        currentThemeColorDir *= -1;
        currentThemeColor = 1
    }
    const colorCode = currentThemeColor.toString(16).padStart(2, '0');
    $('meta[name="theme-color"]').attr('content', `#${colorCode}${colorCode}${colorCode}`)

    // State of each heading:
    $headings.each(function (index) {
        let $currentHeading = $(this);
        const headingOffset = Math.trunc($currentHeading.parent().offset().top);
        const distanceFromMid = Math.abs(scrollTop + viewportMid - headingOffset);

        if (headingOffset < (scrollTop + viewportMid)) { // Check if heading is above viewport middle
            let moreOffset = index > 0 ? firstHeadingAdd : 0;

            if (headingOffset - scrollTop - headingHeight * index - moreOffset < 0) {
                // Should attach heading to top:
                if(headingStates[index] !== "attachedHeading") {
                    headingStates[index] = "attachedHeading"
                    // Heading is above viewport
                    $currentHeading.css({
                        /* opacity: 1, */
                        transform: 'translateY(0vh) translateZ(calc(var(--cube-size)*2));',
                        position: 'fixed',
                        top: (headingHeight * index + moreOffset) + "px",
                    }).addClass("attachedHeading");
                    vibrate([10])
                    //$('meta[name="theme-color"]').attr('content', "#fff")
                }
            } else {
                // Heading is between viewport mid and viewport top, it should become statid
                if(headingStates[index] !== "static") {
                    headingStates[index] = "static"
                    $currentHeading.css({
                        /* opacity: 1, */
                        position: 'relative',
                        transform: 'translateY(0vh) translateZ(calc(var(--cube-size)*2));',
                        top: 0
                    }).addClass("currentHeading").removeClass("attachedHeading");

                    $headings.slice(0, index).removeClass("currentHeading")
                }
            }

            return true;

        } else if (distanceFromMid < viewportMid) {
            if(index===0) return;

            // Heading is in the phase of showing up
            // const ratio = 1 - distanceFromMid / viewportMid;

            $currentHeading.css({
                /* opacity: Math.pow(ratio, 2), */
                /* transform: 'translateY(' + (50 - ratio * 50) + 'vh)', */
            });

            if(headingStates[index] !== "transitioning") {
                headingStates[index] = "transitioning";
                $currentHeading.css({
                    position: 'relative',
                    top: 0
                }).removeClass("currentHeading");
            }

        } else {
            if(index===0) return;

            // Heading is beyond viewport
            if(headingStates[index] !== "invisible") {
                headingStates[index] = "invisible";
                $currentHeading.css({
                    /* opacity: 0, */
                    transform: 'none'
                });
            }
        }
    });

    if($headings.filter(".currentHeading").length === 0) {
        $headings.filter(".attachedHeading").last().addClass("currentHeading");
    }
}
const vibrate = function(pattern) {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(pattern);
    }
}

$(document).ready(navigationInit);
$(window).resize(function () {

    const currentWindowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const widthDifference = currentWindowSize.width - prevWindowSize.width;
    const heightDifference = currentWindowSize.height - prevWindowSize.height;


    if(Math.abs(widthDifference)>150 || Math.abs(heightDifference) > 150 ) {
        navigationInit();

        prevWindowSize = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }
});
