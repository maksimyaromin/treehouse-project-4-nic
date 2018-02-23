/* Helper to obtain an active placeholder
*/
const activePlaceholder = (element) => {
    const action = () => {
        if(element.val()) {
            element.addClass("form__input_fill");
        } else {
            element.removeClass("form__input_fill");
        }
    };
    element.on("blur", action).addClass("active");
};

const ui = {
    boardSnippen: `
        <div class="board" id="board">
            <header>
                <h1>Tic Tac Toe</h1>
                <ul>
                    <li class="players player1"></li>
                    <li class="players player2"></li>
                </ul>
            </header>
            <ul class="boxes">
                <li class="box" data-row="0" data-column="0"></li>
                <li class="box" data-row="0" data-column="1"></li>
                <li class="box" data-row="0" data-column="2"></li>
                <li class="box" data-row="1" data-column="0"></li>
                <li class="box" data-row="1" data-column="1"></li>
                <li class="box" data-row="1" data-column="2"></li>
                <li class="box" data-row="2" data-column="0"></li>
                <li class="box" data-row="2" data-column="1"></li> 
                <li class="box" data-row="2" data-column="2"></li>
            </ul>
        </div>`,
    winSnippet: `
        <div class="screen screen-win" id="finish">
            <header>
                <h1>Tic Tac Toe</h1>
                <p class="message"></p>
                <a href="#" class="button" id="btnNewGame">New game</a>
            </header>
        </div>`,
    startSnippent: `
        <div class="screen screen-start" id="start">
            <header>
                <h1>Tic Tac Toe</h1>
                <a href="#" class="button" id="btnStart">Start game</a>
            </header>
        </div>`,
    setupSnippet: `
        <div class="screen screen-start" id="start-setup">
            <header>
                <h1 class="long">Setup You Game</h1>
                <form class="form form-setup">

                    <div class="form__control-container">
                        <div class="form__control form__control_switch">
                            <input class="form__switch" type="checkbox" id="playersCount" name="playersCount" />
                            <label class="form__switch-label" for="playersCount" data-unckecked-marker="1" data-checked-marker="2">
                                Players
                            </label>
                        </div>
                    </div>

                    <div class="form__control-container player-1">
                        <div class="form__control">
                            <input type="text" name="firstName" id="firstName" class="form__input" data-active-placeholder="true" />
                            <span class="active-placeholder">First Player Name</span>
                        </div>
                    </div>

                    <div class="form__control-container player-2" style="display: none;">
                        <div class="form__control">
                            <input type="text" name="secondName" id="secondName" class="form__input" data-active-placeholder="true" />
                            <span class="active-placeholder">Second Player Name</span>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="button" id="btnPlay">Let's Play</button>
                    </div>

                </form>
            </header>
        </div>`
};