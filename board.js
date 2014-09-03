var Popper = require('./popper');
var Slot = require('./slot');

var Board = function (game) {
    var _columns = [[], [], [], [], [], [], [], [], [], []];
    var _poppers = [];
    var self = this;
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
        for (c = 0; c < 10; c++) {
            column = _columns[c];
            for (r = 0; r <= maxRow; r++) {
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

    var _collectGroup = function (col, row) {
        var r = row,
            c = col,
            checkSlot = _columns[c][r],
            color,
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
        if (checkSlot.popper === null) {
            return [];
        }
        color = checkSlot.popper.color;
        var collect = function (slot) {
            if (slot.popper != null
                && !contains(group, slot)
                && slot.popper.color === color) {
                group.push(slot);
                checkAdjacent(slot);
            }
        };
        var checkAdjacent = function (slot) {
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
        };
        collect(_columns[c][r]);
        return group;
    };

    var _slidePoppers = function () {
        var c, colToRight, r;
        var isColBlank = function (colNum) {
            var r,
                isBlank = true;
            for (r = 0; r < 10 && isBlank; r++) {
                if (_columns[colNum][r].popper !== null) {
                    isBlank = false;
                }
            }
            return isBlank;
        };
        var slideLeft = function (colNum, toColNum) {
            var r, colFrom;
            for (r = 0; r < 10; r++) {
                colFrom = _columns[colNum];
                if (colFrom[r].popper === null) {
                    break;
                }
                colFrom[r].popper.pos({col: toColNum, animate: true});
                _columns[toColNum][r].popper = colFrom[r].popper;
                colFrom[r].popper = null;
            }
        };
        for (c = 0; c < 10; c++) {
            if (!isColBlank(c)) {
                continue;
            }
            for (colToRight = c + 1; colToRight < 10; colToRight++) {
                if (isColBlank(colToRight, c)) {
                    continue;
                }
                slideLeft(colToRight, c);
                c++;
            }
        }
    };

    var _pop = function () {
        var i;
        if (_indicated.length < 2) {
            return;
        }
        for (i in _indicated) {
            _indicated[i].pop();
        }
        self.dropPoppers(false);
        _slidePoppers();
    };

    this.indicate = function (c, r) {
        _indicated = _collectGroup(c, r);
        for (var i = 0; i < _indicated.length; i++) {
            _indicated[i].showDot(true);
        }
    };

    this.clearIndication = function () {
        for (var c = 0; c < 10; c++) {
            for (var r = 0; r < 10; r++) {
                _columns[c][r].showDot(false);
            }
        }
        _indicated = [];
    };

    this.poke = function (c, r) {
        if (_indicated.length === 0) {
            this.indicate(c, r);
        }
        if (_indicated.length < 2) {
            return;
        }
        _pop();
        this.clearIndication();
    };

    this.update = function () {
        //TODO
    };
};

module.exports = Board;
