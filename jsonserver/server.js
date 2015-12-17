#!/usr/bin/env node

var jsonServer = require('json-server');

// Returns an Express server
var server = jsonServer.create();

// Set default middlewares (logger, static, cors and no-cache)
server.use(jsonServer.defaults());

// Returns an Express router
var router = jsonServer.router('db.json');
server.use(router);

server.listen(3000,function(){
    console.log('Created JSON server and Listening on http://localhost:'+3000);
});
