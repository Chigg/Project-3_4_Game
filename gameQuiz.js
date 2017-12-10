var demo = {};
var text;
var question;
var correct_ans;

var questions = [];
var answers = [];
var ans1 = [];
var ans2 = [];
var ans3 = [];

var fireRate = 500;
var nextFire = 0;

var scoreText;
var score = 0;
var music;

var style = {font: '22px Arial', fill: '#00000'};

//This is the core game area
//var emitter;
demo.gameQuiz = function(){};
demo.gameQuiz.prototype = {
    preload: function(){
        
        

        game.load.image('explosion', 'assets/Explosion');
        game.load.image('ball', 'assets/blue_ball.png');
        game.load.audio('crowd_boo', "assets/crowd_boo.mp3");
        game.load.audio('crowd_cheer', "assets/crowd_cheer.mp3");
        game.load.audio('party_horn', "assets/party_horn.mp3")
        game.load.audio('music', "assets/quack_song.mp3")
        game.load.image('confetti', 'assets/confetti');

        

        //  Phaser can load Text files.

        //  It does this using an XMLHttpRequest.
    
        //  If loading a file from outside of the domain in which the game is running 
        //  a 'Access-Control-Allow-Origin' header must be present on the server.
        //  No parsing of the text file is performed, it's literally just the raw data.

        game.load.text('txt', 'mathquiz.txt');
    },
    
    create: function(){
        
        cheer = game.add.audio('crowd_cheer')
        boo = game.add.audio('crowd_boo')
        horn = game.add.audio('party_horn')
        music = game.add.audio('music');
        music.volume -= 0.5;
        
        music.play()
        selection = game.add.group();
        selection.enableBody = true;
        selection.physicsBodyType = Phaser.Physics.ARCADE;
        selection.createMultiple(50, 'explosion');
        selection.setAll('checkWorldBounds', true);
        selection.setAll('outOfBoundsKill', true);
        
        //emitter for kill effects
        emitter = game.add.emitter(50, 50, 50);
        emitter.makeParticles('confetti');
        emitter.gravity = 3;
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.stage.backgroundColor = '#dabbed';
        game.scale.scleMode = Phaser.ScaleManager.SHOW_ALL;
        scoreText = game.add.text(450, 16, 'SCORE: ' + score, {font: '22px Arial', fill: '#000'});

        var txt = game.cache.getText('txt');
        var lines = txt.split('\n');
        var answer = 0;
        for (var line = 0; line < lines.length; line++){
        //this is the question
            if(answer == 0){
                question = lines[line]
                questions.push(question)
            }
        
            //this is one answer
            if (answer == 1){
                ans1.push(lines[line])
            }
            //this is two answer
            if (answer == 2){
                ans2.push(lines[line])
            }
            //this is three answer
            if(answer == 3){
                ans3.push(lines[line])
            }
            //this is the correct answer
            answer += 1;
            if (answer == 5){
                correct_ans = lines[line]
                answers.push(correct_ans)

                var answer = 0;
            } 
        }

        text = txt.split('\n');
        var style = {font: '22px Arial', fill: '#00000'};
        
        counter = 0;
        newRound(questions, answers, counter);
    
        console.log(counter);
        questionText.fixedToCamera = true;
        
},
        
    update: function(){
        
        game.physics.arcade.overlap(selection, correct_ball, correct_collisionHandler, null, this);
        if(ans_active){
            game.physics.arcade.overlap(selection, ans_ball, collisionHandler, null, this);
        }
        if(fans_active){
            game.physics.arcade.overlap(selection, Fans_ball, collisionHandler, null, this);
        }
        if(nans_active){
            game.physics.arcade.overlap(selection, Nans_ball, collisionHandler, null, this);
        }
        
        if(game.input.activePointer.isDown)
            {
                makeSelection();
            }    
    }
};

function makeSelection(){
    
    if(game.time.now > nextFire)
    {
        nextFire = game.time.now + fireRate;
        
        var choice = selection.getFirstDead();
        
        //initial firing position. Right now it is centered on player.
        choice.reset(game.input.mousePointer.x, game.input.mousePointer.y);
        choice.anchor.setTo(0.5,0.5);
        choice.lifespan = 500;
        game.physics.arcade.moveToPointer(choice, 0);

    }
}

function correct_collisionHandler (choice, ball) {

    //  When a bullet hits an carrot we kill them both
    choice.kill();
    ball.kill();
    score += 1;
    particleBurst(ball.x,ball.y);
    scoreText.text = 'Score: ' + score;
    cheer.play();
    endRound();
    counter += 1;
    newRound(questions, answers, counter);
    console.log(counter)
}

