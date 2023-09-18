module.exports = {
    plugins: [
        require('tailwindcss/nesting'),
        require('tailwindcss'),
        require('autoprefixer'),
        require('cssnano')({
            preset: 'default', // You can choose different presets
        }),
    ]
}
