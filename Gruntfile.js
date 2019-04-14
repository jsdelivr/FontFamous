const port = process.env.PORT || 8000;

module.exports = async function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('./package.json'),

		connect: {
			dev: {
				options: {
					port: port,
					keepalive: true,
					base: './'
				}
			}
		},

		webfont: {
			icons: {
				src: './src/logos/*.svg',
				dest: './dist/font',
				destCss: './dist/css',
				options: {
					font: 'font-famous',
					engine: 'node',
					template: './src/font/template.css',
					autoHint: false,
					syntax: 'bootstrap',
					normalize: true,
					fontFamilyName: 'Font Famous',
					optimize: false,
					types: 'eot,woff2,woff,ttf,svg',
					templateOptions: {
						baseClass: 'pr',
						classPrefix: 'pr-'
					}
				}
			}
		},

		assemble: {
			posts: {
				options: {
					layout: 'default.hbs',
					layoutdir: './src/layouts/',
					partials: './src/partials/**/*.hbs',
					plugins: ['grunt-assemble-sitemap'],
					data: ['./src/font/data.json'],
					sitemap: {
						homepage: 'http://www.fontfamous.com',
						dest: './build/',
						removefolder: 'build/',
						pretty: true,
						prettyimproved: true
					}
				},
				files: [ {
					cwd: './src/content/',
					dest: './build/',
					expand: true,
					src: [ '**/*.hbs', '!$test-from-$target.hbs' ]
				}],
			},
			generated_pages: {
				options: {
					layout: 'default.hbs',
					layoutdir: './src/layouts/',
					partials: './src/partials/**/*.hbs',
					pages: [],
					includeHTML: 'TEST'
				},
				files: [{
					dest: './build/',
					src: '!*',
				}]
			},
		},

		copy: {
			main: {
				files: [
					{ expand: true, cwd: 'src/img/', src: [ '**/*' ], dest: 'build/img/' },
					{ expand: true, cwd: 'src/fonts/', src: [ '**/*' ], dest: 'build/fonts/' },
					{ expand: true, cwd: 'src/js/', src: [ '**/*' ], dest: 'build/js/' },
					{ expand: true, cwd: 'src/icons/', src: [ '**/*' ], dest: 'build/icons/' },
					{ expand: true, cwd: 'build/', src: [ '**/*.html' ], dest: 'build/' },
					{ expand: true, cwd: 'src/content/', src: [ '**/_*' ], dest: 'build/'},
					{ expand: true, cwd: 'src/logos/font/', src: [ '**/*' ], dest: 'build/logos'},
				],
			},
		},

		less: {
			development: {
				options: {
					paths: [ './build/css/' ],
					sourceMap: true,
					sourceMapFilename: './build/css/style.css.map',
					outputSourceFiles: true,
					sourceMapURL: '/build/style.css.map',
					strictMath: true
				},
				files: {
					'./build/css/style.css': './src/style/style.less'
				}
			},
			production: {
				options: {
					paths: [ './build/' ],
					compress: true,
					strictMath: true
				},
				files: {
					'./build/css/style.css': './src/style/style.less'
				}
			}
		},

		clean: [ 'dist/', 'build/' ],

		sitemap: {
			dist: {
				homepage:'https://fontfamous.com/',
				pattern: ['build/**/*.html'],
				siteRoot: './build/',
				changefreq: 'weekly',
				extension: {
					required: false,
				}
			}
		},

		watch: {
			assemble: {
				files: 'src/**/*.hbs',
				tasks: [ 'assemble' ],
				options: {
					debounceDelay: 50,
				},
			},
			copy: {
				files: 'src/{img,fonts,js,icons,content,logos/font}/**',
				tasks: [ 'copy' ],
				options: {
					debounceDelay: 50,
				},
			},
			less: {
				files: 'src/**/*.less',
				tasks: [ 'less:development' ],
				options: {
					debounceDelay: 50,
				},
			},
		},
		uglify: {
			production: {
				files: [ {
					expand: true,
					cwd: 'src/js',
					src: '**/*.js',
					dest: 'build/js'
				} ],
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-assemble');
	grunt.loadNpmTasks('assemble-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sitemap');
	grunt.loadNpmTasks('grunt-webfont');

	grunt.registerTask('initLogos', function(){
		var fs = require('fs');
		var files = fs.readdirSync('./src/logos/');

		console.log('Found ' + files.length + ' logos');

		var logos = {"logos": []};

		files.forEach(function(file) {
			logos.logos.push({"name": file.split('.svg')[0]});
		});

		fs.writeFileSync('./src/font/data.json', JSON.stringify(logos));
	});
	grunt.registerTask('default', [ 'clean', 'initLogos', 'assemble', 'less:development','sitemap', 'copy', 'webfont', 'connect' ]);
	grunt.registerTask('build', [ 'clean', 'initLogos', 'assemble', 'less','sitemap', 'copy', 'webfont', 'uglify:production' ]);
};
