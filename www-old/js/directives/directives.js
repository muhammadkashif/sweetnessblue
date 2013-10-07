sweetApp.directive('imgupload', function () {
    return {
        restrict:'E',
        replace:true,
        template:"<div class='fileupload fileupload-new' data-provides='fileupload'>"
            + "<canvas id='myCanvas' class='fileupload-new thumbnail' style='width: 50px; height: 50px;'><img src='http://www.placehold.it/50x50/EFEFEF/AAAAAA' /></canvas>"
            + "<div class='fileupload-preview fileupload-exists thumbnail' style='width: 50px; height: 50px;'></div>"
            + "<span class='btn btn-file btn-primary'><span class='fileupload-new'>Select</span><span class='fileupload-exists'>Change</span><input type='file' /></span>"
            + "<a href='#' class='btn fileupload-exists' data-dismiss='fileupload'>Remove</a>"
            + "&nbsp;<button class='btn btn-primary' ng-click='submit()'>Upload</button>"
            + "</div>",

        // '<form method="post" enctype="multipart/form-data" ng-submit="submit()">' +
        //   '<input type="file" id="fileSelected"/>' +
        //   '<input type="submit"/></br>'+
        //   '<canvas id="myCanvas"></canvas>'+'<canvas id="canvas2"></canvas>'+
        // '</form>',
        controller:function ($scope, userService) {
            $scope.setImgSize = function (actual_w, actual_h, max_w, max_h) {
                var width = actual_w;
                var height = actual_h;
                var MAX_WIDTH = max_w;
                var MAX_HEIGHT = max_h;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                $scope.img.width = width;
                $scope.img.height = height;
            },

                $scope.submit = function () {
                    userService.saveAvatar($scope.dataurl, 50, 50, function (avatar) {
                        $scope.loadCanvas(avatar.get("avatarUrl"), 'canvas2', avatar.get("avatarWidth"), avatar.get("avatarHeight"));
                    });

                }
        },
        link:function (scope, elem, attrs) {
            var myCanvas = elem.find('canvas')[0];
            var fileInput = elem.find('input[type="file"]');
            console.log(fileInput);
            fileInput.bind('change', function (e) {
                var files = e.target.files || e.dataTransfer.files;
                scope.file = files[0];
                console.log("Selected file: " + scope.file)
                var url = window.URL || window.webkitURL;
                var src = url.createObjectURL(scope.file);
                scope.img = new Image();
                scope.img.src = src;
                scope.img.onload = function () {
                    var sizes = scope.setImgSize(scope.img.width, scope.img.height, attrs.attr1, attrs.attr2);
                    //var w=sizes[0];
                    //var h=sizes[1];
                    //set canvas size to be 50 bigger than the img size
                    myCanvas.width = myCanvas.width;
                    myCanvas.width = scope.img.width;
                    myCanvas.height = scope.img.height;
                    // myCanvas.getContext('2d').setTransform (1, -0.2, 0, 1, 0, 0);
                    myCanvas.getContext('2d').drawImage(scope.img, 0, 0, scope.img.width, scope.img.height);
                    scope.dataurl = myCanvas.toDataURL("image/png");
                };

            });
        }
    };
});

// sweetApp.directive('fileselect', function() {
//     return {
//         restrict: 'A',
//         scope: {
//                 swfile: '='
//         },
//         link: function (scope, element, attrs) {
//
//             element.bind("change", function(e) {
//                 var files = e.target.files || e.dataTransfer.files;
// //                scope.$apply(function(){
//                     console.log(scope);
//                     var file = files[0];
//
//                    var serverUrl = 'https://api.parse.com/1/files/' + file.name;
//                    console.log("Loading avatar picture...");
//                    $.ajax({
//                        type: "POST",
//                        beforeSend: function(request) {
//                            request.setRequestHeader("X-Parse-Application-Id", 'h2w6h5BLXG3rak7sQ2eyEiTKRgu3UPzQcjRzIFCu');
//                            request.setRequestHeader("X-Parse-REST-API-Key", 'EexsGuVhcxUeMaJc41jOoTe620y8GS1m5KUj2ANG');
//                            request.setRequestHeader("Content-Type", file.type);
//                        },
//                        url: serverUrl,
//                        data: file,
//                        processData: false,
//                        contentType: false,
//                        success: function(data) {
//                             console.log("Loaded avatar picture...");
//                             scope.$apply(function(){
//                                scope.swfile = data.url;
//                                console.log("File available at: " + scope.swfile);
// //                                element.visibility = false;
// //                                scope.showFileSelect = false;
//                                scope.setSweetExpression('picture');
//                            });
//
//                        },
//                        error: function(data) {
//                            var obj = jQuery.parseJSON(data);
//                            console.log(obj.error);
//                        }
//                    });
//                });
//
//             });
//         },
//         template:"<input type='file' name='gesturePictureSelect' id='gesturePictureSelect'/>"
//     };
//
// });

