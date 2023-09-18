const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        // Define your multiple entry points here
        entry: './js/main.js',
        // Add more files as needed
    },
    output: {
        filename: 'main.min.js', // The name of the output bundle files (e.g., file1.bundle.js)
        path: __dirname, // The output directory
    },
    module: {
        rules: [
            // Add any necessary loaders for your JavaScript files
            // For example, babel-loader for ES6+ support
            {
                test: /\.js$/,
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: true,
                },
            }),
        ],
    },
    mode: process.env.NODE_ENV ?? "production"
};
