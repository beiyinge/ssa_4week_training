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
						" CREATED_USER  CHAR(25)  , " + 
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
	        " MESSAGE    CHAR(200)   , "+
	        " DATE          TEXT        NOT NULL, "+
			" FileName   VARCHAR(100)        )"; 
	        
	        var createDirectChatTableSql = "CREATE TABLE IF NOT EXISTS DIRECT_CHAT " +
	        "( SENDER       CHAR(25)    NOT NULL," +
	        " RECIEVER    CHAR(25)   NOT NULL, "+
	        " MESSAGE    CHAR(200)   , "+
	        " DATE          TEXT        NOT NULL, "+
			" FileName   VARCHAR(100)        )"; 
	        
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
       "('josephine',     'josephine','benedict',    'josepassword','john@ssa.org','2016-08-05 12:45:00')," +
       "('charles','Charles','Walsek',   'charlespassword','3@ssa.org','2016-08-05 12:45:00')," +
       "('beiying','Beiying','Chen',     'beiyingpassword','5@ssa.org','2016-08-05 12:45:00')," +
       "('xuemei',  'Xuemei','Li',    'xuemeipassword','6@ssa.org','2016-08-05 12:45:00');"; 
db.run(insertUserSql); 
	        console.log ('Done, insertUserSql='+insertUserSql);
var insertTeamSql = "INSERT INTO TEAM (TEAMNAME, DESCR, CREATED_USER, DATE) " +
	"VALUES ('Wonder_Team','Wonderful Team', 'beiying', '2016-08-05 12:45:00')," +
	"('Wonder_Team1','Wonderful Team 1','beiying', '2016-08-05 12:45:00');";
db.run(insertTeamSql);
    console.log ('Done, insertTeamSql='+insertTeamSql);
	
var insertTeamUserSql = "INSERT INTO TEAMUSER (TEAMNAME, USERNAME, DESCR, DATE) " +
 "VALUES ('Wonder_Team','shuvo',   'empty ','2016-08-05 12:45:00'), " +
        "('Wonder_Team','beiying',   'join the team ','2016-08-05 12:45:00'), "+
		  "('Wonder_Team','josephine',   'join the team ','2016-08-05 12:45:00'), "+
    "('Wonder_Team','charles',   'join the team ','2016-08-05 12:45:00'), " +
    "('Wonder_Team','xuemei',   'join the team ','2016-08-05 12:45:00'), " + 
		  "('Wonder_Team1','charles',   'join the team ','2016-08-05 12:45:00'), " +
"('Wonder_Team1','xuemei',   'join the team ','2016-08-05 12:45:00');";

db.run(insertTeamUserSql);
console.log ('Done, insertTeamUserSql='+insertTeamUserSql);

var insertChannelTableSql = "INSERT INTO CHANNEL (CHANNELNAME, TEAMNAME, PUBLIC_FLAG, DATE) " +
"VALUES ('A_channel','Wonder_Team',   'Y','2016-08-05 12:45:00'), " +
" ('C_channel','Wonder_Team',   'Y','2016-08-05 12:45:00'), " +
" ('D_channel','Wonder_Team1',   'Y','2016-08-05 12:45:00'), " +
"('E_channel',    'Wonder_Team1',   'N','2016-08-05 12:45:00');";

db.run(insertChannelTableSql);
console.log ('Done, insertChannelTableSql='+insertChannelTableSql);

