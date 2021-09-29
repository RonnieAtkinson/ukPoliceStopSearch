// Require
const { src, dest, watch } = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));

// Settings
const sassConfig = {
    src: './src/stylesheets/main.scss',
    dest: './dist/css',
    output: {
        production: 'compressed',
        development: 'expanded'
    }
}

// Compile SASS (Production)
const compileSass = (cb) => {
    return src(sassConfig.src)
        .pipe(sass({ outputStyle: sassConfig.output.production }).on('error', sass.logError))
        .pipe(dest(sassConfig.dest));
}

// Compile SASS (Development)
const compileSassDev = (cb) => {
    return src(sassConfig.src)
        .pipe(sass({ outputStyle: sassConfig.output.development }).on('error', sass.logError))
        .pipe(dest(sassConfig.dest));
}

// Exports
exports.compileSass = compileSass;
exports.compileSassDev = () => {
    watch('./src/**/*.scss', compileSassDev);
}

// outputStyle
// 'nested'
// 'expanded'
// 'compact'
// 'compressed'