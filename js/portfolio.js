function onSwipe($element, swipeCallback) {

    const swipeElement = $element;
    const handleSwipeCallback = swipeCallback;

    let currentSwipeDirection = 'none';
    let touchStartX, touchStartY, touchDeltaX, touchDeltaY;
    let swipeElapsedTime, swipeStartTime;

    const minSwipeDistance = 50;            // Minimum distance required for a swipe gesture
    const maxPerpendicularDistance = 100;   // Maximum allowed perpendicular distance
    const maxSwipeTime = 400;               // Maximum time allowed to complete the swipe

    swipeElement.on('touchstart', function (event) {
        let touchObject = event.changedTouches[0];
        currentSwipeDirection = 'none';
        touchStartX = touchObject.pageX;
        touchStartY = touchObject.pageY;
        swipeStartTime = new Date().getTime();      // Record the time when the touch event started
    });

    swipeElement.on('touchmove', function (event) {
        swipeElapsedTime = new Date().getTime() - swipeStartTime; // Calculate the elapsed time
        if (swipeElapsedTime <= maxSwipeTime && Math.abs(touchDeltaY) < minSwipeDistance) {
            event.preventDefault();        // Check if swipe was completed within the allowed time
            return false; // Prevent scrolling while swiping
        }
        return true;
    });

    swipeElement.on('touchend', function (event) {
        let touchObject = event.changedTouches[0];
        touchDeltaX = touchObject.pageX - touchStartX;  // Horizontal distance traveled during the swipe
        touchDeltaY = touchObject.pageY - touchStartY;  // Vertical distance traveled during the swipe
        swipeElapsedTime = new Date().getTime() - swipeStartTime; // Calculate the elapsed time

        if (swipeElapsedTime <= maxSwipeTime) {         // Check if swipe was completed within the allowed time
            if (Math.abs(touchDeltaX) >= minSwipeDistance && Math.abs(touchDeltaY) <= maxPerpendicularDistance) {
                currentSwipeDirection = (touchDeltaX < 0) ? 'left' : 'right';   // Determine left or right swipe
            } else if (Math.abs(touchDeltaY) >= minSwipeDistance && Math.abs(touchDeltaX) <= maxPerpendicularDistance) {
                currentSwipeDirection = (touchDeltaY < 0) ? 'up' : 'down';      // Determine up or down swipe
            }
        }

        handleSwipeCallback(currentSwipeDirection);

        if (currentSwipeDirection !== 'none') {
            event.stopImmediatePropagation();
        }
        if (currentSwipeDirection === 'right' || currentSwipeDirection === 'left') {
            currentSwipeDirection = "none";
            event.preventDefault();
            return false; // Prevent default behavior for detected swipes
        }
        currentSwipeDirection = "none";
        return false;
    });
}
let activeProjectIndex = -1;
let $projects;

function activateProject() {
    $projects.removeClass("activeProject");
    $($projects[activeProjectIndex]).addClass("activeProject");
}
function projectTouchHandler() {
    activeProjectIndex = $(this).index();
    activateProject();
}
$(document).ready(function () {

    $projects = $(".portfolio .project");

    onSwipe($(".portfolio"), function (swipeDirection) {
        $projects.off('touchend', projectTouchHandler);
        activeProjectIndex = $(".portfolio .project.activeProject").index();

        if (swipeDirection === "left") {
            if (activeProjectIndex === -1) {
                activeProjectIndex = $projects.length - 1;
            } else {
                activeProjectIndex++;
                if (activeProjectIndex >= $projects.length) activeProjectIndex = $projects.length-1;
            }
        }
        if (swipeDirection === "right") {
            if (activeProjectIndex === -1) {
                activeProjectIndex = 0;
            } else {
                activeProjectIndex--;
                if (activeProjectIndex < 0) activeProjectIndex = 0;
            }
        }
        activateProject();
        $projects.on('touchend', projectTouchHandler);
    })

    $projects.on('touchend', projectTouchHandler);


})
