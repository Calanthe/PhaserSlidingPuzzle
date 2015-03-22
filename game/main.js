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

  for (i = 0; i < BOARD_ROWS; i++)
  {
    for (j = 0; j < BOARD_COLS; j++)
    {
      if (shuffledIndexArray[piecesIndex] !== piecesAmount - 1) {
          piece = piecesGroup.create(j * PIECE_SIZE, i * PIECE_SIZE, "background", shuffledIndexArray[piecesIndex]);
      }
      else { //initial position of black piece
          piece = piecesGroup.create(j * PIECE_SIZE, i * PIECE_SIZE);
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
    var blackPiece = canMove(piece);

    //if there is a black piece in neighborhood
    if (blackPiece) {
      movePiece(piece, blackPiece);
    }
}

function canMove(piece) {
  var foundBlackElem = false;

  piecesGroup.children.forEach(function(element) {
    if (element.posX === (piece.posX - 1) && element.posY === piece.posY && element.black ||
        element.posX === (piece.posX + 1) && element.posY === piece.posY && element.black ||
        element.posY === (piece.posY - 1) && element.posX === piece.posX && element.black ||
        element.posY === (piece.posY + 1) && element.posX === piece.posX && element.black) {
          foundBlackElem = element;
          return;
    }
  });

  return foundBlackElem;
}

function movePiece(piece, blackPiece) {
  var tmpPiece = {
    posX: piece.posX,
    posY: piece.posY,
    currentIndex: piece.currentIndex
  };

  game.add.tween(piece).to({x: blackPiece.posY * PIECE_SIZE, y: blackPiece.posX * PIECE_SIZE}, 300, Phaser.Easing.Linear.None, true);

  //change places of piece and blackPiece
  piece.posX = blackPiece.posX;
  piece.posY = blackPiece.posY;
  piece.currentIndex = blackPiece.currentIndex;
  piece.name ='piece' + piece.posX.toString() + 'x' + piece.posY.toString();

  //piece is the new black
  blackPiece.posX = tmpPiece.posX;
  blackPiece.posY = tmpPiece.posY;
  blackPiece.currentIndex = tmpPiece.currentIndex;
  blackPiece.name ='piece' + blackPiece.posX.toString() + 'x' + blackPiece.posY.toString();

  //after every move check if puzzle is completed
  checkIfFinished();
}

function checkIfFinished() {
  var isFinished = true;

  piecesGroup.children.forEach(function(element) {
    if (element.currentIndex !== element.destIndex) {
      isFinished = false;
      return;
    }
  });

  if (isFinished) {
   console.log('Finished!');
  }
}

function createShuffledIndexArray() {
  var i,
      indexArray = [];

  for (i = 0; i < piecesAmount; i++) {
    indexArray.push(i);
  }

  return indexArray;
  //return shuffle(indexArray);
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
