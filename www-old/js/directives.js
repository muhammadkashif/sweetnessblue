'use strict';

/* Directives */

sweetApp.directive('timeago', function ($timeout) {
    return {
        restrict:'E',
        link:function (scope, elem, attrs) {
            elem.text("5 min ago");
            console.log(scope.title);
            scope.$watch(attrs.title, function (value) {
                if (value) elem.text(jQuery.timeago(value));
            });
        }
    };
});

sweetApp.directive('sweetTimeago', function ($timeout) {
    return {
        restrict:'A',
        scope:true,
        link:function (scope, element, attrs) {

            var updateTime = function () {
                scope.timeago = jQuery.timeago(attrs.sweetTimeago);
                $timeout(updateTime, 300000);
            };
            scope.$watch(function () {
                return attrs.sweetTimeago;
            }, updateTime);
        }
    };
});

sweetApp.directive('timeagoAutoupdate', function ($timeout) {
    return {
        restrict:'A',
        link:function (scope, elem, attrs) {
            var updateTime = function () {
                if (attrs.timeagoAutoupdate) {
                    console.log("$$$$$$$$$$$$$$$$$$$$");
                    var time = scope.$eval(attrs.timeagoAutoupdate);
                    console.log(time);
                    elem.text(jQuery.timeago(time));
                    $timeout(updateTime, 15000);
                }
            };
            updateTime();
//            scope.$watch(attrs.timeago, updateTime);
        }
    };
});

sweetApp.directive('tap', function ($window, CONSTANTS) {

    return {

        restrict:'A',

        link:function (scope, elem, attrs) {

            var hammer = new Hammer(elem[0], {
                hold_timeout:3000
            });

            hammer.onhold = function (ev) {
                scope.sendSqueeze(JSON.parse(attrs.friend));
            };

            hammer.onswipe = function (ev) {
                console.log("---tap onSwipe--- " + _.pairs(ev));
                scope.$apply(function () {
                    if (ev.direction == "left")
                        scope.nextPage();
                    else
                        scope.prevPage();
                });
            };

            hammer.ondragend = function (ev) {
                console.log("---tap ondragend--- " + _.pairs(ev));
                scope.$apply(function () {
                    if (ev.direction == "up") {
                        console.log("---Drag up---");
                        scope.setFriend(JSON.parse(attrs.friend));
                    }
                    if (ev.direction == "left")
                        scope.nextPage();
                    else
                        scope.prevPage();

                });
            };
        }
    }
});

sweetApp.directive('tapplace', function ($window, CONSTANTS) {

    return {

        restrict:'A',

        link:function (scope, elem, attrs) {

            var hammer = new Hammer(elem[0], {
                hold_timeout:3000
            });

            hammer.onhold = function (ev) {
                scope.sendSqueeze(JSON.parse(attrs.friend));
            };

            hammer.onswipe = function (ev) {
                console.log("---tap onSwipe--- " + _.pairs(ev));
                scope.$apply(function () {
                    if (ev.direction == "left")
                        scope.nextPage_place();
                    else
                        scope.prevPage_place();
                });
            };

            hammer.ondragend = function (ev) {
                console.log("---tap ondragend--- " + _.pairs(ev));
                scope.$apply(function () {
                    if (ev.direction == "up") {
                        console.log("---Drag up---");
                        scope.setFriend(JSON.parse(attrs.friend));
                    }
                    if (ev.direction == "left")
                        scope.nextPage_place();
                    else
                        scope.prevPage_place();

                });
            };
        }
    }
});

sweetApp.directive('tapinter', function ($window, CONSTANTS) {

    return {

        restrict:'A',

        link:function (scope, elem, attrs) {

            var hammer = new Hammer(elem[0], {
                hold_timeout:3000
            });

            hammer.onhold = function (ev) {
                scope.sendSqueeze(JSON.parse(attrs.friend));
            };

            hammer.onswipe = function (ev) {
                console.log("---tap onSwipe--- " + _.pairs(ev));
                scope.$apply(function () {

                    if (ev.direction == "up")
                        scope.nextPage_interaction();
                    else
                        scope.prevPage_interaction();

                    if (ev.direction == "left")
                        scope.nextPage_interaction();
                    else
                        scope.prevPage_interaction();
                });
            };

            hammer.ondragend = function (ev) {
                console.log("---tap ondragend--- " + _.pairs(ev));
                scope.$apply(function () {
                    if (ev.direction == "up")
                        scope.nextPage_interaction();
                    else
                        scope.prevPage_interaction();

                    if (ev.direction == "left")
                        scope.nextPage_interaction();
                    else
                        scope.prevPage_interaction();

                });
            };
        }
    }
});

