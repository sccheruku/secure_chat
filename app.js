"use strict";

/* Requirements */
var express = require('express'),
    app = express(),
    cons = require('consolidate'); // Templating library adapter for Express

//var http = require('http').Server(app);


var bodyParser = require('body-parser');
var Api = require('./api');
var Subscription = require('./subscriptions').Subscription;
/* Express Initialize */
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(express.static('ui'));

Api(app);

var port = process.env.PORT;
if (!port) port = 80;

var server = app.listen(port);
console.log('Express server started on port: ' + port);

var io = require('socket.io').listen(server);
io.on('connection', function(socket){
	socket.on('disconnect', function(msg){
  });
  socket.on('join', function(msg){
  	console.log(msg.room);
    socket.join(msg.room);
    var info = msg.user + " joined";
    io.to(msg.room).emit('joined', { info: info });
  });
});
console.log('SocketIO Listening');

// Start Subscribers
// var subscription = new Subscription(io);
// subscription.SubscribeContactsTable();