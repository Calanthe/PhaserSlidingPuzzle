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
      if (shuffledIndexArray[piecesIndex] !== piecesAmount - 1) {
          piece = piecesGroup.create(i * PIECE_SIZE, j * PIECE_SIZE, "background", shuffledIndexArray[piecesIndex]);
      }
      else { //initial position of black piece
          piece = piecesGroup.create(i * PIECE_SIZE, j * PIECE_SIZE);
          piece.black = true;
      }
      piece.name = 'piece' + i.toString() + 'x' + j.toString();
      piece.currentIndex = piecesIndex;
      piece.destIndex = shuffledIndexArray[piecesIndex];
      piece.inputEnabled = true;
      piece.events.onInputDown.add(selectPiece, this);
      piece.posX = i;
      piece.posY = j;
      piecesIndex++;
    }
  }

}

function selectPiece(piece) {
    //console.log(piece);
    var foundBlackPiece = canMove(piece);
    if (foundBlackPiece) {
      movePiece(piece, foundBlackPiece);
    }
}

function canMove(piece) {
    /*if (piece.posX === 0) {
      console.log('on the left edge');
    }
    if (((piece.posX + 1) % BOARD_COLS) === 0) {
      console.log('on the right edge');
    }
    if (piece.posY === 0) {
      console.log('on the top edge');
    }
    if (((piece.posY + 1) % BOARD_ROWS) === 0) {
      console.log('on the bottom edge');
    }*/
  console.log(piece);
    piecesGroup.children.forEach(function(element) {

      if (element.posX === (piece.posX - 1) && element.posY === piece.posY && element.black ||
          element.posX === (piece.posX + 1) && element.posY === piece.posY && element.black ||
          element.posY === (piece.posY - 1) && element.posX === piece.posX && element.black ||
          element.posY === (piece.posY + 1) && element.posX === piece.posX && element.black) {
        console.log('found black element: ', element, 'original piece: ', piece);
        return element;
      }
    });

  return false;
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
