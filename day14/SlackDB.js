/**
 * 
 */
var express = require('express');
var sqlite3 = require('sqlite3').verbose();


var fs = require('fs');
var filename = 'slack_app.db';
var dbexists = false;
try {
    fs.accessSync(filename);
    dbexists = true;
} catch (ex) {
    dbexists = false;
}
var db = new sqlite3.Database(filename);

function createSlackTables(db){

	
	if (!dbexists) {
	    db.serialize(function() {
	        var createUserTableSql = "CREATE TABLE IF NOT EXISTS USER " +
	                       "(USERNAME        CHAR(25)    PRIMARY KEY     NOT NULL," +
	                       " FIRSTNAME           CHAR(50)                    NOT NULL, " +
	                       " LASTNAME           CHAR(50)                    NOT NULL, " +
	                       " PASSWORD       CHAR(50)                    NOT NULL, " +
	                       " EMAIL           CHAR(50)                    NOT NULL, " +
	                       " DATE          TEXT        NOT NULL)"; 
	        
	        var createTeamTableSql = "CREATE TABLE IF NOT EXISTS TEAM " +
	                    "(TEAMNAME        CHAR(25)    NOT NULL," +
	                    " DESCR         CHAR(140)  , " + 
	                    " DATE          TEXT        NOT NULL)"; 
	        
	        var createTeamUserTableSql = "CREATE TABLE IF NOT EXISTS TEAMUSER " +
	        "(TEAMNAME        CHAR(25)    NOT NULL," +
	        "USERNAME        CHAR(25)    NOT NULL," +
	        " DESCR         CHAR(140)  , " + 
	        " DATE          TEXT        NOT NULL)"; 
	        
	        var createChannelTableSql = "CREATE TABLE IF NOT EXISTS CHANNEL " +
	                    "(CHANNELNAME        CHAR(25)    NOT NULL," +
	                    "TEAMNAME        CHAR(25)    NOT NULL," +
	                    " PUBLIC_FLAG    CHAR(1)   NOT NULL, "+
	                    " DATE          TEXT        NOT NULL)"; 
	        
	        var createChannelChatTableSql = "CREATE TABLE IF NOT EXISTS CHANNEL_CHAT " +
	        "(CHANNELNAME        CHAR(25)    NOT NULL," +
	        " SENDER    CHAR(25)   NOT NULL, "+
	        " MESSAGE    CHAR(200)   NOT NULL, "+
	        " DATE          TEXT        NOT NULL)"; 
	        
	        var createDirectChatTableSql = "CREATE TABLE IF NOT EXISTS DIRECT_CHAT " +
	        "( SENDER       CHAR(25)    NOT NULL," +
	        " RECIEVER    CHAR(25)   NOT NULL, "+
	        " MESSAGE    CHAR(200)   NOT NULL, "+
	        " DATE          TEXT        NOT NULL)"; 
	        
	        //Y, public; n, private
	        db.run(createUserTableSql);
	        db.run(createTeamTableSql);
	        db.run(createTeamUserTableSql);
	        db.run(createChannelTableSql);
	        db.run(createChannelChatTableSql);
	        db.run(createDirectChatTableSql);
	        console.log ('create tables done.');
	
	    });
	}
}
	//end function createSlackTables

