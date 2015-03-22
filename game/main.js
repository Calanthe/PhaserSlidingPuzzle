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
  console.log(piece);
    var blackPiece = canMove(piece);
  console.log(piecesGroup.children);

    // if there is a black piece in neighborhood
    if (blackPiece) {
      movePiece(piece, blackPiece);
    }
}

function canMove(piece) {
  var foundBlackElem = false;
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
    piecesGroup.children.forEach(function(element) {
      /*console.log('piece: ', piece, piece.posX);

      console.log('element.posX: ', element.posX);
      console.log('piece.posX - 1', piece.posX - 1);
      console.log('piece.posX + 1', piece.posX + 1);
      console.log('element.posY: ', element.posY);*/
      if (element.posX === (piece.posX - 1) && element.posY === piece.posY && element.black ||
          element.posX === (piece.posX + 1) && element.posY === piece.posY && element.black ||
          element.posY === (piece.posY - 1) && element.posX === piece.posX && element.black ||
          element.posY === (piece.posY + 1) && element.posX === piece.posX && element.black) {
            foundBlackElem = element;
        //console.log('found black item: ', element);
            return;
      }
    });

  return foundBlackElem;
}

function movePiece(piece, blackPiece) {
  console.log('old blackPiece: ', blackPiece);
  console.log('old piece: ', piece);
  game.add.tween(piece).to({x: blackPiece.posX * PIECE_SIZE, y: blackPiece.posY * PIECE_SIZE}, 300, Phaser.Easing.Linear.None, true);
  var tmpPieceX = piece.posX;
  var tmpPieceY = piece.posY;
  var tmpcurrentIndex = piece.currentIndex;
  piece.posX = blackPiece.posX;
  piece.posY = blackPiece.posY;
  piece.currentIndex = blackPiece.currentIndex;
  //piece.black = true;
  piece.name ='piece' + piece.posX.toString() + 'x' + piece.posY.toString();

  //piece is the new black
  //console.log(tmpPiece);
  blackPiece.posX = tmpPieceX;
  blackPiece.posY = tmpPieceY;
  blackPiece.currentIndex = tmpcurrentIndex;
  //blackPiece.black = false;
  blackPiece.name ='piece' + tmpPieceX.toString() + 'x' + tmpPieceY.toString();

  console.log('new blackPiece: ', blackPiece);
  console.log('new piece: ', piece);

  console.log(piecesGroup.children);
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
