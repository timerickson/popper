var config = require('./config');

var Board = require('./board');
var Slot = require('./slot');
var Popper = require('./popper');
var Dot = require('./dot');

var game;

var preLoad = function () {
    Slot.load(game);
    Popper.load(game);
    Dot.load(game);
};

var create = function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    board.init();
};

var update = function () {
//    board.update();
};

game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preLoad, create: create, update: update });

var board = new Board(game);

