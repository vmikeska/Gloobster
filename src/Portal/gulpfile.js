/// <binding Clean='clean' />

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    sass = require('gulp-sass'),
    sizereport = require('gulp-sizereport'),
    ghtmlSrc = require('gulp-html-src'),
    print = require('gulp-print'),
    resources = require('gulp-resources'),
    gulpif = require('gulp-if'),
    project = require("./project.json");

var paths = {
    webroot: "./" + project.webroot + "/"
};


paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.concatJsDest = paths.webroot + "js/site.min.js";

//gulp.task('test2', function() {
//    return gulp.src(paths.webroot + "../Views/Trip/List.cshtml")
//        .pipe(resources({ src: false, cwd: "C:\\S\\Gloobster\\src\\Portal\\wwwroot" }))
//        .pipe(print())
//        .pipe(concat(jsBuildDir("tripList.js")))
//        .pipe(uglify())
//        .pipe(gulp.dest("."));
//});

gulp.task('buildJsFromPages', function () {

    var data = [
        {
            i: "Trip/Overview",
            o: "tripOverview"
        },
        {
            i: "Trip/Detail",
            o: "tripDetail"
        },
        {
            i: "Trip/Share",
            o: "shareTrip"
        },
        {
            i: "Trip/List",
            o: "tripList"
        },
        {
            i: "Shared/_GlobalScripts",
            o: "globalScripts"
        },
        {
            i: "Friends/List",
            o: "friends"
        },
        {
            i: "Home/Index",
            o: "index"
        },
        {
            i: "Pinboard/Pins",
            o: "pins"
        },
        {
            i: "PortalUser/Settings",
            o: "userSettings"
        },
        {
            i: "PortalUser/Notifications",
            o: "notifications"
        },
        {
            i: "PortalUser/Notifications",
            o: "notifications"
        },
        {
            i: "Wiki/Country",
            o: "wikipage"
        }
        
    ];

    function buildOne(d) {
        return gulp.src(paths.webroot + "../Views/" + d.i + ".cshtml")
            .pipe(resources({ src: false, cwd: "C:\\S\\Gloobster\\src\\Portal\\wwwroot", name: d.o }))
            .pipe(print())
            .pipe(concat(jsBuildDir(d.o + ".js")))
            .pipe(uglify())
            .pipe(gulp.dest("."));
    }

    data.forEach(function(d) {
        buildOne(d);
    });

});

gulp.task('sizereport', function () {
    return gulp.src([
        paths.js,
        excludeJs("Common/CountryShapes.js"),
        excludeJs("Common/UsStates.js")
    ])
    .pipe(sizereport());
});

gulp.task('print', function () {
    gulp.src(paths.webroot + "htmlpage.html")
        .pipe(print());
});

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});


gulp.task("min:js", function () {
    gulp.src([
        paths.js,
        includeLib("jquery/dist/jquery.js"),
        includeLib("jquery-ui/jquery-ui.js"),
        includeLib("js-cookie/src/js.cookie.js"),

        excludeJs(paths.minJs),
        excludeJs("Common/CountryShapes.js"),
        excludeJs("Common/UsStates.js")
       ],
        { base: "." })

        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});


gulp.task("jsm-mapShapes", function () {
    gulp.src([
        includeJs("Common/CountryShapes.js"),
        includeJs("Common/UsStates.js"),
        includeLib("mapbox.js"),
        includeLib("webGlEarth.js")
    ])
    .pipe(concat(jsBuildDir("mapShapes.min.js")))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task("jsm-mapShapes", function () {
    gulp.src([
            includeJs("Common/CountryShapes.js"),
            includeJs("Common/UsStates.js")
        ])
        .pipe(concat(jsBuildDir("mapShapes.js")))
    //.pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task("jsm-copy", function () {
    gulp.src([
        includeLib("webGlEarth-api.js"),
        includeLib("mapbox.js")    
    ])
    .pipe(gulp.dest(jsBuildDir("")));
});


paths.scss = paths.webroot + 'scss/**/*.scss';
paths.scssDest = paths.webroot + 'css';

gulp.task('styles', function () {    
    gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.scssDest));
});

gulp.task("clean", ["clean:js", "clean:css"]);


paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatCssDest = paths.webroot + "css/site.min.css";

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("min:css", function () {
    gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

//Watch task
gulp.task('default', function () {
    gulp.watch(paths.scss, ['styles']);
});

gulp.task("min", ["min:js", "min:css"]);

function jsBuildDir(fileName) {
    var path = paths.webroot + "jsb/" + fileName;
    console.log("writing" + fileName);
    return path;
}

function includeLib(path) {
    return paths.webroot + "lib/" + path;
}

function includeJs(path) {
    return paths.webroot + "js/" + path;
}

function excludeJs(path) {
    var val = "!" + paths.webroot + "js/" + path;
    console.log("Excluding: " + val);
    return val;
}