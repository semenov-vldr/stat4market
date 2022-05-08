import autoprefixer from 'autoprefixer';
import dartSass from 'sass';
import del from 'del';
import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import imagemin from 'gulp-imagemin';
import mqpacker from 'postcss-sort-media-queries';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import server from 'browser-sync';
import stackSprite from 'gulp-svg-sprite';
import svgo from 'imagemin-svgo';
import svgoConfig from './svgo.config.js';

const { src, dest, watch, series, parallel } = gulp;
const optimizeImages = () => imagemin([
    svgo(svgoConfig)
]);
const sass = gulpSass(dartSass);

export const buildStyles = () => src('source/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
        mqpacker(),
        autoprefixer()
    ]))
    .pipe(dest('build/css'));

export const buildSprite = () => src('source/sprite/**/*.svg')
    // .pipe(optimizeImages())
    .pipe(dest('build/img/icons'))
    .pipe(stackSprite({ mode: { stack: true } }))
    .pipe(rename('sprite.svg'))
    .pipe(dest('build/img'));

export const copyImages = () => src('source/img/**/*.svg')
    .pipe(optimizeImages())
    .pipe(dest('build/img'));

export const copyStatic = () => src('source/static/**/*')
    .pipe(dest('build'));

export const cleanDestination = () => del('build');

export const reload = (done) => {
    server.reload();
    done();
};

export const startServer = (done) => {
    server.init({
        cors: true,
        server: 'build',
        ui: false
    });

    watch('source/sprite/**/*.svg', series(buildSprite, reload));
    watch('source/img/**/*.svg', series(copyImages, reload));
    watch('source/static/**/*', series(copyStatic, reload));
    watch('source/scss/**/*.scss', series(buildStyles, reload));

    done();
};

export const build = series(cleanDestination, parallel(buildStyles, buildSprite, copyImages, copyStatic));
export default series(build, startServer);
