var config = require('./config');
var addPos = require('./addPos');
var util = require('./util');

var Popper = function (game, groups, c, r) {
    this.color = util.getRandomColor();

    if (c === undefined) {
        c = 0;
    }
    if (r === undefined) {
        r = 10;
    }

    this.sprite = groups.poppers.create(0, 0, 'poppers', this.color);
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