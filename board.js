var config = require('./config');
var Popper = require('./popper');
var Slot = require('./slot');

var Board = function (game) {
    var _columns = [[], [], [], [], [], [], [], [], [], []];
    var _poppers = [];
    var self = this;

    this.level = 0;
    this.target = 0;
    this.score = 0;
    this.coins = 200;
    this.bombPrice = 5;
    this.undoPrice = 10;

    this.levelText = null;
    this.targetText = null;
    this.scoreText = null;
    this.coinsText = null;

    var _score = function (group) {
        var groupSize = group.length;
        if (groupSize > (config.Scores.length - 1)) {
            groupSize = config.Scores.length - 1;
        }
        var score = config.Scores[groupSize];
        self.score += score[0];
        self.coins += score[1];
    };

    var _spriteGroups = null;

    this.init = function () {
        var r, c, p, s;
        if (_spriteGroups == null) {
            _spriteGroups = {
                texts: game.add.group(),
                slots: game.add.group(),
                poppers: game.add.group(),
                dots: game.add.group()
            };
        }
        _spriteGroups.texts.removeAll(true, true);
        _spriteGroups.slots.removeAll(true, true);
        _spriteGroups.poppers.removeAll(true, true);
        _spriteGroups.dots.removeAll(true, true);

        this.targetText = game.add.text(10, 10, '', {fill: 'white'}, _spriteGroups.texts);
        this.scoreText = game.add.text(250, 10, '', {fill: 'white'}, _spriteGroups.texts);
        this.levelText = game.add.text(10, 500, '', {fill: 'white'}, _spriteGroups.texts);
        this.coinsText = game.add.text(250, 500, '', {fill: 'white'}, _spriteGroups.texts);

        for (c = 0; c < 10; c++) {
            for (r = 0; r < 20; r++) {
                s = new Slot(_spriteGroups, self, c, r);
                _columns[c][r] = s;
            }
        }
    };

    this.startNextLevel = function (data) {
        if (this.score < this.target) {
            alert('Game Over!');
            return;
        }
        if (this.level > 0 && !confirm('Next Level?')) {
            return;
        }
        this.level++;
        if (config.Targets.length > (this.level - 1)) {
            this.target += config.Targets[this.level - 1];
        } else {
            this.target += config.DefaultTargetIncrement;
        }
        this.clearPoppers();
        this.fillPoppers(data);
        this.dropPoppers(true);
        _collectGroups();
    };

    this.clearPoppers = function () {
        var r, c, slot;
        for (c = 0; c < 10; c++) {
            for (r = 0; r < 10; r++) {
                slot = _columns[c][r];
                if (slot.popper === null) {
                    continue;
                }
                slot.pop();
            }
        }
    }

    this.fillPoppers = function (data) {
        var c, r, p, color;
        for (c = 0; c < 10; c++) {
            for (r = 0; r < 10; r++) {
                if (data !== undefined) {
                    color = data[c][r];
                }
                p = new Popper(game, _spriteGroups, c, r + 10, color);
                _poppers.push(p);
                _columns[c][r + 10].popper = p;
                p.pos({row: r + 10, col: c, animate: true, duration: config.AnimationTimeMs});
            }
        }
        if (data === undefined) {
            var str = '';
            for (c = 0; c < 10; c++) {
                if (c > 0) {
                    str += '\r\n';
                }
                str += '  [';
                for (r = 0; r < 10; r++) {
                    if (r > 0) {
                        str += ', ';
                    }
                    str += _columns[c][r + 10].popper.color;
                }
                str += ']';
                if (c < 9) {
                    str += ',';
                }
            }
            console.log(str);
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
                        column[rAbove].popper.pos({row: r, animate: true, duration: config.AnimationTimeMs});
                        column[r].popper = column[rAbove].popper;
                        column[rAbove].popper = null;
                        break;
                    }
                }
            }
        }
        _slidePoppers();
    };

    var _indicated = [];
    var _groups = [];
    var _groupMap = null;

    var _collectGroups = function () {
        var c, r, group;

        //reset fields
        _groups = [];
        _groupMap = [];

        //initialize groupMap
        for (c = 0; c < 10; c++) {
            _groupMap.push([]);
            for (r = 0; r < 10; r++) {
                _groupMap[c].push(undefined)
            }
        }

        //collect groups
        for (c = 0; c < 10; c++) {
            for (r = 0; r < 10; r++) {
                if (_groupMap[c][r] === undefined) {
                    _collectGroup(c, r);
                }
            }
        }
    };

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
        if (_groupMap[c][r] !== undefined) {
            return _groupMap[c][r];
        }
        _groups.push(group);
        if (checkSlot.popper === null) {
            _groupMap[c][r] = group;
            return;
        }
        color = checkSlot.popper.color;
        var collect = function (slot) {
            if (slot.popper === null
                || contains(group, slot)
                || slot.popper.color !== color) {
                return;
            }

            group.push(slot);
            _groupMap[slot.col][slot.row] = group;
            checkAdjacent(slot);
        };
        var checkAdjacent = function (slot) {
            var r = slot.row,
                c = slot.col;
            if (r < 9) { collect(_columns[c    ][r + 1]); } //check up
            if (c < 9) { collect(_columns[c + 1][r    ]); } //check right
            if (r > 0) { collect(_columns[c    ][r - 1]); } //check down
            if (c > 0) { collect(_columns[c - 1][r    ]); } //check left
        };
        collect(_columns[c][r]);
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
                colFrom[r].popper.pos({col: toColNum, animate: true, duration: config.AnimationTimeMs});
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

    var _noMoreMoves = function () {
        var g, group;
        for (g in _groups) {
            group = _groups[g];
            if (group.length > 1) {
                return false;
            }
        }
        return true;
    };

    var _pop = function (group) {
        var i;
        if (group.length === 0) {
            return;
        }
        for (i in _indicated) {
            group[i].pop();
        }
        self.dropPoppers(false);
        _score(_indicated);
        _collectGroups();
        if (_noMoreMoves()) {
            self.startNextLevel();
        }
    };

    this.indicate = function (c, r) {
        _indicated = _groupMap[c][r];
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

    this.poke = function (c, r, isBomb) {
        this.indicate(c, r);
        if (_indicated.length === 0) {
            return;
        }
        if (_indicated.length === 1 && !isBomb) {
            return;
        }
        _pop(_indicated);
        this.indicate(c, r);
    };

    this.update = function () {
        this.levelText.text = 'Level: ' + this.level;
        this.targetText.text = 'Target: ' + this.target;
        this.scoreText.text = 'Score: ' + this.score;
        this.coinsText.text = 'Coins: ' + this.coins;
    };
};

module.exports = Board;
