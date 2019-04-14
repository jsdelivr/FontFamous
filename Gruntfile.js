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
					htmlDemo: false,
					templateOptions: {
						baseClass: 'pr',
						classPrefix: 'pr-'
					},
					customOutputs: [{
						template: './src/font/font-famous-jsdelivr.css',
						dest: './dist/css'
					}]
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
						dest: './docs/',
						removefolder: 'docs/',
						pretty: true,
						prettyimproved: true
					}
				},
				files: [ {
					cwd: './src/content/',
					dest: './docs/',
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
					dest: './docs/',
					src: '!*',
				}]
			},
		},

		copy: {
			main: {
				files: [
					{ expand: true, cwd: 'src/img/', src: [ '**/*' ], dest: 'docs/img/' },
					{ expand: true, cwd: 'src/fonts/', src: [ '**/*' ], dest: 'docs/fonts/' },
					{ expand: true, cwd: 'src/js/', src: [ '**/*' ], dest: 'docs/js/' },
					{ expand: true, cwd: 'src/icons/', src: [ '**/*' ], dest: 'docs/icons/' },
					{ expand: true, cwd: 'docs/', src: [ '**/*.html' ], dest: 'docs/' },
					{ expand: true, cwd: 'src/content/', src: [ '**/_*' ], dest: 'docs/'},
					{ expand: true, cwd: 'src/logos/font/', src: [ '**/*' ], dest: 'docs/logos'},
				],
			},
		},

		less: {
			development: {
				options: {
					paths: [ './docs/css/' ],
					sourceMap: true,
					sourceMapFilename: './docs/css/style.css.map',
					outputSourceFiles: true,
					sourceMapURL: '/docs/style.css.map',
					strictMath: true
				},
				files: {
					'./docs/css/style.css': './src/style/style.less'
				}
			},
			production: {
				options: {
					paths: [ './docs/' ],
					compress: true,
					strictMath: true
				},
				files: {
					'./docs/css/style.css': './src/style/style.less'
				}
			}
		},

		clean: [ 'dist/', 'docs/' ],

		sitemap: {
			dist: {
				homepage:'https://fontfamous.com/',
				pattern: ['docs/**/*.html'],
				siteRoot: './docs/',
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
					dest: 'docs/js'
				} ],
			},
		},
		cssmin: {
			options: {
				sourceMap: true
			},
			target: {
				files: [{
					expand: true,
					cwd: './dist/css',
					src: ['*.css'],
					dest: './dist/css',
					ext: '.min.css'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-assemble');
	grunt.loadNpmTasks('assemble-less');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
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
	grunt.registerTask('jsdelivrcss', function() {
		var fs = require('fs');
		var css = fs.readFileSync('./dist/css/font-famous-jsdelivr.css', "utf8");

		css = css.replace(/\.\.\//g, '/');

		fs.writeFileSync('./dist/css/font-famous-jsdelivr.css', css);
	});
	grunt.registerTask('default', [ 'clean', 'initLogos', 'assemble', 'less:development','sitemap', 'copy', 'webfont', 'jsdelivrcss', 'cssmin', 'connect' ]);
	grunt.registerTask('build', [ 'clean', 'initLogos', 'assemble', 'less','sitemap', 'copy', 'webfont', 'cssmin', 'jsdelivrcss', 'uglify:production' ]);
};
