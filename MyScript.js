var game = new Phaser.Game(1360, 720, Phaser.AUTO, '', {
	preload: preload,
	create: create,
	update: update
});
var player;
var coin;
var dog;
var speed = 700;
var score=0;
var scoreText;
var rand;
//jumpSpeed = 1200;
//var cameraValue = 200,
//cameraTarget;

function preload() {
	game.load.image('player', 'assets/player.png');
	game.load.image('coin', 'assets/coin.png');
	game.load.image('building', 'assets/building.jpg');
	game.load.image('dog', 'assets/dog.jpg');
	//game.load.image('background', 'assets/Parallex.jpeg');
}

function create() {
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
	game.scale.startFullScreen(false);
	//Set Background and Center Game
	game.stage.backgroundColor = '#FFFFFF';
	building = game.add.sprite(675, 400, 'building');
	building.anchor.setTo(0.5, 0.5);
	building.width = 900;

	//game.world.setBounds(0, 0, 3840, 1080);
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.scale.refresh();

	//Create Player
	player = game.add.sprite(650, 700, 'player');
	player.anchor.setTo(0.5, 0.5);
	//player.scale.setTo(0.5, 0.5);
	game.physics.arcade.enable(player);
	//player.body.bounce.setTo(0.5, 0.5);
	//player.body.gravity.y = 5000;
	player.body.collideWorldBounds = true;
	player.body.checkCollision.up = true;
	player.body.immovable = true; //hat2sr 3 el 7arka?

	//create coin
	rand = Math.floor(Math.random ()*901 )+225;
	coin = game.add.sprite(rand, 0, 'coin');
	coin.anchor.setTo(0.5, 0.5);
	coin.scale.setTo(0.5, 0.5);
	game.physics.arcade.enable(coin);
	coin.body.collideWorldBounds = false;
	// coin.body.immovable = false;
	// coin.body.moves = true;

	//create she7abr
	dog=game.add.sprite(-150,670, 'dog');
	//dog.flipX = true;
	dog.anchor.setTo(0.5,0.5);
	dog.scale.setTo(-0.5,0.5);

	//create score
	scoreText= game.add.text(16,16,'score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
	// let random = Math.floor(Math.random ()*100)+1;
	// if(random==50)
	// {
	// 	//rand = Math.floor(Math.random ()*901 )+225;
	// 	coin = game.add.sprite(rand, 0, 'coin');
	// 	coin.anchor.setTo(0.5, 0.5);
	// 	coin.scale.setTo(0.5, 0.5);
	// 	game.physics.arcade.enable(coin);
	// 	//player.body.bounce.setTo(0.5, 0.5);
	// 	//player.body.gravity.y = 5000;
	// 	coin.body.collideWorldBounds = false;
	// }
	
	movePlayer();
	moveCoin();
}

function movePlayer() {

	player.x = game.input.mousePointer.x;
	game.physics.arcade.collide(player, coin);
	if (player.body.blocked.left)
	player.body.velocity.x = 0;

	if (player.body.x== 225)
	{
		dog.body.x=150;
		dog.body.y=670;
	}
}

function moveCoin() {
	coin.body.velocity.y = speed;

	if (coin.body.touching.down){
		coin.kill();
		score += 1;
		scoreText.text = 'Score: ' + score;
		coin.body.touching.down=false;
	}
}

