//main menu for play button etc..
var mainMenuState = {
    preload: function () {
        game.load.image('player', 'assets/player.png');
        // game.load.image('coin', 'assets/coin.png');
        game.load.spritesheet('coin', 'assets/coin.png', 100, 100);
        game.load.image('building', 'assets/building.jpg');
        game.load.image('dog', 'assets/dog.png');
        game.load.audio('soundtrack', 'assets/soundtrack.mp3');
        game.load.audio('dogbarking', 'assets/dogbarking.mp3');
        game.load.video('testvideo', 'assets/testvideo.mp4');
        game.load.image('aqua', 'assets/aqua.png');
        game.load.image('GBone', 'assets/Golden Bone.png');
        game.load.image('omHamada', 'assets/mother of hamada.png');
        game.load.image('tarabzyn', 'assets/tarabzyn.png');



    },
    //comment
    create: function () {
        this.startMenuBG = game.add.sprite(675, 400, 'building');
        this.startMenuBG.anchor.setTo(0.5, 0.5);
        this.startMenuBG.height=820;
        this.startMenuBG.width = 1380;

        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;


        this.createButton(game, "7amada", game.world.centerX, game.world.centerY - 50, 300, 100, function () {
            //this.state.start('video');
            this.state.start('main');
        });
        this.createButton(game, "a7med & 7amda", game.world.centerX, game.world.centerY + 50, 300, 100, function () {
            this.state.start('multi');
        });
        this.createButton(game, "Credits", game.world.centerX, game.world.centerY + 300, 300, 100, function () {
            this.state.start('credits');
        });
    },


    update: function () {},

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

// main state for game itself
var mainState = {

    preload: function () {

        this.progress = game.add.graphics(0, 0);
        this.progress.lineStyle(2, '0x000000');
        this.progress.beginFill('0x000000', 0);
        this.progress.drawRoundedRect(10, 50, 330, 27, 10);
        this.progress.endFill();
        this.progress.beginFill('0x999999', 1); //For drawing progress 

        this.losebar = game.add.graphics(0, 0);
        this.losebar.lineStyle(2, '0x000000');
        this.losebar.beginFill('0x000000', 0);
        this.losebar.drawRoundedRect(1050, 50, 300, 27, 10);
        this.losebar.endFill();
        this.losebar.beginFill('0x999999', 1); //For drawing progress
    },

    create: function () {
        this.angerCounter = 0;
        this.speed = 700;
        var rand;
        var coinGroup;
        this.dogAppeared = false;
        this.dogCounter = 0;
        this.score = 0;
        this.score1 = 7;
        this.lose = 9;
        this.anger = 0; // to calculate om 7amada anger!
        this.jumpCounter = 0;
        this.GBoneTaken = false;
        this.GBoneCounter = 0;
        this.shouldOmHamadaMoveLeft = false;
        this.startRandomEvent=false;
        this.randomEventColumnNumber=0;
        this.coinNumberThatDroppedInRandomEventSoFar=0;
        this.CoinFlag=false;


        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.startFullScreen(false);
        game.stage.backgroundColor = '#FFFFFF';
        //Set Background and Cente = '#FFFFFF';

        //game.world.setBounds(0, 0, 3840, 1080);
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.refresh();

        // create Building
        this.building = game.add.sprite(675, 400, 'building');
        this.building.anchor.setTo(0.5, 0.5);
        this.building.height = 820;
        this.building.width = 1380;

        this.omHamada = game.add.sprite(675, 300, 'omHamada');
        this.omHamada.anchor.setTo(0.5, 0.5);
        this.omHamada.scale.set(0.28, 0.28);
        this.omHamada.y = 220;

        this.tarabzyn = game.add.sprite(675, 250, 'tarabzyn');
        this.tarabzyn.anchor.setTo(0.5, 0.5);
        //this.tarabzyn.height = 820;
        //this.tarabzyn.width = 1380;
        //this.building.height=820;
        //this.building.width = 1380;


        //creating Golden Bone
        this.GBone = game.add.sprite(675, -100, 'GBone');
        this.GBone.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.GBone);
        //this.GBone.scale.set(0.5,0.5);
        this.GBone.width = 100;
        this.GBone.height = 100;

        //Create Player
        this.player = game.add.sprite(650, 900, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        this.player.scale.set(0.5, 0.5);
        //player.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

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
            this.coinGroup.create(rand, 370, 'coin', 0);
            this.coinGroup.children[i].anchor.setTo(0.5, 0.5);
            this.speed = Math.ceil(Math.random() * 350) + 200;
            this.coinGroup.children[i].body.velocity.y = this.speed;
            this.coinGroup.children[i].scale.setTo(0.85, 0.85);

        }
        this.coinGroup.callAll('animations.add', 'animations', 'moveCoin', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
        this.coinGroup.callAll('play', null, 'moveCoin');

        //create she7abr
        this.dog = game.add.sprite(-150, 670, 'dog');
        this.dog.anchor.setTo(0.5, 0.5);
        this.dog.scale.setTo(-0.5, 0.5);

        //create score
        this.scoreText = game.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        //create anger 
        this.angerText = game.add.text(1050, 16, 'Anger: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        this.Jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.soundTrack = game.add.audio('soundtrack');
        this.dogBarking = game.add.audio('dogbarking');
        game.sound.setDecodedCallback([this.soundTrack, this.dogBarking], this.StartSound, this);

        //initializing score bar
        this.progress = game.add.graphics(0, 0);
        this.progress.lineStyle(2, '0x000000');
        this.progress.beginFill('0x000000');
        this.progress.drawRoundedRect(10, 50, 330, 27, 11);
        this.progress.endFill();

        //initializing lose bar
        this.losebar = game.add.graphics(0, 0);
        this.losebar.lineStyle(2, '0x000000');
        this.losebar.beginFill('0x000000');
        this.losebar.drawRoundedRect(1050, 50, 300, 27, 11);
        this.losebar.endFill();

    },
    progressbar_score:function(){

        this.progress.clear();
        //this.progress = game.add.graphics(0, 0);
        this.progress.lineStyle(2, '0x000000');
        this.progress.beginFill('0x000000');
        this.progress.drawRoundedRect(10, 50, 330, 27, 11);
        this.progress.endFill();
        if(this.score1==107){
            this.score1=7;
            this.progress.clear();
            //this.progress = game.add.graphics(0, 0);
            this.progress.lineStyle(2, '0x000000');
            this.progress.beginFill('0x000000');
            this.progress.drawRoundedRect(10, 50, 330, 27, 11);
            this.progress.endFill();

        }
        this.progress.beginFill('0x07E507', 1); //For drawing progress
        this.progress.drawRoundedRect(12, 51, this.score1*3, 25, 10);
    },
    progressbar_lose:function(){
        this.losebar.clear();
        // this.losebar = game.add.graphics(0, 0);
        this.losebar.lineStyle(2, '0x000000');
        this.losebar.beginFill('0x000000');
        this.losebar.drawRoundedRect(1050, 50, 300, 27, 11);
        this.losebar.endFill();
        //<<<<<<< HEAD
        if(this.lose==150){
            this.state.start('end');
            this.lose=7;
            this.losebar.clear();
            // this.losebar = game.add.graphics(0, 0);
            this.losebar.lineStyle(2, '0x000000');
            this.losebar.beginFill('0x000000');
            this.losebar.drawRoundedRect(1050, 50, 300, 27, 11);
            this.losebar.endFill();

        }
        this.losebar.beginFill('0xff0000', 1); //For drawing progress
        this.losebar.drawRoundedRect(1052, 51, this.lose*2, 25, 10);
    },

    update: function () {
        this.progressbar_score();
        this.progressbar_lose();
        this.PowerUp();
        this.movePlayer();
        this.moveCoin();
        this.MoveOmHamada();
    },
    StartSound: function () {
        this.soundTrack.loopFull();
    },
    MoveOmHamada: function () {
        if (this.omHamada.x < 1000 && this.shouldOmHamadaMoveLeft == false) {
            this.omHamada.x += 5;
        } else if (this.omHamada.x > 360) {
            this.shouldOmHamadaMoveLeft = true;
            this.omHamada.x -= 5;
            if (this.omHamada.x - 5 < 360) {
                this.shouldOmHamadaMoveLeft = false;
            }
        }

    },
    PowerUp: function () {
        var random = Math.ceil(Math.random() * 10000) + 1;
        this.GBone.angle += 1;
        if (random == 3 && this.GBone.body.y == -150) {
            random = Math.floor(Math.random() * ( 2) +1);
            if(random==1)
            {
                this.GBone.body.x = 50;
            }
            else
            {
                this.GBone.body.x = 1200;
            }

            this.GBone.body.y = 0;
            this.boneSpeed = Math.ceil(Math.random() * 350) + 200;
            this.GBone.body.velocity.y = this.boneSpeed;
        }
        if (game.physics.arcade.overlap(this.player, this.GBone)) {
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
        this.player.x = game.input.mousePointer.x;

        //Jump handling
        if (this.Jump.isDown && this.jumpCounter == 0) {
            this.player.body.velocity.y = -300;
            this.jumpCounter++;

        } else if (this.jumpCounter == 30) {
            this.jumpCounter = 0;
            this.player.body.velocity.y = 200;
        } else if (this.jumpCounter != 0) {
            this.jumpCounter++;
        }
        //game.physics.arcade.collide(this.player, this.coin);
        if (this.player.body.blocked.left)
            this.player.body.velocity.x = 0;

        if (this.player.body.x < 1130 && this.player.body.x > 1110 && this.dogCounter == 0 && this.GBoneTaken == false) {
            this.dog.x = 1270;
            this.dogAppeared = true;
            this.dog.scale.setTo(-0.5, 0.5);
            this.dogBarking.play();
            this.anger += 5;
            this.lose+=this.anger;
            this.angerText.text = 'Anger: ' + this.anger/5;
        }

        if (this.player.body.x < 170 && this.player.body.x > 140 && this.dogCounter == 0 && this.GBoneTaken == false) {
            this.dog.x = 100;
            this.dogAppeared = true;
            this.dog.scale.setTo(0.5, 0.5);
            this.dogBarking.play();
            this.anger += 5;
            this.lose+=this.anger;
            this.angerText.text = 'Anger: ' + this.anger/5;
        }

        if (this.dogAppeared) {
            //check anger condition!!
            if (this.anger === 25) {
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

        if((this.score%150==0 && this.score!=0)||this.startRandomEvent==true)
        {
            this.startRandomEvent=true;
            if( this.CoinFlag==true ) 
            {

                this.randomEventColumnNumber++;
                for (var i = 0, len = this.coinGroup.children.length; i < len; i++)
                {

                    this.coinGroup.children[i].x =this.randomEventColumnNumber*1000/5 +100*i; 
                    this.coinGroup.children[i].y = 370;
                    this.speed = 200;
                    this.coinGroup.children[i].body.velocity.y = this.speed+(i*150);

                }
                this.CoinFlag=false;
            }
            for (var i = 0, len = this.coinGroup.children.length; i < len; i++)
            {
                if (game.physics.arcade.overlap(this.player, this.coinGroup.children[i])) {

                    //this.coinGroup.children[i].body.touching.down = false;
                    this.coinNumberThatDroppedInRandomEventSoFar++;
                    if(this.coinNumberThatDroppedInRandomEventSoFar%10==0)
                    {
                        this.CoinFlag=true;

                    }
                    this.score += 1;
                    this.scoreText.text = 'Score: ' + this.score;
                    this.coinGroup.children[i].x=-150;                    this.coinGroup.children[i].y=-150;
                    this.coinGroup.children[i].body.velocity.y=0;





                }
                if (this.coinGroup.children[i].body.y > 700) {
                    this.coinNumberThatDroppedInRandomEventSoFar++;
                    if(this.coinNumberThatDroppedInRandomEventSoFar%10==0)
                    {
                        this.CoinFlag=true;

                    }
                    //this.coinGroup.children[i].body.touching.down = false;
                    this.coinGroup.children[i].x=-150;
                    this.coinGroup.children[i].y=-150;
                    this.coinGroup.children[i].body.velocity.y=0;

                }

            }
            if(this.coinNumberThatDroppedInRandomEventSoFar>=50)
            {
                this.startRandomEvent=false;
                this.randomEventColumnNumber=0;               this.coinNumberThatDroppedInRandomEventSoFar=0;
                for (var i = 0, len = this.coinGroup.children.length; i < len; i++)
                {

                    rand = Math.ceil(Math.random() * 1750) + 500;
                    this.coinGroup.children[i].x = rand;
                    this.coinGroup.children[i].y = 370;
                    this.speed = Math.ceil(Math.random() * 350) + 200;
                    this.coinGroup.children[i].body.velocity.y = this.speed;

                }
            }

        }
        else
        {
            for (var i = 0, len = this.coinGroup.children.length; i < len; i++) {



                //changed some stuff here so that if a coin has collided with hamada or reached bottom
                //it reappears on the top and it's speed is random generated
                if (game.physics.arcade.overlap(this.player, this.coinGroup.children[i])) {

                    //this.coinGroup.children[i].kill();
                    this.score += 1;
                    this.score1+=1;
                    this.scoreText.text = 'Score: ' + this.score;
                    this.coinGroup.children[i].body.touching.down = false;
                    rand = Math.ceil(Math.random() * 1750) + 500;
                    this.coinGroup.children[i].x = rand;
                    this.coinGroup.children[i].y = 370;
                    this.speed = Math.ceil(Math.random() * 350) + 200;
                    this.coinGroup.children[i].body.velocity.y = this.speed;
                }
                if (this.coinGroup.children[i].body.y > 700) {
                    //  this.coinGroup.children[i].kill();
                    this.angerCounter += 1;
                    this.lose+=1;
                    rand = Math.ceil(Math.random() * 1750) + 500;   
                    this.coinGroup.children[i].x = rand;
                    this.coinGroup.children[i].y = 370;
                    this.speed = Math.ceil(Math.random() * 350) + 200;
                    this.coinGroup.children[i].body.velocity.y = this.speed;
                }
            }
        }

    },
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
        this.building = game.add.sprite(675, 400, 'building');
        this.building.anchor.setTo(0.5, 0.5);
        this.building.height = 820;
        this.building.width = 1380;
        //create end statment
        this.EndMenuState = game.add.sprite(675, 400, 'building');
        this.EndMenuState.anchor.setTo(0.5, 0.5);
        this.EndMenuState.height=820;
        this.EndMenuState.width = 1380;

        this.endStatement = game.add.text(500, 150, 'Y5aybak ya 7amada!', {
            fontFamily: 'Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif',
            fontSize: '32px',
            fill: '#f0f'
        });

        this.createButton(game, "Replay", game.world.centerX, game.world.centerY + 32, 300, 100, function () {
            //this.state.start('video');
            this.state.start('menu');
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
var creditsState = {
    preload: function () {},
    create: function () {
        this.building = game.add.sprite(675, 400, 'building');
        this.building.anchor.setTo(0.5, 0.5);
        this.building.height = 820;
        this.building.width = 1380;

        this.creditsState = game.add.text(550, 100,'Special Thanks to Artist: \n' + 'AYA NASSER\n\n\n\n'+ 'Developed By: \n' + 'Ahmed Hafez \n' + 'Abdelrahman Atwan \n' + 'Michael Fawzy' , {
            fontFamily: 'Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif',
            fontSize: '32px',
            fill: '#f0f'
        });

        this.createButton(game, "Back", game.world.centerX, game.world.centerY + 300, 300, 100, function () {
            //this.state.start('video');
            this.state.start('menu');
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

// multistate for game
var multiState = {

    preload: function () {


    },

    create: function () {
        this.angerCounter = 0;
        this.angerCounter2 = 0;
        this.speed = 700;
        var rand;
        var coinGroup;
        this.dogAppeared = false;
        this.dogCounter = 0;
        this.score = 0;
        this.score2 = 0;
        this.anger = 0; // to calculate om 7amada anger!
        this.anger2 = 0;
        this.jumpCounter = 0;
        this.jumpCounter2 = 0;
        this.GBoneTaken = false;
        this.GBoneCounter = 0;
        this.shouldOmHamadaMoveLeft = false;
        this.jumpForPlayer1Pressed=false;
        this.jumpForPlayer2Pressed=false;



        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.startFullScreen(false);
        game.stage.backgroundColor = '#FFFFFF';
        //Set Background and Cente = '#FFFFFF';

        //game.world.setBounds(0, 0, 3840, 1080);
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.refresh();

        // create Building
        this.building = game.add.sprite(675, 400, 'building');
        this.building.anchor.setTo(0.5, 0.5);
        this.building.height = 820;
        this.building.width = 1380;

        this.omHamada = game.add.sprite(675, 400, 'omHamada');
        this.omHamada.anchor.setTo(0.5, 0.5);
        this.omHamada.scale.set(0.3, 0.3);
        this.omHamada.y = 220;

        //creating Golden Bone
        this.GBone = game.add.sprite(675, -100, 'GBone');
        this.GBone.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.GBone);
        //this.GBone.scale.set(0.5,0.5);
        this.GBone.width = 100;
        this.GBone.height = 100;

        //Create Player1 & player2
        this.player = game.add.sprite(650, 900, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        this.player.scale.set(0.5, 0.5);
        //player.scale.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.velocity.y =200;
        this.player.body.checkCollision.down = false;
        this.player.body.bounce.setTo(1, 0);

        this.player2 = game.add.sprite(550, 700, 'player');
        this.player2.anchor.setTo(0.5, 0.5);
        this.player2.scale.set(0.5, 0.5);
        game.physics.arcade.enable(this.player2);
        this.player2.body.collideWorldBounds = true;
        this.player2.body.velocity.y =200;
        this.player2.body.checkCollision.down = false;
        // this.player2.body.immovable =true;
        this.player2.body.bounce.setTo(1, 0);
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
            this.coinGroup.create(rand, 370, 'coin', 0);
            this.coinGroup.children[i].anchor.setTo(0.5, 0.5);
            this.speed = Math.ceil(Math.random() * 350) + 200;
            this.coinGroup.children[i].body.velocity.y = this.speed;
            this.coinGroup.children[i].scale.setTo(0.85, 0.85);

        }
        this.coinGroup.callAll('animations.add', 'animations', 'moveCoin', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
        this.coinGroup.callAll('play', null, 'moveCoin');

        //create she7abr
        this.dog = game.add.sprite(-150, 670, 'dog');
        this.dog.anchor.setTo(0.5, 0.5);
        this.dog.scale.setTo(-0.5, 0.5);

        //create score1 & score2
        this.scoreText = game.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        this.scoreText2 = game.add.text(1000, 16, 'Player2\'s Score: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        //create anger 1 & 2
        this.angerText = game.add.text(16, 50, 'Player1\'s Anger Bar', {
            fontSize: '32px',
            fill: '#000'
        });
        this.angerText2 = game.add.text(1000, 50, 'Player2\'s Anger Bar', {
            fontSize: '32px',
            fill: '#000'
        });

        this.losebar = game.add.graphics(0, 0);
        this.losebar.lineStyle(2, '0x000000');
        this.losebar.beginFill('0x000000');
        this.losebar.drawRoundedRect(1000, 100, 300, 27, 11);
        this.losebar.endFill();

        this.losebar2 = game.add.graphics(0, 0);
        this.losebar2.lineStyle(2, '0x000000');
        this.losebar2.beginFill('0x000000');
        this.losebar2.drawRoundedRect(16, 100, 300, 27, 11);
        this.losebar2.endFill();

        this.Jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.soundTrack = game.add.audio('soundtrack');
        this.dogBarking = game.add.audio('dogbarking');
        game.sound.setDecodedCallback([this.soundTrack, this.dogBarking], this.StartSound, this);


    },

    update: function () {

        this.PowerUp();
        this.movePlayer();
        this.moveCoin();
        this.MoveOmHamada();
        this.progressbar_lose();
    },

    progressbar_lose:function(){
        //player 1
        this.losebar.clear();
        this.losebar.lineStyle(2, '0x000000');
        this.losebar.beginFill('0xff0000', 1); //For drawing progress
        this.losebar.drawRoundedRect(1052, 51, this.anger*2, 25, 10);
        this.losebar.endFill();
        //<<<<<<< HEAD
        if(this.anger==5){
            this.state.start('end');
            this.lose=7;
            this.losebar.clear();
            // this.losebar = game.add.graphics(0, 0);
            this.losebar.lineStyle(2, '0x000000');
            this.losebar.beginFill('0x000000');
            this.losebar.drawRoundedRect(1050, 50, 300, 27, 11);
            this.losebar.endFill();

        }


        //player 2
        this.losebar2.clear();
        this.losebar2.lineStyle(2, '0x000000');
        this.losebar2.beginFill('0xff0000', 1); //For drawing progress
        this.losebar2.drawRoundedRect(16, 51, this.anger2*2, 25, 10);
        this.losebar2.endFill();
        //<<<<<<< HEAD
        if(this.anger2==5){
            this.state.start('end');
            this.lose=7;
            this.losebar2.clear();
            // this.losebar = game.add.graphics(0, 0);
            this.losebar2.lineStyle(2, '0x000000');
            this.losebar2.beginFill('0x000000');
            this.losebar2.drawRoundedRect(16, 50, 300, 27, 11);
            this.losebar2.endFill();

        }

    },

    StartSound: function () {
        this.soundTrack.loopFull();
    },

    MoveOmHamada: function () {
        if (this.omHamada.x < 1000 && this.shouldOmHamadaMoveLeft == false) {
            this.omHamada.x += 5;
        } else if (this.omHamada.x > 360) {
            this.shouldOmHamadaMoveLeft = true;
            this.omHamada.x -= 5;
            if (this.omHamada.x - 5 < 360) {
                this.shouldOmHamadaMoveLeft = false;
            }
        }

    },
    PowerUp: function () {
        var random = Math.ceil(Math.random() * 100000) + 1;
        this.GBone.angle += 1;
        if (random == 3 && this.GBone.body.y == -150) {
            random = Math.floor(Math.random() * (600 - 225 + 1) + 500);
            this.GBone.body.x = random;
            this.GBone.body.y = 0;
            this.boneSpeed = Math.ceil(Math.random() * 350) + 200;
            this.GBone.body.velocity.y = this.boneSpeed;
        }
        if (game.physics.arcade.overlap(this.player, this.GBone)) {
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

        game.physics.arcade.collide(this.player, this.player2);
       

        //jumphandling for player1
        if (this.Jump.isDown && this.jumpCounter == 0 &&this.player.body.y==573) {
            this.player.body.velocity.y = -400;
            this.jumpCounter++;
        } else if (this.jumpCounter == 30) {
            this.jumpCounter = 0;
            this.player.body.velocity.y = 200;
        } else if (this.jumpCounter != 0) {
            this.jumpCounter++;
        }
        cursor = game.input.keyboard.createCursorKeys();



        //player1 movement
        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x = -300;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x = 300;
        } else {
            //this.player.body.velocity.x = 0;
        }
        //player2 movement
        if (cursor.left.isDown) {
            this.player2.body.velocity.x = -300;
        } else if (cursor.right.isDown) {
            this.player2.body.velocity.x = 300;
        } else {
            //this.player2.body.velocity.x = 0;
        }

        //Jump handling for palayer2
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.jumpCounter2 == 0 &&this.player2.body.y==573  ) {
            this.player2.body.velocity.y = -400;
            this.jumpCounter2++;

        } else if (this.jumpCounter2 == 30) {
            this.jumpCounter2 = 0;
            this.player2.body.velocity.y = 200;
        } else if (this.jumpCounter2 != 0) {
            this.jumpCounter2++;
        }
        //game.physics.arcade.collide(this.player, this.coin);
        if (this.player.body.blocked.left)
            this.player.body.velocity.x = 0;

        if (this.player2.body.blocked.left)
            this.player2.body.velocity.x = 0;

        if (this.player.body.x < 1130 && this.player.body.x > 1110 && this.dogCounter == 0 && this.GBoneTaken == false) {
            this.dog.x = 1270;
            this.dogAppeared = true;
            this.dog.scale.setTo(-0.5, 0.5);
            this.dogBarking.play();
            this.anger += 1;
            this.angerText.text = 'Player1\'s Anger: ' + this.anger;
        }

        if (this.player2.body.x < 1130 && this.player2.body.x > 1110 && this.dogCounter == 0 && this.GBoneTaken == false) {
            this.dog.x = 1270;
            this.dogAppeared = true;
            this.dog.scale.setTo(-0.5, 0.5);
            this.dogBarking.play();
            this.anger2 += 1;
            this.angerText2.text = 'Player2\'s Anger: ' + this.anger2;
        }

        if (this.player.body.x < 170 && this.player.body.x > 140 && this.dogCounter == 0 && this.GBoneTaken == false) {
            this.dog.x = 100;
            this.dogAppeared = true;
            this.dog.scale.setTo(0.5, 0.5);
            this.dogBarking.play();
            this.anger += 1;
            this.angerText.text = 'Player1\'s Anger: ' + this.anger;
        }
        if (this.player2.body.x < 170 && this.player2.body.x > 140 && this.dogCounter == 0 && this.GBoneTaken == false) {
            this.dog.x = 100;
            this.dogAppeared = true;
            this.dog.scale.setTo(0.5, 0.5);
            this.dogBarking.play();
            this.anger2 += 1;
            this.angerText2.text = 'Player2\'s Anger: ' + this.anger2;
        }
        if (this.dogAppeared) {
            //check anger condition!!
            if (this.anger === 5 ||this.anger2===5) {
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
        console.log(this.player2.body.y);

    },


    moveCoin: function () {

        for (var i = 0, len = this.coinGroup.children.length; i < len; i++) {


            //changed some stuff here so that if a coin has collided with hamada or reached bottom
            //it reappears on the top and it's speed is random generated
            if (game.physics.arcade.overlap(this.player, this.coinGroup.children[i])) {
                //this.coinGroup.children[i].kill();
                this.score += 1;
                this.scoreText.text = 'Player1\'s Score: ' + this.score;
                this.coinGroup.children[i].body.touching.down = false;
                rand = Math.ceil(Math.random() * 1750) + 500;
                this.coinGroup.children[i].x = rand;
                this.coinGroup.children[i].y = 370;
                this.speed = Math.ceil(Math.random() * 350) + 200;
                this.coinGroup.children[i].body.velocity.y = this.speed;
            }

            if (game.physics.arcade.overlap(this.player2, this.coinGroup.children[i])) {
                this.score2 += 1;
                this.scoreText2.text = 'Player2\'s Score: ' + this.score2;
                this.coinGroup.children[i].body.touching.down = false;
                rand = Math.ceil(Math.random() * 1750) + 500;
                this.coinGroup.children[i].x = rand;
                this.coinGroup.children[i].y = 0;
                this.speed = Math.ceil(Math.random() * 350) + 200;
                this.coinGroup.children[i].body.velocity.y = this.speed;
            }


        }

    },
};

var game = new Phaser.Game(1360, 720, Phaser.AUTO, '', );
game.state.add('menu', mainMenuState);
game.state.add('main', mainState);
game.state.add('multi', multiState);
game.state.add('video', videoState);
game.state.add('end', endMenuState);
game.state.add('credits',creditsState);
game.state.start('menu');