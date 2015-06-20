var tokens = {
	consumer_key: '',
	consumer_secret: ''
};

var fs       = require('fs');
var open     = require('open');
var OAuth    = require('oauth').OAuth;
var request  = require('request');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var oauth = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	tokens.consumer_key,
	tokens.consumer_secret,
	"1.0",
	'oob',
	"HMAC-SHA1"
);

oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
	console.log(error, oauth_token, oauth_token_secret, results);

	if(error){
		console.log('error during step #1', error);
		process.exit();
		return;
	}

	var requestParams = 'oauth_token='+oauth_token+'&oauth_token_secret='+oauth_token_secret+'&oauth_callback_confirmed='+results.oauth_callback_confirmed;
	var url = 'https://twitter.com/oauth/authorize?'+requestParams;
	console.log('Opening your browser to '+url);
	open(url);

	rl.question('Please auth then authorize the app control, then enter the PIN code given by Twitter : ', function(answer){
	    oauth.getOAuthAccessToken(oauth_token, oauth_token_secret, answer, function(error, oauth_access_token, oauth_access_token_secret, results2) {
	      console.log('oauth_access_token :' + oauth_access_token);
	      console.log('oauth_token_secret :' + oauth_access_token_secret);
	      console.log('accesstoken results :', (results2));

	      tokens.access_token = oauth_access_token;
	      tokens.access_token_secret = oauth_access_token_secret;

	      fs.writeFile('tokens.json', JSON.stringify(tokens), function(){
	      	console.log("Tokens saved to tokens.json");
	      	process.exit();
	      });
	    });
	});
});