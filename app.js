document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid')
    const width = 8
    const squares = []
    let score = 0

    const candyColors = [
        'red',
        'yellow',
        'orange',
        'purple',
        'green',
        'blue'
    ]

    //Create Board
    function createBoard() {
        for(let i = 0; i < width*width; i++){
            const square = document.createElement('div')
            square.setAttribute('draggable', true)
            square.setAttribute('id', i)
            let randomColor = Math.floor(Math.random() * candyColors.length)
            square.style.backgroundColor = candyColors[randomColor]
            grid.appendChild(square)
            squares.push(square)
        }
    }
    createBoard()

    
    //Drag the candies
    let colorBeingDragged
    let colorBeingReplaced
    let squareIDBeingDragged
    let squareIDBeingReplaced

    squares.forEach(square => square.addEventListener('dragstart', dragStart))
    squares.forEach(square => square.addEventListener('dragend', dragEnd))
    squares.forEach(square => square.addEventListener('dragover', dragOver))
    squares.forEach(square => square.addEventListener('dragenter', dragEnter))
    squares.forEach(square => square.addEventListener('dragleave', dragLeave))
    squares.forEach(square => square.addEventListener('drop', drop))

    function dragStart(){
        colorBeingDragged = this.style.backgroundColor
        squareIDBeingDragged = parseInt(this.id)
    }

    function dragOver(e){
        e.preventDefault()
    }

    function dragEnter(e){
        e.preventDefault()
    }

    function dragLeave(){
    }

    function dragEnd(){
        //valid move
        let validMoves = [
            squareIDBeingDragged -1,
            squareIDBeingDragged +1,
            squareIDBeingDragged -width,
            squareIDBeingDragged +width,
        ]
        let validMove = validMoves.includes(squareIDBeingReplaced)
        
        if(squareIDBeingReplaced && validMove){
            squareIDBeingReplaced = null
        } else if (squareIDBeingReplaced && !validMove){
            squares[squareIDBeingReplaced].style.backgroundColor = colorBeingReplaced
            squares[squareIDBeingDragged].style.backgroundColor = colorBeingDragged
        } else squares[squareIDBeingDragged].style.backgroundColor = colorBeingDragged
    }

    function drop(){
        colorBeingReplaced = this.style.backgroundColor
        squareIDBeingReplaced = parseInt(this.id)
        this.style.backgroundColor = colorBeingDragged
        squares[squareIDBeingDragged].style.backgroundColor = colorBeingReplaced
    }



    // drop candies once some hv been cleared
    function fallCandies(){
        for (let i = 0; i < 56; i++) {
            // console.log(squares[3].style.background)
            if(squares[i + width].style.backgroundColor === '') {
                squares[i + width].style.backgroundColor = squares[i].style.backgroundColor
                squares[i].style.background = ''                
            }
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const isFirstRow = firstRow.includes(i)
            if (isFirstRow && squares[i].style.backgroundColor === '') {
                let randomColor = Math.floor(Math.random() * candyColors.length)
                squares[i].style.backgroundColor = candyColors[randomColor]
            }
        }
    }





    //checking for matches
    //checking for row of three
    function checkRowForThree() {
        for (let i = 0; i < 62; i ++){
            let rowOfThree = [i, i+1, i+2]
            let decidedColor = squares[i].style.backgroundColor
            const isBlank = squares[i].style.backgroundColor === ''

            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
            if (notValid.includes(i)) continue

            if (rowOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                score += 3
                document.getElementById('score').innerHTML = score
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            }
        }
    }
    checkRowForThree()

    //checking for column of three
    function checkColumnForThree() {
        for (let i = 0; i < 48; i ++){
            let columnOfThree = [i, i+width, i+width*2]
            let decidedColor = squares[i].style.backgroundColor
            const isBlank = squares[i].style.backgroundColor === ''

            if (columnOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                score += 3
                document.getElementById('score').innerHTML = score
                columnOfThree.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            }
        }

    }
    checkColumnForThree()
    
    //checking for row of four
    function checkRowForFour() {
        for (let i = 0; i < 61; i ++){
            let rowOfFour = [i, i+1, i+2, i+3]
            let decidedColor = squares[i].style.backgroundColor
            const isBlank = squares[i].style.backgroundColor === ''

            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
            if (notValid.includes(i)) continue

            if (rowOfFour.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                score += 4
                document.getElementById('score').innerHTML = score
                rowOfFour.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            }
        }
    }
    checkRowForFour()

    //checking for column of four
    function checkColumnForFour() {
        for (let i = 0; i < 40; i ++){
            let columnOfFour = [i, i+width, i+width*2, i+width*3]
            let decidedColor = squares[i].style.backgroundColor
            const isBlank = squares[i].style.backgroundColor === ''

            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
            if (notValid.includes(i)) continue

            if (columnOfFour.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
                score += 4
                document.getElementById('score').innerHTML = score
                columnOfFour.forEach(index => {
                    squares[index].style.backgroundColor = '';
                })
            }
        }
    }
    checkColumnForFour()

    window.setInterval(function(){
        fallCandies()
        checkRowForFour()
        checkColumnForFour()
        checkRowForThree()
        checkColumnForThree()
    }, 100)

})
