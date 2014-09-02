(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var util = require('./util');

module.exports = function addPos (game) {
    var _pos = { row: 0, col: 0 };
    return function (newPos) {
        if (newPos === undefined) {
            return _pos;
        }
        if (newPos.row !== undefined) {
            _pos.row = newPos.row;
        }
        if (newPos.col !== undefined) {
            _pos.col = newPos.col;
        }
        var p = util.getPosition(_pos.row, _pos.col);
        if (this.sprite.x !== p.x) {
            if (newPos.animate) {
                this.animating = true;
                game.add.tween(this.sprite)
                    .to({x: p.x}, 1000, Phaser.Easing.Exponential.InOut, true)
                    .onComplete.add(function () {
                        this.animating = false;
                    }, this);
            } else {
                this.sprite.x = p.x;
            }
        }
        if (this.sprite.y !== p.y) {
            if (newPos.animate) {
                this.animating = true;
                game.add.tween(this.sprite)
                    .to({y: p.y}, 1000, Phaser.Easing.Exponential.InOut, true)
                    .onComplete.add(function () {
                        this.animating = false;
                    }, this);
            } else {
                this.sprite.y = p.y;
            }
        }
    }
};

},{"./util":8}],2:[function(require,module,exports){
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


},{"./board":3,"./config":4,"./dot":5,"./popper":6,"./slot":7}],3:[function(require,module,exports){
var Popper = require('./popper');
var Slot = require('./slot');

var Board = function (game) {
    this.columns = [[], [], [], [], [], [], [], [], [], []];
    this.poppers = [];
    this.init = function () {
        var groups = {
            slots: game.add.group(),
            poppers: game.add.group(),
            dots: game.add.group()
        };
        var r, c, p, s;
        for (c = 0; c < 10; c++) {
            for (r = 0; r < 11; r++) {
                s = new Slot(groups, c, r);
                this.columns[c][r] = s;
            }
        }
        for (c = 0; c < 10; c++) {
            for (r = 0; r < 10; r++) {
                p = new Popper(game, groups, c, 10);
                this.poppers.push(p);
                this.columns[c][10].popper = p;
                p.pos({row: r, col: c, animate: true});
            }
        }
    };
    this.update = function () {
        //TODO
    };
};

module.exports = Board;

},{"./popper":6,"./slot":7}],4:[function(require,module,exports){
var config = {
    PopperFrameWidth: 75,
    PopperFrameHeight: 85,
    ColWidth: 40,
    RowHeight: 45
};

module.exports = config;

},{}],5:[function(require,module,exports){
var util = require('./util');

var Dot = function (groups, c, r) {
    this.sprite = groups.dots.create(0, 0, 'dot');
    this.sprite.scale.x = 0.5;
    this.sprite.scale.y = 0.5;
    this.sprite.anchor.setTo(-1.1, -1.3);
    this.sprite.renderEnabled = false;

    var pos = util.getPosition(r, c);
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;
};
Dot.load = function (game) {
    game.load.image('dot', 'dot.png');
};

module.exports = Dot;
},{"./util":8}],6:[function(require,module,exports){
var config = require('./config');
var addPos = require('./addPos');
var util = require('./util');

var Popper = function (game, groups, c, r) {
    this.color = 0;

    if (c === undefined) {
        c = 0;
    }
    if (r === undefined) {
        r = 10;
    }

    this.sprite = groups.poppers.create(0, 0, 'poppers', util.getRandomColor());
    this.sprite.anchor.setTo(-0.15, -0.15);
    this.sprite.scale.x = 0.4;
    this.sprite.scale.y = 0.4;

    this.pos = addPos(game);
    this.pos({ row: r, col: c});
};
Popper.load = function (game) {
    game.load.spritesheet('poppers', 'poppers.png', config.PopperFrameWidth, config.PopperFrameHeight);
};

module.exports = Popper;
},{"./addPos":1,"./config":4,"./util":8}],7:[function(require,module,exports){
var Dot = require('./dot');
var util = require('./util');

var Slot = function (groups, c, r) {
    this.popper = null;

    this.sprite = groups.slots.create(0, 0, 'square');
    this.sprite.anchor.setTo(-0.03, -0.03);
    this.sprite.scale.x = 0.5;
    this.sprite.scale.y = 0.5;

    if (r < 10) {
        this.dot = new Dot(groups, c, r);
        this.dot.sprite.bringToTop();
    }

    var pos = util.getPosition(r, c);
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;
};
Slot.load = function (game) {
    game.load.image('square', 'square.png');
};

module.exports = Slot;
},{"./dot":5,"./util":8}],8:[function(require,module,exports){
var config = require('./config');

var getPosition = function (r, c) {
    return {
        x: c * config.ColWidth,
        y: (-r + 10) * config.RowHeight
    };
};

function getRandomColor() {
    return Math.floor(Math.random() * 5);
}

module.exports = {
    getPosition: getPosition,
    getRandomColor: getRandomColor
};
},{"./config":4}]},{},[2]);
