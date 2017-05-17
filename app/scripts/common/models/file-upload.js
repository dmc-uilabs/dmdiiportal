'use strict';

angular.module('dmc.model.fileUpload', ['dmc.data'])
    .service('fileUpload', ['$http', '$q', 'dataFactory', 'toastModel', function ($http, $q, dataFactory, toastModel) {
        this.uploadFileToUrl = function(file, data, type, callbackUploadPicture){
            var hasCallback;
            if (!angular.isDefined(callbackUploadPicture)) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                hasCallback = false;
            } else {
                hasCallback = true;
            }
            
          var sanitizeFilename = function (filename){
            /*//////////////////////////////////
            From Amazon documentation:
                Safe characters:
                    alphanumeric chars
                    ! - _ . * ' ( )
                Replace these with url encoding:
                    space
                    ascii 0-31
                    & @ : , $ = + ? ;
                Avoid these:
                    ascii 128-255 (non printable)
                    \ ^ ` > < { } [ ] # % " ~ |
            *////////////////////////////////////
            
            // Remove all non printable ascii characters
            filename = filename.replace(/[^ -~]/g, '');
            
            // Remove special characters
            filename = filename.replace(/[\B\^`><{}\[\]#%"~|]/g, '');
            
            // Replace special characters with url encoding
            filename = filename.replace(/[\s&@:,$=+?;]/g, function(c) {return "%" + c.charCodeAt(0).toString(16);});
            
          }

          //AWS Upload To Get Temp URL
          var S3Upload = function (file){

            // james.barkley creds (used for testing)
            //make into ENV vars
            var creds = {bucket: 'dmcuptemp', access_key: 'AKIAJDFFWFYJAGI4VZOA',secret_key: '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'};

            // Configure The S3 Object
            AWS.config.update({ accessKeyId: creds.access_key, secretAccessKey: creds.secret_key });

            AWS.config.region = 'us-east-1';


            //Create connection
            var s3 = new AWS.S3({ params: { Bucket:creds.bucket }});

            //If File given
            if(file){
              //Testing
              console.log('file size: ' + file.size);
              console.log('file name: ' + file.name);
              //var name = file.name.replace(/%20/g, '-').replace(/ /g, '-');
              var name = sanitizeFilename(file.name);
              console.log('file name: ' + file.name, name);

              //File Size Check
              // if(file.size > 10585760) {
              //   toastModel.showToast('error','Sorry, file size must be under 10MB');
              //   return null;
              // }

              //Apply extra business logic to the file.name here
              var params = {Key: name, ContentType: file.type, Body: file, ServerSideEncryption: 'AES256' };
              var s3Url = 'https://s3.amazonaws.com/' + creds.bucket + '/' + params.Key;

              s3.upload(params, function(err, data) {

                    if (err) {
                        // There Was An Error With Your S3 Config
                        toastModel.showToast('error',err.message);
                        if (hasCallback) {
                            callbackUploadPicture(data);
                        } else {
                            deferred.reject(data);
                        }
                    }
                    else {
                        //Testing
                        var file = new Object();
                        file['name'] = data.Location;
                        data['file'] = file;
                        console.log('Upload Done'); // Success!
                        toastModel.showToast('success','Upload Done!');
                        console.log('final resource at ' + data.Location);  //Testing
                        if (hasCallback) {
                            callbackUploadPicture(data);
                        } else {
                            deferred.resolve(data);
                        }
                    }
                }).on('httpUploadProgress',function(progress) {
                    // Log Progress Information
                    console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
                       });
            }//if
            else {
               // No File Selected
               toastModel.showToast('error','No File Selected');
               if (hasCallback) {
                   callbackUploadPicture(null);
               } else {
                   deferred.reject(null);
               }
            }
        } //end S3Upload

        //Call above function with input file
        var S3url = null;
        S3url = S3Upload(file);
        if (!hasCallback) {
            return promise;
        }
      }
  }]);
