'use strict';

/* Filters */

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
sweetApp.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        if (input)
            return input.slice(start);
        else
            return input
    }
});

sweetApp.filter('shuffle', function() {
     var shuffledArr = [],
     shuffledLength = 0;
     return function(arr) {
         var o = arr.slice(0, arr.length);
         if (shuffledLength == arr.length) return shuffledArr;
         for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
         shuffledArr = o;
         shuffledLength = o.length;
         return o;
     };
 });

//sweetApp.filter('timeago', function() {
//    return function(time) {
//        if(time) return jQuery.timeago(time);
//        else return "";
//    };
//});
