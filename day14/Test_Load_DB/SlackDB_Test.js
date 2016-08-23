/**
 * 
 */
var express = require('express');
var sqlite3 = require('sqlite3').verbose();


var fs = require('fs');
var filename = 'slack_test.db';
var dbexists = false;
try {
    fs.accessSync(filename);
    dbexists = true;
} catch (ex) {
    dbexists = false;
}

console.log(filename);
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



//Create new Team Function
exports.insertTeam = function  (db,teamname,descr,date){
	
	 console.log("Entering Team Insert. ")
	 
	 
	 var insertTeamSql = "INSERT INTO TEAM (TEAMNAME, DESCR, DATE) " +
		"VALUES ('" + teamname + "','" +descr +"','"+ date +"');";
	   
			db.run(insertTeamSql); 
			
	 return new Promise((resolve, reject) => {
		 
		 
		

		var query = "SELECT TEAMNAME, DESCR, DATE FROM TEAM "
			 + "  WHERE TEAMNAME = '" + teamname + "'";		

			
           
        var teams = [];

        db.serialize(function() {
            db.each(
                query,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {  
						var returnTeam = {};
						returnTeam.TEAMNAME  = row.TEAMNAME;
						returnTeam.DESCR = row.DESCR;
						returnTeam.DATE = row.DATE;
					
                        teams.push(returnTeam);
                    }
                },
                 function (err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        
						
						//resolve(teams);
						resolve(JSON.stringify(teams));
                    }
                }
            );
			});
		});	
}


//Create new TeamUser Function
exports.insertTeamUser = function  (db, teamName,descr,date,userName){
	
	console.log("Entering Team Insert. ")

	
	var insertTeamSql = "INSERT INTO TEAM (TEAMNAME, DESCR, DATE) " +
		"VALUES ('" + teamName + "','" +descr +"','"+ date +"');";
		
	db.run(insertTeamSql); 
	
	
	
	var insertTeamUserSql = "INSERT INTO TEAMUser (TEAMNAME, USERNAME, DESCR, DATE) " +
    "VALUES ('" + teamName + "','" +userName+ "','" +descr +"','"+ date +"');";
	 
    db.run(insertTeamUserSql);
	
	
	 
	return new Promise((resolve, reject) => {

		var query = "SELECT TEAMNAME, DESCR, DATE, USERNAME FROM TEAMUser "
			 + "  WHERE TEAMNAME = '" + teamName + "'";		

			 
        var teamUser = [];

        db.serialize(function() {
            db.each(
                query,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {  
						var returnTeamUser = {};
						returnTeamUser.TEAMNAME  = row.TEAMNAME;
						returnTeamUser.DESCR = row.DESCR;
						returnTeamUser.DATE = row.DATE;
						returnTeamUser.USERNAME = row.USERNAME;
					
                        teamUser.push(returnTeamUser);
                    }
                },
                 function (err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        
						
						//resolve(teams);
						resolve(JSON.stringify(teamUser));
                    }
                }
            );
			});
		});	
 
}



//Create new Channel Function
exports.insertChannel = function  (db, ChannelName,teamName, userName, descr,date,publicFlag){
	
	console.log("Entering Channel Insert. ")
	
	
	
	var insertTeamSql = "INSERT INTO TEAM (TEAMNAME, DESCR, DATE) " +
		"VALUES ('" + teamName + "','" +descr +"','"+ date +"');";
		
	db.run(insertTeamSql); 
	
	
	
	var insertTeamUserSql = "INSERT INTO TEAMUser (TEAMNAME, USERNAME, DESCR, DATE) " +
    "VALUES ('" + teamName + "','" +userName+ "','" +descr +"','"+ date +"');";
	 
    db.run(insertTeamUserSql);
	
	
	
	 var insertChannelSql = "INSERT INTO CHANNEL (CHANNELNAME, TEAMNAME, PUBLIC_FLAG, DATE) " +
    "VALUES ('" + ChannelName + "','" + teamName +"', '"+ publicFlag + "','"+ date +"');";
	 
	db.run(insertChannelSql);
	
	
	
	return new Promise((resolve, reject) => {

		var query = "SELECT CHANNEL.CHANNELNAME, CHANNEL.TEAMNAME,CHANNEL.PUBLIC_FLAG "+
		" from CHANNEL inner join TEAMUSER on CHANNEL.TEAMNAME= TEAMUSER.TEAMNAME "+
		" and TEAMUSER.TEAMNAME ='" + teamName +
		 "' order by CHANNELNAME ASC";	

		
           
        var Channel = [];

        db.serialize(function() {
            db.each(
                query,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {  
						var returnChannel = {};
						returnChannel.CHANNELNAME  = row.CHANNELNAME;
						returnChannel.TEAMNAME = row.TEAMNAME;
						returnChannel.PUBLIC_FLAG=row.PUBLIC_FLAG;
                        Channel.push(returnChannel);
                    }
                },
                 function (err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        
						
						//resolve(teams);
						resolve(JSON.stringify(Channel));
                    }
                }
            );
			});
		});	
 
}





