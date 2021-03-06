//main menu for play button etc..
var mainMenuState = {
    preload: function () {
        game.load.image('player', 'assets/player.png');
        game.load.image('coin', 'assets/coin.png');
        game.load.image('building', 'assets/building.jpg');
        game.load.image('dog', 'assets/dog.jpg');
        game.load.audio('soundtrack', 'assets/soundtrack.mp3');
        game.load.audio('dogbarking', 'assets/dogbarking.mp3');
        game.load.video('testvideo', 'assets/testvideo.mp4');
        game.load.image('aqua', 'assets/aqua.png');

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

        this.angerCounter=0;
        this.speed = 700;
        var rand;
        var coinGroup;
        this.dogAppeared = false;
        this.dogCounter = 0;
        this.score = 0;
        this.anger = 0; // to calculate om 7amada anger!


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

        //Create Player
        this.player = game.add.sprite(650, 700, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        //player.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        //player.body.bounce.setTo(0.5, 0.5);
        //player.body.gravity.y = 5000;
        this.player.body.collideWorldBounds = true;
        // this.player.body.checkCollision.up = true;
        // this.player.body.checkCollision.left = true;
        // this.player.body.checkCollision.right = true;
        //this.player.body.immovable = true;             //hat2sr 3 el 7arka?

        //coin group
        // changed coin group instead of random generating an endless array 
        // i made a group of 10 elements that loop
        this.coinGroup = game.add.group();
        this.coinGroup.physicsEnabled = true
        this.coinGroup.enableBody = true;
        this.coinGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.coinGroup.scale.set(0.5, 0.5);
        for(var i=0;i<10;i++)
        {
            rand = Math.ceil(Math.random() * 1750) + 500;
            this.coinGroup.create(rand, 0, 'coin', 0);
            this.coinGroup.children[i].anchor.setTo(0.5, 0.5);
            this.speed = Math.ceil(Math.random() * 350) + 200;
            this.coinGroup.children[i].body.velocity.y = this.speed;
        }

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

        //create score
        this.scoreText = game.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        //create anger 
        this.angerText = game.add.text(500, 16, 'Anger: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        this.soundTrack = game.add.audio('soundtrack');
        this.dogBarking = game.add.audio('dogbarking');
        game.sound.setDecodedCallback([this.soundTrack, this.dogBarking], this.StartSound, this);
    },

    update: function () {
        //        this.liveimg=this.coinGroup.children.filter(function(e) {  return e.alive});
        this.progress.clear();
        this.progress = game.add.graphics(0, 0);
        this.progress.lineStyle(2, '0x000000');
        this.progress.beginFill('0x000000', 100);
        this.progress.drawRoundedRect(10, 50, 300, 27, 10);
        this.progress.endFill();
        this.progress.beginFill('0x999999', 1); //For drawing progress
        // the original image width in pixels
        // then on updateprogress.width = percentDone*progress.initialWidth;
        // percentDone should be in decimals 20% = 0.2
        // so this will finaly result in 1 * 300 = 100%
<<<<<<< HEAD
        /*
        this.progress.drawRoundedRect(11, 51, this.score * 0.2, 25, 10);
        let random = Math.floor(Math.random() * 100) + 1; //need to modify
=======
        this.progress.drawRoundedRect(11, 51, this.score, 25, 10);
        let random = Math.floor(Math.random() * 1) + 1; //need to modify
>>>>>>> 6e2a11a00c85a851fddaaa8975555d44e283d30c
        if (random == 1) {
             // random number for coin boundries solved here
            this.coinGroup.create(rand, 0, 'coin', 0);
            this.coinGroup.children[this.coinGroup.children.length - 1].anchor.setTo(0.5, 0.5);
        }
        */
        //console.log(this.coinGroup.children.filter(function(e) {  return e.alive})); // this is to count live "unkilled" children

        this.movePlayer();
        this.moveCoin();
    },
    StartSound: function () {
        this.soundTrack.loopFull();
    },

    movePlayer: function () {
        this.player.x = game.input.mousePointer.x;
        game.physics.arcade.collide(this.player, this.coin);
        if (this.player.body.blocked.left)
            this.player.body.velocity.x = 0;

        if (this.player.body.x < 1130 && this.player.body.x > 1115 && this.dogCounter == 0) {
            this.dog.x = 1150;
            this.dogAppeared = true;
            this.dog.scale.setTo(0.5, 0.5);
            this.dogBarking.play();
            this.anger += 1;
            this.angerText.text = 'Anger: ' + this.anger;
        }

        if (this.player.body.x < 230 && this.player.body.x > 210 && this.dogCounter == 0) {
            this.dog.x = 150;
            this.dogAppeared = true;
            this.dog.scale.setTo(-0.5, 0.5);
            this.dogBarking.play();
            this.anger += 1;
            this.angerText.text = 'Anger: ' + this.anger;
        }

        if (this.dogAppeared) {
            //check anger condition!!
            if (this.anger === 5) {
                this.state.start('end');
            }

            this.dogCounter++;
            if (this.dogCounter == 120) {
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
            if (game.physics.arcade.overlap(this.player, this.coinGroup.children[i])) {

                //this.coinGroup.children[i].kill();
                this.score += 1;
                this.scoreText.text = 'Score: ' + this.score;
                this.coinGroup.children[i].body.touching.down = false;
                rand = Math.ceil(Math.random() * 1750) + 500;
                this.coinGroup.children[i].x=rand;
                this.coinGroup.children[i].y=0;
                this.speed = Math.ceil(Math.random() *350) + 200;
                this.coinGroup.children[i].body.velocity.y = this.speed;


            }
            if(this.coinGroup.children[i].body.y>700)
            {
                //  this.coinGroup.children[i].kill();
                this.angerCounter+=1;
                rand = Math.ceil(Math.random() * 1750) + 500;
                this.coinGroup.children[i].x=rand;
                this.coinGroup.children[i].y=0;
                this.speed = Math.ceil(Math.random() *350) + 200;
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
    preload: function () {
    },

    create: function () {
        //create end statment
        this.endStatement = game.add.text(500, 150, 'Y5aybak ya 7amada!', {
            fontFamily: 'Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif',
            fontSize: '32px',
            fill: '#000'
        });

        this.createButton(game, "Replay", game.world.centerX, game.world.centerY+ 32, 300, 100, function () {
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