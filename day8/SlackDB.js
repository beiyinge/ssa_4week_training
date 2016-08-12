/**
 * 
 */
var express = require('express');
var sqlite3 = require('sqlite3').verbose();

var Q = require ('q');

var fs = require('fs');
var filename = 'slack_test.db';
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
       "('abu',     'Abu','Moinuddin',    'abupassword','abu@ssa.org','2016-08-05 12:45:00')," +
       "('charles','Charles','Walsek',   'charlespassword','3@ssa.org','2016-08-05 12:45:00')," +
       "('beiying','Beiying','Chen',     'beiyingpassword','5@ssa.org','2016-08-05 12:45:00')," +
       "('swarup',  'Swarup','Khatri',    'swarup','6@ssa.org','2016-08-05 12:45:00');"; 
db.run(insertUserSql); 

var insertTeamSql = "INSERT INTO TEAM (TEAMNAME, DESCR, DATE) " +

"VALUES ('Wonder_Team','Wonderful Team','2016-08-05 12:45:00');"; 
db.run(insertTeamSql);
    
var insertTeamUserSql = "INSERT INTO TEAMUSER (TEAMNAME, USERNAME, DESCR, DATE) " +
 "VALUES ('Wonder_Team','shuvo',   'empty ','2016-08-05 12:45:00'), " +
        "('Wonder_Team','beiying',   'abu in the team ','2016-08-05 12:45:00'), "+
"('Wonder_Team1','abu',   'abu in the team ','2016-08-05 12:45:00');";

db.run(insertTeamUserSql);

var insertChannelTableSql = "INSERT INTO CHANNEL (CHANNELNAME, TEAMNAME, PUBLIC_FLAG, DATE) " +
"VALUES ('B_channel','Wonder_Team',   'Y','2016-08-05 12:45:00'), " +
"('A_channel',    'Wonder_Team1',   'N','2016-08-05 12:45:00');";

db.run(insertChannelTableSql);
console.log("insertChannelTableSql="+insertChannelTableSql);

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

exports.channelJSONPromisePublic =  function (db, username){
	return getChannels2 (db, username);
	//return channelJSONPromise(db,username);
};
//exports.channelJSONPromisePublic = function (db, username){
	
	
	function channelJSONPromise(db, username) {
	var query = "SELECT CHANNEL.CHANNELNAME "+
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
                		channels.push(row.CHANNELNAME);
                	}
                },
                function (err) {
                	if (err){
                		reject(err);
                	}
                	else{
                		//resolve (JSON.stringify(channels));	
                		resolve (channels);
                	}
                    
                }
            );
        });

    });
    
  
}
var fetchData = function() {
	  var goFetch = function(users) {
	    return http().then(function(data) {
	      users.push(data.user);
	      if(data.more) {
	        return goFetch(users);
	      } else {
	        return users;
	      }
	    });
	  }

	  return goFetch([]);
	};
	
	function getChannels2 (db, username) {
		var data = function (channels) {
			return channelJSONPromise(db,username).then(
					(val) =>{
						 for (var i=0; i< val.length; i++){
						 		//console.log('in for loop, '+ val[i]+'*');
							 channels.push(val[i]);
						 		 
						 	 }
						console.log('channels, '+ channels);
						return channels;
					}
					);
		}
		
		return data([]);
		//Q.async (function* (db, username){ 
			//return channelJSONPromise(db,username).then(
			
	};

	//createSlackTables(db);
	//insertDummyData (db);
	
	getChannels2 (db, 'abu');