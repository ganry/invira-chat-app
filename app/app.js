'use strict';

/**
 * @ngdoc overview
 * @name inviraChatApp
 * @description
 * # inviraChatApp
 *
 * Main module of the application.
 */
angular
    .module('inviraChatApp', [
        'firebase',
        'angular-md5',
        'ui.router'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html',
                resolve: {
                    requireNoAuth: function($state, Auth) {
                        return Auth.$requireAuth().then(function(auth) {
                            $state.transitionTo('channels');
                        }, function(error) {
                            return;
                        });
                    }
                }
            })
            .state('login', {
                url: '/login',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'views/login.html',
                resolve: {
                    requireNoAuth: function($state, Auth) {
                        return Auth.$requireAuth().then(function(auth) {
                            $state.transitionTo('home');
                        }, function(error) {
                            return;
                        });
                    }
                }
            })
            .state('register', {
                url: '/register',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'views/register.html',
                resolve: {
                    requireNoAuth: function($state, Auth) {
                        return Auth.$requireAuth().then(function(auth) {
                            $state.transitionTo('home');
                        }, function(error) {
                            return;
                        });
                    }
                }
            })
            .state('profile', {
                url: '/profile',
                controller: 'ProfileCtrl as profileCtrl',
                templateUrl: 'views/profile.html',
                resolve: {
                    auth: function($state, Users, Auth) {
                        return Auth.$requireAuth().catch(function() {
                            $state.transitionTo('home');
                        });
                    },
                    profile: function(Users, Auth) {
                        return Auth.$requireAuth().then(function(auth) {
                            return Users.getProfile(auth.uid).$loaded();
                        });
                    }
                }
            })
            .state('channels', {
                url: '/channels',
                controller: 'ChannelsCtrl as channelsCtrl',
                templateUrl: 'views/chat.html',
                resolve: {
                    channels: function(Channels) {
                        return Channels.$loaded();
                    },
                    profile: function($state, Auth, Users) {
                        return Auth.$requireAuth().then(function(auth) {
                            return Users.getProfile(auth.uid).$loaded().then(function(profile) {
                                if (profile.displayName) {
                                    return profile;
                                } else {
                                    $state.transitionTo('profile');
                                }
                            });
                        }, function(error) {
                            $state.transitionTo('home');
                        });
                    }
                }
            })
            .state('channels.create', {
                url: '/create',
                templateUrl: 'views/create.html',
                controller: 'ChannelsCtrl as channelsCtrl'
            })
            .state('channels.messages', {
                url: '/{channelId}/messages',
                templateUrl: 'views/messages.html',
                controller: 'MessagesCtrl as messagesCtrl',
                resolve: {
                    messages: function($stateParams, Messages) {
                        return Messages.forChannel($stateParams.channelId).$loaded();
                    },
                    channelName: function($stateParams, channels) {
                        return '#'+channels.$getRecord($stateParams.channelId).name;
                    }
                }
            })
            .state('channels.direct', {
                url: '/{uid}/messages/direct',
                templateUrl: 'views/messages.html',
                controller: 'MessagesCtrl as messagesCtrl',
                resolve: {
                    messages: function($stateParams, Messages, profile) {
                        return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
                    },
                    channelName: function($stateParams, Users) {
                        return Users.all.$loaded().then(function() {
                            return '@'+Users.getDisplayName($stateParams.uid);
                        });
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
    })
    .constant('FirebaseUrl', 'https://invira-chat.firebaseio.com/')
    .run(function() {
        console.log('sdfs');
        //hide loader after page is finished loading
        $('.loader_overlay').fadeOut(1000);
    });
