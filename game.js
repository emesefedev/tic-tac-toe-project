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

// HTML elements
const startButton = () => document.getElementById("start-game-button")
const restartButton = () => document.getElementById("restart-game-button")

const boardCells = () => document.querySelectorAll(".board-cell")

const turnMessageText = () => document.getElementById("turn-message")
const invalidPositionMessageText = () => document.getElementById("invalid-position-message")
const winMessageText = () => document.getElementById("win-message")

const playerOneInfo = () => document.getElementById("player-one-info")
const playerTwoInfo = () => document.getElementById("player-two-info")

const playerOneNameInput = () => document.getElementById("player-one-name-input")
const playerTwoNameInput = () => document.getElementById("player-two-name-input")

const playerOneMarkInput = () => document.getElementById("player-one-mark-input")
const playerTwoMarkInput = () => document.getElementById("player-two-mark-input")

window.addEventListener("load", () => {
    startButton().addEventListener("click", () => {
        newGame()    
    })  

    restartButton().addEventListener("click", () => {
        restartGame()
    })
    
    initializeBoardCells() 
    makeBoardCellsNotInteractable()  
})

function newGame() {
    startButton().classList.add("hidden")

    const playerOneName = playerOneNameInput().value === "" 
        ? playerOneNameInput().getAttribute("placeholder") 
        : playerOneNameInput().value 
    const playerTwoName = playerTwoNameInput().value === "" 
        ? playerTwoNameInput().getAttribute("placeholder")
        : playerTwoNameInput().value 

    const playerOneMark = playerOneMarkInput().value === "" 
        ? playerOneMarkInput().getAttribute("placeholder") 
        : playerOneMarkInput().value 
    const playerTwoMark = playerTwoMarkInput().value === "" 
        ? playerTwoMarkInput().getAttribute("placeholder")
        : playerTwoMarkInput().value 

    playerOneInfo().classList.add("hidden")
    playerTwoInfo().classList.add("hidden")

    restartButton().classList.remove("hidden")
    turnMessageText().classList.remove("hidden")
    
    game = GameController(playerOneName, playerTwoName, playerOneMark, playerTwoMark)
    updateTurnMessage()
    
    makeBoardCellsInteractable()    
}

function restartGame() {
    restartButton().classList.add("hidden")
    turnMessageText().classList.add("hidden")
    invalidPositionMessageText().classList.add("hidden")
    winMessageText().classList.add("hidden")

    startButton().classList.remove("hidden")
    playerOneInfo().classList.remove("hidden")
    playerTwoInfo().classList.remove("hidden")

    cleanBoardCells()
    makeBoardCellsNotInteractable() 
}

function initializeBoardCells() {
    boardCells().forEach((boardCell, i) => {
        boardCell.id = i
        boardCell.addEventListener("click", () => {
            const {row, column} = boardCellsPositions[boardCell.id]
            game.playRound(row, column)
        })
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

function cleanBoardCells() {
    boardCells().forEach((boardCell) => {
        boardCell.textContent = ""
    })
}

function updateTurnMessage() {
    turnMessageText().childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = "'s turn. What will you do?"
        }
        else {
            node.textContent = `${game.getCurrentPlayer().name}`
        }
    })
}

function showWinMessage() {
    turnMessageText().classList.add("hidden")

    winMessageText().classList.remove("hidden")
    winMessageText().textContent = `${game.getCurrentPlayer().name} wins!!!`
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

function GameController(playerOneName, playerTwoName, playerOneMark, playerTwoMark) {
    const board = GameBoard(3, 3)

    const players = [
        new Player(playerOneName, playerOneMark),
        new Player(playerTwoName, playerTwoMark)
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