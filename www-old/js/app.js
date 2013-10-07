'use strict';

/* App Module */

// Create an application module for our sweet app.
var sweetApp = angular.module("sweetApp", ['DataServices', 'LocalStorageModule', 'ngSanitize', 'google-maps', 'ui.bootstrap', 'ngResource']);

// Configure the routing. The $routeProvider will be automatically injected into the configurator.
sweetApp.config(
    function ($routeProvider) {

        // $locationProvider.html5Mode(true).hashPrefix('#');

        // Typically, when defining routes, you will map the route to a Template to be rendered; however, this
        // only makes sense for simple web sites. When you are building more complex applications, with
        // nested navigation, you probably need something more complex. In this case, we are mapping routes to
        // render "Actions" rather than a template.
        $routeProvider
            .when(
            "/company/privacy",
            {
                action:"company.privacy"
            }
        )
            .when(
            "/admin/bulkgestures",
            {
                action:"admin.bulkgestures"
            }
        )
            .when(
            "/sweet/home",
            {
                action:"sweet.home"
            }
        )
            .when(
            "/sweet/expressions",
            {
                action:"sweet.expressions"
            }
        )
            .when(
            "/authlink/:token",
            {
                action:"authlink.token"
            }
        )
            .when(
            "/u/auth",
            {
                action:"auth.new",
                routeName:"authFlag"
            }
        )
            .when(
            "/u/auth/sent",
            {
                action:"auth.sent"
            }
        )
            .when(
            "/u/auth/sms",
            {
                action:"auth.sms"
            }
        )
            .when(
            "/sweet/show",
            {
                action:"sweet.show"
            }
        )
            .when(
            "/sweet/auto/:sweetId",
            {
                action:"sweet.auto"
            }
        )
            .when(
            "/s/:sweetId",
            {
                action:"s.sweetId"
            }
        )
            .when(
            "/sweet/interaction",
            {
                action:"sweet.interaction"
            }
        )
            .when(
            "/sweet/new",
            {
                action:"sweet.new"
            }
        )
            .when(
            "/sweet/confirmation", {
                action:"sweet.confirmation"
            }
        )
            .when(
            "/sweet/userinteraction",
            {
                action:"sweet.userinteraction"
            }
        )
            .when(
            "/user/preference",
            {
                action:"user.preference"
            }
        )
            .when(
            "/help/new",
            {
                action:"help.new"
            }
        )
            .when(
            "/help/sent",
            {
                action:"help.sent"
            }
        )
            .when(
            "/contacts/import", {
                action:"contacts.import"
            }
        )
            .when(
            "/contacts/list", {
                action:"contacts.list"
            }
        )
            .when(
            "/sweet/people", {
                action:"sweet.people"
            }
        )
            .when(
            "/sweet/friend",
            {
                action:"sweet.friend"
            }
        )
            .when(
            "/sweet/feed",
            {
                action:"sweet.feed"
            }
        )
            .when(
            "/sweet/timeline",
            {
                action:"sweet.timeline"
            }
        )
            .when(
            "/sweet/sent",
            {
                action:"sweet.sent"
            }
        )
            .when(
            "/friends/discover",
            {
                action:"friends.discover"
            }
        )
            .when(
            "/sweet/fsearch",
            {
                action:"sweet.fsearch"
            }
        )
            .when(
            "/location/place",
            {
                action:"locations.place"
            }
        )
            .when(
            "/location/sent",
            {
                action:"locations.sent"
            }
        )
            .when(
            "/location/sweetplace",
            {
                action:"location.sweetplace"
            }
        )
            .when(
            "/location/sweetsent",
            {
                action:"location.sweetsent"
            }
        )
            .when(
            "/location/enterMobile",
            {
                action:"location.entermobile"
            }
        )
            .when(
            "/kiosk/register",
            {
                action:"kiosk.register"
            }
        )
            .when(
            "/kiosk/register_visibility",
            {
                action:"kiosk.register_visibility"
            }
        )
            .when(
            "/place/placeHeader",
            {
                action:"place.placeHeader"
            }
        )
            .when(
            "/place/sweetPlace",
            {
                action:"place.sweetplace"
            }
        )
            .when(
            "/place/createSweetPlace",
            {
                action:"place.createsweetplace"
            }
        )
            .when(
            "/place/showPlace",
            {
                action:"place.showplace"
            }
        )
            .when(
            "/place/test",
            {
                action:"place.test"
            }
        )
            .when(
            "/place/test2",
            {
                action:"place.test2"
            }
        )
            .when(
            "/place/myplaces",
            {
                action:"place.myplaces"
            }
        )
            .when(
            "/place/searchPlace",
            {
                action:"place.searchplace"
            }
        )
            .when(
            "/place/joinPlace",
            {
                action:"place.joinplace"
            }
        )
            .when(
            "/place/joinPlaces",
            {
                action:"place.joinplaces"
            }
        )
            .when(
            "/place/feed",
            {
                action:"place.feed"
            }
        )
            .when(
            "/place/timeline",
            {
                action:"place.timeline"
            }
        )
            .when(
            "/place/friend",
            {
                action:"place.friend"
            }
        )
            .when(
            "/place/sent",
            {
                action:"place.sent"
            }
        )
            .when(
            "/place/sentFriend",
            {
                action:"place.sentfriend"
            }
        )
            .when(
            "/place/gmap",
            {
                action:"place.gmap"
            }
        )
            .when(
            "/place/placeProfile",
            {
                action:"place.placeprofile"
            }
        )
            .when(
            "/place/interAction",
            {
                //This page is test purpose only remove it after test
                action:"place.interaction"
            }
        )
            .when(
            "/place/interActionP",
            {
                //This page is test purpose only remove it after test
                action:"place.interactionp"
            }
        )
            .when(
            "/user/setting",
            {
                action:"place.setting"
            }
        )
            .when(
            "/:name",
            {
                action:"name.custom",
                routeName:"publicFlag"
            }
        )
            .when(
            "/partials/sent",
            {
                action:"name.sent"
            }
        )
            .otherwise(
            {
                redirectTo:"/"
            }
        )
        ;
    }
)
    .run(function ($log, $rootScope, $location, CONSTANTS, UpdateService) {
        $rootScope.sweeter = {};
        $rootScope.fromEmailAddress = "Sweetness Labs <sweet@sweetness.io>";
        $rootScope.defaultConfirmationTitle = "Congrats!";
        $rootScope.defaultConfirmationText = "You have spread Sweetness :-)";
        $rootScope.authSentConfirmationTitle = "We just sent you an SMS with a login link.";
        $rootScope.authSentConfirmationText = "Please click on the SMS to proceed to your Sweetness";
        $rootScope.newSweetPage = function () {
            $location.path("/sweet/new")
        };

        $rootScope.showInfobarMessage = function (msg, seconds) {
            $rootScope.info.title = CONSTANTS.SWEETNESS.MESSAGE.SENT;
            if (seconds > 0) {
                setTimeout(function () {
                    $rootScope.$apply(function () {
                        $rootScope.info.title = "";
                    });
                }, seconds);
            }
        };

        $rootScope.checkForUpdates = function () {
            UpdateService.checkForUpdates(function (updateAvailable) {
                if (updateAvailable) {
                    $log.info("---Software update is available. Page will reload---");
                    window.location.reload();
                }
            });
        };

        Array.prototype.sortByProp = function (p) {
            return this.sort(function (a, b) {
                return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
            });
        };

        Date.prototype.toRelativeTime = (function () {

            var _ = function (options) {
                var opts = processOptions(options);

                var now = opts.now || new Date();
                var delta = now - this;
                var future = (delta <= 0);
                delta = Math.abs(delta);

                // special cases controlled by options
                if (delta <= opts.nowThreshold) {
                    return future ? 'Right now' : 'Just now';
                }
                if (opts.smartDays && delta <= 6 * MS_IN_DAY) {
                    return toSmartDays(this, now);
                }

                var units = null;
                for (var key in CONVERSIONS) {
                    if (delta < CONVERSIONS[key])
                        break;
                    units = key; // keeps track of the selected key over the iteration
                    delta = delta / CONVERSIONS[key];
                }

                // pluralize a unit when the difference is greater than 1.
                delta = Math.floor(delta);
                if (delta !== 1) {
                    units += "s";
                }
                return [delta, units, future ? "from now" : "ago"].join(" ");
            };

            var processOptions = function (arg) {
                if (!arg) arg = 0;
                if (typeof arg === 'string') {
                    arg = parseInt(arg, 10);
                }
                if (typeof arg === 'number') {
                    if (isNaN(arg)) arg = 0;
                    return {nowThreshold:arg};
                }
                return arg;
            };

            var toSmartDays = function (date, now) {
                var day;
                var weekday = date.getDay(),
                    dayDiff = weekday - now.getDay();
                if (dayDiff == 0)       day = 'Today';
                else if (dayDiff == -1) day = 'Yesterday';
                else if (dayDiff == 1 && date > now)  day = 'Tomorrow';
                else                    day = WEEKDAYS[weekday];
                return day + " at " + date.toLocaleTimeString();
            };

            var CONVERSIONS = {
                millisecond:1, // ms    -> ms
                second:1000, // ms    -> sec
                minute:60, // sec   -> min
                hour:60, // min   -> hour
                day:24, // hour  -> day
                month:30, // day   -> month (roughly)
                year:12      // month -> year
            };
            var MS_IN_DAY = (CONVERSIONS.millisecond * CONVERSIONS.second * CONVERSIONS.minute * CONVERSIONS.hour * CONVERSIONS.day);

            var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            return _;

        })();

    })
    .constant('CONSTANTS', {
        "DEFAULT_AVATAR":"img/avatar.png",
        "DEFAULT_AVATAR_PAGINATION_SIZE":"4",
        "DEFAULT_AVATAR_PAGINATION_SIZE_PLACE":"3",
        "DEFAULT_COUNTER":"15",
        "BASE_URL":"blue.sweetness.io/",
        "AVATAR_RESIZE_URL":"http://fast-bayou-8907.herokuapp.com/convert?resize=48x48&source=",
        "AUTH_LINK_MSG": "Please click below to login and send Sweetness!",
        "AUTH_SMS_MSG": "Please enter this code to login!",
        "AUTH_LINK": "http://localhost/sweet_blue/#/authlink/",
        "AUTH_LINK_MSG_PP": "Thanks for writing to us! Have a wonderful day :-)",
        "AUTH_LINK_PP": "- Team Sweetness",
        //"AUTH_LINK_MSG":"Thank you for sending a Sweet gesture. Have a wonderful day! - Team Sweetness",
        //"AUTH_LINK":"www.sweetness.io/",
        "AUTO_MSG":"loved the Sweet gesture. Thanks for spreading Sweetness: thankyou.sweetness.io",
        "SWEET_AUTO_LINK":"blue.sweetness.io/#/sweet/auto/",
        "NODEJS_SERVER":"https://sweetnode-sweetnesslabs.rhcloud.com",
        "PARSE_API_ID":"h2w6h5BLXG3rak7sQ2eyEiTKRgu3UPzQcjRzIFCu",
        "SHOW_MESSAGE_TIME":"5000",
        "LOGIN_IN_PROGRESS":"Logging to your facebook account...",
        "EMAIL_FEAIL": "master@sweetnesslabs.com",
        "EMAIL_DEFAULT" : "twilio@sweetnesslabs.com",
        "EMAIL_SUBJECT" : "Sweetness Lab",
        "SWEETNESS":{
            "MESSAGE":{
                "SENT":"Your Sweet gesture has been sent"
            }
        },
        "CONTACTS":{
            "MESSAGE":{
                "IMPORTED":"Contacts imported successfully"
            }
        },
        "ROUTES":{
            //"SWEET_HOME": "/sweet/people",
            "SWEET_HOME":"/place/sweetPlace",
            "SWEET_HOME_PLACE":"/place/sweetPlace",
            "SWEET_NEW":"/sweet/new",
            "SWEET_CONFIRMATION":"/sweet/confirmation",
            "USER_INTERACTION":"/sweet/userinteraction",
            "AUTH":"/u/auth",
            "AUTH_SENT":"/u/auth/sent",
            "AUTH_SMS":"/u/auth/sms",
            "KIOSK_REGISTER":"/kiosk/register",
            "FRIENDS_DISCOVER":"/friends/discover"
        },
        "DEFAULT_FONT_COLOR":"#000000", // Black
        "FONT_COLORS":[
            "#000000", "#ffffff", "#672971", "#e21d41", "#3ac6f3", "#b3ee0e"
        ],
        "DEFAULT_GREETING_BACKGROUND":"img/greetings/White-Default.png",
        "GREETING_BACKGROUNDS":[
            "img/greetings/White-Default.png",
            "img/greetings/Neon-Green.png",
            "img/greetings/Black.png",
            "img/greetings/Blue.png",
            "img/greetings/Pink.png",
            "img/greetings/Purple.png",
//            "img/greetings/christmas-pattern-pink.png",
//            "img/greetings/christmas-pattern-purple.png",
//            "img/greetings/christmas-pattern-ice blue.png",
            "img/greetings/christmas-pattern2-pink.png",
            "img/greetings/christmas-pattern2-purple.png",
            "img/greetings/christmas-pattern2-ice blue.png"
        ],
        "DEFAULT_GESTURE_TYPE":"defaultGestureType",
        "DEFAULT_GESTURE_TEXT":"Thinking of you and sending you much Sweetness!",
        "GESTURE":{
            "THANK_YOU":{
                "TEMPLATE":"said thanks to",
                "FACEBOOK_TEMPLATE":"Just wanted to say thank you.",
                //"FACEBOOK_TEMPLATE":"Give gratitude. It means everything.",
                "TEXT":[
                    "Thanks for everything. Much love!",
                    "Thank you for being so wonderful. See you around!",
                    "Thank you for the time you took out for me. My best wishes.",
                    "Thanks for pitching in and making a difference. Lunch on me!",
                    "Thank you so much for your generosity. Love to return the favor!",
                    "Thanks for always being there for me. Don't know what I'd do without you!",
                    "Thank you for your thoughtfulness. I really appreciate the gesture. Warm regards."
                ],
                "SUBJECT":"says Thank You!",
                "SUBJECT_REPLY":"says you are Welcome!"
            },
            "HELLO":{
                "TEMPLATE":"sent a hello to",
                "FACEBOOK_TEMPLATE":"Just wanted to say hello to you.",
                "TEXT":[
                    "Hola! Wanna do something manana?",
                    "Hello hello! What's brewing with you?",
                    "Hi there! It was great running into you.",
                    "Thought I'd drop a line. Hope all's well!",
                    "Long time no see. Keeping too busy?",
                    "Knock knock. It's me! Anybody there?",
                    "Thinking about you. Gimme a shout!"
                ],
                "SUBJECT":"sent you a Hello!",
                "SUBJECT_REPLY":"sent back a Hello!"
            },
            "GREETING":{
                "TEXT":[
                    "Wishing you and your loved ones happiness to come.",
                    "Happy Holidays! My warmest wishes to you and your family.",
                    "I want to celebrate people like you as we bring in this New Year together.",
                    "Seasons greetings to you and your family. Wishing you peace, love and joy."
                ],
                "SUBJECT":"sends Greetings!",
                "SUBJECT_REPLY":"sends Greetings!"
            },
            "THOUGHT_ABOUT_YOU":{
                "TEMPLATE":"thought about",
                "FACEBOOK_TEMPLATE":"Just thought about you.Hope all's well!",
                "DEFAULT_TEXT":"",
                "TEXT":[
                    "Thank you for your thoughtfulness. I really appreciate the gesture. Warm regards."
                ],
                "SUBJECT":"thought about",
                "SUBJECT_REPLY":"thought about"
            },
            "DEFAULT":{
                "SUBJECT":"sent you a Sweet gesture",
                "SUBJECT_REPLY":"sent you a Sweet gesture"
            }
        },
        "GESTURES":[
            {type:"sendAThought", name:"Send a thought",
                sub_actions:[
                    {parentGesture:"sendAThought", type:"hello", name:"Hello!",
                        value:"", my_template:"You said Hello to <%=person2%>", template:"<%=person1%> said Hello!", facebook_template:"Just wanted to say hello to you."},
                    {parentGesture:"sendAThought", type:"thoughtAboutYou", name:"Thinking of You...",
                        value:"", my_template:"You thought about <%=person2%>", template:"<%=person1%> thought about you", facebook_template:"Just thought about you. Hope all's well!"},
                    {parentGesture:"sendAThought", type:"thankYou", name:"Thank You!",
                        value:"", my_template:"You said Thank You to <%=person2%>", template:"<%=person1%> said Thank You!", guest_template:"<%=person3%> said Thank You!", facebook_template:"Just wanted to say thank you."},
                    {parentGesture:"sendAThought", type:"thankYou", name:"Thank You!",
                        value:"", my_template:"You said Thank You to <%=person2%>", template:"<%=person1%> said Thank You!", guest_template:"<%=person3%> said Thank You!", facebook_template:"Just wanted to say thank you."}
                ]
            },
            {type:"meetAFriend", name:"meet a friend",
                sub_actions:[
                    {parentGesture:"meetAFriend", type:"pickATime", name:"Pick a time",
                        value:""},
                    {parentGesture:"meetAFriend", type:"pickAPlace", name:"Pick a place",
                        value:""},
                    {parentGesture:"meetAFriend", type:"inviteOthers", name:"Invite others",
                        value:""}
                ]
            },
            {type:"sendAFavor", name:"send a favor",
                sub_actions:[
                    {parentGesture:"sendAFavor", type:"brownie", name:"brownie",
                        value:"", my_template:"You gave a brownie to <%=person2%>", template:"<%=person1%> gave you a brownie", facebook_template:"Here is a brownie for you :-)."},
                    {parentGesture:"sendAFavor", type:"cupcake", name:"cupcake",
                        value:"", my_template:"You gave a cupcake to <%=person2%>", template:"<%=person1%> gave you a cupcake", facebook_template:"Here is a cupcake for you :-)."},
                    {parentGesture:"sendAFavor", type:"cookie", name:"cookie",
                        value:"", my_template:"You gave a cookie to <%=person2%>", template:"<%=person1%> gave you a cookie", facebook_template:"Here is a cookie for you :-)."}
                ]
            }
        ],
        "SQUEEZE":{type:"squeeze", name:"Give a Squeeze",
            value:"", my_template:"You gave <%=person2%> a squeeze", template:"<%=person1%> gave you a squeeze", facebook_template:"Just sending you a squeeze..."},
        "EMAIL_DEFAULT_VALUES":{
            "FROM_ADDRESS":"sweet@sweetness.io",
            "FROM_NAME":"Sweetness Labs",
            "TO_ADDRESS":"sweet@sweetness.io",
//        "TO_ADDRESS": "bilalahmed70@gmail.com",
            "TO_NAME":"Sweetness Labs"
        },
        "HELP":{
            "DEFAULT_SUBJECT":"Sweet User Feedback"
        },
        "BULK_EMAIL":{
            "SENT_MSG":"Gestures created and sent successfully"
        },
        "EXPRESSIONS":{
            "STAR_DEFAULT_IMAGE":"img/Star-Default-Fuller.png",
            "HEART_DEFAULT_IMAGE":"img/Heart-Default-Fuller.png"
        },
        "GLYPH_ICONS":{
            "PLUS":"icon-plus",
            "MINUS":"icon-minus"
        },
        "ERROR":{
            "DEFAULT":"Oops! Something went wrong and we're looking into it."
        },
        "INTERACTION":{
            "EVENTS":["Food", "Coffee", "Drink", "Love", "Sport"],
            "FREQUENCIES":["VIP", "Weekly", "Monthly", "Yearly"]
        },
        "SOCIAL":{
            "FACEBOOK":{
                "APP_ID":"465464716837107", //Sweet Bee
//            "APP_ID": "165573450251838", //Sweetness
                "CHANNEL_URL":"http://localhost.local/sweet/alpha/channel.html",
//            "CHANNEL_URL": "http://thankyou.sweetness.io/channel.html",
//            "CHANNEL_URL": "http://www.sweetness.io/bubble/channel.html",
                "PERMISSIONS":"publish_actions,email",
                "GRAPH_URL":"http://graph.facebook.com/",
                "PICTURE_URL":"/picture?type=large",
                "POST_TO_WALL_TEMPLATE":"Hi <%=receiverFirstName%>"
                    + "\n"
                    + "<%=text%>"
                    + "\n"
                    + "Cheers."
                    + "\n"
                    + "- <%=senderFirstName%>"
//                + "\n"
//                + "Return the gesture:"
//                + "\n"
//                + "<%=sweetLink%>"
//                + "www.sweetness.io"
            }
        }
    });

