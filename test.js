var Board = require('./board');

Phaser = {
    Easing: {
        Exponential: {
        }
    }
};

function MockGame() {
    this.toString = function () { return "MockGame"; };
    this.add = {
        group: function () {
            return {
                toString: function () { return "group"; },
                remove: function () {},
                removeAll: function () {},
                create: function () {
                    return {
                        toString: function () {return "Sprite"; },
                        anchor: {
                            setTo: function () {}
                        },
                        scale: {
                        },
                        events: {
                            onInputOver: {
                                add: function () {}
                            },
                            onInputOut: {
                                add: function () {}
                            },
                            onInputUp: {
                                add: function () {}
                            }
                        },
                        bringToTop: function () {}
                    };
                }
            };
        },
        text: function () {
        },
        tween: function () {
            var obj = {
                to: function () {
                    return obj;
                },
                onComplete: {
                    add: function () {}
                }
            };
            return obj;
        }
    };
}

confirm = function () {

};

var mockGame = new MockGame();

var data = [
    3, 4, 2, 4, 2, 4, 0, 2, 2, 3,
    2, 2, 3, 2, 1, 3, 4, 2, 2, 4,
    1, 0, 4, 0, 3, 4, 2, 2, 0, 3,
    4, 3, 2, 2, 3, 4, 3, 3, 4, 4,
    2, 0, 4, 3, 1, 3, 1, 2, 2, 2,
    4, 2, 4, 4, 0, 4, 3, 1, 0, 0,
    0, 1, 4, 1, 3, 0, 2, 2, 0, 2,
    4, 2, 1, 3, 3, 3, 3, 0, 3, 4,
    2, 0, 4, 4, 3, 4, 3, 0, 4, 4,
    1, 0, 4, 4, 3, 3, 4, 3, 4, 0
];

var board = new Board(mockGame);
board.init();
board.startNextLevel(data);
console.log("groups", board.getGroups().length);
var groups = [];
var getNextGroupToPop = function () {
    var g, group;
    for (g = 0; g < groups.length; g++) {
        group = groups[g];
        if (group.length > 1) {
            return group;
        }
    }
    throw {error:"NoPoppableGroupsException", message: "No poppable group found"};
};
while (!board.noMoreMoves()) {
    groups = board.getGroups();
    var nextGroupToPop = getNextGroupToPop();
    var firstSlot = nextGroupToPop[0];
    console.log('popping', firstSlot.col, firstSlot.row);
    board.poke(firstSlot.col, firstSlot.row);
}
console.log('done, score', board.score);