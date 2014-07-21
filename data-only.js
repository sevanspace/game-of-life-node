var gol = require('./index')
  , renderer = require('./data-renderer')
  , _ = require('lodash');

var game = initGame();

runGame(game);

function runGame(game) {
  while (!game.stop()) {
    game.cycle();
  }

  console.log('game stopped');

  var data = _.cloneDeep(game.data());
  gameDone(data);
}

function initGame() {
  console.log('initGame');
  var rows = 30
    , columns = 100
    , initialBoard = [];

  // prepare randomized board initial conditions
  for(var i = 0; i < rows; i++){
    initialBoard[i] = []
    for(var j = 0; j < columns; j++){
      initialBoard[i][j] = randomXToY(0,1);
    }
  }  

  var game = gol.createGame(initialBoard, renderer);

  return game;
}

function gameDone(data){
  if (data) {
    console.log('stabilized: ' + data.stabilized);
    console.log('runs: ' + data.runs);
    console.log('avg: ' + data.is_average);
  } else {
    console.log('game finished, error');
  }

  console.log('new game');
  var game = initGame();
  runGame(game);
}

function randomXToY(minVal,maxVal,floatVal){
  var randVal = minVal+(Math.random()*(maxVal-minVal));
  return Math.round(randVal);
}