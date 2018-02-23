



/* The object with the main game logics accepts input 
    variables DOM of the setting panel and the game context    
*/
const Game = function(toolbarContext, gameContext) {

    this.moves = 0;
    this.raunds = 0;

    Object.defineProperty(this, "next", {
        get: function() {
            let currentPlayer = null;
            this.players = this.players.map(player => {
                if(player.move) { currentPlayer = player; }
                player.move = !player.move;
                return player;
            });
            return currentPlayer;
        }
    });

    this.start();

};
Game.prototype.start = function() {
   
    const startContext = $(ui.startSnippent).prependTo($(document.body));
    const startButton = startContext.find("#btnStart");
    startButton.off("click").on("click", () => {
        startContext.remove();
        this.setup();
    });

};
Game.prototype.setup = function() {

    const setupContext = $(ui.setupSnippet).prependTo($(document.body));
    const switcher = setupContext.find("#playersCount"),
        player1Name = setupContext.find("#firstName"),
        player2Name = setupContext.find("#secondName"),
        player2Context = setupContext.find(".player-2"),
        playButton = setupContext.find("#btnPlay");

    const togglePlayers = (element) => {
        const isTwoPlayers = element.is(":checked");
        isTwoPlayers 
            ? player2Context.show()
            : player2Name.val("") && player2Name.removeClass("form__input_fill") && player2Context.hide();
        setupContext.find(`[data-active-placeholder="true"]`).each((idx, element) => {
            activePlaceholder($(element));
        });
    };
    togglePlayers(switcher);
    switcher.on("change", e => togglePlayers($(e.target)));

    playButton.off("click").on("click", e => {
        e.preventDefault();

        const isTwo = switcher.is(":checked"),
            firstPlayerName = player1Name.val() || "GoodKat",
            firstPlayerShape = getRandom(0, 200) % 2 === 0 
                ? GAME_SHAPES.X 
                : GAME_SHAPES.O,
            secondPlayerName = isTwo
                ? player2Name.val() || "Max"
                : "PDP-11",
            secondPlayerShape = firstPlayerShape === GAME_SHAPES.X
                ? GAME_SHAPES.O 
                : GAME_SHAPES.X,
            isAi = !isTwo;

        const player1 = new Player(
            1,
            firstPlayerName, 
            firstPlayerShape,
            false
        );
        const player2 = new Player(
            2,
            secondPlayerName, 
            secondPlayerShape,
            isAi
        );
        const gameBoard = new Board(3);
        setupContext.remove();

        this.play(player1, player2, gameBoard);
    });

};
// Add a player to the game
Game.prototype.addPlayer = function(player) {
    
    if(player instanceof Player) {
        this.players.push(player);
    }

};
/* Apply game settings and start the game
*/
Game.prototype.play = function(player1, player2, gameBoard) {
    
    this.players = [];

    player1.id = player1.shape === GAME_SHAPES.X ? 2 : 1;
    player2.id = player2.shape === GAME_SHAPES.X ? 2 : 1;

    /* Add players
    */
    this.addPlayer(player1);
    this.addPlayer(player2);

   /* Create a game board
    */
    this.board = gameBoard;
    this.board.create((row, column, cell) => this.nextMove(row, column, cell));
    this.scoreBoardContext = this.board.boardContext.find("header");

    const getShape = (shape) => {
        return shape === GAME_SHAPES.X ? `
                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-718.000000, -60.000000)" fill="#000000"><g transform="translate(739.500000, 81.500000) rotate(-45.000000) translate(-739.500000, -81.500000) translate(712.000000, 54.000000)"><path d="M30 30.1L30 52.5C30 53.6 29.1 54.5 28 54.5L25.5 54.5C24.4 54.5 23.5 53.6 23.5 52.5L23.5 30.1 2 30.1C0.9 30.1 0 29.2 0 28.1L0 25.6C0 24.5 0.9 23.6 2 23.6L23.5 23.6 23.5 2.1C23.5 1 24.4 0.1 25.5 0.1L28 0.1C29.1 0.1 30 1 30 2.1L30 23.6 52.4 23.6C53.5 23.6 54.4 24.5 54.4 25.6L54.4 28.1C54.4 29.2 53.5 30.1 52.4 30.1L30 30.1Z"/></g></g></g></svg>
            `
            : `
                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-200.000000, -60.000000)" fill="#000000"><g transform="translate(200.000000, 60.000000)"><path d="M21 36.6L21 36.6C29.6 36.6 36.6 29.6 36.6 21 36.6 12.4 29.6 5.4 21 5.4 12.4 5.4 5.4 12.4 5.4 21 5.4 29.6 12.4 36.6 21 36.6L21 36.6ZM21 42L21 42C9.4 42 0 32.6 0 21 0 9.4 9.4 0 21 0 32.6 0 42 9.4 42 21 42 32.6 32.6 42 21 42L21 42Z"/></g></g></g></svg>
            `;
   };

   const getPlayerBoard = ({ name, shape, score }) => {
        return `
            <div class="player">
                <div class="player-shape">
                    ${getShape(shape)}
                </div>
                <div class="player-name">
                    ${name}
                </div>
                <div class="player-score">
                    ${score}
                </div>
            </div>`;
   };
   
   this.scoreBoardContext.find(".player1").attr("id", `player${player1.id}`).html(getPlayerBoard(player1));
   this.scoreBoardContext.find(".player2").attr("id", `player${player2.id}`).html(getPlayerBoard(player2));
   /* Prepare for the first move
   */
   this.move();

};
/* Select a current player and take a move if the computer plays
*/
Game.prototype.move = function() {
  
    const player = this.next;
    this.player = player;

    // Highlight the name of a current player
    this.scoreBoardContext.find(`.players`).each((idndex, element) => {
        element = $(element).removeClass("active");

        if(element.is(`#player${player.id}`)) {
            element.addClass("active");
        }
    });

    /* View the current shape
    */
    this.board.boardContext
        .attr("data-shape", player.shape === GAME_SHAPES.X ? "x" : "o");
    /* Computer's move
    */
    if(player.isAI) {
        const [ row, column ] = player.calculateMove(this.board, this.moves);
        const cell = this.board.boardContext.find(
            `.box[data-row="${row}"][data-column="${column}"]`
        ).off("click");
        this.nextMove(row, column, cell);
    }

};
/* Make a move (the handler of clicking on the cage or the computer's auto-move)
*/
Game.prototype.nextMove = function(row, column, cell) {
   
    const player = this.player;
    this.board.move(player.shape, row, column);
    cell.addClass(`box-filled box-filled-${player.id}`);
    this.moves++;

    /* Check a winner after a sufficient number of moves
    */
    if(this.moves >= (2 * this.board.size - 1)) {
        const winner = this.board.check();
        if(winner) { 
            this.raunds++;
            // stop the game for the winner
            this.board.stop();
            this.board.boardContext.remove(); 
            return this.showWinner(winner);
        }
    }
    // prepare for the next move
    return this.move();

};
Game.prototype.showWinner = function(winner) {

    const player = this.player;
    let winnerClass = "screen-win-tie";
    let winnerMessenge = "DRAW";
    switch (winner.player) {
        case GAME_SHAPES.X:
            winnerClass = "screen-win-two";
            winnerMessenge = `${player.name} winner`;
            break;
        case GAME_SHAPES.O:
            winnerClass = "screen-win-one";
            winnerMessenge = `${player.name} winner`;
            break;
    }
    const winnerContext = $(ui.winSnippet).prependTo($(document.body))
        .addClass(winnerClass);
    winnerContext.find(".message").text(winnerMessenge);
    

    const newGameButton = winnerContext.find("#btnNewGame");
    newGameButton.off("click").on("click", () => {
        if(winner.player !== -1) { player.incScore(); }
        this.board.refresh();

        const [ player1, player2 ] = this.players;
        const shape1 = player1.shape;
        player1.shape = player2.shape;
        player1.move = player1.shape === GAME_SHAPES.X;
        player2.shape = shape1;
        player2.move = !player1.move;

        winnerContext.remove();
        this.moves = 0;
        this.play(player1, player2, this.board);
    });

};