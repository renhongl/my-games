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

            
            game.load.image('replaybutton', 'assets/replaybutton.png');
            game.load.image('share', 'assets/share.png');
            game.load.image('logo', 'assets/logo.jpg');

            game.load.image('sharebutton', 'assets/sharebutton.png');
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
            this.normalback = game.add.audio('normalback', 0.5, true);
            this.normalback.play();
        },
        update: function () {
            this.myPlane.animations.play('fly', 10, true);
        },
        onStart: function () {
            this.normalback.stop();
            game.state.start('play');
        }
    }

    game.states.play = {
        create: function () {
            game.physics.startSystem(Phaser.Physics.ARCADE);
            var bg = game.add.tileSprite(0, 0, game.width, game.height, 'bg');
            bg.autoScroll(0, -20);
            this.myPlane = game.add.sprite(game.width/2 - 20, game.height/2 - 100, 'myplane');
            this.myPlane.animations.add('fly');
            this.myPlane.inputEnabled = true;
            this.myPlane.input.enableDrag(true);
            game.physics.arcade.enable(this.myPlane, Phaser.Physics.ARCADE);
            this.myPlane.body.collideWorldBounds = true;
            var myPlaneTween = game.add.tween(this.myPlane).to({y: game.height - 50},1000, null, true);
            this.playback = game.add.audio('playback', 0.5, true);
            this.playback.play();
            myPlaneTween.onComplete.add(this.onPlay, this);
            this.last = Date.now();
            this.playing = false;
        },
        update: function () {
            this.myPlane.animations.play('fly', 10, true);
            var now = Date.now();
            if (now - this.last > 300 && this.playing) {
                var mybullet = game.add.sprite(this.myPlane.x + 15, this.myPlane.y - 20, 'mybullet');
                game.physics.arcade.enable(mybullet, Phaser.Physics.ARCADE);
                mybullet.body.velocity.y = -500;
                this.last = now;
            }
        },
        onPlay: function () {
            this.playing = true;
            var shootAudio = game.add.audio('fashe', 1, true);
            shootAudio.play();
        }
    }

    game.state.add('boot', game.states.boot);
    game.state.add('preload', game.states.preload);
    game.state.add('start', game.states.start);
    game.state.add('play', game.states.play);
    game.state.start('boot');

})();