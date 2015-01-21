var util = require('./util');

module.exports = function addPos (game) {
    var _pos = { row: 0, col: 0 };
    return function (newPos) {
        var duration = 1000;
        if (newPos.duration !== undefined) {
            duration = newPos.duration;
        }
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
                    .to({x: p.x}, duration, Phaser.Easing.Exponential.InOut, true)
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
                    .to({y: p.y}, duration, Phaser.Easing.Exponential.InOut, true)
                    .onComplete.add(function () {
                        this.animating = false;
                    }, this);
            } else {
                this.sprite.y = p.y;
            }
        }
    }
};
