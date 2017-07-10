(function () {
    
    var game = new Phaser.Game(240, 400, Phaser.CANVAS, '');

    game.states = {};
    game.states.boot = {
        preload: function () {
            game.stage.backgroundColor = '#fff';
            game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            game.load.image('preloader', 'assets/preloader.gif');
        },
        create: function () {
            game.state.start('preload');
        }
    }

    game.states.preload = {
        preload: function () {
            
            var preloader = game.add.sprite(10, game.height/2 - 10, 'preloader');
            game.load.setPreloadSprite(preloader, 0);
            game.load.image('bg', 'assets/bg.jpg', game.width, game.height);
            game.load.image('award', 'assets/award.png');
            game.load.image('bullet', 'assets/bullet.png');
            game.load.image('close', 'assets/close.png');
            game.load.image('copyright', 'assets/copyright.png');
            game.load.image('enemy1', 'assets/enemy1.png');
            game.load.image('enemy2', 'assets/enemy2.png');
            game.load.image('enemy3', 'assets/enemy3.png');

            game.load.image('explode1', 'assets/explode1.png');
            game.load.image('explode2', 'assets/explode2.png');
            game.load.image('explode3', 'assets/explode3.png');
            game.load.image('logo', 'assets/logo.jpg');

            game.load.image('mybullet', 'assets/mybullet.png');
            game.load.image('myexplode', 'assets/myexplode.png');
            game.load.spritesheet('myplane', 'assets/myplane.png', 40, 40);
            game.load.image('logo', 'assets/logo.jpg');

            
            game.load.spritesheet('replaybutton', 'assets/replaybutton.png', 80, 30);
            game.load.image('share', 'assets/share.png');
            game.load.image('logo', 'assets/logo.jpg');

            game.load.spritesheet('sharebutton', 'assets/sharebutton.png', 80, 30);
            game.load.spritesheet('startbutton', 'assets/startbutton.png', 100, 40);

            game.load.audio('normalback', 'assets/normalback.mp3');
            game.load.audio('playback', 'assets/playback.mp3');
            game.load.audio('fashe', 'assets/fashe.mp3');
            game.load.audio('crash1', 'assets/crash1.mp3');
            game.load.audio('crash2', 'assets/crash2.mp3');
            game.load.audio('crash3', 'assets/crash3.mp3');
            game.load.audio('ao', 'assets/ao.mp3');
            game.load.audio('pi', 'assets/pi.mp3');
            game.load.audio('deng', 'assets/deng.mp3');
            
        },
        create: function () {
            game.state.start('start');
        }
    }

    game.states.start = {
        create: function () {
            var bg = game.add.image(0, 0, 'bg');
            this.myPlane = game.add.sprite(game.width/2 - 20, game.height/2 - 100, 'myplane');
            this.myPlane.animations.add('fly');
            this.startButton = game.add.button(game.width/2 - 50, game.height/2 - 20, 'startbutton', this.onStart, this, 0, 1, 0, 1);
            game.add.image(8, game.height - 15, 'copyright');
            game.normalback = game.add.audio('normalback', 0.5, true);
            game.normalback.play();
        },
        update: function () {
            this.myPlane.animations.play('fly', 10, true);
        },
        onStart: function () {
            game.normalback.stop();
            game.state.start('play');
        }
    }

    game.states.play = {
        create: function () {
            game.physics.startSystem(Phaser.Physics.ARCADE);
            var bg = game.add.tileSprite(0, 0, game.width, game.height, 'bg');
            bg.autoScroll(0, 20);
            this.myPlane = game.add.sprite(game.width/2 - 20, game.height/2 - 100, 'myplane');
            this.myPlane.animations.add('fly');
            game.physics.enable(this.myPlane, Phaser.Physics.ARCADE);
            this.myPlane.body.collideWorldBounds = true;
            this.myPlane.health = 3;
            var myPlaneTween = game.add.tween(this.myPlane).to({y: game.height - 50},1000, null, true);
            
            myPlaneTween.onComplete.add(this.onPlay, this);
            this.lastMyBulletTime = Date.now();
            this.lastEnemy1Time = Date.now();
            this.lastEnemy2Time = Date.now();
            this.lastEnemy3Time = Date.now();
            this.playing = false;
        },
        update: function () {
            this.myPlane.animations.play('fly', 10, true);
            var now = Date.now();
            if (now - this.lastMyBulletTime > 150 && this.playing) {
                this.myBulletFactory();
                this.lastMyBulletTime = now;
            }
            if (now - this.lastEnemy1Time > 3000 && this.playing) {
                this.enemy1Factory();
                this.lastEnemy1Time = now;
            }
            if (now - this.lastEnemy2Time > 5000 && this.playing) {
                this.enemy2Factory();
                this.lastEnemy2Time = now;
            }
            if (now - this.lastEnemy3Time > 10000 && this.playing) {
                this.enemy3Factory();
                this.lastEnemy3Time = now;
            }

            if (this.enemys1 && this.enemys1.countLiving() !== 0 && this.myBullets && this.myBullets.countLiving() !== 0) {
                game.physics.arcade.overlap(this.myBullets, this.enemys1, this.hitEnemy, null, this);
            }
            if (this.enemys2 && this.enemys2.countLiving() !== 0 && this.myBullets && this.myBullets.countLiving() !== 0) {
                game.physics.arcade.overlap(this.myBullets, this.enemys2, this.hitEnemy, null, this);
            }
            if (this.enemys3 && this.enemys3.countLiving() !== 0 && this.myBullets && this.myBullets.countLiving() !== 0) {
                game.physics.arcade.overlap(this.myBullets, this.enemys3, this.hitEnemy, null, this);
            }

            game.physics.arcade.overlap(this.myPlane, this.enemys1, this.crashMyPlane, null, this);
            game.physics.arcade.overlap(this.myPlane, this.enemys2, this.crashMyPlane, null, this);
            game.physics.arcade.overlap(this.myPlane, this.enemys3, this.crashMyPlane, null, this);
        },
        crashMyPlane: function (myPlane, bullet) {
            myPlane.kill();
            bullet.kill();
            game.over = true;
            game.playback.stop();
            game.normalback.play();
            game.state.start('restart');
        },
        onPlay: function () {
            
            this.myPlane.inputEnabled = true;
            this.myPlane.input.enableDrag(true);
            game.score = 0;
            this.scoreText = game.add.text(0, 0, 'Score: 0', {fontSize: '10px', fill: '#dc3737'});
            this.myBullets = game.add.group();
            this.myBullets.enableBody = true;
            this.enemys1 = game.add.group();
            this.enemys1.enableBody = true;

            this.enemys2 = game.add.group();
            this.enemys2.enableBody = true;

            this.enemys3 = game.add.group();
            this.enemys3.enableBody = true;

            this.enemyBullets1 = game.add.group();
            this.enemyBullets1.enableBody = true;

            this.enemyBullets2 = game.add.group();
            this.enemyBullets2.enableBody = true;

            this.enemyBullets3 = game.add.group();
            this.enemyBullets3.enableBody = true;

            this.playing = true;
            game.playback = game.add.audio('playback', 0.5, true);
            game.playback.play();
        },
        myBulletFactory: function () {
            if (game.over) {
                return;
            }
            if (this.myPlane.health >= 1) {
                var mybullet = this.myBullets.getFirstExists(false, true, this.myPlane.x + 15, this.myPlane.y - 20, 'mybullet');
                mybullet.body.velocity.y = -300;
                mybullet.checkWorldBounds = true;
                mybullet.outOfBoundsKill = true;
            }
            if (this.myPlane.health >= 2) {
                var mybullet = this.myBullets.getFirstExists(false, true, this.myPlane.x + 15, this.myPlane.y - 20, 'mybullet');
                mybullet.body.velocity.y = -300;
                mybullet.checkWorldBounds = true;
                mybullet.outOfBoundsKill = true;
                var mybullet2 = this.myBullets.getFirstExists(false, true, this.myPlane.x + 15, this.myPlane.y - 20, 'mybullet');
                mybullet2.body.velocity.set(-40, -300);
                mybullet2.checkWorldBounds = true;
                mybullet2.outOfBoundsKill = true;
                var mybullet3 = this.myBullets.getFirstExists(false, true, this.myPlane.x + 15, this.myPlane.y - 20, 'mybullet');
                mybullet3.body.velocity.set(40, -300);
                mybullet3.checkWorldBounds = true;
                mybullet3.outOfBoundsKill = true;
            }
            if (this.myPlane.health >= 3) {
                var mybullet = this.myBullets.getFirstExists(false, true, this.myPlane.x + 15, this.myPlane.y - 20, 'mybullet');
                mybullet.body.velocity.y = -300;
                mybullet.checkWorldBounds = true;
                mybullet.outOfBoundsKill = true;
                var mybullet2 = this.myBullets.getFirstExists(false, true, this.myPlane.x + 15, this.myPlane.y - 20, 'mybullet');
                mybullet2.body.velocity.set(-40, -300);
                mybullet2.checkWorldBounds = true;
                mybullet2.outOfBoundsKill = true;
                var mybullet3 = this.myBullets.getFirstExists(false, true, this.myPlane.x + 15, this.myPlane.y - 20, 'mybullet');
                mybullet3.body.velocity.set(40, -300);
                mybullet3.checkWorldBounds = true;
                mybullet3.outOfBoundsKill = true;

                var mybullet4 = this.myBullets.getFirstExists(false, true, this.myPlane.x + 15, this.myPlane.y - 20, 'mybullet');
                mybullet4.body.velocity.set(-60, -300);
                mybullet4.checkWorldBounds = true;
                mybullet4.outOfBoundsKill = true;
                var mybullet5 = this.myBullets.getFirstExists(false, true, this.myPlane.x + 15, this.myPlane.y - 20, 'mybullet');
                mybullet5.body.velocity.set(60, -300);
                mybullet5.checkWorldBounds = true;
                mybullet5.outOfBoundsKill = true;
            }
            game.pi = game.add.audio('pi', 1);
            game.pi.play();
        },
        enemy1Factory: function () {
            var x = Math.floor(Math.random() * 220);
            var y = -20;
            var enemy = this.enemys1.getFirstExists(false, true, x, y, 'enemy1');
            enemy.body.velocity.y = parseInt(Math.random() * 30) + 10;
            enemy.checkWorldBounds = true;
            enemy.outOfBoundsKill = true;
            enemy.health = 1;
            game.time.events.loop(Phaser.Timer.SECOND * 5, this.enemyBulletFactory1, this, enemy);
        },
        enemy2Factory: function () {
            var x = Math.floor(Math.random() * 210);
            var y = -30;
            var enemy = this.enemys2.getFirstExists(false, true, x, y, 'enemy2');
            enemy.body.velocity.y = parseInt(Math.random() * 30) + 10;
            enemy.checkWorldBounds = true;
            enemy.outOfBoundsKill = true;
            enemy.health = 3;
            game.time.events.loop(Phaser.Timer.SECOND * 4, this.enemyBulletFactory2, this, enemy);
        },
        enemy3Factory: function () {
            var x = Math.floor(Math.random() * 190);
            var y = -50;
            var enemy = this.enemys3.getFirstExists(false, true, x, y, 'enemy3');
            enemy.body.velocity.y = parseInt(Math.random() * 30) + 10;
            enemy.checkWorldBounds = true;
            enemy.outOfBoundsKill = true;
            enemy.health = 10;
            game.time.events.loop(Phaser.Timer.SECOND * 3, this.enemyBulletFactory3, this, enemy);
        },
        enemyBulletFactory1: function (enemy) {
            if (!enemy.alive) {
                return;
            }
            var enemyBullet = this.enemyBullets1.getFirstExists(false, true, enemy.x + 10, enemy.y + 20, 'bullet');
            enemyBullet.body.velocity.y = 50;
            enemyBullet.checkWorldBounds = true;
            enemyBullet.outOfBoundsKill = true;
        },
        enemyBulletFactory2: function (enemy) {
            if (!enemy.alive) {
                return;
            }
            var enemyBullet = this.enemyBullets2.getFirstExists(false, true, enemy.x + 15, enemy.y + 30, 'bullet');
            enemyBullet.body.velocity.y = 60;
            enemyBullet.checkWorldBounds = true;
            enemyBullet.outOfBoundsKill = true;
        },
        enemyBulletFactory3: function (enemy) {
            if (!enemy.alive) {
                return;
            }
            var enemyBullet = this.enemyBullets3.getFirstExists(false, true, enemy.x + 25, enemy.y + 50, 'bullet');
            enemyBullet.body.velocity.y = 70;
            enemyBullet.checkWorldBounds = true;
            enemyBullet.outOfBoundsKill = true;
        },
        hitEnemy: function (bullet, enemy) {
            enemy.health--;
            bullet.kill();
            if (enemy.health > 0) {
                return;
            }
            enemy.kill();
            if (enemy.key === 'enemy1') {
                game.score += 10;
                this.scoreText.text = 'Score: ' + game.score;
            } else if (enemy.key === 'enemy2') {
                game.score += 20;
                this.scoreText.text = 'Score: ' + game.score;
            } else {
                game.score += 50;
                this.scoreText.text = 'Score: ' + game.score;
            }
        }
    }

    game.states.restart = {
        create: function() {
            var bg = game.add.image(0, 0, 'bg');
            this.myPlane = game.add.sprite(game.width/2 - 20, game.height/2 - 100, 'myplane');
            this.myPlane.animations.add('fly');
            this.scoreText = game.add.text(game.width/2 - 50, game.height/2 - 20, 'Score: ' + game.score, {fontSize: '20px', fill: '#dc3737'});
            this.replaybutton = game.add.button(game.width/2 - 90, game.height - 100, 'replaybutton', this.rePlay, this, 0, 1, 0, 1);
            this.sharebutton = game.add.button(game.width/2 + 10, game.height - 100, 'sharebutton', null, this, 0, 1, 0, 1);
            game.add.image(8, game.height - 15, 'copyright');
        },
        update: function () {
            this.myPlane.animations.play('fly', 10, true);
        },
        rePlay: function () {
            game.normalback.stop();
            game.state.start('play');
            game.over = false;
        }
    }

    game.state.add('boot', game.states.boot);
    game.state.add('preload', game.states.preload);
    game.state.add('start', game.states.start);
    game.state.add('play', game.states.play);
    game.state.add('restart', game.states.restart);
    game.state.start('boot');

})();