/**
 * Created by tim on 8/28/14.
 */
(function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preLoad, create: create, update: update });

    const PopperFrameWidth = 75;
    const PopperFrameHeight = 85;
    const ColWidth = 40;
    const RowHeight = 45;

    var getPosition = function (r, c) {
        return {
            x: c * ColWidth,
            y: (-r + 10) * RowHeight
        };
    };

    function getRandomColor() {
        return Math.floor(Math.random() * 5);
    }

    function addPos () {
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
            var p = getPosition(_pos.row, _pos.col);
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
    }

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

        var pos = getPosition(r, c);
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
    };
    Slot.load = function () {
        game.load.image('square', 'square.png');
    };

    var Popper = function (groups, c, r) {
        this.color = 0;

        if (c === undefined) {
            c = 0;
        }
        if (r === undefined) {
            r = 10;
        }

        this.sprite = groups.poppers.create(0, 0, 'poppers', getRandomColor());
        this.sprite.anchor.setTo(-0.15, -0.15);
        this.sprite.scale.x = 0.4;
        this.sprite.scale.y = 0.4;

        this.pos = addPos();
        this.pos({ row: r, col: c});
    };
    Popper.load = function () {
        game.load.spritesheet('poppers', 'poppers.png', PopperFrameWidth, PopperFrameHeight);
    };

    var Dot = function (groups, c, r) {
        this.sprite = groups.dots.create(0, 0, 'dot');
        this.sprite.scale.x = 0.5;
        this.sprite.scale.y = 0.5;
        this.sprite.anchor.setTo(-1.1, -1.3);

        var pos = getPosition(r, c);
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
    };
    Dot.load = function () {
        game.load.image('dot', 'dot.png');
    };

    var Board = function () {
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
                    p = new Popper(groups, c, 10);
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

    var board = new Board();

    function preLoad() {
        Slot.load();
        Popper.load();
        Dot.load();
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        board.init();
    }

    function update() {
        board.update();
    }

})();