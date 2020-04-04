var app = new PIXI.Application(480, 600, { backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

PIXI.loader
    .add('00', './img/M00_000.jpg')
    .add('01', './img/M01_000.jpg')
    .add('02', './img/M02_000.jpg')
    .add('03', './img/M03_000.jpg')
    .add('04', './img/M04_000.jpg')
    .add('05', './img/M05_000.jpg')
    .add('06', './img/M06_000.jpg')
    .add('07', './img/M07_000.jpg')
    .add('08', './img/M08_000.jpg')
    .add('09', './img/M09_000.jpg')
    .add('10', './img/M10_000.jpg')
    .add('11', './img/M11_000.jpg')
    .add('12', './img/M12_000.jpg')
    .load(onAssetsLoaded);

var REEL_WIDTH = 160;
var SYMBOL_SIZE = 150;

// onAssetsLoaded handler builds the example.
function onAssetsLoaded() {
    // Create different slot symbols.
    var slotTextures = [
        PIXI.Texture.fromImage('01'),
        // PIXI.Texture.fromImage('02'),
        // PIXI.Texture.fromImage('03'),
        // PIXI.Texture.fromImage('04'),
        // PIXI.Texture.fromImage('05'),
        // PIXI.Texture.fromImage('06'),
        // PIXI.Texture.fromImage('07'),
        // PIXI.Texture.fromImage('08'),
        // PIXI.Texture.fromImage('09'),
        PIXI.Texture.fromImage('10'),
        // PIXI.Texture.fromImage('11'),
        // PIXI.Texture.fromImage('12')
    ];

    // Build the reels
    var reels = [];
    var reelContainer = new PIXI.Container();
    for (var i = 0; i < 3; i++) {
        var rc = new PIXI.Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

        var reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter()
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        // Build the symbols
        for (var j = 0; j < 4; j++) {
            var symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
            // Scale the symbol to fit symbol area.
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }
        reels.push(reel);
    }
    app.stage.addChild(reelContainer);

    // Build top & bottom covers and position reelContainer
    var margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 3);
    var top = new PIXI.Graphics();
    top.beginFill(0, 1);
    top.drawRect(0, 0, app.screen.width, margin);
    var bottom = new PIXI.Graphics();
    bottom.beginFill(0, 1);
    bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);

    // Add play text
    var style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        }),
        style1 = new PIXI.TextStyle({fill: ['#ffffff']})
    ;

    var textHeder = {
        first: 'Slot Mashine',
        play: 'Play again!',
        win: 'YOU WIN!',
        notMoney: 'replenish account'
    }

    var playText = new PIXI.Text('Spin', style);
    playText.x = Math.round((bottom.width - playText.width) / 2);
    playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
    bottom.addChild(playText);

    var headerText = new PIXI.Text(textHeder.first, style);
    headerText.x = Math.round((top.width - headerText.width) / 2);
    headerText.y = Math.round((margin - headerText.height) / 2);
    top.addChild(headerText);

    var balanceText = new PIXI.Text('balance:',style1);
    var containerBalance = new PIXI.Container();

    var graphics = new PIXI.Graphics();

    var balanceCurent = 100;
    var balance = new PIXI.Text(balanceCurent, style1);

    var winContainer = new PIXI.Container();

    app.stage.addChild(bottom);
    app.stage.addChild(top);

    var addHedderText = function (text) {
        top.removeChild(headerText);
        headerText = new PIXI.Text(text, style);
        headerText.x = Math.round((top.width - headerText.width) / 2);
        headerText.y = Math.round((margin - headerText.height) / 2);
        top.addChild(headerText);
    }
    addHedderText(textHeder.play);

    var addBalance = function(){
        graphics.removeChild(balance);
        balance = new PIXI.Text(balanceCurent, style1)
        graphics.lineStyle(2, 0xFF00FF, 1);
        graphics.beginFill(0x650A5A, 0.5);
        graphics.drawRoundedRect(5, 35, 180, 40, 16);
        graphics.endFill();

        containerBalance.x = 0;
        containerBalance.y = 520;

        balanceText.x = 40;
        balanceText.y = 7;

        balance.x = graphics.width/2 - balance.width/2;
        balance.y = 44;

        containerBalance.addChild(balanceText);
        graphics.addChild(balance);
        containerBalance.addChild(graphics);
        app.stage.addChild(containerBalance);
    }
    addBalance();




    // Set the interactivity.
    playText.interactive = true;
    playText.buttonMode = true;
    playText.addListener('pointerdown', function() {
        startPlay();
    });

    var running = false;

    // Function to start playing.
    function startPlay() {
        if (running) return;
        running = true;
        if(balanceCurent<10){
            addHedderText(textHeder.notMoney);
            return false;
        }
        balanceCurent-=10;
        addBalance();
        removeLine();
        addHedderText('');

        for (var i = 0; i < reels.length; i++) {
            var r = reels[i];
            var extra = Math.floor(Math.random() * 3);
            tweenTo(r, 'position', r.position + 10 + i * 5 + extra, 2500 + i * 600 + extra * 600, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
        }
    }
    class Line extends PIXI.Graphics {
        constructor(points, lineSize, lineColor) {
            super();

            var s = this.lineWidth = lineSize || 7;
            var c = this.lineColor = lineColor || "0x000000";

            this.points = points;

            this.lineStyle(s, c)

            this.moveTo(points[0], points[1]);
            this.lineTo(points[2], points[3]);
        }
    }
    var line1 = new Line([475, 150, 5, 150]);
    var line2 = new Line([475, 300, 5, 300]);
    var line3 = new Line([475, 450, 5, 450]);
    function removeLine() {
        winContainer.removeChild(line1);
        winContainer.removeChild(line2);
        winContainer.removeChild(line3);
        app.stage.removeChild(winContainer);
    }

    var winRes = function (arrReels, ind) {
        return arrReels.filter(function (el) {
            return Math.floor(el.y) == ind;
        });
    }
    var winnerFun = function (el) {
        return el.every(function (e) {
            if(e.texture.textureCacheIds[1].indexOf(el[0].texture.textureCacheIds[1])>=0){
                return true;
            }
            return false;
        })
    }

    function reelsComplete() {
        var arrReels = [],
            winArr = []
        ;
        reels.forEach(function (el) {
            el.symbols.forEach(function (e) {
                arrReels.push(e);
            })
        });
        addHedderText(textHeder.play);
        for(var i=0; i<=300; i+=150){
            winArr.push(winRes(arrReels, i));
        }
        var winner = winArr.map(winnerFun);

        if(winner[0]){
            winContainer.addChild(line1);
            balanceCurent+=12;
            addBalance();
        }
        if(winner[1]){
            winContainer.addChild(line2);
            balanceCurent+=15;
            addBalance();
        }
        if(winner[2]){
            winContainer.addChild(line3);
            balanceCurent+=11;
            addBalance();
        }

        if(winner[0] || winner[1] || winner[2]){
            addHedderText(textHeder.win);
        }
        app.stage.addChild(winContainer)
        running = false;
    }

    // Listen for animate update.
    app.ticker.add(function(delta) {
        reels.forEach(function (el) {
            var r = el;
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            r.symbols.forEach(function (el, j) {
                var s = el;
                var prevy = s.y;
                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            })
        })
    });
}

// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
var tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    var tween = {
        object: object,
        property: property,
        propertyBeginValue: object[property],
        target: target,
        easing: easing,
        time: time,
        change: onchange,
        complete: oncomplete,
        start: Date.now()
    };

    tweening.push(tween);
    return tween;
}
// Listen for animate update.
app.ticker.add(function(delta) {
    var now = Date.now();
    var remove = [];
    tweening.forEach(function (t) {
        var phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            remove.push(t);
        }
    })

    for (var i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

// Basic lerp funtion.
function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

function backout(amount) {
    return function(t) {
        return (--t * t * ((amount + 1) * t + amount) + 1);
    };
}
