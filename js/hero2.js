let xSpacing = 40;
let waveLength;
let amplitude;
let theta = 0;
let yvalues;

function setup() {
    let cnv = createCanvas(windowWidth, windowWidth * 0.25);
    cnv.parent('canvasContainer');

    waveLength = width / 64;
    amplitude = height / 3;  // Увеличиваем амплитуду для больших "прыжков"
    yvalues = new Array(128);
}

function draw() {
    //if(Math.floor(Math.random() * 30)===5) {
    background(255);
    //}
    calcWave();
    renderWave();
}

let lastChange = 0
function calcWave() {
    if(Math.floor(Math.random() * 30)===5) {
        if(frameCount - lastChange > 50) {
            lastChange = frameCount
            waveLength = (16 + Math.floor(Math.random() * 20))
            xSpacing = waveLength * 1.7
        }
    }

    theta += 0.10;  // Увеличиваем скорость волны
    let x = theta;
    for (let i = 0; i < yvalues.length; i++) {
        yvalues[i] = sin(x) * amplitude;
        x += (TWO_PI / waveLength);
    }
}

function renderWave() {
    noStroke();

    for (let x = 0; x < yvalues.length; x++) {
        let colorBits = [
            (x + frameCount) % 255,
            150,
            255 - (x % 255)
        ];

        fill(
            colorBits[0],
            colorBits[1],
            colorBits[2],
            150
        );  // Динамическое изменение цвета

        ellipse(x * xSpacing, height / 2 + yvalues[x], 64, 64);
    }
}

