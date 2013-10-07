'use strict';

function SweetCtrl($window, UpdateService, $log, $scope, sweetService, interactionService, authService, userService, $location, utilService, $rootScope, CONSTANTS, socialNetworksService, facebookService) {
    if (!userService.currentUser()) {
        $location.path(CONSTANTS.ROUTES.AUTH);
    } else {

        $scope.comeOn = 'be consistent';

        $scope.currentPage = 0;
        $scope.pageSize = CONSTANTS.DEFAULT_AVATAR_PAGINATION_SIZE;
        ;
        $scope.toggleAvatarIcon = CONSTANTS.GLYPH_ICONS.PLUS;

        $scope.interactionData = {};
        $scope.feeds = [];
        $scope.timelines = [];

        $scope.hello = "Hello Sweet Controller!";
        $scope.sweet = {};
        $scope.userSweets = [];
        $scope.newSweet = {};
        $scope.sweets = [];

        $scope.resetNewSweetValues = function () {

            $scope.newSweet.gestureType = CONSTANTS.DEFAULT_GESTURE_TYPE;
            $scope.newSweet.text = CONSTANTS.DEFAULT_GESTURE_TEXT;
            $scope.newSweet.picture = false;
            $scope.showFileSelect = false;

            $scope.selectedGestureTextIndex = 0;
            $scope.newSweet.starImage = CONSTANTS.EXPRESSIONS.STAR_DEFAULT_IMAGE;
            $scope.newSweet.heartImage = CONSTANTS.EXPRESSIONS.HEART_DEFAULT_IMAGE;

            $scope.selectedGreetingBackgroundIndex = 0;
            $scope.newSweet.greetingBackground = CONSTANTS.GREETING_BACKGROUNDS[0];

            $scope.selectedFontColorIndex = 0;
            $scope.newSweet.fontColor = CONSTANTS.FONT_COLORS[0];
        }

        $scope.interactionEvents = CONSTANTS.INTERACTION.EVENTS;
        $scope.interactionFrequencies = CONSTANTS.INTERACTION.FREQUENCIES;

        $scope.getAvatar = function (receiverPhone) {

            for (var j = 0; j < $scope.userSweets.length; j++) {
                if (angular.equals($scope.userSweets[j].get("receiverPhone"), receiverPhone)) {
                    //console.log("**********************"+receiverPhone);
                    return $scope.userSweets[j].get("receiverAvatar");
                }
            }
            return "img/avatar.png";
        };

        $scope.resetNewSweetValues();

        $scope.numberOfPages = function () {
            return Math.ceil($scope.friends.length / $scope.pageSize);
        };

        $scope.toggleAvatar = function () {
            if ($scope.pageSize == $scope.friends.length) {
                $scope.pageSize = CONSTANTS.DEFAULT_AVATAR_PAGINATION_SIZE;
                ;
                $scope.toggleAvatarIcon = CONSTANTS.GLYPH_ICONS.PLUS;
            } else {
                $scope.currentPage = 0;
                $scope.pageSize = $scope.friends.length;
                $scope.toggleAvatarIcon = CONSTANTS.GLYPH_ICONS.MINUS;
            }
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            console.log("nextPage: " + $scope.currentPage * $scope.pageSize);
            console.log("nextPage: " + $scope.friends.length);
            if ((( ($scope.currentPage + 1) * $scope.pageSize) < $scope.friends.length - 1) && $scope.pageSize != $scope.friends.length) {
                $scope.currentPage++;
            }
        };

        $scope.hideAutoReply = function (item) {
            return item.get("auto") != 'true';
        };

        $scope.loadInteractionData = function () {
            interactionService.getInteractionById($scope.currentInteraction, function (rInteractionData) {
                $scope.safeApply(function () {
                    var play = rInteractionData.get("play");
                    var visibility = rInteractionData.get("visibility");
                    var eject = rInteractionData.get("eject");
                    $scope.interactionData.notes = rInteractionData.get("notes");
                    $scope.interactionData.frequency = rInteractionData.get("frequency");
                    $scope.interactionData.event = rInteractionData.get("event");

                    $scope.interactionData.lockIcon = visibility ? "icon-unlock" : "icon-lock";
                    $scope.interactionData.playIcon = play ? "icon-play" : "icon-pause";
//                    $scope.interactionData.playIcon = play ? "icon-play" : "icon-pause" ;
                });
            });
        };

        $scope.loadSweets = function (interaction) {
            $scope.interactingPersonName = interaction.get("receiverName");
            $scope.interactingPersonPhone = interaction.get("receiverPhone");
            $scope.currentInteraction = interaction;
            $scope.loadInteractionData();
//            $scope.interactionData.notes = interaction.get("notes");
//            $scope.interactionData.event = interaction.get("event");
//            $scope.interactionData.frequency = interaction.get("frequency");
//            $scope.interactingPersonAvatar = "img/avatar.png";
            if (!interaction.get("receiverAvatar"))
                $scope.interactingPersonAvatar = $scope.getAvatar(interaction.get("receiverPhone"));
            else
                $scope.interactingPersonAvatar = interaction.get("receiverAvatar");
            sweetService.loadSweets(interaction, function (rSweets) {
                $scope.safeApply(function () {
                    $scope.sweets = rSweets;
                });
            });
        };

        $scope.userInteractions = function () {
            return $scope.userSweets;
        };

        $scope.interactionSweets = function () {
            return $scope.sweets;
        };

        $scope.saveInteractionNotes = function (notes) {
            interactionService.saveNotes($scope.currentInteraction, notes);
        };

        $scope.saveInteractionVisibility = function (visibility) {
            visibility = !visibility;
            $scope.interactionData.visibility = visibility;
            visibility ? $scope.interactionData.lockIcon = "icon-unlock" : $scope.interactionData.lockIcon = "icon-lock";
            interactionService.saveVisibility($scope.currentInteraction, visibility);
        };


        $scope.saveInteractionPlay = function (play) {
            play = !play;
            $scope.interactionData.play = play;
            play ? $scope.interactionData.playIcon = "icon-play" : $scope.interactionData.playIcon = "icon-pause";
            interactionService.savePlay($scope.currentInteraction, play);
        };

        $scope.saveInteractionEject = function (eject) {
            eject = !eject;
            interactionService.saveEject($scope.currentInteraction, eject);
        };

        $scope.saveInteractionEvent = function (event) {
            $scope.interactionData.event = event.event;
            //console.log(event);
            interactionService.saveEvent($scope.currentInteraction, event.event, function (rUserInteraction) {
                $scope.safeApply(function () {
                    $scope.interactionData.event = rUserInteraction.get("event");
                    $scope.getUserSweets();
//                    $scope.currentInteraction.set("event",rUserInteraction.get("event"));
//                 $scope.currentInteraction = rUserInteraction;
                });
            });
        };

        $scope.saveInteractionFrequency = function (frequency) {
            $scope.interactionData.frequency = frequency.frequency;
            interactionService.saveFrequency($scope.currentInteraction, frequency.frequency);
        };

        $scope.changeFontColor = function () {
            if ($scope.selectedFontColorIndex == CONSTANTS.FONT_COLORS.length - 1) {
                $scope.selectedFontColorIndex = -1;
            }
            $scope.newSweet.fontColor = CONSTANTS.FONT_COLORS[++$scope.selectedFontColorIndex];

        };

        $scope.setGreetingBackground = function () {
//            var index = $scope.selectedGreetingBackgroundIndex++;
            //console.log($scope.newSweet.greetingBackground+" "+$scope.selectedGreetingBackgroundIndex);
            if ($scope.selectedGreetingBackgroundIndex == CONSTANTS.GREETING_BACKGROUNDS.length - 1) {
                $scope.selectedGreetingBackgroundIndex = -1;
            }
            $scope.newSweet.greetingBackground = CONSTANTS.GREETING_BACKGROUNDS[++$scope.selectedGreetingBackgroundIndex];
            //console.log($scope.newSweet.greetingBackground);

        };

//      TODO: verify and remove
        $scope.randomColor = function () {
            return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        };

        $scope.respondToSweet = function (sweet) {
            $scope.newSweet.receiverName = sweet.get("senderName");
            $scope.newSweet.receiverPhone = sweet.get("senderPhone");
            $scope.newSweet.receiverAvatar = $scope.getAvatar(sweet.get("senderPhone"));
            $scope.newSweet.replyToSweet = sweet.id;
            $scope.newSweet.text = "";
            $log.info("--- respondToSweet --- sweet.get('gestureType')" + sweet.get("gestureType"));
            $scope.newSweet.gestureType = sweet.get("gestureType");
            $log.info("--- respondToSweet --- sweet" + sweet);
            $log.info("--- respondToSweet --- newSweet" + $scope.newSweet);
            $log.info("--- respondToSweet --- newSweet.gestureType" + $scope.newSweet.gestureType);
            $location.path('/sweet/new');
        };

        $scope.interactWithPerson = function () {
            $scope.newSweet.receiverName = $scope.currentInteraction.get("receiverName");
            $scope.newSweet.receiverPhone = $scope.currentInteraction.get("receiverPhone");
            $scope.newSweet.receiverAvatar = $scope.currentInteraction.get("receiverAvatar");
            $location.path('/sweet/new');
        };

        $scope.setReceiver = function (interaction) {
//            $scope.toggleAvatar();
            $scope.pageSize = CONSTANTS.DEFAULT_AVATAR_PAGINATION_SIZE;
            $scope.toggleAvatarIcon = CONSTANTS.GLYPH_ICONS.PLUS;

            $scope.newSweet.receiverName = interaction.get("receiverName");
            $scope.newSweet.receiverPhone = interaction.get("receiverPhone");
            $scope.newSweet.receiverAvatar = interaction.get("receiverAvatar");
        };

        $rootScope.$on('user_interaction', function () {
            //console.log("---Recevied user_interaction---"+interactionService.getInteraction());
//           $scope.getUserSweets();
            $scope.showInteraction(interactionService.getInteraction());


        });

        $scope.showSweet = function (sweet) {
            $scope.sweet = sweet;
            $location.path('/sweet/show');
        };

        $scope.addExpressions = function () {
            $location.path('/sweet/expressions');
        };

        $scope.setSweetExpression = function (expression) {
            //console.log("--- setSweetExpression --- "+expression);

            switch (expression) {
                case 'picture':
                    $scope.newSweet.picture = !$scope.newSweet.picture;
                    $scope.showFileSelect = true;
                    break;
                case 'star':
                    $scope.newSweet.star = !$scope.newSweet.star;
                    $scope.newSweet.starImage = ($scope.newSweet.starImage == "img/Star-Fuller-Brighter.png") ? "img/Star-Default-Fuller.png" : "img/Star-Fuller-Brighter.png";
                    //console.log($scope.newSweet.starImage);
                    break;
                case 'heart':
                    $scope.newSweet.heart = !$scope.newSweet.heart;
                    $scope.newSweet.heartImage = ($scope.newSweet.heartImage == "img/Heart-Fuller.png") ? "img/Heart-Default-Fuller.png" : "img/Heart-Fuller.png";
                    break;
                default:
                    $scope.newSweet.star = !$scope.newSweet.star;
                    break;
            }
        };

//  Purple deprecated
        $scope.setGesture = function (type) {
            var index = $scope.selectedGestureTextIndex++;
            //console.log("---setGesture---"+index);
            $scope.newSweet.gestureType = type;
            switch (type) {
                case "sayThankYou":
                    if (index >= CONSTANTS.GESTURE.THANK_YOU.TEXT.length - 1) $scope.selectedGestureTextIndex = 0;
                    $scope.newSweet.text = CONSTANTS.GESTURE.THANK_YOU.TEXT[index];
                    break;
                case "sendAHello":
                    if (index >= CONSTANTS.GESTURE.HELLO.TEXT.length - 1) $scope.selectedGestureTextIndex = 0;
                    $scope.newSweet.text = CONSTANTS.GESTURE.HELLO.TEXT[index];
                    break;
                case "sendGreetings":
                    if (index >= CONSTANTS.GESTURE.GREETING.TEXT.length - 1) $scope.selectedGestureTextIndex = 0;
                    $scope.newSweet.text = CONSTANTS.GESTURE.GREETING.TEXT[index];
                    break;
            }
        };

        $scope.getUserSweets = function () {
            sweetService.userSweets(function (rUserSweets) {
                $scope.safeApply(function () {
                    $scope.userSweets = rUserSweets;
                });
            });
        };

        $scope.$watch('userSweets', function () {
            //$log.info("$watch -> userSweets changed.");
            var userChannels = [];
            for (var i = 0; i < $scope.userSweets.length; i++) {
//           //$log.info($scope.userSweets[i].get("receiverPhone"));
                userChannels.push($scope.userSweets[i].get("receiverPhone"));
            }
//       //$log.info(userChannels);
            userService.getUserChannelsByIds(userChannels, function (rUserChannels) {
                $scope.safeApply(function () {
                    for (var i = 0; i < rUserChannels.length; i++) {
                        rUserChannels[i].get("channels").forEach(function (channel) {

                            for (var j = 0; j < $scope.userSweets.length; j++) {
//                          //$log.info($scope.userSweets[j].get("receiverPhone"));
//                          //$log.info(channel);
                                if (angular.equals($scope.userSweets[j].get("receiverPhone"), channel)) {
                                    if (rUserChannels[i].get("avatarURL")) {
                                        $scope.userSweets[j].set("receiverAvatar", rUserChannels[i].get("avatarURL"));
//                                //$log.info($scope.userSweets[j].get("receiverAvatar"));
                                    } else {
                                        $scope.userSweets[j].set("receiverAvatar", CONSTANTS.DEFAULT_AVATAR);
                                    }
                                }
                            }

                        });
                    }
                });
            });
        });

//    TODO:limit text size due to SMS limitation
//    TODO: check for empty fields

        $scope.sendSweet = function () {

            var updateAvailable = false;
            //console.log("Saving and delivering sweet: "+$scope.newSweet);

            UpdateService.checkForUpdates(function (rUpdateAvailable) {
                if (rUpdateAvailable) {
                    $log.info("---Software update is available. Page will reload---");
                    // window.location.reload();
                    updateAvailable = true;
                }
                else {
                    $location.path(CONSTANTS.ROUTES.USER_INTERACTION);
                }
            });


            sweetService.saveSweet($scope.newSweet, function (rSweet, rUserSweet) {
                //console.log(rSweet + " "+rUserSweet);
                sweetService.sendSweet(rSweet, $rootScope.fromEmailAddress, function (success) {
                    $scope.safeApply(function () {
                        if (!success) $rootScope.info.title = CONSTANTS.ERROR.DEFAULT;
                        if (updateAvailable) $window.location.reload();
                        $scope.newSweet = {};
                        $scope.resetNewSweetValues();
//                        TODO: do we need getUserSweets here?
                        $scope.getUserSweets();
                        $scope.loadSweets(rUserSweet);
                        $scope.loadInteractionData();
                        $rootScope.showInfobarMessage(CONSTANTS.SWEETNESS.MESSAGE.SENT, CONSTANTS.SHOW_MESSAGE_TIME);
                    });
                });
            });

        };

//  Bubble
        $scope.setGestureType = function (type) {
            $scope.newSweet.gestureType = type;
            sweetService.setGestureText(type, 0, function (text) {
                $scope.newSweet.text = text;
            });
        };
        //-------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------
        /*$scope.sendSweetPlace = function(friend) {

         $scope.allfriend = friend;
         $scope.magicButtonImage = $scope.allfriend['picture'];
         console.log("---sendSweetPlace() "+ _.pairs($scope.allfriend));

         $scope.section.sending = true;

         $location.path("/location/sweetsent");

         $scope.showGestureSendActions = true;
         $scope.section.sendingPlace = true;

         }

         $scope.cancelSweetPlace = function() {
         $scope.squeezed = false;
         $scope.hideFriendsList = false;
         $scope.showGestureSendActions = false;
         $scope.magicButtonImage = $scope.newSweet.senderPicture;
         $scope.gestures  = CONSTANTS.GESTURES;
         $scope.setMe();
         $scope.$parent.setSubActionsState(false);
         $location.path('/location/sweetplace');
         };*/

        $scope.sendPlaceSweetness = function (friend) {

            $scope.friend = friend;
            $scope.magicButtonImage = $scope.friend['picture']['data']['url'];
            console.log("---setFriend() " + _.pairs($scope.friend));

            $scope.section.sending = true;
            $location.path("/location/sent");

            $scope.showGestureSendActions = true;
            $scope.section.sendingPlace = true;
        }

        $scope.sendSweetnessGesture = function (gestureType, sweetId) {

            $scope.section.sending = true;
            //$location.path("/sweet/sent");

            if (sweetId) $scope.newSweet.replyToSweet = sweetId;
            $scope.newSweet.receiverPhone = $scope.friend["id"];
            $scope.newSweet.receiverName = $scope.friend["name"];
            $scope.newSweet.receiverChannel = $scope.friend["network"]
            $scope.newSweet.receiverPicture = $scope.friend["picture"]["data"]["url"];
            $scope.newSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[2];

            console.log($scope.newSweet.receiverName);
            console.log($scope.newSweet.gesture);
            console.log($scope.newSweet);
            console.log("----Kashif-------");

            $scope.newSweet.text = "Thank You!";
//            $scope.newSweet.template = $scope.newSweet.gesture.template;

            sweetService.saveSweet($scope.newSweet, function (rSweet, rUserSweet) {
                $scope.safeApply(function () {
                    $scope.sweets.push(rSweet);
                    $scope.sweets.sortByProp("updatedAt");
                });
//                var message = $rootScope.sweetPerson(rSweet.get("senderName")) + " "+ rSweet.get('text') + " " +$rootScope.sweetPersonMe(rSweet.get("receiverName"),rSweet.get("senderName"));
//                sweetService.setGestureText($scope.newSweet.gestureType,1,function(text) {
                $scope.safeApply(function () {
                    facebookService.postToWall(rSweet, $scope.newSweet.gesture.facebook_template, function (success) {
                        $scope.$parent.updateLoginInfo();
                        $scope.squeezed = false;

                        setTimeout(function () {
                            $scope.section.sending = false;
                            $scope.safeApply();
                        }, 4000);

                    });
                });
                $location.path("/location/place");
            });
            $scope.showGestureSendActions = false;
            $scope.section.sendingPlace = false;
        };

        /*$scope.sendSweetnessPlaceGesture = function(gestureType, sweetId) {

         $scope.section.sending = true;
         //$location.path("/sweet/sent");

         if(sweetId) $scope.newSweet.replyToSweet = sweetId;
         $scope.newSweet.receiverPhone = $scope.allfriend["id"];
         $scope.newSweet.receiverName = $scope.allfriend["name"];
         $scope.newSweet.receiverChannel = $scope.allfriend["network"]
         $scope.newSweet.receiverPicture = $scope.allfriend["picture"];
         $scope.newSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[2] ;

         console.log($scope.newSweet.receiverName);
         console.log($scope.newSweet.gesture);
         console.log($scope.allfriend);
         console.log("----KashifAll-------");

         $scope.newSweet.text = "Thank You, all of you";
         //            $scope.newSweet.template = $scope.newSweet.gesture.template;

         sweetService.saveSweet($scope.newSweet, function(rSweet,rUserSweet) {
         $scope.safeApply(function() {
         $scope.sweets.push(rSweet);
         $scope.sweets.sortByProp("updatedAt");
         });
         //                var message = $rootScope.sweetPerson(rSweet.get("senderName")) + " "+ rSweet.get('text') + " " +$rootScope.sweetPersonMe(rSweet.get("receiverName"),rSweet.get("senderName"));
         //                sweetService.setGestureText($scope.newSweet.gestureType,1,function(text) {
         $scope.safeApply(function() {
         facebookService.postToWall(rSweet,$scope.newSweet.gesture.facebook_template,function(success){
         $scope.$parent.updateLoginInfo();
         $scope.squeezed = false;

         setTimeout(function() {
         $scope.section.sending = false;
         $scope.safeApply();
         },4000);

         });
         });
         $location.path("/location/sweetplace");
         });
         $scope.showGestureSendActions = false;
         $scope.section.sendingPlace = false;
         };
         $scope.placeFriends = [
         {id: "625768481",
         name: "Hanzala Sharif",
         picture: "http://profile.ak.fbcdn.net/hprofile-ak-prn1/157696_625768481_2073800780_q.jpg",
         $$hashKey: "00C",
         network: "facebook"},
         {id: "225564",
         name: "Fahd Bangash",
         picture: "http://profile.ak.fbcdn.net/hprofile-ak-prn1/70321_225564_906314591_q.jpg",
         $$hashKey: "00A",
         network: "facebook"},
         {id: "100005526252504",
         name: "Kashif Abdullah",
         picture: "http://graph.facebook.com/kashif.abdullah.520/picture?type=large",
         //$$hashKey: "00C",
         network: "facebook"}

         ];
         $scope.phoneSweets = function() {
         var query = new Parse.Query("placeusers");

         query.get("kWQUnPONOk", {
         success:function(placeusers) {
         console.log("service: placeusers() -> "+_.pairs(placeusers));
         var friends = placeusers.data;
         },
         error:function() {
         console.log("service: placeusers() -> sweet not found.");
         }
         });
         }*/
        //--------------------------------------------------------------------------------------
        //--------------------------------------------------------------------------------------
        $scope.sendSweetness = function (gestureType, sweetId) {

            $scope.section.sending = true;
            $location.path("/sweet/sent");

            if (sweetId) $scope.newSweet.replyToSweet = sweetId;
            $scope.newSweet.receiverPhone = $scope.friend["id"];
            $scope.newSweet.receiverName = $scope.friend["name"];
            $scope.newSweet.receiverChannel = $scope.friend["network"]
            $scope.newSweet.receiverPicture = $scope.friend["picture"]["data"]["url"];

//            $scope.setGestureType(gestureType);

            console.log($scope.newSweet.receiverName);
            console.log($scope.newSweet.gesture);

            $scope.newSweet.text = "";
//            $scope.newSweet.template = $scope.newSweet.gesture.template;
            sweetService.saveSweet($scope.newSweet, function (rSweet, rUserSweet) {
                $scope.safeApply(function () {
                    $scope.sweets.push(rSweet);
                    $scope.sweets.sortByProp("updatedAt");
                });
//                var message = $rootScope.sweetPerson(rSweet.get("senderName")) + " "+ rSweet.get('text') + " " +$rootScope.sweetPersonMe(rSweet.get("receiverName"),rSweet.get("senderName"));
//                sweetService.setGestureText($scope.newSweet.gestureType,1,function(text) {
                $scope.safeApply(function () {
                    facebookService.postToWall(rSweet, $scope.newSweet.gesture.facebook_template, function (success) {
                        $scope.$parent.updateLoginInfo();
                        $scope.squeezed = false;

                        setTimeout(function () {
                            $scope.section.sending = false;
                            $scope.safeApply();
                        }, 4000);

                    });
                });

            });
            $scope.showGestureSendActions = false;
        };

        $scope.loadSocialNetworks = function (cb) {
            socialNetworksService.load(function (rSocialNetworks) {
                $scope.safeApply(function () {
                    var friendsArray = [];
                    $scope.socialNetworks = rSocialNetworks;
                    for (var i = 0; i < rSocialNetworks.length; i++) {
                        var friends = rSocialNetworks[i].get("friends");
                        for (var j = 0; j < friends.length; j++) {
                            friends[j]["network"] = rSocialNetworks[i].get("name");
                            friendsArray.push(friends[j]);
                        }

                    }
                    $scope.friends = friendsArray;

                    $scope.newSweet.senderName = $scope.socialNetworks[0].get('me')['first_name'] + " " + $scope.socialNetworks[0].get('me')['last_name'];
                    $scope.newSweet.senderPicture = $scope.socialNetworks[0].get('me')['picture'];
                    if ($scope.newSweet.senderPicture)
                        console.log("###Sender Picture### " + $scope.newSweet.senderPicture);
//                    $rootScope.sweeter.name = $scope.newSweet.senderName;
                    $rootScope.sweeter.picture = $scope.newSweet.senderPicture;

                    $scope.newSweet.senderChannel = $scope.socialNetworks[0].get('name');
                    $scope.newSweet.senderPhone = $scope.loggedInUser.get("authData")["facebook"]["id"];
                    console.log("---Facebook ID---" + $scope.newSweet.senderPhone);
                    console.log("---Facebook Name---" + $scope.newSweet.senderName);
//                    console.log($scope.friends);

//                    $scope.setMe();
                    cb("done");

                });
            });
        };

        $scope.searchFriend = function (friend) {
            $scope.section.showPeopleSearchBox = false;
            $scope.setFriend(friend);
            $location.path("/sweet/people");

        };

        $scope.setFriend = function (friend) {
            $scope.squeezed = false;
            $scope.gesture = CONSTANTS.GESTURES;
            $scope.hideFriendsList = true;

//            $scope.friend = JSON.parse(friend);

            $scope.friend = friend;
            //$scope.magicButtonImage = $scope.friend['picture']['data']['url'];
            $scope.magicButtonImage = "http://graph.facebook.com/" + $scope.friend['id'] + "/picture?width=200&height=200";
            console.log("---setFriend() " + _.pairs($scope.friend));
//            if(!$scope.squeezed)
//                $scope.enableGestureSendActions();
//            if($scope.squeezed)
//                $scope.sendSweetness();
//            if($scope.friend)
//                $location.path('/sweet/friend');
        };

        $scope.sendSqueeze = function (friend) {

            $scope.safeApply(function () {
                $scope.squeezed = true;
                $scope.newSweet.gesture = CONSTANTS.SQUEEZE;
                $scope.hideFriendsList = true;

                $scope.friend = friend;
                $scope.magicButtonImage = $scope.friend['picture']['data']['url'];
                console.log("---setFriend() " + _.pairs($scope.friend));
                //            if(!$scope.squeezed)
                $scope.enableGestureSendActions();
                //            if($scope.squeezed)
                //                $scope.sendSweetness();
                //            if($scope.friend)
                //                $location.path('/sweet/friend');
            });
        };


        $scope.$watch("friend", function (oldValue, newValue) {
            console.log("$scope.friend changed. " + _.pairs(oldValue) + "---" + _.pairs(newValue));
            $scope.sweets = [];
            if ($scope.friend) {
                $rootScope.sweeter.name = $scope.friend["name"]; //comment by kashif undo this change
                console.log($scope.friend);
//                $scope.twoWayInteraction();
            }
        }, true);

        $scope.twoWayInteraction = function () {

            var friendId = $scope.friend["id"];
            console.log("---$scope.twoWayInteraction friendId --- " + friendId);

            $scope.interaction = {};
            $scope.interaction[friendId] = {};
            $scope.interaction[friendId].sweets = [];
            $scope.interaction[friendId].mySweets = [];
            $scope.interaction[friendId].totalSweets = [];

            loadInteraction(userService.currentUser().id, friendId, function (rSweets) {
                $scope.interaction[friendId].sweets = rSweets;

                userService.getUserByChannel(friendId, function (rUser) {
                    if (rUser) {
                        console.log("---rUser---" + rUser.id);
                        loadInteraction(rUser.id, userService.currentUser().get("username"),
                            function (rSweets) {
                                $scope.interaction[friendId].sweets = $scope.interaction[friendId].sweets.concat(rSweets);
                            }
                        );
                    }
                });
            });
        };

        var loadInteraction = function (id, phone, cb) {
            console.log("---loadInteraction whose friendId--- " + id + " " + phone);
            interactionService.getInteractionWith(id, phone, function (rUserSweet) {
                if (rUserSweet) {
                    sweetService.getSweetsBySweetIds(rUserSweet.get("sweets"), function (rSweets) {
                        if (rSweets) {
//                            console.log("---RSWEETS--- "+ rSweets);
                            $scope.safeApply(function () {
                                cb(rSweets);
                            });
                        }
                    });
                }
                cb([]);
            });
        };

        $scope.sweetForInteraction = function (sweet) {

            $scope.safeApply(function () {
                console.log("---sweet_interaction---on ");
                $scope.hideFriendsList = true;

                $scope.friend = {};
                $scope.friend.id = sweet.get("senderPhone");
                $scope.friend.name = sweet.get("senderName");
                $scope.friend.network = sweet.get("senderChannel");

                $scope.friend.picture = {};
                $scope.friend.picture['data'] = {};
                $scope.friend.picture['data']['url'] = sweet.get("senderPicture");

                $scope.magicButtonImage = sweet.get("senderPicture");

                $rootScope.latestSweet = sweet;
            });

        };

        $scope.navToFeed = function () {
            $location.path("/sweet/feed");
        };

        $scope.navToFriend = function () {
            $location.path("/sweet/friend");
        };

        $scope.loadFeeds = function () {
            $scope.feeds = [];
            console.log("--loadFeeds--- " + userService.currentUser().get("username"));
            sweetService.getSweetsByReceiverPhone(userService.currentUser().get("username"), function (rSweets) {
                if (rSweets) {
                    $scope.safeApply(function () {
                        $scope.feeds = rSweets;
                    });
                }
            });
        };

        $scope.loadTimeline = function () {
            $scope.timelines = [];
            interactionService.getMyInteractions(function (rUserSweets) {
                if (rUserSweets) {
                    var sweetIds = [];
                    for (var i = 0; i < rUserSweets.length; i++) {
                        var sweets = rUserSweets[i].get("sweets");
                        sweets.forEach(function (e, i, a) {
                            sweetIds.push(e);
                        });
                    }
                    sweetService.getSweetsBySweetIds(sweetIds, function (rSweets) {
                        $scope.safeApply(function () {
                            $scope.timelines = rSweets;
                        });
                    });
                }

            });
        };

        //---------------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------
        $scope.cancelGestureActionPlace = function () {
            $scope.squeezed = false;
            $scope.showPlace();
        };

        $scope.showPlace = function () {

            $scope.hideFriendsList = false;
            $scope.showGestureSendActions = false;
            $scope.magicButtonImage = $scope.newSweet.senderPicture;
            $scope.gestures = CONSTANTS.GESTURES;
            $scope.setMe();
            $scope.$parent.setSubActionsState(false);
            $location.path('/location/place');
        };
        //----------------------------------------------------------------------------------------
        //----------------------------------------------------------------------------------------
        $scope.cancelGestureAction = function () {
            $scope.squeezed = false;
            $scope.showPeople();
        };

        $scope.showPeople = function () {

            $scope.hideFriendsList = false;
            $scope.showGestureSendActions = false;
            $scope.magicButtonImage = $scope.newSweet.senderPicture;
            $scope.gestures = CONSTANTS.GESTURES;
            $scope.setMe();
            $scope.$parent.setSubActionsState(false);
            $location.path('/sweet/people');
        };
        $scope.showFriendInteraction = function () {
            $location.path('/sweet/friend');
            $scope.setMe();
        };

        $scope.setMe = function () {
            var timeout = 2000;
            if (userService.currentUser() && userService.currentUser().get("authData")["facebook"]["id"])
                timeout = 0;

            setTimeout(function () {
                $scope.safeApply(function () {
                    $scope.friend = {};
                    $scope.friend.id = userService.currentUser().get("authData")["facebook"]["id"];

                    $scope.friend.name = $rootScope.userChannel.get("fullName");
                    $scope.friend.network = "facebook";

                    $scope.friend.picture = {};
                    $scope.friend.picture['data'] = {};
                    $scope.friend.picture['data']['url'] = $scope.newSweet.senderPicture;

                    $scope.magicButtonImage = $scope.newSweet.senderPicture;
                });
            }, timeout);

        };

        $scope.showFeed = function () {
            $scope.$parent.setLastVisitedPage();
            $location.path('/sweet/feed');
            $scope.loadFeeds();
        };
        $scope.showTimeline = function () {
            $scope.$parent.setLastVisitedPage();
            $location.path('/sweet/timeline');
            $scope.loadTimeline();
        };

        $scope.gestures = CONSTANTS.GESTURES;
        console.log($scope.gestures);
        $scope.updateGestures = function (gesture) {
            $scope.newSweet.gesture = _.omit(gesture, '$$hashKey');
            console.log("---Update--- " + _.pairs($scope.newSweet.gesture));
            if (gesture.sub_actions) {
                $scope.$parent.setSubActionsState(true);
                $scope.gestures = gesture.sub_actions;
            }
            if (!$scope.squeezed)
                $scope.enableGestureSendActions();
        };

        $scope.enableGestureSendActions = function () {
            if ($scope.friend && $scope.newSweet.gesture && !$scope.newSweet.gesture.sub_actions) {
                $scope.showGestureSendActions = true;
            }
        };

        $scope.$on('resetGestures', function () {
            $rootScope.latestSweet = {};
            $scope.gestures = CONSTANTS.GESTURES;
            $scope.showGestureSendActions = false;
//            $scope.showInteraction();
            $scope.showPeople();
        });

        $scope.friendSearch = function (mFriendSearchText) {
            if (mFriendSearchText.length > 2) {
                for (var i = 0; i < $scope.friends.length; i++) {
                    if ($scope.friends[i]['name'].toLowerCase().indexOf(mFriendSearchText.toLowerCase()) == 0) {
                        console.log($scope.friends[i]['name'].toLowerCase().indexOf(mFriendSearchText.toLowerCase()));
                        $scope.setFriend($scope.friends[i]);
                        $scope.section.friendSearchText = "";
                        $scope.section.showPeopleSearchBox = false;
                        break;
                    }
                }
            }
        };

        //       Squeeze

        $scope.squeezeCounter = 0;
        $scope.squeezeTimer;
        $scope.squeezeUp = function (e) {
            clearInterval($scope.squeezeTimer);
            $scope.squeezeTimer = 0;
            if ($scope.squeezeCounter >= 3) {
                $scope.squeezed = true;
                $scope.newSweet.gesture = CONSTANTS.SQUEEZE;
                console.log("Squeezed: " + _.pairs($scope.newSweet.gesture));

//                setTimeout(function() {
//                    $scope.safeApply(function() {
//                    });
//                },3000);

            }
            $scope.squeezeCounter = 0;

        };

        $scope.countDown = function () {
            $scope.safeApply(function () {
                $scope.squeezeCounter += 1;
            });
        };

        $scope.squeezeDown = function (e) {
            $scope.squeezedText = "Squeezed";
            $scope.squeezeCounter += 1;
            $scope.squeezeTimer = setInterval(function () {
                $scope.countDown()
            }, 1000);
        };

        $scope.$on('navigate_to_interaction', function () {
            console.log("---navigate_to_interaction---");
            $scope.safeApply(function () {
                $scope.sweets = [];
                $scope.twoWayInteraction();
                $scope.navToFriend();

            });
        });

        //       Squeeze End

        if (userService.currentUser().get("authData")) {
            console.log("$$$$$$$$$ " + interactionService.getSweetForInteraction());
            var sweet = interactionService.getSweetForInteraction();
            if (sweet) {
                $scope.sweetForInteraction(sweet);
//                interactionService.setSweetForInteraction(null);
            }
            $scope.loadSocialNetworks(function (done) {
                if (!sweet) {
                    $scope.setMe();
                }
                interactionService.setSweetForInteraction(null);
            });

//          $scope.getUserSweets();
        }
    }
}

