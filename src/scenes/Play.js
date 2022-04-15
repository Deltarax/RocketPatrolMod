class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('fastship', './assets/fast_ship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('stars', './assets/stars.png');
        this.load.image('starsFast', './assets/stars_fast.png');
        this.load.image('planet', './assets/planet.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('animatedShip', './assets/rocketship_ani.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 2});

        // load particles
        this.load.atlas('flares', './assets/flares.png', './assets/flares.json');
    }

    create() {
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'shipanim',
            frames: this.anims.generateFrameNumbers('animatedShip', { start: 0, end: 2, first: 0}),
            frameRate: 3,
            repeat: -1
        });

        // place tile sprite
        this.planet = this.add.tileSprite(0, 0, 640, 480, 'planet').setOrigin(0, 0);
        this.stars = this.add.tileSprite(0, 0, 640, 480, 'stars').setOrigin(0, 0);
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starsFast').setOrigin(0, 0);

        // add Spaceships (x3)
        this.fastShip = new Spaceship(this, game.config.width + borderUISize*8, borderUISize*4, 'fastship', 0, 100, true).setOrigin(0, 0);
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'animatedShip', 0, 30, false).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'animatedShip', 0, 20, false).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'animatedShip', 0, 10, false).setOrigin(0,0);

        // Ship animations
        this.ship01.play('shipanim');
        this.ship02.play('shipanim');
        this.ship03.play('shipanim');

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        //30-second speedup clock
        this.speedClock = this.time.delayedCall(game.settings.gameTimer/2, () => {
            this.ship03.moveSpeed += 1;
            this.ship02.moveSpeed += 2;
            this.ship01.moveSpeed += 3;
            this.fastShip.moveSpeed += 8;
        }, null, this);

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.showClock = this.add.text(borderUISize + borderPadding*12, borderUISize + borderPadding*2, this.clock, scoreConfig)
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

    }

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.planet.tilePositionX -= 1;  // update tile sprite
        this.stars.tilePositionX -= 4;  // update tile sprite
        this.starfield.tilePositionX -= 2;  // update tile sprite

        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.fastShip.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.fastShip)) {
            this.p1Rocket.reset();
            this.shipExplode(this.fastShip);
        }

        
        this.showClock.text = this.clock.getRemainingSeconds() - (this.clock.getRemainingSeconds()%1);
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;        
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });

        // Creating the particle explosion
        var particles = this.add.particles('flares');
        particles.createEmitter({
            frame: 'green',
            x: ship.x+20, y: ship.y+10,
            lifespan: { min: 600, max: 800 },
            angle: { start: 0, end: 360, steps: 64 },
            speed: 200,
            quantity: 64,
            scale: { start: 0.2, end: 0.1 },
            frequency: 32,
            blendMode: 'ADD'
        });
        // deletes explosion after 3 seconds
        this.explosionTime = this.time.delayedCall(300, () => {
            particles.destroy();
        }, null, this);


        // score add and repaint
        this.p1Score += ship.points;
        this.clock.delay += 3000
        this.scoreLeft.text = this.p1Score; 
        
        this.sound.play('sfx_explosion');
      }
}