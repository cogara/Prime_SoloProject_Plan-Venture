module.exports = function(grunt) {

  grunt.initConfig({

    // jshint: {
    //   files: ['Gruntfile.js', 'public/scripts/*.js', 'routes/*.js']
    // },
    watch: {
      files: ['client/*.js'],
      tasks: ['copy']
    },
    copy: {
      main: {
        files: [
          // makes all src relative to cwd
          // {expand: true, cwd: 'node_modules', src: ['angular/**', 'bootstrap/**', 'angular-route/**', 'angular-ui-router/**'], dest: 'public/vendor'},
          {expand: true, src: ['client/*.js'], dest: 'public/scripts'}
        ],
      },
    },
    uglify: {
     my_target: {
      //  options: {
      //    mangle: true
      //  },
       files: {
         'public/scripts/client.min.js': ['client/*.js']
       }
     }
   }
  });

  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['copy', 'uglify', 'watch']);

};
