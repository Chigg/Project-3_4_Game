var game = new Phaser.Game(600, 400, Phaser.AUTO);
game.state.add('gameQuiz', demo.gameQuiz);
game.state.add('gameover', demo.gameover);
game.state.start('gameQuiz')