angular.module('inviraChatApp')
    .controller('MessagesCtrl', function($scope, $sce, $sanitize, profile, channelName, messages) {
        var messagesCtrl = this;

        $scope.$parent.headerTitle = channelName;
        messagesCtrl.messages = messages;
        messagesCtrl.channelName = channelName;
        messagesCtrl.message = '';

        messagesCtrl.trustAsHtml = function(message) {
            return $sce.trustAsHtml(message);
        };

        //needs to be refactored and moved
        //TODO: is used in service, remove it from controller
        messagesCtrl.scrollToBottom = function() {
            if ($('#footer-bottom').length > 0) {
                $('html, body').animate({
                    scrollTop: $('#footer-bottom').last().offset().top
                }, 'slow');
            }
        };


        //needs to be refactored and moved to separate factory
        messagesCtrl.parseUrl = function (url) {
            var parser = document.createElement('a'),
                searchObject = {},
                queries, split, i;
            // Let the browser do the work
            parser.href = url;
            // Convert query string to object
            queries = parser.search.replace(/^\?/, '').split('&');
            for( i = 0; i < queries.length; i++ ) {
                split = queries[i].split('=');
                searchObject[split[0]] = split[1];
            }
            return {
                protocol: parser.protocol,
                host: parser.host,
                hostname: parser.hostname,
                port: parser.port,
                pathname: parser.pathname,
                search: parser.search,
                searchObject: searchObject,
                hash: parser.hash
            };
        };

        //most of this logic should be in service
        messagesCtrl.sendMessage = function() {
            if (messagesCtrl.message.length > 0) {
                //make message html safe
                messagesCtrl.message = $sanitize(messagesCtrl.message);

                var urlCounter = 0;
                var message = URI.withinString(messagesCtrl.message, function(url) {
                    urlCounter++;
                    var urlQuery = messagesCtrl.parseUrl(url);

                    //very simple youtube link parsing
                    if (urlQuery.hostname.indexOf('youtube') > -1 || urlQuery.hostname.indexOf('youtu.be') > -1) {
                        var video = urlQuery.search.replace('?v=', '');
                        console.log(video);
                        console.log(urlQuery.search);
                        return '<iframe width="400" height="250" src="https://www.youtube.com/embed/'+video+'" frameborder="0" allowfullscreen></iframe>';
                    } else if (url.indexOf('.jpg') > -1 || url.indexOf('.png') > -1 || url.indexOf('.gif') > -1)
                        return '<img src="'+url+'" />';
                    else
                        return '<a href="'+url+'">'+url+'</a>';
                });

                messagesCtrl.messages.$add({
                    uid: profile.$id,
                    body: messagesCtrl.message,
                    timestamp: Firebase.ServerValue.TIMESTAMP
                }).then(function() {
                    if (urlCounter > 0) {
                        message = message;
                        messagesCtrl.messages.$add({
                            uid: profile.$id,
                            body: message,
                            timestamp: Firebase.ServerValue.TIMESTAMP
                        });
                    }

                    messagesCtrl.message = '';
                });


            }
        }
    });
