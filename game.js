function GameBoard(totalRows, totalColumns) {
    const rows = totalRows
    const columns = totalColumns
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

    const isValidMarkPosition = (row, column, player) => {
        if (row < 0 || row >= rows) {
            return false
        } 
          
        if (column < 0 || column >= columns) {
            return false
        }

        if (!isFull()) {
            if (!board[row][column].isAvailable()) {
                return false
            }  
        }
        else {
            if (board[row][column].getValue() === player.mark) {
                return false
            }
        }

        return true
    }

    const isFull = () => {
        for (const row of board) {
            if (!row.every(cell => !cell.isAvailable())) {
                return false
            }
        }
        return true
    }

    const hasWinner = (player) => {
        // TODO: Can this be improved?
        // Check rows
        for (const row of board) {
            if (row.every(cell => cell.getValue() === player.mark)) {
                return true
            }
        }

        // Check columns
        for (let j = 0; j < columns; j++) {
            if (board[0][j].getValue() === player.mark 
                && board[0][j].getValue() === board[1][j].getValue() 
                && board[1][j].getValue() === board[2][j].getValue()) {
                    return true
                }
        }

        // Check diagonals
        if (board[0][0].getValue() === player.mark 
            && board[0][0].getValue() === board[1][1].getValue() 
            && board[1][1].getValue() === board[2][2].getValue()) {
                return true
            }
        
        if (board[0][2].getValue() === player.mark 
            && board[0][2].getValue() === board[1][1].getValue() 
            && board[1][1].getValue() === board[2][0].getValue()) {
                return true
            }
        
        return false
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
  
    return { getBoard, addMarkToBoard, printBoard, isValidMarkPosition, hasWinner, isFull }
}

function Cell() {
    let value = ""
  
    const addMark = (player) => {
      value = player.mark;
    }

    const isAvailable = () => {
        return value === ""
    }

    const getValue = () => {
        return value
    }
  
    return { addMark, isAvailable, getValue }
}

class Player {
    constructor(name, mark) {
        this.name = name
        this.mark = mark
    }
}

function GameController() {
    const board = GameBoard(3, 3)

    const players = [
        new Player("Player One", "X"),
        new Player("Player Two", "O")
    ]

    let currentPlayer = players[0]

    const changeTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    const getCurrentPlayer = () => {
        return currentPlayer
    }

    const printNewRound = () => {
        console.log(`${currentPlayer.name}'s turn. What will you do?`)
        board.printBoard()
    }

    const playRound = () => {

        let {row, column} = getInput()
        
        console.log(`Adding ${currentPlayer.name}'s mark into (${row}, ${column})...`)

        while (!board.isValidMarkPosition(row, column, currentPlayer)) {
            console.log(`Invalid position (${row}, ${column})... Try again`)
            
            // TODO: Can this be done differently?
            const newInput = getInput()
            row = newInput.row
            column = newInput.column

            console.log(`Adding ${currentPlayer.name}'s mark into (${row}, ${column})...`)
        }
        
        board.addMarkToBoard(row, column, currentPlayer)

        return board.hasWinner(currentPlayer)
    }

    const getInput = () => {
        const row = prompt("row")
        const column = prompt("column")

        return {row, column}
    }

    const playGame = () => {
        printNewRound()
        let hasWon = playRound()

        while (!hasWon) {
            changeTurn()
            printNewRound()

            hasWon = playRound()   
        }

        console.log(`${currentPlayer.name} WINS!`)
    }
    
    return {
        playGame,
        getCurrentPlayer
    }
}
  
const game = GameController()
//game.playGame()