// Define our root-level controller for the application.
function AppController($window, UpdateService, $http, $log, $scope, $route, $routeParams, $location, userService, facebookService, authService, sweetService, CONSTANTS, $rootScope, interactionService, localStorageService) {

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.updateLoginInfo = function () {
        $log.info("---Updating Login Info---");
        $scope.loggedInUser = userService.currentUser();
        var userLoggedIn = $scope.loggedInUser ? true : false;
        console.log("---ApplicationCtrl: loggedInUser: " + $scope.loggedInUser + ":" + userLoggedIn);
        $scope.isUserLoggedIn = userLoggedIn;
        if ($scope.loggedInUser && $scope.loggedInUser.get("authData")["facebook"]) {
            $scope.isFacebookAuthorized = true;
            $scope.facebookAuthorization = $scope.loggedInUser.get("authData")["facebook"];
        }

//        console.log("Parse/"+CONSTANTS.PARSE_API_ID+"/currentUser");
//        var lsCurrentUser = JSON.parse(localStorage.getItem("Parse/"+CONSTANTS.PARSE_API_ID+"/currentUser"));
//        console.log("---localStorage lsCurrentUser--- "+lsCurrentUser);
//        lsCurrentUser.authData.facebook.access_token = "haha";
//        console.log("---localStorage2--- "+ _.pairs(lsCurrentUser.authData.facebook));
//        localStorage.setItem("test",JSON.stringify(lsCurrentUser));


    };

//    $scope.$on("user_logged_in", function() {
//        $scope.updateLoginInfo();
//    });

//  Green button navigation

    $scope.showTopCircle = function () {
        return $scope.isInteractionPage();
    };

    $scope.isInteractionPage = function () {
        return ($scope.renderAction == "sweet.friend" || $scope.renderAction == "sweet.feed" || $scope.renderAction == "sweet.timeline");
    };

    $scope.setLastVisitedPage = function () {
        if (!$scope.isInteractionPage()) {
            $scope.lastVisitedPage = $location.path();
        }
    };

    $scope.navigateToInteraction = function () {
//        $scope.fNavigationToInteraction = true;
        $scope.setLastVisitedPage();
        $scope.$broadcast('navigate_to_interaction');
    };

    $scope.navigateToLastVisitedPage = function () {
//        $scope.fNavigationToInteraction = false;
        $location.path($scope.lastVisitedPage);
    };

    $scope.resetGestures = function () {
//        $scope.fNavigationToInteraction = false;
        $scope.setSubActionsState(false);
        $scope.$broadcast('resetGestures');
    };

    $scope.setSubActionsState = function (state) {
        $scope.sub_actions = state;
    };

    $scope.section = {};

    $scope.togglePeopleSearchBox = function () {
        $scope.section.showPeopleSearchBox = !$scope.section.showPeopleSearchBox;
    };

    $rootScope.info = {};
    //  $rootScope.info.title = "";
    $rootScope.defaultError = CONSTANTS.ERROR.DEFAULT;

    $rootScope.loadUserChannel = function () {
        //console.log("Loading user channel "+userService.currentUser().id);
        userService.loadUserChannel(userService.currentUser().id, function (rUserChannel) {
            //console.log("--- loadUserChannel --- "+rUserChannel);
            $scope.safeApply(function () {
                $rootScope.userChannel = rUserChannel;
                $rootScope.sweeter.name = $rootScope.userChannel.get("fullName"); //comment by kashif undo this change
            });
        });
    };

    if (userService.currentUser()) {
        $rootScope.loadUserChannel();
    }


//    $rootScope.sweetPerson = function(sweet) {
//        if(sweet) {
//            if(sweet.get("senderId") == userService.currentUser().id) return "You";
//            else return sweet.get("senderName").split(" ")[0];
//        }
//        else return;
//    };
//
//    $rootScope.sweetPersonMe = function(sweet) {
//        if(sweet) {
//    //        console.log(sweet.get("senderPhone"), sweet.get("receiverPhone"));
//    //        console.log(sweet);
//            if(sweet.get("receiverPhone") == sweet.get('senderPhone'))
//                return "yourself";
//            else if(sweet.get("receiverPhone") == userService.currentUser().get("username"))
//                return "you";
//            else
//                return sweet.get("receiverName").split(" ")[0];
//        }else {
//            return;
//        }
//    };


    $scope.goToHome = function () {
        window.location = "#/sweet/people";
        window.location.reload();
    }

    $scope.loadCanvas = function (imageBase64Contents, canvasId, width, height) {
        var canvas = document.getElementById(canvasId);
        canvas.width = canvas.width;//reset canvas;
        canvas.height = canvas.height;
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');

        var imageObj = new Image();
        imageObj.onload = function () {
            context.drawImage(imageObj, 0, 0);
        };
        imageObj.src = imageBase64Contents;
    };

    $scope.setuseravatar = function (avatar) {
        //console.log("---setUserAvatar called---");
        $rootScope.userChannel.set("avatarURL", avatar);
        $rootScope.userAvatar = $rootScope.userChannel.get("avatarURL");
        $rootScope.loadUserChannel();
    };

    $scope.showPreference = function () {
        $location.path("/user/preference");
    };

    $scope.userFirstName = function () {
//        return userService.currentUser().get("fullName").split(" ")[0];
    };

    $scope.logout = function () {
        userService.logout();
        $scope.safeApply(function () {
            $location.path(CONSTANTS.ROUTES.AUTH);
        });

    };

    // Update the rendering of the page.
    var render = function () {
        console.log("---Rendering---");

        $scope.safeApply(function () {
            $rootScope.latestSweet = {};
        });

        $scope.updateLoginInfo();

//        Non user + logout state + this device >
        if ($location.path() == '/' && !$scope.isUserLoggedIn) {
            console.log("constant auth: " + CONSTANTS.ROUTES.AUTH);
            $location.path(CONSTANTS.ROUTES.AUTH);
            $scope.showLogin = true;
        }

//        Existing user + logged in + this devise >
        if ($location.path() == '/' && $scope.isUserLoggedIn) {
            console.log("/ and logged in");
            $location.path(CONSTANTS.ROUTES.SWEET_HOME);
        }

        // Pull the "action" value out of the currently selected route.
        var renderAction = $route.current.action;
        var renderPath;
        // Also, let's update the render path so that we can start conditionally rendering parts of the page.
        if (renderAction)
            renderPath = renderAction.split(".");
        else
            renderPath = "";

        var isAuth = (renderPath[ 0 ] == "auth");
        var isAuthLink = (renderPath[ 0 ] == "authlink");
        var authToken = $routeParams.token;
        var isSweet = (renderPath[ 0 ] == "sweet");
        var isSweetness = (renderPath[ 0 ] == "s");
        var sweetId = $routeParams.sweetId;

        // Store the values in the model.
//        $scope.isUserLoggedIn = userLoggedIn;
        $rootScope.renderAction = renderAction;
        $rootScope.renderPath = renderPath;
        $scope.isSweet = isSweet;
        $scope.isSweetness = isSweetness;
        $scope.sweetId = sweetId;
        $scope.isAuth = isAuth;
        $scope.authToken = authToken;

        switch (renderAction) {
            case "sweet.friend":
            case "sweet.timeline":
            case "sweet.feed":
                $scope.wrapper = "wrapper-feeds";
                break;
            case "locations.place":
                $scope.wrapper = "wrapper-feeds-place";
                $rootScope.sweeter.name = "Sweet Place";
                break;
            default:
                $scope.wrapper = "wrapper";
                break;
        }

        console.log("Render Action: " + renderAction);
        console.log("Render Path0: " + renderPath[0]);
        console.log("Render Path1: " + renderPath[1]);

        if (isAuth && renderPath[1] == 'new' && $scope.isUserLoggedIn) {
            console.log("isAuth and new and loggedin");
            $location.path(CONSTANTS.ROUTES.SWEET_HOME);
        }

        if (isAuthLink && authToken && $scope.isUserLoggedIn) {
            console.log("isAuthLink and authToken and $scope.isUserLoggedIn");
            $location.path(CONSTANTS.ROUTES.SWEET_HOME);
        }

//      TODO: should old auth entries deleted when requested for the new one for the same phone?
//      User clicked on SMS auth
        if (isAuthLink && authToken) {
            authService.authenticate(authToken, function (rUser) {
                var redirectPage;
                if (rUser) {
                    console.log("authenticated...");
                    if (rUser.get("authData")) {
                        redirectPage = CONSTANTS.ROUTES.SWEET_HOME;
                    } else {
                        redirectPage = CONSTANTS.ROUTES.FRIENDS_DISCOVER;
                    }
                }
                else {
                    redirectPage = CONSTANTS.ROUTES.AUTH;
                }
                //TODO: Display info message
                $scope.safeApply(function () {
                    //console.log("Redirecting to "+redirectPage + " after authlink.");
                    $location.path(redirectPage)
                });
            });
        }

//      existing user + logged in user + this device + cliked on sweet link
//        if($scope.isUserLoggedIn && isSweet && sweetId) {
//            This should be handled by the route /sweet/show/:sweetId in app.js
//        }

        if (!$scope.isUserLoggedIn && isSweet && sweetId) {

        }

        if (isSweet) console.log("ApplicationCtrl: isSweet: " + isSweet);
        if (isSweetness) console.log("ApplicationCtrl: isSweetness: " + isSweetness);
        if (sweetId) console.log("ApplicationCtrl: sweetID: " + sweetId);
        console.log("ApplicationCtrl: renderPath[1]: " + renderPath[1]);

//      1. User logged in but not social authorization (call facebookLink)  2. User is not logged in (call facebook login)

        if (isSweetness && sweetId) {

            sweetService.getSweet(sweetId, function (rSweet) {
                console.log("Sweet retrieved from persistent storage: " + rSweet);
                if (rSweet) {
                    $scope.safeApply(function () {
                        interactionService.setSweetForInteraction(rSweet);
                        $location.path("/auth");
//                    if(!$scope.isUserLoggedIn) {
//                        facebookService.doLogin(function(rUser, rUserChannel) {
//                            $scope.safeApply(function() {
//                                if(rUserChannel)
//                                    $rootScope.loadUserChannel();
//
//                                $location.path("/sweet/people");
////                                $rootScope.$broadcast("sweet_interaction",rSweet);
//
//                            });
//                        });
//                    }
                        if ($scope.isUserLoggedIn && !$scope.isFacebookAuthorized) {
                            facebookService.doLink(function (rUser, rUserChannel) {
                                $scope.safeApply(function () {
                                    if (rUserChannel)
                                        $rootScope.loadUserChannel();
                                    interactionService.setSweetForInteraction(rSweet);
                                    $location.path("/sweet/people");
//                                $rootScope.$broadcast("sweet_interaction",rSweet);
                                });
                            });
                        }
                        if ($scope.isUserLoggedIn && $scope.isFacebookAuthorized) {
                            $rootScope.loadUserChannel();
                            interactionService.setSweetForInteraction(rSweet);
                            $location.path("/sweet/people");
//                        $rootScope.$broadcast("sweet_interaction",rSweet);
                        }
                    });
                }
            });
        }

        if (isSweet && sweetId && renderPath[1] == "auto") {
            console.log("--- ApplicationCtrl:AutoAcknowledge --- Render Action: " + renderAction + " Render Path: " + renderPath[1]);
            console.log("Sweet ID: " + sweetId);
//        If user not logged in then authenticate (create user if doesn't exists

            sweetService.getSweet(sweetId, function (rSweet) {
                console.log("Sweet retrieved from persistent storage: " + rSweet);
                if (rSweet) {
                    $scope.safeApply(function () {
                        authService.authenticationThroughSweet(rSweet, function (loggedIn) {
                            $scope.safeApply(function () {
                                $scope.loggedInUser = userService.currentUser();
                                $scope.isUserLoggedIn = true;
                            });

                            console.log("Authentication through Sweet is done.");
                            sweetService.autoAcknowledge(rSweet.id, function (rSweet, rUserSweet) {
                                //console.log("---Broadcast--- "+rUserSweet.get("receiverName"));
                                sweetService.sendIt(rSweet, "Sweetness Labs <sweet@sweetness.mailgun.org>", rSweet.get("text"), function (success) {
//                                    cb(success);
                                    $scope.safeApply(function () {

                                        interactionService.setInteraction(rUserSweet);
                                        $log.info("Auto: getInteraction: " + interactionService.getInteraction().get("senderName"));
                                        $log.info("Auto: getInteraction: " + interactionService.getInteraction().get("receiverName"));
                                        console.log("---Broadcast--- " + rUserSweet.get("receiverName"));
//                                       if(userService.currentUser())
//                                            $rootScope.$broadcast('user_interaction');
//                                       else
                                        $location.path("/sweet/userinteraction");
                                        $rootScope.$broadcast('user_interaction');
                                    });
                                });
                            });
                        });
                    });
                } else {
                    $scope.safeApply(function () {
                        console.log("getSweet() -> Sweet ID not found.");
                        if ($scope.isUserLoggedIn) $location.path("#/sweet/new");
                    });
                }
            });
        }
        $scope.showLogin = true;

    };
    // Listen for changes to the Route. When the route changes, let's set the renderAction model value so that it can render in the Strong element.
    $scope.$on(
        "$routeChangeSuccess",
        function ($currentRoute, $previousRoute) {
            render();
        }
    );
}

