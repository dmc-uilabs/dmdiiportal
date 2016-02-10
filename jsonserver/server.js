#!/usr/bin/env node

var jsonServer = require('json-server');
var request = require('ajax-request');
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



server.get('/getChildren', function (req, res) {

    var data = (req.query ? req.query : null);
    if(data){
        if(Array.isArray(data.path)) {
            for(var i in data.path){
                data.path[i] = parseInt(data.path[i]);
            }
        }else{
            data.path = [parseInt(data.path)];
        }
    }
    var query = ( data ? '?data='+JSON.stringify(data) : '');
    request({
        url: 'http://ec2-52-33-38-232.us-west-2.compute.amazonaws.com:8080/DOMEApiServicesV7/getChildren'+query,
        method: 'GET',
        json : true
    }, function(err, response, body) {
        res.json(body);
    });
});

server.get('/getModel', function(req, res){
    var data = (req.query ? req.query : null);
    if(data){
        if(Array.isArray(data.path)) {
            for(var i in data.path){
                data.path[i] = parseInt(data.path[i]);
            }
        }else{
            data.path = [parseInt(data.path)];
        }
    }
    var query = ( data ? '?data='+JSON.stringify(data) : '');
    request({
        url: 'http://ec2-52-33-38-232.us-west-2.compute.amazonaws.com:8080/DOMEApiServicesV7/getModel'+query,
        method: 'GET',
        json : true
    }, function(err, response, body) {
        res.json(body);
    });
});


server.get('/runModel', function(req, res){
    req.query.interFace = JSON.parse(req.query.interFace);
    req.query.inParams = JSON.parse(req.query.inParams);
    req.query.outParams = JSON.parse(req.query.outParams);
    req.query.server = JSON.parse(req.query.server);

    request({
        url: 'http://ec2-52-33-38-232.us-west-2.compute.amazonaws.com:8080/DOMEApiServicesV7/runModel?queue=DOME_Model_Run_TestQueue&data='+JSON.stringify(req.query),
        method: 'POST',
        data : {
            data : JSON.stringify(req.query),
            queue : 'DOME_Model_Run_TestQueue'
        },
        json : true
    }, function(err, response, body) {
        res.json(body);
    });
});

//localhost:3000/runModel?data={%22interFace%22:{%22version%22:1,%22modelId%22:%22bd85f844-d8f4-1004-8f94-37c24b788523%22,%22interfaceId%22:%22bd85f845-d8f4-1004-8f94-37c24b788523%22,%22type%22:%22interface%22,%22name%22:%22Default%20Interface%22,%22path%22:[31]},%22inParams%22:{%22File_Name%22:{%22name%22:%22File_Name%22,%22type%22:%22String%22,%22unit%22:%22%22,%22value%22:%22%22,%22parameterid%22:%2247f9c164-d877-1004-803b-859f3edcd2e1%22}},%22outParams%22:{%22File_Size%22:{%22name%22:%22File_Size%22,%22type%22:%22Integer%22,%22unit%22:%22no%20unit%22,%22category%22:%22no%20unit%22,%22value%22:0,%22parameterid%22:%2247f9c167-d877-1004-803b-859f3edcd2e1%22,%22instancename%22:%22File_Size%22}},%22modelName%22:%22Default%20Interface%22,%22modelDescription%22:%22%22,%22server%22:{%22name%22:%22localhost%22,%22port%22:%227795%22,%22user%22:%22ceed%22,%22pw%22:%22ceed%22,%22space%22:%22USER%22}}&queue=DOME_Model_Run_TestQueue

// Returns an Express router
var router = jsonServer.router('db.json');
server.use(router);

server.listen(3000,function(){
    console.log('Created JSON server and Listening on http://localhost:'+3000);
});
