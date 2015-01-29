/*
	Player Model
*/

var Player = function () {
	this.socket = null;
	this.id = null;
	this.name = '';
	this.pos = {
		'x': 0,
		'y': 0
	};
}

Player.prototype.init = function (socket) {
	this.socket = socket;
	this.id = socket.id;
}

Player.prototype.getId = function () {
	return this.id;
}

Player.prototype.getPos = function () {
	return this.pos; 
}

Player.prototype.setPos = function (pos) {
	this.pos = pos;
}

module.exports = Player;