sweetApp.directive('sweetfileselect', function ($rootScope, userService) {
    return {
        restrict:'E',
        scope:{
            swfile:'=',
            userid:'=',
            showprogress:'=',
            setuseravatar:'&'
        },
        link:function (scope, element, attrs) {

            element.bind("change", function (e) {
                var files = e.target.files || e.dataTransfer.files;
//                scope.$apply(function(){
                console.log(attrs.attr1);
                console.log(scope.userid);
                var file = files[0];

                var serverUrl = 'https://api.parse.com/1/files/' + file.name;
                console.log("---sweetfileselect --- " + serverUrl);
                scope.$apply(function () {
                    scope.showprogress = 'true';
                });
                $.ajax({
                    type:"POST",
                    beforeSend:function (request) {
                        request.setRequestHeader("X-Parse-Application-Id", 'h2w6h5BLXG3rak7sQ2eyEiTKRgu3UPzQcjRzIFCu');
                        request.setRequestHeader("X-Parse-REST-API-Key", 'EexsGuVhcxUeMaJc41jOoTe620y8GS1m5KUj2ANG');
                        request.setRequestHeader("Content-Type", file.type);
                    },
                    url:serverUrl,
                    data:file,
                    processData:false,
                    contentType:false,
                    success:function (data) {
                        scope.$apply(function () {

                            scope.swfile = data.url;
                            console.log("File available at: " + scope.swfile);
                            var query = new Parse.Query("UserChannel");
                            query.equalTo("userId", scope.userid);
                            console.log("---sweetfleseelect---- userId" + scope.userid);
                            query.first({
                                success:function (rUserChannel) {
                                    console.log("---sweetfileselect--- " + rUserChannel.id);
                                    rUserChannel.set("avatarURL", data.url);
                                    rUserChannel.save(null, {
                                        success:function (sUserChannel) {
                                            console.log("Saved " + sUserChannel);
                                            scope.$apply(function () {
                                                console.log("--About to setUserAvatar--- " + sUserChannel.get("avatarURL"));
                                                userService.setUserChannel(sUserChannel);
                                                $rootScope.$broadcast("load_user_channel")

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
                    error:function (data) {
                        var obj = jQuery.parseJSON(data);
                        console.log(obj.error);
                    }
                });
            });

//            });
        },
//        template:"<input type='file' name='gesturePictureSelect' id='gesturePictureSelect'/>"

        template:"<div class='fileupload fileupload-new' data-provides='fileupload'>"
            // +"<div class='fileupload-new thumbnail' style='width: 50px; height: 50px;'><img src='http://www.placehold.it/50x50/EFEFEF/AAAAAA' /></div>"
            + "<div class='fileupload-preview fileupload-exists thumbnail' style='width: 50px; height: 50px;'></div>"
            + "<span class='btn btn-file btn-primary'><span class='fileupload-new'>Select profile picture</span><span class='fileupload-exists'>Change</span><input type='file' /></span>"
            + "<a href='#' class='btn fileupload-exists' data-dismiss='fileupload'>Remove</a>"
            + "<span ng-show='showprogress'>"
            + "<br/><br/>"
            + "Uploading..."
            // +"<div class='progress progress-striped active'>"
            // +"    <div class='bar' style='width: 40%;'></div>"
            // +"  </div>"
            // +"</div>"
            + "</span>"

            + "</div>",

        controller:function ($scope, $rootScope, userService) {
            $scope.$on("load_user_channel", function (rUserChannel) {
                console.log("---loadUserAvatar called--- " + userService.getUserChannel().get("avatarURL"));
                // $scope.test = rUserChannel;
                $rootScope.userChannel.set("avatarURL", userService.getUserChannel().get("avatarURL"));
                $rootScope.userAvatar = $rootScope.userChannel.get("avatarURL");
                $rootScope.loadUserChannel();
                $scope.showprogress = 'false';

            });

        }
    };

});


// sweetApp.directive('popover2', function() {
//     return function(scope, element, attrs) {
//         element.popover({
//             title: 'hello',
//             content: "<p style='color: green;' ng:click='changeme()'>Hi2</p>",
//             trigger: 'hover'
//         });
//     };
// });
//sweetApp.directive('typeahead', function() {
//        return {
//            restrict: 'A',
//            scope: {
//                typeaheadModel: '=',
//                source: '&'
//            },
//            link: function(scope, element, attrs) {
//                console.log(scope.source);
//                $(element).typeahead({
//                    source: scope.source,
//                    updater: function(item) {
//                        scope.$apply(read(item));
//                        return item;
//                    }
//                });
//
//                function read(value) {
//                    scope.typeaheadModel = value;
//
//                }
//            }
//        };
//
//});

//sweetApp.directive('importcontacts', function () {
//    return {
//        restrict : 'E',
//        replace : true,
//        scope: {
//          provider: '='
//        },
//        template :
//            '<div ng-model="contacts">' +
//                '<button  class="btn btn-primary span12" class="cs_import" '
//                + 'ng-click="importContact()">'
////                + 'Import from main email providers' +
//                // + '<img src="img/social/{{provider}}.png"/>'
//                + '<img src="img/social/gmail.png"/>'
//                + '<img src="img/social/yahoo.png"/>'
//                + '<img src="img/social/windowslive.png"/>'
//                + '</button>' +
//            '</div>',
//
//        controller : function ($scope,userService,contactService,$location) {
//          // alert($scope.provider);
//            $scope.csPageOptions = {
////                domain_key : "DDW2ADYTJR5LDDY8D8WG",
//                domain_key: "2QQ3XHY2R58CFHQV7JH5",
//                sources: ['yahoo', 'gmail', 'windowslive'],
//                // mobile_render: true,
//                initiallySelectedContacts: true,
//                displaySelectAllNone: false,
//                skipSourceMenu: true,
//                // skipSourceMenu:true,
//                textarea_id : 'contact_list',
//                afterSubmitContacts : function (array_of_contacts,source) {
//                    contactService.importEmail(userService.currentUser().id,array_of_contacts,source,function(response){
//                            if(response){
//                                console.log(response);
//                                $rootScope.showInfobarMessage(CONSTANTS.CONTACTS.MESSAGE.IMPORTED,CONSTANTS.SHOW_MESSAGE_TIME);
//                                // $scope.$apply($location.path("#/sweet/new"));
//
//                            }
//                        }
//                    );
//                }
//            };
//
//            $scope.importContact = function () {
//                cloudsponge.init($scope.csPageOptions);
//                // alert($scope.provider);
//                cloudsponge.launch();
//            };
//        },
//        link : function (scope, elem, attrs) {
//          scope.provider = attrs.provider;
//          // alert(attrs.provider) ;
//        }
//    };
//});

sweetApp.directive('typeahead', function (contactService) {
    return {
        restrict:'A',
        scope:{
            typeaheadModel:'=',
            source:'&',
            emails:'=' //set email through service
            //contactObject:"=",
        },

        link:function (scope, element, attrs) {
            //scope.email="not available";
            console.log(scope.source);
            $(element).typeahead({
                source:scope.source,
                highlighter:function (values) {
                    var email = scope.emails[values];
                    scope.$apply(function () {
                        scope.selectedEmail = email;
                    });

                    return('<div>' + "<img src=\"img/avatar.png\" style='width: 30px; height: 30px;'>" + values + '</br>' + email + '</div>' );
                },
                updater:function (item) {
                    scope.$apply(read(item));
                    return item;
                }
            });

            function read(value) {
                scope.typeaheadModel = scope.emails[value];

            }
        }
    };

});