sweetApp.directive('tapplace', function ($window, CONSTANTS) {

    return {

        restrict:'A',

        link:function (scope, elem, attrs) {

            var hammer = new Hammer(elem[0], {
                hold_timeout:3000
            });

            hammer.onhold = function (ev) {
                scope.sendSqueeze(JSON.parse(attrs.friend));
            };

            hammer.onswipe = function (ev) {
                console.log("---tap onSwipe--- " + _.pairs(ev));
                scope.$apply(function () {

                    if (ev.direction == "up")
                        scope.nextPage_placesweet();
                    else
                        scope.prevPage_placesweet();

                    if (ev.direction == "left")
                        scope.nextPage_placesweet();
                    else
                        scope.prevPage_placesweet();
                });
            };

            hammer.ondragend = function (ev) {
                console.log("---tap ondragend--- " + _.pairs(ev));
                scope.$apply(function () {
                    if (ev.direction == "up")
                        scope.nextPage_placesweet();
                    else
                        scope.prevPage_placesweet();

                    if (ev.direction == "left")
                        scope.nextPage_placesweet();
                    else
                        scope.prevPage_placesweet();

                });
            };
        }
    }
});

sweetApp.directive('dragCircles', function ($window, $location) {

    return {

        restrict:'A',
        link:function (scope, elem, attrs) {

            var hammer = new Hammer(elem[0], {
                drag:true,
                drag_vertical:true,
                drag_horizontal:false,
                drag_min_distance:0,
                swipe:false,

                transform:false,
                tap:false,
                tap_double:false,
                hold:false
            });

            hammer.ondragend = function (ev) {
                console.log("---tap ondragend--- " + _.pairs(ev));
                scope.$apply(function () {
                    if (ev.direction == "up") {
                        console.log("---Drag up---");
                        scope.navigateToInteraction();
                    }
                    if (ev.direction == "down")
                        scope.navigateToLastVisitedPage();

                });
            };
        }
    }
});

sweetApp.directive('flip', function ($window, $location) {

    return {

        restrict:'A',
        link:function (scope, elem, attrs) {

            var hammer = new Hammer(elem[0], {
                drag:false,
                drag_vertical:false,
                drag_horizontal:true,
                drag_min_distance:0,
                swipe:true,

                transform:false,
                tap:false,
                tap_double:false,
                hold:false
            });

            var navigateTo = function (page) {

                scope.$apply(function () {
                    switch (page) {
                        case "/sweet/friend":
                            scope.navigateToInteraction();
                            break;
                        case "/sweet/timeline":
                            scope.showTimeline();
                            break;
                        case "/sweet/feed":
                            scope.showFeed();
                            break;

                    }
                });
            };

            var direction = function (angle) {
                console.log("---swipe angle--- " + angle);
                if (angle >= -10.0 && angle <= 10.0) {
                    console.log("---Swiped Right");
                    return "right";

                }

                if ((angle >= 170.0 && angle <= 180.0) ||
                    (angle <= -170.0 && angle >= -180.0)
                    ) {
                    console.log("---Swiped Left");
                    return "left";
                }

                return "unknown";

            };

            hammer.onswipe = function (ev) {
                var swipeDirection = direction(ev.angle);

                switch (swipeDirection) {
                    case "left":
                        navigateTo(attrs.leftpage);
                        break;
                    case "right":
                        navigateTo(attrs.rightpage);
                        break;
                }

            };

//            hammer.tap = function(ev) {
//
//                console.log("flip tap");
//            };
//
//            hammer.ondragend = function(ev) {
//                console.log("flip drag "+_.pairs(ev));
//                scope.$apply(function() {
//                    if(ev.direction == "left")
//                        navigateTo(attrs.leftpage);
//                    else
//                        navigateTo(attrs.rightpage);
//
//                });
//            };
        }
    }
});

sweetApp.directive('flipplace', function ($window, $location) {

    return {

        restrict:'A',
        link:function (scope, elem, attrs) {

            var hammer = new Hammer(elem[0], {
                drag:false,
                drag_vertical:false,
                drag_horizontal:true,
                drag_min_distance:0,
                swipe:true,

                transform:false,
                tap:false,
                tap_double:false,
                hold:false
            });

            var navigateTo = function (page) {

                scope.$apply(function () {
                    switch (page) {
                        case "/place/friend":
                            scope.navigateToInteraction();
                            break;
                        case "/place/timeline":
                            scope.showTimelinePlace();
                            break;
                        case "/place/feed":
                            scope.showFeedPlace();
                            break;

                    }
                });
            };

            var direction = function (angle) {
                console.log("---swipe angle--- " + angle);
                if (angle >= -10.0 && angle <= 10.0) {
                    console.log("---Swiped Right");
                    return "right";

                }

                if ((angle >= 170.0 && angle <= 180.0) ||
                    (angle <= -170.0 && angle >= -180.0)
                    ) {
                    console.log("---Swiped Left");
                    return "left";
                }

                return "unknown";

            };

            hammer.onswipe = function (ev) {
                var swipeDirection = direction(ev.angle);

                switch (swipeDirection) {
                    case "left":
                        navigateTo(attrs.leftpage);
                        break;
                    case "right":
                        navigateTo(attrs.rightpage);
                        break;
                }

            };

//            hammer.tap = function(ev) {
//
//                console.log("flip tap");
//            };
//
//            hammer.ondragend = function(ev) {
//                console.log("flip drag "+_.pairs(ev));
//                scope.$apply(function() {
//                    if(ev.direction == "left")
//                        navigateTo(attrs.leftpage);
//                    else
//                        navigateTo(attrs.rightpage);
//
//                });
//            };
        }
    }
});

