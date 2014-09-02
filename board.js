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