function AuthController($log, $scope, authService, $location, CONSTANTS, facebookService, userService, $rootScope) {

    $scope.clearData = function () {
        $scope.user = {
            fullName:null,
            phone:null
        };
    };

    $scope.newAuth = function () {

        //console.log("\n--- AuthController ---");
        //console.log("User phone: " + $scope.user.phone);
        //console.log("User fullname: " +$scope.user.fullName);
        authService.createAuth($scope.user.phone, $scope.user.fullName || "NoName");
        $scope.clearData();
//        TODO: add callback
        $location.path(CONSTANTS.ROUTES.AUTH_SENT);

    };

//    $scope.section.loginInProgress = false;
    $scope.facebookLogin = function () {

        $log.info("--Facebook Login---");
        $scope.safeApply(function () {
            $scope.section.loginInProgress = true;
            $scope.section.loginInProgressMsg = CONSTANTS.LOGIN_IN_PROGRESS;
        });

        Parse.FacebookUtils.logIn("publish_actions,email", {
            success:function (user) {
                if (!user.existed()) {
                    console.log("User signed up and logged in through Facebook!");
                } else {
                    console.log("User logged in through Facebook!");
                }
                facebookService.getExtendedToken(function (success) {
                    console.log("---Extended Token--- " + success);
                });
//                    cb(user);

                facebookService.updateUserInfo(user, function (rUser, rUserChannel) {
                    $scope.safeApply(function () {
                        $scope.section.loginInProgress = false;
                        if (rUserChannel)
                            $rootScope.loadUserChannel();
                        $location.path(CONSTANTS.ROUTES.SWEET_HOME);
                    });
                });

            },
            error:function (user, error) {
                console.log("User cancelled the Facebook login or did not fully authorize.");
                console.log(error.message);
//                    cb(null);
            }
        });

//        $log.info("--Facebook Login---");
//        $scope.safeApply(function() {
//            $scope.section.loginInProgress = true;
//            $scope.section.loginInProgressMsg = CONSTANTS.LOGIN_IN_PROGRESS;
//        });
//        facebookService.doLogin(function(rUser, rUserChannel) {
//            $scope.safeApply(function() {
//                $scope.section.loginInProgress = false;
//                if(rUserChannel)
//                    $rootScope.loadUserChannel();
//                $location.path(CONSTANTS.ROUTES.SWEET_HOME);
//            });
//        });
    };

    $scope.facebookLink = function () {
//        $log.info("--Facebook Link---");
//        facebookService.doLink(function(rUser, rUserChannel) {
//            $scope.safeApply(function() {
//                if(rUserChannel)
//                    $rootScope.loadUserChannel();
//                $location.path(CONSTANTS.ROUTES.SWEET_HOME);
//            });
//        });

        var user = userService.currentUser();
        if (!Parse.FacebookUtils.isLinked(user)) {
            Parse.FacebookUtils.link(user, CONSTANTS.SOCIAL.FACEBOOK.PERMISSIONS, {
                success:function (rUser) {
                    console.log("---link--- Woohoo, user logged in with Facebook!");
                    facebookService.getExtendedToken(function (success) {
                        console.log("---Extended Token--- " + success);
                    });
//                    cb(user);

                    facebookService.updateUserInfo(rUser, function (rUser, rUserChannel) {
                        $scope.safeApply(function () {
                            $scope.section.loginInProgress = false;
                            if (rUserChannel)
                                $rootScope.loadUserChannel();
                            $location.path(CONSTANTS.ROUTES.SWEET_HOME);
                        });
                    });
//                    cb(rUser);
                },
                error:function (user, error) {
                    console.log("---link--- User cancelled the Facebook login or did not fully authorize.");
                    console.log(error.message);
//                    cb(null);
                }
            });
        } else {
            facebookService.updateUserInfo(user, function (rUser, rUserChannel) {
                $scope.safeApply(function () {
                    $scope.section.loginInProgress = false;
                    if (rUserChannel)
                        $rootScope.loadUserChannel();
                    $location.path(CONSTANTS.ROUTES.SWEET_HOME);
                });
            });

//            cb(user);
        }

    };

}

