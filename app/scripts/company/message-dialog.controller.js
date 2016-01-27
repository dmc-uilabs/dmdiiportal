function messageDialogController($scope, $mdDialog, currentUser, owner, ajax, dataFactory,toastModel){
    $scope.owner = owner;
    if(!$scope.owner.displayName){
        $scope.owner.displayName = $scope.owner.firstName + ' ' + $scope.owner.lastName;
    }
    $scope.sendTo = $scope.owner.displayName;

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    var inputToHtml = function(textInput){
        return (textInput == null ? null : textInput.trim().replace(/\n/g, '<br>'));
    };

    $scope.sendMessage = function(){
        var text = inputToHtml($scope.textMessage);
        if(text) {
            ajax.create(dataFactory.createStorefrontMessage(), {
                senderId : currentUser.id,
                recipientId : $scope.owner.id,
                isRead : false,
                senderDelete : false,
                recipientDelete : false,
                text : text,
                created_at : moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
            }, function (data) {
                if (!data.error) {
                    toastModel.showToast("success", "Your message successfully sent!");
                    $scope.cancel();
                } else {
                    toastModel.showToast("error", data.error);
                }
            }, function () {
                toastModel.showToast("error", "Error. sendMessage() fail");
            });
        }else{
            toastModel.showToast("error", "Enter your message.");
        }
    };
};