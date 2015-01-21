var Board = require('./board');
var testShim = require('./test-shim');

var mockGame = new testShim.MockGame();

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

function BruteForceTest(data) {
    var _data = data;

    function BoardState(board, path, parent) {
        var data = board.getState(),
            groups = board.getGroups(),
            level = board.level;

        var self = this;
        console.log('BoardState groups', groups.length);

        this.parent = parent;
        this.level = level;
        this.path = path === undefined ? [] : path;
        this.depth = self.path.length;
        this.data = data;
        this.groups = groups;
        this.paths = {};
        this.pathCount = undefined;
        this.optimalChoice = undefined;
        this.optimalPath = undefined;
        this.minScore = 0;
        this.maxScore = 0;

        this.getState = function (groupIndex) {
            console.log('getState', self.path, groupIndex, 'of', self.groups.length);
            var group = self.groups[groupIndex];
            var firstSlot = group[0];
            var key = getKey(firstSlot);
            if (self.paths.hasOwnProperty(key)) {
                console.log('returning', key);
                return self.paths[key];
            }
            console.log('returning undefined');
            return undefined;
        };

        this.setState = function (groupIndex, state) {
            var group = self.groups[groupIndex];
            var firstSlot = group[0];
            var key = getKey(firstSlot);
            console.log('getKey', key);
            if (self.paths.hasOwnProperty(key)) {
                throw { error: "PathExistsException", message: "State for path " + key + " already exists"}
            }
            self.paths[key] = state;
        };

        this.isResolved = function () {
            return self.optimalChoice !== undefined;
        };

//        this.idString = function () {
//            return 'level ' + self.level + ', '
//        }
    }

    var board = new Board(mockGame);
    board.init();
    board.startNextLevel(data);
    var state = new BoardState(board);

    var getKey = function (slot) {
//        console.log('getKey', slot);
        return slot.col + ',' + slot.row;
    };

    var runNextPath = function (forState) {
        var selectNext = function () {
            console.log('selecting...');
            var groups = forState.groups;
            var g, group, nextGroupState;
//            console.log('selectNext', groups[0].length, groups[1].length, groups[2].length);
            for (g = 0; g < groups.length; g++) {
                group = groups[g];
                if (group.length === 0) {
                    throw {error: "ZeroLengthGroupException", message: "Groups must have at least 1 slot"};
                }
                if (group.length === 1) {
                    continue; //shouldn't be able to pop these until supporting bombs
                }
                nextGroupState = forState.getState(g);
                if (nextGroupState !== undefined && nextGroupState.isResolved()) {
                    continue;
                }
                return {
                    groupIndex: g,
                    group: group,
                    state: nextGroupState
                };
            }
            throw {error:"NoPoppableGroupsException", message: "No poppable group found"};
        };

        board.startNextLevel(forState.data, forState.level, forState.score);

        var next = selectNext();
        console.log('got next', next);
        var firstSlot = next.group[0];
        console.log("poking", firstSlot.col, firstSlot.row, forState.depth, board.score);
        board.poke(firstSlot.col, firstSlot.row);
        var newPath = forState.path.splice();
        newPath.push(next.groupIndex);
        forState.setState(next.groupIndex, new BoardState(board, newPath, forState))
    };

    var resolve = function (state) {
        while (iter++ < 100 && !state.isResolved()) {
            console.log('run', iter);
            runNextPath(state);
        }
    };

    var iter = 0;

    this.run = function () {
        resolve(state);
    };
}

var bruteForceTest = new BruteForceTest(data);
bruteForceTest.run();
