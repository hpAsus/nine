// todo
// for guess-input on submit check if it's 4 digits number


(function () {

    function game() {

        var options = {
            guessInputID: 'guess-input',
            guessBtnID: 'guess-btn',
            guessFormID: 'guess',
            turnsListID: 'turns',
            secretID: 'number',
            winnerFormID: 'winner',
            winnerBtnID: 'winner-btn',
            winnerInputID: 'winner-input'
        };
        var secret = generateSecret();
        var turns = [];
        var nickname;

        // get controls
        var guessInput = document.getElementById(options.guessInputID);
        var guessBtn = document.getElementById(options.guessBtnID);
        var guessForm = document.getElementById(options.guessFormID);
        var turnsList = document.getElementById(options.turnsListID);
        var secretNumber = document.getElementById(options.secretID);
        var winnerForm = document.getElementById(options.winnerFormID);
        var winnerBtn = document.getElementById(options.winnerBtnID);
        var winnerInput = document.getElementById(options.winnerInputID);

        //clear guess input on click
        guessInput.addEventListener('click', function (ev) {
            if (this.value === '0000') {
                this.value = '';
            }
        });

        // only digits
        guessInput.addEventListener('keydown', function (ev) {
            if (ev.keyCode >= 48 && ev.keyCode <= 57) {
                return true;
            } else {
                ev.preventDefault();
                return false;
            }
        });
        console.log(secret);

        //Main Guess Event
        guessBtn.addEventListener('click', function (ev) {
            var userGuess = guessInput.value;
            var turnResults = countSheepsNRams(secret, userGuess);
            var currentIndex = turns.length + 1;
            var currentTurn = {
                index: currentIndex,
                guess: userGuess,
                sheeps: turnResults.sheeps,
                rams: turnResults.rams
            };
            var alreadyGuessed = false;

            _.forEach(turns, function (turn) {
                if (turn.guess === userGuess) {
                    alreadyGuessed = true;
                }

            });
            //check for last turn
            if (!alreadyGuessed) {
                var turnHTML = renderTurn(currentTurn);
                turnsList.appendChild(turnHTML);
                turns.push(currentTurn);

                //check if user wins
                if (currentTurn.rams === 4) {
                    // render secret
                    renderSecret(secret);
                    turnsList.classList.add('none');
                    guessForm.classList.add('none');
                    winnerForm.classList.remove('none');
                } else {
                    turnsList.appendChild(turnHTML);
                }

            } else {
                //render error about same number
                var error = renderGuessError('Already guessed this number!');
                guessForm.appendChild(error);
                setTimeout(function () {
                    guessForm.removeChild(error);
                }, 2000);
            }

        });

        winnerBtn.addEventListener('click', function (ev) {
            nickname = winnerInput.value;
            //get player score
        });

    }

    function renderSecret(secret) {
        var digits = secret.split('');
        var digit1 = document.getElementById('digit1');
        var digit2 = document.getElementById('digit2');
        var digit3 = document.getElementById('digit3');
        var digit4 = document.getElementById('digit4');

        digit1.innerText = digits[0];
        digit2.innerText = digits[1];
        digit3.innerText = digits[2];
        digit4.innerText = digits[3];
    }

    function renderGuessError(message) {
        var error;
        error = document.createElement('div');
        error.className = 'guess__error';
        error.innerText = message;

        return error;
    }

    function renderTurn(turnData) {
        var turnLine = document.createDocumentFragment();
        var container, title, number, sheeps, rams;

        //container
        container = document.createElement('div');
        container.className = 'turn';

        //title
        title = document.createElement('div');
        title.className = 'cell turn__title';
        title.innerText = turnData.index;

        //number
        number = document.createElement('div');
        number.className = 'cell turn__number';
        number.innerText = turnData.guess;

        //sheeps
        sheeps = document.createElement('div');
        sheeps.className = 'cell turn__sheeps';
        sheeps.innerText = turnData.sheeps;

        //rams
        rams = document.createElement('div');
        rams.className = 'cell turn__rams';
        rams.innerText = turnData.rams;

        //appends
        container.appendChild(title);
        container.appendChild(number);
        container.appendChild(sheeps);
        container.appendChild(rams);
        turnLine.appendChild(container);

        return turnLine;

    }

    // Secret Number Generator
    function generateSecret() {
        return '0' + _.random(100, 999);
    }

    // Sheeps and Rams Counter
    function countSheepsNRams(secret, guess) {
        var secret = secret.split('');
        var guess = guess.split('');
        var results = {
            sheeps: 0,
            rams: 0
        };
        // todo check for guess - it's must by 4 digit answer
        _.forEach(guess, function (digit, i) {
            if (_.indexOf(secret, digit) > -1) {
                (digit === secret[i]) ? results.rams++ : results.sheeps++;
            }
        });
        return results;
    }

    game();


})();