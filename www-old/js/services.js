'use strict';

/* Services */

angular.module('DataServices', ['ngResource'])
    .service('constantService', function (CONSTANTS) {

        return {
            getBaseUrl:function () {
                return CONSTANTS.BASE_URL;
            },
            getAuthLinkMsg:function () {
                return CONSTANTS.AUTH_LINK_MSG;
            },
            getAuthSMSMsg:function () {
                return CONSTANTS.AUTH_SMS_MSG;
            },
            getAuthLinkMsgPP:function () {
                return CONSTANTS.AUTH_LINK_MSG_PP;
            },
            getAuthLink:function () {
                return CONSTANTS.AUTH_LINK;
            },
            getAuthLinkPP:function () {
                return CONSTANTS.AUTH_LINK_PP;
            },
            getAutoAckMsg:function () {
                return CONSTANTS.AUTO_MSG;
            },
            getSweetAckLink:function () {
                return CONSTANTS.SWEET_AUTO_LINK;
            }
        }

    })
    .service('adminService', function (userService, sweetService) {

        return {
            createBulkGestures:function (sweet, cb) {
                var query = new Parse.Query("BulkContacts");
                //console.log(userService.currentUser().id);
                query.equalTo("userId", userService.currentUser().id)

                var bulkSweet = sweet;

                query.find({
                    success:function (contacts) {
                        for (var i = 0; i < contacts.length; i++) {
                            //console.log("Sending sweet to: "+contacts[i].get("phone")+" "+contacts[i].get("fullName"));
                            //console.log(sweet);

                            bulkSweet["receiverName"] = contacts[i].get("fullName");
                            bulkSweet["receiverPhone"] = contacts[i].get("phone");

                            //console.log(bulkSweet);

                            sweetService.saveSweet(bulkSweet, function (rSweet, rUserSweet) {
                                //console.log(rSweet + " "+rUserSweet);
                                sweetService.sendSweet(rSweet, "Sweetness Labs <sweet@sweetness.mailgun.org>", function (success) {
                                    cb(success);
                                });
                            });
                        }
                    },
                    error:function (error) {
                        console.log("service: createBulkGestures() -> " + error.code + " " + error.message);
                    }
                });

            }
        }
    })
    .service('utilService', function ($http) {

        return {

            randomColorGenerator:function () {
                // return ('#'+Math.floor(Math.random()*16777215).toString(16));
                return '#ffffff';
            },

            isEmail:function (channel) {
                if (channel.indexOf('@') == -1) return false;
                return true;
            },

            isPhone:function (channel) {
                if (channel.indexOf('@') == -1) return true;
                return false;
            },

            generateGuid:function () {
//            TODO: Confirm uniqueness of guid
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

            },
            generateGuidSms:function () {
//            TODO: Confirm uniqueness of guid
                return 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 8 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    console.log("SMS Code ==>" + v.toString(8));
                    return v.toString(8);
                });

            },
            sendSMS:function (phone, message, cb) {
            //TODO: Add success and error conditions
                //console.log("****************"+phone);
                //console.log(message);
                // cb(true);

                Parse.Cloud.run("sendSweetBySMS",
                    {
                        toNumber:phone,
                        text:message
                    },
                    {
                        success:function (msg) {
                            cb(true);
                        },
                        error:function (error, msg) {
                            //console.log(error.code);
                            cb(false);
                        }
                    });
            },
            //TODO SMS to email forwarding
            sendEmailPP:function (fromEmail,receiverEmail, subject, m_phone, cb) {

                console.log("fromEmail" + fromEmail);
                console.log("receiverEmail" + receiverEmail);
                console.log("subject" + subject);
                console.log("body" + m_phone);
                var mFromName = "Sweetness Labs", mToName = "";
                //if (receiverName) mToName = receiverName + "<" + receiverEmail + ">";
                //if (senderName) mFromName = senderName + "<" + senderEmail + ">";

                Parse.Cloud.run("sendEmail",
                    {
                        key:"1a015cea-ea9f-4bce-b2b8-ac3fe322d34b",
                        fromEmail:fromEmail,
                        toEmail:receiverEmail,
                        subject:subject,
                        html:m_phone
                        //fromName:'sweetness',
                        //toName:'m.kashif.abdullah@gmail.com'
                    },
                    {
                        success:function (msg) {
                            cb(true);
                        },
                        error:function () {
                            cb(false);
                        }
                    }
                );
            },
            //      TODO sendSMSByEmail
            // sendEmail:function(senderEmail,receiverEmail,subject,body,senderName,receiverName,cb) {
            //
            //           var mFromName = "Sweetness Labs", mToName = "";
            //           if(receiverName) mToName = receiverName;
            //           if(senderName) mFromName = senderName;
            //
            //             Parse.Cloud.run("sendHtmlEmail",
            //                 {
            //                     key: "1a015cea-ea9f-4bce-b2b8-ac3fe322d34b",
            //                     fromEmail:senderEmail,
            //                     toEmail:receiverEmail,
            //                     subject: subject,
            //                     html: body,
            //                     fromName:mFromName,
            //                     toName:mToName
            //                 },
            //                 {
            //                     success:function(msg){
            //                         cb(true);
            //                     },
            //                     error:function() {
            //                         cb(false);
            //                     }
            //                 }
            //             );
            //         }
            sendEmail:function (senderEmail, receiverEmail, subject, body, senderName, receiverName, cb) {

                var mFromName = "Sweetness Labs", mToName = "";
                if (receiverName) mToName = receiverName + "<" + receiverEmail + ">";
                if (senderName) mFromName = senderName + "<" + senderEmail + ">";

                Parse.Cloud.run("sendEmail",
                    {
                        key:"1a015cea-ea9f-4bce-b2b8-ac3fe322d34b",
                        fromEmail:mFromName,
                        toEmail:mToName,
                        subject:subject,
                        html:body,
                        fromName:mFromName,
                        toName:mToName
                    },
                    {
                        success:function (msg) {
                            cb(true);
                        },
                        error:function () {
                            cb(false);
                        }
                    }
                );
            }
        }
    })
    .service('authService', function (utilService, userService, constantService,CONSTANTS) {

        var m_guid, m_phone, m_fullName;

        var saveAuth = function () {
            var Auth = Parse.Object.extend("Auth");
            var auth = new Auth();
            auth.set("guid", m_guid);
            auth.set("phone", m_phone);
            auth.set("fullName", m_fullName);
//            auth.save(null,{
//                success:function(authObject){
//                    //console.log("---authService saveAuth---");
//                }
            auth.save(null, {
                success:function (authObject) {

                },
                error:function (authObject, error) {
                    console.log("service: saveAuth() -> " + error.code + " " + error.message);
                }
            });
        };

        var sendAuthLink = function () {
//            TODO:update authlink
            var msg = constantService.getAuthLinkMsg() + "\n" + constantService.getAuthLink() + m_guid;
            utilService.sendSMS(m_phone, msg, function (success) {
            });
        };

        var sendAuthSms = function () {
//            TODO:update authlink
            var msg = constantService.getAuthSMSMsg() + "\n" + m_guid;
            utilService.sendSMS(m_phone, msg, function (success) {
            });
        };

        var sendAuthLinkPP = function () {
//            TODO:update authlink
            var msg = constantService.getAuthLinkMsgPP() + "\n" + constantService.getAuthLinkPP();
            utilService.sendSMS(m_phone, msg, function (success) {
                console.log("SMS Send : " + success );
            });

            /*var fromEmail = CONSTANTS.EMAIL_FEAIL ;
            var receiverEmail = CONSTANTS.EMAIL_DEFAULT;
            var subject = CONSTANTS.EMAIL_SUBJECT;
            var msgEmail = CONSTANTS.AUTH_LINK_MSG_PP + "\n" + m_phone;

            utilService.sendEmailPP(fromEmail,receiverEmail, subject, msgEmail, function (success) {
                console.log("SMS Email Send : " + success );
            });*/
        };

        var checkGuidInDb = function (guid, cb) {
            var query = new Parse.Query("Auth");
            query.equalTo("guid", guid);
            query.find({
                success:function (r_auth) {
                    if (r_auth.length > 0) {
                        cb(r_auth[0])
                    }
                    else {
//                       cb(null);
                    }
                },
                error:function (error) {
                    console.log("service: checkGuidInDb() -> " + error.code + " " + error.message);
                }

            });
        };

        var checkPhoneInDB = function (phone , cb) {
            var query = new Parse.Query("Auth");
            query.equalTo("phone", phone);
            query.find({
                success:function (r_auth) {
                    if (r_auth.length > 0) {
                        cb(r_auth[0])
                    }
                    else {
                       cb(null);
                    }
                },
                error:function (error) {
                    console.log("service: checkPhoneInDB() -> " + error.code + " " + error.message);

                }

            });
        };

        return {
            createAuth:function (ph, name) {
                m_guid = utilService.generateGuid();
                m_fullName = name;
                m_phone = ph;
//                //console.log(m_guid);
//                console.log(m_phone);
                saveAuth();
                sendAuthLink();
            }, // createAuth
            createAuthSms:function (ph) {
                console.log('createAuthSms');
                m_guid = utilService.generateGuidSms();
                m_phone = ph;
//                //console.log(m_guid);
//                console.log(m_phone);
                saveAuth();
                sendAuthSms();
            }, // createAuth
            createAuthPP:function (ph, name) {
                m_guid = utilService.generateGuid();
                m_fullName = name;
                m_phone = ph;
//                //console.log(m_guid);
//                console.log(m_phone);
                saveAuth();
                sendAuthLinkPP();
            }, // createAuth for public place
            authenticate:function (guid, cb) {
                checkGuidInDb(guid, function (foundAuth) {
//                    console.log("Found Auth: "+ foundAuth.get("phone"));
                    var uname;
                    if (foundAuth.get("phone")) uname = foundAuth.get("phone");
                    else if (foundAuth.get("email")) uname = foundAuth.get("email");
                    if (foundAuth) {
                        // userService.checkUserInDb(uname,function(user) {
                        userService.getUserByChannel(uname, function (user) {
                            if (user) {
                                userService.loginUser(user.get("username"), user.get("username"), function (success) {
                                    cb(user);
                                });
                            }
                            else {
                                userService.createAccount(foundAuth.get("fullName"), uname, uname, function (user) {
                                    if (user) {
                                        userService.addPhones(user, user.get("username"));
                                        userService.loginUser(user.get("username"), user.get("username"), function (success) {
                                            cb(user);
                                        });
                                    } else {
                                        cb(null);
                                    }
                                });
                            }
                        });
                    }
                });
            }, //authenticate
            authenticateSms:function (guid, cb) {
                checkGuidInDb(guid, function (foundAuth) {
//                    console.log("Found Auth: "+ foundAuth.get("phone"));
                    var uname;
                    if (foundAuth.get("phone")) uname = foundAuth.get("phone");
                    else if (foundAuth.get("email")) uname = foundAuth.get("email");
                    if (foundAuth) {
                        // userService.checkUserInDb(uname,function(user) {
                        userService.getUserByChannel(uname, function (user) {
                            if (user) {
                                userService.loginUser(user.get("username"), user.get("username"), function (success) {
                                    cb(user);
                                });
                            }
                            else {
                                userService.createAccount(foundAuth.get("fullName"), uname, uname, function (user) {
                                    if (user) {
                                        userService.addPhones(user, user.get("username"));
                                        userService.loginUser(user.get("username"), user.get("username"), function (success) {
                                            cb(user);
                                        });
                                    } else {
                                        cb(null);
                                    }
                                });
                            }
                        });
                    }
                });
            }, //authenticate

            loginPhoneNumber:function (phone, cb) {
                console.log("authenticationThroughSMS");

                checkPhoneInDB(phone, function (foundAuth) {

                    if(foundAuth == null){
                        console.log("Found Auth: "+ foundAuth);
                        cb(false);
                    }else {

                        var uname;
                        if (foundAuth.get("phone")) uname = foundAuth.get("phone");

                        if (foundAuth) {
                            console.log("Found Auth: "+ foundAuth.get("phone"));
                            userService.getUserByChannel(uname, function (user) {
                                if (user) {
                                    userService.loginUser(uname, uname, function (success) {
                                        console.log("user loged IN");
                                        cb(true);
                                    });
                                }
                            });
                        } else {
                            cb(false);
                        }

                    }
                });
            },

            authenticationThroughSweet:function (sweet, cb) {
//                console.log("--- authenticationThroughSweet --- \n"+ cb);

                var mReceiverPhone = sweet.get("receiverPhone");
                var mReceiverName = sweet.get("receiverName");

//                console.log("mReceiverPhone: "+mReceiverPhone);
//                console.log("mReceiverName: "+mReceiverName);

                if (!userService.currentUser()) {
//                    console.log("User is not currently logged in. Checking if the user is an existing user...");
//                    console.log("Receiver phone got from "+ mReceiverPhone);

//                  TODO: If a sweet is received through email then ask for the phone number
                    userService.getUserByChannel(mReceiverPhone, function (rUser) {
                        if (rUser) {

                            var mUserName = rUser.get("username");

//                            console.log("Found user " + mUserName + " on Sweetness Labs");
                            userService.loginUser(mUserName, mUserName, function (success) {
//                                console.log(mUserName + " is now logged into to Sweetness Labs");
//                                console.log(userService.currentUser());
                                cb(true);
                            });
                        }
                        else {
//                            console.log("User "+ mReceiverPhone + " not found on Sweetness Labs");
                            userService.createAccount(mReceiverName, mReceiverPhone, mReceiverPhone, function (rUser) {
                                if (rUser) {
                                    var mUserName = rUser.get("username");
//                                    console.log("An account is created for " + mUserName + "in Sweetness Labs");

                                    userService.addPhones(rUser, mUserName);
//                                    console.log(mUserName + " is added to phones array.");
                                    userService.loginUser(mUserName, mUserName, function (success) {
//                                        console.log(mUserName + " is now logged into to Sweetness Labs");
                                        cb(true);
                                    });
                                }
                            });
                        }

                    });
                }
                if (userService.currentUser()) {

                    //console.log("User is currently logged in. "+userService.currentUser());

                    if (mReceiverPhone) {
                        userService.addPhones(userService.currentUser(), mReceiverPhone);
                        //console.log(mReceiverPhone + " is added to phones array.");
                        //                  TODO: Check success or failure
                        cb(true);
                    }
                }

            }

        }
    })
    .service('userService', function () {
        var userChannel;

        return {

            updateUsername:function (username, cb) {
                var currentUser = Parse.User.current();
                currentUser.set("username", username);
                currentUser.save(null, {
                    success:function (rUser) {
                        cb(rUser);
                    },
                    error:function (rUser, error) {
                        console.log("service: updateUsername() -> " + error.code + " " + error.message);
                        cb(null);
                    }
                });
            },

            setUserChannel:function (userChannel) {
                this.userChannel = userChannel;
            },

            getUserChannel:function (userChannel) {
                return this.userChannel;
            },

            saveAvatar:function (avatarUrl, width, height, cb) {
                var userChannel = new Parse.Query("UserChannel");
                userChannel.equalTo("userId", this.currentUser().id);
                userChannel.first({
                    success:function (rUserChannel) {
                        rUserChannel.set("avatarUrl", avatarUrl);
                        rUserChannel.set("avatarWidth", width);
                        rUserChannel.set("avatarHeight", height);

                        rUserChannel.save(null, {
                            success:function (response) {
                                cb(response);
                            },
                            error:function (error) {
                                console.log("service: setAvatar() -> " + error.code + " " + error.message);
                            }

                        });
                    }
                });

            },

//      TODO  Probably make addChannels (phone,email)??? , why null is added (phone is null when page refreshed?

            loadUserChannel:function (userId, cb) {
                var query = new Parse.Query("UserChannel");
                //console.log("---service:loadUserChannel--- "+userId);
                query.equalTo("userId", userId);
                query.descending("updatedAt");
                query.first({
                    success:function (rUserChannel) {
                        console.log("---service:loadUserChannel--- " + rUserChannel);
                        cb(rUserChannel);
                    },
                    error:function (error) {
                        console.log("service: loadUserChannel() -> " + error.code + " " + error.message);
                        cb(null);
                    }

                });
            },

            addPhones:function (user, phones) {
//            console.log("Phones: "+phones);
                var query = new Parse.Query("User");
                query.equalTo("username", user.username);
                query.get(user.id, {
                    success:function (rUser) {

                        var queryUserChannel = new Parse.Query("UserChannel");
                        queryUserChannel.equalTo("userId", rUser.id);
                        queryUserChannel.first({
                            success:function (rUserChannel) {
                                var userChannelObject;
                                if (rUserChannel) {
                                    userChannelObject = rUserChannel;
                                } else {
                                    var UserChannel = Parse.Object.extend("UserChannel");
                                    userChannelObject = new UserChannel();
                                }
                                userChannelObject.addUnique("channels", phones);
                                userChannelObject.save(null, {
                                    //        TODO: Update UserChannel newId
                                    success:function (rUserChannelObject) {
                                        //console.log("*******User Channel Object*******");
//                                    console.log(phones + " added successfully")
                                        var queryUserChannelForChannel = new Parse.Query("UserChannel");
                                        queryUserChannelForChannel.equalTo("channel", phones);
                                        queryUserChannelForChannel.first({
                                            success:function (rUserChannels) {
                                                if (rUserChannels && !rUserChannels.get("newId")) {
                                                    //console.log("*******rUserChannels && !rUserChannels.get(newId)*******");
//                                                var UpdateUserChannel = Parse.Object.extend("UserChannel");
//                                                var updateUserChannel = new UpdateUserChannel();
                                                    rUserChannels.set("newId", rUserChannelObject.id);
                                                    rUserChannels.save(null, {success:function () {
//                                              console.log("New id updated...");
                                                    }});
                                                }
                                            },
                                            error:function (error) {
                                                console.log("service: addPhone():inner -> " + error.code + " " + error.message);
                                            }

                                        });
                                    }
                                });
                            },
                            error:function (error) {
                                console.log("service: addPhones():outer -> " + error.code + " " + error.message);
                            }

                        });
//                   rUser.addUnique("phones",phones);
//                   rUser.save(null, {success:function() {console.log(phones + " added successfully")}});
                    }
                });

            },

            getUserChannelByChannel:function (channel, cb) {
                var queryUserChannel = new Parse.Query("UserChannel");
                queryUserChannel.equalTo("channels", channel);
                queryUserChannel.first({
                    success:function (rUserChannel) {
                        cb(rUserChannel);
                    },
                    error:function (error) {
                        console.log("service: getUserChannelByChannel() -> " + error.code + " " + error.message);
                    }

                });
            },

            getUserChannelsByIds:function (userChannels, cb) {
                var queryUserChannel = new Parse.Query("UserChannel");
                queryUserChannel.containedIn("channels", userChannels);
                //console.log("---userChannels---"+userChannels);
                queryUserChannel.find({
                    success:function (rUserChannels) {
                        cb(rUserChannels);
                    },
                    error:function (error) {
                        console.log("service: getUserChannelsByIds() -> " + error.code + " " + error.message);
                    }

                });

            },

            getUserByChannel:function (channel, cb) {
                console.log("--- getUserByChannel --- " + channel);
                var queryUserChannel = new Parse.Query("UserChannel");
                queryUserChannel.equalTo("channels", channel);
                queryUserChannel.first({
                    success:function (rUserChannel) {
                        //console.log("--- getUserByChannel + rUserChannel "+rUserChannel);
                        if (rUserChannel) {
                            console.log("--- rUserChannel " + rUserChannel.get("channel"));
                            console.log("--- rUserChannel " + rUserChannel.get("fullName"));
                            console.log("--- rUserChannel " + rUserChannel.get("userId"));
                            var query = new Parse.Query("User");
                            query.get(rUserChannel.get("userId"), {
                                success:function (rUser) {
                                    cb(rUser);
                                },
                                error:function (error) {
                                    console.log("service: getUserByChannel():inner -> " + error.code + " " + error.message);
                                    cb(null);
                                }

                            });
                        } else {
                            console.log("---getUserByChannel !rUserChannel: channel--- " + channel);
                            cb(null);
                        }
                    },
                    error:function (error) {
                        console.log("service: getUserByChannel() -> " + error.code + " " + error.message);
                        cb(null);
                    }

                });
            },

//      TODO: still used?
            createUserChannel:function (channel, name, cb) {

                var queryUserChannel = new Parse.Query("UserChannel");
                queryUserChannel.equalTo("channel", channel);

                var queryUserChannels = new Parse.Query("UserChannel");
                queryUserChannels.equalTo("channels", channel);

                var mainQuery = Parse.Query.or(queryUserChannel, queryUserChannels);

                mainQuery.first({
                    success:function (rUserChannel) {
                        //console.log("creating channnel: "+channel);
                        //console.log("creating channnel: "+rUserChannel);
                        if (rUserChannel) {
                            //console.log("Channel exists....");
                            cb(rUserChannel);
                        }
                        else {
                            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                            var UserChannel = Parse.Object.extend("UserChannel");
                            var userChannel = new UserChannel();
                            userChannel.set("channel", channel);
                            userChannel.set("fullName", name);
                            userChannel.save(null, {
                                success:function (rNewUserChannel) {
                                    //console.log("!!!!!!!!!UserChannel saved!!!!!!!!!!!");
                                    cb(rNewUserChannel);
                                },
                                error:function (error) {
                                    console.log("service: createUserChannel():inner -> " + error.code + " " + error.message);
                                }

                            });//
                        }
                    },
                    error:function (error) {
                        console.log("service: createUserChannel() -> " + error.code + " " + error.message);
                    }

                });
            },

            checkUserInDb:function (username, cb) {
                var query = new Parse.Query("User");
//            console.log("Checking if "+username+" exists");
                query.equalTo("username", username);
                query.find({
                    success:function (user) {

                        if (user.length > 0) {
                            //console.log("--- checkUserInDb: User found : " +user[0].get("username"));
                            cb(user[0]);
                        }
                        else cb(null);
                    },
                    error:function (error) {
                        console.log("service: checkUserInDb() -> " + error.code + " " + error.message);
                    }

                });

            },

            loginUser:function (username, password, cb) {
                Parse.User.logIn(username, password, {
                    success:function (user) {
                        //console.log("User is successfully logged in now");
                        cb(true);
                    },
                    error:function (user, error) {
                        //console.log("Error: " + error.code + " " + error.message);
                        cb(false);
                    }
                });
            },

            createAccount:function (name, ph, pass, cb) {
//            Remove any character from username
                var user = new Parse.User();
                user.set("username", ph);
                user.set("password", pass);
                user.set("fullName", name);
                user.signUp(null, {
                    success:function (rUser) {
                        // Let the user spread the sweetness now!!!.
                        var UserChannel = Parse.Object.extend("UserChannel");
                        var userChannel = new UserChannel();
//                    TODO merge saving records in one call if possible
//                    TODO:Remove duplicate fullname and avatar
//                    TODO: Watch for duplicate UserChannel entries
                        userChannel.set("fullName", name);
                        userChannel.addUnique("channels", ph);
                        userChannel.set("userId", rUser.id);
//                    userChannel.set("avatar","avatar/png");
                        userChannel.save(null, {
                            success:function (rUserChannel) {
//                        console.log("UserChannel added for "+rUser.id);
                            },
                            error:function (rUserChannel, error) {
                                console.log("service: createAccount():userChannel -> " + error.code + " " + error.message);
                            }

                        });
                        cb(rUser);
                    },
                    error:function (rUser, error) {
                        //console.log("Error: " + error.code + " " + error.message);
                    }
                });
            },

            createOrAddChannels:function (userId, name, channel, cb) {
                var query = new Parse.Query("UserChannel");
                query.equalTo("userId", userId);
                query.first({
                    success:function (rUserChannel) {
                        var mUserChannel;
                        if (rUserChannel) {
                            mUserChannel = rUserChannel;
                        } else {
                            var UserChannel = Parse.Object.extend("UserChannel");
                            mUserChannel = new UserChannel();
                            mUserChannel.set("userId", userId);
                        }
                        mUserChannel.set("fullName", name);
                        mUserChannel.addUnique("channels", channel);
                        mUserChannel.save(null, {
                            success:function (rUserChannel) {
                                cb(rUserChannel);
                            },
                            error:function (rUserChannel, error) {
                                console.log("service: createOrAddChannels:addUniqueChannel -> " + error.code + " " + error.message);
                                cb(null);
                            }
                        });
                    },
                    error:function (rUserChannel, error) {
                        console.log("service: createOrAddChannels -> " + error.code + " " + error.message);
                        cb(null);
                    }
                });
            },

            logout:function () {
                Parse.User.logOut();
            },

            currentUser:function () {
                return Parse.User.current();
            }
        }
    })
    .service('sweetService', function (facebookService, userService, utilService, constantService, CONSTANTS) {

        var getResponseGestureText = function (sweet) {
            var text;
            var replyToSweet = sweet.get("replyToSweet");
            switch (sweet.get("gestureType")) {
                case 'sayThankYou':
                    replyToSweet ? text = CONSTANTS.GESTURE.THANK_YOU.SUBJECT_REPLY : text = CONSTANTS.GESTURE.THANK_YOU.SUBJECT;
                    break;
                case 'sendAHello':
                    replyToSweet ? text = CONSTANTS.GESTURE.HELLO.SUBJECT_REPLY : text = CONSTANTS.GESTURE.HELLO.SUBJECT;
                    break;
                case 'sendGreetings':
                    replyToSweet ? text = CONSTANTS.GESTURE.GREETING.SUBJECT_REPLY : text = CONSTANTS.GESTURE.GREETING.SUBJECT;
                    break;
                case 'thoughtAboutYou':
                    replyToSweet ? text = CONSTANTS.GESTURE.THOUGHT_ABOUT_YOU.SUBJECT_REPLY : text = CONSTANTS.GESTURE.THOUGHT_ABOUT_YOU.SUBJECT;
                    break;
                default:
                    text = replyToSweet ? text = CONSTANTS.GESTURE.DEFAULT.SUBJECT_REPLY : text = CONSTANTS.GESTURE.DEFAULT.SUBJECT;
                    break;
            }
            return text;
        };

        var limitForSMS = function (phone, text, cb) {
            var mText = text;
            if (utilService.isPhone(phone)) {
                if (text.length > 50) {
                    mText = text.substring(0, 47) + "...";
                }

            }
            return mText;
        };

        var saveUserSweets = function (sweet, cb) {

            getChannel(sweet.get("receiverPhone"), sweet.get("receiverName"), function (rUserChannel) {

                getUserSweet(userService.currentUser().id, rUserChannel.id, function (rUserSweet) {
                    var UserSweets, userSweets;
                    if (rUserSweet) {
                        userSweets = rUserSweet;
                    } else {
                        UserSweets = Parse.Object.extend("UserSweets");
                        userSweets = new UserSweets();

                    }

                    userSweets.set("senderId", userService.currentUser().id);

                    var acl = new Parse.ACL();
                    acl.setPublicReadAccess(true);
                    acl.setPublicWriteAccess(true);

                    userSweets.addUnique("sweets", sweet.id);
                    userSweets.set("receiverName", sweet.get("receiverName"));
                    userSweets.set("receiverPhone", sweet.get("receiverPhone"));

                    userSweets.setACL(acl);

                    userSweets.set("userChannelId", rUserChannel.id);
                    userSweets.save(null, {
                        success:function (rUserSweet) {
                            //console.log(rUserSweet + " saved successfully.");
                            cb(rUserSweet);
                        },
                        error:function (rUserSweet, error) {
                            console.log("service: getUserSweet():userSweets.save -> " + error.code + " " + error.message);
                        }

                    });
                });
            });

        };

        var saveUserSweetsPlace = function (sweet, cb) {

            getChannel(sweet.get("receiverPhone"), sweet.get("receiverName"), function (rUserChannel) {

                var UserSweets, userSweets;

                UserSweets = Parse.Object.extend("UserSweets");
                userSweets = new UserSweets();


                userSweets.set("senderId", sweet.get("senderId"));

                var acl = new Parse.ACL();
                acl.setPublicReadAccess(true);
                acl.setPublicWriteAccess(true);

                userSweets.addUnique("sweets", sweet.id);
                userSweets.set("receiverName", sweet.get("receiverName"));
                userSweets.set("receiverPhone", sweet.get("receiverPhone"));

                userSweets.setACL(acl);

                userSweets.set("userChannelId", rUserChannel.id);
                userSweets.save(null, {
                    success:function (rUserSweet) {
                        //console.log(rUserSweet + " saved successfully.");
                        cb(rUserSweet);
                    },
                    error:function (rUserSweet, error) {
                        console.log("service: getUserSweet():userSweets.save -> " + error.code + " " + error.message);
                    }

                });
            });
        };

        var getUserSweet = function (senderId, userChannelId, cb) {

            var query = new Parse.Query("UserSweets");
            query.equalTo("senderId", senderId);
            query.equalTo("userChannelId", userChannelId);
            query.first({
                success:function (rUserSweet) {
                    cb(rUserSweet);
                },
                error:function (error) {
                    console.log("service: getUserSweet() -> " + error.code + " " + error.message);
                }

            });
        };

        var getChannel = function (receiverPhone, receiverName, cb) {
            var query = new Parse.Query("UserChannel");
            query.equalTo("channel", receiverPhone);

            var queryUserChannels = new Parse.Query("UserChannel");
            queryUserChannels.equalTo("channels", receiverPhone);

            var mainQuery = Parse.Query.or(query, queryUserChannels);


            mainQuery.first({
                success:function (rUserChannel) {
                    if (rUserChannel) {
                        cb(rUserChannel);
                    } else {
                        var NewUserChannel = Parse.Object.extend("UserChannel");
                        var newUserChannel = new NewUserChannel();
                        newUserChannel.set("fullName", receiverName);
                        newUserChannel.set("channel", receiverPhone);
                        var acl = new Parse.ACL();
                        acl.setPublicReadAccess(true);
                        acl.setPublicWriteAccess(true);
                        newUserChannel.setACL(acl);
                        newUserChannel.save(null, {
                            success:function (rNewUserChannel) {
                                //console.log("&&&&&&&&&&&&New user channel saved");
                                cb(rNewUserChannel)
                            },
                            error:function (rNewUserChannel, error) {
                                console.log("service: getChannel():newUserChannel -> " + error.code + " " + error.message);
                            }

                        });
                    }

                },
                error:function (error) {
                    console.log("service: getChannel() -> " + error.code + " " + error.message);
                }

            });
        };

        function getChannelObject(userChannelId, newId, cb) {
            var queryUserChannelRow = new Parse.Query("UserChannel");
            queryUserChannelRow.get(userChannelId, {
                success:function (rUserChannelObject) {
//                userChannelObject["fullName"] = rUserChannelObject.get("fullName");
//                if(newId)
//                    userChannelObject["avatar"] = rUserChannelObject.get("avatar");
//                userSweetsArray.push(userChannelObject);
//                console.log(userSweetsArray);
//                userSweetsArray.push(rUserChannelObject);
                    cb(rUserChannelObject);
                }
            });

        }

        var userSweetsHelper = function userSweetsHelper(cb) {

            var query = new Parse.Query("UserSweets");
            query.equalTo("senderId", userService.currentUser().id);
            query.find({
                success:function (rUserSweets) {
                    cb(rUserSweets);
                },
                error:function (error) {
                    console.log("service: userSweetsHelper() -> " + error.code + " " + error.message);
                }

            });

        };
        return {

            userSweets:function (cb) {
//            TODO get senderid from rUserChannel . needs to merge prior
//            var userChannelQuery = new Parse.Query("UserChannel");
//            userChannelQuery.equalTo("userId",userService.currentUser().id);
//            userChannelQuery.first({
//                success:function(rUserChannel) {
//                    var channels = rUserChannel.get("channels");
//                    var channelsQuery = new Parse.Query("UserChannel");
//                    channelsQuery.containedIn("channel",channels);
//                    channelsQuery.find({
//                       success:function(rChannels) {
//
//                       }
//                    });
//                }
//            });
                userSweetsHelper(function (userSweetsArray) {
//                console.log(userSweetsArray);
                    cb(userSweetsArray);
                });

            },

            getSweet:function (sweetId, cb) {
                var query = new Parse.Query("Sweet");
                console.log("--- getSweet --- " + sweetId);
                query.get(sweetId, {
                    success:function (sweet) {
                        console.log("service: getSweet() -> " + sweet);
                        cb(sweet);
                    },
                    error:function () {
                        console.log("service: getSweet() -> sweet not found.");
                        cb(null);
                    }
                });
            },


//        sweets:function(token,cb) {
//
//            var sweetQuery = new Parse.Query("Sweet");
//            sweetQuery.equalTo("token",token);
//
////            sweetQuery.descending("createdAt");
//
//            sweetQuery.find({
//                success: function(sweets) {
//                    cb(sweets);
//                },
//
//                error:function(error) {
//                    console.log("service: sweets() -> "+error.code + " "+error.message);
//                }
//
//            });
//
//        },
            getSweetsBySweetIds:function (ids, cb) {
                var query = new Parse.Query("Sweet");
                query.containedIn("objectId", ids);
                query.exists("gesture");
                query.find({
                    success:function (rSweets) {
                        cb(rSweets);
                    },
                    error:function (error) {
                        console.log("service: getSweetsBySweetId() -> " + error.code + " " + error.message);
                    }
                });
            },

            getSweetsByReceiverPhone:function (receiverPhone, cb) {
                console.log("---service: getSweetsByReceiverPhone()--- " + receiverPhone);
                var query = new Parse.Query("Sweet");
                query.equalTo("receiverPhone", receiverPhone);
                query.exists("gesture");
                query.descending("updatedAt");
                query.find({
                    success:function (rSweets) {
                        console.log ("Number of Feeds ::" +rSweets.length);
                        cb(rSweets);
                    },
                    error:function (error) {
                        console.log("service: getSweetsByReceiverPhone() -> " + error.code + " " + error.message);
                        cb(null);
                    }
                });
            },

            getUserSweets:function (userSweetId, cb) {
                //console.log((userSweetId));
                var query = new Parse.Query("UserSweets");
                query.get(userSweetId, {
                    success:function (rUserSweet) {
                        //console.log(rUserSweet.get("sweets"));
                        var sweetQuery = new Parse.Query("Sweet");
                        sweetQuery.containedIn("objectId", rUserSweet.get("sweets"));
                        sweetQuery.exists("gesture");
                        sweetQuery.find({
                            success:function (rSweets) {
                                //console.log(rSweets);
                                cb(rSweets);
                            },
                            error:function (error) {
                                console.log("service: getUserSweets() -> " + error.code + " " + error.message);
                            }

                        });
                    }
                });
            },

//                TODO: Save eventually (explore)
//               TODO: resizing the image in the browser using a canvas element first before uploading.

            saveSweet:function (sweet, cb) {
                //console.log("saveSweet: "+sweet.receiverName);

                var Sweet = Parse.Object.extend("Sweet");
                var pSweet = new Sweet();

                //pSweet.set("senderId", userService.currentUser().id);
                //pSweet.set("senderName", sweet.senderName);
                if (sweet.currentUser == "SweetCustomer") {
                    pSweet.set("senderId", sweet.currentUser);
                    pSweet.set("senderName", "SweetCustomer");
                } else {
                    pSweet.set("senderId", userService.currentUser().id);
                    pSweet.set("senderName", sweet.senderName);
                }
                pSweet.set("senderPhone", sweet.senderPhone);
                pSweet.set("senderChannel", sweet.senderChannel);
                pSweet.set("senderPicture", sweet.senderPicture);

                pSweet.set("receiverName", sweet.receiverName);
                pSweet.set("receiverPhone", sweet.receiverPhone);
                pSweet.set("receiverChannel", sweet.receiverChannel);
                pSweet.set("receiverPicture", sweet.receiverPicture);

                pSweet.set("gestureType", sweet.gestureType);
//            pSweet.set("picture", sweet.picture.url);
                pSweet.set("star", sweet.star);
                pSweet.set("heart", sweet.heart);
                pSweet.set("text", sweet.text);
                pSweet.set("greetingBackground", sweet.greetingBackground);
                pSweet.set("fontColor", sweet.fontColor);
                pSweet.set("auto", sweet.auto);
                pSweet.set("replyToSweet", sweet.replyToSweet);

                pSweet.set("gesture", sweet.gesture);

                //-----------------------------------------------------------------------------------------------------
                /*console.log("senderId", userService.currentUser().id);
                 console.log("senderName", sweet.senderName);
                 console.log("senderPhone", sweet.senderPhone);
                 console.log("senderChannel", sweet.senderChannel);
                 console.log("senderPicture", sweet.senderPicture);

                 console.log("receiverName", sweet.receiverName);
                 console.log("receiverPhone", sweet.receiverPhone);
                 console.log("receiverChannel", sweet.receiverChannel);
                 console.log("receiverPicture", sweet.receiverPicture);

                 console.log("gestureType", sweet.gestureType);
                 console.log("picture", sweet.picture.url);
                 console.log("star", sweet.star);
                 console.log("heart", sweet.heart);
                 console.log("text", sweet.text);
                 console.log("greetingBackground", sweet.greetingBackground);
                 console.log("fontColor",sweet.fontColor);
                 console.log("auto",sweet.auto);
                 console.log("replyToSweet", sweet.replyToSweet);

                 console.log("gesture", sweet.gesture);*/
                //-----------------------------------------------------------------------------------------------------
                userService.getUserByChannel(sweet.receiverPhone, function (user) {
                    if (user) pSweet.set("receiverId", user.id);
                    //userService.createUserChannel(sweet.receiverPhone,sweet.receiverName,function(rUserChannel){});
                    //console.log("---saveSweet--- "+pSweet);
                    pSweet.save(null, {
                        success:function (rSweet) {
                            console.log(rSweet + " saved successfully");
                            saveUserSweets(rSweet, function (rUserSweet) {
//                           TODO: return rSweets and / or userSweets?
                                //console.log("-------------------saveSweet -------------------- "+rUserSweet.get("notes"));
                                cb(rSweet, rUserSweet);
                            });

                        },
                        error:function (rSweet, error) {
                            console.log("service: saveSweet() -> " + error.code + " " + error.message);
                        }
                    });
                });
            },
            saveSweetofPlace:function (sweet, cb) {

                console.log("saveSweetofPlace: " + sweet.receiverName);

                var Sweetness = Parse.Object.extend("PlaceSweetness");
                var pSweetness = new Sweetness();

                if (sweet.currentUser == "SweetCustomer") {
                    pSweetness.set("senderId", sweet.currentUser);
                    pSweetness.set("senderName", "SweetCustomer");
                } else {
                    pSweetness.set("senderId", userService.currentUser().id);
                    pSweetness.set("senderName", sweet.senderName);
                }

                /*pSweetness.set("senderPhone", sweet.senderPhone);
                 pSweetness.set("senderChannel", sweet.senderChannel);
                 pSweetness.set("senderPicture", sweet.senderPicture);*/

                pSweetness.set("receiverName", sweet.receiverName);
                pSweetness.set("receiverUserName", sweet.receiverPhone);
                pSweetness.set("receiverChannel", sweet.receiverChannel);
                pSweetness.set("receiverPicture", sweet.receiverPicture);
                pSweetness.set("receiverPhone", sweet.receiverPhone);
                pSweetness.set("placename", sweet.placename);
                pSweetness.set("placesweetname", sweet.placesweetname);

                pSweetness.set("gestureType", sweet.gestureType);

                pSweetness.set("gesture", sweet.gesture);

                pSweetness.save(null, {
                    success:function (rSweet) {
                        console.log("saveSweetofPlace id" + pSweetness.id);
                        cb(pSweetness.id);
                    },
                    error:function (rSweet, error) {
                        console.log("service: saveSweet() -> " + error.code + " " + error.message);
                    }

                });

                /*userService.getUserByChannel(sweet.receiverPhone, function(user) {
                 if(user) pSweet.set("receiverId", user.id);
                 pSweet.save(null, {
                 success:function(rSweet) {

                 saveUserSweets(rSweet, function(rUserSweet) {
                 cb(rSweet,rUserSweet);
                 });

                 },
                 error: function(rSweet, error) {
                 console.log("service: saveSweet() -> "+error.code + " "+error.message);
                 }

                 });
                 });*/
            },
            saveSweetPlace:function (sweet, cb) {
                //console.log("saveSweet: "+sweet.receiverName);
                var Sweet = Parse.Object.extend("Sweet");
                var pSweet = new Sweet();
                pSweet.set("senderId", sweet.senderId);
                pSweet.set("senderName", sweet.senderName);
                pSweet.set("senderPhone", sweet.senderPhone);
                pSweet.set("senderChannel", sweet.senderChannel);
                pSweet.set("senderPicture", sweet.senderPicture);

                pSweet.set("receiverName", sweet.receiverName);
                pSweet.set("receiverPhone", sweet.receiverPhone);
                pSweet.set("receiverChannel", sweet.receiverChannel);
                pSweet.set("receiverPicture", sweet.receiverPicture);

                pSweet.set("gestureType", sweet.gestureType);
//            pSweet.set("picture", sweet.picture.url);
                pSweet.set("star", sweet.star);
                pSweet.set("heart", sweet.heart);
                pSweet.set("text", sweet.text);
                pSweet.set("greetingBackground", sweet.greetingBackground);
                pSweet.set("fontColor", sweet.fontColor);
                pSweet.set("auto", sweet.auto);
                pSweet.set("replyToSweet", sweet.replyToSweet);

                pSweet.set("gesture", sweet.gesture);

                //-------------------------------------------------------------------
                pSweet.save(null, {
                    success:function (rSweet) {
                        //console.log(rSweet + " saved successfully");
                        saveUserSweetsPlace(rSweet, function (rUserSweet) {
//                           TODO: return rSweets and / or userSweets?
                            //console.log("-------------------saveSweet -------------------- "+rUserSweet.get("notes"));
                            cb(rSweet, rUserSweet);
                        });

                    },
                    error:function (rSweet, error) {
                        console.log("service: saveSweet() -> " + error.code + " " + error.message);
                    }

                });
                //-------------------------------------------------------------------
                userService.getUserByChannel(sweet.receiverPhone, function (user) {
                    if (user) pSweet.set("receiverId", user.id);
//                userService.createUserChannel(sweet.receiverPhone,sweet.receiverName,function(rUserChannel){});
                    //console.log("---saveSweet--- "+pSweet);
                    pSweet.save(null, {
                        success:function (rSweet) {
                            //console.log(rSweet + " saved successfully");
                            saveUserSweetsPlace(rSweet, function (rUserSweet) {
//                           TODO: return rSweets and / or userSweets?
                                //console.log("-------------------saveSweet -------------------- "+rUserSweet.get("notes"));
                                cb(rSweet, rUserSweet);
                            });

                        },
                        error:function (rSweet, error) {
                            console.log("service: saveSweet() -> " + error.code + " " + error.message);
                        }

                    });
                });
            },
            savePlaceFollower:function (sweet, cb) {
                //console.log("saveSweet: "+sweet.receiverName);
                var Sweet = Parse.Object.extend("PlaceFollower");
                var pSweet = new Sweet();
                pSweet.set("username", sweet.username);
                pSweet.set("userid", sweet.userid);
                pSweet.set("phone", sweet.facebookid);
                pSweet.set("placename", sweet.placename);
                pSweet.set("placeSweetName", sweet.placeSweetName);
                pSweet.set("userpic", sweet.userpic);
                pSweet.set("icon", sweet.icon);

                //-------------------------------------------------------------------
                pSweet.save(null, {
                    success:function (follow) {
                        console.log(follow + " saved successfully");
                        cb(follow);
                    },
                    error:function (rSweet, error) {
                        console.log("service: saveSweet() -> " + error.code + " " + error.message);
                    }
                });
            },
            deletePlaceFollower:function (sweet, cb) {

                var PlaceFollowerquery = Parse.Object.extend("PlaceFollower");
                var query = new Parse.Query(PlaceFollowerquery);

                console.log("placename" + sweet.placename);
                console.log("userid" + sweet.userid);
                console.log("username" + sweet.username);

                query.equalTo("placename", sweet.placename);
                query.equalTo("userid", sweet.userid);
                query.equalTo("username", sweet.username);

                query.first({
                    success:function (object) {
                        //console.log("Successfully retrieved follower " +  object.length);
                        object.destroy({
                            success:function (myObject) {
                                console.log("Record successfully deleted");
                                cb(object);
                            },
                            error:function (myObject, error) {
                                console.log("Error: " + error.code + " " + error.message);
                            }
                        });

                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
            },
            updatePlaceUser:function (place, cb) {

                var SweetPlaceUsers = Parse.Object.extend("SweetPlaceUsers");
                var query = new Parse.Query("SweetPlaceUsers");

                console.log("placeName" + place.placeName);
                query.equalTo("placeName", place.placeName);
                query.equalTo("userID", place.userID);
                query.first({
                    success:function (object) {
                        //console.log("Successfully retrieved place join request user " +  object.length);
                        object.set("joinReq", "1");
                        object.save();
                        cb(object);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
            },
            deletePlaceUser:function (place, cb) {

                var SweetPlaceUsers = Parse.Object.extend("SweetPlaceUsers");
                var query = new Parse.Query(SweetPlaceUsers);

                console.log("placeName" + place.placeName);
                query.equalTo("placeName", place.placeName);
                query.equalTo("userID", place.userID);

                query.first({
                    success:function (object) {
                        //console.log("Successfully retrieved place join request user " +  object.length);
                        object.destroy({
                            success:function (myObject) {
                                //console.log("Record successfully deleted");
                                cb(object);
                            },
                            error:function (myObject, error) {
                                console.log("Error: " + error.code + " " + error.message);
                            }
                        });

                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
            },
            //--------------------------------------------------------------------------------------------------
            //**************************************************************************************************
            saveSweetPlaceParse:function (place, cb) {
                var placeExist = false;
                console.log("saveSweet: " + place.placeName);
                console.log("saveSweet: " + place.placeTitle);

                var SweetPlace = Parse.Object.extend("SweetPlace");
                var pSweet = new SweetPlace();

                pSweet.set("placeCreatorId", userService.currentUser().id);
                pSweet.set("placeName", place.placeName);
                pSweet.set("placeTitle", place.placeTitle);
                pSweet.set("placePhoto", place.placePhoto);
                pSweet.set("placeSweetName", place.placeSweetName);
                pSweet.set("placeDesc", place.placeDesc);
                pSweet.set("placeURL", place.placeURL);
                pSweet.set("placeLatitude", place.placeLatitude);
                pSweet.set("placeLongitude", place.placeLongitude);
                pSweet.set("LatLong", place.LatLong);
                //pSweet.set("photo", place.photo);
                pSweet.set("gname", place.gname);
                pSweet.set("icon", place.icon);
                pSweet.set("address", place.formatted_address);
                pSweet.set("address2", place.placeAddress2);

                var query = new Parse.Query("SweetPlace");

                //if some place find with same name donot create it again.
                //if error mean no place find then create new place.
                query.equalTo("placeName", place.placeName);
                query.find({
                    success:function (results) {
                        console.log("Successfully retrieved " + results.length);
                        if (results.length == 0) {
                            pSweet.save(null, {
                                success:function (pSweet) {
                                    cb(pSweet);
                                },
                                error:function (pSweet, error) {
                                    console.log("service: saveSweet() -> " + error.code + " " + error.message);
                                }

                            });
                        } else {
                            //var placeExist = true ;
                            //return placeExist;
                            //console.log("flag -->>-- true");
                        }
                        cb(results);
                    },
                    error:function (error) {
                        //console.log("Error: " + error.code + " " + error.message);
                        pSweet.save(null, {
                            success:function (pSweet) {
                                cb(pSweet);
                            },
                            error:function (pSweet, error) {
                                console.log("service: saveSweet() -> " + error.code + " " + error.message);
                            }

                        });
                    }
                });

                /*pSweet.save(null, {
                 success:function(pSweet) {
                 cb(pSweet);
                 },
                 error: function(pSweet, error) {
                 console.log("service: saveSweet() -> "+error.code + " "+error.message);
                 }

                 });*/
            },
            addSweetPlaceParse:function (addsweetplace, cb) {

                //console.log("addSweetPlace: "+addsweetplace.placecid);

                var SweetPlaceUsers = Parse.Object.extend("SweetPlaceUsers");
                var pSweet = new SweetPlaceUsers();

                //pSweet.set("placeId", addsweetplace.placecid);
                pSweet.set("placeCreatorId", addsweetplace.placeCreatorId);
                pSweet.set("placeName", addsweetplace.placeName);
                pSweet.set("placeSweetName", addsweetplace.placeSweetName);
                pSweet.set("placeDesc", addsweetplace.placeDesc);
                pSweet.set("placeURL", addsweetplace.placeURL);
                pSweet.set("placeLatitude", addsweetplace.placeLatitude);
                pSweet.set("placeLongitude", addsweetplace.placeLongitude);
                pSweet.set("userID", addsweetplace.userID);
                pSweet.set("userName", addsweetplace.userName);
                pSweet.set("userNetwork", addsweetplace.userNetwork);
                pSweet.set("userPic", addsweetplace.userPic);
                if (addsweetplace.joinReq == "1") {
                    pSweet.set("joinReq", '1');
                } else {
                    pSweet.set("joinReq", '0');
                }

                pSweet.set("LatLong", addsweetplace.LatLong);
                //pSweet.set("photo" , addsweetplace.photo);
                //pSweet.set("address" , addsweetplace.formatted_address);
                pSweet.set("gname", addsweetplace.gname);
                pSweet.set("icon", addsweetplace.icon);

                //-------------------------------------------------------------------
                pSweet.save(null, {
                    success:function (pSweet) {
                        console.log(pSweet + " saved successfully");
                        cb(pSweet);
                    },
                    error:function (pSweet, error) {
                        console.log("service: saveSweet() -> " + error.code + " " + error.message);
                    }

                });
            },
            getPlaces:function (cb) {
                var placeSweetsArray = [];
                var SweetPlace = Parse.Object.extend("SweetPlace");
                var query = new Parse.Query("SweetPlace");

                /*query.get("aLmTAB227a", {
                 success: function(query) {
                 console.log("service: rPlaces() ->" + query);
                 cb(query);
                 },
                 error: function(object, error) {
                 console.log("service: rPlaces() -> "+error.code + " "+error.message);
                 }
                 });*/

                //query.notEqualTo("placeCreatorId", "jb46jctX5Z");
                query.find({
                    success:function (results) {
                        /*for(var i=0; i< results.length; i++) {
                         console.log("Successfully retrieved " +  results[i].get("placeName"));
                         placeSweetsArray.push(results[i]);
                         }
                         cb(placeSweetsArray);*/
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },
            getUserPlaces:function (userid, cb) {

                var placeUserArray = [];
                var SweetPlaceUsers = Parse.Object.extend("SweetPlaceUsers");
                var query = new Parse.Query("SweetPlaceUsers");

                console.log("Successfully retrieved userid" + userid);

                //query.equalTo("userID",userService.currentUser().id);
                query.equalTo("userID", userid);
                query.equalTo("joinReq", "1");
                query.find({
                    success:function (results) {
                        console.log("Successfully retrieved " + results.length);
                        /*for(var i=0; i< results.length; i++) {
                         console.log("Successfully retrieved " +  results[i].get("placeName"));
                         placeSweetsArray.push(results[i]);
                         }
                         cb(placeSweetsArray);*/
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
            },
            checkUserPlaces:function (userid,placename, cb) {

                var placeUserArray = [];
                var SweetPlaceUsers = Parse.Object.extend("SweetPlaceUsers");
                var query = new Parse.Query("SweetPlaceUsers");

                console.log("Successfully retrieved userid" + userid);

                //query.equalTo("userID",userService.currentUser().id);
                query.equalTo("userID", userid);
                query.equalTo("joinReq", "1");
                query.equalTo("placeName", placename);
                query.find({
                    success:function (results) {
                        console.log("Successfully retrieved " + results.length);
                        /*for(var i=0; i< results.length; i++) {
                         console.log("Successfully retrieved " +  results[i].get("placeName"));
                         placeSweetsArray.push(results[i]);
                         }
                         cb(placeSweetsArray);*/
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
            },
            getCreatedPlaces:function (userid, cb) {

                var placeUserArray = [];
                var SweetPlaceUsers = Parse.Object.extend("SweetPlace");
                var query = new Parse.Query("SweetPlace");

                console.log("Successfully retrieved userid" + userService.currentUser().id);

                query.equalTo("placeCreatorId", userService.currentUser().id);
                //query.equalTo("userID",userid);
                query.find({
                    success:function (results) {
                        console.log("Successfully retrieved " + results.length);
                        /*for(var i=0; i< results.length; i++) {
                         console.log("Successfully retrieved " +  results[i].get("placeName"));
                         placeSweetsArray.push(results[i]);
                         }
                         cb(placeSweetsArray);*/
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
            },
            getUserCreatedPlaces:function (userid, cb) {

                var placeUserArray = [];
                var SweetPlaceUsers = Parse.Object.extend("SweetPlace");
                var query = new Parse.Query("SweetPlace");

                console.log("Successfully retrieved userid" + userService.currentUser().id);

                query.equalTo("placeCreatorId", userService.currentUser().id);
                //query.equalTo("userID",userid);
                query.find({
                    success:function (results) {
                        console.log("Successfully retrieved " + results.length);
                        /*for(var i=0; i< results.length; i++) {
                         console.log("Successfully retrieved " +  results[i].get("placeName"));
                         placeSweetsArray.push(results[i]);
                         }
                         cb(placeSweetsArray);*/
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
            },
            getUserPlacesJoinReq:function (userid, cb) {

                var SweetPlaceUsers = Parse.Object.extend("SweetPlaceUsers");

                var query = new Parse.Query("SweetPlaceUsers");
                console.log("Successfully retrieved userid" + userid);
                query.equalTo("joinReq", '0');
                query.equalTo("userID", userid);
                query.find({
                    success:function (results) {
                        console.log("Successfully retrieved " + results.length);
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },
            getPlacesDetail:function (placename, cb) {
                var placeUserArray = [];
                var SweetPlaceUsers = Parse.Object.extend("SweetPlaceUsers");
                var query = new Parse.Query("SweetPlaceUsers");

                console.log("Successfully retrieved userid" + placename);

                //query.equalTo("userID",userService.currentUser().id);
                query.equalTo("placeName", placename);
                query.equalTo("joinReq", '1');
                query.find({
                    success:function (results) {
                        //console.log("Successfully retrieved SweetPlaceUsers" +  results.length);
                        /*for(var i=0; i< results.length; i++) {
                         console.log("Successfully retrieved " +  results[i].get("placeName"));
                         placeSweetsArray.push(results[i]);
                         }
                         cb(placeSweetsArray);*/
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },
            getPlacesFollower:function (placename, cb) {
                //var placeUserArray = [];
                var PlaceFollow = Parse.Object.extend("PlaceFollower");
                var query = new Parse.Query(PlaceFollow);

                //console.log("Successfully retrieved placename" + placename);

                //query.equalTo("userID",userService.currentUser().id);
                query.equalTo("placename", placename);
                //query.equalTo("joinReq", '1');
                query.find({
                    success:function (results) {
                        //console.log("Successfully retrieved SweetPlaceUsers" +  results.length);
                        /*for(var i=0; i< results.length; i++) {
                         console.log("Successfully retrieved " +  results[i].get("placeName"));
                         placeSweetsArray.push(results[i]);
                         }
                         cb(placeSweetsArray);*/
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },
            getUserFollowingSweet:function (cb) {

                var followingPlaces = [];
                var PlaceFollow = Parse.Object.extend("PlaceFollower");
                var query = new Parse.Query(PlaceFollow);

                //console.log("Successfully retrieved placename" + placename);

                query.equalTo("userid",userService.currentUser().id);
                query.find({
                    success:function (results) {
                        //console.log("Successfully retrieved SweetPlaceUsers" +  results.length);
                        if (results.length > 0){
                            for(var i=0; i< results.length; i++) {
                                console.log("Successfully retrieved following places" +  results[i].get("placename"));
                                followingPlaces.push(results[i].get("placename"));
                            }

                            var PlaceSweet = Parse.Object.extend("PlaceSweetness");
                            var query = new Parse.Query(PlaceSweet);
                            query.containedIn("placename",followingPlaces);

                            query.find({
                                success:function (objects) {
                                    console.log("Successfully retrieved places sweets" +  objects.length);
                                    cb(objects);
                                },
                                error:function (error) {
                                    console.log("Error: " + error.code + " " + error.message);
                                }
                            });
                        }

                        //cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },
            placesCustomerComm:function (comment, cb) {

                var SweetPlaceUsers = Parse.Object.extend("PlaceUserComment");
                var cSweet = new SweetPlaceUsers();

                cSweet.set("receiverPhone", comment.receiverPhone );
                cSweet.set("receiverName", comment.receiverName );
                cSweet.set("receiverChannel", comment.receiverChannel );
                cSweet.set("receiverPicture", comment.receiverPicture );
                cSweet.set("placename", comment.placename );
                cSweet.set("placesweetname", comment.placesweetname );
                cSweet.set("senderName", comment.senderName );
                cSweet.set("comment", comment.comment );
                cSweet.set("mobile", comment.mobile );
                cSweet.set("senderPicture", comment.senderPicture );
                cSweet.set("rating", comment.rating );
                cSweet.set("username", comment.username);

                //-------------------------------------------------------------------
                cSweet.save(null, {
                    success:function (pSweet) {
                        console.log(pSweet + " saved successfully PlaceUserComment");
                        cb(pSweet);
                    },
                    error:function (pSweet, error) {
                        console.log("service: saveSweet() -> " + error.code + " " + error.message);
                    }

                });
            },
            getComments:function (placename, cb) {

                var PlaceComments = Parse.Object.extend("PlaceUserComment");
                var query = new Parse.Query(PlaceComments);

                query.equalTo("placename",placename);
                query.find({
                    success:function (results) {
                        console.log("Successfully retrieved Place comments" +  results.length);
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },
            getPlacesInfo:function (placename, cb) {

                var SweetPlace = Parse.Object.extend("SweetPlace");
                var query = new Parse.Query("SweetPlace");

                console.log("Successfully retrieved userid" + placename);

                //query.equalTo("userID",userService.currentUser().id);
                query.equalTo("placeName", placename);
                query.find({
                    success:function (results) {
                        //console.log("Successfully retrieved SweetPlaceInfo" +  results.length);
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },
            getPlacestoJoin:function (placename, currentUser, cb) {
                var placeUserArray = [];
                var SweetPlaceUsers = Parse.Object.extend("SweetPlaceUsers");
                var query = new Parse.Query("SweetPlaceUsers");

                console.log("Successfully retrieved placename" + placename);
                console.log("Successfully retrieved userid" + currentUser);

                query.equalTo("userID", currentUser);
                query.equalTo("placeName", placename);
                query.find({
                    success:function (results) {
                        console.log("Successfully retrieved SweetPlaceUsers" + results.length);
                        /*for(var i=0; i< results.length; i++) {
                         console.log("Successfully retrieved " +  results[i].get("placeName"));
                         placeSweetsArray.push(results[i]);
                         }
                         cb(placeSweetsArray);*/
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },
            placeJoinReq:function (placename, currentUser, cb) {

                var placeUserArray = [];
                var SweetPlaceUsers = Parse.Object.extend("SweetPlaceUsers");
                var query = new Parse.Query("SweetPlaceUsers");

                query.equalTo("placeCreatorId", userService.currentUser().id);
                query.equalTo("placeName", placename);
                query.equalTo("joinReq", "0");
                query.find({
                    success:function (results) {
                        console.log("Successfully retrieved SweetPlaceUsers" + results.length);
                        /*for(var i=0; i< results.length; i++) {
                         console.log("Successfully retrieved " +  results[i].get("placeName"));
                         placeSweetsArray.push(results[i]);
                         }
                         cb(placeSweetsArray);*/
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },
            getPlacesSweets:function (placename, cb) {

                var SweetPlaceUsers = Parse.Object.extend("SweetPlaceUsers");
                var query = new Parse.Query("PlaceSweetness");

                console.log("Successfully retrieved userid" + placename);

                //query.equalTo("userID",userService.currentUser().id);
                query.descending("updatedAt");
                query.equalTo("placename", placename);
                query.find({
                    success:function (results) {
                        //console.log("Successfully retrieved " +  results.length);
                        cb(results);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });

            },
            //**************************************************************************************************
            //--------------------------------------------------------------------------------------------------
//        TODO: introduce callback so that location in controller redirects to confirmation after sweet is sent
//                TODO: try sending object through callback
//                TODO: gesture type not saving
//                TODO: add heart, star ...
            autoAcknowledge:function (sweetId, cb) {
                //console.log(" --- autoAcknowledge --- SweetID: " + sweetId + " Callback: "+cb)
                var self = this;
                var sweetQuery = new Parse.Query("Sweet");
                sweetQuery.get(sweetId, {
                    success:function (rSweet) {
                        //console.log("Returned sweet from persistent storage: "+rSweet);
//                   var newSweet = rSweet;

                        var newSweet = {};
                        newSweet["receiverId"] = rSweet.get("receiverId");
                        newSweet["receiverName"] = rSweet.get("senderName");
                        newSweet["receiverPhone"] = rSweet.get("senderPhone");
                        newSweet["senderId"] = rSweet.get("senderId");
                        newSweet["senderName"] = rSweet.get("receiverName");
                        newSweet["senderPhone"] = rSweet.get("receiverPhone");

                        newSweet["senderChannel"] = rSweet.get("senderChannel");
                        newSweet["senderPicture"] = rSweet.get("senderPicture");
                        newSweet["receiverChannel"] = rSweet.get("receiverChannel");
                        newSweet["receiverPicture"] = rSweet.get("receiverPicture");


                        newSweet["gestureType"] = rSweet.get("gestureType");
//                   newSweet["picture"] = rSweet.get("picture.url");
                        newSweet["star"] = rSweet.get("star");
                        newSweet["heart"] = rSweet.get("heart");
                        newSweet["greetingBackground"] = rSweet.get("greetingBackground");
                        newSweet["fontColor"] = rSweet.get("fontColor");
                        newSweet["auto"] = "true";
                        newSweet["replyToSweet"] = rSweet.get("replyToSweet");

                        newSweet["gesture"] = rSweet.get("gesture");

                        var newLine = "\n\n";
                        if (utilService.isPhone(rSweet.get("senderPhone"))) {
                            newSweet["text"] = "Nice! " + rSweet.get("receiverName").split(" ")[0] + " " + constantService.getAutoAckMsg();
                        } else {
                            newLine = "<br/><br/>";
                            newSweet["text"] =
                                "Hi " + rSweet.get("senderName").split(" ")[0] + "!"
                                    + newLine
                                    + rSweet.get("receiverName").split(" ")[0] + " acknowledged your gesture."
                                    + newLine
                                    + "<a href='" + CONSTANTS.BASE_URL + "'>"
                                    + "Build stronger relationships - send gestures, favors, and compliments to people you like to interact with"
                                    + "</a>"
                                    + newLine + "Thanks for spreading Sweetness!"
                                    + newLine + "- The Sweet Team";
                        }

                        //console.log("Persisting Sweet " + newSweet);
                        self.saveSweet(newSweet, function (sSweet, sUserSweet) {
                            //console.log("**************Save Sweet ************** "+sUserSweet.get("notes"));
                            cb(sSweet, sUserSweet);
                        });
                    }
                });
            },
            sendSweet:function (sweet, fromEmailAddress, cb) {
                console.log("sendSweet() : sweet id -> " + sweet.id);
                var self = this;
                var newLine = "<br/><br/>";
                var mSweetText = limitForSMS(sweet.get("receiverPhone"), sweet.get("text"));
                var mAvatar = "";
                var query = new Parse.Query("UserChannel");
                query.equalTo("userId", userService.currentUser().id);
                query.first({
                    success:function (rUserChannel) {
                        if (rUserChannel.get("avatarURL")) {
                            //                  mAvatar =  "<img src='" + rUserChannel.get("avatarURL") + "' width='48px' height='48px' /> " + newLine;
                            mAvatar = "<img src='" + CONSTANTS.AVATAR_RESIZE_URL + rUserChannel.get("avatarURL") + "'/>"
                                + newLine;
                        }

                        var text =
                                mAvatar
                                    + "Hi " + sweet.get("receiverName").split(" ")[0]
                                    + "!" + newLine + mSweetText + newLine + "- "
                                    + sweet.get("senderName").split(" ")[0] + newLine
                                    + "<a href='http://" + constantService.getSweetAckLink() + sweet.id + "'>" + "Send back a Sweet gesture</a>"
                        //                    +"<br/>"+ constantService.getSweetAckLink() +sweet.id
                            ;

                        if (utilService.isPhone(sweet.get("receiverPhone"))) {
                            newLine = "\n";
                            text = "Hi " + sweet.get("receiverName").split(" ")[0] + "!" + newLine + sweet.get("senderName") + " says:" + newLine + mSweetText + newLine + "Respond to the Sweet gesture:" + "\n" + constantService.getSweetAckLink() + sweet.id;
                        }
                        self.sendIt(sweet, "sweet@sweetness.io", text, function (success) {
                            cb(success);
                        });
                    },
                    error:function (error) {
                        console.log("service: sendSweet() -> " + error.code + " " + error.message);
                    }

                });

            },
            sendIt:function (sweet, fromEmailAddress, text, cb) {

                //console.log("\n--- SendIt ---: "+sweet.get("receiverPhone"));
                var mText = text;

                if (sweet.get("receiverChannel") == "facebook") {
                    facebookService.postToWall(sweet);
                } else if (utilService.isEmail(sweet.get("receiverPhone"))) {
                    var mFromEmail = fromEmailAddress;

                    if (utilService.isEmail(sweet.get("senderPhone"))) {
                        mFromEmail = sweet.get("senderPhone");
                    }

                    var mSubject;
                    if (sweet.get("auto"))
                        mSubject = sweet.get("senderName") + " loved the Sweet gesture ";
                    else
//                    mSubject =   sweet.get("senderName") + " " + getResponseGestureText(sweet.get("gestureType"));
                        mSubject = sweet.get("senderName") + " " + getResponseGestureText(sweet);
                    var mToEmail = sweet.get("receiverPhone");

                    var mFromName = sweet.get("senderName");

                    if (utilService.isPhone(sweet.get("senderPhone"))) {
                        mFromName = "Sweetness Labs";
                    }

                    var mToName = sweet.get("receiverName");

                    //console.log(mFromEmail + " "+mSubject+" "+mToEmail+" "+mText);
                    utilService.sendEmail(mFromEmail, mToEmail, mSubject, mText, mFromName, mToName, function (success) {
                        if (success) {
                            cb(true);
                        }
                        else {
                            cb(false);
                        }

                    });
                } else if (utilService.isPhone(sweet.get("receiverPhone"))) {
                    var newLine = "\n";
                    //console.log("Sweet on its way through SMS to... "+sweet.get("receiverPhone"));
//                mText =  "Hi " + sweet.get("receiverName").split(" ")[0] + "!" + newLine + sweet.get("senderName") + " says:" + newLine + sweet.get("text") + newLine + "Respond to the Sweet gesture:"+"\n"+ constantService.getSweetAckLink() +sweet.id;
                    utilService.sendSMS(sweet.get("receiverPhone"), mText, function (success) {
                        if (success) cb(true); else cb(false);
                    });
                }
            },
            sendCommentEmail:function (emailData, cb) {

                var newLine = "<br>";

                var fromEmail = emailData.fromEmail;
                var receiverEmail = emailData.receiverEmail;
                var subject = emailData.subject;
                var m_phone = "Hello "
                            + newLine
                            + "A customer just wrote to you: "
                            + newLine
                            + emailData.comment
                            + newLine
                            + emailData.username
                            + '--'
                            + emailData.mobile
                            + newLine
                            + "- Team Sweetness ";

                utilService.sendEmailPP(fromEmail,receiverEmail, subject, m_phone, function (success) {
                    if (success) {
                        console.log("Email send successfuly");
                        cb(true);
                    }
                    else {
                        console.log("Email having some problem");
                        cb(false);
                    }
                });
            },

            //                TODO: parse query limit is 100 by default query.limit(100) - 1000 max
            loadSweets:function (interaction, cb) {
                var mInteractionSweetIds = interaction.get("sweets");
                // console.log("service: loadSweets() : sweets -> "+interaction.get("sweets"));
                var mReceiverPhone = interaction.get("receiverPhone");
                // console.log("service: loadSweets() : receiverPhone -> "+interaction.get("receiverPhone"));

//            Find sender channels from UserChannel class where userId = currentUser.id -> channels
//            Find receiverPhone from channels in UserChannel class -> userId//
//            Get all the sweets where senderId = userId

                var myChannelsQuery = new Parse.Query("UserChannel");

                console.log("service: loadSweets() : userService.currentUser().id -> " + userService.currentUser().id);

                myChannelsQuery.equalTo("userId", userService.currentUser().id);
                myChannelsQuery.first({
                    success:function (myChannels) {
                        console.log("service: loadSweets() : myChannels -> " + myChannels);
                        var receiverUserIdQuery = new Parse.Query("UserChannel");
                        receiverUserIdQuery.equalTo("channels", mReceiverPhone);

                        var rQuery = new Parse.Query("Sweet");
                        // rQuery.equalTo("receiverPhone",userService.currentUser().get("username"));
                        rQuery.matchesKeyInQuery("senderId", "userId", receiverUserIdQuery);
//                    rQuery.containedIn("receiverPhone",myChannels.get("channels"));
                        // rQuery.notEqualTo("auto","true");
                        rQuery.descending("updatedAt");
                        rQuery.limit(100);

                        rQuery.find({
                            success:function (rReceivedSweets) {
                                console.log("receivedQuery -> rRecivedSweets");
                                var receivedSweetsArray = [];
                                var myChannelsArray = myChannels.get("channels");
                                for (var i = 0; i < myChannelsArray.length; i++) {
                                    // console.log(myChannelsArray[i]);
                                    for (var j = 0; j < rReceivedSweets.length; j++) {
                                        if (angular.equals(myChannelsArray[i], rReceivedSweets[j].get("receiverPhone"))) {
                                            receivedSweetsArray.push(rReceivedSweets[j]);
                                        }
                                    }
                                }
                                // console.log("receivedQuery -> receivedSweetsArray -> "+receivedSweetsArray);

                                var query = new Parse.Query("Sweet");
                                query.containedIn("objectId", mInteractionSweetIds);

//                           var mainQuery = Parse.Query.or(query,rQuery);

                                query.descending("updatedAt");
                                query.limit(100);
                                query.find({
                                    success:function (rSweets) {
                                        // console.log(receivedSweetsArray);
                                        // console.log("=="+rSweets);
                                        for (var i = 0; i < rSweets.length; i++) {
                                            receivedSweetsArray.push(rSweets[i]);
                                        }
                                        // angular.copy(receivedSweetsArray,rSweets);
                                        receivedSweetsArray.sortByProp('updatedAt');
                                        cb(receivedSweetsArray);
                                    },
                                    error:function (error) {
                                        console.log("service: loadSweets() : mainQuery.find : error -> ", error.code + " " + error.message);
                                        cb([]);
                                    }
                                });


                            },
                            error:function (error) {
                                console.log("service: loadSweets() : receivedQuery : error -> ", error.code + " " + error.message);
                            }
                        });


                    },
                    error:function (error) {
                        console.log("service: loadSweets() : myChannelsQuery.first : error -> ", error.code + " " + error.message);
                    }
                });
            },
//      Bubble
            setGestureText:function (type, requester, cb) {
                var text;
                switch (type) {
                    case "sayThankYou":
                        if (requester == 0)
                            text = CONSTANTS.GESTURE.THANK_YOU.TEMPLATE;
                        else if (requester == 1)
                            text = CONSTANTS.GESTURE.THANK_YOU.FACEBOOK_TEMPLATE;
                        break;
                    case "sendAHello":
                        if (requester == 0)
                            text = CONSTANTS.GESTURE.HELLO.TEMPLATE;
                        else if (requester == 1)
                            text = CONSTANTS.GESTURE.HELLO.FACEBOOK_TEMPLATE;
                        break;
                    case "sendGreetings":
                        if (requester == 0)
                            text = CONSTANTS.GESTURE.GREETING.TEMPLATE;
                        else if (requester == 1)
                            text = CONSTANTS.GESTURE.GREETING.FACEBOOK_TEMPLATE;
                        break;
                    case "thoughtAboutYou":
                        if (requester == 0)
                            text = CONSTANTS.GESTURE.THOUGHT_ABOUT_YOU.TEMPLATE;
                        else if (requester == 1)
                            text = CONSTANTS.GESTURE.THOUGHT_ABOUT_YOU.FACEBOOK_TEMPLATE;
                        break;
                }
                cb(text);

            },
            isItMySweet:function (sweet, cb) {
                userService.getUserByChannel(sweet.get("receiverPhone"), function (rUser) {
                    if (rUser && userService.currentUser().id == rUser.id)
                        cb(true);
                    else
                        cb(false);
                });
            }
        }
    })
    .service('interactionService', function (sweetService, userService, utilService, constantService) {

        var interaction;
        var sweetForInteraction;
        return {

            setSweetForInteraction:function (sweet) {
                this.sweetForInteraction = sweet;
            },

            getSweetForInteraction:function () {
                return this.sweetForInteraction;
            },

            saveVisibility:function (interaction, visibility) {
                var query = new Parse.Query("UserSweets");
                query.get(interaction.id, {
                    success:function (rInteraction) {
                        //console.log("--- SaveVisibility ---");
                        rInteraction.set("visibility", visibility);
                        rInteraction.save(null, {
                            success:function (result) {
                                //console.log("Visibility saved "+interaction.id+" "+visibility);

                            },
                            error:function (result, error) {
                                console.log("service: saveVisibility() -> " + error.code + " " + error.message);
                            }

                        });
                    }
                });
            },

            saveEject:function (interaction, eject) {
                var query = new Parse.Query("UserSweets");
                query.get(interaction.id, {
                    success:function (rInteraction) {
                        //console.log("--- SaveEject ---");
                        rInteraction.set("eject", eject);
                        rInteraction.save(null, {
                            success:function (result) {
                                //console.log("Eject saved "+interaction.id+" "+eject);

                            },
                            error:function (result, error) {
                                console.log("service: saveEject() -> " + error.code + " " + error.message);
                            }

                        });
                    }
                });
            },

            savePlay:function (interaction, play) {
                var query = new Parse.Query("UserSweets");
                query.get(interaction.id, {
                    success:function (rInteraction) {
                        //console.log("--- SavePlay ---");
                        rInteraction.set("play", play);
                        rInteraction.save(null, {
                            success:function (result) {
                                //console.log("Play saved "+interaction.id+" "+play);

                            },
                            error:function (result, error) {
                                console.log("service: savePlay() -> " + error.code + " " + error.message);
                            }

                        });
                    }
                });
            },

            saveNotes:function (interaction, notes) {
                //console.log("--- Saving Notes ---");
                var query = new Parse.Query("UserSweets");
                query.get(interaction.id, {
                    success:function (rInteraction) {
                        //console.log("--- SaveNotes ---");
                        rInteraction.set("notes", notes);
                        rInteraction.save(null, {
                            success:function (result) {
                                //console.log("Note saved "+interaction.id+" "+notes);

                            },
                            error:function (result, error) {
                                console.log("service: saveNotes() -> " + error.code + " " + error.message);
                            }

                        });
                    }
                });
            },

            saveFrequency:function (interaction, frequency) {
                //console.log("--- Saving frequency ---");
                var query = new Parse.Query("UserSweets");
                query.get(interaction.id, {
                    success:function (rInteraction) {
                        //console.log("--- Savefrequency ---");
                        rInteraction.set("frequency", frequency);
                        rInteraction.save(null, {
                            success:function (result) {
                                //console.log("frequency saved "+interaction.id+" "+frequency);

                            },
                            error:function (result, error) {
                                console.log("service: saveFrequency() -> " + error.code + " " + error.message);
                            }

                        });
                    }
                });
            },
            saveEvent:function (interaction, event, cb) {
                //console.log("--- Saving event ---");
                var query = new Parse.Query("UserSweets");
                query.get(interaction.id, {
                    success:function (rInteraction) {
                        //console.log("--- SaveEvent ---");
                        rInteraction.set("event", event);
                        rInteraction.save(null, {
                            success:function (result) {
                                //console.log("event saved "+interaction.id+" "+result.get("event"));
                                cb(result);

                            },
                            error:function (result, error) {
                                console.log("service: saveEvent() -> " + error.code + " " + error.message);
                            }

                        });
                    }
                });
            },
            setInteraction:function (pInteraction) {
                this.interaction = pInteraction;
            },
            getInteraction:function () {
                return this.interaction;
            },

            getInteractionByUserId:function (userId, cb) {
                //console.log("---getInteractionByUserId--- "+userId);
                var query = new Parse.Query("UserChannel");
                query.equalTo("userId", userId);
                query.first({
                    success:function (rInteraction) {
                        //console.log("---getInteractionByUserId--- "+rInteraction.id);//
                        cb(rInteraction);
                    },
                    error:function (error) {
                        console.log("service: getInteractionByUserId() -> " + error.code + " " + error.message);
                    }

                });
            },
            getInteractionById:function (interaction, cb) {
                var query = new Parse.Query("UserSweets");
                query.get(interaction.id, {
                    success:function (rInteraction) {
                        cb(rInteraction);
                    }
                });
            },
            getInteractionWith:function (userId, receiverPhone, cb) {
                console.log("---service: getInteractionWith() -> " + userId + ":"
                    + receiverPhone);
                var query = new Parse.Query("UserSweets");
                query.equalTo("senderId", userId);
                query.equalTo("receiverPhone", receiverPhone);
                query.first({
                    success:function (rUserSweet) {
//                   alert(rUserSweet);
                        if (rUserSweet && rUserSweet.attributes)
                            console.log("---getInteractionWith pair--- " + _.pairs(rUserSweet.attributes));
                        cb(rUserSweet);
                    },
                    error:function (error) {
                        console.log("service: getInteractionWith() -> " + error.code + " " + error.message);
                        cb(null);
                    }
                });
            },
            getMyInteractions:function (cb) {
                console.log("---service: getMyInteractions()---");
                var query = new Parse.Query("UserSweets");
                query.equalTo("senderId", userService.currentUser().id);
                query.find({
                    success:function (rUserSweets) {
                        cb(rUserSweets);
                    },
                    error:function (error) {
                        console.log("service: getMyInteractions() -> " + error.code + " " + error.message);
                        cb(null);
                    }
                });

            }
        }
    })
    .factory('UpdateService', function ($log, localStorageService, userService) {
        var mLastUpdatedAt;

        var UpdateService = {
            checkForUpdates:function (cb) {

//      $log.info("---UpdateService: Checking for updates---");
                var query = new Parse.Query("SoftwareUpdates");
                query.descending("updatedAt");
                query.first({
                    success:function (rSoftwareUpdates) {
                        var revisionDB = rSoftwareUpdates.get("revision");
                        var revisionLocal = localStorageService.get("SweetnessRevisionLocal");
//           $log.info("---UpdateService revisionLocal: ---"+revisionLocal);
//           $log.info("---UpdateService: revisionDB---"+revisionDB);   

                        // if(!revisionLocal ) {  
                        //              localStorageService.remove("SweetnessRevisionLocal");
                        //              localStorageService.add("SweetnessRevisionLocal",  revisionDB);
                        //              cb(false);             
                        //            }  

                        if (revisionLocal < revisionDB) {
                            localStorageService.remove("SweetnessRevisionLocal");
                            localStorageService.add("SweetnessRevisionLocal", revisionDB);
                            cb(true);
                        }
                    },
                    error:function (error) {
                        console.log("service: UpdateService() -> " + error.code + " " + error.message);
                    }

                });

                cb(false);
            }
        };
        return UpdateService;
    })
    .service('helpService', function (userService, utilService, CONSTANTS) {
        return {
            submit:function (senderName, senderEmail, text, cb) {
                text = CONSTANTS.EMAIL_DEFAULT_VALUES.TO_NAME + ","
                    + "<br/><br/>"
                    + text
                    + "<br/><br/>"
                    + senderName
                    + "<br/>"
                    + senderEmail;

                var mFromEmail = CONSTANTS.EMAIL_DEFAULT_VALUES.FROM_ADDRESS;

                if (utilService.isEmail(senderEmail)) {
                    mFromEmail = senderEmail;
                }

                var Help = Parse.Object.extend("Help");
                var help = new Help();
                help.set("senderName", userService.currentUser().get("fullName"));
                help.set("senderEmail", userService.currentUser().get("username"));
                help.set("text", text);

                help.save(null, {
                    success:function (rHelp) {
                        utilService.sendEmail(
                            mFromEmail,
                            CONSTANTS.EMAIL_DEFAULT_VALUES.TO_ADDRESS,
                            CONSTANTS.HELP.DEFAULT_SUBJECT,
                            text,
                            senderName,
                            CONSTANTS.EMAIL_DEFAULT_VALUES.TO_NAME,
                            function () {

                            });
                        cb(rHelp);
                    },
                    error:function (rHelp, error) {
                        console.log("service: help.save() -> " + error.code + " " + error.message);
                        cb(null);
                    }

                });

            }
        }
    })
    .service('contactService', function (userService) {
        var UserContact = Parse.Object.extend("UserContacts");
        var usercontact = new UserContact();

        function setUserContacts(callback) {
            var query = new Parse.Query(UserContact);
            query.equalTo("userId", userService.currentUser().id);
            query.first({
                success:function (object) {
                    if (object == null) {
                        usercontact.set("userId", userService.currentUser().id);
                        usercontact.save();
                    } else {
                        usercontact = object;
                    }
                    callback(usercontact);
                },
                error:function (error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        }

        return {
            getContacts:function (callback) {
                setUserContacts(function (response) {
                    callback(response);
                });
            },

            //callback is email address here
            getOneContactEmail:function (userName, callback) {
                var query = new Parse.Query(UserContact);
                query.equalTo("name", userName);
                query.first({
                    success:function (object) {
                        if (object == null) {
                        } else {
                            usercontact = object;
                            //console.log(object);
                            callback(object.get("email"));
                        }
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);

                    }
                });


            },

            importEmail:function (userId, array_of_contacts, source, callback) {
                //then saved the user contact into usercontact object
                setUserContacts(function (response) {
                        for (var i = 0; i < array_of_contacts.length; i++) {

                            //compare with existing contacts and insert non existing
                            var contact = array_of_contacts[i];
                            // [{name:"abc",email:"abc@xyz.com"}, {name:"xyz",email:"xyz@def.com"}]
                            var processedContact = {};
                            processedContact.email = contact.primaryEmail();
                            processedContact.type = contact.email.type;

                            //contact.fullname is Not working detect empty space.
                            if (contact.fullName() == "  ") {
                                processedContact.name = "No Name";
                            } else {
                                processedContact.name = contact.fullName();
                            }
                            //console.log(processedContact);
                            processedContact.address = contact.address;
                            processedContact.phone = contact.phone;
                            usercontact.addUnique(source, processedContact);
                        }
                        //save to parse

                        usercontact.save(null, {
                            success:function (result) {
                                callback(true);
                            },
                            error:function (result, error) {
                                console.log("Error: " + error.code + " " + error.message);
                                callback(false);
                            }
                        });
                        //callback(true);
                    }
                );
            }
        }
    })
    .service('facebookService', function (userService, CONSTANTS, $http, localStorageService) {

//    var successCallback = function(data) {
//        console.log("---Received from node server--- "+data);
//        this.updateExtendedToken(data);
//    };

        var updateExtendedToken = function (token, cb) {
            var query = new Parse.Query("User");
            query.get(userService.currentUser().id, {
                success:function (rUser) {
                    var authData = rUser.get("authData");
                    console.log("---authData--- " + authData);
                    authData.facebook.access_token = token;
                    rUser.set("authData", authData);
                    rUser.save(null, {
                        success:function (sUser) {
                            var key = "Parse/" + CONSTANTS.PARSE_API_ID + "/currentUser";
                            console.log(key);
                            var lsCurrentUser = JSON.parse(localStorage.getItem(key));
                            console.log("---localStorage lsCurrentUser--- " + lsCurrentUser);
                            lsCurrentUser.authData.facebook.access_token = token;
                            console.log("---localStorage2--- " + _.pairs(lsCurrentUser.authData.facebook));
                            localStorage.setItem(key, JSON.stringify(lsCurrentUser));
                            cb(true);

                        },
                        error:function (sUser, error) {
                            console.log("Error: " + error.code + " " + error.message);
                            cb(false);
                        }
                    });
                },
                error:function (rUser, error) {

                }
            });

        };

        var extendToken = function (cb) {
            console.log(CONSTANTS.NODEJS_SERVER + '/?' + 'fb_exchange_token=' +
                userService.currentUser().get("authData")["facebook"]["access_token"]);
            $http.get(CONSTANTS.NODEJS_SERVER + '?' + 'fb_exchange_token=' +
                userService.currentUser().get("authData")["facebook"]["access_token"])
                .success(function (data) {
                    updateExtendedToken(data, function (success) {
                        cb(success);
                    });
                }).error(function (data, status, headers, config) {
                    console.log("---ERROR--- " + data + " " + status + " " + headers + " " + config);
                    cb(false);
                });
        };

        return {

            getExtendedToken:function (cb) {
                extendToken(function (success) {
                    cb(success);
                });
            },

            loadSDK:function () {
                console.log("---facebookService: loadSDK()---");
//            window.fbAsyncInit = function () {
                Parse.FacebookUtils.init({
                    //              TODO: What if user revoke Sweet app permissions
                    appId:CONSTANTS.SOCIAL.FACEBOOK.APP_ID,
                    channelUrl:CONSTANTS.SOCIAL.FACEBOOK.CHANNEL_URL, // Channel File
                    status:true, // check login status
                    cookie:true, // enable cookies to allow Parse to access the session
                    xfbml:true, // parse XFBML,
                    oauth:true
                });
//            };

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
            },

            login:function (cb) {

                console.log("---deprecated facebook login---");
//            Parse.FacebookUtils.init({
//                //              TODO: What if user revoke Sweet app permissions
//                appId      : CONSTANTS.SOCIAL.FACEBOOK.APP_ID,
//                channelUrl : CONSTANTS.SOCIAL.FACEBOOK.CHANNEL_URL, // Channel File
//                status     : true,  // check login status
//                cookie     : true,  // enable cookies to allow Parse to access the session
//                xfbml      : true,  // parse XFBML,
//                oauth      : true
//            });
////            };
//
//            (function(d){
//                var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
//                js = d.createElement('script'); js.id = id; js.async = true;
//                js.src = "//connect.facebook.net/en_US/all.js";
//                d.getElementsByTagName('head')[0].appendChild(js);
//            }(document));

//            Parse.FacebookUtils.logIn("publish_actions,email",{
//                success: function(user) {
//                    if (!user.existed()) {
//                        console.log("User signed up and logged in through Facebook!");
//                    } else {
//                        console.log("User logged in through Facebook!");
//                    }
//                    extendToken(function(success) {
//
//                    });
//                    cb(user);
//
//                },
//                error: function(user, error) {
//                    console.log("User cancelled the Facebook login or did not fully authorize.");
//                    console.log(error.message);
//                    cb(null);
//                }
//            });

            },

//        Depcrecated login
//        doLogin:function(cb) {
////            this.loadSDK();
//            var self = this;
//            setTimeout(function() {
//                self.login(function(user) {
//                    if(user) {
//                        userService.updateUsername(user.get("authData")["facebook"]["id"], function(rUser) {
//                        });
//
//                        self.saveMe(user,function(rSocialNetwork) {
//                            self.saveFriends(user, function(rSocialNetwork) {
//                                userService.createOrAddChannels(user.id,
//                                    rSocialNetwork.get('me')['first_name'] + " " + rSocialNetwork.get('me')['last_name'],
//                                    user.get("authData")["facebook"]["id"],
//                                    function(rUserChannel) {
//                                        cb(user,rUserChannel);
//                                    }
//                                );
//                            });
//                        });
//                    }else {
//                        cb(null,null);
//                    }
//                });
//            },1000);
//
//        },

            updateUserInfo:function (user, cb) {
                var self = this;
                if (user) {
                    userService.updateUsername(user.get("authData")["facebook"]["id"], function (rUser) {
                    });

                    self.saveMe(user, function (rSocialNetwork) {
                        self.saveFriends(user, function (rSocialNetwork) {
                            userService.createOrAddChannels(user.id,
                                rSocialNetwork.get('me')['first_name'] + " " + rSocialNetwork.get('me')['last_name'],
                                user.get("authData")["facebook"]["id"],
                                function (rUserChannel) {
                                    cb(user, rUserChannel);
                                }
                            );
                        });
                    });
                } else {
                    cb(null, null);
                }
            },

//        Deprecated
//        link:function(user,cb) {
//            if (!Parse.FacebookUtils.isLinked(user)) {
//                Parse.FacebookUtils.link(user, CONSTANTS.SOCIAL.FACEBOOK.PERMISSIONS, {
//                    success: function(rUser) {
//                        console.log("---link--- Woohoo, user logged in with Facebook!");
//                        cb(rUser);
//                    },
//                    error: function(user, error) {
//                        console.log("---link--- User cancelled the Facebook login or did not fully authorize.");
//                        console.log(error.message);
//                        cb(null);
//                    }
//                });
//            }else {
//                cb(user);
//            }
//        },
//
//        doLink:function(cb) {
//            this.loadSDK();
//            var self = this;
//            setTimeout(function() {
//                self.link(userService.currentUser(),function(user) {
//                    if(user) {
//                        self.saveMe(user,function(rSocialNetwork) {
//                            self.saveFriends(user, function(rSocialNetwork) {
//                                userService.createOrAddChannels(user.id,
//                                    rSocialNetwork.get('me')['first_name'] + " " + rSocialNetwork.get('me')['last_name'],
//                                    user.get("authData")["facebook"]["id"],
//                                    function(rUserChannel) {
//                                        cb(user,rUserChannel);
//                                    }
//                                );
//                            });
//                        });
//                    } else {
//                        cb(null,null);
//                    }
//                });
//            },1000);
//        },

            saveMe:function (user, cb) {
                FB.api('/me', function (response) {
                    if (response && response.email && response.username) {
                        var me = {};
                        me.email = response.email;
                        me.username = response.username;
                        me.user_mobile_phone = response.user_mobile_phone;
                        me.first_name = response.first_name;
                        me.last_name = response.last_name;
                        me.gender = response.gender;
                        me.username = response.username;
                        me.picture = CONSTANTS.SOCIAL.FACEBOOK.GRAPH_URL + response.username + CONSTANTS.SOCIAL.FACEBOOK.PICTURE_URL;

                        var socialNetwork;
                        var query = new Parse.Query("SocialNetworks");
                        query.equalTo("userId", user.id);
                        query.equalTo("name", "facebook");
                        query.first({
                            success:function (rSocialNetwork) {
                                if (rSocialNetwork) {
                                    socialNetwork = rSocialNetwork;
                                } else {
                                    var SocialNetworks = Parse.Object.extend("SocialNetworks");
                                    socialNetwork = new SocialNetworks();
                                    socialNetwork.set("userId", user.id);
                                    socialNetwork.set("name", "facebook");
                                }
                                socialNetwork.set("me", me);
                                socialNetwork.save(null, {
                                    success:function (sSocialNetwork) {
                                        cb(sSocialNetwork);
                                    },
                                    error:function (sSocialNetwork, error) {
                                        console.log("Error: " + error.code + " " + error.message);
                                        cb(error);
                                    }
                                });
                            },
                            error:function (error) {
                                console.log("Error: " + error.code + " " + error.message);
                                cb(null);
                            }
                        });
                    }
                });
            },

            saveFriends:function (user, cb) {
                FB.api("/me/friends?fields=name,picture", function (response) {
                    var friends = response.data;

                    var socialNetwork;
                    var query = new Parse.Query("SocialNetworks");
                    query.equalTo("userId", user.id);
                    query.equalTo("name", "facebook");
                    query.first({
                        success:function (rSocialNetwork) {
                            if (rSocialNetwork) {
                                socialNetwork = rSocialNetwork;
                            } else {
                                var SocialNetworks = Parse.Object.extend("SocialNetworks");
                                socialNetwork = new SocialNetworks();
                                socialNetwork.set("userId", user.id);
                                socialNetwork.set("name", "facebook");
                            }
                            socialNetwork.set("friends", friends);
                            socialNetwork.save(null, {
                                success:function (sSocialNetwork) {
                                    cb(sSocialNetwork);
                                },
                                error:function (sSocialNetwork, error) {
                                    console.log("Error: " + error.code + " " + error.message);
                                    cb(null);
                                }
                            });
                        },
                        error:function (error) {
                            console.log("Error: " + error.code + " " + error.message);
                            cb(null);
                        }
                    });
                });
            },

            postToWall:function (sweet, msg, cb) {
                var template = _.template(CONSTANTS.SOCIAL.FACEBOOK.POST_TO_WALL_TEMPLATE);
                //var link = CONSTANTS.BASE_URL + "#/s/" + sweet.id;
                var link = CONSTANTS.BASE_URL;
                console.log(template);
                var body = template({
                    text:msg,
                    receiverFirstName:sweet.get("receiverName").split(" ")[0],
                    senderFirstName:sweet.get("senderName").split(" ")[0]
//                sweetLink:CONSTANTS.BASE_URL+"#/s/"+sweet.id
//                sweetLink:link
//                sweetLink:CONSTANTS.BASE_URL

                });
                console.log("Template: " + body);
                console.log("reiverPhone " + sweet.get("receiverPhone"));
                var tag = '["' + sweet.get("receiverPhone") + '"]';
                console.log("---TAG--- " + tag);

//            userService.logout();
//            this.loadSDK();

//            TODO: Custom type? this is working part

//            this.login(function(rUser) {
                extendToken(function (success) {
                    console.log("---tag--- " + tag);
                    FB.api('/me/feed', 'post', {
                        message:body,
                        link:link,
                        //name:"Spread Sweetness",
                        name: "Say Thank You",
                        //description:'Build Stronger Relationships',
                        description:'Give gratitude. It means everything.',
                        tags:tag,
                        place:'155021662189'

                    }, function (response) {
                        if (!response || response.error) {
                            console.log('Error occurred ' + response.error.message);
                        } else {
                            console.log('Post ID: ' + response.id);
                        }
                    });

                    cb(true);
                });
//            cb(true);
//


//            var text = sweet.get("text");
//            var link = CONSTANTS.BASE_URL+"auto/"+sweet.id;
//            this.fbInit();
//
//            FB.ui({
////                app_id: "465464716837107",
////                method: 'send',
////                name: sweet.get("senderName"),
//////                    + " " + sweet.get('text') + " "+ sweetPersonMe(sweet.get("receiverName"),sweet.get("senderName")),
////                link: 'http://www.sweetness.io',
////                redirect_uri:CONSTANTS.BASE_URL,
////                description: sweet.get("text"),
////                to:sweet.get("receiverPhone")
//                method: 'send',
//                name: 'People Argue Just to Win',
//                link: 'http://www.nytimes.com/2011/06/15/arts/people-argue-just-to-win-scholars-assert.html'
//            });

//            FB.api('/'+sweet.get("receiverPhone")+'/feed', 'post', { message: body }, function(response) {
//                if (!response || response.error) {
//                    console.log('Error occured '+response.error.message);
//                } else {
//                    console.log('Post ID: ' + response.id);
//                }
//            });
//            YourProxyMethod({
//                url : "https://graph.facebook.com/ID/feed?app_id=APP_ID&access_token=ACCESS_TOKEN",
//                method : "post",
//                params : {
//                    message : "message",
//                    name : "name",
//                    caption : "caption",
//                    description  : "desc"
//                },
//                success : function(response) {
//                    console.log(response);
//                },
//                error : function(response) {
//                    console.log("Error!");
//                    console.log(response);
//                }
//            });
            }
        }
    })
    .service('socialNetworksService', function (userService, CONSTANTS) {
        return {
            load:function (cb) {
                var query = new Parse.Query("SocialNetworks");
                query.equalTo("userId", userService.currentUser().id);
                query.find({
                    success:function (rSocialNetworks) {
                        cb(rSocialNetworks);
                    },
                    error:function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                        cb(null);
                    }
                });
            }
        }
    })
;