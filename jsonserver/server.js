#!/usr/bin/env node
var fs = require('fs');
var jsonServer = require('json-server');
var request = require('ajax-request');
// Returns an Express server
var server = jsonServer.create();
// Set default middlewares (logger, static, cors and no-cache)
//server.use(jsonServer.defaults());
server.use(jsonServer.defaults());
// Add this before server.use(router)
server.use(jsonServer.rewriter({
    '/documents/directories/26': '/documentsdirectories',
    '/documents/directories/29': '/documentsdirectoriestwo',
    '/documents/s_directories/26': '/documentsSdirectories',
    '/documents/s_directories/29': '/documentsSdirectories',
    '/documents/versions/:id': '/documentversions',
    '/documents/s_versions/:id': '/documentSversions',
    '/user/createtoken':'/createtoken',
    '/project/:pid/invite/:uid': '/projects_members/:uid',
    '/mark-read-notifications': '/user',
    '/clear-notification/:id': '/user',
    '/projects/all' : '/projects',
    '/projects/public' : '/projects',
    '/projects/my-projects' : '/projects',
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
    '/projects/:id/services' : '/services',
    '/discussions/create' : '/individual-discussion',
    '/tasks/create' : '/tasks',
    '/members' : '/profiles',
    '/my-tasks' : '/tasks',
    '/projects/:projectID/tasks': '/tasks',
    '/my-services' : '/services',
    '/follow-company-services' : '/services',
    '/market/popular_services': '/services',
    '/market/new_services': '/services',
    '/market/services': '/services',
    '/market/components': '/services',
    '/companies/short' : '/companies_short',
    '/companies/:id/new': '/companies/:id/services',
    '/company/follow': '/following_companies',
    '/company/unfollow/:id': '/following_companies/:id',
    '/company_featured/:id/position': '/company_featured/:id',
    '/company_featured/add': '/company_featured',
    '/company_featured/:id': '/company_featured/:id',
    '/projects/:projectId/accept/:memberId': '/projects_members/:memberId',
    '/projects/:projectId/reject/:memberId': '/projects_members/:memberId',
    '/dmdiiMember/events': '/dmdiiMemberEvents',
    '/dmdiiMember/events/:id': '/dmdiiMemberEvents/:id',
    '/dmdiiMember/news': '/dmdiiMemberNews',
    '/dmdiiMember/mapEntry' : '/dmdiiMemberMap',
    '/dmdiiProject/events': '/dmdiiProjectEvents',
    '/dmdiiProject/events/:id': '/dmdiiProjectEvents/:id',
    '/dmdiiProject/news': '/dmdiiProjectNews',
    '/dmdiiprojects/member/active': '/dmdiiprojectsmembersactive',
    '/dmdiiProject/:id': '/dmdiiProjects/:id',
    '/dmdiidocuments/dmdiiProjectId': '/dmdiidocuments',
    '/dmdiidocument/filetype': '/dmdiidocument',
    '/documents/tags': '/document_tags',
    '/resource/lab' : '/resource_labs',
    '/resource/lab/:id':'/resource_labs/:id',
    '/resource/assessment': '/resource_workforce_assessment',
    '/resource/job' : '/resource_workforce_jobs',
    '/resource/course' : '/resource_workforce_courses',
    '/resource/project' :'/resource_projects',
    '/resource/bay/:id' : '/resource_bays/:id',
    '/resource/machine/:id' : '/resource_machines/:id',
    '/user/:id' : '/user-account/:id',
    '/user/save': '/user-account',
    // below is not using the :id field, but instead always returning the organization
    //  info for org 1 (UI Labs)
    '/user/organization/:id': '/userByOrganization',
    '/services/:id/dome-interfaces': '/dome-interfaces',
    '/organizations/myVPC': '/myVPC',
    '/searchworkspace/:id': '/searchworkspace'
    // '/update-user-notification-item/:id' : '/user-notification-items/:id'
}));

server.post('/dmdiidocument', function(req,res) {
  console.log('request',req)
  res.jsonp(req.query)
})

server.post('/model_run', function(req,res) {
  res.jsonp({"runId":9999})
})

var modelPollCount = 0
server.get('/model_poll/:id', function(req,res) {
  modelPollCount++
  if (modelPollCount < 5) {
    res.jsonp({"outParams":{},"status":0})
  } else {
    res.jsonp({"outParams":{"outputFile":{"type":"String","name":"outputFile","unit":"","category":null,"value":"https://psubucket01.s3.amazonaws.com/TDP_1496950468.zip?Signature=KcDIjOLmMxU9oVFcGOQbZxliEfs%3D&Expires=1498160069&AWSAccessKeyId=AKIAJAPMB5APBIC6STKQ","parameterid":"20984","instancename":null},"outputTemplate":{"type":"String","name":"outputTemplate","unit":"","category":null,"value":"<div class=\"project-run-services padding-10\" ng-if=\"!runHistory\" layout=\"column\">          <style>            #custom-dome-UI {             margin-top: -30px;           }          </style>            <div id=\"custom-dome-UI\">             <div layout=\"row\" layout-wrap style=\"padding: 0px 30px\">               <h2>Technical Data Package Created Successfully:</h2>               <p><a href=\"{{outputFile}}\">{{outputFile}}</a></p>             </div>           </div>        </div>   <script> </script>","parameterid":"20985","instancename":null}},"status":1})
  }
})

