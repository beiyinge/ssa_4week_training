
menuApp.controller('MyCtrl',['Upload','$window','$scope',function(Upload,$window,$scope){
    var vm = this;
	var user = getCookie("UserName");
    console.log("dialog upload"+user);
    vm.submit = function(){ //function to call on form submit
	var receivername= $scope.displayName;
    var msg=$scope.msg;
	var chatvalue=$scope.directmsg;
	console.log("uploadfile ctrl:" +receivername +" "+user);
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file, user,receivername,msg,chatvalue); //call upload function
        }
    }
    
    vm.upload = function (file,users,receiver,msg,chatvalue) {
		console.log(users +" "+receiver+" "+msg);
        Upload.upload({
			method: 'POST',
            url: '/Cupload/', //webAPI exposed to upload the file
            data:{
					file:file,
					users: users,
                    receiver:receiver,
                    msg:msg,
					chatvalue:chatvalue
			} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
				
                //$window.alert('Success ' + resp.config.data.file.name + ' uploaded. Response: ');
                var newMessage = {					
                    SENDER: users,
                    DATE: new Date().toString(),
                    MESSAGE: msg,
					FileName:resp.config.data.file.name
                };
				if (chatvalue === 'channel'){
					 $scope.channelChats.push(newMessage);}
				else if(chatvalue === 'direct'){
					 $scope.messages.push(newMessage);
				}
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);
