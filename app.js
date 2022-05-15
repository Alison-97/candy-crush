document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const width = 8;
  const squares = [];
  let score = 0;
  let highestScore;

  //get highest score

  if (!localStorage.getItem("highest")) {
    localStorage.setItem("highest", "0");
  } else {
    highestScore = localStorage.getItem("highest");
  }

  const candyColors = [
    "url(images/candy1.svg)",
    "url(images/candy2.svg)",
    "url(images/candy3.svg)",
    "url(images/candy4.svg)",
    "url(images/candy5.svg)",
    "url(images/candy6.svg)",
  ];

  //Create Board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      let randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundImage = candyColors[randomColor];
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();

  //Drag the candies
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIDBeingDragged;
  let squareIDBeingReplaced;

  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", drop));

  function dragStart() {
    colorBeingDragged = this.style.backgroundImage;
    squareIDBeingDragged = parseInt(this.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave() {}

  function dragEnd() {
    //valid move
    let validMoves = [
      squareIDBeingDragged - 1,
      squareIDBeingDragged + 1,
      squareIDBeingDragged - width,
      squareIDBeingDragged + width,
    ];
    let validMove = validMoves.includes(squareIDBeingReplaced);

    let rightEdge = [7, 15, 23, 31, 39, 47, 55]
    let leftEdge = [0, 8, 16, 24, 32, 40, 48, 56]

    let crossEdge = (rightEdge.includes(squareIDBeingDragged) && leftEdge.includes(squareIDBeingReplaced)) ||
    (leftEdge.includes(squareIDBeingDragged) && rightEdge.includes(squareIDBeingReplaced))

    if (squareIDBeingReplaced && validMove && !crossEdge) {
      squareIDBeingReplaced = null;
    } else if (squareIDBeingReplaced && !validMove || crossEdge) {
      squares[squareIDBeingReplaced].style.backgroundImage = colorBeingReplaced;
      squares[squareIDBeingDragged].style.backgroundImage = colorBeingDragged;
    } else
      squares[squareIDBeingDragged].style.backgroundImage = colorBeingDragged;
  }

  function drop() {
    colorBeingReplaced = this.style.backgroundImage;
    squareIDBeingReplaced = parseInt(this.id);
    this.style.backgroundImage = colorBeingDragged;
    squares[squareIDBeingDragged].style.backgroundImage = colorBeingReplaced;
  }

  // drop candies once some hv been cleared
  function fallCandies() {
    for (let i = 0; i < 56; i++) {
      if (squares[i + width].style.backgroundImage === "") {
        squares[i + width].style.backgroundImage =
          squares[i].style.backgroundImage;
        squares[i].style.background = "";
      }
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && squares[i].style.backgroundImage === "") {
        let randomColor = Math.floor(Math.random() * candyColors.length);
        squares[i].style.backgroundImage = candyColors[randomColor];
      }
    }
  }

  //checking for matches
  //checking for row of three
  function checkRowForThree() {
    for (let i = 0; i < 62; i++) {
      let rowOfThree = [i, i + 1, i + 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 3;
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkRowForThree();

  //checking for column of three
  function checkColumnForThree() {
    for (let i = 0; i < 48; i++) {
      let columnOfThree = [i, i + width, i + width * 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        columnOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 3;
        columnOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkColumnForThree();

  //checking for row of four
  function checkRowForFour() {
    for (let i = 0; i < 61; i++) {
      let rowOfFour = [i, i + 1, i + 2, i + 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55,
      ];
      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 4;
        rowOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkRowForFour();

  //checking for column of four
  function checkColumnForFour() {
    for (let i = 0; i < 40; i++) {
      let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55,
      ];
      if (notValid.includes(i)) continue;

      if (
        columnOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 4;
        columnOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkColumnForFour();

  function setScore() {
    document.getElementById("score").innerHTML = score;
    document.getElementById("highest-score").innerHTML = highestScore;
    if (score >= highestScore) {
      highestScore = score;
      localStorage.setItem("highest", highestScore);
    }
  }

  window.setInterval(function () {
    fallCandies();
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
    setScore();
  }, 100);
});