function HelpCtrl($scope, authService, $location, CONSTANTS, helpService) {
    $scope.help = {};

    $scope.helpMe = function () {
        helpService.submit($scope.loggedInUser.get('fullName')
            , $scope.loggedInUser.get('username')
            , $scope.help.text, function () {
                $scope.help.text = "";
                $scope.safeApply($location.path("/help/sent"));
            });
    };

}

function ContactCtrl($scope, contactService, userService, $rootScope, $location) {
    $scope.source = [];
    $scope.emails = {};
    contactService.getContacts(function (response) {
            if (response) {
                $scope.safeApply(function () {
                    $scope.gmailUserContacts = response.get("gmail");
                    $scope.yahooUserContacts = response.get("yahoo");
                    var allcontacts = $scope.gmailUserContacts.concat($scope.yahooUserContacts);
                    for (var i = 0; i < allcontacts.length; i++) {
                        if (allcontacts[i] != null) {
                            $scope.source.push(allcontacts[i].name);
                            $scope.emails[allcontacts[i].name] = allcontacts[i].email;

                        }
                    }
                });
            }
        }
    );
}

function UserCtrl($log, $scope, sweetService, interactionService, authService, userService, $location, utilService, $rootScope, CONSTANTS) {
    $scope.showPreference = function () {
        $location.path("#/user/preference");
    };
}

