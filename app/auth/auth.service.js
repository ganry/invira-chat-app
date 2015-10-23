angular.module('inviraChatApp')
    .factory('Auth', ['$firebaseAuth', 'FirebaseUrl', function($firebaseAuth, FirebaseUrl) {
        var firebase = new Firebase(FirebaseUrl);
        var auth = $firebaseAuth(firebase);

        return auth;
    }]);
