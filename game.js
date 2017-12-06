

var game = new Phaser.Game(800, 800, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    //  Phaser can load Text files.

    //  It does this using an XMLHttpRequest.
    
    //  If loading a file from outside of the domain in which the game is running 
    //  a 'Access-Control-Allow-Origin' header must be present on the server.
    //  No parsing of the text file is performed, it's literally just the raw data.

    game.load.text('txt', 'mathquiz.txt');

}

var text;
var question;
var correct_ans;
var ans1;
var ans2;
var ans3;

function create() {

    game.stage.backgroundColor = '#dabbed';

    var txt = game.cache.getText('txt');
    var lines = txt.split('\n');
    var answer = 0;
    for (var line = 0; line < lines.length;){
        //this is the question
        if(answer == 0){
            question = lines[line]
            console.log("question is:")        
            console.log(question)
        }
        
        //this is one answer
        if (answer == 1){
            ans1 = lines[line]
        }
        //this is two answer
        if (answer == 2){
            ans2 = lines[line]
        }
        //this is three answer
        if(answer == 3){
            ans3 = lines[line]
        }
        //this is the correct answer
        answer += 1;
        if (answer == 5){
            correct_ans = lines[line]
            console.log("answer is:")
            console.log(correct_ans)
            
            var answer = 0;
        } 
    }

    text = txt.split('\n');

}

function update(){
    question.fixedToCamera = true;
    question.cameraOffset.setTo (400, 400)
}

function render() {

    for (var i = 0; i < 30; i++)
    {
        game.debug.text(text[i], 32, i * 20);
    }

}
