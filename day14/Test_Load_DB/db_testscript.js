/**
 * http://usejsdoc.org/
 */
var express = require('express');
var asserts =  require('assert');
var sqlite3 = require('sqlite3').verbose();
var slackdb = require ('./SlackDB_Test.js');
var moment = require("moment");



describe ('DB module', () => {
	var db1 = new sqlite3.Database('slack_test.db');
	
		
		before(() => {
			
			  db1.run('begin');
			 // db1.exec ('BEGIN');
			
		});
		
		after (() => {
			
			db1.run('rollback');  
			 
			// db1.exec ('ROLLBACK');
		});

	//conn	
	it('1. test select UserID for the login page', function (done) {
		
		var username = 'beiying';
	
		var expectedChannelName =  [{"USERNAME":"beiying","FIRSTNAME":"Beiying","LASTNAME":"Chen","PASSWORD":"beiyingpassword","EMAIL":"5@ssa.org","DATE":"2016-08-05 12:45:00"}];		  
		slackdb.getSlackUser(db1, username).then( //done);
				function (val) {
					
						var actual = val;
						console.log ("actual = "+ actual);
						console.log ("expected = "+ JSON.stringify(expectedChannelName));
							
					try{
						asserts.deepEqual((actual), JSON.stringify(expectedChannelName));
						done();
					} catch (err){
						console.log ('in done try err, '+ err);
						
					}
				},
				function (err) {
					done(err);
				}
				
			)
		
		});
		
		
	it('2. test insert and select team into Team table', function (done) {

		console.log('**********************************');
		var TEAMNAME = 'general';
		var DESCR = 'public team';
		//var DATE= new Date();
		var now = moment(new Date());

		var date = now.format("YYYY-MM-DD hh:mm:ss");

		
		
		var expectedTEAMName = [{ TEAMNAME: 'general' , DESCR: 'public team',DATE: date }];		  
		 slackdb.insertTeam(db1,TEAMNAME,DESCR,date).then( //done);
				function (val) {
					
						var actual = val;
						console.log ("actual = "+ actual);
						console.log ("expected = "+ JSON.stringify(expectedTEAMName));
							
					try{
						asserts( actual, JSON.stringify(expectedTEAMName));
						done();
					} catch (err){
						console.log ('in done try err, '+ err);
						//done(err);
					}
				},
				function (err) {
					
					done(err);
				}
				
			)
		
		});
		
	it('3. test insert and select teamUser into Team and teamUser table', function (done) {

		console.log('**********************************');
		var TEAMNAME = 'general';
		var DESCR = 'public team';
		var now = moment(new Date());
		var date = now.format("YYYY-MM-DD hh:mm:ss");
        var username= 'beiying';
		
		
		var expectedTEAMUser = [{ TEAMNAME: 'general' , DESCR: 'public team',DATE: date ,USERNAME:'beiying'}];		  
		 slackdb.insertTeamUser(db1,TEAMNAME,DESCR,date,username).then( //done);
				function (val) {
					
						var actual = val;
						console.log ("actual = "+ actual);
						console.log ("expected = "+ JSON.stringify(expectedTEAMUser));
							
					try{
						asserts( actual, JSON.stringify(expectedTEAMUser));
						done();
					} catch (err){
						console.log ('in done try err, '+ err);
						//done(err);
					}
				},
				function (err) {
					
					done(err);
				}
				
			)
		
		});
	
	it('4. test insert and select Channels', function (done) {

		console.log('**********************************');
		var ChannelName='E_channel';
		var TEAMNAME = 'general';
		var username= 'beiying';
		var descr = 'public team';
		var now = moment(new Date());
		var date = now.format("YYYY-MM-DD hh:mm:ss");
		var publicFlag='N';

		

		
		
		var expectedChannel = [{ CHANNELNAME:'E_channel',TEAMNAME: 'general',PUBLIC_FLAG:'N' }];		  
		 slackdb.insertChannel(db1, ChannelName,TEAMNAME, username, descr,date,publicFlag).then( //done);
				function (val) {
					
						var actual = val;
						console.log ("actual = "+ actual);
						console.log ("expected = "+ JSON.stringify(expectedChannel));
							
					try{
						asserts( actual, JSON.stringify(expectedChannel));
						done();
					} catch (err){
						console.log ('in done try err, '+ err);
						//done(err);
					}
				},
				function (err) {
					
					done(err);
				}
				
			)
		
		});
	it('5. test insert and select ChannelChat', function (done) {

		console.log('**********************************');
		var ChannelName='E_channel';
		var TEAMNAME = 'general';
		var username= 'beiying';
		var fromUser= 'beiying';
		var Message= 'How are you?';
		var descr = 'public team';
		var now = moment(new Date());
		var date = now.format("YYYY-MM-DD hh:mm:ss");
		var publicFlag='N';

		

		
		
		var expectedChannelChat = [{ CHANNELNAME:'E_channel',SENDER: 'beiying'}];		  
		 slackdb.insertChannelChat(db1, ChannelName,TEAMNAME, username,fromUser,Message,descr,date,publicFlag).then( //done);
				function (val) {
					
						var actual = val;
						console.log ("actual = "+ actual);
						console.log ("expected = "+ JSON.stringify(expectedChannelChat));
							
					try{
						asserts( actual, JSON.stringify(expectedChannelChat));
						done();
					} catch (err){
						console.log ('in done try err, '+ err);
						//done(err);
					}
				},
				function (err) {
					
					done(err);
				}
				
			)
		
		});
		
	it('6. test insert and select DirectChat', function (done) {

		console.log('**********************************');
		
		var Message= 'Hi,How are you?';
		var Sender= 'beiying';
		var Receiver= 'abu';
		var now = moment(new Date());
		var date = now.format("YYYY-MM-DD hh:mm:ss");
		var UserName = 'beiying';
		
		var expectedDirectChat = [{ SENDER:'beiying',RECIEVER: 'beiying',MESSAGE: 'Hi,How are you?'}];		  
		 slackdb.insertDirectChat(db1, Message,Sender,Receiver,date,UserName).then( //done);
				function (val) {
					
						var actual = val;
						console.log ("actual = "+ actual);
						console.log ("expected = "+ JSON.stringify(expectedDirectChat));
							
					try{
						asserts( actual, JSON.stringify(expectedDirectChat));
						done();
					} catch (err){
						console.log ('in done try err, '+ err);
						//done(err);
					}
				},
				function (err) {
					
					done(err);
				}
				
			)
		
		});
		

});


