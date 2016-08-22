/**
 * http://usejsdoc.org/
 */

	//function channelChatJSONPromise(db, channelName) {
exports.searchChannelMsgJSONPromisePublic = function (db, searchKeyword, userName){
		var query = "SELECT CHANNELNAME, SENDER , MESSAGE , DATE "+
		//	var query = "SELECT CHANNEL.CHANNELNAME "+
		" from CHANNEL_CHAT where (UPPER(MESSAGE) like UPPER('%" + searchKeyword +"%')" +
		" or UPPER(SENDER) like UPPER('%" + searchKeyword +"%') )" +
		" UNION SELECT RECIEVER, SENDER , MESSAGE , DATE " + 
		" from DIRECT_CHAT where RECIEVER = '" + userName + "'" + 
		" and (UPPER(MESSAGE) like UPPER('%" + searchKeyword +"%')" +
				" or UPPER(SENDER) like UPPER('%" + searchKeyword +"%') )" ;
				
		//" order by DATE asc" ;
		
		 console.log ('**********8in searchChannelMsgJSONPromisePublic query=' +query);
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
	