sweetApp.directive('sweet', function (CONSTANTS, userService) {

    return {

        restrict:'A',
        link:function (scope, elem, attrs) {

            var sweetPerson = function (sweet) {
                if (sweet) {
                    if (sweet.senderId == userService.currentUser().id) return "You";
                    else return sweet.senderName.split(" ")[0];
                }
                else return;
            };

            var sweetPersonMe = function (sweet) {
                if (sweet) {
                    if (sweet.receiverPhone == sweet.senderPhone)
                        return "yourself";
                    else if (sweet.receiverPhone == userService.currentUser().get("username"))
                        return "you";
                    else
                        return sweet.receiverName.split(" ")[0];
                } else {
                    return;
                }
            };


            attrs.$observe('sweet', function () {
                console.log("--------------- sweet" + attrs.sweet);
                scope.safeApply(function () {

                    var s = "", template,
                        sweet = JSON.parse(attrs.sweet),
                        sweetType = sweet.gesture.type,
                        person1 = sweetPerson(sweet),
                        person2 = sweetPersonMe(sweet),
                        gestureTemplate,
                        myGestureTemplate;

                    CONSTANTS.GESTURES.forEach(function (object) {
                        object.sub_actions.forEach(function (sub_action) {
                            if (sub_action.type.toLowerCase() == sweetType.toLowerCase()) {
                                gestureTemplate = sub_action.template;
                                myGestureTemplate = sub_action.my_template;
                                return false;
                            }
                        });
                    });

                    if (CONSTANTS.SQUEEZE.type.toLowerCase() == sweetType.toLowerCase()) {
                        gestureTemplate = CONSTANTS.SQUEEZE.template;
                        myGestureTemplate = CONSTANTS.SQUEEZE.my_template;
                    }

                    if (myGestureTemplate && gestureTemplate) {
                        if (person1 == "You") {
                            template = _.template(myGestureTemplate);
                            s = template({person2:person2});
                        } else {
                            template = _.template(gestureTemplate);
                            s = template({person1:person1});
                        }
                    }
                    console.log("person1" + person1);
                    console.log("person2" + person2);
                    console.log("gestureTemplate" + gestureTemplate);
                    console.log("myGestureTemplate" + myGestureTemplate);
                    elem[0].innerHTML = s;
                });
            });
        }
    }
});

sweetApp.directive('sweetpublic', function (CONSTANTS, userService) {
    console.log("---------------sweetPublic");
    return {

        restrict:'A',
        link:function (scope, elem, attrs) {

            var sweetPerson = function (sweet) {
                if (sweet) {
                    if (sweet.senderId == userService.currentUser().id) return "You";
                    else return sweet.senderName.split(" ")[0];
                }
                else return;
            };

            var sweetPersonLogout = function (sweet) {
                if (sweet) {
                    return sweet.senderName.split(" ")[0];
                }
                else return;
            };

            var sweetPersonMe = function (sweet) {
                if (sweet) {
                    if (sweet.receiverPhone == sweet.senderPhone)
                        return "yourself";
                    else if (sweet.receiverPhone == userService.currentUser().get("username"))
                        return "you";
                    else
                        return sweet.receiverName.split(" ")[0];
                } else {
                    return;
                }
            };

            var sweetPersonGuest = function (sweet) {
                if (sweet) {
                    if (sweet.senderId == "SweetCustomer") return "Sweet Customer";
                    //else return sweet.senderName.split(" ")[0];
                }
                else return;
            };

            attrs.$observe('sweetpublic', function () {
                //console.log("---------------sweetPublic "+ attrs.sweetpublic);
                //console.log("userService.currentUser()" + userService.currentUser());
                scope.safeApply(function () {

                    if (userService.currentUser() == null) {
                        var s = "", template,
                            sweet = JSON.parse(attrs.sweetpublic),
                            sweetType = sweet.gesture.type,
                            person1 = sweetPersonLogout(sweet),
                            person2 = "Null",
                            person3 = sweetPersonGuest(sweet),
                            gestureTemplate,
                            myGestureTemplate,
                            guestTemplate;
                    } else {
                        var s = "", template,
                            sweet = JSON.parse(attrs.sweetpublic),
                            sweetType = sweet.gesture.type,
                            person1 = sweetPerson(sweet),
                            person2 = sweetPersonMe(sweet),
                            person3 = sweetPersonGuest(sweet),
                            gestureTemplate,
                            myGestureTemplate,
                            guestTemplate;
                    }


                    CONSTANTS.GESTURES.forEach(function (object) {
                        object.sub_actions.forEach(function (sub_action) {
                            if (sub_action.type.toLowerCase() == sweetType.toLowerCase()) {
                                gestureTemplate = sub_action.template;
                                myGestureTemplate = sub_action.my_template;
                                guestTemplate = sub_action.guest_template
                                console.log("sub_action");
                                return false;
                            }
                        });
                    });

                    if (CONSTANTS.SQUEEZE.type.toLowerCase() == sweetType.toLowerCase()) {
                        gestureTemplate = CONSTANTS.SQUEEZE.template;
                        myGestureTemplate = CONSTANTS.SQUEEZE.my_template;
                    }

                    if (myGestureTemplate && gestureTemplate) {
                        if (person1 == "You") {
                            template = _.template(myGestureTemplate);
                            s = template({person2:person2});
                        } else if (person3 == "Sweet Customer") {
                            template = _.template(guestTemplate);
                            s = template({person3:person3});
                        } else {
                            template = _.template(gestureTemplate);
                            s = template({person1:person1});
                        }
                    }

                    console.log("person3" + person3);
                    console.log("person1" + person1);
                    //console.log("gestureTemplate" + gestureTemplate);
                    //console.log("myGestureTemplate" + myGestureTemplate);

                    elem[0].innerHTML = s;
                });
            });
        }
    }
});

