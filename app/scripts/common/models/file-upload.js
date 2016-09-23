'use strict';

angular.module('dmc.model.fileUpload', ['dmc.data'])
    .service('fileUpload', ['$http','dataFactory', 'toastModel', function ($http,dataFactory, toastModel) {
        this.uploadFileToUrl = function(file, data, type, callbackUploadPicture){

          //AWS Upload To Get Temp URL
          var S3Upload = function (file){

            // james.barkley creds (used for testing)
            //make into ENV vars
            var creds = {bucket: '', access_key: '',secret_key: ''};
                // Configure The S3 Object

            AWS.config.update({ accessKeyId: creds.access_key, secretAccessKey: creds.secret_key });

            AWS.config.region = '';


            //Create connection
            var s3 = new AWS.S3({ params: { Bucket:creds.bucket }});

            //If File given
            if(file){
              //Testing
              console.log('file size: ' + file.size);
              console.log('file name: ' + file.name);
              var name = file.name.replace(/%20/g, '-').replace(/ /g, '-');
              console.log('file name: ' + file.name, name);

              //File Size Check
              if(file.size > 10585760) {
                toastModel.showToast('error','Sorry, file size must be under 10MB');
                return null;
              }

              //Apply extra business logic to the file.name here
              var params = {Key: name, ContentType: file.type, Body: file, ServerSideEncryption: 'AES256' };
              var s3Url = 'https://s3.amazonaws.com/' + creds.bucket + '/' + params.Key;

              s3.upload(params, function(err, data) {

                    if (err) {
                        // There Was An Error With Your S3 Config
                        toastModel.showToast('error',err.message);
                        callbackUploadPicture(data);
                    }
                    else {
                        //Testing
                        var file = new Object();
                        file['name'] = data.Location;
                        data['file'] = file;
                        console.log('Upload Done'); // Success!
                        toastModel.showToast('success','Upload Done!');
                        console.log('final resource at ' + data.Location);  //Testing
                        callbackUploadPicture(data);
                    }
                }).on('httpUploadProgress',function(progress) {
                    // Log Progress Information
                    console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
                       });
            }//if
            else {
               // No File Selected
               toastModel.showToast('error','No File Selected');
               callbackUploadPicture(null);
            }
        } //end S3Upload

        //Call above function with input file
        var S3url = null;
        S3url = S3Upload(file);
      }
  }]);
