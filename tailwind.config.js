/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        fontSize: {
            // other font sizes...
            'base': '2rem', // Set base font size to 18px
            // ...
        },
        extend: {},
        // ...
    },
    plugins: [
        //        require('flowbite-typography'),
        // ...
    ],
    purge: [
        './*.html',
    ],
}
