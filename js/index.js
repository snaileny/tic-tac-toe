class Player {

    constructor(score, scoreElement) {

        this.score = score;
        this.scoreElement = scoreElement;

    }

    addScore() {

        this.score++;
        this.setScoreElement();

    }

    setScore(num) {

        this.score = num;
        this.setScoreElement();

    }

    setScoreElement() {

        this.scoreElement.innerText = this.score;

    }

}

class Game {

    constructor(rounds, playerFirst, playerSecond, gameStateElem, gameCellArray) {

        this.rounds = rounds;
        this.playerFirst = playerFirst;
        this.playerSecond = playerSecond;
        this.gameStateElem = gameStateElem;
        this.gameCellArray = gameCellArray;
        this.board = new Array(9);
        this.X = "X";
        this.O = "O";
        this.turn = this.X;
        this.enabled = true;

    }

    setGameState(string) {

        this.gameStateElem.innerText = string;

    }

    isBoardFull() {

        for (const el of this.board) {

            if (el === undefined) {

                return false;

            }

        }

        return true;

    }

    toggleTurn() {

        if (this.turn === this.X) {

            this.setGameState("Player 2's turn!");
            this.turn = this.O;

        } else {

            this.setGameState("Player 1's turn!");
            this.turn = this.X;

        }

    }

    resetBoard() {

        this.enabled = true;
        this.board = new Array(9);
        this.turn = this.X;
        this.gameCellArray.forEach(cell => {

            cell.innerText = "";

        });
        this.setGameState("Player 1's turn!");

    }

    resetGame() {

        this.resetBoard();
        this.playerFirst.setScore(0);
        this.playerSecond.setScore(0);

    }

    tickBoard(index, char) {

        if ((0 <= index && index <= this.board.length - 1) && (char === this.X || char === this.O) && (this.board[index] === undefined) && this.enabled) {

            this.board[index] = char;
            this.gameCellArray[index].innerText = this.turn;
            return true;

        } else {

            return false;

        }

    }

    play(index) {

        const move = this.tickBoard(index, this.turn);
    
        if (move) {

            const result = this.checkResult();

            if (result || result === 0) {

                if (result === this.X) {

                    this.playerFirst.addScore();
                    this.setGameState("Player 1 won!");
    
                } else if (result === this.O)  {

                    this.playerSecond.addScore();
                    this.setGameState("Player 2 won!");
    
                } else if (result === 0) {

                    this.setGameState("Draw!");

                }

                this.enabled = false;
                this.checkGameEnd();

            } else {

                this.toggleTurn();
                return true;

            }

        }

    }

    checkResult() {

        const winIndex = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        const isBoardFull = this.isBoardFull();

        for (let arr of winIndex) {

            const result = arr.every(el => {

                return this.board[el] === this.turn;

            });

            if (result) {

                return this.turn;

            }

        }

        if (isBoardFull) {

            return 0;

        } else {

            return false;

        }

    }

    checkGameEnd() {

        if (this.playerFirst.score === this.rounds) {

            this.setGameState("Player 1 has won the game!");
            setTimeout(() => {this.resetGame();}, 2000);

        } else if (this.playerSecond.score === this.rounds) {

            this.setGameState("Player 2 has won the game!")
            setTimeout(() => {this.resetGame();}, 2000);

        } else {

            setTimeout(() => {this.resetBoard();}, 1500);

        }

    }

}

const elements = {

    gameBoard: document.querySelector(".game-board"),
    gameCellArray: [...document.querySelectorAll(".game-cell")],
    gameState: document.querySelector("#game-state"),
    playerFirstScore: document.querySelector("#player-first-score"),
    playerSecondScore: document.querySelector("#player-second-score"),
    startButton: document.querySelector("#reset-button")

};

function init() {

    const playerFirst = new Player(0, elements.playerFirstScore);
    const playerSecond = new Player(0, elements.playerSecondScore);
    const game = new Game(5, playerFirst, playerSecond, elements.gameState, elements.gameCellArray);

    elements.gameCellArray.forEach(cell => {

        cell.addEventListener("click", () => {

            const cellIndex = elements.gameCellArray.indexOf(cell);
            game.play(cellIndex);

        });

    });

    elements.startButton.addEventListener("click", () => {

        game.resetGame();

    });

}

init();