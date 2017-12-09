//main menu for play button etc..
var mainMenuState = {
    preload: function () {
        game.load.image('player', 'assets/player.png');
        // game.load.image('coin', 'assets/coin.png');
        game.load.spritesheet('coin', 'assets/coin.png', 100, 100);
        game.load.image('building', 'assets/building.jpg');
        game.load.image('dog', 'assets/dog.jpg');
        game.load.audio('soundtrack', 'assets/soundtrack.mp3');
        game.load.audio('dogbarking', 'assets/dogbarking.mp3');
        game.load.video('testvideo', 'assets/testvideo.mp4');
        game.load.image('aqua', 'assets/aqua.png');
        game.load.image('GBone', 'assets/Golden Bone.png');

    },

    create: function () {
        this.createButton(game, "Play", game.world.centerX, game.world.centerY + 32, 300, 100, function () {
            //this.state.start('video');
            this.state.start('main');
        });

    },

    update: function () {

    },
    createButton: function (game, string, x, y, w, h, callback) {
        var button1 = game.add.button(x, y, 'aqua', callback, this, 2, 1, 0);
        button1.anchor.setTo(0.5, 0.5);
        button1.width = w;
        button1.height = h;

        var txt = game.add.text(button1.x, button1.y, string, {
            font: "14px arial",
            fill: "#fff",
            align: "center"
        });
        txt.anchor.setTo(0.5, 0.5);
    }
}
//var progress;
// main state for game itself
var mainState = {

    preload: function () {
        //game.load.image('background', 'assets/Parallex.jpeg');

        //this.preloadBar = game.add.graphics(0, 0);
        //this.preloadBar.lineStyle(3, '0xffffff', 1);
        //this.preloadBar.moveTo(0, 0);
        //this.preloadBar.lineTo(game.width, 0);
        //this.preloadBar.scale.x = 0;
        // set the bar to the beginning position}function loadUpdate() { 
        // every frame during loading, set the scale.x of the bar to the progress (an integer between 0  
        // and 100) divided by 100 to give a float between 0 and 1  this.preloadBar.scale.x = game.load.progress * 0.

        this.progress = game.add.graphics(0, 0);
        this.progress.lineStyle(2, '0x000000');
        this.progress.beginFill('0x000000', 100);
        this.progress.drawRoundedRect(10, 50, 300, 27, 10);
        this.progress.endFill(150);
        this.progress.beginFill('0x999999', 1); //For drawing progress
    },

    create: function () {
        this.angerCounter = 0;
        this.speed = 700;
        var rand;
        var coinGroup;
        this.dogAppeared = false;
        this.dogCounter = 0;
        this.score1 = 0;
        this.score2 = 0;
        this.anger = 0; // to calculate om 7amada anger!
        this.jumpCounter1 = 0;
        this.jumpCounter2 = 0;
        this.GBoneTaken = false;
        this.GBoneCounter = 0;

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.startFullScreen(false);
        //Set Background and Center Game
        game.stage.backgroundColor = '#FFFFFF';

        //game.world.setBounds(0, 0, 3840, 1080);
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.refresh();

        // create Building
        this.building = game.add.sprite(675, 400, 'building');
        this.building.anchor.setTo(0.5, 0.5);
        this.building.width = 900;

        //creating Golden Bone
        this.GBone = game.add.sprite(675, -100, 'GBone');
        this.GBone.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.GBone);
        //this.GBone.scale.set(0.5,0.5);
        this.GBone.width = 100;
        this.GBone.height = 100;

        //Create Player1
        // this.player1 = game.add.sprite(650, 700, 'player');
        // this.player1.anchor.setTo(0.5, 0.5);
        // //player.scale.setTo(0.5, 0.5);
        // game.physics.arcade.enable(this.player1);
        // //player.body.bounce.setTo(0.5, 0.5);
        // //player.body.gravity.y = 5000;
        // this.player1.body.collideWorldBounds = true;
        // // this.player.body.checkCollision.up = true;
        // // this.player.body.checkCollision.left = true;
        // // this.player.body.checkCollision.right = true;
        // //this.player.body.immovable = true;             //hat2sr 3 el 7arka?

        // //create Player2
        // this.player2 = game.add.sprite(650, 700, 'player');
        // this.player2.anchor.setTo(0.5, 0.5);
        // game.physics.arcade.enable(this.player2);
        // this.player2.body.collideWorldBounds = true;

        //trying to creat players group unstead of creating 2 players statically
        this.playersGroup = game.add.group();
        this.playersGroup.physicsEnabled = true;
        this.playersGroup.enableBody = true;
        this.playersGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.playersGroup.collideWorldBounds = true;

        for (let i = 0; i < 2; i++) {
            this.playersGroup.create(650, 700, 'player');
            this.playersGroup.children[i].anchor.setTo(0.5, 0.5);
        }

        //coin group
        // changed coin group instead of random generating an endless array 
        // i made a group of 10 elements that loop
        this.coinGroup = game.add.group();
        this.coinGroup.physicsEnabled = true
        this.coinGroup.enableBody = true;
        this.coinGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.coinGroup.scale.set(0.5, 0.5);
        for (var i = 0; i < 10; i++) {
            rand = Math.ceil(Math.random() * 1750) + 500;
            this.coinGroup.create(rand, 0, 'coin', 0);
            this.coinGroup.children[i].anchor.setTo(0.5, 0.5);
            this.speed = Math.ceil(Math.random() * 350) + 200;
            this.coinGroup.children[i].body.velocity.y = this.speed;
            this.coinGroup.children[i].scale.setTo(0.85, 0.85);

        }
        this.coinGroup.callAll('animations.add', 'animations', 'moveCoin', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
        this.coinGroup.callAll('play', null, 'moveCoin');

        //coinGroup.children[0].body.collideWorldBounds=false;
        //coinGroup.children[0].scale.setTo(0.5,0.5);

        //create coin
        /*
	coin = game.add.sprite(rand, 0, 'coin');
	coin.anchor.setTo(0.5, 0.5);
	coin.scale.setTo(0.5, 0.5);
	game.physics.arcade.enable(coin);
	coin.body.collideWorldBounds = false;
    */
        // coin.body.immovable = false;
        // coin.body.moves = true;

        //create she7abr
        this.dog = game.add.sprite(-150, 670, 'dog');
        //dog.flipX = true;
        this.dog.anchor.setTo(0.5, 0.5);
        this.dog.scale.setTo(-0.5, 0.5);

        //create score1 & score2
        this.score1Text = game.add.text(16, 16, 'Player1 \'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        this.score2Text = game.add.text(1000, 16, 'Player2 \'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });


        //create anger 
        this.anger1Text = game.add.text(500, 16, 'Anger: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        //this.Jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.soundTrack = game.add.audio('soundtrack');
        this.dogBarking = game.add.audio('dogbarking');
        game.sound.setDecodedCallback([this.soundTrack, this.dogBarking], this.StartSound, this);
    },

    update: function () {
        this.liveimg = (this.coinGroup.children.filter(function (e) {
            return e.alive
        }).length) * 3;
        this.progress.clear();
        this.progress = game.add.graphics(0, 0);
        this.progress.lineStyle(2, '0x000000');
        this.progress.beginFill('0x000000', 100);
        this.progress.drawRoundedRect(10, 50, 300, 27, 10);
        this.progress.endFill();
        //<<<<<<< HEAD
        if (this.liveimg < 100)
            this.progress.beginFill('0x07E507', 1);
        if (this.liveimg < 200 && this.liveimg > 100)
            this.progress.beginFill('0xFFFF00', 1);
        if (this.liveimg > 200)
            this.progress.beginFill('0xFF0000', 1); //For drawing progress
        if (this.liveimg == 300)
            alert("y5aybak ya 7amada !");
        //            this.progress.clear();

        this.progress.drawRoundedRect(11, 51, this.liveimg, 25, 10);
        let random = Math.floor(Math.random() * 10) + 1; //need to modify
        if (random == 5) {
            this.progress.beginFill('0x999999', 1); //For drawing progress
        }
        this.PowerUp();
        this.movePlayer();
        this.moveCoin();
    },
    StartSound: function () {
        this.soundTrack.loopFull();
    },
    PowerUp: function () {
        var random = 3 //Math.ceil(Math.random() * 100) + 1;
        if (random == 3 && this.GBone.body.y == -150) {
            random = Math.floor(Math.random() * (600 - 225 + 1) + 500);
            this.GBone.body.x = random;
            this.GBone.body.y = 0;
            this.boneSpeed = Math.ceil(Math.random() * 350) + 200;
            this.GBone.body.velocity.y = this.boneSpeed;
        }
        if (game.physics.arcade.overlap(this.playersGroup.children[0], this.GBone)) {
            this.GBoneTaken = true;
            this.GBoneCounter += 1;
            this.GBone.body.y = -300;
            this.GBone.body.velocity.y = 0;
        }
        if (game.physics.arcade.overlap(this.playersGroup.children[1], this.GBone)) {
            this.GBoneTaken = true;
            this.GBoneCounter += 1;
            this.GBone.body.y = -300;
            this.GBone.body.velocity.y = 0;
        }
        if (this.GBoneCounter != 0) {
            this.GBoneCounter += 1;
        }
        if (this.GBoneCounter == 300) {
            this.GBoneTaken = false;
            this.GBoneCounter = 0;
            this.GBone.body.y = -150;
        }
        if (this.GBone.body.y > 700) {
            this.GBone.body.y = -150;
            this.GBone.body.velocity.y = 0;
        }

    },

    movePlayer: function () {
        //  this.playersGroup.children[0].x = game.input.mousePointer.x;
        //cursors for player1
        cursor1 = game.input.keyboard.createCursorKeys();
        //wasd for player2
        upButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
        rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
        leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);

        //player1 controls
        if (cursor1.left.isDown)
            this.playersGroup.children[0].body.velocity.x = -200;
        else if (cursor1.right.isDown)
            this.playersGroup.children[0].body.velocity.x = 200;
        else
            this.playersGroup.children[0].body.velocity.x = 0

        //player2 controls
        if (leftButton.isDown)
            this.playersGroup.children[1].body.velocity.x = -200;

        else if (rightButton.isDown)
            this.playersGroup.children[1].body.velocity.x = 200;
        else
            this.playersGroup.children[1].body.velocity.x = 0;

        //Jump handling for player1
        if (cursor1.up.isDown && this.jumpCounter1 == 0) {
            this.playersGroup.children[0].body.velocity.y = -300;
            this.jumpCounter1++;

        } else if (this.jumpCounter1 == 30) {
            this.jumpCounter1 = 0;
            this.playersGroup.children[0].body.velocity.y = 200;
        } else if (this.jumpCounter1 != 0) {
            this.jumpCounter1++;
        }
        //jump ahndling for playre2
        if (upButton.isDown && this.jumpCounter2 == 0) {
            this.playersGroup.children[1].body.velocity.y = -200;
            this.jumpCounter2++;
        } else if (this.jumpCounter2 == 30) {
            this.jumpCounter2 = 0;
            this.playersGroup.children[1].body.velocity.y = 200;
        } else if (this.jumpCounter2 != 0) {
            this.jumpCounter2++;
        }

        //game.physics.arcade.collide(this.player, this.coin);
        if (this.playersGroup.children[0].body.blocked.left)
            this.playersGroup.children[0].body.velocity.x = 0;

        if (this.playersGroup.children[1].body.blocked.left)
            this.playersGroup.children[1].body.velocity.x = 0;

        if (this.playersGroup.children[0].body.x < 1130 && this.playersGroup.children[0].body.x > 1115 && this.dogCounter == 0 && this.GBoneTaken == false) {
            this.dog.x = 1150;
            this.dogAppeared = true;
            this.dog.scale.setTo(0.5, 0.5);
            this.dogBarking.play();
            this.anger += 1;
            this.anger1Text.text = 'Anger: ' + this.anger;
        }
        //dog appearnce with player1 & player2
        if (this.playersGroup.children[1].body.x < 1130 && this.playersGroup.children[1].body.x > 1115 && this.dogCounter == 0 && this.GBoneTaken == false) {
            this.dog.x = 1150;
            this.dogAppeared = true;
            this.dog.scale.setTo(0.5, 0.5);
            this.dogBarking.play();
            this.anger += 1;
            this.anger1Text.text = 'Anger: ' + this.anger;
        }

        if (this.playersGroup.children[0].body.x < 230 && this.playersGroup.children[0].body.x > 210 && this.dogCounter == 0 && this.GBoneTaken == false) {
            this.dog.x = 150;
            this.dogAppeared = true;
            this.dog.scale.setTo(-0.5, 0.5);
            this.dogBarking.play();
            this.anger += 1;
            this.anger1Text.text = 'Anger: ' + this.anger;
        }

        if (this.playersGroup.children[1].body.x < 230 && this.playersGroup.children[1].body.x > 210 && this.dogCounter == 0 && this.GBoneTaken == false) {
            this.dog.x = 150;
            this.dogAppeared = true;
            this.dog.scale.setTo(-0.5, 0.5);
            this.dogBarking.play();
            this.anger += 1;
            this.anger1Text.text = 'Anger: ' + this.anger;
        }

        if (this.dogAppeared) {
            //check anger condition!!
            if (this.anger === 5) {
                this.soundTrack.stop();
                this.state.start('end');
            }

            this.dogCounter++;
            if (this.dogCounter == 30) {
                this.dog.x = -150;
                this.dogCounter = 0;
                this.dogAppeared = false;

            }
        }



    },

    moveCoin: function () {

        for (var i = 0, len = this.coinGroup.children.length; i < len; i++) {
            //changed some stuff here so that if a coin has collided with hamada or reached bottom
            //it reappears on the top and it's speed is random generated
            if (game.physics.arcade.overlap(this.playersGroup.children[0], this.coinGroup.children[i])) {

                //this.coinGroup.children[i].kill();
                this.score1 += 1;
                this.score1Text.text = 'Player1\'s Score: ' + this.score1;
                this.coinGroup.children[i].body.touching.down = false;
                rand = Math.ceil(Math.random() * 1750) + 500;
                this.coinGroup.children[i].x = rand;
                this.coinGroup.children[i].y = 0;
                this.speed = Math.ceil(Math.random() * 350) + 200;
                this.coinGroup.children[i].body.velocity.y = this.speed;
            } else if (game.physics.arcade.overlap(this.playersGroup.children[1], this.coinGroup.children[i])) {
                this.score2 += 1;
                this.score2Text.text = 'player2\'s Score: ' + this.score2;
                this.coinGroup.children[i].body.touching.down = false;
                rand = Math.ceil(Math.random() * 1750) + 500;
                this.coinGroup.children[i].x = rand;
                this.coinGroup.children[i].y = 0;
                this.speed = Math.ceil(Math.random() * 350) + 200;
                this.coinGroup.children[i].body.velocity.y = this.speed;
            }



            if (this.coinGroup.children[i].body.y > 700) {
                //  this.coinGroup.children[i].kill();
                this.angerCounter += 1;
                rand = Math.ceil(Math.random() * 1750) + 500;
                this.coinGroup.children[i].x = rand;
                this.coinGroup.children[i].y = 0;
                this.speed = Math.ceil(Math.random() * 350) + 200;
                this.coinGroup.children[i].body.velocity.y = this.speed;
            }


        }

    },
    // collisionHandler: function (player, coinGroup) {
    // },
};

// state for video 
var videoState = {
    preload: function () {},
    create: function () {
        testVideo = game.add.video('testvideo');
        testVideo.play(true);
        testVideo.addToWorld(0, 0, 0, 0, 2.2, 2);
        testVideo.loop = false;
        timer = game.time.create();
        // Create a delayed event 1m and 30s from now
        timerEvent = timer.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 1, this.endTimer, this);
        // Start the timer
        timer.start();
    },

    endTimer: function () {
        timer.stop();
        this.state.start('main');
    }
}

var endMenuState = {
    preload: function () {},

    create: function () {
        //create end statment
        this.endStatement = game.add.text(500, 150, 'Y5aybak ya 7amada!', {
            fontFamily: 'Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif',
            fontSize: '32px',
            fill: '#000'
        });

        this.createButton(game, "Replay", game.world.centerX, game.world.centerY + 32, 300, 100, function () {
            //this.state.start('video');
            this.state.start('main');
        });
    },

    createButton: function (game, string, x, y, w, h, callback) {
        var button1 = game.add.button(x, y, 'aqua', callback, this, 2, 1, 0);
        button1.anchor.setTo(0.5, 0.5);
        button1.width = w;
        button1.height = h;

        var txt = game.add.text(button1.x, button1.y, string, {
            font: "14px arial",
            fill: "#fff",
            align: "center"
        });
        txt.anchor.setTo(0.5, 0.5);
    },
}

var game = new Phaser.Game(1360, 720, Phaser.AUTO, '', );
game.state.add('menu', mainMenuState);
game.state.add('main', mainState);
game.state.add('video', videoState);
game.state.add('end', endMenuState);
game.state.start('menu');