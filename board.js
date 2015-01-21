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
        var r, c, s;
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

        self.targetText = game.add.text(10, 10, '', {fill: 'white'}, _spriteGroups.texts);
        self.scoreText = game.add.text(250, 10, '', {fill: 'white'}, _spriteGroups.texts);
        self.levelText = game.add.text(10, 500, '', {fill: 'white'}, _spriteGroups.texts);
        self.coinsText = game.add.text(250, 500, '', {fill: 'white'}, _spriteGroups.texts);

        for (c = 0; c < 10; c++) {
            for (r = 0; r < 20; r++) {
                s = new Slot(_spriteGroups, self, c, r);
                _columns[c][r] = s;
            }
        }
    };

    this.startNextLevel = function (data, levelIndex, score) {
        if (levelIndex !== undefined) {
            self.level = levelIndex;
        }
        if (score !== undefined) {
            self.score = score;
        }
        if (self.level > 1 && self.score < self.target) {
//            console.log('Game Over!', self.score, self.target);
            alert('Game Over!', self.level, self.score, self.target);
            return;
        }
        if (self.level > 0 && !confirm('Next Level?')) {
            return;
        }
        self.level++;
        if (config.Targets.length > (self.level - 1)) {
            self.target += config.Targets[self.level - 1];
        } else {
            self.target += config.DefaultTargetIncrement;
        }
        self.clearPoppers();
        self.fillPoppers(data);
        self.dropPoppers(true);
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
    };

    this.fillPoppers = function (data) {
        var c, r, p, color;
        for (c = 0; c < 10; c++) {
            for (r = 0; r < 10; r++) {
                if (data !== undefined) {
                    color = data[c * 10 + r];
                }
                p = new Popper(game, _spriteGroups, c, r + 10, color);
                _poppers.push(p);
                _columns[c][r + 10].popper = p;
                p.pos({row: r + 10, col: c, animate: true, duration: config.AnimationTimeMs});
            }
        }
        if (data === undefined) {
            var str = '  ';
            for (c = 0; c < 10; c++) {
                if (c > 0) {
                    str += '\r\n';
                }
                for (r = 0; r < 10; r++) {
                    if (r > 0) {
                        str += ', ';
                    }
                    str += _columns[c][r + 10].popper.color;
                }
                if (c < 9) {
                    str += ',';
                }
            }
            console.log(str);
        }
    };

    this.getState = function () {
        var c, r, value, slot, state = [];
        for (c = 0; c < 10; c++) {
            for (r = 0; r < 10; r++) {
                slot = _columns[c][r];
                if (slot.popper === null) {
                    value = null;
                } else {
                    value = slot.popper.color;
                }
                state[c * 10 + r] = value;
            }
        }
        return state;
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
        var c, r;

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
        var c, colToRight;
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

    this.hasMoves = function () {
        var g, group;
        for (g in _groups) {
            group = _groups[g];
            if (group.length > 1) {
                return true;
            }
        }
        return false;
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
        if (!self.hasMoves()) {
            self.startNextLevel();
        }
    };

    this.getGroups = function () {
        return _groups;
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
        self.indicate(c, r);
        if (_indicated.length === 0) {
            return;
        }
        if (_indicated.length === 1 && !isBomb) {
            return;
        }
        _pop(_indicated);
        self.indicate(c, r);
    };

    this.update = function () {
        self.levelText.text = 'Level: ' + self.level;
        self.targetText.text = 'Target: ' + self.target;
        self.scoreText.text = 'Score: ' + self.score;
        self.coinsText.text = 'Coins: ' + self.coins;
    };
};

module.exports = Board;
