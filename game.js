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

    const isValidMarkPosition = (row, column) => {
        if (row < 0 || row >= rows) {
            return false
        }   
        if (column < 0 || column >= columns) {
            return false
        }
        if (!board[row][column].isAvailable()) {
            return false
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

    const isWinner = (player) => {
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
  
    return { getBoard, addMarkToBoard, printBoard, isValidMarkPosition, isWinner, isFull }
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
  
    return { addMark, getValue, isAvailable }
}

class Player {
    constructor(name, mark) {
        this.name = name
        this.mark = mark
    }
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = GameBoard(3, 3)

    const players = [
        new Player(playerOneName, "X"),
        new Player(playerTwoName, "O")
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

        if (!board.isValidMarkPosition(row, column)) {
            console.log(`Invalid position (${row}, ${column})... Try again`)
            row = prompt("row")
            column = prompt("column")   
        }
        else {
            board.addMarkToBoard(row, column, getCurrentTurn())
        }
    }

    const playGame = () => {
        printNewRound()

        let row = prompt("row")
        let column = prompt("column")
        
        playRound(row, column)

        let isWinner = board.isWinner(getCurrentTurn())
        let isFull = board.isFull()

        while (!isWinner && !isFull) {
            
            changeTurn()
            printNewRound()

            row = prompt("row")
            column = prompt("column")
            playRound(row, column)   

            isWinner = board.isWinner(getCurrentTurn())
            isFull = board.isFull()
        }
        
        if (isFull) {
            console.log(`DRAW`)
        } else if (isWinner) {
            console.log(`${getCurrentTurn().name} WINS!`)
        }

        
    }
    
    return {
        playGame,
        getCurrentTurn
    }
}
  
const game = GameController()
game.playGame()