/**
 * 
 */
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var filename = 'scratch.db';
var dbexists = false;
try {
    fs.accessSync(filename);
    dbexists = true;
} catch (ex) {
    dbexists = false;
}
var db = new sqlite3.Database('scratch.db');
if (!dbexists) {
    db.serialize(function() {
        var createUserTableSql = "CREATE TABLE IF NOT EXISTS USER " +
                       "(USERID         CHAR(25)    PRIMARY KEY     NOT NULL," +
                       " NAME           CHAR(50)                    NOT NULL, " + 
                       " PASSWORD       CHAR(50)                    NOT NULL)"; 
        var createTweetTableSql = "CREATE TABLE IF NOT EXISTS TWEET " +
                    "(USERID        CHAR(25)    NOT NULL," +
                    " TWEET         CHAR(140)   NOT NULL, " + 
                    " DATE          TEXT        NOT NULL)"; 
        var createFollowerTableSql = "CREATE TABLE IF NOT EXISTS FOLLOWER " +
                    "(USERID        CHAR(25)    NOT NULL," +
                    " FOLLOWERID    CHAR(140)   NOT NULL)"; 
        db.run(createUserTableSql);
        db.run(createTweetTableSql);
        db.run(createFollowerTableSql);
        var insertUserSql = "INSERT INTO USER (USERID, NAME, PASSWORD) " +
            "VALUES ('shuvo',   'Shuvo Ahmed',      'shuvopassword')," +
                   "('abu',     'Abu Moinuddin',    'abupassword')," +
                   "('charles', 'Charles Walsek',   'charlespassword')," +
                   "('beiying', 'Beiying Chen',     'beiyingpassword')," +
                   "('swarup',  'Swarup Khatri',    'swarup');"; 
        
        var insertFollowerSql = "INSERT INTO FOLLOWER (USERID, FOLLOWERID) " +
           "VALUES ('shuvo', 'abu')," +
                  "('abu', 'swarup')," +
                  "('abu', 'charles')," +
                  "('beiying', 'shuvo');";
                
        var insertTweetSql = "INSERT INTO TWEET (USERID, TWEET, DATE) " +
             "VALUES ('shuvo',      'Welcome to Tweeter Clone',                     '2016-08-05 12:45:00'), " +
                    "('abu',        'Tweet by Abu',                                 '2016-08-05 12:46:00'), " +
                    "('abu',        'Lets do Node.js',                              '2016-08-08 12:46:00'), " +
                    "('abu',        'Lunch Time!',                                  '2016-08-08 12:30:00'), " +
                    "('abu',        'We are in 2-nd week of boot camp training!',   '2016-08-08 08:30:00'), " +
                    "('shuvo',      'SQLite is easy configuration!',                '2016-08-05 09:30:00'), " +
                    "('shuvo',      'Rio Olympic!',                                 '2016-08-05 09:30:00'), " +
                    "('shuvo',      'Welcome to 2nd week of boot camp...',          '2016-08-08 08:30:00'), " +
                    "('charles',    'SQLite is cool!',                              '2016-08-05 11:30:00'), " +
                    "('charles',    'Not bad for a Mainframe developer...',         '2016-08-08 09:30:00'), " +
                    "('charles',    'Having fun with HTML / CSS!',                  '2016-08-05 11:30:00'), " +
                    "('charles',    'Github!',                                      '2016-08-05 11:30:00'), " +
                    "('beiying',    'Twitter - Cloned!',                            '2016-08-08 13:30:00'), " +
                    "('swarup',     'Tweet, tweet!',                                '2016-08-05 11:30:00'), " +
                    "('shuvo',      'First week of boot camp complete!',            '2016-08-05 16:47:00');"; 
      
        db.run(insertFollowerSql);
        db.run(insertUserSql);
        db.run(insertTweetSql);
        db.each("SELECT * FROM TWEET", function(err, row) {
            console.log(row.USERID + ": " + row.TWEET);
        });
    });
}
 
function twittesJSONPromise(userId) {
//	 var query = "SELECT USERID, FOLLOWERID FROM FOLLOWER "
//        + "  WHERE USERID = '" + userId + "'";
//	 var query = "Select a.userid as userid, t.tweet as tweet, a.followerid as FOLLOWERID"+
//	 		"from FOLLOWER a, tweet t "
//		 +" where a.userid = t.userid and a.USERID = '" + userId + "'";
		 
var query = "SELECT tweet.TWEET FROM TWEET " +
"where tweet.USERID = '" + userId + "' order by USERID";
		 
   var followers = [];
   return new Promise((resolve, reject) => {
       db.serialize(function() {
           db.each(
               query, 
               function(err, row) {
               	if (err){
               		reject(err);
               	}
               	else{
               		
               	
               		followers.push('tweet='+row.TWEET);
               	}
               },
               function (err) {
               	if (err){
               		reject(err);
               	}
               	else{
               		resolve (JSON.stringify(followers));	
               	}
                   
               }
           );
       });

   });
   
 
}