//Create new ChannelChat Function
exports.insertChannelChat = function  (db, ChannelName,teamName, userName,fromUser,Message,descr,date,publicFlag){
	
	console.log("Entering Channel Insert. ")
	
	
	var insertTeamSql = "INSERT INTO TEAM (TEAMNAME, DESCR, DATE) " +
		"VALUES ('" + teamName + "','" +descr +"','"+ date +"');";
		
	db.run(insertTeamSql); 
	
	
	
	var insertTeamUserSql = "INSERT INTO TEAMUser (TEAMNAME, USERNAME, DESCR, DATE) " +
    "VALUES ('" + teamName + "','" +userName+ "','" +descr +"','"+ date +"');";
	 
    db.run(insertTeamUserSql);
	
	
	 var insertChannelSql = "INSERT INTO CHANNEL (CHANNELNAME, TEAMNAME, PUBLIC_FLAG, DATE) " +
    "VALUES ('" + ChannelName + "','" + teamName +"', '"+ publicFlag + "','"+ date +"');";
	 
	db.run(insertChannelSql);
	
	
	 var insertChannelChatSql = "INSERT INTO CHANNEL_CHAT (CHANNELNAME, SENDER, MESSAGE, DATE) " +
    "VALUES ('" + ChannelName + "','" + fromUser +"', '"+ Message + "','" + date + "');";
	 
	db.run(insertChannelChatSql);
	
	
	return new Promise((resolve, reject) => {

		var query = "SELECT CHANNELNAME, SENDER  "+
		" from CHANNEL_CHAT where CHANNELNAME = '" + ChannelName +"'" ;

		console.log("query: " + query);
           
        var ChannelChat = [];

        db.serialize(function() {
            db.each(
                query,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {  
						var returnChannelChat = {};
						returnChannelChat.CHANNELNAME  = row.CHANNELNAME;
						returnChannelChat.SENDER = row.SENDER;
                        ChannelChat.push(returnChannelChat);
                    }
                },
                 function (err, nRows) {
                    if (err) {
                        reject(err);
                    } else {
                        
						
						//resolve(teams);
						resolve(JSON.stringify(ChannelChat));
                    }
                }
            );
			});
		});	
 
}



//Create new Directusers Function
exports.insertDirectChat = function  (db,Message,Sender,Receiver,date,UserName){
	
	console.log("Entering Channel Insert. ")
	
	
	 var insertDirectChatSql = "INSERT INTO DIRECT_CHAT (SENDER, RECIEVER, MESSAGE, DATE) " +
    "VALUES ('" + Sender + "','" + Receiver +"', '"+ Message + "','" + date + "');";
	  
	db.run(insertDirectChatSql);
	
	
	
	return new Promise((resolve, reject) => {

		var query = "SELECT SENDER, RECIEVER, MESSAGE , DATE "+
		" from DIRECT_CHAT where SENDER = '" + UserName +"' OR RECIEVER = '" + UserName + "' order by DATE asc" ;

		
        var DirectChat = [];
        db.serialize(function() {
			
            db.each(
                query,
                function(err, row) {
					
                    if (err) {
					
                        reject(err);
                    } else {  
						var returnDirectChat = {};
						
						returnDirectChat.SENDER  = row.SENDER;
						returnDirectChat.RECIEVER = row.RECIEVER;
						returnDirectChat.MESSAGE = row.MESSAGE;
						
						DirectChat.push(returnDirectChat);
                    }
                },
                 function (err, nRows) {
                    if (err) {
						console.log("13");
                        reject(err);
                    } else {
                        
						
						//resolve(teams);
						resolve(JSON.stringify(DirectChat));
                    }
                }
            );
			});
		});	
 
}
	
//setting userid to cookie
exports.getSlackUser= function getSlackUser(db, UserName) {
		console.log("Entering getSlackUser");
		var query = "SELECT FIRSTNAME,LASTNAME,PASSWORD,EMAIL,DATE FROM USER "
             + "  WHERE USERNAME = '" + UserName + "'";
		
        var users = [];
		
		return new Promise((resolve, reject) => {     
        db.serialize(function() {
            db.each(
                query,
                function(err, row) {
                    if (err) {
                        reject(err);
                    } else {  
						
						var user = {};
						user.USERNAME  = UserName;
						user.FIRSTNAME = row.FIRSTNAME;
						user.LASTNAME = row.LASTNAME;
						user.PASSWORD = row.PASSWORD;
						user.EMAIL = row.EMAIL;
						user.DATE = row.DATE;
                        users.push(user);						
                     }
                },
                 function (err, nRows) {
					
                    if (err) {
                        reject(err);
                    } else {                        
						
						resolve(JSON.stringify(users));
						//resolve(users);
                    }
                }
            );
			});
		});	
}



	

	
	