#!/usr/bin/env node

var jsonServer = require('json-server');

// Returns an Express server
var server = jsonServer.create();
// Set default middlewares (logger, static, cors and no-cache)
//server.use(jsonServer.defaults());
server.use(jsonServer.defaults());
// Add this before server.use(router)
server.use(jsonServer.rewriter({
    '/company_services': '/services',
    '/company_components': '/components',
    '/companies/:id/company_services' : '/companies/:id/services',
    '/companies/:id/company_components' : '/companies/:id/components',
    '/following_discussions' : '/discussions',
    '/follow_people_discussions' : '/discussions',
    '/popular_discussions' : '/discussions',
    '/projects/:id/following_discussions' : '/projects/:id/discussions',
    '/discussions/create' : '/discussions',
    '/tasks/create' : '/tasks',
    '/members' : '/profiles?_embed=profile_reviews',
    '/my-tasks' : '/tasks',
    '/my-services' : '/services',
    '/follow-company-services' : '/services',
    '/market/popular_services': '/services',
    '/market/new_services': '/services',
    '/market/services': '/services',
    '/market/components': '/services',
    '/companies/:id/new': '/companies/:id/services',
    '/company/follow': '/following_companies',
    '/company/unfollow/:id': '/following_companies/:id',
    '/company_featured/:id/position': '/company_featured/:id',
    '/company_featured/add': '/company_featured',
    '/company_featured/:id': '/company_featured/:id'
    // '/update-user-notification-item/:id' : '/user-notification-items/:id'
}));
// Returns an Express router
var router = jsonServer.router('db.json');
server.use(router);

server.listen(3000,function(){
    console.log('Created JSON server and Listening on http://localhost:'+3000);
});
