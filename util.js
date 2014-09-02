var config = require('./config');

var getPosition = function (r, c) {
    return {
        x: c * config.ColWidth,
        y: (-r + 10) * config.RowHeight
    };
};

function getRandomColor() {
    return Math.floor(Math.random() * 5);
}

module.exports = {
    getPosition: getPosition,
    getRandomColor: getRandomColor
};