function insertDummyData (db){
	
    var insertUserSql = "INSERT INTO USER (USERNAME, FIRSTNAME,LASTNAME, PASSWORD," +
	"EMAIL, DATE) " +
"VALUES ('shuvo','Shuvo', 'Ahmed','shuvopassword','shuvo@ssa.org','2016-08-05 12:45:00')," +
       "('john',     'john','Moinuddin',    'johnpassword','john@ssa.org','2016-08-05 12:45:00')," +
       "('charles','Charles','Walsek',   'charlespassword','3@ssa.org','2016-08-05 12:45:00')," +
       "('beiying','Beiying','Chen',     'beiyingpassword','5@ssa.org','2016-08-05 12:45:00')," +
       "('swarup',  'Swarup','Khatri',    'swarup','6@ssa.org','2016-08-05 12:45:00');"; 
db.run(insertUserSql); 

var insertTeamSql = "INSERT INTO TEAM (TEAMNAME, DESCR, DATE) " +
	"VALUES ('Wonder_Team','Wonderful Team','2016-08-05 12:45:00');"; 
db.run(insertTeamSql);
    
var insertTeamUserSql = "INSERT INTO TEAMUSER (TEAMNAME, USERNAME, DESCR, DATE) " +
 "VALUES ('Wonder_Team','shuvo',   'empty ','2016-08-05 12:45:00'), " +
        "('Wonder_Team','beiying',   'john in the team ','2016-08-05 12:45:00'), "+
"('Wonder_Team1','john',   'john in the team ','2016-08-05 12:45:00');";
"('Wonder_Team1','xuemei',   'john in the team ','2016-08-05 12:45:00');";

db.run(insertTeamUserSql);

var insertChannelTableSql = "INSERT INTO CHANNEL (CHANNELNAME, TEAMNAME, PUBLIC_FLAG, DATE) " +
"VALUES ('B_channel','Wonder_Team',   'Y','2016-08-05 12:45:00'), " +
" ('C_channel','Wonder_Team',   'Y','2016-08-05 12:45:00'), " +
" ('D_channel','Wonder_Team1',   'Y','2016-08-05 12:45:00'), " +
"('A_channel',    'Wonder_Team1',   'N','2016-08-05 12:45:00');";

db.run(insertChannelTableSql);
//console.log("insertChannelTableSql="+insertChannelTableSql);

var insertChannelChatSql =  "INSERT INTO  CHANNEL_CHAT (CHANNELNAME, SENDER , MESSAGE , DATE ) "+
" values "+
"( 'A_channel', 'john', 'Hello 1', '2016-08-05 12:45:00'), " +
"( 'A_channel', 'xuemei', 'Hello 2', '2016-08-05 12:45:00'), " +
 "( 'A_channel', 'beiying', 'Hello 3', '2016-08-05 12:45:00'); "

db.run(insertChannelChatSql);
//db.each("SELECT CHANNELNAME, TEAMNAME FROM CHANNEL", function(err, row) {
//console.log("row.CHANNELNAME: " + row.CHANNELNAME + " TEAMNAME="+TEAMNAME);
//});
}

exports.insertTeam = function  (db, teamName, descr){
	
	 var insertTeamSql = "INSERT INTO TEAM (TEAMNAME, DESCR, DATE) " +
     "VALUES (" + teamName + "," + descr +",'2016-08-05 12:45:00');";
	 
  db.run(insertTeamSql);
  
}

exports.insertTeamUser = function  (db, teamName, userName, descr){
	
	 var insertTeamUserSql = "INSERT INTO TEAMUser (TEAMNAME, USERNAME, DESCR, DATE) " +
    "VALUES (" + teamName + "," +userName +","+ descr +",'2016-08-05 12:45:00');";
	 
 db.run(insertTeamUserSql);
 
}

exports.insertChannel = function  (db, ChannelName, teamName, publicFlag){
	
	 var insertChannelSql = "INSERT INTO CHANNEL (CHANNELNAME, TEAMNAME, PUBLIC_FLAG, DATE) " +
    "VALUES ('" + ChannelName + "','" + teamName +"', '"+ publicFlag + "','2016-08-05 12:45:00');";
	 
 db.run(insertChannelSql);
 
  
}


exports.insertChannelChat = function  (db, message, toChannel, fromUser, today) {
	
	 var insertChannelChatSql = "INSERT INTO CHANNEL_CHAT (CHANNELNAME, SENDER, MESSAGE, DATE) " +
    "VALUES ('" + toChannel + "','" + fromUser +"', '"+ message + "','" + today + "');";
	 
	 return new Promise(function(resolve, reject) {
			db.run(insertChannelChatSql, function(err){
				if (err) {
					reject(err);
				}
				resolve(); 
			});
 
	 });
 
  
}

