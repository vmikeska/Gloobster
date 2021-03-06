﻿/// <binding ProjectOpened='default' />

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    sizereport = require('gulp-sizereport'),
    ghtmlSrc = require('gulp-html-src'),
    print = require('gulp-print'),
    resources = require('gulp-resources'),
    gulpif = require('gulp-if'),
    fs = require("fs"),
    project = require("./project.json");


var webroot = "./" + project.webroot + "/";
var jsBuildPath = webroot + "jsb/";

var scssPath = webroot + "scss/**/*.scss";
var scssDest = webroot + "css";

function getVersion() {
    var verFilePath = webroot + "../ScriptsVersion.cs";    
    var verFile = fs.readFileSync(verFilePath, "utf8");
    var verPrms1 = verFile.split(" ");
    var verPrms2 = verPrms1[verPrms1.length - 1].split(";");
    var version = parseInt(verPrms2[0]);

    //var newVersion = version + 1;
    //var newTxt = "namespace Gloobster.Portal { public class ScriptsVersion { public static int Version = " + newVersion + ";}}";
    //fs.writeFileSync(verFilePath, newTxt, "utf8");
    
    return version;
}

var version = getVersion();


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
            i: "PortalUser/Detail",
            o: "userDetail"
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
            i: "Wiki/ScriptsUser",
            o: "wikipageuser"
        },
        {
            i: "Wiki/ScriptsAdmin",
            o: "wikipageadmin"
        },
        {
            i: "Wiki/Home",
            o: "wikihome"
        },
        {
            i: "TravelB/Home",
            o: "tb"
        },
        {
            i: "Deals/Scripts",
            o: "deals"
        },
        {
            i: "Dashboard/Dashboard",
            o: "dashboard"
        },
        {
            i: "Dashboard/Calendar",
            o: "calendar"
        }

        
        
    ];

gulp.task("scssBuild", function () {
    gulp.src(scssPath)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(scssDest));
});

gulp.task("default", function () {
    gulp.watch(scssPath, ["buildStyles"]);    
});

gulp.task("cleanScripts", function () {
    return gulp.src(jsBuildPath + "*.*", { read: false })
      .pipe(clean());
});

gulp.task("buildJsFromPages", ["cleanScripts"], function () {

    function buildOne(d) {
        var srcFileName = webroot + "../Views/" + d.i + ".cshtml";
        var destFileName = jsBuildPath + d.o + "-" + version +  ".js";
        console.log("building from: " + srcFileName + " to: " + destFileName);

        return gulp.src(srcFileName)
            .pipe(resources({ src: false, cwd: webroot, name: d.o }))
            .pipe(print())
            .pipe(concat(destFileName))
            .pipe(uglify())
            .pipe(gulp.dest("."));
    }



    data.forEach(function(d) {
        buildOne(d);
    });

});

var css = webroot + "css/**/*.css";
var concatCssDest = webroot + "cssb/main.min.css";


gulp.task("minCss", function () {
    gulp.src([css])
        .pipe(concat(concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("buildStyles", ["scssBuild", "minCss"]);









//function includeLib(path) {
//    return webroot + "lib/" + path;
//}

//function includeJs(path) {
//    return webroot + "js/" + path;
//}

//function excludeJs(path) {
//    var val = "!" + webroot + "js/" + path;
//    console.log("Excluding: " + val);
//    return val;
//}




//var js = webroot + "js/**/*.js";
//var minJs = webroot + "js/**/*.min.js";


//gulp.task("min", ["min:js", "min:css"]);

//gulp.task("clean", ["clean:js", "clean:css"]);
//gulp.task("clean:css", function (cb) {
//    rimraf(paths.concatCssDest, cb);
//});

//NOTES
//.pipe(sizereport());
//.pipe(print());


//gulp.task("cleanJsBuild", function (cb) {
//    rimraf(paths.concatJsDest, cb);
//});


//gulp.task("min:js", function () {
//    gulp.src([
//        paths.js,
//        includeLib("jquery/dist/jquery.js"),
//        includeLib("jquery-ui/jquery-ui.js"),
//        includeLib("js-cookie/src/js.cookie.js"),

//        excludeJs(paths.minJs),
//        excludeJs("Common/CountryShapes.js"),
//        excludeJs("Common/UsStates.js")
//       ],
//        { base: "." })

//        .pipe(concat(paths.concatJsDest))
//        .pipe(uglify())
//        .pipe(gulp.dest("."));
//});


//gulp.task("jsm-copy", function () {
//    gulp.src([
//        includeLib("webGlEarth-api.js"),
//        includeLib("mapbox.js")    
//    ])
//    .pipe(gulp.dest(jsBuildDir("")));
//});