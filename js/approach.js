const enableCubeClick = false;

const $cube = $('#cube');
let isCubeSate;

let startX, startY;
let isBeingDragged = false;

// These variables store the rotation of the cube during mouse drag.
let mouseRotationX = 0;
let mouseRotationY = 0;


let targetRotationX = -30
let targetRotationY = 0;
let currentRotationX = -30;
let currentRotationY = 0;

let wasEverDragged = false;

$cubeFaces = $('.face');

$cubeFaces
    .on('mouseenter', function () {
        if (isCubeSate) return;
        $(this).addClass('active');
    })
    .on('mouseleave', function () {
        $(this).removeClass('active');
    })

if (enableCubeClick) {
    $cubeFaces.on('click touchend', function () {
        if (!isBeingDragged) {
            $(this).addClass('activeFace');
        }
    });
}


$cube.on('mousedown', () => {
    $(document).on("mousemove", onMouseMove);
    $(document).on("mouseup", onMouseUp);
    $cube.css("cursor", "grabbing");

    window.gtag('event', 'interact_cube', {
        'event_category': 'Cube interaction',
        'event_label': 'User rotated the cube',
    });

    return false;
});

let waitForClickTimeout;
$cube.on('touchstart', () => {
    $(document).on("touchend", onMouseUp);
    waitForClickTimeout = setTimeout(() => {
        $(document).on("touchmove", onMouseMove);
    }, enableCubeClick ? 100 : 10)

    window.gtag('event', 'interact_cube', {
        'event_category': 'Cube interaction',
        'event_label': 'User rotated the cube',
    });

    return false;
});

function onMouseUp() {
    clearTimeout(waitForClickTimeout);
    $(document).off("mousemove mouseup", onMouseMove);
    $(document).off("touchmove touchend", onMouseMove);

    setTimeout(() => {
        isBeingDragged = false;
    }, 10); // Reset the flag after a short delay

    $cube.css("cursor", "grab");

    //$(".face").removeClass("activeFace");

//    return false;
}

function onMouseMove(e) {
    if (!isBeingDragged) {
        if (e.type === "mousemove") {
            startX = e.clientX;
            startY = e.clientY;
        } else if (e.type === "touchmove") {
            startX = e.touches[0].clientX
            startY = e.touches[0].clientY
        }

        mouseRotationX = targetRotationX
        mouseRotationY = targetRotationY
    }

    isBeingDragged = true;
    wasEverDragged = true;
    $(".rotateIndication").removeClass("displayed")

    let deltaX, deltaY;

    if (e.type === "mousemove") {
        deltaX = e.clientX - startX;
        deltaY = e.clientY - startY;

        mouseRotationX -= deltaY * 0.5;
        mouseRotationY += deltaX * 0.5;

    } else if (e.type === "touchmove") {
        deltaX = e.touches[0].clientX - startX;
        deltaY = e.touches[0].clientY - startY;

        mouseRotationX -= deltaY * 0.75;
        mouseRotationY += deltaX * 0.75;

    }

    targetRotationX = mouseRotationX // % 360;
    targetRotationY = mouseRotationY // % 360;

    if (e.type === "mousemove") {
        startX = e.clientX;
        startY = e.clientY;
    } else if (e.type === "touchmove") {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
    }

    //requestAnimationFrame(animate);
    return false;
}

function animate() {

    if (stopObserving || !isCubeSate) {
        requestAnimationFrame(animate);
        return;
    }

    const decay = isBeingDragged ? 0.08 : 0.02;
    const Xchange = (targetRotationX - currentRotationX) * decay + accBeta;
    const Ychange = (targetRotationY - currentRotationY) * decay + accGamma;

    if (Math.abs(Xchange) < 0.0000001 && Math.abs(Ychange) < 0.0000001) {
        requestAnimationFrame(animate);
        return;
    }

    // Lerp (interpolate) towards the target rotation for smoother transitions
    currentRotationX += Xchange;
    currentRotationY += Ychange;

    // Apply the rotation to the cube
    $cube.css("transform", `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`);

    requestAnimationFrame(animate);

}

