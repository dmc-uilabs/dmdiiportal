// generated on 2015-08-25 using generator-gulp-webapp 1.0.3
'use strict';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import connect from 'gulp-connect-php';
import httpProxy from 'http-proxy';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      // .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  }
};
const lintOptions = {
  'globals': {
    'angular': true
  }
}

const uglifyOptions = {
  'mangle': false
}

gulp.task('lint', lint('app/scripts/**/*.js', lintOptions));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('php', ['styles'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/**/*.php')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify(uglifyOptions)))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.php', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('ngtemplates', () => {
  return gulp.src('app/templates/**/*')
    .pipe(gulp.dest('.tmp/templates'))
    .pipe(gulp.dest('dist/templates'));
});

gulp.task('phpservice', () => {
  return gulp.src('app/static/**/*')
    .pipe(gulp.dest('.tmp/static'))
    .pipe(gulp.dest('dist/static'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/**/*.*',
    '!app/**/*.php'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles'], () => {
    connect.server({
        port: 9001,
        base: 'app',
        open: false
    });
    const proxy = httpProxy.createProxyServer({});

    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: [
                '.tmp',
                'app'
            ],
            routes: { '/bower_components': 'bower_components' },
            middleware: function (req, res, next) {
                const url = req.url;
                if (url.match(/^\/rest\//)) {
                    req.headers["AJP_eppn"]="test1"; //test user eppn
                    req.headers["AJP_givenName"]= "abc";
                    req.headers["AJP_sn"]= "abc";
                    req.headers["AJP_displayName"]= "abc";
                    req.headers["AJP_mail"]= "abc";
                    proxy.web(req, res, { target: 'http://127.0.0.1:8080' });
                } else if (!url.match(/^\/(styles|fonts|bower_components)\//)) {
                    proxy.web(req, res, { target: 'http://127.0.0.1:9001' });
                } else {
                    next();
                }
            }
        }
    });
    // watch for changes
    gulp.watch([
        'app/**/*.php',
        'app/templates/**/*.html',
        'app/templates/**/**/*.html',
        'app/**/*.php',
        'app/scripts/**/*.js',
        'app/images/**/*',
        '.tmp/fonts/**/*'
    ]).on('change', reload);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep','fonts']);
});

gulp.task('serve:dist', () => {
  connect.server({
        port: 9000,
        base: 'dist',
        open: false
  });
  const proxy = httpProxy.createProxyServer({});

  // browserSync({
  //   notify: false,
  //   port: 9000,
  //   server: {
  //     baseDir: ['dist'],
  //   }
  // });
});

gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/**/*.php')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'php', 'images', 'ngtemplates', 'phpservice', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
