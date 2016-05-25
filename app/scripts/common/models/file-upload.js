'use strict';

angular.module('dmc.model.fileUpload', ['dmc.data'])
    .service('fileUpload', ['$http','dataFactory', 'toastModel', function ($http,dataFactory, toastModel) {
        this.uploadFileToUrl = function(file, data, type, callbackUploadPicture){

            /*var fd = new FormData();
            fd.append('file', file);
            for(var key in data) {
                fd.append(key, data[key]);
            }*/
            //Testing
          console.log("One");

          //AWS Upload To Get Temp URL
          var S3Upload = function (file){

            // james.barkley creds (used for testing)
            //make into ENV vars
            var creds = {bucket: 'dmc-uploads2', access_key: 'AKIAJDE3BJULBHCYEX4Q',secret_key: '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'}

            //Testing
            console.log("Two");

            // Configure The S3 Object
            AWS.config.update({ accessKeyId: creds.access_key, secretAccessKey: creds.secret_key });
            AWS.config.region = 'us-east-1';

            //Create connection
            var s3 = new AWS.S3({ params: { Bucket:creds.bucket }});

            //Testing
            console.log("Three");

            //If File given
            if(file){

              //Testing
              console.log("file size: " + file.size);
              console.log("file name: " + file.name);

              //Size Check
              if(file.size > 10585760) {
                toastModel.showToast('error',"Sorry, file size must be under 10MB");
                return null;
              }
              //Testing
              console.log("Four");


              //Apply extra business logic to the file.name here
              var params = {Key: file.name, ContentType: file.type, Body: file, ServerSideEncryption: 'AES256' };
              var s3Url = 'https://s3.amazonaws.com/' + params.Bucket + '/' + params.Key;

              s3.upload(params, function(err, data) {

                //Testing
                console.log("Five");
                    if (err) {
                        // There Was An Error With Your S3 Config
                        toastModel.showToast('error',err.message);
                        return false;
                    }
                    else {
                        console.log('Upload Done'); // Success!
                        toastModel.showToast('success',"Upload Done!");
                        console.log("final resource at " + s3URL);  //Testing
                    }
                }).on('httpUploadProgress',function(progress) {
                    // Log Progress Information
                    console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
                       });
            }//if
            else {
               // No File Selected
               toastModel.showToast('error',"No File Selected");
               return null;
            }

            return s3Url;
        } //end S3Upload


        //Call above function with input file
        var S3url = null;
        S3url = S3Upload(file);
        //Testing
        console.log("Six");

        //Add to data object
        var file = new Object();
        file["name"] = S3url;
        data["file"] = file;
        /*
        var url = null;
        switch(type){
            case 'account' :
                url = dataFactory.uploadAccountPictureUrl();
                break;
            case 'company' :
                url = dataFactory.uploadCompanyPictureUrl();
                break;
            case 'company-logo' :
                url = dataFactory.uploadCompanyLogoUrl();
                break;
            case 'profile' :
                url = dataFactory.uploadProfilePictureUrl();
                break;
            case 'company-profile' :
                url = dataFactory.uploadCompanyProfileImageUrl();
                break;
            case 'company-profile-skill' :
                url = dataFactory.uploadCompanyProfileSkillImageUrl();
                break;
            case 'service' :
                url = dataFactory.uploadServiceImageUrl();
                break;
            default:
                break;
        }*/
        //Testing
        console.log("Seven");
        //If valid S3 url returned
          if(S3url) {
            //Tests to see if we can get the posted resoruce
              $http.get(S3url)
              .success(function (data) {
                  callbackUploadPicture(data);
              }).error(function (data) {
                  callbackUploadPicture(data);
              });
          }
          else{
              callbackUploadPicture(null);
          }
      }
  }]);