sweetApp.directive('map', function () {
    return {
        restrict:'E',
        replace:true,
        template:'<div></div>',
        link:function (scope, element, attrs) {
            console.log(element);

            var latlng = new google.maps.LatLng(-34.397, 150.644);

            var map = new google.maps.Map(document.getElementById(attrs.id), {
                center:latlng,
                zoom:14,
                panControl:false,
                mapTypeControl:true,
                mapTypeControlOptions:{
                    style:google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                zoomControl:true,
                zoomControlOptions:{
                    style:google.maps.ZoomControlStyle.SMALL
                },
                scaleControl:false,

                mapTypeId:google.maps.MapTypeId.ROADMAP
            });

            var pos;
            // Try HTML5 geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = new google.maps.LatLng(position.coords.latitude,
                        position.coords.longitude);

                    var infowindow = new google.maps.InfoWindow({
                        map:map,
                        position:pos,
                        content:'Location found.'
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

            var input = (document.getElementById('target'));
            var searchBox = new google.maps.places.SearchBox(input);
            var markers = [];

            google.maps.event.addListener(searchBox, 'places_changed', function () {
                var places = searchBox.getPlaces();
                var photos = places.photos;

                for (var i = 0, marker; marker = markers[i]; i++) {
                    marker.setMap(null);
                }

                markers = [];
                var bounds = new google.maps.LatLngBounds();

                for (var i = 0, place; place = places[i]; i++) {
                    var image = {
                        url:place.icon,
                        size:new google.maps.Size(71, 71),
                        origin:new google.maps.Point(0, 0),
                        anchor:new google.maps.Point(17, 34),
                        scaledSize:new google.maps.Size(25, 25)
                    };

                    var marker = new google.maps.Marker({
                        map:map,
                        icon:image,
                        title:place.name,
                        position:place.geometry.location
                    });

                    /*console.log("Place loaction -->>" + place.geometry.location);
                     console.log("place photos -->>" + place.photos);
                     console.log("place name -->>" + place.name);
                     console.log("place details -->>" + place.details);
                     console.log("place icon -->>" +place.icon);

                     $rootScope.placeSearchResults = [];
                     $rootScope.placeSearchResults.LatLong = place.geometry.location;
                     $rootScope.placeSearchResults.photo = place.photos ;
                     $rootScope.placeSearchResults.gname = place.name ;
                     $rootScope.placeSearchResults.icon = place.icon ;*/

                    markers.push(marker);

                    bounds.extend(place.geometry.location);
                }

                map.fitBounds(bounds);
            });

            google.maps.event.addListener(map, 'bounds_changed', function () {
                var bounds = map.getBounds();
                searchBox.setBounds(bounds);
            });

            //$location.path('/place/gmap');
            //$location.path('/place/createSweetPlace');
            google.maps.event.trigger(map, 'resize');

            google.maps.event.addListenerOnce(map, 'idle', function () {
                google.maps.event.trigger(map, 'resize');
                map.setCenter(pos);
            });

            window.setTimeout(function () {
                google.maps.event.trigger(map, 'resize');
            }, 1000);

            google.maps.event.addDomListener(window, 'load', 'resize');

            /*var myOptions = {
             zoom: 6,
             center: new google.maps.LatLng(46.87916, -3.32910),
             mapTypeId: google.maps.MapTypeId.ROADMAP
             };
             var map = new google.maps.Map(document.getElementById(attrs.id), myOptions);

             google.maps.event.addListener(map, 'click', function(e) {
             scope.$apply(function() {
             addMarker({
             lat: e.latLng.lat(),
             lng: e.latLng.lng()
             });

             console.log(e);
             });

             });

             addMarker= function(pos){
             var myLatlng = new google.maps.LatLng(pos.lat,pos.lng);
             var marker = new google.maps.Marker({
             position: myLatlng,
             map: map,
             title:"Hello World!"
             });
             } */

        }
    };
});

sweetApp.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            readonly: '@',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function() {
                scope.stars = [];
                for (var  i = 0; i < scope.max; i++) {
                    scope.stars.push({filled: i < scope.ratingValue});
                }
            };

            scope.toggle = function(index) {
                if (scope.readonly && scope.readonly === 'true') {
                    return;
                }
                scope.ratingValue = index + 1;
                scope.onRatingSelected({rating: index + 1});
            };

            scope.$watch('ratingValue', function(oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});

sweetApp.directive('starRating1', function () {
    return {
        restrict: 'A',
        template: '<ul class="comment-right rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '@',
            readonly: '@',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function() {
                scope.stars = [];
                for (var  i = 0; i < scope.max; i++) {
                    scope.stars.push({filled: i < scope.ratingValue});
                }
            };

            scope.toggle = function(index) {
                if (scope.readonly && scope.readonly === 'true') {
                    return;
                }
                scope.ratingValue = index + 1;
                scope.onRatingSelected({rating: index + 1});
            };

            scope.$watch('ratingValue', function(oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});

//Show the timer in round(circle) fashion
sweetApp.directive('timer', function () {
    console.log('timer directive');
    return {
        restrict: 'E',

        templateUrl: 'templates/timer.html',

        scope: {
            duration: '@',
            autostart: '@'
        },

        replace: true,

        link: function (scope) {
            scope.$watch('duration', function (_duration) {
                if (scope.autostart && _duration.length) {
                    setTimeout(function () {
                        scope.start();
                    }, 1);
                }
            });
        },

        controller: function ($rootScope, $scope) {
            var timerInterval = null,
                secondsLeft,
                duration,
                perMSIncrementPerSide,
                startRightAngle = -180,
                startLeftAngle = -180,
                startHandAngle = 0,
                perIterationIncrement;

            $scope.duration = 0;

            $scope.reset = function () {
                $scope.stop();

                $scope.currentRightAngle = startRightAngle;
                $scope.currentLeftAngle = startLeftAngle;
                $scope.currentHandAngle = startHandAngle;

                timerInterval = -1;

                secondsLeft = $scope.duration;
                duration = parseFloat(secondsLeft) * 1000;
                perMSIncrementPerSide = 360 / duration;
                perIterationIncrement = perMSIncrementPerSide * 10;

                console.log("secondsLeft --> " + secondsLeft);
                console.log("duration --> " + duration);
                console.log("perMSIncrementPerSide --> " + perMSIncrementPerSide);
                console.log("perIterationIncrement --> " + perIterationIncrement);
            };

            $scope.restart = function () {
                $scope.stop();
                $scope.reset();
                setTimeout(function () {
                    $scope.$apply(function () {
                        /*Starting after a timeout because the classes needs to be reset.*/
                        $scope.start();
                    });
                }, 1);
            };

            $scope.start = function () {
                $scope.reset();
                timerInterval = setInterval(function () {
                    /*
                     Notes:
                     Scopes does not get updated automatically when changed from inside setTimeout/setInterval blocks.
                     Hence should wrap it up inside $scope.apply block!
                     */
                    $scope.$apply(function () {
                        var angle, shouldStop = false;
                        if ($scope.currentRightAngle < 0) {
                            angle = $scope.currentRightAngle;
                            angle += perIterationIncrement;
                            if (angle > 0) {
                                angle = 0;
                            }
                            $scope.currentRightAngle = angle;
                        } else {
                            angle = $scope.currentLeftAngle;
                            angle += perIterationIncrement;
                            if (angle > -1) {
                                angle = 0;
                                shouldStop = true;
                            }
                            $scope.currentLeftAngle = angle;
                        }

                        if (shouldStop) {
                            $scope.stop(true);
                            $scope.currentHandAngle = 360;
                        } else {
                            $scope.currentHandAngle += perIterationIncrement;
                            if ($scope.currentHandAngle > 360) {
                                $scope.currentHandAngle = 360;
                            }
                        }
                    });

                    secondsLeft -= 1 / 100;

                }, 10);
                $scope.$emit('timer_started');
            };

            $scope.stop = function (ended) {
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = ended ? null : -1;
                    if (ended) {
                        $scope.$emit('timer_ended');
                    } else {
                        $scope.$emit('timer_stopped');
                    }
                }
            };

            $scope.getTimerStatus = function () {
                var status = 'stopped';
                if (timerInterval === null) {
                    status = 'ended';
                } else if (timerInterval !== -1) {
                    status = 'started';
                }
                return status;
            };

            $scope.getReadableCurrentTime = function () {
                var secs = secondsLeft < 0 ? 0 : secondsLeft,
                    split = 60,
                    min = 0,
                    rsecs = 0,
                    rmins = 0;

                if (secs > split) {
                    min = Math.floor(secs / split).toFixed(0);
                    rsecs = (secs % split).toFixed(0);
                } else {
                    rsecs = (secs * 1).toFixed(0);
                }

                if (rsecs < 10) {
                    rsecs = "0" + rsecs;
                }

                if (min < 10) {
                    min = "0" + min;
                }

                rmins = min + ":" + rsecs;
                return rmins;
            };

            $scope.reset();
            $rootScope.$broadcast('timer_initialized');
        }
    }
});

//File upload to parse.com directive
sweetApp.directive('sweetfileselect', function($rootScope, userService) {
    return {
        restrict: 'E',
        scope: {
            swfile: '=',
            userid: '=',
            showprogress: '=',
            setuseravatar: '&'
        },
        link: function (scope, element, attrs) {

            element.bind("click", function() {
                $rootScope.$broadcast("feedbackImg_upload");
            });

            element.bind("change", function(e) {

                var files = e.target.files || e.dataTransfer.files;
//                scope.$apply(function(){
                console.log("File upload attrs --> " + attrs.attr1);
                console.log("File upload userid --> " + scope.userid);
                console.log("Uploaded file --> " + files);
                var file = files[0];

                var serverUrl = 'https://api.parse.com/1/files/' + file.name;
                console.log("---sweetfileselect --- "+serverUrl);
                scope.$apply(function(){
                    scope.showprogress = 'true';
                });
                $.ajax({
                    type: "POST",
                    beforeSend: function(request) {
                        request.setRequestHeader("X-Parse-Application-Id", 'h2w6h5BLXG3rak7sQ2eyEiTKRgu3UPzQcjRzIFCu');
                        request.setRequestHeader("X-Parse-REST-API-Key", 'EexsGuVhcxUeMaJc41jOoTe620y8GS1m5KUj2ANG');
                        request.setRequestHeader("Content-Type", file.type);
                    },
                    url: serverUrl,
                    data: file,
                    processData: false,
                    contentType: false,
                    success: function(data) {
                        scope.$apply(function(){

                            scope.swfile = data.url;
                            console.log("File available at: " + scope.swfile);
                            //var query = new Parse.Query("UserChannel");
                            var query = new Parse.Query("PlaceSweetness");
                            //query.equalTo("userId", scope.userid);
                            query.equalTo("objectId", $rootScope.sweetofplaceid );
                            console.log("---sweetfleseelect---- userId"+scope.userid);
                            query.first({
                                success:function(rUserChannel) {
                                    console.log("---sweetfileselect--- "+rUserChannel.id);
                                    rUserChannel.set("avatarURL",data.url);
                                    rUserChannel.save(null,{
                                        success:function(sUserChannel) {
                                            console.log("Saved "+sUserChannel);
                                            scope.$apply(function() {
                                                console.log("--About to setUserAvatar--- "+sUserChannel.get("avatarURL"));
                                                $rootScope.userAvatar = sUserChannel.get("avatarURL");
                                                userService.setUserChannel(sUserChannel);
                                                $rootScope.$broadcast("load_user_channel");
                                                $rootScope.$broadcast("feedbackImg_uploaded");

                                                // scope.setuseravatar(data.url);
                                            });
                                        }
                                    });
                                }
                            });
//                                element.visibility = false;
//                                scope.showFileSelect = false;
//                                scope.setSweetExpression('picture');
                        });

                    },
                    error: function(data) {
                        var obj = jQuery.parseJSON(data);
                        console.log(obj.error);
                    }
                });
            });

//            });
        },
//        template:"<input type='file' name='gesturePictureSelect' id='gesturePictureSelect'/>"

        template: '<input type="file" accept="image/*" id="capture" capture="camera" class="fileholder-btn-2" size="0" >'
                    + "<span ng-show='showprogress' >"
                    + "<span class='progress_animation'><img src='images/animation.gif'/> </span>"
                    //+ "<timer-loading duration='5' autostart='true'></timer-loading>"
                    //+"<br/><br/>"
                    //+"Uploading..."
                    // +"<div class='progress progress-striped active'>"
                    // +"    <div class='bar' style='width: 40%;'></div>"
                    // +"  </div>"
                    // +"</div>"
                    + "</span>",

                    //+"</div>",

        controller:function($scope, $rootScope, userService) {
            $scope.$on("load_user_channel", function(rUserChannel) {
                console.log("---loadUserAvatar called--- " +userService.getUserChannel().get("avatarURL"));
                //$rootScope.userChannel.set("avatarURL",userService.getUserChannel().get("avatarURL"));
                //$rootScope.userAvatar = $rootScope.userChannel.get("avatarURL");
                //$rootScope.loadUserChannel();

                $scope.showprogress = 'false';

            });

        }
    };

});

//This directive is use as animation for upload files.
sweetApp.directive('timerLoading', function () {
    return {
        restrict: 'E',

        templateUrl: 'templates/loader.html',

        scope: {
            duration: '@',
            autostart: '@'
        },

        replace: true,

        link: function (scope) {
            scope.$watch('duration', function (_duration) {
                if (scope.autostart && _duration.length) {
                    setTimeout(function () {
                        scope.start();
                    }, 1);
                }
            });
        },

        controller: function ($rootScope, $scope) {
            var timerInterval = null,
                secondsLeft,
                duration,
                perMSIncrementPerSide,
                startRightAngle = -180,
                startLeftAngle = -180,
                startHandAngle = 0,
                perIterationIncrement;

            $scope.duration = 0;

            $scope.reset = function () {
                $scope.stop();

                $scope.currentRightAngle = startRightAngle;
                $scope.currentLeftAngle = startLeftAngle;
                $scope.currentHandAngle = startHandAngle;

                timerInterval = -1;

                secondsLeft = $scope.duration;
                duration = parseFloat(secondsLeft) * 1000;
                perMSIncrementPerSide = 360 / duration;
                perIterationIncrement = perMSIncrementPerSide * 10;
            };

            $scope.restart = function () {
                $scope.stop();
                $scope.reset();
                setTimeout(function () {
                    $scope.$apply(function () {
                        /*Starting after a timeout because the classes needs to be reset.*/
                        $scope.start();
                    });
                }, 1);
            };

            $scope.start = function () {
                $scope.reset();
                timerInterval = setInterval(function () {
                    /*
                     Notes:
                     Scopes does not get updated automatically when changed from inside setTimeout/setInterval blocks.
                     Hence should wrap it up inside $scope.apply block!
                     */
                    $scope.$apply(function () {
                        var angle, shouldStop = false;
                        if ($scope.currentRightAngle < 0) {
                            angle = $scope.currentRightAngle;
                            angle += perIterationIncrement;
                            if (angle > 0) {
                                angle = 0;
                            }
                            $scope.currentRightAngle = angle;
                        } else {
                            angle = $scope.currentLeftAngle;
                            angle += perIterationIncrement;
                            if (angle > -1) {
                                angle = 0;
                                //shouldStop = true;
                            }
                            $scope.currentLeftAngle = angle;
                        }

                        if (shouldStop) {
                            $scope.stop(true);
                            $scope.currentHandAngle = 360;
                        } else {
                            $scope.currentHandAngle += perIterationIncrement;
                            if ($scope.currentHandAngle > 360) {
                                $scope.currentHandAngle = 0;
                            }
                        }
                    });

                    secondsLeft -= 1 / 100;
                }, 10);
                $scope.$emit('timer_started');
            };

            $scope.stop = function (ended) {
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = ended ? null : -1;
                    if (ended) {
                        $scope.$emit('timer_ended');
                    } else {
                        $scope.$emit('timer_stopped');
                    }
                }
            };



            $scope.reset();
            //$rootScope.$broadcast('timer_initialized');
        }
    }
});


sweetApp.directive('angRoundProgress', [function () {
    var compilationFunction = function (templateElement, templateAttributes, transclude) {
        if (templateElement.length === 1) {
            var node = templateElement[0];

            var width = node.getAttribute('data-round-progress-width') || '400';
            var height = node.getAttribute('data-round-progress-height') || '400';

            var canvas = document.createElement('canvas');
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            canvas.setAttribute('data-round-progress-model', node.getAttribute('data-round-progress-model'));

            node.parentNode.replaceChild(canvas, node);

            var outerCircleWidth = node.getAttribute('data-round-progress-outer-circle-width') || '20';
            var innerCircleWidth = node.getAttribute('data-round-progress-inner-circle-width') || '5';

            var outerCircleBackgroundColor = node.getAttribute('data-round-progress-outer-circle-background-color') || '#505769';
            var outerCircleForegroundColor = node.getAttribute('data-round-progress-outer-circle-foreground-color') || '#12eeb9';
            var innerCircleColor = node.getAttribute('data-round-progress-inner-circle-color') || '#505769';
            var labelColor = node.getAttribute('data-round-progress-label-color') || '#12eeb9';

            var outerCircleRadius = node.getAttribute('data-round-progress-outer-circle-radius') || '100';
            var innerCircleRadius = node.getAttribute('data-round-progress-inner-circle-radius') || '70';

            var labelFont = node.getAttribute('data-round-progress-label-font') || '50pt Calibri';

            return {
                pre: function preLink(scope, instanceElement, instanceAttributes, controller) {
                    var expression = canvas.getAttribute('data-round-progress-model');
                    scope.$watch(expression, function (newValue, oldValue) {
                        // Create the content of the canvas
                        var ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, width, height);

                        // The "background" circle
                        var x = width / 2;
                        var y = height / 2;
                        ctx.beginPath();
                        ctx.arc(x, y, parseInt(outerCircleRadius), 0, Math.PI * 2, false);
                        ctx.lineWidth = parseInt(outerCircleWidth);
                        ctx.strokeStyle = outerCircleBackgroundColor;
                        ctx.stroke();

                        // The inner circle
                        ctx.beginPath();
                        ctx.arc(x, y, parseInt(innerCircleRadius), 0, Math.PI * 2, false);
                        ctx.lineWidth = parseInt(innerCircleWidth);
                        ctx.strokeStyle = innerCircleColor;
                        ctx.stroke();

                        // The inner number
                        ctx.font = labelFont;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = labelColor;
                        ctx.fillText(newValue.label, x, y);

                        // The "foreground" circle
                        var startAngle = - (Math.PI / 2);
                        var endAngle = ((Math.PI * 2 ) * newValue.percentage) - (Math.PI / 2);
                        var anticlockwise = false;
                        ctx.beginPath();
                        ctx.arc(x, y, parseInt(outerCircleRadius), startAngle, endAngle, anticlockwise);
                        ctx.lineWidth = parseInt(outerCircleWidth);
                        ctx.strokeStyle = outerCircleForegroundColor;
                        ctx.stroke();
                    }, true);
                },
                post: function postLink(scope, instanceElement, instanceAttributes, controller) {}
            };
        }
    };

    var roundProgress = {
        compile: compilationFunction,
        replace: true
    };
    return roundProgress;
}]);

sweetApp.directive('sweetplacefileselect', function($rootScope, userService) {
    return {
        restrict: 'E',
        scope: {
            swfile: '=',
            userid: '=',
            showprogress: '=',
            setuseravatar: '&'
        },
        link: function (scope, element, attrs) {

            element.bind("click", function() {
                $rootScope.$broadcast("feedbackImg_upload");
            });

            element.bind("change", function(e) {

                var files = e.target.files || e.dataTransfer.files;
//                scope.$apply(function(){
                console.log("File upload attrs --> " + attrs.attr1);
                console.log("File upload userid --> " + scope.userid);
                console.log("Uploaded file --> " + files);
                var file = files[0];

                var serverUrl = 'https://api.parse.com/1/files/' + file.name;
                console.log("---sweetfileselect --- "+serverUrl);
                scope.$apply(function(){
                    scope.showprogress = 'true';
                });
                $.ajax({
                    type: "POST",
                    beforeSend: function(request) {
                        request.setRequestHeader("X-Parse-Application-Id", 'h2w6h5BLXG3rak7sQ2eyEiTKRgu3UPzQcjRzIFCu');
                        request.setRequestHeader("X-Parse-REST-API-Key", 'EexsGuVhcxUeMaJc41jOoTe620y8GS1m5KUj2ANG');
                        request.setRequestHeader("Content-Type", file.type);
                    },
                    url: serverUrl,
                    data: file,
                    processData: false,
                    contentType: false,
                    success: function(data) {
                        scope.$apply(function(){

                            scope.swfile = data.url;
                            console.log("File available at: " + scope.swfile);
                            //var query = new Parse.Query("UserChannel");
                            var query = new Parse.Query("PlaceSweetness");
                            //query.equalTo("userId", scope.userid);
                            query.equalTo("objectId", $rootScope.sweetofplaceid );
                            console.log("---sweetfleseelect---- userId"+scope.userid);
                            query.first({
                                success:function(rUserChannel) {
                                    console.log("---sweetfileselect--- "+rUserChannel.id);
                                    rUserChannel.set("avatarURL",data.url);
                                    rUserChannel.save(null,{
                                        success:function(sUserChannel) {
                                            console.log("Saved "+sUserChannel);
                                            scope.$apply(function() {
                                                console.log("--About to setUserAvatar--- "+sUserChannel.get("avatarURL"));
                                                $rootScope.userAvatar = sUserChannel.get("avatarURL");
                                                userService.setUserChannel(sUserChannel);
                                                $rootScope.$broadcast("load_user_channel");
                                                $rootScope.$broadcast("feedbackImg_uploaded");

                                                // scope.setuseravatar(data.url);
                                            });
                                        }
                                    });
                                }
                            });
//                                element.visibility = false;
//                                scope.showFileSelect = false;
//                                scope.setSweetExpression('picture');
                        });

                    },
                    error: function(data) {
                        var obj = jQuery.parseJSON(data);
                        console.log(obj.error);
                    }
                });
            });

//            });
        },
//        template:"<input type='file' name='gesturePictureSelect' id='gesturePictureSelect'/>"

        template: '<input type="file" accept="image/*" id="capture" capture="camera" class="text-field" size="0" >'
            + "<span ng-show='showprogress' class='showupload'>"
            //+ "<span class='progress_animation'><img src='images/animation.gif'/> </span>"
            //+ "<timer-loading duration='5' autostart='true'></timer-loading>"
            //+"<br/><br/>"
            +"Uploading..."
            // +"<div class='progress progress-striped active'>"
            // +"    <div class='bar' style='width: 40%;'></div>"
            // +"  </div>"
            // +"</div>"
            + "</span>",

        //+"</div>",

        controller:function($scope, $rootScope, userService) {
            $scope.$on("load_user_channel", function(rUserChannel) {
                console.log("---loadUserAvatar called--- " +userService.getUserChannel().get("avatarURL"));
                //$rootScope.userChannel.set("avatarURL",userService.getUserChannel().get("avatarURL"));
                //$rootScope.userAvatar = $rootScope.userChannel.get("avatarURL");
                //$rootScope.loadUserChannel();

                $scope.showprogress = 'false';

            });

        }
    };

});