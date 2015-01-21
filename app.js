var config = require('./config');

var Board = require('./board');
var Slot = require('./slot');
var Popper = require('./popper');
var Dot = require('./dot');

var game;

var data = [
    3, 4, 2, 4, 2, 4, 0, 2, 2, 3,
    2, 2, 3, 2, 1, 3, 4, 2, 2, 4,
    1, 0, 4, 0, 3, 4, 2, 2, 0, 3,
    4, 3, 2, 2, 3, 4, 3, 3, 4, 4,
    2, 0, 4, 3, 1, 3, 1, 2, 2, 2,
    4, 2, 4, 4, 0, 4, 3, 1, 0, 0,
    0, 1, 4, 1, 3, 0, 2, 2, 0, 2,
    4, 2, 1, 3, 3, 3, 3, 0, 3, 4,
    2, 0, 4, 4, 3, 4, 3, 0, 4, 4,
    1, 0, 4, 4, 3, 3, 4, 3, 4, 0
];

var preLoad = function () {
    Slot.load(game);
    Popper.load(game);
    Dot.load(game);
};

var create = function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    board.init();
    board.startNextLevel(data);
//    board.startNextLevel();
};

var update = function () {
    board.update();
};

//game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preLoad, create: create, update: update });

//var board = new Board(game);

