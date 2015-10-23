angular.module('inviraChatApp')
    .controller('AuthCtrl', function(Auth, $state) {
        var authCtrl = this;

        authCtrl.user = {
            email: '',
            password: ''
        };

        authCtrl.showNotification = function(message) {
            // create the notification
            var notification = new window.NotificationFx({
                message : '<p>'+message+'</p>',
                layout : 'growl',
                effect : 'scale',
                type : 'error', // notice, warning, error or success
                onClose : function() {

                }
            });

            // show the notification
            notification.show();
        };

        authCtrl.login = function() {
            Auth.$authWithPassword(authCtrl.user).then(function(auth) {
                $state.go('home');
            }, function(error) {
                authCtrl.error = error;
                authCtrl.showNotification(error.message);
            });
        };

        authCtrl.register = function() {
            Auth.$createUser(authCtrl.user).then(function(auth) {
                authCtrl.login();
            }, function(error) {
                authCtrl.error = error;
                authCtrl.showNotification(error.message);
            });
        };

    });
