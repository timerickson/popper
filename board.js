var Popper = require('./popper');
var Slot = require('./slot');

var Board = function (game) {
    var _columns = [[], [], [], [], [], [], [], [], [], []];
    var _poppers = [];
    this.init = function () {
        var groups = {
            slots: game.add.group(),
            poppers: game.add.group(),
            dots: game.add.group()
        };
        var r, c, p, s;
        for (c = 0; c < 10; c++) {
            for (r = 0; r < 20; r++) {
                s = new Slot(groups, this, c, r);
                _columns[c][r] = s;
            }
        }
        for (c = 0; c < 10; c++) {
            for (r = 0; r < 10; r++) {
                p = new Popper(game, groups, c, r + 10);
                _poppers.push(p);
                _columns[c][r + 10].popper = p;
                p.pos({row: r + 10, col: c, animate: true});
            }
        }
    };

    this.dropPoppers = function (isLevelStart) {
        var r, rAbove, maxRow, c, column;
        maxRow = isLevelStart ? 19 : 9;
        for (r = 0; r <= maxRow; r++) {
            for (c = 0; c < 10; c++) {
                column = _columns[c];
                if (column[r].popper !== null) {
                    continue;
                }
                for (rAbove = r + 1; rAbove <= maxRow; rAbove++) {
                    if (column[rAbove].popper != null) {
                        column[rAbove].popper.pos({row: r, animate: true});
                        column[r].popper = column[rAbove].popper;
                        column[rAbove].popper = null;
                        break;
                    }
                }
            }
        }
    };

    var _indicated = [];

    this.collectGroup = function (col, row) {
        var r = row,
            c = col,
            checkSlot = _columns[c][r],
            color = checkSlot.popper.color,
            group = [],
            contains = function (arr, item) {
                var i;
                for (i = 0; i < arr.length; i++) {
                    if (arr[i] === item) {
                        return true;
                    }
                }
                return false;
            };
        function collect(slot) {
            if (slot.popper != null
                && !contains(group, slot)
                && slot.popper.color === color) {
                group.push(slot);
                checkAdjacent(slot);
            }
        }
        function checkAdjacent(slot) {
            var r = slot.row,
                c = slot.col;
            if (r < 9) {
                collect(_columns[c][r + 1]);
            }
            //check right
            if (c < 9) {
                collect(_columns[c + 1][r]);
            }
            //check down
            if (r > 0) {
                collect(_columns[c][r - 1]);
            }
            //check left
            if (c > 0) {
                collect(_columns[c - 1][r]);
            }
        }
        collect(_columns[c][r]);
        return group;
    };

    this.indicate = function (c, r) {
        _indicated = this.collectGroup(c, r);
        for (var i = 0; i < _indicated.length; i++) {
            _indicated[i].showDot(true);
        }
    };

    this.clearIndicator = function () {
        for (var i = (_indicated.length - 1); i >= 0; i--) {
            _indicated[i].showDot(false);
            _indicated.splice(i, 1);
        }
    };

    this.update = function () {
        //TODO
    };
};

module.exports = Board;
