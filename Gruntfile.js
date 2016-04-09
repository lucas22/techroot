module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        watch: {
            grunt: { files: ['Gruntfile.js'] },
            jade: {
                files: '/views/**/*.jade',
                tasks: ['jade']
            }
        },
        jade: {
            compile: {
                options: {
                    pretty: true,
                },
                files: {
                    'public/index.html': 'views/index.jade'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('build', 'Convert Jade templates into html templates', ['jade']);
    grunt.registerTask('default','Convert Jade templates into html templates',
        ['jade','watch']);

};

