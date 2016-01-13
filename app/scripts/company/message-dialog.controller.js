function messageDialogController($scope, $mdDialog, owner, ajax, dataFactory,toastModel){
    $scope.owner = owner;

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
            ajax.on(dataFactory.sendStorefrontMessage(), {
                accountId: $scope.owner.id,
                text: text
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