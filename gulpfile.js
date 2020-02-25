const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const csso = require(`gulp-csso`);
const browserSync = require(`browser-sync`).create();
const tinypng = require(`gulp-tinypng-compress`);
const svgSprite = require(`gulp-svg-sprites`);
const webp = require(`gulp-webp`);
const rename = require(`gulp-rename`);
const del = require(`del`);

gulp.task(`browser-sync`, () => {
    browserSync.init({
        proxy: "localhost:8888",
        open: false,
        cors: true
    });
    gulp.watch(`./**/*.scss`, gulp.series(`styles`));
    gulp.watch(`./source/images/*.{png,jpg,jpeg}`, gulp.series(`bitmap`));
    gulp.watch(`./source/images/*.{png,jpg,jpeg}`, gulp.series(`webp`));
    gulp.watch(`./source/images/temp/*.{png,jpg,jpeg}`, gulp.series(`temp`));
    gulp.watch(`./source/images/temp/*.{png,jpg,jpeg}`, gulp.series(`tempWebp`));
    gulp.watch(`./source/images/*.svg`, gulp.series(`vector`));
    gulp.watch(`./source/images/sprite/*.svg`, gulp.series(`sprite`));
    gulp.watch(`./source/fonts/*.{woff, woff2, ttf}`, gulp.series(`fonts`));
    gulp.watch(`./views/**/*.hbs`, gulp.series(`reload`));
    gulp.watch(`./public/scripts/*.js`, gulp.series(`reload`));
});

// SASS -> CSS (Check .scss changes in all folder && compile css)
gulp.task(`styles`, () => {
    return gulp.src(`./source/styles/index.scss`)
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(csso())
        .pipe(rename(`main.min.css`))
        .pipe(gulp.dest(`./public/styles`))
        .pipe(browserSync.stream());
});

// Bitmap images => Tinypng service to optimize
gulp.task(`bitmap`, () => {
    return gulp.src(`./source/images/*.{png,jpg,jpeg}`)
        .pipe(tinypng({
            key: `TQsc1zc45QNBZBD6CC3JrhMTX8hWWW88`,
            sigFile: `./source/images/.tinypng-sigs`,
            summarize: true,
            parallel: true,
            log: true
        }))
        .pipe(gulp.dest(`./public/images`))
        .pipe(browserSync.stream());
});

// Bitmap images => Tinypng service to optimize
gulp.task(`temp`, () => {
    return gulp.src(`./source/images/temp/*.{png,jpg,jpeg}`)
        .pipe(tinypng({
            key: `wNS29BVwd8BM7rkKHQxBKtnLgZHxbM81`,
            sigFile: `./source/images/.tinypng-sigs`,
            summarize: true,
            parallel: true,
            log: true
        }))
        .pipe(gulp.dest(`./public/images/temp`))
        .pipe(browserSync.stream());
});

// Vector images sync
gulp.task(`vector`, () => {
    del.sync(`./public/images/*.svg`);
    return gulp.src(`./source/images/*.svg`)
        .pipe(gulp.dest(`./public/images`));
});

gulp.task('sprite', () => {
    return gulp.src(`./source/images/sprite/*.svg`)
        .pipe(plumber())
        .pipe(svgSprite())
        .pipe(gulp.dest(`./public/images/`));
});

gulp.task('webp', () => {
    return gulp.src('./source/images/*.{png,jpg,jpeg}')
        .pipe(webp())
        .pipe(gulp.dest('./public/images'));
});

gulp.task('tempWebp', () => {
    return gulp.src('./source/images/temp/*.{png,jpg,jpeg}')
        .pipe(webp())
        .pipe(gulp.dest('./public/images/temp'));
});

// Fonts (Copy all fonts to public folder)
gulp.task(`fonts`, () => {
    del.sync(`./public/fonts`);
    return gulp.src(`./source/fonts/*`)
        .pipe(gulp.dest(`./public/fonts`));
});

// Reload browser
gulp.task(`reload`, (done) => {
    browserSync.reload();
    done();
});

// const tasks = [`browser-sync`, `styles`, `fonts`, `bitmap`, `webp`, `temp`, `tempWebp`, `vector`, `sprite`];
const tasks = [`browser-sync`, `styles`];
gulp.task(`default`, gulp.parallel(...tasks));