var insertChannelChatSql =  "INSERT INTO  CHANNEL_CHAT (CHANNELNAME, SENDER , MESSAGE , DATE,FileName ) "+
" values " +
"( 'A_channel', 'charles', 'am working on saving messages.', '2016-08-05 12:45:00',Null), " +
"( 'A_channel', 'xuemei', 'We are planing to use js-beatutify to format files.', '2016-08-05 12:45:00','Tulips.jpg'), " +
 "('A_channel','xuemei','Let''s use bootstrap to make UI pretty','2016-08-05 12:45:00',NULL), " +
 "('A_channel','beiying','I am working on creating team.','2016-08-05 12:45:00',NULL), " +
 "('A_channel','josephine','I am working mocha test scripts.','2016-08-19 14:08:08',Null), " +
 "('A_channel','xuemei','Thank you for taking care this josephine.','2016-08-19 14:10:08',NULL), " +
 "('A_channel','charles','New operator seperation is very important.','2016-08-19 14:14:53',NULL), " +
 "('C_channel','josephine','hello','2016-08-19 14:15:12','Koala.jpg'), " +
 "('A_channel','john','dependance Injection.','2016-08-19 14:22:54','Koala.jpg'), " +
 "('C_channel','charles','infrastralized data management infrastructure automation','2016-08-19 14:23:04',NULL), " +
 "('A_channel','josephine','angularjs unit testing','2016-08-19 14:33:32',NULL), " +
 "('C_channel','charles','Microservice is a subset of  SOA','2016-08-19 14:33:41',NULL), " +
 "('A_channel','john','OMG','2016-08-19 14:56:22',NULL), " +
 "('D_channel','charles','I am working on styles.','2016-08-19 14:56:37',NULL), " +
 "('A_channel','josephine','I am working on uploading a file.','2016-08-19 14:58:52',NULL), " +
 "('D_channel','john','Rapid application deployment.','2016-08-19 14:59:15',NULL), " +
 "('A_channel','charles','multiple platforms','2016-08-19 15:28:07',NULL), " +
 "('C_channel','josephine',' push out imagedocker tag nodejs-microservices your_dockerhub_user nodejs-microservices','2016-08-19 15:29:13',NULL), " +
 "('A_channel','charles','test individual classes in isolation','2016-08-19 15:38:27',NULL), " +
 "( 'A_channel', 'beiying', 'I agreed.', '2016-08-05 12:45:00',NULL); "

db.run(insertChannelChatSql);

console.log ('Done, insertChannelChatSql='+insertChannelChatSql);

var insertDirectChatSql = "INSERT INTO DIRECT_CHAT (SENDER,RECIEVER,MESSAGE,DATE,FileName) "+
 " VALUES " +
 " ('xuemei','beiying','github is cool','2016-08-02 12:45:00',NULL), " +
 " ('beiying','xuemei','learn git','2016-08-02 12:40:00',NULL), " +
 " ('josephine','xuemei','git clone','2016-08-02 12:48:00','Tulips.jpg'), " +
 " ('xuemei','josephine','I just pushed latest code, please pull.','2016-08-02 12:50:00',NULL), " +
 " ('charles','beiying','we are learning Angular JS.','2016-08-22 10:10:36',NULL), " +
 " ('beiying','charles','We can try to isntall docker toolbox on our windows 7','2016-08-22 10:10:47','Tulips.jpg'), " +
 " ('charles','beiying','Just tried, docker works now on my laptop.','2016-08-22 13:15:38',NULL); "
 
 db.run(insertDirectChatSql);
 
  console.log ('*****Done, insertDirectChatSql='+insertDirectChatSql);
  // db.each("SELECT CHANNELNAME, TEAMNAME FROM CHANNEL", function(err, row) {
  //console.log("row.CHANNELNAME: " + row.CHANNELNAME + " TEAMNAME="+TEAMNAME);
  // });
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

<<<<<<< HEAD
exports.insertUploadChannelChat = function  (db, message, toChannel, fromUser, today,filename) {
	
	 var insertUploadChannelChat = "INSERT INTO CHANNEL_CHAT (CHANNELNAME, SENDER, MESSAGE, DATE,FileName) " +
    "VALUES ('" + toChannel + "','" + fromUser +"', '"+ message + "','" + today +"','" + filename + "');";
	 
	 return new Promise(function(resolve, reject) {
			db.run(insertUploadChannelChat, function(err){
				if (err) {
					reject(err);
				}
				resolve(); 
			});
 
	 });
 
  
}


