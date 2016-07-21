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
    '/project/:pid/invite/:uid': '/projects_members/:uid',
    '/mark-read-notifications': '/user',
    '/clear-notification/:id': '/user',
    '/projects/all' : '/projects',
    '/searchProjects' : '/projects',
    '/searchServices' : '/services',
    '/searchComponents' : '/components',
    '/company_services': '/services',
    '/company_components': '/components',
    '/companies/:id/company_services' : '/companies/:id/services',
    '/companies/:id/company_components' : '/companies/:id/components',
    '/following_discussions' : '/individual-discussion',
    '/follow_people_discussions' : '/individual-discussion',
    '/popular_discussions' : '/individual-discussion',
    '/projects/:id/following_discussions' : '/projects/:id/individual-discussion',
    '/projects/create' : '/projects',
    '/discussions/create' : '/individual-discussion',
    '/tasks/create' : '/tasks',
    '/members' : '/profiles',
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
    '/company_featured/:id': '/company_featured/:id',
    '/projects/:projectId/accept/:memberId': '/projects_members/:memberId',
    '/projects/:projectId/reject/:memberId': '/projects_members/:memberId',
    '/dmdiiMember/events': '/dmdiiMemberEvents',
    '/dmdiiMember/news': '/dmdiiMemberNews',
    '/dmdiiMember/mapEntry' : '/dmdiiMemberMap',
    '/dmdiiProject/:id': '/dmdiiProjects/:id',
    '/dmdiiProject/events': '/dmdiiProjectEvents',
    '/dmdiiProject/news': '/dmdiiProjectNews',
    '/documents/tags': '/document_tags',
    '/resource/lab' : '/resource_labs',
    '/resource/lab/:id':'/resource_labs/:id',
    '/resource/assessment': '/resource_workforce_assessment',
    '/resource/job' : '/resource_workforce_jobs',
    '/resource/course' : '/resource_workforce_courses',
    '/resource/project' :'/resource_projects',
    '/resource/bay/:id' : '/resource_bays/:id',
    '/resource/machine/:id' : '/resource_machines/:id'
    // '/update-user-notification-item/:id' : '/user-notification-items/:id'
}));

server.get('/getChildren', function (req, res) {

    var data = (req.query ? req.query : null);
    var url = data.url;
    if(url) {
        delete data.url;
        if (data) {
            if (Array.isArray(data.path)) {
                for (var i in data.path) {
                    data.path[i] = parseInt(data.path[i]);
                }
            } else {
                data.path = [parseInt(data.path)];
            }
        }
        var query = ( data ? '?data=' + JSON.stringify(data) : '');
        request({
            url: url + '/getChildren' + query,
            method: 'GET',
            json: true
        }, function (err, response, body) {
            res.json(body);
        });
    }else{
        res.json({status : "error", msg : "Wrong url"});
    }
});

server.get('/getModel', function(req, res){
    var data = (req.query ? req.query : null);
    var url = data.url;
    if(url) {
        delete data.url;
        if (data) {
            if (Array.isArray(data.path)) {
                for (var i in data.path) {
                    data.path[i] = parseInt(data.path[i]);
                }
            } else {
                data.path = [parseInt(data.path)];
            }
        }
        var query = ( data ? '?data=' + JSON.stringify(data) : '');
        request({
            url: url+'/getModel' + query,
            method: 'GET',
            json: true
        }, function (err, response, body) {
            res.json(body);
        });
    }else{
        res.json({status : "error", msg : "Wrong url"});
    }
});


server.get('/runModel', function(req, res){
    var interface = req.query.interface;
    interface = JSON.parse(interface);
    var url = (req.query.url ? req.query.url : 'http://ec2-52-33-38-232.us-west-2.compute.amazonaws.com:8080/DOMEApiServicesV7');
    request({
        url: url+'/runModel?queue=DOME_Model_Run_TestQueue&data='+JSON.stringify(interface),
        method: 'POST',
        json : true
    }, function(err, response, body) {
        res.json(body);
    });
});

// Returns an Express router
var port = 3000;
var router = jsonServer.router(require('./db'));
router.render = function (req, res) {
    var path = req._parsedUrl.pathname;
    var method = req.method;
    var query = req.query;
    var host = "http://"+req.headers.host;
    switch(path){
        case '/search':
            if(method == "GET"){
                var isGetServices = false;
                var isGetProjects = false;
                //var isGetComponents = false;
                var data = {};
                request({ url: host+"/services", method: 'GET', json : true, data : query }, function(err, response, body) {
                    data.services = body;
                    isGetServices = true;
                    if( isGetServices && isGetProjects ) res.json(data);
                });
                request({ url: host+"/projects", method: 'GET', json : true, data : query }, function(err, response, body) {
                    data.projects = body;
                    isGetProjects = true;
                    if( isGetServices && isGetProjects ) res.json(data);
                });
                //request({ url: host+"/components", method: 'GET', json : true, data : query }, function(err, response, body) {
                //    data.components = body;
                //    isGetComponents = true;
                //    if( isGetServices && isGetProjects && isGetComponents) res.json(data);
                //});
            }else{
                res.json(res.locals.data);
            }
            break;
        default:
            res.json(res.locals.data);
            break;
    }
};
//
//function buildGetServices(res,data,query){
//    var ids = [];
//    for(var i in data) ids.push("serviceId="+data[i].id);
//    request({
//        url: "http://localhost:3000/service_runs?_order=ASC&_sort=status&"+ids.join('&'),
//        method: 'GET',
//        json : true
//    }, function(err, response, body) {
//        for(var i=0;i<data.length;i++){
//            data[i].currentStatus = null;
//            for(var j=0;j<body.length;j++){
//                if(body[j].serviceId == data[i].id){
//                    data[i].currentStatus = body[j];
//                    body.splice(j,1);
//                    break;
//                }
//            }
//            if(!data[i].currentStatus && query.currentStatus_ne == 'null'){
//                data.splice(i,1);
//                i--;
//            }
//        }
//        res.json(data);
//    });
//}

server.use(router);

server.listen(port,function(){
    console.log('Created JSON server and Listening on http://localhost:'+port);
});
