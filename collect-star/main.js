(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

    game.states = {};
    game.states.start = {
        preload: function () {
            game.load.image('sky', 'assets/sky.png');
            game.load.image('star', 'assets/star.png');
            game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
            game.load.image('platform', 'assets/platform.png');
            game.load.image('badie', 'assets/baddie.png');
            game.load.image('diamond', 'assets/diamond.png');
            game.load.image('firstaid0', 'assets/firstaid.png');
        },
        create: function () {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            game.add.sprite(0, 0, 'sky');

            this.platforms = game.add.group();
            var plat1 = this.platforms.create(0, 270, 'platform');
            var plat2 = this.platforms.create(500, 400, 'platform');
            var plat3 = this.platforms.create(0, game.height - 64, 'platform');
            plat3.scale.setTo(2, 2);

            game.physics.enable(plat1, Phaser.Physics.ARCADE);
            game.physics.enable(plat2, Phaser.Physics.ARCADE);
            game.physics.enable(plat3, Phaser.Physics.ARCADE);
            plat1.body.immovable = true;
            plat2.body.immovable = true;
            plat3.body.immovable = true;

            this.player = game.add.sprite(30, game.height - 120, 'dude', 4);
            this.player.animations.add('left', [0, 1, 2, 3], true);
            this.player.animations.add('right', [5, 6, 7, 8], true);
            game.physics.enable(this.player, Phaser.Physics.ARCADE);
            this.player.body.gravity.y = 400;

            this.stars = game.add.group();
            for (var i = 0; i < 12; i++) {
                var star = this.stars.create(70 * i, 50, 'star');
                game.physics.enable(star, Phaser.Physics.ARCADE);
                star.body.gravity.y = 200;
                star.body.bounce.y = 0.8 + (Math.floor(Math.random() * 10))/100;
            }

            var style = {
                fill: 'green'
            };
            this.score = 0;
            this.scoreText = game.add.text(0, 0, 'Score: 0', style);
        },
        update: function () {
            this.player.body.collideWorldBounds = true;
            var hitPlatforms = game.physics.arcade.collide(this.player, this.platforms, this.collideCallback, null, this);
            game.physics.arcade.collide(this.stars, this.platforms, null, null, this);
            var overlapStar = game.physics.arcade.overlap(this.player, this.stars, this.overlapStar, null, this);
            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.player.body.velocity.x = -150;
                this.player.animations.play('left', 10, true);
            } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.player.body.velocity.x = 150;
                this.player.animations.play('right', 10, true);
            } else {
                this.player.body.velocity.x = 0;
                this.player.animations.frame = 4;
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.player.body.touching.down) {
                this.player.body.velocity.y = -350;
            }
        },
        collideCallback: function () {

        },
        overlapStar: function (dude, star) {
            star.kill();
            this.score += 10;
            this.scoreText.text = 'Score: ' + this.score;
        }
    };

    game.state.add('start', game.states.start);
    game.state.start('start');

})();