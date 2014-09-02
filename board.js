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
                s = new Slot(groups, this, c, r);
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

    var indicated = [];

    this.indicate = function (c, r) {
        indicated.push(this.columns[2][5]);
        indicated.push(this.columns[3][6]);
        for (var i = 0; i < indicated.length; i++) {
            indicated[i].showDot(true);
        }
    };

    this.clearIndication = function () {
        for (var i = (indicated.length - 1); i >= 0; i--) {
            indicated[i].showDot(false);
            indicated.splice(i, 1);
        }
    };

    this.update = function () {
        //TODO
    };
};

module.exports = Board;
