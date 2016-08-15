// todo
// for guess-input on submit check if it's 4 digits number


(function () {

    function game() {

        var options = {
            guessInputID: 'guess-input',
            guessBtnID: 'guess-btn',
            turnsListID: 'turns'
        };
        var secret = generateSecret();
        var turns = [];

        // get controls
        var guessInput = document.getElementById(options.guessInputID);
        var guessBtn = document.getElementById(options.guessBtnID);
        var turnsList = document.getElementById(options.turnsListID);

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
        //
        guessBtn.addEventListener('click', function (ev) {
            var turnResults = countSheepsNRams(secret, guessInput.value);
            var currentIndex = turns.length + 1;
            var currentTurn = {
                index: currentIndex,
                guess: guessInput.value,
                sheeps: turnResults.sheeps,
                rams: turnResults.rams
            };

            //check for last turn
            if (turns.length) {
                if (turns[turns.length].guess !== guessInput.value) {
                    var turnHTML = renderTurn(currentTurn);
                    turnsList.appendChild(turnHTML);
                    turns.push(currentTurn);
                } else {
                    //render error about same number
                }
            }

        });

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