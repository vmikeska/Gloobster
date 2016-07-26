var through = require('through2'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs'),

    resources = require('./libs/resources');

module.exports = function (opts) {
	
    var defineOpt = function (optName, defaultValue) {
        opts[optName] = optName in opts ? opts[optName] : defaultValue;
    };

    opts = opts || {};
    defineOpt('js', true);
    defineOpt('css', true);
    defineOpt('less', true);
    defineOpt('favicon', false);    
    defineOpt('skipNotExistingFiles', false);

    return through.obj(function (file, enc, cb) {
        var content,
            that = this,
            extraсtedResources;

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-resources', 'Streams are not supported!'));
            return cb();
        }
        if (file.isBuffer()) {
			
            content = file.contents.toString('utf8');
			
            try {
				//This was removed, coz .cshtml file dir will be never needed
				// var linksDir = path.dirname(file.path);				
                // extraсtedResources = resources(content, opts, linksDir);
				extraсtedResources = resources(content, opts);
            } catch (ex) {
                this.emit('error', ex);
                return cb();
            }

            extraсtedResources.forEach(function (resource) {
                
                that.push(new gutil.File({
                    base: file.base,
                    cwd: file.cwd,
                    stat: file.stat,
                    path: resource,
                    contents: fs.readFileSync(resource)
                }));
            });
        }
       
        cb();
    });
};
