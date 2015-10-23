angular.module('inviraChatApp')
    .factory('Messages', function($firebaseArray, FirebaseUrl) {
        var channelMessagesFireBase = new Firebase(FirebaseUrl+'channelMessages');
        var userMessagesFireBase = new Firebase(FirebaseUrl+'userMessages');

        return {
            forChannel: function(channelId){
                return $firebaseArray(channelMessagesFireBase.child(channelId));
            },
            forUsers: function(uid1, uid2){
                var path = uid1 < uid2 ? uid1+'/'+uid2 : uid2+'/'+uid1;

                return $firebaseArray(userMessagesFireBase.child(path));
            }
        };
    });