//SweetTest
//Parse.initialize("jKROXk4rTh4qm0vO2QxqoHhkcSsjklqN8V7bZPTz", "vARBe1nGSGtDfQPkdlS2Ond0dxcAr6tAJZgkIm9K");

//SweetBee
Parse.initialize("h2w6h5BLXG3rak7sQ2eyEiTKRgu3UPzQcjRzIFCu", "gQ7DmgLGTDNNl4Nl9l3cmJkSluy4y2hEPVaNSH2k");

//SweetApp
//Parse.initialize("WRdpguLGfYdPVMq2LwHiB0s5k9ESVTwdde7kXwDm", "MzJ2jpG740oPfRdsKRY6jbXHCeEDXwTlnVFUYiTi");

(function (d) {
    var js, id = 'facebook-jssdk';
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);
}(document));

setTimeout(function () {
    /*
     Parse.FacebookUtils.init({
     //              TODO: What if user revoke Sweet app permissions
     appId      : "465464716837107",
     channelUrl : "http://localhost.local/sweet/bubble/channel.html", // Channel File
     status     : true,  // check login status
     cookie     : true,  // enable cookies to allow Parse to access the session
     xfbml      : true,  // parse XFBML,
     oauth      : true
     });*/
    Parse.FacebookUtils.init({
        //              TODO: What if user revoke Sweet app permissions
        //appId      : "548541351864725", // thankyou.sweetness.io
        //appId      : "451283941617165",
        appId      : "366407670138696", // app name : sweet_localhost
        //appId		: "446791675403047", //app nmae : sweetjklabz
        //appId   : "234099260080497", //jklabz sweetnessblue
        //appId   : "580501651986153", //jklabz sweetnessblue -thankyouweetness
        channelUrl:"http://localhost.local/sweet/alpha/channel.html", // Channel File
        //channelUrl:"http://thankyou.sweetness.io/channel.html",
        status:true, // check login status
        cookie:true, // enable cookies to allow Parse to access the session
        xfbml:true, // parse XFBML,
        oauth:true,
        bundleId: "com.sweetness.thankyou"
    });
}, 1000);

/*window.fbAsyncInit = function() {
    console.log('Test fb login');
    FB.init({
        appId      : '366407670138696', // App ID
        channelUrl : 'http://localhost.local/sweet/bubble/channel.html', // Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });
};*/
//
//// Load the SDK Asynchronously
/*(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));*/
//
//function login() {
//    FB.login(function(response) {
//        if (response.authResponse) {
//            // connected
//            testAPI();
//        } else {
//            // cancelled
//        }
//    });
//}


//            };

