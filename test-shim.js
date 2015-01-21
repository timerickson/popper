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

alert = function () {
    console.log.apply(console, arguments);
};

module.exports.MockGame = MockGame;