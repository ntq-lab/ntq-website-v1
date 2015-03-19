'use strict';

var _ = require('lodash');
var path = require('path');
var paths = {
	js: {
		client: [
			'packages/*/public/**/*.js',
			'!packages/*/public/assets/js/libs/**/*.js',
			'!**/logo-data.js'
		],
		server: [
			'packages/*/app.js',
			'packages/*/server/**/*.js',
			'config/**/*.js',
			'server.js',
			'!node_modules/**'
		]
	},
	html: [
		'packages/**/public/**/views/**',
		'packages/**/server/views/**'
	],
	css: [
		'!bower_components/**',
		'packages/**/public/**/css/*.css'
	]
};
var rev;

module.exports = function(grunt) {

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		assets: grunt.file.readJSON('config/assets.json'),
		clean: ['build'],
		watch: {
			js: {
				files: [
					paths.js.client,
					paths.js.server,
					'!build/**'
				],
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			html: {
				files: paths.html,
				options: {
					livereload: true,
					interval: 500
				}
			},
			css: {
				files: paths.css,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			}
		},
		jshint: {
			client: {
				src: paths.js.client,
				options: {
					jshintrc: 'config/rules/.jshintrc-client'
				}
			},
			server: {
				src: paths.js.server,
				options: {
					jshintrc: 'config/rules/.jshintrc-server'
				}
			}
		},
		uglify: {
			core: {
				options: {
					// mangle: false
				},
				files: '<%= assets.js %>'
			}
		},
		csslint: {
			options: {
				csslintrc: 'config/rules/.csslintrc'
			},
			src: paths.css
		},
		cssmin: {
			core: {
				files: '<%= assets.css %>'
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					args: [],
					ignore: ['node_modules/**'],
					ext: 'js,html',
					// nodeArgs: ['--debug'],
					delayTime: 1,
					cwd: __dirname
				}
			}
		},
		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		filerev: {
			min: {
				files: [{
					expand: true,
					cwd: 'build/.tmp',
					src: ['**/*'],
					dest: 'build/public'
				}]
			},
			frontend: {
				files: [{
					expand: true,
					cwd: 'packages/frontend/public/assets/img',
					src: ['**/*'],
					dest: 'build/public/img'
				}]
			},
			backend: {
				files: [{
					expand: true,
					cwd: 'packages/backend/public/assets/img',
					src: ['**/*'],
					dest: 'build/public/img'
				}]
			}
		},
		filerev_assets: {
			min: {
				options: {
					dest: 'build/rev.json',
					cwd: 'build/public'
				}
			}
		},
		copy: {
			frontend: {
				files: [{
					expand: true,
					cwd: 'packages/frontend/public/assets/img',
					src: ['**/*'],
					dest: 'build/public/img'
				}]
			},
			backend: {
				files: [{
					expand: true,
					cwd: 'packages/backend/public/assets/img',
					src: ['**/*'],
					dest: 'build/public/img'
				}]
			},
			common: {
				files: '<%= assets.copy %>'
			},
			replace: {
				options: {
					process: function(content) {
						if (!rev) {
							var summary = grunt.filerev.summary;
							var i = 0;
							var originalPath;
							var revvedPath

							// init values
							rev = {};

							_.forEach(summary, function iterate(revved, original) {

								rev[path.basename(original)] = path.basename(revved);
							});
						}

						_.forEach(rev, function iterate(revved, original) {
							content = content.replace(new RegExp('/' + original, 'g'), '/' + revved);
						});

						return content;
					}
				},
				files: [{
					expand: true,
					cwd: 'build/.tmp',
					src: ['css/**/*.css', 'js/**/*.js'],
					dest: 'build/.tmp'
				}]
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			}
		}
	});

	//Load NPM tasks
	require('load-grunt-tasks')(grunt);

	//Default task(s).
	grunt.registerTask('verify', ['jshint', 'csslint']);

	grunt.registerTask('build', ['verify', 'clean', 'copy:common', 'cssmin', 'uglify', 'filerev:frontend', 'filerev:backend', 'copy:replace', 'filerev:min', 'filerev_assets']);

	grunt.registerTask('default', ['verify', 'copy:common', 'copy:frontend', 'copy:backend', 'concurrent']);

	grunt.registerTask('test', ['env:test', 'concurrent']);
};
