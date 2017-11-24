module.exports = function (grunt) {

    // From TWBS
    RegExp.quote = function (string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' * toggle-checkbox-radio v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        ' *\n' +
        ' * Copyright <%= grunt.template.today(\'yyyy\') %> Alex Do\n' +
        ' * Licensed under <%= pkg.license %> (https://github.com/alexdonh/toggle-checkbox-radio/blob/master/LICENSE)\n' +
        ' */\n',

        // Task configuration.

        clean: {
            css: 'dist',
            docs: 'docs/assets'
        },

        jshint: {
            options: {
                jshintrc: 'js/.jshintrc'
            },
            gruntfile: {
                options: {
                    'node': true
                },
                src: 'Gruntfile.js'
            },
            main: {
                src: 'js/*.js'
            },
            i18n: {
                src: 'js/i18n/*.js'
            }
        },

        less: {
            options: {
                strictMath: true,
                sourceMap: true,
                outputSourceFiles: true,
                sourceMapURL: '<%= pkg.name %>.css.map',
                sourceMapFilename: '<%= less.css.dest %>.map'
            },
            css: {
                src: 'less/toggle-checkbox-radio.less',
                dest: 'dist/<%= pkg.name %>.css'
            }
        },

        usebanner: {
            options: {
                banner: '<%= banner %>'
            },
            src: '<%= less.css.dest %>'
        },

        copy: {
            docs: {
                expand: true,
                cwd: 'dist/',
                src: [
                    '**/*'
                ],
                dest: 'docs/assets/'
            }
        },

        cssmin: {
            options: {
                compatibility: 'ie8'
            },
            css: {
                src: '<%= less.css.dest %>',
                dest: 'dist/<%= pkg.name %>.min.css'
            }
        },

        csslint: {
            options: {
                'adjoining-classes': false,
                'box-sizing': false,
                'box-model': false,
                'compatible-vendor-prefixes': false,
                'floats': false,
                'font-sizes': false,
                'gradients': false,
                'important': false,
                'known-properties': false,
                'outline-none': false,
                'qualified-headings': false,
                'regex-selectors': false,
                'shorthand': false,
                'text-indent': false,
                'unique-headings': false,
                'universal-selector': false,
                'unqualified-attributes': false,
                'overqualified-elements': false
            },
            css: {
                src: '<%= less.css.dest %>'
            }
        },

        autoprefixer: {
            options: {
                browsers: [
                    //
                    // Official browser support policy:
                    // https://v4-alpha.getbootstrap.com/getting-started/browsers-devices/#supported-browsers
                    //
                    'Chrome >= 45', // Exact version number here is kinda arbitrary
                    'Firefox ESR',
                    // Note: Edge versions in Autoprefixer & Can I Use refer to the EdgeHTML rendering engine version,
                    // NOT the Edge app version shown in Edge's "About" screen.
                    // For example, at the time of writing, Edge 20 on an up-to-date system uses EdgeHTML 12.
                    // See also https://github.com/Fyrd/caniuse/issues/1928
                    'Edge >= 12',
                    'Explorer >= 10',
                    // Out of leniency, we prefix these 1 version further back than the official policy.
                    'iOS >= 9',
                    'Safari >= 9',
                    // The following remain NOT officially supported, but we're lenient and include their prefixes to avoid severely breaking in them.
                    'Android >= 4.4',
                    'Opera >= 30'
                ]
            },
            css: {
                options: {
                    map: true
                },
                src: '<%= less.css.dest %>'
            }
        },

        compress: {
            zip: {
                options: {
                    archive: 'toggle-checkbox-radio-<%= pkg.version %>.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: '**',
                        dest: 'toggle-checkbox-radio-<%= pkg.version %>/'
                    }, {
                        src: ['LICENSE'],
                        dest: 'toggle-checkbox-radio-<%= pkg.version %>/'
                    }
                ]
            }
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: 'jshint:gruntfile'
            },
            less: {
                files: 'less/*.less',
                tasks: 'build'
            }
        }
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });

    // Version numbering task.
    // to update version number, use grunt version::x.y.z

    // CSS distribution
    grunt.registerTask('build', ['clean:css', 'less', 'autoprefixer', 'usebanner', 'cssmin']);

    // Copy dist to docs
    grunt.registerTask('docs', ['clean:docs', 'copy:docs']);

    // Development watch
    grunt.registerTask('watch', ['build', 'watch']);

    // Full distribution
    grunt.registerTask('dist', ['build', 'compress']);

    // Default task.
    grunt.registerTask('default', ['build']);

};