function AdminCtrl($log, $scope, sweetService, userService, adminService, CONSTANTS) {

    $scope.bulkSweet = {};
    $scope.bulkSweet.text = CONSTANTS.DEFAULT_GESTURE_TEXT;

    $scope.createBulkGestures = function () {
        $scope.bulkSweet["senderId"] = userService.currentUser().id;
        $scope.bulkSweet["senderName"] = $scope.loggedInUser.get('fullName');
        $scope.bulkSweet["senderPhone"] = $scope.loggedInUser.get('username');

        $scope.bulkSweet["gestureType"] = CONSTANTS.DEFAULT_GESTURE_TYPE;
        //            pSweet.set("picture", sweet.picture.url);
        $scope.bulkSweet["star"] = true;
        $scope.bulkSweet["heart"] = false;
        $scope.bulkSweet["text"] = $scope.bulkSweet.text;
        $scope.bulkSweet["greetingBackground"] = CONSTANTS.DEFAULT_GREETING_BACKGROUND;
        $scope.bulkSweet["fontColor"] = CONSTANTS.DEFAULT_FONT_COLOR;

        adminService.createBulkGestures($scope.bulkSweet, function (success) {
            if (success) {
                $scope.bulkCreationStatus = CONSTANTS.BULK_EMAIL.SENT_MSG;
            }
        });
    };
}

