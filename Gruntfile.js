'use strict';

var paths = {
    js: ['*.js', 'test/**/*.js', '!test/coverage/**', '!bower_components/**', 'packages/**/*.js', '!packages/**/node_modules/**', '!packages/**/public/assets/js/libs/**'],
    html: ['packages/**/public/**/views/**', 'packages/**/server/views/**'],
    css: ['!bower_components/**', 'packages/**/public/**/css/*.css']
};

module.exports = function(grunt) {

    // if (process.env.NODE_ENV !== 'production') {
    //     require('time-grunt')(grunt);
    // }

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assets: grunt.file.readJSON('config/assets.json'),
        clean: ['build'],
        watch: {
            js: {
                files: paths.js,
                tasks: ['jshint', 'build'],
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
                tasks: ['csslint', 'build'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: {
                src: paths.js,
                options: {
                    jshintrc: true
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
                csslintrc: '.csslintrc'
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
            all: {
                files: [{
                    expand: true,
                    cwd: 'build/tmp',
                    src: ['**/*'],
                    dest: 'build/public'
                }]
            },
            img: {
                files: [{
                    expand: true,
                    cwd: 'client/assets/img/',
                    src: [
                        '**/*'
                    ],
                    dest: 'build/public/img/'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: 'build/.tmp/jsmin',
                    src: [
                        '**/*'
                    ],
                    dest: 'build/public/js/'
                }]
            },
            css: {
                files: [{
                    expand: true,
                    cwd: 'build/tmp/cssmin',
                    src: [
                        '**/*'
                    ],
                    dest: 'build/public/css/'
                }]
            }
        },
        filerev_assets: {
            rev: {
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
            }
        }
    });

    //Load NPM tasks
    require('load-grunt-tasks')(grunt);

    //Default task(s).
    grunt.registerTask('verify', ['jshint', 'csslint']);

    grunt.registerTask('build', ['clean', 'cssmin', 'uglify', 'copy', 'filerev:all', 'filerev_assets']);

    grunt.registerTask('default', ['verify', 'build', 'concurrent']);
};