server.get('/dmdiiMember', function (req, res) {
  var membersOrig = JSON.parse(fs.readFileSync('stubs/dmdiiMember.json'));
  var membersData = membersOrig;

  var page = parseInt(req.query.page)
  var size = parseInt(req.query.pageSize)
  var start = page*size
  var end = (page+1)*size

  membersOrig = {"count": membersData.length ,"data" : membersData.slice(start,end) }

  res.jsonp(membersOrig)
})

server.get('/projects_tags', function (req, res) {
  var projectTags = JSON.parse(fs.readFileSync('stubs/project_tags.json'));
  res.jsonp(projectTags)
})

server.get('/projects/:projectId', function (req, res) {
  var allProjects = JSON.parse(fs.readFileSync('stubs/projects.json'));
  allProjects = allProjects.content;
  var project = {}

  for (var i = 0; i<allProjects.length; i++) {
    if (allProjects[i].id == req.params.projectId) {
      project = allProjects[i];
      break;
    }
  }
  res.jsonp(project)
})

server.get('/dmdiiprojects', function (req, res) {
  var projectsOrig = JSON.parse(fs.readFileSync('stubs/dmdiiprojects.json'));
  var projectsData = projectsOrig;

  var page = parseInt(req.query.page)
  var size = parseInt(req.query.pageSize)
  var start = page*size
  var end = (page+1)*size

  // projectsOrig = {"count": projectsData.length ,"data" : projectsData.slice(start,end) }
  projectsOrig = {"count": projectsData.length ,"data" : projectsData }

  res.jsonp(projectsOrig)
});

server.post('/services', function(req,res) {
 res.jsonp({"id":906,"companyId":"1","title":"K Max","description":"The formula used is Kmax = BetaFactor * AppliedLoad / (Thickness * math.sqrt(SpecimenWidth.getValue())). The four inputs are BetaFactor (no unit), AppliedLoad (Newton), SpecimenWidth (meter), and Thickness (meter). The output is Kmax (pascal square root meter).",
 "owner":"269","profileId":"269","releaseDate":"2017-01-21",
 "serviceType":"Fundamental Calculations - Fracture Mechanics","tags":[],"specifications":"/services/3/specifications",
 "featureImage":{"thumbnail":"","large":""},
 "currentStatus":{"percentCompleted":"0","startDate":"","startTime":""},
 "projectId":"147","from":"marketplace","type":"service","parent":null,"published":false,"averageRun":""})

})

server.patch('/documents/:id/accept', function(req, res) {
    res.jsonp({"result": "success"});
});

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
    }

    if(data["domeServer"]) {

        if(data["domeServer"]="http://localhost:8082/DOMEApiServicesV7" && data["name"]){
          res.json({"status":"success","pkg":{"version":1,"modelId":"aff647da-d82f-1004-8e7b-5de38b2eeb0f","description":"","dateModified":1416699607000,"type":"model","name":"Alpha","path":[30],"children":[{"version":1,"modelId":"aff647da-d82f-1004-8e7b-5de38b2eeb0f","interfaceId":"aff647db-d82f-1004-8e7b-5de38b2eeb0f","type":"interface","name":"Default Interface","path":[30]}]}})
        }

        if(data["domeServer"]="http://localhost:8082/DOMEApiServicesV7" && !data["name"]) {
          res.json({"status":"success","pkg":{"type":"folder","name":"Public","path":[28],"children":[{"type":"folder","name":"Fracture-Mechanics","path":[30]},{"type":"folder","name":"File-Utilities","path":[31]},{"type":"folder","name":"Mathematics","path":[32]}]}})
        }

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
    }
    if(data["name"] && data["name"] == "Default Interface"){
        res.json({"status":"success","pkg":{"interFace":{"version":1,"modelId":"aff647da-d82f-1004-8e7b-5de38b2eeb0f","interfaceId":"aff647db-d82f-1004-8e7b-5de38b2eeb0f","type":"interface","name":"Default Interface","path":[30]},"inParams":{"SpecimenWidth":{"name":"SpecimenWidth","type":"Real","unit":"meter","category":"length","value":3.0,"parameterid":"d9f30f3a-d800-1004-8f53-704dbfababa8"},"CrackLength":{"name":"CrackLength","type":"Real","unit":"meter","category":"length","value":1.0,"parameterid":"d9f30f37-d800-1004-8f53-704dbfababa8"}},"outParams":{"Alpha":{"name":"Alpha","type":"Real","unit":"no unit","category":"no unit","value":0.3333333333333333,"parameterid":"d9f30f3d-d800-1004-8f53-704dbfababa8","instancename":"Alpha"}},"modelName":"Default Interface","modelDescription":"","server":{"name":"localhost","port":"7795","user":"ceed","pw":"ceed","space":"USER"}}})
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

server.post('/service_runs/cancel_run/:id', function(req, res){
  res.jsonp({serviceId: "444",accountId: "0",runBy: "179",status: 2,percentCompleted: 100,startDate: "2017-03-09",startTime: null,project: {id: "87",title: "MRA01"},id: "539",stopDate: "2017-03-09",stopTime: null,interface: {inParams: {Alpha: {type: "Real",name: "Alpha",unit: "no unit",category: "no unit",value: "4",parameterid: "d9f30f56-d800-1004-8f53-704dbfababa8",instancename: null}},outParams: {BetaFactor: {type: "Real",name: "BetaFactor",unit: "no unit",category: "no unit",value: "1370.3879999999997",parameterid: "d9f30f59-d800-1004-8f53-704dbfababa8",instancename: "BetaFactor"}}}})
  // res.sendStatus(500)
  // res.status(403).send("Not authorized to cancel run")
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
