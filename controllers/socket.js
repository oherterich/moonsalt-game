/*
	Socket Controller
*/

var $ = require('jquery');

var Player = require('../models/player.js');

var SocketCtrl = function (server) {
	this._io = require('socket.io')(server);

	this.playerList = [];

	this.lookup = {};
};

SocketCtrl.prototype.init = function () {
	this._io.on('connection', function(socket){

		// Admin
		this.userConnected(socket);
		this.userDisconnected(socket);
		
		// Player
		this.playerMovement(socket);

	}.bind(this));
};

SocketCtrl.prototype.updateLookup = function () {
	for (var i = 0, len = this.playerList.length; i < len; i++) {
	    this.lookup[this.playerList[i].id] = this.playerList[i];
	}
};

SocketCtrl.prototype.userConnected = function (socket) {
	console.log('Connect');
	var newPlayer = new Player();
	newPlayer.init(socket);
	this.playerList.push(newPlayer);
	this.updateLookup();
	console.log(this.playerList);
};

SocketCtrl.prototype.userDisconnected = function (socket) {
	socket.on('disconnect', function(socket){
		console.log('Disconnect');
		var player = this.lookup[socket.id]
		this.playerList.splice(player, 1);
		console.log(this.playerList);
	}.bind(this));
};

SocketCtrl.prototype.playerMovement = function (socket) {
	socket.on('playerPosition', function (data) {
		// console.log(data);
	}.bind(this));
};

module.exports = SocketCtrl;