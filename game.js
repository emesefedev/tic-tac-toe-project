const boardCellsPositions = {
    0: {
        row: 0,
        column:0
    },
    1: {
        row: 0,
        column:1
    },
    2: {
        row: 0,
        column:2
    },
    3: {
        row: 1,
        column:0
    },
    4: {
        row: 1,
        column:1
    },
    5: {
        row: 1,
        column:2
    },
    6: {
        row: 2,
        column:0
    },
    7: {
        row: 2,
        column:1
    },
    8: {
        row: 2,
        column:2
    }
}

let game = null

const startButton = () => document.getElementById("start-game-button")
const restartButton = () => document.getElementById("restart-game-button")
const boardCells = () => document.querySelectorAll(".board-cell")
const turnMessageText = () => document.getElementById("turn-message")
const invalidPositionMessageText = () => document.getElementById("invalid-position-message")

window.addEventListener("load", () => {
    startButton().addEventListener("click", () => {
        startButton().classList.add("hidden")

        restartButton().classList.remove("hidden")
        turnMessageText().classList.remove("hidden")

        game = GameController()
        updateTurnMessage()

        makeBoardCellsInteractable()        
    })  
    
    initializeBoardCells()
    
})

function initializeBoardCells() {
    boardCells().forEach((boardCell, i) => {
        boardCell.id = i
        boardCell.addEventListener("click", () => {
            const {row, column} = boardCellsPositions[boardCell.id]
            game.playRound(row, column)
        })
        boardCell.classList.add("not-interactable")
    })
}

function makeBoardCellsInteractable() {
    boardCells().forEach((boardCell) => {
        boardCell.classList.remove("not-interactable")
    })
}

function makeBoardCellsNotInteractable() {
    boardCells().forEach((boardCell) => {
        boardCell.classList.add("not-interactable")
    })
}

function updateTurnMessage() {
    turnMessageText().textContent = `${game.getCurrentPlayer().name}'s turn. What will you do? `
}

function showWinMessage() {
    turnMessageText().classList.add("win")
    turnMessageText().textContent = `${game.getCurrentPlayer().name} wins!!!`
}

function showInvalidPositionMessage() {
    invalidPositionMessageText().classList.remove("hidden")
    invalidPositionMessageText().textContent = `Invalid position... Try again`
}

function hideInvalidPositionMessage() {
    invalidPositionMessageText().classList.add("hidden")
}

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
        const cell = board[row][column]
        cell.addMark(player)
        
        boardCells()[rows * row + column].textContent = cell.getValue()
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
        updateTurnMessage()
    }

    const getCurrentPlayer = () => {
        return currentPlayer
    }

    const playRound = (row, column) => {        
        console.log(`${board.isValidMarkPosition(row, column, currentPlayer)}`)

        if (!board.isValidMarkPosition(row, column, currentPlayer)) {
            console.log("Estoy entrando")
            showInvalidPositionMessage()
            return
        }
        
        board.addMarkToBoard(row, column, currentPlayer)
        hideInvalidPositionMessage()

        if (!board.hasWinner(currentPlayer)) {
            changeTurn()
        }
        else {
            showWinMessage()
            makeBoardCellsNotInteractable()
        }
    }
    
    return {
        playRound,
        getCurrentPlayer
    }
}
  
