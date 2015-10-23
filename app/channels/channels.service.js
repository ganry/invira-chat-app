angular.module('inviraChatApp')
    .factory('Channels', function($firebaseArray, FirebaseUrl) {
        var channelsFirebase = new Firebase(FirebaseUrl+'channels');
        var channels = $firebaseArray(channelsFirebase);

        return channels;
    });
