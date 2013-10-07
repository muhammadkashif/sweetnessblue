var http = require('http'), url = require('url');

PORT = 8124;
URL = "127.0.0.1";

http.createServer(function (req, res) {

    FB_CLIENT_ID = '465464716837107';
    CLIENT_SECRET = '6b1af39a4fa893183de5e17c9e4a0f6a';

    var accessToken = "";
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var existing_token = query['fb_exchange_token'];

    console.log(query['fb_exchange_token']);

    var FB = require('fb');
    FB.options({redirect_uri:'http://127.0.0.1.xip.io'});

    FB.api('oauth/access_token', {
        client_id:FB_CLIENT_ID,
        client_secret:CLIENT_SECRET,
        grant_type:'fb_exchange_token',
        fb_exchange_token:existing_token
    }, function (response) {
        if (!response || response.error) {
            console.log(!response ? 'error occurred' : response.error);
            return;
        }

        accessToken = response.access_token;
        var expires = response.expires ? response.expires : 0;

        console.log(accessToken);
        console.log(response.expires);

        res.writeHead(200, {
            'Content-Type':'text/plain',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Headers':'X-Requested-With'
        });
        res.end(accessToken);
    });


}).listen(PORT, URL);
console.log('Server running at ' + URL + ":" + PORT);