function collisionHandler (choice, ball) {

    //  When a bullet hits an carrot we kill them both
    choice.kill();
    ball.kill();
    score -= 1;
    boo.play();
    scoreText.text = 'Score: ' + score;
}

function particleBurst(x, y){
    
    emitter.x = x;
    emitter.y = y;
    
    emitter.start(true, 2000, null, 5);
    horn.play();
    
    
}

function newRound(questions, answers, counter){
    
        questionText = game.add.text(16,16, questions[counter], style)
        correct_label = game.add.text(20, 20, answers[counter], style)
        answer = answers[counter]
        answer1 = ans1[counter]
        answer2 = ans2[counter]
        answer3 = ans3[counter]
        ans_active = false;
        fans_active = false;
        nans_active = false;
        quiz_len = (questions.length)-1;
        console.log(quiz_len);
        
        if (quiz_len == counter){
            endRound()
            GameOver()
        }
    
        if(answer1 == answer){
            correct_ball = game.add.sprite(500, 500, 'ball');
            game.physics.enable(correct_ball, Phaser.Physics.ARCADE);
            correct_ball.body.velocity.setTo(200, 200);
            correct_ball.body.collideWorldBounds = true;
            correct_ball.body.bounce.setTo(1,1);
            correct_ball.addChild(correct_label);
            correct_ball.inputEnabled = true;
            correct_ball.input.useHandCursor = true;
            console.log("created at answer 1")
        }
        else{
            ans_ball = game.add.sprite(400, 500, 'ball');
            game.physics.enable(ans_ball, Phaser.Physics.ARCADE);
            ans_ball.body.velocity.setTo(200, 200);
            ans_ball.body.collideWorldBounds = true;
            ans_ball.body.bounce.setTo(1,1);
            ans1_label = game.add.text(10, 10, answer1, style)
            ans_ball.addChild(ans1_label);
            ans_active = true;
        }
        if(answer2 == answer){
            correct_ball = game.add.sprite(100, 500, 'ball');
            game.physics.enable(correct_ball, Phaser.Physics.ARCADE);
            correct_ball.body.velocity.setTo(200, 200);
            correct_ball.body.collideWorldBounds = true;
            correct_ball.body.bounce.setTo(1,1);
            correct_ball.addChild(correct_label);
            correct_ball.inputEnabled = true;
            correct_ball.input.useHandCursor = true;
            console.log("created at answer 2")
            
        }
        else{
            Fans_ball = game.add.sprite(200, 500, 'ball');
            game.physics.enable(Fans_ball, Phaser.Physics.ARCADE);
            Fans_ball.body.velocity.setTo(200, 200);
            Fans_ball.body.collideWorldBounds = true;
            Fans_ball.body.bounce.setTo(1,1);
            ans2_label = game.add.text(10, 10, answer2, style)
            Fans_ball.addChild(ans2_label)
            fans_active = true;
        }
        if(answer3 == answer){
            correct_ball = game.add.sprite(230, 100, 'ball');
            game.physics.enable(correct_ball, Phaser.Physics.ARCADE);
            correct_ball.body.velocity.setTo(200, 200);
            correct_ball.body.collideWorldBounds = true;
            correct_ball.body.bounce.setTo(1,1);
            correct_ball.addChild(correct_label);
            correct_ball.inputEnabled = true;
            correct_ball.input.useHandCursor = true;
            console.log("created at answer 3")
            
        }
        else{
            Nans_ball = game.add.sprite(219, 250, 'ball');
            game.physics.enable(Nans_ball, Phaser.Physics.ARCADE);
            Nans_ball.body.velocity.setTo(200, 200);
            Nans_ball.body.collideWorldBounds = true;
            Nans_ball.body.bounce.setTo(1,1);
            ans3_label = game.add.text(10, 10, answer3, style)
            Nans_ball.addChild(ans3_label)
            nans_active = true;
        }
}

function endRound(){
    if (typeof Nans_ball !== "undefined"){
        Nans_ball.kill()
    }
    if (typeof ans_ball !== "undefined"){
        ans_ball.kill()
    }
    if (typeof Fans_ball !== "undefined"){
        Fans_ball.kill()
    }
    if (typeof correct_ball !== "undefined"){
        Nans_ball.kill()
    }
    questionText.kill()
}
function checkIfGameover(quiz_len, counter){
    if(counter > quiz_len){
        GameOver();
    }
    
}
function GameOver(){
    console.log("GAME OVER");
    game.state.start("gameover")
}