'use strict';

function SweetCtrl($window, UpdateService, $log, $scope, sweetService, interactionService, authService,
                   userService, $location, utilService, $rootScope, CONSTANTS, socialNetworksService, facebookService) {
    if (!userService.currentUser()) {
        $location.path(CONSTANTS.ROUTES.AUTH);
    } else {

        $scope.comeOn = 'be consistent';

        $scope.currentPage = 0;
        $scope.currentPagePlace = 0;
        $scope.currentPageInteraction = 0;
        $scope.pageSize = CONSTANTS.DEFAULT_AVATAR_PAGINATION_SIZE;
        $scope.pageSizePlace = CONSTANTS.DEFAULT_AVATAR_PAGINATION_SIZE_PLACE;
        $scope.toggleAvatarIcon = CONSTANTS.GLYPH_ICONS.PLUS;

        $scope.interactionData = {};
        $scope.feeds = [];
        $scope.timelines = [];

        $scope.hello = "Hello Sweet Controller!";
        $scope.sweet = {};
        $scope.userSweets = [];
        $scope.sweets = [];

        $scope.newSweet = {};
        $scope.newPlace = {};
        $scope.addsweetplace = {};
        $scope.userPlaces = [];
        $scope.userPlacesJoinReq = [];

        // These 2 properties will be set when clicking on the map
        $scope.clickedLatitudeProperty = null;
        $scope.clickedLongitudeProperty = null;

        /** the initial center of the map */
        $scope.centerProperty = {
            latitude:45,
            longitude:-73
        };

        /** the initial zoom level of the map */
        $scope.zoomProperty = 8;

        /** list of markers to put in the map */
        $scope.markersProperty = [
            {
                latitude:45,
                longitude:-74
            }
        ];

        $scope.placeAlert = {};

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

        $scope.prevPage_place = function () {
            if ($scope.currentPagePlace > 0) {
                $scope.currentPagePlace--;
            }
        };

        $scope.nextPage_place = function () {
            console.log("nextPage_place: " + $scope.currentPagePlace * $scope.pageSize);
            console.log("nextPage_place: " + $rootScope.listPlaces.length);
            if ((( ($scope.currentPagePlace + 1) * $scope.pageSize) < $rootScope.listPlaces.length - 1) && $scope.pageSize != $rootScope.listPlaces.length) {
                $scope.currentPagePlace++;
            }
        };

        $scope.prevPage_interaction = function () {
            if ($scope.currentPageInteraction > 0) {
                $scope.currentPageInteraction--;
            }
        };

        $scope.nextPage_interaction = function () {
            console.log("nextPage InterAction: " + $scope.currentPageInteraction * $scope.pageSize);
            console.log("nextPage InterAction $scope.timelines.length: " + $scope.timelines.length);
            if ((( ($scope.currentPageInteraction + 1) * $scope.pageSize) < $scope.timelines.length - 1) && $scope.pageSize != $scope.timelines.length) {
                console.log("nextPage InterAction: " + $scope.currentPageInteraction++);
                $scope.currentPageInteraction++;
            }
        };

        $scope.prevPage_placesweet = function () {
            if ($scope.currentPageInteraction > 0) {
                $scope.currentPageInteraction--;
            }
        };

        $scope.nextPage_placesweet = function () {
            console.log("nextPage InterAction: " + $scope.currentPageInteraction * $scope.pageSizePlace);
            console.log("nextPage InterAction $scope.timelines.length: " + $rootScope.placeSweets.length);
            if ((( ($scope.currentPageInteraction + 1) * $scope.pageSizePlace) < $rootScope.placeSweets.length - 1) && $scope.pageSizePlace != $rootScope.placeSweets.length) {
                console.log("nextPage InterAction: " + $scope.currentPageInteraction++);
                $scope.currentPageInteraction++;
            }
        };

        $scope.hideAutoReply = function (item) {
            return item.get("auto") != 'true';
        };

        $scope.setting = function () {
            console.log("logout process start.");
            $scope.setLastVisitedPage();
            $location.path('/user/setting');
        }
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

        $scope.sendSweetnessGesture = function (gestureType, sweetId) {

            $scope.section.sending = true;
            //$location.path("/sweet/sent");

            if (sweetId) $scope.newSweet.replyToSweet = sweetId;
            $scope.newSweet.receiverPhone = $scope.friend["id"];
            $scope.newSweet.receiverName = $scope.friend["name"];
            $scope.newSweet.receiverChannel = $scope.friend["network"];
            $scope.newSweet.receiverPicture = $scope.friend["picture"]["data"]["url"];
            $scope.newSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[2];

            console.log($scope.newSweet.receiverName);
            console.log($scope.newSweet.gesture);
            console.log($scope.newSweet);
            console.log("----Kashif-------");

            $scope.newSweet.text = "Thank You";
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

        $scope.sendSweetnessPlaceGesture = function (gestureType, sweetId) {

            $scope.section.sending = true;
            //$location.path("/sweet/sent");

            if (sweetId) $scope.newSweet.replyToSweet = sweetId;
            $scope.newSweet.receiverPhone = $scope.allfriend["id"];
            $scope.newSweet.receiverName = $scope.allfriend["name"];
            $scope.newSweet.receiverChannel = $scope.allfriend["network"];
            $scope.newSweet.receiverPicture = $scope.allfriend["picture"];
            $scope.newSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[2];

            console.log($scope.newSweet.receiverName);
            console.log($scope.newSweet.gesture);
            console.log($scope.allfriend);
            console.log("----KashifAll-------");

            $scope.newSweet.text = "Thank You, all of you";
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
                $location.path("/location/sweetplace");
            });

            $scope.showGestureSendActions = false;
            $scope.section.sendingPlace = false;
        };
        $scope.placeFriends = [
            {id:"625768481",
                name:"Hanzala Sharif",
                picture:"http://profile.ak.fbcdn.net/hprofile-ak-prn1/157696_625768481_2073800780_q.jpg",
                $$hashKey:"00C",
                network:"facebook"},
            {id:"225564",
                name:"Fahd Bangash",
                picture:"http://profile.ak.fbcdn.net/hprofile-ak-prn1/70321_225564_906314591_q.jpg",
                $$hashKey:"00A",
                network:"facebook"},
            {id:"100005526252504",
                name:"Kashif Abdullah",
                picture:"http://graph.facebook.com/kashif.abdullah.520/picture?type=large",
                //$$hashKey: "00C",
                network:"facebook"}

        ];
        /*$scope.phoneSweets = function() {
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
            $scope.newSweet.receiverChannel = $scope.friend["network"];
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
            $scope.magicButtonImage = $scope.friend['picture']['data']['url'];
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

            //$scope.magicButtonImage = userService.currentUser().get("authData")['picture']['data']['url'];

            $scope.sweets = [];
            if ($scope.friend) {
                $rootScope.sweeter.name = $scope.friend["name"]; //comment by kashif undo this change
                console.log($scope.friend);
//                $scope.twoWayInteraction();
            }

            sweetService.getUserPlaces($scope.friend.id, function (placeUserSweets) {
                //console.log("Successfully retrieved placeUserSweets " + placeUserSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.listPlaces = placeUserSweets;
                    //console.log("Successfully retrieved listPlaces " + $rootScope.listPlaces.length + " scores.");
                });
            });

            sweetService.getPlaces(function (placeSweets) {
                //console.log("Successfully retrieved place" + placeSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.places = placeSweets;
                });
            });

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
            //$location.path("/sweet/friend");
            $location.path("/place/friend");
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
            $scope.timelinesfollow = [];
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
                            console.log("sweet length timelines" + $scope.timelines.length);
                        });
                    });

                    sweetService.getUserFollowingSweet(function (fSweets) {
                        console.log("get follow places sweets" + fSweets.length);
                        $scope.timelinesfollow = fSweets;
                        $scope.timelinesfollow = $scope.timelinesfollow.concat($scope.timelines);
                        console.log("get follow places sweets -->" + $scope.timelinesfollow.length);
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

        //Replication of above function for use in alpha
        $scope.showFeedPlace = function () {
            $scope.$parent.setLastVisitedPage();
            $location.path('/place/feed');
            $scope.loadFeeds();
        };

        $scope.showTimelinePlace = function () {
            $scope.$parent.setLastVisitedPage();
            $location.path('/place/timeline');
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

        // Sweet place

        $scope.navigateToSweetPlace = function () {

            $scope.setMe();
            $scope.$parent.setLastVisitedPage();
            $scope.loadPlace();
            //$scope.myPlace();
            $rootScope.sweeter.name = $scope.newSweet.senderName;
            $scope.magicButtonImage = $scope.newSweet.senderPicture;
            $scope.section.friendSearchText = "";

            $rootScope.listPlaces = [];

            sweetService.getUserPlaces($scope.friend.id, function (placeUserSweets) {
                //console.log("Successfully retrieved placeUserSweets " + placeUserSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.listPlaces = placeUserSweets;
                    //console.log("Successfully retrieved listPlaces " + $rootScope.listPlaces.length + " scores.");
                });
            });

            $location.path('/place/sweetPlace');
            //$scope.loadTimeline();
        };

        $scope.showFeedPlace = function () {
            $scope.$parent.setLastVisitedPage();
            $scope.setMe();
            $location.path('/place/feed');
            $scope.loadFeeds();
        };

        $scope.showTimelinePlace = function () {
            $scope.$parent.setLastVisitedPage();
            $location.path('/place/timeline');
            $scope.loadTimeline();
        };

        $scope.showTimelinePlaceTest = function () {
            $scope.$parent.setLastVisitedPage();
            $scope.loadTimeline();
            $location.path('/place/interAction');
        };

        $scope.showTimelinePlaceTestP = function () {
            $scope.$parent.setLastVisitedPage();
            $scope.loadTimeline();
            $location.path('/place/interActionP');
        };

        $scope.createSweetPlace = function () {

            $location.path('/place/createSweetPlace');
            $scope.setLastVisitedPage();
            //$scope.hideFriendsList = false;
            $scope.placeMsg = false;
            //$scope.magicButtonImage = $scope.newSweet.senderPicture;
            //$scope.gestures  = CONSTANTS.GESTURES;
            $scope.setMe();

            //$scope.$parent.setSubActionsState(false);


            $scope.initializeGMap($scope);
        };

        //       Squeeze End

        $scope.creatPlaceParse = function (place) {

            $scope.newPlace = [];
            $rootScope.currentPlace = [];

            console.log("-->> Address" + document.getElementById("target").value);
            console.log("-->>title " + place.title);
            //console.log("-->>" + place.description);
            //console.log("-->>" + place.url);
            //console.log("-->>" + document.getElementById("Latitude").value);
            //console.log("-->>" + document.getElementById("Longitude").value);

            $scope.newPlace.placeName = place.name;
            $scope.newPlace.placeTitle = place.title;
            $scope.newPlace.placeSweetName = '';
            //$scope.newPlace.placeAddress2 = document.getElementById("target").value;
            $scope.newPlace.placeAddress2 = place.address2;

            if ($rootScope.userAvatar == false){
                $scope.newPlace.placePhoto = 'http://files.parse.com/7ddeea41-9b34-46f5-b20f-1e58e72ef6ee/d0296c4c-a48e-4742-a8b9-664c7ad5ee96-DSC_0144.JPG';
            } else {
                $scope.newPlace.placePhoto = $rootScope.userAvatar ;
            }

            $scope.newPlace.placeDesc = '';
            $scope.newPlace.placeURL = '';
            $scope.newPlace.placeLatitude = '';
            $scope.newPlace.placeLongitude = '';

            $scope.newPlace.LatLong = $rootScope.placeSearchResults.LatLong;
            //$scope.newPlace.photo = $rootScope.placeSearchResults.photo ;
            $scope.newPlace.gname = $rootScope.placeSearchResults.gname;
            $scope.newPlace.icon = $rootScope.placeSearchResults.icon;
            $scope.newPlace.formatted_address = $rootScope.placeSearchResults.formatted_address;

            sweetService.saveSweetPlaceParse($scope.newPlace, function (results) {
                //$location.path('/place/sweetPlace');
                //$scope.searchSweetPlace();
                if (results.length == 0) {

                    $scope.newPlace.placeCreatorId = userService.currentUser().id
                    $scope.newPlace.userID = $scope.friend.id;
                    $scope.newPlace.userName = $scope.friend.name;
                    $scope.newPlace.userNetwork = $scope.friend.network;
                    $scope.newPlace.userPic = $scope.friend.picture['data']['url'];
                    $scope.newPlace.joinReq = "1";

                    //add the place in current user profile
                    //addSweetPlaceParse - add user to place
                    sweetService.addSweetPlaceParse($scope.newPlace, function () {

                        $scope.showPlaceAfterCreate($scope.newPlace);

                    });

                    //after creating place go backto myplaces location
                    //$scope.showPlaceNew();
                    //$scope.showPlaceAfterCreate($scope.newPlace);

                    //$location.path('/place/showPlace');
                }
                if (results.length > 0) {
                    console.log("---->" + results.length);

                    $location.path('/place/createSweetPlace');
                    $scope.setLastVisitedPage();
                    $scope.placeMsg = true;
                    $scope.setMe();

                    $scope.initializeGMap($scope);
                }
            });
        }

        /*$scope.createSweetPlace1 = function() {

         $location.path('/place/createSweetPlace');
         $scope.setLastVisitedPage();
         //$scope.hideFriendsList = false;
         $scope.placeMsg = true;
         //$scope.magicButtonImage = $scope.newSweet.senderPicture;
         //$scope.gestures  = CONSTANTS.GESTURES;
         $scope.setMe();

         //$scope.$parent.setSubActionsState(false);


         $scope.initializeGMap($scope);
         };*/

        $scope.showPlaceAfterCreate = function (place) {

            $rootScope.usersInPlaces = [];
            $rootScope.currentPlace = [];
            $rootScope.placeSweets = [];

            console.log("placeName -->>" + place.placeName);
            console.log("placeDesc-->>" + place.placeDesc);
            console.log("placeSweetName-->>" + place.placeSweetName);
            console.log("placeURL-->>" + place.placeURL);
            console.log("placeCreatorId-->>" + place.placeCreatorId);
            console.log("placeLatitude-->>" + place.placeLatitude);
            console.log("placeLongitude-->>" + place.placeLongitude);
            console.log("$scope.friend.id -- >" + $scope.friend.id);

            $rootScope.currentPlace = place;


            sweetService.getPlacesSweets(place.placeName, function (placeSweets) {
                console.log("Successfully retrieved place sweets " + placeSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.placeSweets = placeSweets;
                });
            });

            sweetService.getPlacestoJoin(place.placeName, $scope.friend.id, function (placeDetailSweets) {
                console.log("Successfully retrieved join user " + placeDetailSweets.length + " scores.");
                if (placeDetailSweets.length == 0) {
                    $rootScope.placeJoin = true;
                } else {
                    $rootScope.placeJoin = false;
                }
            });

            sweetService.getPlacesDetail(place.placeName, function (placeDetailSweets) {
                console.log("Successfully retrieved placeDetailSweets" + placeDetailSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.usersInPlaces = placeDetailSweets;
                });
            });
            $location.path('/place/showPlace');
        }

        $scope.placeReload = function () {
            /*$scope.placeMsg = false;
             $location.path('/place/createSweetPlace');
             window.location.reload();*/
            $scope.createSweetPlace();
        }

        $scope.showPlaceNew = function () {
            $scope.setMe();
            $scope.$parent.setLastVisitedPage();

            // $scope.myPlace();
            //load place is user for search places
            //$scope.loadPlace();
            //$location.path('/place/searchPlace');

            sweetService.getUserPlaces($scope.friend.id, function (placeUserSweets) {
                console.log("Successfully retrieved " + placeUserSweets.length + " scores.");
                $scope.safeApply(function () {
                    $scope.userAddedPlaces = placeUserSweets;
                });
            });

            sweetService.getUserCreatedPlaces($scope.friend.id, function (placeUserSweets) {
                console.log("Successfully retrieved " + placeUserSweets.length + " scores.");
                $scope.safeApply(function () {
                    $scope.userPlaces = placeUserSweets;
                });
            });

            //TODO : uncomment this when need join request on myplaces
            /*sweetService.getUserPlacesJoinReq($scope.friend.id , function(placeUserJoinReqSweets) {
             console.log("Successfully retrieved " + placeUserJoinReqSweets.length + " scores.");
             $scope.safeApply(function() {
             $scope.userPlacesJoinReq = placeUserJoinReqSweets;
             });
             });*/
            $location.path('/place/myplaces');
        };

        $scope.loadPlace = function (cb) {
            $rootScope.places = [];
            sweetService.getPlaces(function (placeSweets) {
                console.log("Successfully retrieved place" + placeSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.places = placeSweets;
                });
            });

        };

        $scope.joinPlace = function (place) {
            $scope.currentPlace = [];
            $scope.currentPlace = place;
        }

        $scope.addPlace = function (place) {

            $scope.setLastVisitedPage();

            console.log("placeName-->>" + place.get("placeName"));
            //console.log("-->>" + place.get("placeDesc"));
            console.log("placeSweetName-->>" + place.get("placeSweetName"));
            //console.log("-->>" + place.get("placeURL"));
            console.log("placeCreatorId-->>" + place.get("placeCreatorId"));
            //console.log("-->>" + place.get("placeLatitude"));
            //console.log("-->>" + place.get("placeLongitude"));

            console.log("-->>" + $scope.friend.id);
            console.log("-->>" + $scope.friend.name);
            console.log("-->>" + $scope.friend.network);
            console.log("-->>" + $scope.friend.picture['data']['url']);

            //$scope.addsweetplace.placecid = place.get("objectId") ;
            $scope.addsweetplace.placeCreatorId = place.get("placeCreatorId");
            $scope.addsweetplace.placeName = place.get("placeName");
            $scope.addsweetplace.placeDesc = place.get("placeDesc");
            $scope.addsweetplace.placeSweetName = place.get("placeSweetName");
            $scope.addsweetplace.placeURL = place.get("placeURL");
            $scope.addsweetplace.placeLatitude = place.get("placeLatitude");
            $scope.addsweetplace.placeLongitude = place.get("placeLongitude");
            //$scope.addsweetplace.placeaddress = place.get("placeaddress") ;

            $scope.addsweetplace.LatLong = place.get("LatLong");
            //$scope.addsweetplace.photo = place.get("photo") ;
            $scope.addsweetplace.gname = place.get("gname");
            $scope.addsweetplace.icon = place.get("icon");

            $scope.addsweetplace.userID = $scope.friend.id;
            $scope.addsweetplace.userName = $scope.friend.name;
            $scope.addsweetplace.userNetwork = $scope.friend.network;
            $scope.addsweetplace.userPic = $scope.friend.picture['data']['url'];

            sweetService.addSweetPlaceParse($scope.addsweetplace, function () {

            });
            $scope.navigateToSweetPlace();
        }

        $scope.addPlaceDirect = function (place) {

            console.log("-->>" + place.name);
            console.log("-->>" + place.description);
            console.log("-->>" + place.sweetname);
            console.log("-->>" + place.url);
            console.log("-->>" + place.placeCreatorId);
            console.log("-->>" + document.getElementById("Latitude").value);
            console.log("-->>" + document.getElementById("Longitude").value);

            console.log("-->>" + $scope.friend.id);
            console.log("-->>" + $scope.friend.name);
            console.log("-->>" + $scope.friend.network);
            console.log("-->>" + $scope.friend.picture['data']['url']);

            //$scope.addsweetplace.placecid = place.get("objectId") ;
            $scope.addsweetplace.placecreatorid = place.placeCreatorId;
            $scope.addsweetplace.placename = place.name;
            $scope.addsweetplace.placedesc = place.description;
            $scope.addsweetplace.placesweetname = place.sweetname;
            $scope.addsweetplace.placeurl = place.url;
            $scope.addsweetplace.placelatitude = document.getElementById("Latitude").value;
            $scope.addsweetplace.placelongitude = document.getElementById("Longitude").value;

            $scope.addsweetplace.userID = $scope.friend.id;
            $scope.addsweetplace.userName = $scope.friend.name;
            $scope.addsweetplace.userNetwork = $scope.friend.network;
            $scope.addsweetplace.userPic = $scope.friend.picture['data']['url'];

            sweetService.addSweetPlaceParse($scope.addsweetplace, function () {

            });
            $scope.navigateToSweetPlace();
        }

        $scope.myPlace = function () {

            console.log("-->>friend.id" + $scope.friend.id);

            sweetService.getUserPlaces($scope.friend.id, function (placeUserSweets) {
                console.log("Successfully retrieved " + placeUserSweets.length + " scores.");
                $scope.safeApply(function () {
                    $scope.userPlaces = placeUserSweets;
                });
            });

            sweetService.getUserPlacesJoinReq($scope.friend.id, function (placeUserJoinReqSweets) {
                console.log("Successfully retrieved " + placeUserJoinReqSweets.length + " scores.");
                $scope.safeApply(function () {
                    $scope.userPlacesJoinReq = placeUserJoinReqSweets;
                });
            });

            $location.path('/place/sweetPlace');
        };

        $scope.myPlaceDetail = function (place) {

            $scope.setLastVisitedPage();
            $scope.showPlaceGestureSendActions = true;
            $scope.magicButtonImage = $scope.newSweet.senderPicture;
            $rootScope.sweeter.name = $scope.newSweet.senderName;

            $rootScope.usersInPlaces = [];
            $rootScope.currentPlace = [];
            $rootScope.placeSweets = [];
            $rootScope.placeFollower = [];

            $scope.placeFollow = true;
            $scope.placeUnFollow = false;

            //this newPlace use in create place
            //TODO : need to delete it. this is over head
            $scope.newPlace.placeName = '';

            console.log("placeName -->>" + place.get("placeName"));
            console.log("placeDesc-->>" + place.get("placeDesc"));
            console.log("placeSweetName-->>" + place.get("placeSweetName"));
            console.log("placeURL-->>" + place.get("placeURL"));
            console.log("placeCreatorId-->>" + place.get("placeCreatorId"));
            console.log("placeLatitude-->>" + place.get("placeLatitude"));
            console.log("placeLongitude-->>" + place.get("placeLongitude"));
            console.log("$scope.friend.id -- >" + $scope.friend.id);
            console.log("Current User -- >" + userService.currentUser().get("authData")["facebook"]["id"]);
            console.log("Current User ID -- >" + userService.currentUser().id);

            $rootScope.currentPlace = place;

            /** the initial center of the map */
            /*$scope.centerProperty = {
                latitude:place.get("placeLatitude"),
                longitude:place.get("placeLongitude")
            };*/

            /** the initial zoom level of the map */
            //$scope.zoomProperty = 8;

            /** list of markers to put in the map */
            /*$scope.markersProperty = [
                {
                    latitude:place.get("placeLatitude"),
                    longitude:place.get("placeLongitude")
                }
            ];*/

            //$scope.zoomProperty = 4;

            console.log("Successfully ---->" + place.get("placeName"));

            sweetService.getPlacesSweets(place.get("placeName"), function (placeSweets) {
                //console.log("Successfully retrieved place sweets " + placeSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.placeSweets = placeSweets;
                });
            });

            sweetService.getPlacestoJoin(place.get("placeName"), userService.currentUser().get("authData")["facebook"]["id"], function (placeDetailSweets) {
                console.log("Successfully retrieved join user " + placeDetailSweets.length + " scores.");
                if (placeDetailSweets.length == 0) {
                    $rootScope.placeJoin = true;
                } else {
                    $rootScope.placeJoin = false;
                }
            });

            sweetService.getPlacesDetail(place.get("placeName"), function (placeDetailSweets) {
                console.log("Successfully retrieved placeDetailSweets" + placeDetailSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.usersInPlaces = placeDetailSweets;
                    //$location.path('/place/showPlace');
                });
            });

            sweetService.getPlacesFollower(place.get("placeName"), function (placeFollower) {
                console.log("Successfully retrieved place follower" + placeFollower.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.placeFollower = placeFollower;
                 });
                for (var i = 0; i < placeFollower.length; i++) {
                    console.log("--> " + placeFollower[i].get("phone"));
                    if (placeFollower[i].get("phone") == userService.currentUser().get("authData")["facebook"]["id"]){
                        console.log("Current User::");
                        $scope.placeFollow = false;
                        $scope.placeUnFollow = true;
                    }
                }
            });

            $location.path('/place/showPlace');
        }

        $scope.myPlaceDetailTemp = function (place) {
            $scope.$parent.setLastVisitedPage();

            $scope.usersInPlaces = [];
            $scope.currentPlace = [];

            console.log("-->>" + place.get("placeName"));
            console.log("-->>" + place.get("placeDesc"));
            console.log("-->>" + place.get("placeSweetName"));
            console.log("-->>" + place.get("placeURL"));
            console.log("-->>" + place.get("placeCreatorId"));
            console.log("-->>" + place.get("placeLatitude"));
            console.log("-->>" + place.get("placeLongitude"));

            $scope.currentPlace = place;

            /** the initial center of the map */
            $scope.centerProperty = {
                latitude:place.get("placeLatitude"),
                longitude:place.get("placeLongitude")
            };

            /** the initial zoom level of the map */
            $scope.zoomProperty = 8;

            /** list of markers to put in the map */
            $scope.markersProperty = [
                {
                    latitude:place.get("placeLatitude"),
                    longitude:place.get("placeLongitude")
                }
            ];

            $scope.zoomProperty = 14;

            sweetService.getPlacesDetail(place.get("placeName"), function (placeDetailSweets) {
                console.log("Successfully retrieved " + placeDetailSweets.length + " scores.");
                $scope.safeApply(function () {
                    $scope.usersInPlaces = placeDetailSweets;
                    $location.path('/place/joinPlace');
                });
            });
        }

        $scope.searchSweetPlace = function () {
            //load place is user for search places
            $scope.loadPlace();
            $location.path('/place/searchPlace');
        }

        $scope.myPlaceProfile = function (place) {

            $scope.setLastVisitedPage();

            $rootScope.usersInPlaces = [];
            $rootScope.currentPlace = [];
            $rootScope.placeJoinReq = [];
            $rootScope.comments = [];

            console.log("placeName -->>" + place.get("placeName"));
            console.log("placeDesc-->>" + place.get("placeDesc"));
            console.log("placeSweetName-->>" + place.get("placeSweetName"));
            console.log("placeURL-->>" + place.get("placeURL"));
            console.log("placeCreatorId-->>" + place.get("placeCreatorId"));
            console.log("placeLatitude-->>" + place.get("placeLatitude"));
            console.log("placeLongitude-->>" + place.get("placeLongitude"));
            console.log("$scope.friend.id -- >" + $scope.friend.id);

            $rootScope.currentPlace = place;

            /*$scope.centerProperty = {
             latitude: place.get("placeLatitude"),
             longitude:place.get("placeLongitude")
             };


             $scope.zoomProperty = 8 ;


             $scope.markersProperty = [ {
             latitude: place.get("placeLatitude"),
             longitude:place.get("placeLongitude")
             }];

             $scope.zoomProperty = 4 ;*/

            console.log("Successfully ---->" + place.get("placeName"));

            /*sweetService.getPlacesSweets(place.get("placeName") , function(placeSweets) {
             console.log("Successfully retrieved place sweets " + placeSweets.length + " scores.");
             $scope.safeApply(function() {
             $rootScope.placeSweets = placeSweets;
             });
             });*/

            //Get Place whom current user req to join
            /*sweetService.getPlacestoJoin(place.get("placeName") ,$scope.friend.id, function(placeDetailSweets) {
             console.log("Successfully retrieved join user " + placeDetailSweets.length + " scores.");
             if (placeDetailSweets.length == 0){
             $rootScope.placeJoin = true;
             } else {
             $rootScope.placeJoin = false;
             }
             });*/

            sweetService.getComments(place.get("placeName"), function (placeComments) {
                $scope.safeApply(function () {
                    $rootScope.comment = placeComments;
                });
                console.log("Successfully retrieved place customer comments " + $scope.comment.length + " scores.");
            });

            // Get user who request to join Place
            sweetService.placeJoinReq(place.get("placeName"), $scope.friend.id, function (placeReq) {
                console.log("Successfully retrieved number of join user " + placeReq.length);
                $rootScope.placeJoinReq = placeReq;
            });

            sweetService.getPlacesDetail(place.get("placeName"), function (placeDetailSweets) {
                $scope.safeApply(function () {
                    console.log("Successfully retrieved number of user " + placeDetailSweets.length);
                    $rootScope.usersInPlaces = placeDetailSweets;
                    $location.path('/place/placeProfile');
                });
            });


        }

        $scope.acceptReq = function (user) {

            console.log("user id ->" + user.get("userID"));
            console.log("place id ->" + user.get("placeName"));

            $scope.updatePlace = [];
            $scope.updatePlace.userID = user.get("userID");
            $scope.updatePlace.placeName = user.get("placeName");

            sweetService.updatePlaceUser($scope.updatePlace, function () {
                console.log("Successfully save.");
                $scope.myPlaceProfile($rootScope.currentPlace);
            });
        }

        $scope.rejectReq = function (user) {
            console.log("user id ->" + user.get("userID"));
            console.log("place id ->" + user.get("placeName"));

            $scope.updatePlace = [];
            $scope.updatePlace.userID = user.get("userID");
            $scope.updatePlace.placeName = user.get("placeName");

            sweetService.deletePlaceUser($scope.updatePlace, function () {
                console.log("Successfully save.");
                $scope.myPlaceProfile($rootScope.currentPlace);
            });
        }

        $scope.rejectReqPlace = function (user) {
            $scope.reqReject = [];
            $scope.reqReject = user;
            console.log("place id ->" + user.get("placeName"));
            $scope.showReqJoin = true;
            $scope.placeComments = true;
        }

        $scope.rejectPlaceProfileUser = function () {
            console.log("user id ->" + $scope.reqReject.get("userID"));
            console.log("place id ->" + $scope.reqReject.get("placeName"));

            $scope.updatePlace = [];
            $scope.updatePlace.userID = $scope.reqReject.get("userID");
            $scope.updatePlace.placeName = $scope.reqReject.get("placeName");

            sweetService.deletePlaceUser($scope.updatePlace, function () {
                console.log("Successfully save.");
                $scope.myPlaceProfile($rootScope.currentPlace);
            });
            $scope.showReqJoin = false;
            $scope.placeComments = false;
            $scope.myPlaceProfile($rootScope.currentPlace);
        }

        $scope.cancelReq = function () {
            $scope.showReqJoin = false;
            $scope.myPlaceProfile($rootScope.currentPlace);
            $scope.placeComments = false;
        }

        $scope.sendPlaceGesture = function (uplace) {
            console.log("---sendPlaceGesture1 ");
            $scope.setLastVisitedPage();
            $rootScope.sweeter.name = uplace.get('userName');


            $scope.placeInfo = [];
            $scope.placeInfo = uplace;
            $scope.magicButtonImage = uplace.get('userPic');
            console.log("---setFriend() " + uplace.get('userPic'));

            $scope.section.sending = true;
            $scope.showPlaceGestureSendActions = true;
            $location.path("/place/sent");

            $scope.section.sendingPlace = true;
			
			loadingViews();
        }

        /*$scope.cancelPlaceGesture = function() {
         $scope.$parent.setLastVisitedPage();
         $location.path("/place/sent");
         }*/

        $scope.sendPlaceGestureParse = function (place, sweetId) {
            $scope.newPlaceSweet = {};

            $scope.section.sending = true;

            if (sweetId) $scope.newSweet.replyToSweet = sweetId;
            $scope.newSweet.receiverPhone = $scope.placeInfo.get('userID');
            $scope.newSweet.receiverName = $scope.placeInfo.get('userName');
            $scope.newSweet.receiverChannel = $scope.placeInfo.get('userNetwork');
            $scope.newSweet.receiverPicture = $scope.placeInfo.get('userPic');
            $scope.newSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[2];

            console.log($scope.placeInfo.get('userID'));
            console.log($scope.newSweet.gesture);
            console.log($scope.newSweet.senderName);
            console.log("----senderName-------");

            $scope.newSweet.text = "Thank You";
            //Sweet related to place
            if (sweetId) $scope.newPlaceSweet.replyToSweet = sweetId;
            $scope.newPlaceSweet.receiverPhone = $scope.placeInfo.get('userID');
            $scope.newPlaceSweet.receiverName = $scope.placeInfo.get('userName');
            $scope.newPlaceSweet.receiverChannel = $scope.placeInfo.get('userNetwork');
            $scope.newPlaceSweet.receiverPicture = $scope.placeInfo.get('userPic');
            $scope.newPlaceSweet.senderName = $scope.newSweet.senderName;
            $scope.newPlaceSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[2];

            /*{"placeSweetName":"asas","placeDesc":"asas","placeURL":"asasas"}*/
            $scope.newPlaceSweet.placecreatorid = $scope.placeInfo.get('placeCreatorId');
            $scope.newPlaceSweet.placename = $scope.placeInfo.get('placeName');
            $scope.newPlaceSweet.placesweetname = $scope.placeInfo.get('placeSweetName');

            console.log($scope.newPlaceSweet.placecreatorid);
            console.log($scope.newPlaceSweet.placename);
            console.log($scope.newPlaceSweet.gesture);
            console.log("----Place Sweet-------");

            $scope.newPlaceSweet.text = "Thank You";

            sweetService.saveSweet($scope.newSweet, function (rSweet, rUserSweet) {
                $scope.safeApply(function () {
                    $scope.sweets.push(rSweet);
                    $scope.sweets.sortByProp("updatedAt");
                });

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

                sweetService.saveSweetofPlace($scope.newPlaceSweet, function (rSweet, rUserSweet) {

                });
                //$location.path("/place/showPlace");
                $scope.myPlaceDetail($scope.placeInfo);
            });
            $scope.showGestureSendActions = false;
            $scope.section.sendingPlace = false;
        };

        $scope.friendSent = function (friend) {

            $scope.friendInfo = friend;

            $scope.showGestureSendActionsFriends = true;
            $scope.section.sending = true;
            $scope.section.sendingFriend = true;
            $scope.magicButtonImage = friend.picture['data']['url'];
            $rootScope.sweeter.name = friend.name;
            $location.path("/place/sentFriend");
        }

        $scope.cancelGestureActionFriend = function () {
            $scope.navigateToSweetPlace();
        }

        $scope.sendSweetnessFriend = function (friend, gestureType, sweetId) {

            $scope.section.sendingFriend = false;
            $scope.showGestureSendActionsFriends = false;

            if (sweetId) $scope.newSweet.replyToSweet = sweetId;
            $scope.newSweet.receiverPhone = friend.id;
            $scope.newSweet.receiverName = friend.name;
            $scope.newSweet.receiverChannel = friend.network;
            $scope.newSweet.receiverPicture = friend.picture["data"]["url"];
            $scope.newSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[2];

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
                    $scope.navigateToSweetPlace();
                    //$location.path("/place/sweetPlace");
                });

            });

        };

        //-------------------------------------------------------------------------------------------------------//
        //*******************************************************************************************************//
        $scope.initializeGMap = function ($scope) {

            $location.path('/place/createSweetPlace');

            //console.log ("Load Map" + document.getElementById('map_canvas'));

            var latlng = new google.maps.LatLng(-34.397, 150.644);
            var geocoder = new google.maps.Geocoder();
            var map = new google.maps.Map(document.getElementById('map_canvas'), {
                center:latlng,
                zoom:17,
                panControl:false,
                mapTypeControl:true,
                mapTypeControlOptions:{
                    style:google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                zoomControl:true,
                /*zoomControlOptions: {
                 style: google.maps.ZoomControlStyle.SMALL
                 },*/
                scaleControl:false,

                mapTypeId:google.maps.MapTypeId.ROADMAP
            });

            // Try HTML5 geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = new google.maps.LatLng(position.coords.latitude,
                        position.coords.longitude);

                    /*var infowindow = new google.maps.InfoWindow({
                     map: map,
                     position: pos,
                     content: 'Location found.'
                     });*/

                    var marker = new google.maps.Marker({
                        position:pos,
                        map:map,
                        title:'Location found.'
                    });

                    map.setCenter(pos);
                }, function () {
                    $scope.handleNoGeolocation(true);
                });
            } else {
                // Browser doesn't support Geolocation
                handleNoGeolocation(false);
            }

            var defaultBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(-33.8902, 151.1759),
                new google.maps.LatLng(-33.8474, 151.2631)
            );

            map.fitBounds(defaultBounds);

            //--------------------------------------------------------------------------------------
            //------------------------------ Search Box --------------------------------------------
            //--------------------------------------------------------------------------------------
            /*var input = (document.getElementById('target'));
             var searchBox = new google.maps.places.SearchBox(input);
             var markers = [];

             google.maps.event.addListener(searchBox, 'places_changed', function() {
             var places = searchBox.getPlaces();
             var photos = places.photos;

             for (var i = 0, marker; marker = markers[i]; i++) {
             marker.setMap(null);
             }

             markers = [];
             var bounds = new google.maps.LatLngBounds();

             for (var i = 0, place; place = places[i]; i++) {
             var image = {
             url: place.icon,
             size: new google.maps.Size(71, 71),
             origin: new google.maps.Point(0, 0),
             anchor: new google.maps.Point(17, 34),
             scaledSize: new google.maps.Size(25, 25)
             };

             var marker = new google.maps.Marker({
             map: map,
             icon: image,
             title: place.name,
             position: place.geometry.location
             });
             //console.log("Place loaction -->>" + i + '->' + place.geometry.location);
             //console.log("place photos -->>" + i + '->'+ place.photos);
             console.log("place name -->>" + i + '->'+ place.name);
             //console.log("place details -->>" + i + '->'+ place.details);
             //console.log("place icon -->>" + i + '->'+ place.icon);
             console.log("place formatted address -->>" + i + '->'+ place.formatted_address);
             //console.log("place html attributions-->>" + i + '->'+ place.html_attributions);

             if (i == 0 ) {
             $rootScope.placeSearchResults = [];
             $rootScope.placeSearchResults.LatLong = place.geometry.location;
             $rootScope.placeSearchResults.photo = place.photos ;
             $rootScope.placeSearchResults.gname = place.name ;
             $rootScope.placeSearchResults.icon = place.icon ;
             $rootScope.placeSearchResults.formatted_address = place.formatted_address ;
             }

             markers.push(marker);
             bounds.extend(place.geometry.location);

             }

             map.fitBounds(bounds);
             map.setZoom(14);
             });*/
            //--------------------------------------------------------------------------------------
            //--------------------------------------------------------------------------------------

            //--------------------------------------------------------------------------------------
            //------------------------------ AutoComplete Box --------------------------------------------
            //--------------------------------------------------------------------------------------
            var input = (document.getElementById('target'));
            var autocomplete = new google.maps.places.Autocomplete(input);

            autocomplete.bindTo('bounds', map);

            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                map:map
            });

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                infowindow.close();
                marker.setVisible(false);
                //input.className = '';
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    // Inform the user that the place was not found and return.
                    //input.className = 'notfound';
                    return;
                }

                // If the place has a geometry, then present it on a map.
                //if (place.geometry.viewport) {
                //console.log("place.geometry.viewport");
                //map.fitBounds(place.geometry.viewport);
                //} else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
                console.log("LatLong" + place.geometry.location);
                $rootScope.placeSearchResults = [];
                $rootScope.placeSearchResults.LatLong = place.geometry.location;
                $rootScope.placeSearchResults.photo = place.photos;
                $rootScope.placeSearchResults.gname = place.name;
                $rootScope.placeSearchResults.icon = place.icon;
                $rootScope.placeSearchResults.formatted_address = place.formatted_address;
                //}
                marker.setIcon(/** @type {google.maps.Icon} */({
                    url:place.icon,
                    size:new google.maps.Size(71, 71),
                    origin:new google.maps.Point(0, 0),
                    anchor:new google.maps.Point(17, 34),
                    scaledSize:new google.maps.Size(35, 35)
                }));
                marker.setPosition(place.geometry.location);
                marker.setVisible(true);

                var address = '';
                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }

                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
                infowindow.open(map, marker);
            });


            //--------------------------------------------------------------------------------------
            //--------------------------------------------------------------------------------------
            //add marker on double click
            ////////////////////////////////////////////////////////////////
           /* var markersArray = [];

            google.maps.event.addListener(map, 'click', function (event) {
                //deleteOverlays();
                addMarker(event.latLng);
            });

            function addMarker(location) {
                var marker = new google.maps.Marker({
                    position:location,
                    map:map
                });
                console.log("location" + location);
                getAddress(location);
                markersArray.push(marker);
            }*/

            //Deletes all markers in the array by removing references to them
            function deleteOverlays() {
                if (markersArray) {
                    for (var i = 0; markersArray.length; i++) {
                        markersArray[i].setMap(null);
                    }
                    markersArray.length = 0;
                }
            }

            function getAddress(latLng) {

                geocoder.geocode({'latLng':latLng},
                    function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                console.log("address :: " + results[0].formatted_address);
                                console.log("address :: " + results[0].address_components[0].short_name);
                                console.log("address :: " + results[0].name);
                            }
                            else {
                                console.log("No results");
                            }
                        }
                        else {
                            console.log("status :: " + status);
                        }
                    });
            }

            ///////////////////////////////////////////////////////////////
            google.maps.event.addListener(map, 'bounds_changed', function () {
                var bounds = map.getBounds();
                searchBox.setBounds(bounds);
                autocomplete.setBounds(bounds);

                var zoom = map.getZoom();
                map.setZoom(zoom < 14 ? 14 : zoom);
                //map.setZoom(14);
                console.log("map.getZoom()" + map.getZoom());
            });

            //$location.path('/place/gmap');
            //$location.path('/place/createSweetPlace');
            google.maps.event.trigger(map, 'resize');

            window.setTimeout(function () {
                google.maps.event.trigger(map, 'resize');
            }, 1000);
        }

        $scope.handleNoGeolocation = function (errorFlag) {

            //var map = new google.maps.Map(document.getElementById('map-canvas'));

            if (errorFlag) {
                var content = 'Error: The Geolocation service failed.';
            } else {
                var content = 'Error: Your browser doesn\'t support geolocation.';
            }

            var options = {
                map:map,
                position:new google.maps.LatLng(60, 105),
                content:content,
                zoom:9
            };

            var infowindow = new google.maps.InfoWindow(options);
            map.setCenter(options.position);
        }


        //*******************************************************************************************************//
        //-------------------------------------------------------------------------------------------------------//

        //alpha
        $scope.follow = function (place){

            $scope.followSweet = [];
            console.log("username -> " + userService.currentUser().get("username"));
            console.log("id -> " + userService.currentUser().id);
            console.log("facebook id -> " + userService.currentUser().get("authData")["facebook"]["id"]);
            console.log("placeName -> " + place.get("placeName"));
            console.log("placeSweetName -> " + place.get("placeSweetName"));

            $scope.followSweet.username = userService.currentUser().get("username");
            $scope.followSweet.userid = userService.currentUser().id ;
            $scope.followSweet.facebookid = userService.currentUser().get("authData")["facebook"]["id"] ;
            $scope.followSweet.placename = place.get("placeName") ;
            $scope.followSweet.placeSweetName = place.get("placeSweetName") ;
            $scope.followSweet.userpic = place.get("userPic");
            $scope.followSweet.icon = place.get("icon");

            sweetService.savePlaceFollower($scope.followSweet, function () {
                console.log("savePlaceFollower");
                $scope.myPlaceDetail(place);
            });
        }

        //alpha
        $scope.unfollow = function (place){

            $scope.followSweet = [];
            console.log("username -> " + userService.currentUser().get("username"));
            console.log("id -> " + userService.currentUser().id);
            console.log("facebook id -> " + userService.currentUser().get("authData")["facebook"]["id"]);
            console.log("placeName -> " + place.get("placeName"));
            console.log("placeSweetName -> " + place.get("placeSweetName"));

            $scope.followSweet.username = userService.currentUser().get("username");
            $scope.followSweet.userid = userService.currentUser().id ;
            $scope.followSweet.facebookid = userService.currentUser().get("authData")["facebook"]["id"] ;
            $scope.followSweet.placename = place.get("placeName") ;
            $scope.followSweet.placeSweetName = place.get("placeSweetName") ;

            sweetService.deletePlaceFollower($scope.followSweet, function () {
                console.log("deletePlaceFollower");
                $scope.myPlaceDetail(place);
            });

        }

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

        $scope.$on('$viewContentLoaded', function(event) {
            $window._gaq.push(['_trackPageview', $location.path()]);
        });
    }
}

