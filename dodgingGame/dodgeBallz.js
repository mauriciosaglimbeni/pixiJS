class Circle {
    constructor(color, radius, v) {
        this.radius = radius;
        this.v = v;

        let circle = new PIXI.Graphics();
        circle.beginFill(color);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        circle.x = radius;
        circle.y = radius;
        app.stage.addChild(circle);

        this.circle = circle;
    }

    remove() {
        app.stage.removeChild(this.circle);
    }

    collide(other) {
        let dx = other.circle.x - this.circle.x;
        let dy = other.circle.y - this.circle.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        return dist < (this.radius + other.radius);
    }
}

class Monster extends Circle {
    update() {
        this.circle.className = "monster";
        this.circle.x += this.v.x;
        this.circle.y += this.v.y;

        if (this.circle.x >= w-this.radius) {
            shake("right");
            this.v.x *= -1;
        }

        else if (this.circle.x <= this.radius) {
            shake("left");
            this.v.x *= -1;
        }

        if (this.circle.y >= h-this.radius) {
            shake("down");
            this.v.y *= -1;
        }
        else if (this.circle.y <= this.radius) {
            shake("up");
            this.v.y *= -1;
        }
        
    }
}

class Player extends Circle {
    constructor(color, radius, v) {
        super(color, radius, v);
        this.reset();
    }

    reset() {
        this.circle.x = w/2;
        this.circle.y = h/2;
        this.speed = 3;
    }

    update() {
        let x = this.circle.x + this.v.x;
        let y = this.circle.y + this.v.y;

        this.circle.x = Math.min(Math.max(x, this.radius), w-this.radius);
        this.circle.y = Math.min(Math.max(y, this.radius), w-this.radius);

        
        monsters.forEach(m => {
            if (this.collide(m)) {
                alert("You lose!")
                reset();
                return;
            }
        });

        // // coin
        if (this.collide(coin)) {
            updateCoins(coins+1);
            coin.random();
            addMonster();
            if(this.speed < 15){
                this.speed = this.speed + 0.2;
                ClickEvent("coins");
            }else{
                ClickEvent("coins");
            }            
            return;
        }
    }
}

class Coin extends Circle {
    random() {
        this.circle.x = this.radius + Math.random()*(w - 2*this.radius);
        this.circle.y = this.radius + Math.random()*(h - 2*this.radius);
    }

    update() {
         let s = 1 + Math.sin(new Date() * 0.01) * 0.2;
        this.circle.scale.set(s, s);
    }
}


function shake(className) {
    return;

   app.view.className = className;
   setTimeout(()=>{app.view.className = ""}, 50);
}

function addMonster() {
    monsters.push(new Monster(0xBB3838, Math.random()*10 + 10, {x:2 + Math.random(), y:2 + Math.random()}));
}

function onkeydown(ev) {
    switch (ev.key) {
        case "ArrowLeft":
        case "a":
            player.v.x = -player.speed; 
            pressed['left'] = true;
            break;

        case "ArrowRight":
        case "d":
            player.v.x = player.speed;
            pressed['right'] = true;
            break;

        case "ArrowUp":
        case "w":
            player.v.y = -player.speed;
            pressed['up'] = true;
            break;

        case "ArrowDown": 
        case "s":
            player.v.y = player.speed;
            pressed['down'] = true;
            break;
        case "Escape":
            endGame();
            break;
    }
}
function onkeyup(ev) {
    switch (ev.key) {
        case "ArrowLeft": 
        case "a":
            player.v.x = pressed['right']?player.speed:0; 
            pressed['left'] = false;
            break;

        case "ArrowRight": 
        case "d":
            player.v.x = pressed['left']?-player.speed:0; 
            pressed['right'] = false;
            break;

        case "ArrowUp": 
        case "w":
            player.v.y = pressed['down']?player.speed:0; 
            pressed['up'] = false;
            break;

        case "ArrowDown": 
        case "s":
            player.v.y = pressed['up']?-player.speed:0; 
            pressed['down'] = false;
            break;
    }
}

function setupControls() {
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);
}

function reset() {
    monsters.forEach(m => {
        m.remove();
    });

    monsters = [];
    addMonster();
    player.reset();
    coin.random();
    updateCoins(0);
}

function updateCoins(num) {
    coins = num;
    document.querySelector('#score span').innerHTML = coins;
}

function gameLoop() {
    player.update();
    coin.update();
    monsters.forEach(c => {
        c.update();
    });
}

// resize
window.onresize = () => {
    let d = document.querySelector("#canvas");
    w = d.clientWidth;
    h = w;
    app.renderer.resize(w, h);
    reset();
}

// leaderboard

function startGame(){
    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "initial"
    int = setInterval(gameLoop, 1000/60);
    app.renderer.backgroundColor = 0x1A1A17;
    document.querySelector("#canvas").appendChild(app.view);
    setupControls();
    window.onresize();
}

function endGame(){
    clearInterval(int);
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("titleScreen").style.display = "flex"
    document.getElementById("titleScreen").style.alignSelf = "center";
    reset();
}
    var w = 512, h=512;
    var app = new PIXI.Application({width: w, height: h, antialias:true});
    var monsters = [];
    var pressed = {};
    var player = new Player(0xfcf8ec, 10, {x:0, y:0});
    var coin = new Coin(0xF8F160, 10, {x:0, y:0});
    var coins;
    var players = [];

    
document.getElementById('str').addEventListener("click",startGame);