exports.createTeam = function  (db, name, desc, user, today) {
	
	 var insertTeamSql = "INSERT INTO TEAM (TEAMNAME, DESCR, CREATED_USER, DATE) " +
    "VALUES ('" + name + "','" + desc +"', '" + user + "','" + today +  "');";
	 console.log("insertTeamSql="+insertTeamSql);
	 return new Promise(function(resolve, reject) {
			db.run(insertTeamSql, function(err){
				if (err) {
					reject(err);
				}
				resolve(); 
			});
 
	 });
 
  
}
	
var globleData=[];
exports.getChannels = function (db, username) { 

	getChannels1 (db,username);
	}; 
	
	function callback (err, jsonString) {
	    if (err) {
	    	 console.log('getChannelsPrivate1, error '+err);
	    }
	    else{
	    console.log('getChannelsPrivate1='+jsonString);
	    }
	  //  return jsonString;
	    
	};
	
function getChannelsPrivateWrapper(db, username) {
 
	 var myData =[];
	 console.log('getChannelsPrivateWrapper 0');
	// getChannelsPrivate (db, username,myData, callback(err,jsonString ) );
	 getChannelsPrivate (db, username,myData, function (err, jsonString) {
		    if (err) {
		    }
		    else {
		    console.log('in getChannelsPrivateWrapper='+jsonString);
		    myData = jsonString;
		    }
		    return myData;
		});
	 console.log ('myData='+myData);
	return myData;
}

function getChannelsPrivate (db, username,myData, callback ) {
	
	 
	var query = "SELECT CHANNEL.CHANNELNAME "+
	" from CHANNEL inner join TEAMUSER on CHANNEL.TEAMNAME= TEAMUSER.TEAMNAME "+
	" and TEAMUSER.username ='" + username +
	 "' order by CHANNELNAME ASC";
		
	
	//var dataNew = [];
	   var data = [];
	   
	    db.serialize(function() {
	        db.each(
	            query, 
	            function(err, row) {
	            	data.push(row.CHANNELNAME);
               		console.log ('get channel=' +row.CHANNELNAME);
	            },
	            function (err) {
	               // callBack(err, JSON.stringify(data));
	            	 callback(err, data);
	            	 console.log ('in callBack='+data);
	            	 myData =  data;
	                //return data;
	            }
	        );
	    });
	    console.log ('data='+data);
	  //  return ;
	    
	  
	}

/*
exports.channelJSONPromisePublic =  function (db, username){
	return getChannels2 (db, username);
	//return channelJSONPromise(db,username);
};

exports.channelChatJSONPromisePublic =  function (db, channelName){
	return getChannelChat (db, channelName);
	//return channelJSONPromise(db,username);
};
*/
exports.getSlackUser= function getSlackUser(db, UserName) {
		console.log("Entering getSlackUser");
		var query = "SELECT FIRSTNAME,LASTNAME,PASSWORD,EMAIL,DATE FROM USER "
             + "  WHERE USERNAME = '" + UserName + "'";
console.log(query);
        var users = [];
		
		return new Promise((resolve, reject) => {     
        db.serialize(function() {
			console.log("Entering db.serialize");
            db.each(
                query,
                function(err, row) {
					console.log("  Entering func1");
                    if (err) {
                        reject(err);
                    } else {  
						console.log("  push func1");
						var user = {};
						user.username  = UserName;
						user.firstname = row.FIRSTNAME;
						user.lastname = row.LASTNAME;
						user.password = row.PASSWORD;
						user.email = row.EMAIL;
						user.date = row.DATE;
                        users.push(user);						
                     }
                },
                 function (err, nRows) {
					console.log("  Entering func2");
                    if (err) {
                        reject(err);
                    } else {                        
						console.log("  resolve func2 rows:" + nRows);
						console.log("  resolve func2:" + users);
						resolve(JSON.stringify(users));
						//resolve(users);
                    }
                }
            );
			});
		});	
}