//==================================================================================================
//  Define new controller for place pages
//==================================================================================================
function SweetCtrlPlace($window, UpdateService, $log, $scope, sweetService, interactionService, authService, userService, $location, utilService, $rootScope, CONSTANTS, socialNetworksService, facebookService) {

    $scope.isUserLoggedIn = true;

    $scope.sweet = {};
    $scope.userSweets = [];
    $scope.newSweet = {};
    $scope.sweets = [];

    $scope.resetNewSweetValues = function () {

        $scope.newSweet.gestureType = CONSTANTS.DEFAULT_GESTURE_TYPE;
        $scope.newSweet.text = CONSTANTS.DEFAULT_GESTURE_TEXT;
        $scope.newSweet.picture = false;
        $scope.showFileSelect = false;

        $scope.selectedGestureTextIndex = 0;
        $scope.newSweet.starImage = CONSTANTS.EXPRESSIONS.STAR_DEFAULT_IMAGE;
        $scope.newSweet.heartImage = CONSTANTS.EXPRESSIONS.HEART_DEFAULT_IMAGE;

        $scope.selectedGreetingBackgroundIndex = 0;
        $scope.newSweet.greetingBackground = CONSTANTS.GREETING_BACKGROUNDS[0];

        $scope.selectedFontColorIndex = 0;
        $scope.newSweet.fontColor = CONSTANTS.FONT_COLORS[0];
    }


    $scope.resetNewSweetValues();


    $scope.sendSweetPlace = function (friend) {

        $scope.allfriend = friend;
        $scope.magicButtonImage = $scope.allfriend['picture'];
        console.log("---sendSweetPlace() " + _.pairs($scope.allfriend));

        $scope.section.sending = true;

        $location.path("/location/sweetsent");

        $scope.showGestureSendActions = true;
        $scope.section.sendingPlace = true;

    }

    $scope.cancelSweetPlace = function () {
        $scope.squeezed = false;
        $scope.hideFriendsList = false;
        $scope.showGestureSendActions = false;
        $scope.magicButtonImage = $scope.newSweet.senderPicture;
        $scope.gestures = CONSTANTS.GESTURES;
        $scope.setMe();
        $scope.$parent.setSubActionsState(false);
        $location.path('/location/sweetplace');
    };

    $scope.sendPlaceSweetness = function (friend) {

        $scope.friend = friend;
        $scope.magicButtonImage = $scope.friend['picture']['data']['url'];
        console.log("---setFriend() " + _.pairs($scope.friend));

        $scope.section.sending = true;
        $location.path("/location/sent");

        $scope.showGestureSendActions = true;
        $scope.section.sendingPlace = true;
    }


    $scope.sendSweetnessPlaceGesture = function (gestureType, sweetId) {

        $scope.section.sending = true;
        //$location.path("/sweet/sent");

        if (sweetId) $scope.newSweet.replyToSweet = sweetId;
        $scope.newSweet.receiverPhone = $scope.allfriend["id"];
        $scope.newSweet.receiverName = $scope.allfriend["name"];
        $scope.newSweet.receiverChannel = $scope.allfriend["network"]
        $scope.newSweet.receiverPicture = $scope.allfriend["picture"];
        $scope.newSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[2];

        $scope.newSweet.senderId = "miscellaneous";
        $scope.newSweet.senderName = "SweetCustomer";
        $scope.newSweet.senderPhone = "miscellaneous";
        $scope.newSweet.senderChannel = "miscellaneous";
        $scope.newSweet.senderPicture = "img/thanx.png";

        console.log($scope.newSweet.receiverName);
        console.log($scope.newSweet.gesture);
        console.log($scope.allfriend);
        console.log("----KashifAll-------");

        $scope.newSweet.text = "Thank You, all of you";
//            $scope.newSweet.template = $scope.newSweet.gesture.template;

        sweetService.saveSweetPlace($scope.newSweet, function (rSweet, rUserSweet) {
            $location.path("/location/sweetplace");
            $scope.safeApply(function () {
                $scope.sweets.push(rSweet);
                $scope.sweets.sortByProp("updatedAt");
            });
//                var message = $rootScope.sweetPerson(rSweet.get("senderName")) + " "+ rSweet.get('text') + " " +$rootScope.sweetPersonMe(rSweet.get("receiverName"),rSweet.get("senderName"));
//                sweetService.setGestureText($scope.newSweet.gestureType,1,function(text) {
            $scope.safeApply(function () {
                facebookService.postToWall(rSweet, $scope.newSweet.gesture.facebook_template, function (success) {
                    $scope.$parent.updateLoginInfo();
                    $scope.squeezed = false;

                    setTimeout(function () {
                        $scope.section.sending = false;
                        $scope.safeApply();
                    }, 4000);

                });
            });

        });
        $scope.showGestureSendActions = false;
        $scope.section.sendingPlace = false;
        //$location.path("/location/sweetplace");
    };
    $scope.placeFriends = [
        {id:"625768481",
            name:"Andrea",
            picture:"img/Andrea.JPG",
            $$hashKey:"00C",
            network:"facebook"},
        {id:"100005526252504",
            name:"Charles",
            picture:"img/charles.JPG",
            //$$hashKey: "00C",
            network:"facebook"},
        {id:"225564",
            name:"Fahd",
            picture:"img/Fahd.JPG",
            $$hashKey:"00A",
            network:"facebook"}
    ];
    $scope.phoneSweets = function () {
        var query = new Parse.Query("placeusers");

        query.get("kWQUnPONOk", {
            success:function (placeusers) {
                console.log("service: placeusers() -> " + _.pairs(placeusers));
                var friends = placeusers.data;
            },
            error:function () {
                console.log("service: placeusers() -> sweet not found.");
            }
        });
    }


    $scope.setMe = function () {
        var timeout = 2000;
        if (userService.currentUser() && userService.currentUser().get("authData")["facebook"]["id"])
            timeout = 0;

        setTimeout(function () {
            $scope.safeApply(function () {
                $scope.friend = {};
                $scope.friend.id = userService.currentUser().get("authData")["facebook"]["id"];

                $scope.friend.name = $rootScope.userChannel.get("fullName");
                $scope.friend.network = "facebook";

                $scope.friend.picture = {};
                $scope.friend.picture['data'] = {};
                $scope.friend.picture['data']['url'] = $scope.newSweet.senderPicture;

                $scope.magicButtonImage = $scope.newSweet.senderPicture;
            });
        }, timeout);

    };

}
