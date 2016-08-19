/**
 * Module dependencies.
 */
//var db = require('./tweets.js')
var express = require('express'),
    // , routes = require('./routes')
    // , user = require('./routes/user')
    http = require('http'),
    path = require('path'),
    slackdb = require('./SlackDB.js');



var sqlite3 = require('sqlite3').verbose();

var filename = 'slack_app.db';
var db = new sqlite3.Database(filename);


var app = express();
app.use(express.static('html'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());

// all environments
app.set('port', process.env.PORT || 8080);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));

// development only
//if ('development' == app.get('env')) {
// // app.use(express.errorHandler());
//}
//
//app.get('/', routes.index);
//app.get('/users', user.list);


app.get('/', getDefaultIndex);
app.get('/:UserName', getSlackUserID);

app.get('/channel/:userName', getChannelByUser);
app.get('/channelChats/:channelName', getChannelChatByChannelName);
app.get('/direct/:userName', getPrivateChannelsByUserName);
app.get('/message/:channelName/:userName', getDirectMessages);


app.post('/message/', function(req, res) {
    var message = req.body.message;
    var channel = req.body.channel;
    var user = req.body.user;

    res.send('done');

});

//app.get('/tweet/:userid', followedTweet.tweet);

//app.get('/followedtweet', getFollowedTweets('abu'));


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});


function getSlackUserID(req, res) {
    var str = '<B>***getSlackUserID**</B>';
    var UserName = req.params.UserName;
    //		var tweets =  getFollowedTweets(req.params.userid );
    // res.send(str+ getFollowedTweets(req.params.userid ).toString());
    console.log('in getSlackUserID, username=' + UserName);
    slackdb.getSlackUser(db, UserName).then( //done);
        function(val) {
            console.log('****getSlackUserID, val ' + val + '*');
            //json
            res.send(val);

        },
        function(err) {
            done(err);
        }


    )
};


function getChannelByUser(req, res) {
    var str = '<B>***getChannelByUser**</B>';
    var username = req.params.userName;
    //	var tweets =  getFollowedTweets(req.params.userid );
    // res.send(str+ getFollowedTweets(req.params.userid ).toString());
    console.log('in channelJSONPromisePublic, username=' + username);


    res.cookie("userName", username);
    slackdb.channelJSONPromisePublic(db, username).then( //done);
        function(val) {
            console.log('****channelJSONPromisePublic, val=' + val + '*');

            res.send(val);

        },
        function(err) {
            done(err);
        }


    )
};




function getChannelChatByChannelName(req, res) {
    var str = '<B>***getChannelChatByChannelName**</B>';
    var channelName = req.params.channelName;
    //		var tweets =  getFollowedTweets(req.params.userid );
    // res.send(str+ getFollowedTweets(req.params.userid ).toString());
    console.log('in getChannelChatByChannelName, channelName=' + channelName);
    slackdb.channelChatJSONPromisePublic(db, channelName).then( //done);
        function(val) {
            console.log('****channelChatJSONPromisePublic, val ' + val + '*');
            //json
            res.send(val);

        },
        function(err) {
            done(err);
        }


    )
};

function getPrivateChannelsByUserName (req, res){
	var userName = req.params.userName;
	
	slackdb.privateChannelsJSONPromisePublic(db, userName).then(
		function (val) {
			console.log('****privateChannelsJSONPromisePublic, val=' + val + '*');
			res.send(val);
		},
		function (err) {
			console.log('****privateChannelsJSONPromisePublic, err=' + err + '*');
			done(err);
		}
		
	)
};

function getDirectMessages(req, res) {		
	var channelName = req.params.channelName;
	var userName = req.params.userName;
	slackdb.directMessagesJSONPromisePublic(db, channelName, userName).then(
		function (val) {
			console.log('****directMessagesJSONPromisePublic, val=' + val +"'");
			res.send(val);
		},
		function (err) {
			done(err);				
		}
	)

};

function getDefaultIndex(req, res) {
    console.log('in default.');
    var _dirname = 'C:\\project\\ssa4_week_training\\day8\\slackclone\\html';
    res.sendFile(_dirname + '\\Welcome.html');
}





function sendMessage(req, res) {
    console.log('entering SlackCloneApp.js sendMessage(req, res)');
    //var _dirname = 'C:\\project\\ssa4_week_training\\day8\\slackclone\\html';
    //res.sendFile( _dirname+ '\\Welcome.html');
}
