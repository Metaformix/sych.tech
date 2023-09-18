const container = document.getElementById('smtpe');

if(window.scrollY < container.clientHeight) {

    $(document).ready(function () {

        container.classList.remove('noexpand-height');

        const $container = $(container);

        let begin = 0;
        // Step 1: Expand height to 100vh
        /*
        setTimeout(() => {
            container.addClass('expand-height');
        }, begin+=500);
        */

        // Step 2: Stretch lines
        setTimeout(() => {
            $container.addClass('stretch-lines');
        }, begin += 500);

        // Step 3: Reverse stretching of lines
        setTimeout(() => {
            $container.removeClass('stretch-lines');
            $container.addClass('stretch-lines-back');
        }, begin += 500);

        // Step 4: Reverse stretching of lines
        setTimeout(() => {
            $container.removeClass('stretch-lines-back');
        }, begin += 500);

        // Step 5: Return to original height
        setTimeout(() => {
            $container.addClass('noexpand-height');
        }, begin += 500);


        setTimeout(() => {
            navigationInit();
        }, begin += 100);


    });
} else {
   // container.classList.remove('noexpand-height');
    setTimeout(() => {
        navigationInit()
    }, 100);

   // container.classList.remove('noexpand-height');
    setTimeout(() => {
        navigationInit()
    }, 300);
}
