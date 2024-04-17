const createGameboard = function() {
    const board = [null, null, null, null, null, null, null, null, null];

    const getBoard = () => board;

    const checkCell = (position) => board[position] === null;

    const setMark = (position, marker) => {
        board[position] = marker;
    };

    const checkWinner = () => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
    
        for (const wc of winningCombinations) {
            let marks = [];

            for (const p of wc) {
                if (!board[p]) break;
                marks.push(board[p]);
            }

            if (marks.length === 3 && marks[0] === marks[1] && marks[1] === marks[2]) return marks[0];
        }
        
        if (!board.includes(null)) return "tie";
        
        return false;
    };

    return { getBoard, checkCell, setMark, checkWinner };
};

const createPlayer = function(marker) {
    const getMarker = () => marker;

    return { getMarker };
};

const createGame = function() {
    let gameOver = false;

    const isGameOver = () => gameOver;

    const gameboard = createGameboard();
    
    const players = [
        createPlayer("x"),
        createPlayer("o")
    ];

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        if (activePlayer === players[0]) {
            activePlayer = players[1];
        } else {
            activePlayer = players[0];
        }
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (cell) => {
        if (!gameboard.checkCell(cell)) return;
        
        gameboard.setMark(cell, activePlayer.getMarker());

        if (gameboard.checkWinner() === false) {
            switchActivePlayer();
        } else {
            endGame();
        }
    };

    const endGame = () => {
        gameOver = true;
    };

    return {
        isGameOver,
        playRound,
        getActivePlayer,
        getBoard: gameboard.getBoard,
        checkWinner: gameboard.checkWinner
    };
};

const ScreenController = (function() {
    const game = createGame();

    const turnText = document.querySelector("#game-message");
    const boardDiv = document.querySelector("#board");
    const winnerText = document.querySelector("#winner");

    const playAgainBtn = document.querySelector("#play-again");
    playAgainBtn.addEventListener("click", () => {
        location.reload();
    });

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        
        turnText.textContent = `${activePlayer.getMarker().toUpperCase()}'s TURN`;

        board.forEach((cell, index) => {
            const cellBtn = document.createElement("button");
            cellBtn.classList.add("cell");
            cellBtn.dataset.index = index;
            if (cell) {
                cellBtn.textContent = cell.toUpperCase();
            }
            boardDiv.appendChild(cellBtn);
        });

        boardDiv.addEventListener("click", (e) => {
            const selectedCell = e.target.dataset.index;

            if (!selectedCell) return;

            game.playRound(selectedCell);
            updateScreen();
        });

        if (game.isGameOver()) {
            turnText.textContent = "GAME OVER";

            const cellBtns = boardDiv.querySelectorAll(".cell");
            cellBtns.forEach(cellBtn => {
                cellBtn.disabled = true;
            });

            const winner = game.checkWinner();
            if (winner === "tie") {
                winnerText.textContent = "It's a tie.";
            } else {
                winnerText.textContent = `${winner.toUpperCase()} IS THE WINNER`;
            }

            winnerText.style.display = "block";
            playAgainBtn.style.display = "inline-block";
        }
    };

    updateScreen();
})();