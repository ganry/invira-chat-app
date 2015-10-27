angular.module('inviraChatApp')
    .controller('AuthCtrl', function(Auth, $state) {
        var authCtrl = this;

        authCtrl.user = {
            email: '',
            password: ''
        };

        authCtrl.showNotification = function(message) {
            var oldNotification = $('.ns-box');

            if (oldNotification.length > 0)
                oldNotification.hide(200, function() {
                    $(this).remove();
                });


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
            authCtrl.loading = true;
            Auth.$authWithPassword(authCtrl.user).then(function(auth) {
                $state.go('home');
            }, function(error) {
                authCtrl.loading = false;
                authCtrl.error = error;
                authCtrl.showNotification(error.message);
            });
        };

        authCtrl.register = function() {
            authCtrl.loading = true;
            Auth.$createUser(authCtrl.user).then(function(auth) {
                authCtrl.login();
            }, function(error) {
                authCtrl.loading = false;
                authCtrl.error = error;
                authCtrl.showNotification(error.message);
            });
        };

    })
    .directive('laddaLoading', [
        function() {
            return {
                link: function(scope, element, attrs) {
                    var Ladda = window.Ladda;
                    var ladda = Ladda.create(element[0]);
                    // Watching login.loading for change
                    scope.$watch(attrs.laddaLoading, function(newVal, oldVal) {
                        // Based on the value start and stop the indicator
                        if (newVal) {
                            ladda.start();
                        } else {
                            ladda.stop();
                        }
                    });
                }
            };
        }
    ]);