exports.insertDirectChat = function  (db, fromUser,toChannel,message, today) {
	
	 var insertDirectChat = "INSERT INTO DIRECT_CHAT (SENDER,RECIEVER,MESSAGE,DATE) " +
    "VALUES ('" + fromUser + "','" + toChannel +"', '"+ message + "','" + today + "');";
	 
	 return new Promise(function(resolve, reject) {
			db.run(insertDirectChat, function(err){
				if (err) {
					reject(err);
				}
				resolve(); 
			});
 
	 });
 
  
}

exports.insertUploadDirectChat = function  (db, fromUser,toChannel,message, today,filename) {
	
	 var insertuploadDirectChat = "INSERT INTO DIRECT_CHAT (SENDER,RECIEVER,MESSAGE,DATE,FileName) " +
    "VALUES ('" + fromUser + "','" + toChannel +"', '"+ message + "','" + today +"','" + filename + "');";
	 
	 return new Promise(function(resolve, reject) {
			db.run(insertuploadDirectChat, function(err){
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
=======
exports.insertDirectChat = function  (db, message, sender, receiver, today) {

	 var insertDirectChatSql = "INSERT INTO DIRECT_CHAT (SENDER, RECIEVER, MESSAGE, DATE) " +
    "VALUES ('" + sender + "','" + receiver +"', '"+ message + "','" + today + "');";
	 
 	 return new Promise(function(resolve, reject) {
			db.run(insertDirectChatSql, function(err){
 				if (err) {
 					reject(err);
 				}					
>>>>>>> 1c3c063be26451df12941e6a381d33e613acb3b1
				resolve(); 
			});
 
	 });
  
}



getTeam = function  (db, name) {
	
	 var getTeamSql = "SELECT TEAMNAME, DESCR, CREATED_USER, DATE FROM TEAM WHERE TEAMNAME='" + name + "';";
	 var teams = [];
	 console.log("getTeamSql="+getTeamSql);
	 return new Promise(function(resolve, reject) {
			db.each(getTeamSql, 
					function(err, row) {
	                	if (err){
	                		reject(err);
	                	}
	                	else{
	                		teams.push(row);
	                	}
	                },
	                function (err) {
	                	if (err){
	                		reject(err);
	                	}
	                	else{
	                		resolve(teams);
	                	}	                    
	                }
			)
	});
}

exports.createTeam = function  (db, name, desc, user, today) {
	
	return getTeam(db, name).then( 
        function(val) {
            console.log('****/getTeam/, val=' + val + '*' + ' for team: ' + name);
			
			if (val.length===0) {
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
			} else {
				return new Promise(function(resolve, reject){
					console.log("duplicate team name");
					reject("Team " + name + " already exists.");
				});
			}   
            

        },
        function(err) {
			return new Promise(function(resolve, reject){
				reject(err);
			});

        }

    );	
 
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
	
//	function channelChatJSONPromise(db, channelName) {
exports.channelChatJSONPromisePublic = function (db, channelName){
		var query = "SELECT CHANNELNAME, SENDER , MESSAGE , DATE,FileName "+
		//	var query = "SELECT CHANNEL.CHANNELNAME "+
		" from CHANNEL_CHAT where CHANNELNAME = '" + channelName +"'" ;
		 console.log ('in channelChatJSONPromise, ')
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
		var query = "SELECT SENDER, RECIEVER, MESSAGE , DATE,FileName "+
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
		var query = "SELECT SENDER, RECIEVER, MESSAGE , DATE,FileName "+
		" from DIRECT_CHAT where SENDER = '" + userName +"' and RECIEVER = '" + channelName + "'" + 
		" UNION SELECT SENDER, RECIEVER, MESSAGE , DATE,FileName " + 
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
		console.log('in channel_chat, ' + channelName);
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
	

