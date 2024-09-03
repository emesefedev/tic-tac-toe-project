function GameBoard() {
    const rows = 3
    const columns = 3
    const board = []
  
    const createBoard = () => {
        for (let i = 0; i < rows; i++) {
            board.push([])
            for (let j = 0; j < columns; j++) {
              board[i].push(Cell())
            }
        }
    }
    
    const getBoard = () => {
        return board
    }

    const isValidMarkPosition = (row, column) => {
        if (row < 0 || row >= rows) {
            return false
        }   
        if (column < 0 || column >= columns) {
            return false
        }
        return true
    }
  
    const addMarkToBoard = (row, column, player) => {
      board[row][column].addMark(player);
    }
  
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => {
            return row.map((cell) => cell.getValue())
        })

        console.log(boardWithCellValues)
    }

    // Once we create the object, we create the board
    createBoard()
  
    return { getBoard, addMarkToBoard, printBoard, isValidMarkPosition }
}

function Cell() {
    let value = ""
  
    const addMark = (player) => {
      value = player.mark;
    }

    const getValue = () => {
        return value
    }
  
    return { addMark, getValue }
  }

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = GameBoard()

    // TODO: Create a Player Object
    const players = [
        {
            name: playerOneName,
            mark: "X"
        },
        {
            name: playerTwoName,
            mark: "O"
        }
    ]

    let currentTurn = players[0]

    const changeTurn = () => {
        currentTurn = currentTurn === players[0] ? players[1] : players[0];
    }

    const getCurrentTurn = () => {
        return currentTurn
    }

    const printNewRound = () => {
        board.printBoard()
        console.log(`${getCurrentTurn().name}'s turn`)
    }

    const playRound = (row, column) => {
        console.log(`Adding ${getCurrentTurn().name}'s mark into (${row}, ${column})...`)

        console.log(`${board.isValidMarkPosition(row, column)}`)

        if (!board.isValidMarkPosition(row, column)) {
            console.log(`Invalid position (${row}, ${column})... Try again`) 
        }
        else {
            board.addMarkToBoard(row, column, getCurrentTurn())
        }

        // TODO: Check if player has won

        // If there's no winner...
        changeTurn()
        printNewRound()
    }

    // Initial play game message
    printNewRound()

    return {
        playRound,
        getCurrentTurn
    }
}
  
const game = GameController()