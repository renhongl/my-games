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

            game.load.spritesheet('explode1', 'assets/explode1.png', 20, 20);
            game.load.spritesheet('explode2', 'assets/explode2.png', 30, 30);
            game.load.spritesheet('explode3', 'assets/explode3.png', 50, 50);
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
            game.normalback = game.add.audio('normalback', 0.1, true);
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
            this.myPlane.health = 1;
            var myPlaneTween = game.add.tween(this.myPlane).to({y: game.height - 50},1000, null, true);
            
            myPlaneTween.onComplete.add(this.onPlay, this);
            this.lastMyBulletTime = Date.now();
            this.lastEnemy1Time = Date.now();
            this.lastEnemy2Time = Date.now();
            this.lastEnemy3Time = Date.now();

            game.playback = game.add.audio('playback', 0.1, true);
            game.pi = game.add.audio('pi', 1);
            game.crash1 = game.add.audio('crash1', 1);
            game.crash2 = game.add.audio('crash2', 1);
            game.crash3 = game.add.audio('crash3', 1);
            game.deng = game.add.audio('deng', 1);
            game.ao = game.add.audio('ao', 1);

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

            this.awards = game.add.group();
            this.awards.enableBody = true;

            game.score = 0;
        },
        update: function () {
            this.myPlane.animations.play('fly', 10, true);
            var now = Date.now();
            if (now - this.lastMyBulletTime > 150 && game.playing) {
                this.myBulletFactory();
                this.lastMyBulletTime = now;
            }
            if (now - this.lastEnemy1Time > 3000 && game.playing) {
                this.enemy1Factory();
                this.lastEnemy1Time = now;
            }
            if (now - this.lastEnemy2Time > 5000 && game.playing) {
                this.enemy2Factory();
                this.lastEnemy2Time = now;
            }
            if (now - this.lastEnemy3Time > 10000 && game.playing) {
                this.enemy3Factory();
                this.lastEnemy3Time = now;
            }

            game.physics.arcade.overlap(this.myBullets, this.enemys1, this.hitEnemy, null, this);
            game.physics.arcade.overlap(this.myBullets, this.enemys2, this.hitEnemy, null, this);
            game.physics.arcade.overlap(this.myBullets, this.enemys3, this.hitEnemy, null, this);

            game.physics.arcade.overlap(this.myPlane, this.enemys1, this.crashMyPlane, null, this);
            game.physics.arcade.overlap(this.myPlane, this.enemys2, this.crashMyPlane, null, this);
            game.physics.arcade.overlap(this.myPlane, this.enemys3, this.crashMyPlane, null, this);

            game.physics.arcade.overlap(this.myPlane, this.enemyBullets1, this.hitMyPlane, null, this);
            game.physics.arcade.overlap(this.myPlane, this.enemyBullets2, this.hitMyPlane, null, this);
            game.physics.arcade.overlap(this.myPlane, this.enemyBullets3, this.hitMyPlane, null, this);

            game.physics.arcade.overlap(this.myPlane, this.awards, this.getAward, null, this);
        },
        getAward: function (myPlane, award) {
            if (myPlane.health < 3) {
                myPlane.health++;
            }
            award.kill();
            game.deng.play();
        },
        hitMyPlane: function (myPlane, bullet) {
            bullet.kill();
            myPlane.health--;
            if (myPlane.health <=0) {
                this.crashMyPlane(myPlane);
            }
        },
        crashMyPlane: function (myPlane, enemy) {
            game.ao.play();
            myPlane.kill();
            if (enemy) {
                enemy.kill();
            }
            game.playback.stop();
            game.normalback.play();
            game.state.start('restart');
        },
        onPlay: function () {
            this.myPlane.inputEnabled = true;
            this.myPlane.input.enableDrag(true);
            this.scoreText = game.add.text(0, 0, 'Score: 0', {fontSize: '10px', fill: '#dc3737'});
            game.playback.play();
            game.time.events.loop(Phaser.Timer.SECOND * 30, this.awardFactory, this);
            game.playing = true;
        },
        awardFactory: function () {
            var x = game.rnd.integerInRange(0, 220);
            var y = -20;
            var award = this.awards.getFirstExists(false, true, x, y, 'award');
            award.body.velocity.y = 600;
        },
        myBulletFactory: function () {
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
            game.pi.play();
        },
        enemy1Factory: function () {
            var x = Math.floor(Math.random() * 220);
            var y = -20;
            var enemy = this.enemys1.getFirstExists(false, true, x, y, 'enemy1');

            enemy.body.velocity.y = parseInt(Math.random() * 30) + 10;
            enemy.checkWorldBounds = true;
            enemy.outOfBoundsKill = true;
            enemy.health = 5;
            this.enemyBulletFactory1(enemy);
        },
        enemy2Factory: function () {
            var x = Math.floor(Math.random() * 210);
            var y = -30;
            var enemy = this.enemys2.getFirstExists(false, true, x, y, 'enemy2');
            enemy.body.velocity.y = parseInt(Math.random() * 30) + 10;
            enemy.checkWorldBounds = true;
            enemy.outOfBoundsKill = true;
            enemy.health = 10;
            this.enemyBulletFactory2(enemy);
        },
        enemy3Factory: function () {
            var x = Math.floor(Math.random() * 190);
            var y = -50;
            var enemy = this.enemys3.getFirstExists(false, true, x, y, 'enemy3');
            enemy.body.velocity.y = parseInt(Math.random() * 10) + 10;
            enemy.checkWorldBounds = true;
            enemy.outOfBoundsKill = true;
            enemy.health = 20;
            this.enemyBulletFactory3(enemy);
        },
        enemyBulletFactory1: function (enemy) {
            if (enemy.loopEvent) {
                game.time.events.remove(enemy.loopEvent);
            }
            enemy.loopEvent = game.time.events.loop(Phaser.Timer.SECOND * 5, function() {
                var enemyBullet = this.enemyBullets1.getFirstExists(false, true, enemy.x + 10, enemy.y + 20, 'bullet');
                enemyBullet.body.velocity.y = 50;
                enemyBullet.checkWorldBounds = true;
                enemyBullet.outOfBoundsKill = true;
            }, this, enemy);
        },
        enemyBulletFactory2: function (enemy) {
            if (enemy.loopEvent) {
                game.time.events.remove(enemy.loopEvent);
            }
            enemy.loopEvent = game.time.events.loop(Phaser.Timer.SECOND * 4, function() {
                var enemyBullet = this.enemyBullets2.getFirstExists(false, true, enemy.x + 15, enemy.y + 30, 'bullet');
                enemyBullet.body.velocity.y = 60;
                enemyBullet.checkWorldBounds = true;
                enemyBullet.outOfBoundsKill = true;
            }, this, enemy);
        },
        enemyBulletFactory3: function (enemy) {
            if (enemy.loopEvent) {
                game.time.events.remove(enemy.loopEvent);
            }
            enemy.loopEvent = game.time.events.loop(Phaser.Timer.SECOND * 3, function() {
                var enemyBullet = this.enemyBullets3.getFirstExists(false, true, enemy.x + 25, enemy.y + 50, 'bullet');
                enemyBullet.body.velocity.y = 80;
                enemyBullet.checkWorldBounds = true;
                enemyBullet.outOfBoundsKill = true;
            }, this, enemy);
        },
        hitEnemy: function (bullet, enemy) {
            if (enemy.y < -10) {
                return;
            }
            enemy.health--;
            bullet.kill();
            if (enemy.health > 0) {
                return;
            }
            enemy.kill();
            this.enemyExplode(enemy);
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
            if (enemy.loopEvent) {
                game.time.events.remove(enemy.loopEvent);
            }
        },
        enemyExplode: function (enemy) {
            if (enemy.key === 'enemy1') {
                var explode1 = game.add.image(enemy.x, enemy.y, 'explode1');
                explode1.animations.add('explode');
                explode1.play('explode', null, false, true);
                game.crash1.play(false);
            } else if (enemy.key === 'enemy2') {
                var explode2 = game.add.image(enemy.x, enemy.y, 'explode2');
                explode2.animations.add('explode');
                explode2.play('explode', null, false, true);
                game.crash1.play(false);
            } else {
                var explode3 = game.add.image(enemy.x, enemy.y, 'explode3');
                explode3.animations.add('explode');
                explode3.play('explode', null, false, true);
                game.crash1.play(false);
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
        }
    }

    game.state.add('boot', game.states.boot);
    game.state.add('preload', game.states.preload);
    game.state.add('start', game.states.start);
    game.state.add('play', game.states.play);
    game.state.add('restart', game.states.restart);
    game.state.start('boot');

})();