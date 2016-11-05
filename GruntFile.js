var envify = require("envify/custom");

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'compressed'
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'webroot/scss/',
					src: ['*.scss', '**/*.scss'],
					dest: 'webroot/css/',
					ext: '.css'
				}]
			}
		},
		watch: {
			css: {
				files: [
					'webroot/scss/**/*.scss'
				],
				tasks: ['sass']
			},
			js: {
				files: [
					'webroot/js/src/**/*.js'
				],
				tasks: ['uglify']
			}
		},
		browserify: {
			dev: {
				options: {
					extensions: ['jsx', 'js'],
					transform: [
						[ 'babelify', { presets: [ 'es2015', 'react', 'stage-0' ]} ],
						[ 'sassify', { 'auto-inject': true, base64Encode: false, sourceMap: false } ]
					],
					watch: true,
					keepAlive: true,
					browserifyOptions: {
						paths: [
							'node_modules/',
							'webroot/jsx/',
							'webroot/'
						]
					}
				},
				files: [{
					"expand": true,
					"cwd": "webroot/js/babel/src/",
					"src": ["**/app.jsx"],
					"dest": "webroot/js/babel/dev/",
					"ext": ".js"
				}]
			},
			prod: {
				options: {
					extensions: ['jsx', 'js'],
					transform: [
						[ 'babelify', { presets: [ 'es2015', 'react', 'stage-0' ]} ],
						[ 'sassify', { 'auto-inject': true, base64Encode: false, sourceMap: false } ],
						[ 'envify', { global: true, NODE_ENV: "production" } ],
					],
					watch: true,
					// keepAlive: true,
					browserifyOptions: {
						paths: [
							'node_modules/',
							'webroot/jsx/',
							'webroot/'
						]
					}
				},
				files: [{
					"expand": true,
					"cwd": "webroot/js/babel/src/",
					//"src": "**/*.jsx",
					"src": [
						"**/app.jsx",
					],
					"dest": "webroot/js/babel/prod/",
					"ext": ".js"
				}]
			}

		}
	});
	
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-envify');

	grunt.registerTask('default',['watch']);
}
