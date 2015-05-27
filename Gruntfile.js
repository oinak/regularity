module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            all: ["Gruntfile.js", "lib/**/*.js", "spec/**/*.js"],
            options: {
                /* See http://jshint.com/docs/options */
                node: true,
                jasmine: true
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
};
