/**
 * http://usejsdoc.org/
 */
var asserts =  require('assert');
var sqlite3 = require('sqlite3').verbose();
var slackdb = require ('./SlackDB.js');

//var _ = require('lodash');

describe ('DB module', () => {
	var db1 = new sqlite3.Database('slack.db');
	
		
		before (() => {
			  //db1.run('begin');
			
		});
		
		after (() => {
			 //db1.run('rollback');  
		});

	//conn	
		it ('given team name, return all channel names of that team by user' ,() =>{
			var username = 'abu';
			//array
			//var oldChannelName = [];
			var oldChannelName = slackdb.getChannels (db1, username);
			console.log ("oldChannelName="+oldChannelName);
			var newChannelName = "C_channel";
			var newTeamName = 'Wonder_team2';
			
			
			var expectedChannelName =oldChannelName.push(newChannelName);
			
			
			
			slackdb.insertTeam(db1, newTeamName, ' team');
			slackdb.insertChannel (db1, newChannelName, newTeamName, 'Channel');
			slackdb.insertTeamUser (db1, newTeamName, username, 'team user');
			
			var actual = slackdb.getChannels (db1, username);
			
			console.log ("actual="+actual);
			console.log ("expectedChannelName="+expectedChannelName);
			
			asserts.equal(actual, expectedChannelName);
			
			
		});
		

});