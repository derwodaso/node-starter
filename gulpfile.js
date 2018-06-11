const gulp = require("gulp");
const ts = require("gulp-typescript");
const npmDist = require("gulp-npm-dist");
const clean = require("gulp-clean");
const sourcemaps = require("gulp-sourcemaps");

gulp.task("clean:dist", function () {
    return gulp.src("./dist")
        .pipe(clean());
});

gulp.task("compile:typescript", ["clean:dist"], function () {
    var tsProject = ts.createProject("tsconfig.json");
    return tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

gulp.task("copy:dependencies", ["compile:typescript"], function () {
    gulp.src([
        "./ormconfig.json"
    ]).pipe(gulp.dest("./dist"));


    // Comment in for production build.
    // return gulp.src(npmDist(), {
    //     base: "./node_modules"
    // }).pipe(gulp.dest("./dist/node_modules"));
});

gulp.task("default", ["copy:dependencies"]);