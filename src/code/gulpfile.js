'use strict';

const gulp = require('gulp');
var sass = require('gulp-dart-sass');

const website = require('./index')({path: '../'});

// tag::hbs-partials[]
const HANDLEBARS_PARTIALS = [
  {key: '_page_header', path: 'src/templates/_page_header.hbs'},
  {key: '_page_footer', path: 'src/templates/_page_footer.hbs'},
  {key: '_html_footer', path: 'src/templates/_html_footer.hbs'},
  {key: '_html_header', path: 'src/templates/_html_header.hbs'},
];
// end::hbs-partials[]

gulp.task('articles-indexing', () =>
  gulp.src('src/articles/**/*.adoc')
      .pipe(website.readAsciidoc())
      .pipe(website.convertToHtml())
      .pipe(website.convertToJson('articlesindex.json'))
      .pipe(gulp.dest('build/.tmp'))
);

gulp.task('articles-rss', () =>
  gulp.src('build/.tmp/articlesindex.json')
      .pipe(website.readIndex())
      .pipe(website.convertToRss('articles.xml'))
      .pipe(gulp.dest('build/docs/rss'))
);

gulp.task('articles-list', () =>
  gulp.src('build/.tmp/articlesindex.json')
      .pipe(website.readIndex())
      .pipe(website.convertToArticlesList('src/templates/site.hbs', HANDLEBARS_PARTIALS, 'site.html', 1))
      .pipe(gulp.dest('build/docs'))
);

gulp.task('articles-page', (cb) => {
  gulp.src('src/articles/**/*.adoc')
      .pipe(website.readAsciidoc())
      .pipe(website.convertToHtml())
      .pipe(website.highlightCode({selector: 'pre.highlight code'}))
      .pipe(
        website.convertToArticlesPage('src/templates/site.hbs', HANDLEBARS_PARTIALS, 'build/.tmp/articlesindex.json'))
      .pipe(gulp.dest('build/docs/articles'))
      .on('end', () => cb())
});

gulp.task('articles', gulp.series('articles-indexing', 'articles-page', 'articles-list', 'articles-rss'), cb => cb());

// html task:
gulp.task('html-indexing', () =>
  gulp.src(`src/html/**/*.html`)
      .pipe(website.readHtml())
      .pipe(website.convertToJson('pageindex.json'))
      .pipe(gulp.dest('build/.tmp')));

gulp.task('html-template', () =>
  gulp.src(`src/html/**/*.html`)
      .pipe(website.readHtml())
      .pipe(website.applyTemplate(`src/templates/site.hbs`, HANDLEBARS_PARTIALS))
      .pipe(gulp.dest('build/.tmp'))
      .pipe(gulp.dest('build/docs')));

gulp.task('html', gulp.parallel('html-indexing', 'html-template'));

// assets task:
gulp.task('404page', () =>
  gulp.src(`src/404/404.html`)
      .pipe(gulp.dest('build/.tmp'))
      .pipe(gulp.dest('build/docs')));
      
gulp.task('img', () =>
  gulp.src(`src/img/**/*`)
      .pipe(gulp.dest('build/.tmp/img'))
      .pipe(gulp.dest('build/docs/img')));

gulp.task('css', () =>
  gulp.src(`src/css/**/*`)
      .pipe(gulp.dest('build/.tmp/css'))
      .pipe(gulp.dest('build/docs/css')));

gulp.task('sass', function () {
  return gulp.src(`src/sass/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'));
});

gulp.task('js', () =>
  gulp.src(`src/js/**/*`)
      .pipe(gulp.dest('build/.tmp/js'))
      .pipe(gulp.dest('build/docs/js')));

gulp.task('assets', gulp.parallel('404page', 'img', 'css', 'js'));

gulp.task('sitemap', () =>
  gulp.src(['build/.tmp/articlesindex.json', 'build/.tmp/pageindex.json'])
      .pipe(website.readIndex())
      .pipe(website.convertToSitemap())
      .pipe(gulp.dest('build/docs'))
);

gulp.task('check', () =>
  gulp.src([ // We must have a articles index page
             'build/.tmp/articlesindex.json',
             // We must have a page index page
             'build/.tmp/pageindex.json',
             // We must have a RSS file
             'build/docs/rss/articles.xml',
             // We must have a site map
             'build/docs/sitemap.xml',
             // We must have an HTML page generated
             'build/docs/index.html',
             // We must have an 404 HTML page generated
             'build/docs/404.html',
             // We must have an pure teplate page generated
             'build/docs/site.html'
           ])
      .pipe(website.extVerifyFiles())
      .pipe(gulp.dest('build/check'))
);

gulp.task('default', gulp.series('assets', 'articles', 'html', 'sitemap', 'check'), cb => cb());
