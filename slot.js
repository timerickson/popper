var Dot = require('./dot');
var util = require('./util');

var Slot = function (groups, board, c, r) {
    var _board = board;

    this.row = r;
    this.col = c;

    this.popper = null;

    if (r < 10) {
        this.sprite = groups.slots.create(0, 0, 'square');
        this.sprite.inputEnabled = true;
        this.sprite.anchor.setTo(-0.03, -0.03);
        this.sprite.scale.x = 0.5;
        this.sprite.scale.y = 0.5;

        this.sprite.events.onInputOver.add(function () {
            _board.indicate(c, r);
        }, this);
        this.sprite.events.onInputOut.add(function () {
            _board.clearIndication();
        }, this);
        this.sprite.events.onInputUp.add(function () {
            _board.poke(c, r);
        }, this);

        var pos = util.getPosition(r, c);
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
    }

    this.dot = new Dot(groups, c, r);
    this.dot.sprite.bringToTop();

    this.showDot = function (show) {
        this.dot.visible(show);
    };

    this.pop = function () {
        if (this.popper !== null) {
            this.popper.pop();
            this.popper = null;
        }
        this.showDot(false);
    };
};
Slot.load = function (game) {
    game.load.image('square', 'square.png');
};

module.exports = Slot;