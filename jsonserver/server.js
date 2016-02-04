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
    '/projects/:id/following_discussions' : '/projects/:id/discussions',
    '/discussions/create' : '/discussions',
    '/tasks/create' : '/tasks',
    '/members' : '/profiles?_embed=profile_reviews',
    '/my-tasks' : '/tasks',
    '/my-services' : '/services'
    // '/update-user-notification-item/:id' : '/user-notification-items/:id'
}));
// Returns an Express router
var router = jsonServer.router('db.json');
server.use(router);

server.listen(3000,function(){
    console.log('Created JSON server and Listening on http://localhost:'+3000);
});