// Define our root-level controller for the application.
function AppController($window, UpdateService, $http, $log, $scope, $route, $routeParams, $location, userService,$timeout,
                       facebookService, authService, sweetService, CONSTANTS, $rootScope, interactionService, localStorageService, utilService) {

    $rootScope.publicName = {};

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

    //----------------------------------------------------------------------------------------------------------
    //Public page alpha
    //----------------------------------------------------------------------------------------------------------
    $scope.currentPagePlace = 0 ;
    $scope.newSweet = [];
    $scope.counter = CONSTANTS.DEFAULT_COUNTER;
    $scope.rating = 5;
    var isStopped = false, timer, addEvents;

    $scope.timerStatus = '';
    $scope.startStatus = 'Stop';
    /*$scope.rate = 7;
    $scope.isReadonly = false;*/
    var increment = 0 ;
    var interval = 0 ;

    //alpha
    //$scope.pageSize = CONSTANTS.DEFAULT_AVATAR_PAGINATION_SIZE;
    $scope.pageSize = 8 ;

    $scope.nextPage = function () {
        console.log("nextPage: " + $scope.currentPagePlace * $scope.pageSize);
        console.log("nextPage: " + $rootScope.usersInPlaces.length);
        if ((( ($scope.currentPagePlace + 1) * $scope.pageSize) < $rootScope.usersInPlaces.length - 1) && $scope.pageSize != $rootScope.usersInPlaces.length) {
            $scope.currentPagePlace++;
        }
    };

    //alpha
    $scope.prevPage = function () {
        if ($scope.currentPagePlace > 0) {
            $scope.currentPagePlace--;
        }
    };

    //alpha
    $scope.sendPlaceGesture = function (uplace) {
        console.log("---sendPlaceGesture2 ");

        $scope.showPlaceFeed = false ;
        $scope.showmobileActions = false;
        $scope.wrapper = "wrapper";

        $scope.placeInfo = [];
        $scope.placeInfo = uplace;

        $scope.magicButtonImage = "http://graph.facebook.com/" + uplace.get('userID') + "/picture?width=300&height=300";//uplace.get('userPic');
        $scope.userName = uplace.get('userName');
        console.log("-- >> " + uplace.get('userName').split(" ")[0]);
        console.log("---setFriend() " + uplace.get('userPic'));

        $scope.section.sending = true;
        $scope.showPlaceGestureSendActionsPlace = true;
        //$location.path("/partials/sent");
        $scope.section.sendingPlace = true;
        $scope.section.sendingPlaceThanks = false;
        $scope.publicPlaceHeader = true;
        $scope.playBell = false;
    }

    //alpha
    $scope.cancelSweetPlace = function(){
        $scope.showPlaceFeed = true ;
        $scope.wrapper = "wrapper-feeds-place";
        $scope.section.sending = false;
        $scope.section.sendingPlaceThanks = false;
        $scope.showPlaceGestureSendActionsPlace = false;
        $scope.section.sendingPlace = false;
        $scope.publicPlaceHeader = false;
        $scope.playBell = false;
    }

    //alpha
    $scope.sendSweetnessPlaceGesture = function (placeInfo, sweetId) {

        //timer.restart();

        $scope.section.sending = false;
        $scope.wrapper = "wrapper";
        $scope.showprogressline = ' ';

        console.log("userID" + placeInfo.get("userID"));
        //if(sweetId) $scope.newSweet.replyToSweet = sweetId;
        $scope.newSweet.receiverPhone = placeInfo.get("userID");
        $scope.newSweet.receiverName = placeInfo.get("userName");
        $scope.newSweet.receiverChannel = placeInfo.get("userNetwork");
        $scope.newSweet.receiverPicture = placeInfo.get("userPic");
        $scope.newSweet.placename = placeInfo.get("placeName");
        $scope.newSweet.placesweetname = placeInfo.get("placeName");


        $scope.newSweet.senderId = "miscellaneous";
        $scope.newSweet.senderName = "SweetCustomer";
        $scope.newSweet.senderPhone = "miscellaneous";
        $scope.newSweet.senderChannel = "miscellaneous";
        $scope.newSweet.senderPicture = "img/thanx.png";

        //if user not login
        if (userService.currentUser() == null) {
            $scope.newSweet.currentUser = "SweetCustomer";
            $scope.newSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[3];
        } else {
            $scope.newSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[2];
        }

        console.log($scope.newSweet.receiverName);
        console.log($scope.newSweet.gesture);
        //console.log(userService.currentUser());

        $scope.newSweet.text = "Thank You, all of you";

        sweetService.saveSweet($scope.newSweet, function (rSweet, rUserSweet) {
            $scope.safeApply(function () {
                $scope.sweets.push(rSweet);
                $scope.sweets.sortByProp("updatedAt");
            });

            $scope.safeApply(function () {
                facebookService.postToWall(rSweet, $scope.newSweet.gesture.facebook_template, function (success) {
                    //$scope.$parent.updateLoginInfo();
                    $scope.squeezed = false;

                    setTimeout(function () {
                        $scope.section.sending = false;
                        $scope.safeApply();
                    }, 4000);

                });
            });
        });


        sweetService.saveSweetofPlace($scope.newSweet, function (rSweet) {
            console.log("saveSweetofPlace id" + rSweet );
            $rootScope.sweetofplaceid = rSweet ;
        });

        sweetService.getPlacesSweets(placeInfo.get("placeName"), function (placeSweets) {
            console.log("Successfully retrieved place sweets custom" + placeSweets.length + " scores.");
            $scope.safeApply(function () {
                $rootScope.placeSweets = placeSweets;
            });
        });

        $scope.showPlaceGestureSendActionsPlace = false;
        $scope.section.sendingPlace = true;
        $scope.section.sendingPlaceThanks = true;
        //$scope.showPlaceFeed = true ;
        $scope.showmobileActions = true ;
        $scope.rating = 5; //this will show 5 filled star when mobile action is true
        $scope.ratestar = 5 ; //if user select no star then default is 5 star
        $scope.thanksheading = true ;
        $scope.thanksfooter = false ;
        $rootScope.userAvatar = false;
        $scope.playBell = false;

        //$scope.counter = CONSTANTS.DEFAULT_COUNTER;
        //$timeout($scope.onTimeout,1000); //show the timer

        $scope.roundProgressData = {
            label: 0,
            percentage: 0
        }
        increment = 0 ;
        interval = 0 ;
        $scope.counter = 0;
        $timeout($scope.onTimeout,1000); //show the timer
    };

    /*$scope.onTimeout = function(){
        $scope.counter--;

        if ($scope.counter == 0){
            $scope.counter = 'end';
            *//*$scope.showmobileActions = false;
            $scope.showPlaceFeed = true ;
            $scope.section.sendingPlace = true;
            $scope.section.sending = false ;
            $scope.wrapper = "wrapper-feeds-place";*//*
            //$scope.newAuthPlace();
        } else {
            var mytimeout = $timeout($scope.onTimeout,1000);
        }

    }*/

    $scope.onTimeout = function(){

        if ($scope.counter == 'feedback') {
            console.log("counter --> " + 'feedback');
            $scope.counter = 'end';

        } else if ($scope.counter == 6) {
            console.log("counter --> " + '6');
            $scope.newValue = 100 ;

            $scope.roundProgressData = {
                label: $scope.newValue,
                percentage: $scope.newValue / 100
            }

            $scope.counter = 'end';

            /*$scope.playBell = true;
            var videoElements = document.getElementById('bellSound');
            videoElements.play();*/

            $scope.showmobileActions = false;
             $scope.showPlaceFeed = true ;
             $scope.section.sendingPlace = true;
             $scope.section.sending = false ;
            //$scope.wrapper = "wrapper-feeds-place";

            /***************************************************/
            //$scope.waitcounter = 0;
            //var mywait = $timeout($scope.wait,1000);

            /***************************************************/


        } else if ($scope.counter <= 6) {
            console.log("counter --> " + $scope.counter);
            $scope.counter++;
            var mytimeout = $timeout($scope.onTimeout,1000);

            if( $scope.counter % 2 == 0 ) {

                console.log("increment --> " + increment);
                increment = increment + 33.333;
                $scope.newValue = increment ;

                $scope.roundProgressData = {
                    label: $scope.newValue,
                    percentage: $scope.newValue / 100
                }
            }

        }

    }

    $scope.wait = function(){

        $scope.waitcounter++;
        if ($scope.waitcounter == 2) {
            console.log("waitcounter --> ");
            $scope.showmobileActions = false;
            $scope.showPlaceFeed = true ;
            $scope.section.sendingPlace = true;
            $scope.section.sending = false ;

        } else {
            $timeout($scope.wait,1000);
        }

    }

    $scope.saveRatingToServer = function(rating) {
        //$window.alert('Rating selected - ' + rating);
        $scope.ratestar = rating ;
    };

    $scope.user = {
        fullName:null,
        mobile:null
    };

    $scope.clearData = function () {
        $scope.user = {
            fullName:null,
            mobile:null
        };
    };

    //alpha
    $scope.newAuthPlace = function () {

        $scope.wrapper = "wrapper-feeds-place";

        console.log("User phone: " + $scope.user.mobile);
        console.log("User comment: " + $scope.user.comment);
        console.log("User name: " + $scope.user.name);
        console.log($scope.newSweet.receiverPhone);
        console.log($scope.newSweet.receiverName);
        console.log($scope.newSweet.receiverChannel);
        console.log($scope.newSweet.receiverPicture);
        console.log($scope.newSweet.placename);
        console.log($scope.newSweet.placesweetname);
        console.log("Rating " + $scope.ratestar);

        //$scope.newSweet.senderId = "miscellaneous";
        $scope.newSweet.senderName = "SweetCustomer";
        //$scope.newSweet.comment = $scope.user.comment;
        $scope.newSweet.comment = $scope.user.comment;
        $scope.newSweet.mobile = $scope.user.mobile;
        $scope.newSweet.rating = $scope.ratestar;
        $scope.newSweet.username = $scope.user.name;
        if ($rootScope.userAvatar == false){
            $scope.newSweet.senderPicture = "img/thanx.png";
        } else {
            $scope.newSweet.senderPicture = $rootScope.userAvatar;
        }
        console.log("$scope.newSweet.senderPicture " + $scope.newSweet.senderPicture);
        console.log("$rootScope.userAvatar " + $rootScope.userAvatar);
        sweetService.placesCustomerComm($scope.newSweet, function () {
            /*console.log("Successfully retrieved place sweets custom" + placeSweets.length + " scores.");
            $scope.safeApply(function () {
                $rootScope.placeSweets = placeSweets;
            });*/
        });

        // send sms
        authService.createAuthPP($scope.user.mobile, "NoName");

        //send email
        $scope.newSweet.fromEmail = 'thankyou@sweetness.io';
        $scope.newSweet.receiverEmail = 'kashif.abdullah@virtual-force.com'; //'sweetest@sweetness.io';
        $scope.newSweet.subject = "You got feedback from a customer";
        sweetService.sendCommentEmail($scope.newSweet, function (success) {
            console.log("Email send -->" + success);
        });

        $scope.clearData();

        $scope.roundProgressData = {
            label: 0,
            percentage: 0
        }
        increment = 0 ;
        interval = 0 ;
        $scope.counter = 0;
        $timeout($scope.onTimeout,1000); //show the timer

        $scope.feedbackform = false;
        //$scope.showmobileActions = false;
        //$scope.showPlaceFeed = true ;
        //$scope.section.sendingPlace = true;
        $scope.section.sending = false ;
        //$scope.publicPlaceHeader = false;
        $scope.thanksheading = false ;
        $scope.thanksfooter = true ;
        $scope.playBell = false;
    };

    $scope.newAuthPlaceCancel = function () {
        console.log("call of cancel");

        //$scope.wrapper = "wrapper-feeds-place";

        /*$scope.showmobileActions = false;
        $scope.showPlaceFeed = true ;
        $scope.section.sendingPlace = true;
        $scope.section.sending = false ;
        $scope.publicPlaceHeader = false;
        $scope.feedbackform = false;
        $scope.thanksheading = false ;
        $scope.thanksfooter = false ;*/

        $scope.clearData();

        $scope.roundProgressData = {
            label: 0,
            percentage: 0
        }
        increment = 0 ;
        interval = 0 ;
        $scope.counter = 0;
        $timeout($scope.onTimeout,1000); //show the timer

        $scope.feedbackform = false;
        //$scope.showmobileActions = false;
        //$scope.showPlaceFeed = true ;
        //$scope.section.sendingPlace = true;
        $scope.section.sending = false ;
        //$scope.publicPlaceHeader = false;
        $scope.thanksheading = false ;
        $scope.thanksfooter = true ;
        $scope.playBell = false;

    };

    $scope.feedback = function () {

        console.log("feedback");
        $scope.feedbackform = true;

        $scope.counter = 'feedback';
        $timeout($scope.onTimeout,1000); //show the timer

        /*$scope.showmobileActions = false;
        $scope.showPlaceFeed = true ;
        $scope.section.sendingPlace = true;
        $scope.section.sending = false ;
        $scope.publicPlaceHeader = false;*/
    };

    /************************************************************/
    /*call from sweetfileselect directive */
    /************************************************************/
    $scope.$on('feedbackImg_upload', function() {
        console.log("feedbackImg_upload");

        $scope.counter = 'feedback';
        $timeout($scope.onTimeout,1000); //show the timer
    });

    $scope.$on('feedbackImg_uploaded', function() {
        console.log("feedbackImg_uploaded");
        $scope.showprogressline = 'strip-line';

        $scope.roundProgressData = {
            label: 0,
            percentage: 0
        }
        increment = 0 ;
        interval = 0 ;
        $scope.counter = 0;
        $timeout($scope.onTimeout,1000); //show the timer
    });
    /************************************************************/


    $scope.$on('$viewContentLoaded', function(event) {
        $window._gaq.push(['_trackPageview', $location.path()]);
        //mixpanel.track(['_trackPageview', $location.path()]);
        mixpanel.track(['_trackPageview']);
    });

    /************************************************************************/
    /*                      Timer Handler                                   */
    /************************************************************************/

    console.log('TimerHandlerCtrl');
    $rootScope.$on('timer_initialized', function() {
        timer = angular.element('.timer').scope();
        addEvents();
        console.log('TimerHandlerCtrl');
    });

    addEvents = function() {
        timer.$on('timer_started', function() {
            $scope.startStatus = 'Stop';
            $scope.timerStatus = 'Started';
            isStopped = false;
        });

        timer.$on('timer_stopped', function() {
            $scope.startStatus = 'Start';
            $scope.timerStatus = 'Stopped';
            isStopped = true;
        });

        timer.$on('timer_ended', function() {
            $scope.startStatus = 'Start';
            $scope.timerStatus = 'Timer Ended!';
            isStopped = true;
            $scope.showmobileActions = false;
            $scope.showPlaceFeed = true ;
            $scope.section.sendingPlace = true;
            $scope.section.sending = false ;
            $scope.wrapper = "wrapper-feeds-place";
        });
    };

    $scope.restart = function() {
        timer.restart();
    };

    $scope.toggleStop = function() {
        timer[isStopped? 'start': 'stop']();
    };
    /***********************************************************************/


    //----------------------------------------------------------------------------------------------------------
    // End public page alpha
    //----------------------------------------------------------------------------------------------------------

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

        if($scope.loggedInUser){
            $scope.cssResponsive = 'css/responsive.css' ;
            $scope.cssSweet = 'css/sweet.css' ;
            $scope.cssStyle = '' ;
        } else {
            $scope.cssResponsive = '' ;
            $scope.cssSweet = '' ;
            $scope.cssStyle = 'css/blue/css/purple.css' ;
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
        return ($scope.renderAction == "sweet.friend" || $scope.renderAction == "sweet.feed" || $scope.renderAction == "sweet.timeline"
            || $scope.renderAction == "place.feed" || $scope.renderAction == "place.timeline" || $scope.renderAction == "place.friend"
            || $scope.renderAction == "place.myplaces" || $scope.renderAction == "place.setting" || $scope.renderAction == "place.interactionp");
    };

    $scope.hideSearch = function () {
        //return ($scope.renderAction == "place.createsweetplace" || $scope.renderAction == "place.showplace");
    };

    $scope.hideRightBtn = function () {
        //return ($scope.renderAction == "place.createsweetplace" || $scope.renderAction == "place.showplace");
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

    $scope.showSearch = function () {
        /*console.log("-->>search");
         $scope.setMe();
         $scope.$parent.setLastVisitedPage();*/
        $scope.loadPlace();
        $location.path('/sweet/fsearch');
        //$location.path('/place/searchPlace');
    }

    $scope.loadPlace = function (cb) {
        $scope.places = [];
        sweetService.getPlaces(function (placeSweets) {
            console.log("Successfully retrieved " + placeSweets.length + " scores.");
            $scope.safeApply(function () {
                $scope.places = placeSweets;
            });
        });

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

    // Update the rendering of the page logout state.
    var renderNotLogoIn = function () {
        console.log("---Rendering Logout---");

        if($scope.loggedInUser){
            $scope.cssResponsive = 'css/responsive.css' ;
            $scope.cssSweet = 'css/sweet.css' ;
            $scope.cssStyle = '' ;
        } else {
            $scope.cssResponsive = '' ;
            $scope.cssSweet = '' ;
            $scope.cssStyle = 'css/blue/css/purple.css' ;
        }

        //alpha
        //Non user + logout state + this device + public pages for place and users >
        var renderGuestAction = $route.current.action; //$location.path();
        var renderGuestPath = renderGuestAction.split( "." );
        var username = ($routeParams.name || "");

        //alpha
        if(renderGuestPath[1] == 'custom' && username != "" ){
            $rootScope.publicName = username;
            //console.log("render username Guest-->" + $scope.publicName);
        }
        if (username == "[object Object]"){
            $rootScope.publicName = '';
        }

        //alpha
        if($rootScope.publicName != '' && !$scope.isUserLoggedIn ) {

            //console.log("Rendering Step1 --->");
            $scope.isPublicPage = true;
            $scope.showLogin = false;

            //console.log("sweetname Guest--> " + $rootScope.publicName);
            //$scope.$apply( $location.path( '/'+ $rootScope.publicName ) );

            $scope.showPlaceFeed = true ;
            $location.path('/'+ $rootScope.publicName);
            //$window.location('/'+ $rootScope.publicName);
        }

        // Non user + logout state + this device >
        //alpha
        if ($location.path() == '/' || $location.path() == '/u/auth' && !$scope.isUserLoggedIn) {
            //console.log("Rendering Step2 --->");
            //console.log("constant auth: " + CONSTANTS.ROUTES.AUTH);
            $location.path(CONSTANTS.ROUTES.AUTH);
            $scope.showLogin = true;
        }

        if ($location.path() == '/u/auth/sms' && !$scope.isUserLoggedIn) {
            //console.log("Rendering Step2 --->");
            //console.log("constant auth: " + CONSTANTS.ROUTES.AUTH);
            $location.path(CONSTANTS.ROUTES.AUTH_SMS);
        }

        // Non user + logout state + this device >
        if ($location.path() == '/' && !$scope.isUserLoggedIn) {
            //console.log("constant auth: " + CONSTANTS.ROUTES.AUTH);
            $location.path(CONSTANTS.ROUTES.AUTH);
            $scope.showLogin = true;
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
        var publicPlace = (renderPath[ 0 ] == "name");//alpha

        // Store the values in the model.
//        $scope.isUserLoggedIn = userLoggedIn;
        $rootScope.renderAction = renderAction;
        $rootScope.renderPath = renderPath;
        $scope.isSweet = isSweet;
        $scope.isSweetness = isSweetness;
        $scope.sweetId = sweetId;
        $scope.isAuth = isAuth;
        $scope.authToken = authToken;
        $scope.publicPlace = publicPlace;

        switch (renderAction) {
            case "sweet.friend":
            case "sweet.timeline":
            case "sweet.feed":
                $scope.wrapper = "wrapper-feeds";
                break;
            case "locations.place":
            case "name.custom":
                $scope.wrapper = "wrapper-feeds-place";
                $rootScope.sweeter.name = "Sweet Place";
                break;
            //case "place.sweetplace":
            case "place.feed":
            case "place.friend":
                $scope.wrapper = "wrapper-feeds";
                $scope.activeFeed = "active";
                $scope.activePlace = "";
                //$scope.search_btn = "search";
                break;
            case "place.timeline":
                $scope.wrapper = "wrapper-feeds";
                $scope.activeFeed = "";
                $scope.activePlace = "";
                //$scope.search_btn = "search";
                break;
            case "place.myplaces":
            case "place.interactionp":
                $scope.wrapper = "wrapper-feeds";
                $scope.activePlace = "active";
                $scope.activeFeed = "";
                //$scope.search_btn = "search";
                break;
            default:
                $scope.wrapper = "wrapper";
                $scope.activeFeed = "";
                $scope.activePlace = "";
                break;
        }

        console.log("Render Action: " + renderAction);
        console.log("Render Path0: " + renderPath[0]);
        console.log("Render Path1: " + renderPath[1]);

        if (isAuth && renderPath[1] == 'sms') {
            console.log("isAuth and sms get");
            $location.path(CONSTANTS.ROUTES.AUTH_SMS);
        }

        if (renderPath[1] == "custom" && $rootScope.publicName != '') {

            $scope.showPlaceFeed = true ;
            $rootScope.currentPlace = [];

            //var renderAction = $location.path();
            //var renderPath = renderAction.split( "/" );
            var renderAction = $route.current.action;
            var renderPath = renderAction.split(".");
            var username = ($routeParams.name || "");
            //$rootScope.publicName = username;

            $scope.guestPlace = {};
            $scope.guestPlace.placeName = username;

            console.log("sweetname custom--> " + username);

            /*sweetService.getPlacesSweets(username, function (placeSweets) {
                console.log("Successfully retrieved place sweets custom" + placeSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.placeSweets = placeSweets;
                });
            });*/

            sweetService.getPlacesInfo(username, function (placeInfo) {
                console.log("Successfully retrieved place info custom" + placeInfo.length + " scores.");

                $scope.safeApply(function () {
                    $rootScope.currentPlace = placeInfo;

                    if (placeInfo[0].get("placePhoto") == '' || placeInfo[0].get("placePhoto") == null){
                        $scope.imagePlaceBanner = 'images/main-circle-img-banner.jpg';
                    } else {
                        $scope.imagePlaceBanner = placeInfo[0].get("placePhoto");
                    }

                    $scope.gustPageInfo = true;
                });
            });

            /*sweetService.getPlacestoJoin(username ,$scope.friend.id, function(placeDetailSweets) {
             console.log("Successfully retrieved join user " + placeDetailSweets.length + " scores.");
             if (placeDetailSweets.length == 0){
             $rootScope.placeJoin = true;
             } else {
             $rootScope.placeJoin = false;
             }
             });*/

            sweetService.getPlacesDetail(username, function (placeDetailSweets) {
                console.log("Successfully retrieved place users custom" + placeDetailSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.usersInPlaces = placeDetailSweets;
                });
            });
            $rootScope.placeJoin = false;
            //$location.path("/" + username);

        }

    }

    // Update the rendering of the page.
    var render = function () {
        console.log("---Rendering---");

        $scope.safeApply(function () {
            $rootScope.latestSweet = {};
        });

        $scope.updateLoginInfo();

        //alpha
        //Non user + logout state + this device + public pages for place and users >
        /*var renderGuestAction = $route.current.action; //$location.path();
        var renderGuestPath = renderGuestAction.split( "." );
        var username = ($routeParams.name || "");*/

        //alpha
        /*if(renderGuestPath[1] == 'custom' && username != "" ){
            $rootScope.publicName = username;
            //console.log("render username Guest-->" + $scope.publicName);
        }
        if (username == "[object Object]"){
            $rootScope.publicName = '';
        }*/

        //alpha
        /*if($rootScope.publicName != '' && !$scope.isUserLoggedIn ) {

            //console.log("Rendering Step1 --->");
            $scope.isPublicPage = true;
            $scope.showLogin = false;

            //console.log("sweetname Guest--> " + $rootScope.publicName);
            //$scope.$apply( $location.path( '/'+ $rootScope.publicName ) );

            $scope.showPlaceFeed = true ;
            $location.path('/'+ $rootScope.publicName);
            //$window.location('/'+ $rootScope.publicName);
        }*/

        // Non user + logout state + this device >
        //alpha
        /*if ($location.path() == '/' || $location.path() == '/u/auth' && !$scope.isUserLoggedIn) {
            //console.log("Rendering Step2 --->");
            //console.log("constant auth: " + CONSTANTS.ROUTES.AUTH);
            $location.path(CONSTANTS.ROUTES.AUTH);
            $scope.showLogin = true;
        }*/

        // Non user + logout state + this device >
        /*if ($location.path() == '/' && !$scope.isUserLoggedIn) {
            //console.log("constant auth: " + CONSTANTS.ROUTES.AUTH);
            $location.path(CONSTANTS.ROUTES.AUTH);
            $scope.showLogin = true;
        }*/

        //Existing user + logged in + this devise >
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

        console.log("renderPath[ 0 ] --> " + renderPath[ 0 ]);
        console.log("renderPath[ 1 ] --> " + renderPath[ 1 ]);

        var isAuth = (renderPath[ 0 ] == "auth");
        var isAuthLink = (renderPath[ 0 ] == "authlink");
        var authToken = $routeParams.token;
        var isSweet = (renderPath[ 0 ] == "sweet");
        var isSweetness = (renderPath[ 0 ] == "s");
        var sweetId = $routeParams.sweetId;
        var publicPlace = (renderPath[ 0 ] == "name");//alpha

        // Store the values in the model.
//        $scope.isUserLoggedIn = userLoggedIn;
        $rootScope.renderAction = renderAction;
        $rootScope.renderPath = renderPath;
        $scope.isSweet = isSweet;
        $scope.isSweetness = isSweetness;
        $scope.sweetId = sweetId;
        $scope.isAuth = isAuth;
        $scope.authToken = authToken;
        $scope.publicPlace = publicPlace;

        switch (renderAction) {
            case "sweet.friend":
            case "sweet.timeline":
            case "sweet.feed":
                $scope.wrapper = "wrapper-feeds";
                break;
            case "locations.place":
            case "name.custom":
                $scope.wrapper = "wrapper-feeds-place";
                $rootScope.sweeter.name = "Sweet Place";
                break;
            //case "place.sweetplace":
            case "place.feed":
            case "place.friend":
                $scope.wrapper = "wrapper-feeds";
                $scope.activeFeed = "active";
                $scope.activePlace = "";
                //$scope.search_btn = "search";
                break;
            case "place.timeline":
                $scope.wrapper = "wrapper-feeds";
                $scope.activeFeed = "";
                $scope.activePlace = "";
                //$scope.search_btn = "search";
                break;
            case "place.myplaces":
            case "place.interactionp":
                $scope.wrapper = "wrapper-feeds";
                $scope.activePlace = "active";
                $scope.activeFeed = "";
                //$scope.search_btn = "search";
                break;
            default:
                $scope.wrapper = "wrapper";
                $scope.activeFeed = "";
                $scope.activePlace = "";
                break;
        }

        console.log("Render Action: " + renderAction);
        console.log("Render Path0: " + renderPath[0]);
        console.log("Render Path1: " + renderPath[1]);

        /*if (publicPlace && renderPath[1] == 'custom' && !$scope.isUserLoggedIn) {
            console.log("Rendering Step4 --->");
            //console.log("sweetname check--> " + $rootScope.publicName);
             //$location.path('/'+ $rootScope.publicName);
            $scope.isPublicPage = true;
            $scope.showLogin = false;
            //$rootScope.publicName = username;
            console.log("render user name::" + username);
            $location.path("/" + $rootScope.publicName);
        }*/

        if (isAuth && renderPath[1] == 'new' && $scope.isUserLoggedIn) {
            console.log("isAuth and new and loggedin");
            $location.path(CONSTANTS.ROUTES.SWEET_HOME);
        }

        if (isAuthLink && authToken && $scope.isUserLoggedIn) {
            console.log("isAuthLink and authToken and $scope.isUserLoggedIn");
            $location.path(CONSTANTS.ROUTES.SWEET_HOME);
        }

        if (isAuth && renderPath[1] == 'sms') {
            console.log("isAuth and new and loggedin");
            $location.path(CONSTANTS.ROUTES.AUTH_SMS);
        }

//      TODO: should old auth entries deleted when requested for the new one for the same phone?
//      User clicked on SMS auth
        if (isAuthLink && authToken) {
            console.log("isAuthLink Step1--->");
            authService.authenticate(authToken, function (rUser) {
                var redirectPage;
                if (rUser) {
                    console.log("authenticated...");
                    console.log("isAuthLink Step2--->");
                    if (rUser.get("authData")) {
                        redirectPage = CONSTANTS.ROUTES.SWEET_HOME;
                        console.log("isAuthLink Step3--->");
                    } else {
                        redirectPage = CONSTANTS.ROUTES.FRIENDS_DISCOVER;
                        console.log("isAuthLink Step4--->");
                    }
                }
                else {
                    redirectPage = CONSTANTS.ROUTES.AUTH;
                    console.log("isAuthLink Step5--->");
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

        //alpha
        /*if (renderPath[1] == "custom" && $rootScope.publicName != '') {

            $scope.showPlaceFeed = true ;
            $rootScope.currentPlace = [];

            //var renderAction = $location.path();
            //var renderPath = renderAction.split( "/" );
            var renderAction = $route.current.action;
            var renderPath = renderAction.split(".");
            var username = ($routeParams.name || "");
            //$rootScope.publicName = username;

            $scope.guestPlace = {};
            $scope.guestPlace.placeName = username;

            console.log("sweetname custom--> " + username);

            sweetService.getPlacesSweets(username, function (placeSweets) {
                console.log("Successfully retrieved place sweets custom" + placeSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.placeSweets = placeSweets;
                });
            });

            sweetService.getPlacesInfo(username, function (placeInfo) {
                console.log("Successfully retrieved place info custom" + placeInfo.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.currentPlace = placeInfo;
                    $scope.gustPageInfo = true;
                });
            });

            *//*sweetService.getPlacestoJoin(username ,$scope.friend.id, function(placeDetailSweets) {
             console.log("Successfully retrieved join user " + placeDetailSweets.length + " scores.");
             if (placeDetailSweets.length == 0){
                $rootScope.placeJoin = true;
             } else {
                $rootScope.placeJoin = false;
             }
             });*//*

            sweetService.getPlacesDetail(username, function (placeDetailSweets) {
                console.log("Successfully retrieved place users custom" + placeDetailSweets.length + " scores.");
                $scope.safeApply(function () {
                    $rootScope.usersInPlaces = placeDetailSweets;
                });
            });
            $rootScope.placeJoin = false;
            //$location.path("/" + username);

        }*/
//      1. User logged in but not social authorization (call facebookLink)  2. User is not logged in (call facebook login)

        if (isSweetness && sweetId) {

            sweetService.getSweet(sweetId, function (rSweet) {
                console.log("Sweet retrieved from persistent storage: " + rSweet);
                if (rSweet) {
                    $scope.safeApply(function () {
                        interactionService.setSweetForInteraction(rSweet);
                        $location.path("/u/auth");
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
        function (event, currentRoute, previousRoute) {
            console.log("$routeChangeSuccess");

            //$scope.updateLoginInfo();
            //console.log("Is user logedin : "  + $scope.isUserLoggedIn);

            /*var renderGuestAction = $route.current.action; //$location.path();
            var renderGuestPath = renderGuestAction.split( "." );
            var username = ($routeParams.name || "");
            console.log("renderGuestPath0" + renderGuestPath[0]);
            console.log("renderGuestPath1" + renderGuestPath[1]);
            console.log("username" + username);*/

            /**********************************************************/
            // Pull the "action" value out of the currently selected route.
            var renderAction = $route.current.action;
            var renderPath;
            // Also, let's update the render path so that we can start conditionally rendering parts of the page.
            if (renderAction)
                renderPath = renderAction.split(".");
            else
                renderPath = "";

            var isAuthLink = (renderPath[ 0 ] == "authlink");
            var authToken = $routeParams.token;
            /**********************************************************/
            if(isAuthLink && authToken){
                console.log("Check request and logedin user --> " );
                render();
            } else if (userService.currentUser() == null) {
                console.log("User Not logedin --> ");
                renderNotLogoIn();
            } else {
                console.log("User logedin --> " );
                render();
            }

        }
    );
}

function AuthController($log, $scope, authService, $location, CONSTANTS, facebookService, userService, $rootScope, sweetService) {

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
        //$location.path(CONSTANTS.ROUTES.AUTH_SENT);
        //window.location = CONSTANTS.ROUTES.AUTH_SENT;
        window.location = CONSTANTS.ROUTES.AUTH_SMS;
        window.location.reload();

    };

    // send user there sms authentication code
    $scope.newAuthSms = function () {

        console.log("--- AuthController SMS ---");
        console.log("User phone: " + $scope.user.phone);
        //console.log("User fullname: " +$scope.user.fullName);

        $log.info("--SMS Login---");
        /*$scope.safeApply(function() {
            $scope.section.loginInProgress = true;
            $scope.section.loginInProgressMsg = CONSTANTS.LOGIN_IN_PROGRESS;
        });*/
         authService.loginPhoneNumber($scope.user.phone, function (flag) {

             var redirectPage;

             if (flag == true){
                 console.log("Is user loged IN --> " + userService.currentUser());
                 redirectPage = CONSTANTS.ROUTES.KIOSK_REGISTER;
             } else {
                 console.log("Is user New --> " );
                 authService.createAuthSms($scope.user.phone);
                 redirectPage = CONSTANTS.ROUTES.AUTH_SMS;
             }

             //TODO: Display info message
             $scope.safeApply(function () {
                 //console.log("Redirecting to "+redirectPage + " after authlink.");
                 //$scope.section.loginInProgress = false;
                 $location.path(redirectPage)
             });
         });

        $scope.clearData();

        //TODO: add callback
        //$location.path(CONSTANTS.ROUTES.AUTH_SENT);
        //window.location = CONSTANTS.ROUTES.AUTH_SENT;
        //window.location = CONSTANTS.ROUTES.AUTH_SMS;
        //window.location.reload();
    };

    //Authenticate user according to there code
    $scope.smsLogin = function() {
        //TODO: should old auth entries deleted when requested for the new one for the same phone?
        //User clicked on SMS auth

        console.log("smsLogin Step1--->");
        console.log("User phone: " + $scope.user.sms);
        authService.authenticateSms($scope.user.sms, function (rUser) {
            var redirectPage;
            if (rUser) {
                console.log("authenticated...");
                console.log("smsLogin Step2--->");
                if (rUser.get("authData")) {
                    redirectPage = CONSTANTS.ROUTES.SWEET_HOME;
                    console.log("smsLogin Step3--->");
                } else {
                    redirectPage = CONSTANTS.ROUTES.KIOSK_REGISTER;
                    console.log("smsLogin Step4--->");
                }
            }
            else {
                redirectPage = CONSTANTS.ROUTES.AUTH;
                console.log("smsLogin Step5--->");
            }
            //TODO: Display info message
            $scope.safeApply(function () {
                //console.log("Redirecting to "+redirectPage + " after authlink.");
                $location.path(redirectPage)
            });
        });
    }


    //phonegap login
    $scope.phonegapFBLogin = function() {
        console.log('In home');

            FB.init({
                appId:'366407670138696', // App ID
                channelUrl:'http://localhost.local/sweet/bubble/channel.html', // Channel File
                status:true, // check login status
                cookie:true, // enable cookies to allow the server to access the session
                xfbml:true  // parse XFBML
            });

            // Additional init code here
            FB.login(function (response) {
                if (response.status === 'connected') {
                    var id = response.authResponse.userID;
                    var access_token = response.authResponse.accessToken;
                    var expiration_date = new Date();
                    expiration_date.setSeconds(expiration_date.getSeconds() + response.authResponse.expiresIn);
                    expiration_date = expiration_date.toISOString();
                    var authData = {
                            "id" : id,
                            "access_token" : access_token,
                            "expiration_date" : expiration_date
                    };

                    Parse.FacebookUtils.logIn(authData, {
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

                            /*console.log("UserInfo -->" + _.pairs(user));
                             console.log("UserInfo ID -->" + user.id);
                             console.log("UserInfo FBID" + user.get("authData")["facebook"]["id"]);*/

                            facebookService.updateUserInfo(user, function (rUser, rUserChannel) {
                                $scope.safeApply(function () {
                                    $scope.section.loginInProgress = false;
                                    if (rUserChannel)
                                        $rootScope.loadUserChannel();
                                    //$location.path(CONSTANTS.ROUTES.SWEET_HOME);
                                });
                            });

                            // Get user places
                            sweetService.getUserPlaces(user.get("authData")["facebook"]["id"], function (placeUserSweets) {
                                console.log("Successfully retrieved placeUserSweets " + placeUserSweets.length + " scores.");
                                $scope.safeApply(function () {
                                    $rootScope.listPlaces = placeUserSweets;
                                    console.log("Successfully retrieved listPlaces " + $rootScope.listPlaces.length + " scores.");
                                    $location.path(CONSTANTS.ROUTES.SWEET_HOME_PLACE);
                                });
                            });

                        },
                        error:function (user, error) {
                            console.log("User cancelled the Facebook login or did not fully authorize.");
                            console.log(error.message);
//                    cb(null);
                        }
                    });
                } else if (response.status === 'not_authorized') {
                    // not_authorized
                    console.log('not_authorized');
                } else {
                    // not_logged_in
                    console.log('not_logged_in');
                }
            });

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

                /*console.log("UserInfo -->" + _.pairs(user));
                 console.log("UserInfo ID -->" + user.id);
                 console.log("UserInfo FBID" + user.get("authData")["facebook"]["id"]);*/

                facebookService.updateUserInfo(user, function (rUser, rUserChannel) {
                    $scope.safeApply(function () {
                        $scope.section.loginInProgress = false;
                        if (rUserChannel)
                            $rootScope.loadUserChannel();
                        //$location.path(CONSTANTS.ROUTES.SWEET_HOME);
                    });
                });

                // Get user places
                sweetService.getUserPlaces(user.get("authData")["facebook"]["id"], function (placeUserSweets) {
                    console.log("Successfully retrieved placeUserSweets " + placeUserSweets.length + " scores.");
                    $scope.safeApply(function () {
                        $rootScope.listPlaces = placeUserSweets;
                        console.log("Successfully retrieved listPlaces " + $rootScope.listPlaces.length + " scores.");
                        $location.path(CONSTANTS.ROUTES.SWEET_HOME_PLACE);
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

    $scope.facebookUnLink = function () {
        //var user = userService.currentUser();
        console.log("current user facebookUnLink-->" + CONSTANTS.ROUTES.AUTH);
        Parse.User.logOut();
        window.location = "#/";
        window.location.reload();
        //$location.path(CONSTANTS.ROUTES.AUTH);
        //$location.path("/auth");
        /*if (Parse.FacebookUtils.isLinked(user)) {
         Parse.FacebookUtils.unlink(user);
         }*/
    };

    $scope.facebookPlaceLogin = function () {

        $log.info("--Facebook Place Login---");
        console.log('Place Name -> ' + $rootScope.publicName);

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

                facebookService.updateUserInfo(user, function (rUser, rUserChannel) {

                    $scope.addsweetplace =[];

                    $scope.safeApply(function () {
                        console.log("$scope.addsweetplace.LatLong" + $rootScope.currentPlace[0].get('LatLong'));
                        console.log("$scope.addsweetplace.gname" +  $rootScope.currentPlace[0].get('gname'));
                        console.log("$scope.addsweetplace.icon " +  $rootScope.currentPlace[0].get('icon'));
                        console.log("$scope.addsweetplace.joinReq " +  '1');
                        console.log("$scope.addsweetplace.userPic" +  'http://graph.facebook.com/'+ user.get("authData")["facebook"]["id"] + '/picture');
                        console.log("$scope.addsweetplace.userNetwork " +  'facebook');
                        console.log("$scope.addsweetplace.userName" +  rUserChannel.get("fullName"));
                        console.log("$scope.addsweetplace.userID " +  user.get("authData")["facebook"]["id"]);
                        console.log("$scope.addsweetplace.placeLatitude " +  $rootScope.currentPlace[0].get('placeLatitude'));
                        console.log("$scope.addsweetplace.placeLongitude " +  $rootScope.currentPlace[0].get('placeLongitude'));
                        console.log("$scope.addsweetplace.placeURL " +  $rootScope.currentPlace[0].get('placeURL'));
                        console.log("$scope.addsweetplace.placeDesc" +  $rootScope.currentPlace[0].get('placeDesc'));
                        console.log("$scope.addsweetplace.placeSweetName " +  $rootScope.currentPlace[0].get('placeSweetName')) ;
                        console.log("$scope.addsweetplace.placeName" +  $rootScope.currentPlace[0].get('placeName')) ;
                        console.log("$scope.addsweetplace.placeCreatorId" +  $rootScope.currentPlace[0].get('placeCreatorId')) ;
                        console.log("$scope.addsweetplace.placeTitle " +  $rootScope.currentPlace[0].get('placeTitle')) ;

                        $scope.addsweetplace.LatLong = $rootScope.currentPlace[0].get('LatLong');
                        $scope.addsweetplace.gname = $rootScope.currentPlace[0].get('gname');
                        $scope.addsweetplace.icon = $rootScope.currentPlace[0].get('icon');
                        $scope.addsweetplace.joinReq = '1';
                        $scope.addsweetplace.userPic = 'http://graph.facebook.com/'+ user.get("authData")["facebook"]["id"] + '/picture';
                        $scope.addsweetplace.userNetwork = '';
                        $scope.addsweetplace.userName = rUserChannel.get("fullName");
                        $scope.addsweetplace.userID = user.get("authData")["facebook"]["id"];
                        $scope.addsweetplace.placeLatitude = $rootScope.currentPlace[0].get('placeLatitude');
                        $scope.addsweetplace.placeLongitude = $rootScope.currentPlace[0].get('placeLongitude');
                        $scope.addsweetplace.placeURL = $rootScope.currentPlace[0].get('placeURL');
                        $scope.addsweetplace.placeDesc = $rootScope.currentPlace[0].get('placeDesc');
                        $scope.addsweetplace.placeSweetName = $rootScope.currentPlace[0].get('placeSweetName') ;
                        $scope.addsweetplace.placeName = $rootScope.currentPlace[0].get('placeName') ;
                        $scope.addsweetplace.placeCreatorId = $rootScope.currentPlace[0].get('placeCreatorId') ;
                        $scope.addsweetplace.placeTitle = $rootScope.currentPlace[0].get('placeTitle') ;

                        sweetService.checkUserPlaces(user.get("authData")["facebook"]["id"],$rootScope.currentPlace[0].get('placeName'), function (results) {
                           if (results.length > 0){
                               console.log("Successfully retrieved " + results.length);
                           } else {
                               sweetService.addSweetPlaceParse($scope.addsweetplace, function () {
                                   //$scope.facebookUnLink();
                               });

                           }

                           $scope.facebookUnLink();
                        });

                        /*sweetService.addSweetPlaceParse($scope.addsweetplace, function () {
                            $scope.facebookUnLink();
                        });*/

                        $scope.section.loginInProgress = false;
                        //if (rUserChannel)
                            //$rootScope.loadUserChannel();
                        console.log('Place Name -> ' + $rootScope.publicName);
                        $location.path('/'+ $rootScope.publicName);
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
//alpha
//==================================================================================================
function SweetCtrlPlace($window, UpdateService, $log, $scope, sweetService, interactionService, authService,
                        userService, $location, utilService, $rootScope, CONSTANTS, socialNetworksService, facebookService, $route,
                        $routeParams)
{

    console.log("call SweetCtrlPlace");
    var renderAction = $location.path();
    //var renderAction = $route.current.action;

    var renderPath = renderAction.split("/");
    //var renderPath = renderAction.split( "." );

    var username = ($routeParams.name || "");

    if (username == "" && username != '[object Object]') {
        username = $rootScope.publicName;
    }

    if (renderPath[1] != '' && renderPath[1] != 'custom' && renderPath[1] != '[object Object]') {
        username = renderPath[1];
        $rootScope.publicName = renderPath[1];
    }

    //console.log("SweetCtrlPlace $location.path() --> " + $location.path());
    //console.log("SweetCtrlPlace $route.current.action --> " + $route.current.action);
    //console.log("SweetCtrlPlace name --> " + username);
    //console.log("SweetCtrlPlace $rootScope.publicName --> " + $rootScope.publicName);
    //console.log("SweetCtrlPlace renderPath[0]--> " + renderPath[0]);
    //console.log("SweetCtrlPlace renderPath[1]--> " + renderPath[1]);

    // Store the values in the model.
    $scope.sweetName = username;


    $scope.isUserLoggedIn = true;
    $scope.showLogin = false;
    $scope.currentPage = 0;
    $scope.sweet = {};
    $scope.userSweets = [];
    $scope.newSweet = {};
    $scope.sweets = [];
    $scope.pageSize = CONSTANTS.DEFAULT_AVATAR_PAGINATION_SIZE;
    $scope.guestPlace = {};
    $rootScope.currentPlace = [];

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

    $scope.$watch($rootScope.publicName, function () {
        //console.log("sweetname in watch --> " + username);
        //console.log("sweetname in watch --> " + $scope.sweetName);

        /*sweetService.getPlacesSweets($rootScope.publicName, function (placeSweets) {
            console.log("Successfully retrieved place sweets SweetCtrlPlace" + placeSweets.length + " scores.");
            $scope.safeApply(function () {
                $rootScope.placeSweets = placeSweets;
            });
        });*/

        sweetService.getPlacesInfo($rootScope.publicName, function (placeInfo) {
            console.log("Successfully retrieved place info SweetCtrlPlace" + placeInfo.length + " scores.");
            $scope.safeApply(function () {
                $rootScope.currentPlace = placeInfo;
                $scope.gustPageInfo = true;
            });
        });

        /*sweetService.getPlacestoJoin(username ,$scope.friend.id, function(placeDetailSweets) {
         console.log("Successfully retrieved join user " + placeDetailSweets.length + " scores.");
         if (placeDetailSweets.length == 0){
         $rootScope.placeJoin = true;
         } else {
         $rootScope.placeJoin = false;
         }
         });*/

        sweetService.getPlacesDetail($rootScope.publicName, function (placeDetailSweets) {
            console.log("Successfully retrieved place users SweetCtrlPlace" + placeDetailSweets.length + " scores.");
            $scope.safeApply(function () {
                $rootScope.usersInPlaces = placeDetailSweets;
            });
        });

        //console.log("watch current palce info :: " + $rootScope.usersInPlaces[0].get('placeName'));
        //console.log("watch current palce info :: " + $rootScope.usersInPlaces[0].get('placeSweetName'));

        $scope.guestPlace.placeName = username;
    }, true);

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


    $scope.sendPlaceGesture = function (uplace) {
        console.log("---sendPlaceGesture3 ");
        $scope.setLastVisitedPage();

        $scope.placeInfo = [];
        $scope.placeInfo = uplace;
        $scope.magicButtonImage = uplace.get('userPic');
        console.log("---setFriend() " + uplace.get('userPic'));

        $scope.section.sending = true;
        $scope.showPlaceGestureSendActionsPlace = true;
        $location.path("/partials/sent");

        $scope.section.sendingPlace = true;
    }


    $scope.cancelSweetPlace = function (place) {
        console.log("cancelSweetPlace" + place.get("placeName"));
        $location.path('/' + place.get("placeName"));
    };

    $scope.sendSweetnessPlaceGesture = function (placeInfo, sweetId) {
        //$scope.showmobileActions = false;
        $scope.section.sending = true;

        //if(sweetId) $scope.newSweet.replyToSweet = sweetId;
        $scope.newSweet.receiverPhone = placeInfo.get("userID");
        $scope.newSweet.receiverName = placeInfo.get("userName");
        $scope.newSweet.receiverChannel = placeInfo.get("userNetwork");
        $scope.newSweet.receiverPicture = placeInfo.get("userPic");
        $scope.newSweet.placename = placeInfo.get("placeName");
        $scope.newSweet.placesweetname = placeInfo.get("placeName");


        $scope.newSweet.senderId = "miscellaneous";
        $scope.newSweet.senderName = "SweetCustomer";
        $scope.newSweet.senderPhone = "miscellaneous";
        $scope.newSweet.senderChannel = "miscellaneous";
        $scope.newSweet.senderPicture = "img/thanx.png";

        //if user not login
        if (userService.currentUser() == null) {
            $scope.newSweet.currentUser = "SweetCustomer";
            $scope.newSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[3];
        } else {
            $scope.newSweet.gesture = CONSTANTS.GESTURES[0].sub_actions[2];
        }

        console.log($scope.newSweet.receiverName);
        console.log($scope.newSweet.gesture);
        //console.log(userService.currentUser());
        console.log("----Save Sweet Place SweetCtrlPlace -------");

        $scope.newSweet.text = "Thank You, all of you";

        sweetService.saveSweet($scope.newSweet, function (rSweet, rUserSweet) {
            $scope.safeApply(function () {
                $scope.sweets.push(rSweet);
                $scope.sweets.sortByProp("updatedAt");
            });

            $scope.safeApply(function () {
                facebookService.postToWall(rSweet, $scope.newSweet.gesture.facebook_template, function (success) {
                    //$scope.$parent.updateLoginInfo();
                    $scope.squeezed = false;

                    setTimeout(function () {
                        $scope.section.sending = false;
                        $scope.safeApply();
                    }, 4000);

                });
            });
            //$location.path("/location/sweetplace");
        });


        sweetService.saveSweetofPlace($scope.newSweet, function () {
            /*$scope.safeApply(function() {
             $scope.sweets.push(rSweet);
             $scope.sweets.sortByProp("updatedAt");
             });*/
        });

        /*sweetService.saveSweetPlace($scope.newSweet, function(rSweet,rUserSweet) {
         $scope.safeApply(function() {
         $scope.sweets.push(rSweet);
         $scope.sweets.sortByProp("updatedAt");
         });
         });*/

        //$location.path('/' + placeInfo.get("placeName") );

        $scope.refrest(placeInfo.get("placeName"));
        $scope.showPlaceGestureSendActionsPlace = false;
        $scope.section.sendingPlace = false;
    };

    $scope.refrest = function (placename) {
        $location.path('/' + placename);
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

    $scope.user = {
        fullName:null,
        phone:null
    };

    $scope.clearData = function () {
        $scope.user = {
            fullName:null,
            phone:null
        };
    };

    $scope.newAuthLocation = function () {

        //console.log("\n--- AuthController ---");
        console.log("User phone: " + $scope.user.phone);
        //console.log("User fullname: " +$scope.user.fullName);
        authService.createAuth($scope.user.phone, $scope.user.fullName || "NoName");
        $scope.clearData();
//        TODO: add callback
        $scope.showmobileActions = false;
        $location.path('/location/sweetplace');

    };

    $scope.newAuthLocationCancel = function () {
        $scope.showmobileActions = false;
        $location.path('/location/sweetplace');
    };
}

//alpha
/*
function mapController($scope) {

    angular.extend($scope, {

        /*/
/** the initial center of the map *//*
*/
/*
        centerProperty:{
            latitude:45,
            longitude:-73
        },

        /*/
/** the initial zoom level of the map *//*
*/
/*
        zoomProperty:8,

        /*/
/** list of markers to put in the map *//*
*/
/*
        markersProperty:[
            {
                latitude:45,
                longitude:-74
            }
        ],

        // These 2 properties will be set when clicking on the map
        clickedLatitudeProperty:null,
        clickedLongitudeProperty:null
    });
}
*/