if (enableCubeClick) {

    function triggerCube() {
        vibrate([10])
        if (!isCubeSate) {
            goCube();
        } else {
            isBeingDragged = false;
            goFlat();
        }
    }


    $cube.on('click', () => {
        if (!isBeingDragged) {
            triggerCube()
        }
    });

    $cube.on('touchend', () => {
        if(isBeingDragged) return;
        triggerCube()
    });

    function goFlat() {

        $cube.addClass("isFlat")

        setTimeout(() => {
            isCubeSate = false;

            $('.front').css("transform", "translateY(0px) rotateX(0deg)");
            $('.back').css("transform", "translateY(0px) rotateX(0deg)");
            $('.left').css("transform", "translateX(0px) rotateX(0deg)");
            $('.right').css("transform", "translateX(0px) rotateX(0deg)");
            $('.top').css("transform", "translateY(0px) rotateX(0deg)");
            $('.bottom').css("transform", "translateY(0px) rotateX(0deg)");

            const originalTransition = $cube.css("transition");
            $cube.css("transition", "none");
            targetRotationX = targetRotationX % 360;
            targetRotationY = targetRotationY % 360;


            $cube.css("transform", `rotateX(${targetRotationX}deg) rotateY(${targetRotationX}deg)`);
            $cube.css("transition", originalTransition);

            const zeroX = (360 - targetRotationX < 180) ? 360 : 0;
            const zeroY = (360 - targetRotationY < 180) ? 360 : 0;

            $cube.animate({rotateX: zeroX + 'deg', rotateY: zeroY + 'deg'}, 300);
        }, 100)

    }
}

function goCube() {
    isCubeSate = true;
    $(".face").removeClass("activeFace");

    requestAnimationFrame(animate);
    $('.front').css("transform", "rotateY(0deg) translateZ(calc(var(--cube-size)/2))");
    $('.back').css("transform", "rotateY(180deg) translateZ(calc(var(--cube-size)/2))");
    $('.left').css("transform", "rotateY(-90deg) translateZ(calc(var(--cube-size)/2))");
    $('.right').css("transform", "rotateY(90deg) translateZ(calc(var(--cube-size)/2))");
    $('.top').css("transform", "rotateX(90deg) translateZ(calc(var(--cube-size)/2))");
    $('.bottom').css("transform", "rotateX(-90deg) translateZ(calc(var(--cube-size)/2))");

    targetRotationX = targetRotationX % 360;
    targetRotationY = targetRotationY % 360;
    $cube.removeClass("isFlat")

}


$(window).on('scroll', function () {
    if (!isCubeSate) return;
    if (isBeingDragged) return;
    if (stopObserving) return;
    const cubeTop = $cube.offset().top

    // Calculate rotation based on scroll position
    targetRotationY += (cubeTop - window.scrollY + 400) * 0.005;
    // requestAnimationFrame(animate);

    if (!wasEverDragged && cubeTop - window.scrollY < 250) {
        $(".rotateIndication").addClass("displayed")
    }
});


let prevBeta = 0;
let prevGamma = 0;
let accBeta = 0;
let accGamma = 0;

window.addEventListener('deviceorientation', function (event) {
    if (!isCubeSate || isBeingDragged || stopObserving) {
        prevBeta = event.beta;
        prevGamma = event.gamma;
        return;
    }
    // event.beta is the rotation around the X-axis (-180 to 180)
    // event.gamma is the rotation around the Y-axis (-90 to 90)

    // Calculate the change in orientation
    const deltaBeta = event.beta - prevBeta;
    const deltaGamma = event.gamma - prevGamma;

    // Update cube rotation based on the change
    targetRotationX += deltaBeta * 2;
    targetRotationY += deltaGamma * 2;

    // Update previous orientation for the next event
    prevBeta = event.beta;
    prevGamma = event.gamma;
});


let stopObserving = false;
const observerCallback = (entries /*, observer*/) => {
    entries.forEach(entry => {
        stopObserving = !entry.isIntersecting;
    });
};

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
observer.observe($cube[0]);

// Got to Cube state
goCube();


