angular.module('inviraChatApp')
    .factory('Messages', function($firebaseArray, FirebaseUrl) {
        var messageService = this;
        var channelMessagesFireBase = new Firebase(FirebaseUrl+'channelMessages');
        var userMessagesFireBase = new Firebase(FirebaseUrl+'userMessages');

        messageService.scrollDownWithAnimation = function() {
            if ($('.message.bubble').length > 0) {
                $('html, body').animate({
                    scrollTop: $('.message.bubble').last().offset().top
                }, 'slow');
            }
        };


        //register new message event for channel messages
        channelMessagesFireBase.on('child_changed', function(childSnapshot, prevChildKey) {
            //only execute this function when message changed
            if (prevChildKey !== null)
                messageService.scrollDownWithAnimation();
        });

        //register new message event for user messages
        userMessagesFireBase.on('child_changed', function(childSnapshot, prevChildKey) {
            messageService.scrollDownWithAnimation();
        });

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
