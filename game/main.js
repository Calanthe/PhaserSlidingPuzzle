'use strict';

var game = new Phaser.Game(600, 866, Phaser.CANVAS, 'slidingpuzzle', { preload: preload, create: create });

var PIECE_SIZE = 100,
    BOARD_COLS,
    BOARD_ROWS;

var piecesGroup,
    piecesAmount,
    shuffledIndexArray = [];

function preload() {
  game.load.spritesheet("background", "assets/Kepler_16b_screen_small.jpg", PIECE_SIZE, PIECE_SIZE);
}

function create() {
  prepareBoard();
}

function prepareBoard() {
  var piecesIndex = 0,
      i, j,
      piece;

  BOARD_COLS = Phaser.Math.floor(game.world.width / PIECE_SIZE);
  BOARD_ROWS = Phaser.Math.floor(game.world.height / PIECE_SIZE);

  piecesAmount = BOARD_COLS * BOARD_ROWS;

  shuffledIndexArray = createShuffledIndexArray();

  piecesGroup = game.add.group();

  for (i = 0; i < BOARD_COLS; i++)
  {
    for (j = 0; j < BOARD_ROWS; j++)
    {
      if (shuffledIndexArray[piecesIndex] !== piecesAmount-1) {
          piece = piecesGroup.create(i * PIECE_SIZE, j * PIECE_SIZE, "background", shuffledIndexArray[piecesIndex]);
      }
      else { //initial position of black piece
          piece = piecesGroup.create(i * PIECE_SIZE, j * PIECE_SIZE);
          piece.black = true;
      }
      piece.name = 'piece' + i.toString() + 'x' + j.toString();
      piece.currentIndex = shuffledIndexArray[piecesIndex];
      piece.destIndex = piecesIndex;
     // piece.events.onInputDown = selectGem;
      console.log(piece.events, piece.events.onInputDown);
      piece.inputEnabled = true;
      piece.events.onInputDown.add(selectGem, this);
      piece.posX = i;
      piece.posY = j;
      //piece.id = calcGemId(posX, posY);
      piecesIndex++;
    }
  }

}

function selectGem(sss) {
    console.log(sss);
}

function createShuffledIndexArray() {
  var i,
      indexArray = [];

  for (i = 0; i < piecesAmount; i++) {
    indexArray.push(i);
  }

  return shuffle(indexArray);
}

function shuffle(array) {
  var counter = array.length,
      temp,
      index;

  while (counter > 0) {
    index = Math.floor(Math.random() * counter);

    counter--;

    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}
