//main menu for play button etc..
var mainMenuState = {
    preload: function () {
        game.load.image('player', 'assets/player.png');
        // game.load.image('coin', 'assets/coin.png');
        game.load.spritesheet('coin', 'assets/coin.png',100,100);
        game.load.image('building', 'assets/building.jpg');
        game.load.image('dog', 'assets/dog.png');
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
        this.progress.beginFill('0x000000', 0);
        this.progress.drawRoundedRect(10, 50, 300, 27, 10);
        this.progress.endFill();
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
        this.jumpCounter=0;
        this.GBoneTaken=false;
        this.GBoneCounter=0;


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
            this.coinGroup.children[i].scale.setTo(0.85, 0.85);

        }
        this.coinGroup.callAll('animations.add', 'animations', 'moveCoin', [0,1,2,3,4,5,6,7,8,9], 10, true);
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
        this.Jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.soundTrack = game.add.audio('soundtrack');
        this.dogBarking = game.add.audio('dogbarking');
        game.sound.setDecodedCallback([this.soundTrack, this.dogBarking], this.StartSound, this);
    },
    progressbar_score:function(){
         this.progress.clear();
        this.progress = game.add.graphics(0, 0);
        this.progress.lineStyle(2, '0x000000');
        this.progress.beginFill('0x000000');
        this.progress.drawRoundedRect(10, 50, 300, 27, 11);
        this.progress.endFill();
        //<<<<<<< HEAD
        if (this.score < 20)
            this.progress.beginFill('0xFF0000', 1);
        if (this.score <= 50 && this.score >= 20)
            this.progress.beginFill('0xFFFF00', 1);
         //if (this.score == 50)                    //will do something later
          //  console.log("y5aybak ya 7amada !");
        if (this.score > 50)
            this.progress.beginFill('0x07E507', 1); //For drawing progress
        if(this.score==100){
            
        }
       
        this.progress.drawRoundedRect(12, 51, this.score*3, 25, 10);
    },

    update: function () {
        this.liveimg = (this.coinGroup.children.filter(function (e) {return e.alive}).length) * 3;
       this.progressbar_score();
        //            this.progress.clear();

    //        let random = Math.floor(Math.random() * 10) + 1; //need to modify
    //        if (random == 5) {
    //            this.progress.beginFill('0x999999', 1); //For drawing progress
    //        }
        this.PowerUp();
        this.movePlayer();
        this.moveCoin();
    },
    StartSound: function () {
        this.soundTrack.loopFull();
    },
    PowerUp:function(){
        var random = Math.ceil(Math.random() * 100000) + 1;
        this.GBone.angle+=1;
        if(random==3 && this.GBone.body.y==-150)
        {
            random = Math.floor(Math.random() * (600-225+1)+ 500) ;
            this.GBone.body.x=random;
            this.GBone.body.y=0;
            this.boneSpeed = Math.ceil(Math.random() *350) + 200;
            this.GBone.body.velocity.y = this.boneSpeed;
        }
        if( game.physics.arcade.overlap(this.player, this.GBone))
        {
            this.GBoneTaken=true;
            this.GBoneCounter+=1;
            this.GBone.body.y=-300;
            this.GBone.body.velocity.y=0;

        }
        if(this.GBoneCounter!=0)
        {
            this.GBoneCounter+=1;
           
        }
        if(this.GBoneCounter==300)
        {
            this.GBoneTaken=false;
            this.GBoneCounter=0;
            this.GBone.body.y=-150;
        }
        if(this.GBone.body.y>700)
        {
            this.GBone.body.y=-150;
            this.GBone.body.velocity.y=0;
        }

    },

    movePlayer: function () {
        this.player.x = game.input.mousePointer.x;
        //Jump handling
        if(this.Jump.isDown&&this.jumpCounter==0)
        {
            this.player.body.velocity.y=-300;
            this.jumpCounter++;

        }
        else if(this.jumpCounter==30)
        {
            this.jumpCounter=0;
            this.player.body.velocity.y=200;
        }
        else if(this.jumpCounter!=0)
        {
            this.jumpCounter++;
        }
        //game.physics.arcade.collide(this.player, this.coin);
        if (this.player.body.blocked.left)
            this.player.body.velocity.x = 0;

        if (this.player.body.x < 1130 && this.player.body.x > 1115 && this.dogCounter == 0 &&  this.GBoneTaken==false) {
            this.dog.x = 1150;
            this.dogAppeared = true;
            this.dog.scale.setTo(-0.5, 0.5);
            this.dogBarking.play();
            this.anger += 1;
            this.angerText.text = 'Anger: ' + this.anger;
        }

        if (this.player.body.x < 230 && this.player.body.x > 210 && this.dogCounter == 0&&  this.GBoneTaken==false) {
            this.dog.x = 150;
            this.dogAppeared = true;
            this.dog.scale.setTo(0.5, 0.5);
            this.dogBarking.play();
            this.anger += 1;
            this.angerText.text = 'Anger: ' + this.anger;
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