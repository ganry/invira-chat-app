angular.module('inviraChatApp').
    controller('ChannelsCtrl', function($state, Auth, Users, profile, channels) {
        var channelsCtrl = this;

        channelsCtrl.profile = profile;
        channelsCtrl.channels = channels;
        channelsCtrl.users = Users.all;
        Users.setOnline(profile.$id);

        channelsCtrl.getDisplayName = Users.getDisplayName;
        channelsCtrl.getGravatar = Users.getGravatar;

        channelsCtrl.newChannel = {
            name: ''
        };

        channelsCtrl.createChannel = function() {
            channelsCtrl.channels.$add(channelsCtrl.newChannel).then(function(ref) {
                $state.go('channels.messages', {channelId: ref.key()});
            });
        };

        channelsCtrl.logout = function() {
            channelsCtrl.profile.online = null;
            channelsCtrl.profile.$save().then(function() {
                Auth.$unauth();
                $state.go('home');
            });
        }
    });