exports.channelJSONPromisePublic = function (db, username){
	//function channelJSONPromise(db, username) {
	var query = "SELECT CHANNEL.CHANNELNAME, CHANNEL.TEAMNAME "+
	//	var query = "SELECT CHANNEL.CHANNELNAME "+
	" from CHANNEL inner join TEAMUSER on CHANNEL.TEAMNAME= TEAMUSER.TEAMNAME "+
	" and TEAMUSER.username ='" + username +
	 "' order by CHANNELNAME ASC";
	
    var channels = [];
    return new Promise((resolve, reject) => {
        db.serialize(function() {
            db.each(
                query, 
                function(err, row) {
                	if (err){
                		reject(err);
                	}
                	else{
                		//channels.push(row.CHANNELNAME);
                		channels.push(row);
                	}
                },
                function (err) {
                	if (err){
                		reject(err);
                	}
                	else{
                		resolve (JSON.stringify(channels));	
                		//resolve (channels);
                	}
                    
                }
            );
        });

    });
    
  
}
	
	//function channelChatJSONPromise(db, channelName) {
exports.channelChatJSONPromisePublic = function (db, channelName){
		var query = "SELECT CHANNELNAME, SENDER , MESSAGE , DATE "+
		//	var query = "SELECT CHANNEL.CHANNELNAME "+
		" from CHANNEL_CHAT where CHANNELNAME = '" + channelName +"'" ;
		 console.log ('in channelChatJSONPromise ;')
	    var channels = [];
	    return new Promise((resolve, reject) => {
	        db.serialize(function() {
	            db.each(
	                query, 
	                function(err, row) {
	                	if (err){
	                		reject(err);
	                	}
	                	else{
	                		//channels.push(row.CHANNELNAME);
	                		channels.push(row);
	                	}
	                },
	                function (err) {
	                	if (err){
	                		reject(err);
	                	}
	                	else{
	                		resolve (JSON.stringify(channels));	
	                		//resolve (channels);
	                	}
	                    
	                }
	            );
	        });

	    });
	    
	  
	}
	
	// get private channels
	exports.privateChannelsJSONPromisePublic = function (db, userName){
		var query = "SELECT SENDER, RECIEVER, MESSAGE , DATE "+
		" from DIRECT_CHAT where SENDER = '" + userName +"' OR RECIEVER = '" + userName + 
		"' order by DATE asc" ;

	    var channels = [];
	    return new Promise((resolve, reject) => {
	        db.serialize(function() {
	            db.each(
	                query, 
	                function(err, row) {
	                	if (err){
	                		reject(err);
	                	}
	                	else{
	                		channels.push(row);
	                	}
	                },
	                function (err) {
	                	if (err){
	                		reject(err);
	                	}
	                	else{
	                		resolve (JSON.stringify(channels));	
	                	}
	                    
	                }
	            );
	        });

	    });	    
	  
	}
	
	exports.directMessagesJSONPromisePublic = function (db, userName, channelName){
		var query = "SELECT SENDER, RECIEVER, MESSAGE , DATE "+
		" from DIRECT_CHAT where SENDER = '" + userName +"' and RECIEVER = '" + channelName + "'" + 
		" UNION SELECT SENDER, RECIEVER, MESSAGE , DATE " + 
		" from DIRECT_CHAT where SENDER = '" + channelName +"' and RECIEVER = '" + userName + "'" + 
		" order by DATE asc" ;

	    var directMessages = [];
	    return new Promise((resolve, reject) => {
	        db.serialize(function() {
	            db.each(
	                query, 
	                function(err, row) {
	                	if (err){
	                		reject(err);
	                	}
	                	else{
	                		directMessages.push(row);
	                	}
	                },
	                function (err) {
	                	if (err){
	                		reject(err);
	                	}
	                	else{
	                		resolve (JSON.stringify(directMessages));	
	                	}
	                    
	                }
	            );
	        });

	    });	    
	  
	}
	
	function getChannelChat (db, channelName) {
		//var data = function () {
		console.log('in channel_chat, ');
			return channelChatJSONPromise(db,channelName).then(
					(val) =>{
						
						console.log('channel_chat, '+ val);
					//	return channels;
					}
					);
		};
	
	function getChannels2 (db, username) {
		//var data = function () {
			return channelJSONPromise(db,username).then(
					(val) =>{
						
						console.log('channels, '+ val);
					//	return channels;
					}
					);
		};
			


	//createSlackTables(db);
	//insertDummyData (db);
	
//getChannels2 (db, 'john');
//getChannelChat (db, 'A_channel');
