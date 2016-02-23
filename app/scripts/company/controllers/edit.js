'use strict';

var selectedIndexTab = 0;
var isFocused = false;

angular.module('dmc.company')
    .controller('EditStorefrontCompanyCtr', [
        '$stateParams',
        '$state',
        "$scope",
        "$cookies",
        "ajax",
        'companyData',
        'CompanyModel',
        '$location',
        'dataFactory',
        '$mdToast',
        'fileUpload',
        'toastModel',
        '$timeout', function ($stateParams,
                              $state,
                              $scope,
                              $cookies,
                              ajax,
                              companyData,
                              CompanyModel,
                              $location,
                              dataFactory,
                              $mdToast,
                              fileUpload,
                              toastModel,
                              $timeout) {

            $scope.companyData = companyData;
            $scope.selectedIndexTab = selectedIndexTab;
            $scope.onTabSelected = function(tab){
                selectedIndexTab = tab;
            };

            if($scope.companyData && $scope.companyData.id){
                $scope.owner = $scope.companyData.account;


                // auto focus for First Name input
                $timeout(function() {
                    if(!isFocused) {
                        isFocused = true;
                        $("#descriptionCompany").focus();
                    }
                });

                var inputToHtml = function(textInput){
                    return (textInput == null ? null : textInput.trim().replace(/\n/g, '<br>'));
                };
                var htmlToInput = function(textInput){
                    return (textInput == null ? null : textInput.trim().replace(/<br>/g, '\n'));
                };

                $scope.companyData.description = htmlToInput($scope.companyData.description);
                $scope.companyPicture = {
                    'background-image' : (companyData.featureImage && companyData.featureImage.large ? 'url('+companyData.featureImage.large+')' : null)
                };

                $scope.companyId = $stateParams.companyId;
                $scope.page = $state.current.name.split('.')[1];

                $scope.searchModel = $stateParams.text;
                $scope.selectedProductType = $stateParams.product;
                $scope.pageType = null;
                $scope.isSearch = true;
                $scope.currentStorefrontPage = 1;
                $scope.pageSize = 10;
                $scope.downloadData = false;
                $scope.isChangingLogo = false;

                $scope.productTypes = [
                    //{
                    //    name : "all",
                    //    title : "All"
                    //},
                    {
                        name : "services",
                        title : "Services"
                    }
                    //,{
                    //    name : "components",
                    //    title : "Components"
                    //}
                ];

                $scope.changeLogo = function(){
                    $scope.isChangingLogo = true;
                };

                $scope.cancelChangeLogo = function(){
                    $scope.isChangingLogo = false;
                    $scope.flowLogo = null;
                };

                $scope.isChangingPicture = false;
                $scope.currentPicture = null;
                var callbackUploadPicture = function(data){
                    if(!data.error) {
                        $scope.companyData.featureImage.large = data.file.name;
                        if ($scope.companyPicture['background-image']) {
                            toastModel.showToast('success', 'Picture successfully changed');
                        } else {
                            toastModel.showToast('success', 'Picture successfully uploaded');
                        }
                        $scope.companyPicture['background-image'] = 'url(' + companyData.featureImage.large + ')';
                    }else{
                        toastModel.showToast('error', 'Unable upload picture');
                    }
                };

                var callbackUploadLogo = function(data){
                    if(!data.error) {
                        $scope.companyData.logoImage = data.file.name;
                        toastModel.showToast('success', 'Logo successfully uploaded');
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                    }else{
                        toastModel.showToast('error', 'Unable upload logo');
                    }
                };

                $scope.uploadFile = function(flow){
                    $scope.file = flow.files[0].file;
                    fileUpload.uploadFileToUrl($scope.file,{id : $scope.companyId},'company',callbackUploadPicture);
                    $scope.cancelChangePicture(flow);
                };

                $scope.flowLogo = null;
                $scope.uploadLogo = function(){
                    $scope.file = $scope.flowLogo.files[0].file;
                    fileUpload.uploadFileToUrl($scope.file,{id : $scope.companyId},'company-logo',callbackUploadLogo);
                    $scope.cancelChangeLogo();
                };

                $scope.deleteLogo = function(){
                    ajax.on(dataFactory.deleteCompanyLogo($scope.companyId), {
                            logoImage : null
                        }, function(data){
                            $scope.companyData.logoImage = null;
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                        },function(data){
                            toastModel.showToast("error","Error. getFeaturesCompany() fail");
                        },"PATCH"
                    );
                };

                $scope.changePicture = function(){
                    $scope.isChangingPicture = true;
                    apply();
                };

                $scope.cancelChangePicture = function(flow){
                    flow.files = [];
                    if($scope.currentPicture) $scope.companyPicture['background-image'] = $scope.currentPicture;
                    $scope.isChangingPicture = false;
                };

                $scope.prevPicture = null;
                $scope.pictureDragEnter = function(flow){
                    $scope.prevPicture = flow.files[0];
                    flow.files = [];
                };

                $scope.pictureDragLeave = function(flow){
                    if(flow.files.length == 0 && $scope.prevPicture != null) {
                        flow.files = [$scope.prevPicture];
                        $scope.prevPicture = null;
                    }
                };

                $scope.addedNewFile = function(file,event,flow){
                    $scope.flowBoxStyle = {'max-width' : 560};
                    flow.files.shift();
                };

                $scope.addedNewLogo = function(file,event,flow){
                    $scope.flowLogo = flow;
                    flow.files.shift();
                };

                $scope.$watch(function(){
                    return $("#flowImage").attr("src");
                },function(newVal,oldVal){
                    if(newVal && newVal != oldVal){
                        $scope.currentPicture = $scope.companyPicture['background-image'];
                        $scope.companyPicture['background-image'] = 'url(' + newVal + ')';
                    }
                });

                $scope.removePicture = function(flow){
                    flow.files = [];
                    $scope.flowBoxStyle = null;
                    if($scope.currentPicture) $scope.companyPicture['background-image'] = $scope.currentPicture;
                };

                $scope.removeLogo = function(flow){
                    flow.files = [];
                    $scope.flowLogo = null;
                };

                $scope.featuredItems = [];
                $scope.storefrontItems = {arr : [],count : 0};

                var apply = function(){
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
                };

                // callback for services
                var callbackCompanyServices = function(response){
                    for(var index in response.data){
                        response.data[index].type = "service";
                        checkIfFeatured(response.data[index]);
                    }
                    insertData(response.data);
                };

                // callback for components
                var callbackCompanyComponents = function(response){
                    for(var index in response.data){
                        response.data[index].type = "component";
                        checkIfFeatured(response.data[index]);
                    }
                    insertData(response.data);
                };

                // check if storefront item is added to Featured
                var checkIfFeatured = function(item){
                    if(item.company_featured && $.type(item.company_featured) == "array" && item.company_featured.length > 0){
                        var featured = item.company_featured[0];
                        item.featureId = featured.id;
                        item.inFeatured = true;
                        item.position = featured.position;
                    }
                };

                // insert response data to array of storefront items
                var isFirstCallback = true;
                var insertData = function(data){
                    if($scope.selectedProductType == 'all' && !isFirstCallback){
                        $scope.storefrontItems = {
                            arr : $.merge($scope.storefrontItems.arr, data),
                            count : $scope.storefrontItems.arr.length
                        };
                        apply();
                    }else{
                        isFirstCallback = false;
                        $scope.storefrontItems = {
                            arr : data,
                            count : data.length
                        };
                        if($scope.selectedProductType != 'all') apply();
                    }
                };

                var responseData = {
                    _limit : 4,
                    _sort : "id",
                    _order : "DESC",
                    published: true,
                    _start : ($scope.currentStorefrontPage-1)*$scope.pageSize
                };

                // get all services and components
                $scope.getServicesAndComponents = function(){
                    isFirstCallback = true;
                    ajax.get(dataFactory.getCompanyServices($scope.companyId), responseData, callbackCompanyServices);
                    ajax.get(dataFactory.getCompanyComponents($scope.companyId), responseData, callbackCompanyComponents);
                };

                // get all services --------------------------------------------------
                $scope.getServices = function(){
                    isFirstCallback = true;
                    ajax.get(dataFactory.getCompanyServices($scope.companyId), responseData, callbackCompanyServices);
                };

                // get all components --------------------------------------------------
                $scope.getComponents = function(){
                    isFirstCallback = true;
                    ajax.get(dataFactory.getCompanyComponents($scope.companyId), responseData,callbackCompanyComponents);
                };

                // update storefront data
                $scope.update = function(search){
                    $scope.isSearch = search;
                    if($scope.searchModel){
                        responseData.title_like = $scope.searchModel;
                    }else{
                        delete responseData.title_like;
                    }
                    responseData._limit = $scope.pageSize;
                    responseData._start = ($scope.currentStorefrontPage-1)*$scope.pageSize;
                    switch($scope.selectedProductType){
                        case 'all':
                            $scope.getServicesAndComponents();
                            break;
                        case 'services':
                            $scope.getServices();
                            break;
                        case 'components':
                            $scope.getComponents();
                            break;
                        default:
                            break;
                    }
                };
                $scope.update($scope.isSearch);

                $scope.$watch(function() { return $cookies.changedPage; }, function(newValue) {
                    if(parseInt(newValue) > 0 && $scope.currentStorefrontPage !== parseInt(newValue)) {
                        $scope.currentStorefrontPage = newValue; // save new page number
                        $scope.update(true);
                    }
                });

                $scope.updatePageSize = function(val){
                    $scope.pageSize = val;
                    $scope.update(true);
                };

                $scope.productTypeChanged = function (type) {
                    $scope.selectedProductType = type;
                    var dataSearch = $.extend(true,{},$stateParams);
                    dataSearch.product = $scope.selectedProductType;
                    $location.path('/' + dataSearch.companyId + '/edit').search(dataSearch);
                };

                $scope.submit = function(text){
                    $scope.searchModel = text;
                    var dataSearch = $.extend(true,{},$stateParams);
                    dataSearch.text = $scope.searchModel;
                    $location.path(dataSearch.companyId + '/edit').search(dataSearch);
                };

                // save changes
                $scope.changedData = {};

                $scope.changedInput = function(type){
                    $scope.changedData[type] = $scope.companyData[type];
                };

                $scope.cancelChanges = function(){
                    $location.path('/'+$scope.companyId+'/storefront').search({
                        product : 'services'
                    });
                };

                var changedPositions = null; // changed featured positions

                // sortable options for featured
                $scope.sortableOptions = {
                    update: function(e, ui) {
                        getChangedPosition();
                    }
                };

                var getChangedPosition = function(){
                    var data = [];
                    $(".feature-item").each(function(index){
                        if((index + 1) != parseInt($(this).find(".product-card-position").val())) {
                            $(this).find(".product-card-position").val((index + 1));
                            var id = $(this).find(".product-card-featureId").val();
                            data.push({id: id, position: (index + 1)});
                        }
                    });
                    changedPositions = (data.length > 0 ? data : null);
                };

                // save company changes
                $scope.saveChanges = function(){
                    // save new positions
                    if(changedPositions){
                        for(var index in changedPositions){
                            ajax.update(dataFactory.updateCompanyFeaturedPosition(changedPositions[index].id),{
                                position : changedPositions[index].position
                            },function(response){});
                        }
                    }

                    // save changed description
                    var description = inputToHtml($scope.companyData.description);
                    ajax.update(dataFactory.updateCompany($scope.companyId),{
                        description : description
                    },function(response){
                        toastModel.showToast('success','Data successfully changed');
                        $scope.changedData = {};
                        $location.path('/'+$scope.companyId+'/storefront').search({
                            product : 'services'
                        });
                    });
                };

                // get company Featured
                var lastPosition = 0;
                $scope.getFeatured = function () {
                    ajax.get(dataFactory.getCompanyFeatured($scope.companyId), {
                            "_order" : "DESC",
                            "_sort" : "position"
                        },
                        function (response) {
                            var servicesIds = [];
                            var componentsIds = [];
                            var featuredData = response.data;
                            $.each(response.data,function(){
                                if(this.serviceId){
                                    servicesIds.push(this.serviceId);
                                }else{
                                    componentsIds.push(this.componentId);
                                }
                            });
                            ajax.get(dataFactory.getServices(), {
                                id : servicesIds,
                                companyId : $scope.companyId,
                                published: true
                            },function(res){
                                for(var i in featuredData){
                                    for(var j in res.data) {
                                        if (featuredData[i].serviceId == res.data[j].id) {
                                            featuredData[i].service = res.data[j];
                                            break;
                                        }
                                    }
                                }

                                $scope.featuredItems = [];
                                for(var index in featuredData){
                                    if(featuredData[index].position > lastPosition) lastPosition = featuredData[index].position;
                                    var item_ = null;
                                    if(featuredData[index].service){
                                        item_ = featuredData[index].service;
                                        item_.type = "service";
                                    }else if(featuredData[index].component){
                                        item_ = featuredData[index].component;
                                        item_.type = "component";
                                    }
                                    if(item_) {
                                        item_.featureId = featuredData[index].id;
                                        item_.inFeatured = true;
                                        item_.position = featuredData[index].position;
                                        $scope.featuredItems.push(item_);
                                    }
                                }
                                $scope.featuredItems.sort(function(a,b){
                                    return a.position > b.position;
                                });
                                apply();
                            });
                        }
                    );
                };
                $scope.getFeatured();

                // add to featured
                $scope.addFeatured = function(item){
                    lastPosition++;
                    var requestData = {
                        companyId : $scope.companyId,
                        position : lastPosition
                    };
                    if(item.type == "service"){
                        requestData.serviceId = item.id;
                    }else{
                        requestData.componentId = item.id;
                    }
                    ajax.create(dataFactory.addCompanyFeatured(), requestData,
                        function(response){
                            for(var i=0;i < $scope.storefrontItems.arr.length;i++) {
                                if($scope.storefrontItems.arr[i].type == item.type && $scope.storefrontItems.arr[i].id == item.id){
                                    $scope.storefrontItems.arr[i].featureId = response.data.id;
                                    $scope.storefrontItems.arr[i].position = response.data.position;
                                    $scope.storefrontItems.arr[i].inFeatured = true;
                                    $scope.featuredItems.push($scope.storefrontItems.arr[i]);
                                    $scope.featuredItems.sort(function(a,b){
                                        return a.position > b.position;
                                    });
                                    break;
                                }
                            }
                            getChangedPosition();
                            apply();
                        }
                    );
                };

                // remove from featured
                $scope.removeFeatured = function(item){
                    ajax.delete(dataFactory.removeCompanyFeatured(item.featureId),{},
                        function(response){
                            for(var i=0; i < $scope.featuredItems.length; i++){
                                if($scope.featuredItems[i].type == item.type && $scope.featuredItems[i].id == item.id){
                                    $scope.featuredItems.splice(i,1);
                                    break;
                                }
                            }
                            for(var i=0;i < $scope.storefrontItems.arr.length;i++) {
                                if($scope.storefrontItems.arr[i].type == item.type && $scope.storefrontItems.arr[i].id == item.id){
                                    delete $scope.storefrontItems.arr[i].featureId;
                                    delete $scope.storefrontItems.arr[i].position;
                                    delete $scope.storefrontItems.arr[i].inFeatured;
                                    break;
                                }
                            }
                            getChangedPosition();
                            apply();
                        }
                    );
                };

                // disable all links in storefront card
                $("md-tabs").on("click",".product-card a",function(event){
                    event.preventDefault();
                }).on("mouseenter",".product-card a",function(){
                    $(this).attr("href","");
                    $(this).css("cursor","move");
                });
            }
}]);