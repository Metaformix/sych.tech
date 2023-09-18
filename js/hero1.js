let shapes = [];
let numShapes = 10;

function setup() {
    let cnv = createCanvas(windowWidth, windowWidth * 0.25);
    cnv.parent('canvasContainer');

}

// Draw function
function draw() {
    background(220);

    // Define number of shapes and their properties
    const numShapes = 5;
    const shapeSize = 100;
    const spacing = width / (numShapes + 1);

    // Loop through each shape
    for (let i = 1; i <= numShapes; i++) {
        // Calculate the x position of the shape
        const x = spacing * i;

        // Calculate the y position based on mouse movement
        const y = map(mouseY, 0, height, 0, height - shapeSize);

        // Calculate the rotation angle based on mouse movement
        const rotation = map(mouseX, 0, width, 0, TWO_PI);

        // Set color and stroke for the shape
        fill(i * 50);
        stroke(255);

        // Draw the shape
        push();
        translate(x, y);
        rotate(rotation);
        square(0, 0, shapeSize);
        pop();
    }
}
