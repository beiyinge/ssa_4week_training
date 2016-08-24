var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(filename);



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
	
