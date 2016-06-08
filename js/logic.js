(function($) {
    var channels = ["freecodecamp", "storbeck", "terakilobyte", "habathcx",
                    "RobotCaleb","thomasballinger","noobs2ninjas","beohoff",
                    "brunofin","comster404","test_channel","cretetion",
                    "sheevergaming","TR7K","OgamingSC2","ESL_SC2"];
    var channelsJSON = [];
    var channelsHTML = [];

    function requestTwitchAPI(channel) {
        function requestTwitchData(api, streamer) {
            var uri = 'https://api.twitch.tv/kraken/' + api + '/' + streamer;

            return $.ajax({
                dataType: "jsonp",
                method: "GET",
                url: uri
            });
        }

        function makeChannelHTML(streamerObject) {
            function makeOnlineChannel() {
                var channel_name = streamerObject.json.stream.channel.display_name;
                var img_src = streamerObject.json.stream.channel.logo !== null ? streamerObject.json.stream.channel.logo : './resource/default_profile_image.png';
                var channel_link = streamerObject.json.stream.channel.url;
                var currently_streaming = streamerObject.json.stream.channel.game;
                var channel_status = streamerObject.json.stream.channel.status;
                var channelHTML = '<div class="row"><div class="col-md-3">' + 
                           '<img src="' + img_src + '"class="img-responsive img-rounded profile-style" alt="profile image"></div>' +
                           '<div class="col-md-9"><div class="row"><div class="col-md-8">' + 
                           '<h2><a href="' + channel_link + '" target="_blank">' + channel_name +'</a></h2></div>' + 
                           '<div class="col-md-4 online">Online</div></div>' +
                           '<div class="row"><div class="col-md-12">' + currently_streaming + ': ' + channel_status + '</div></div>' + 
                           '<div class="row"><div class="col-md-8 text-center">' + 
                           '<a class="btn btn-primary" role="button" data-toggle="collapse" aria-expanded="false" aria-controls="collapseExample" ' +
                           'href="#' + channel +'VideoBox">' +
                           '<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></a></div></div></div></div>' + 
                           '<div class="row collapse" id="' + channel + 'VideoBox"><div class="col-md-12">' +  
                           '<div class="embed-responsive embed-responsive-16by9">' +
                           '<iframe class="embed-responsive-item" frameborder="0" scrolling="no" allowfullscreen="true" ' + 
                           'src="http://player.twitch.tv/?channel=' + channel + '"></iframe></div></div></div>';

                return {status: "online", html: channelHTML};
            }

            function makeOfflineChannel() {
                var channel_name = streamerObject.json.display_name;
                var img_src = streamerObject.json.logo !== null ? streamerObject.json.logo : './resource/default_profile_image.png';
                var channel_link = streamerObject.json.url;
                var channelHTML = '<div class="row"><div class="col-md-3">' + 
                           '<img src="' + img_src + '"class="img-responsive img-rounded profile-style" alt="profile image"></div>' +
                           '<div class="col-md-9"><div class="row"><div class="col-md-8">' + 
                           '<h2><a href="' + channel_link + '" target="_blank">' + channel_name +'</a></h2></div>' + 
                           '<div class="col-md-4 offline">Offline</div></div>' +
                           '</div></div>';

                return {status: "offline", html: channelHTML};
            }

            function makeUnavailableChannel() {
                var channel_name = streamerObject.name;
                var img_src = './resource/default_profile_image.png';
                var channelHTML = '<div class="row"><div class="col-md-3">' + 
                           '<img src="' + img_src + '"class="img-responsive img-rounded profile-style" alt="profile image"></div>' +
                           '<div class="col-md-9"><div class="row"><div class="col-md-8">' + 
                           '<h2>' + channel_name + '</h2></div>' + 
                           '<div class="col-md-4 closed">Account Does Not Exist</div></div>' +
                           '</div></div>';

                return {status: "closed", html: channelHTML};
            }

            if (streamerObject.status === "online") {
                channelsHTML.push(makeOnlineChannel());
            } else if (streamerObject.status === "offline") {
                channelsHTML.push(makeOfflineChannel());
            } else if (streamerObject.status === "closed") {
                channelsHTML.push(makeUnavailableChannel());
            }
        }

        var $xhr = requestTwitchData('streams', channel);

        $xhr.done(function(response) {
            if (response.stream !== null && response.stream !== undefined) {
                makeChannelHTML({status: "online", json: response});
            } else if (response.stream === null) {
                var $xhr2 = requestTwitchData('channels', channel)

                $xhr2.done(function(data) {
                    makeChannelHTML({status: "offline", json: data});
                });
            } else if (response.stream === undefined) {
                makeChannelHTML({status: "closed", name: channel});
            }
        });
    }
   
    channels.forEach(function(element) { 
        requestTwitchAPI(element);
    });

    $('a[data-toggle="tab"]').click(function (e) {
        var $target = $(this);
        var $tabBodies = $('.tab-content').children();

        e.preventDefault();

        if ($target.text() === "All") {
            var $tabBodyAll = $tabBodies.eq(0);

            $tabBodyAll.empty();

            channelsHTML.forEach(function(element, index) {
                $tabBodyAll.append(element.html);
            });
        } else if ($target.text() === "Online") {
            var $tabBodyOnline = $tabBodies.eq(1);

            $tabBodyOnline.empty();

            channelsHTML.forEach(function(element, index) {
                if (element.status === "online") {
                    $tabBodyOnline.append(element.html);
                }
            });

        } else if ($target.text() === "Offline") {
            var $tabBodyOffline = $tabBodies.eq(2);

            $tabBodyOffline.empty();

            channelsHTML.forEach(function(element, index) {
                if (element.status === "offline" || element.status === "closed") {
                    $tabBodyOffline.append(element.html);
                }
            });
        }

        $target.tab('show');
    });

    $(window).load(function(e) {
        $('a[href="#all"]').trigger('click');
    });
})(jQuery);