function followedTwittesJSONPromise(userId) {
//	 var query = "SELECT USERID, FOLLOWERID FROM FOLLOWER "
//         + "  WHERE USERID = '" + userId + "'";
//	 var query = "Select a.userid as userid, t.tweet as tweet, a.followerid as FOLLOWERID"+
//	 		"from FOLLOWER a, tweet t "
//		 +" where a.userid = t.userid and a.USERID = '" + userId + "'";
		 
var query = "SELECT FOLLOWER.USERID, FOLLOWER.FOLLOWERID, tweet.TWEET, tweet.date DATE FROM FOLLOWER" +
	 //var query = "SELECT tweet.TWEET FROM FOLLOWER" +
 " inner join tweet on FOLLOWER.userid = tweet.userid "
  + "where tweet.USERID = '" + userId + "' order by tweet.date desc, FOLLOWER.USERID ASC";
		 
    var followers = [];
    return new Promise((resolve, reject) => {
        db.serialize(function() {
            db.each(
                query, 
                function(err, row) {
                	if (err){
                		reject(err);
                	}
                	else{
                		var arrayData = ['Follower=' + row.FOLLOWERID
                         				,'Userid=' + row.USERID
                         				,'Tweet=' + row.TWEET
                         				,'Date=' + row.DATE
                         		];
                         		
                         		followers.push (arrayData);
//                		followers.push('Follower='+row.FOLLOWERID);
//                		followers.push('Userid='+row.USERID);
//                		followers.push('Tweet='+row.TWEET);
//                		followers.push('Date='+row.DATE);
                	}
                },
                function (err) {
                	if (err){
                		reject(err);
                	}
                	else{
                		resolve (JSON.stringify(followers));	
                		
                	}
                    
                }
            );
        });

    });
    
  
}


//followedTwittesJSONPromise('abu').then(
//	    (val) => {
//	    	 console.log('***followedTwittesJSONPromise.then ='+ val);
//	    	 parseJson (val);
//	       return val;
//	    },
//	    (err) => {
//	        console.log(err);
//	    }
//	)
	
function getTweets(userid) {
	return twittesJSONPromise(userid).then(
		    (val) => {
		    	 console.log('twittesJSONPromise.then ='+ val);
		    	
		       return val;
		    },
		    (err) => {
		        console.log(err);
		    }
		)
		
		//console.log ('tweetsDetails='+tweetsDetails);
}
function getFollowedTweets(userid) {
	return followedTwittesJSONPromise(userid).then(
		    (val) => {
		    	 console.log('followedTwittesJSONPromise.then ='+ val);
		    	
		       return val;
		    },
		    (err) => {
		        console.log(err);
		    }
		)
		
		//console.log ('tweetsDetails='+tweetsDetails);
}

exports.tweet = function(req, res){
	var str = '<B>***Tweets**</B>';
	var userid = req.params.userid;
//	var tweets =  getFollowedTweets(req.params.userid );
	// res.send(str+ getFollowedTweets(req.params.userid ).toString());
	
	twittesJSONPromise(userid).then(
		    (val) => {
		    	 console.log('twittesJSONPromise.then ='+ val);
		    	// tweetsDetails = val;
		    	 //res.send(str + userid + '<p>'+ val);
		    	 res.send (parseJson(val));
		     //  return val;
		    },
		    (err) => {
		        console.log(err);
		    }
		)
		
	 
	};
	
exports.followedTweet = function(req, res){
	var str = '<B>***Tweets**</B>';
	var userid = req.params.userid;
//	var tweets =  getFollowedTweets(req.params.userid );
	// res.send(str+ getFollowedTweets(req.params.userid ).toString());
	
	followedTwittesJSONPromise(userid).then(
		    (val) => {
		    	 console.log('followedTwittesJSONPromise.then ='+ val);
		    	// tweetsDetails = val;
		    	 res.send (buildDataString(val));
		    	 //res.send(val);
		     //  return val;
		    },
		    (err) => {
		        console.log(err);
		    }
		)
		
	 
	};
	
	function buildDataString(objJsonString) {
		var buildTweetStr = '';
		console.log('in parseJson, ' + objJsonString);
		var jsonObj = JSON.parse(objJsonString);//(JSON.parse(objJsonString)).split(',');
		console.log('length='+jsonObj.length);
		buildTweetStr += '<table border=1>';
		for (var row = 0; row < jsonObj.length; row++) {
			
			//var rowData = jsonObj[row].toString().split(",");
			var rowData = jsonObj[row];
			//loop columns
			buildTweetStr += '<tr>';
			for (var colCount=0; colCount < rowData.length; colCount++ ) {
				//console.log('in for 2 loop, ' + rowData[colCount]);
				var colData = rowData[colCount].split("=");
				var keyName = colData[0];
				var keyVal = colData[1];
				
				buildTweetStr +='&ensp;&ensp;&ensp;<th>' + colData[0]+ ':</th><th>'+ colData[1]+'</th>';
			}
			buildTweetStr += '</tr>';
			
		}
		
		//console.log ("buildTweetStr="+buildTweetStr);
		return buildTweetStr;
		//arr = arr.map(function (val) { return +val + 1; });
	}
	function parseJson(objJsonString) {
		var buildTweetStr = '';
		console.log('in parseJson, ' + objJsonString);
		var jsonObj = JSON.parse(objJsonString);//(JSON.parse(objJsonString)).split(',');
		console.log('length='+jsonObj.length);
		for (var i = 0; i < jsonObj.length; i++) {
			console.log('array jsonObj=' +jsonObj[i]);
			var arr = jsonObj[i].toString().split("=");
			buildTweetStr +='<li><b>' + arr[0]+ '</b>:'+ arr[1]+'</li>';
		}
		
		console.log (buildTweetStr);
		return buildTweetStr;
		//arr = arr.map(function (val) { return +val + 1; });
	}
	//db.close();