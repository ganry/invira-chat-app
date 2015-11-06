angular.module('inviraChatApp')
    .factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl) {

        var usersFirebase = new Firebase(FirebaseUrl+'users');
        var connectedFirebase = new Firebase(FirebaseUrl+'.info/connected');
        var users = $firebaseArray(usersFirebase);
        var Users = {
            getProfile: function(uid){
                return $firebaseObject(usersFirebase.child(uid));
            },
            getDisplayName: function(uid){
                return users.$getRecord(uid).displayName;
            },
            getGravatar: function(uid) {
                return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash + '?d=retro';
            },
            setOnline: function(uid) {
                var connected = $firebaseObject(connectedFirebase);
                var online = $firebaseArray(usersFirebase.child(uid+'/online'));

                connected.$watch(function() {
                    if (connected.$value === true) {
                        online.$add(true).then(function(connectedFirebase) {
                            connectedFirebase.onDisconnect().remove();
                        });
                    }
                });
            },
            all: users
        };

        return Users;
    });
