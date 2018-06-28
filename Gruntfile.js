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
            default: 'dist',
            docs: 'docs/assets'
        },

        sass: {
            default: {
                options: {
                    sourceMap: true,
                },
                files: [{
                    src: 'scss/toggle-checkbox-radio.scss',
                    dest: 'dist/<%= pkg.name %>.css'
                }]
            }
        },

        usebanner: {
            default: {
                options: {
                    banner: '<%= banner %>'
                },
                files: [{
                    src: 'dist/<%= pkg.name %>.css'
                }]
            }
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
            default: {
                options: {
                    sourceMap: true,
                    compatibility: 'ie8',
                    rebase: false
                },
                files: [{
                    src: 'dist/<%= pkg.name %>.css',
                    dest: 'dist/<%= pkg.name %>.min.css'
                }]
            }
        },

        csslint: {
            default: {
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
                files: [{
                    src: 'dist/<%= pkg.name %>.css'
                }]
            }
        },

        postcss: {
            default: {
                options: {
                    map: true,
                    processors: [
                        require('autoprefixer')({
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
                        }),
                    ]
                },
                files: [{
                    src: 'dist/<%= pkg.name %>.css'
                }]
            }
        },

        compress: {
            default: {
                options: {
                    archive: '<%= pkg.name %>-<%= pkg.version %>.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: '**',
                        dest: '<%= pkg.name %>-<%= pkg.version %>/'
                    }, {
                        src: ['LICENSE'],
                        dest: '<%= pkg.name %>-<%= pkg.version %>/'
                    }
                ]
            }
        },

        watch: {
            gruntfile: {
                files: 'Gruntfile.js'
            },
            sass: {
                files: 'scss/*.scss',
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
    grunt.registerTask('build', ['clean:default', 'sass', 'postcss', 'usebanner', 'cssmin']);

    // Copy dist to docs
    grunt.registerTask('docs', ['build', 'clean:docs', 'copy:docs']);

    // Development watch
    grunt.registerTask('dev', ['docs', 'watch']);

    // Full distribution
    grunt.registerTask('dist', ['build', 'compress']);

    // Default task.
    grunt.registerTask('default', ['build']);

};