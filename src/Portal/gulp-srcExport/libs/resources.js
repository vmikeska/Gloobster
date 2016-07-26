var cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    _ = require('lodash'),
    glob = require('glob');

var expandResources = function (resourcePath, opts) {
    
	var resources = undefined;
    var dirs = [];
	
	//init dirs with JS locations
    if (typeof opts.cwd === 'string') {
        dirs.push(path.resolve(opts.cwd));
    } else if (Array.isArray(opts.cwd)) {
        opts.cwd.forEach(function (dir) { dirs.push(path.resolve(dir)); });
    } else if (opts.cwd === undefined) {
		
    } else {
        throw new gutil.PluginError('gulp-resources', 'Unknown type of "cwd".');
    }

	//For each directory to search...
     _.forEach(dirs, function (dir) {
		
		//List files
		var p = path.join(dir, resourcePath);
		resources = glob.sync(p);
		
		//Stop searching if one was found
		if (resources.length > 0) {			            
            return false;
        }
    });

    if (!resources.length && !opts.skipNotExistingFiles) {
        throw new gutil.PluginError('gulp-resources', 'File ' + resourcePath + ' does not exist. Module: ' + opts.name);
    }

    return resources;
};

module.exports = function (htmlContent, opts, contentDir) {
	
    var $ = cheerio.load(htmlContent);
	var resources = [];

	$('script').each(function (i, element) {
        var $element = $(element);

		var isJsScript = $element.attr('type') === "text/javascript";
		var notBuild = $element.data("notbuild");
		
        if (opts.js && $element.is('script') && $element.attr('src') && isJsScript && !notBuild) {
			
			var src = $element.attr('src');			
			var srcLink = expandResources(src, opts, contentDir);
			 
            resources = resources.concat(srcLink);
        }
    });
	
    // $('script,link').each(function (i, element) {
        // var $element = $(element);

        // // if (opts.css && $element.is('link') && ($element.attr('href') || '').indexOf(".css") >= 0) {
            // // resources = resources.concat(expandResources($element.attr('href'), opts, contentDir));
        // // }
        // // if (opts.less && $element.is('link') && ($element.attr('href') || '').indexOf(".less") >= 0) {
            // // resources = resources.concat(expandResources($element.attr('href'), opts, contentDir));
        // // }
        // // if (opts.favicon && $element.is('link') && ($element.attr('rel') || '') === "icon") {
            // // resources = resources.concat(expandResources($element.attr('href'), opts, contentDir));
        // // }
    // });

    return resources;
};
