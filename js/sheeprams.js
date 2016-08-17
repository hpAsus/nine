// todo
// for guess-input on submit check if it's 4 digits number

(function () {

    var options = {
        guessInputID: 'guess-input',
        guessBtnID: 'guess-btn',
        guessFormID: 'guess',
        turnsListID: 'turns',
        secretID: 'number',
        winnerFormID: 'winner',
        winnerBtnID: 'winner-btn',
        winnerInputID: 'winner-input',
        digit1ID: 'digit1',
        digit2ID: 'digit2',
        digit3ID: 'digit3',
        digit4ID: 'digit4',
        scoreListID: 'scorelist',
        tryAgainID: 'tryagain',
        timeSpentID: 'timeSpent',
        winnerScoreID: 'scoreFinal',
        greetingID: 'greeting'
    };
    var playerStorage = localStorage;
    var secret = generateSecret();
    var turns = [];
    var userObj = {
        nickname: playerStorage.getItem('nickname') || null,
        score: 0
    };
    var nickname, score = 0;
    var gameStarted = true;
    var timeStart = new Date(), timeEnd = new Date();

    var highScores = [
        {nickname: 'Marfa', score: 500},
        {nickname: 'Lubava', score: 470},
        {nickname: 'Petro', score: 320},
        {nickname: 'Ivanko', score: 280},
        {nickname: 'Prohor', score: 250},
        {nickname: 'Anastasia', score: 230},
        {nickname: 'Nestor', score: 180},
        {nickname: 'Varvara', score: 140},
        {nickname: 'Miron', score: 100}
    ];

    // get controls
    //==============================================================================================================
    var guessInput = document.getElementById(options.guessInputID);
    var guessBtn = document.getElementById(options.guessBtnID);
    var guessForm = document.getElementById(options.guessFormID);
    var turnsList = document.getElementById(options.turnsListID);
    var digit1 = document.getElementById(options.digit1ID);
    var digit2 = document.getElementById(options.digit2ID);
    var digit3 = document.getElementById(options.digit3ID);
    var digit4 = document.getElementById(options.digit4ID);
    var winnerForm = document.getElementById(options.winnerFormID);
    var winnerBtn = document.getElementById(options.winnerBtnID);
    var winnerInput = document.getElementById(options.winnerInputID);
    var scoreList = document.getElementById(options.scoreListID);
    var tryAgain = document.getElementById(options.tryAgainID);
    var timeSpent = document.getElementById(options.timeSpentID);
    var winnerScore = document.getElementById(options.winnerScoreID);
    var greeting = document.getElementById(options.greetingID);

    // console.log(secret);

    //EVENTS
    //==============================================================================================================

    if (playerStorage.getItem('nickname')) {
        var greet = document.createElement('span');
        greet.innerText = 'Hello, ' + playerStorage.getItem('nickname') + '! ';
        greeting.insertBefore(greet, greeting.firstChild);
    }

    // only digits and special keys
    guessInput.focus();
    guessInput.addEventListener('keydown', specialKeysInput);
    guessInput.addEventListener('keyup', function (ev) {
        if (event.keyCode == 13) {
            guessBtn.click();
        }
    });

    //Main Guess Event
    guessBtn.addEventListener('click', mainGameAction);

    // Winner action
    winnerBtn.addEventListener('click', winnerAction);
    winnerInput.addEventListener('keyup', function (ev) {
        if (event.keyCode == 13) {
            winnerBtn.click();
        }
    });

    //Try Again
    tryAgain.addEventListener('click', tryAgainAction);

    //==============================================================================================================

    //Main Mame Action
    //==============================================================================================================
    function mainGameAction(ev) {
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
        var time, timeSpend;
        var lengthCheck = new RegExp('[0-9]{4}', 'i');

        //clear guess input
        guessInput.value = '';

        //firs run, get start date
        if (gameStarted) {
            timeStart = Date.now();
            gameStarted = false;
        }

        //check if player enter 4 digits in guess
        if (!lengthCheck.test(userGuess)) {
            renderError('4 digits number, ok?', guessForm);
        } else {

            // check if already guessed this number
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
                    timeEnd = Date.now();

                    // render secret
                    renderSecret(secret);

                    //calc time
                    time = timeEnd - timeStart;
                    timeSpend = new Date(time);
                    timeSpent.innerText = timeSpend.getMinutes() + ':' + timeSpend.getSeconds();

                    //score
                    userObj.score = calcScore(turns, timeSpend);
                    winnerScore.innerText = userObj.score;

                    turnsList.classList.add('none');
                    guessForm.classList.add('none');
                    winnerForm.classList.remove('none');

                    if (playerStorage.getItem('nickname')) {
                        winnerInput.value = playerStorage.getItem('nickname');

                    }
                    winnerInput.focus();

                } else {
                    turnsList.appendChild(turnHTML);
                }

            } else {
                //render error about same number
                renderError('Already guessed this number!', guessForm);

            }

        }

    }

    //Winner Action
    //==============================================================================================================
    function winnerAction(ev) {
        var usernameCheck = new RegExp('^((\\w)*(\\s)?)*$', 'gmi');

        if (usernameCheck.test(winnerInput.value)) {
            userObj.nickname = winnerInput.value;

            //saving results to local storage
            saveResults(userObj.nickname, userObj.score);

            // add player to highscore list and sort
            highScores.push(userObj);
            highScores.sort(function (a, b) {
                return b.score - a.score;
            });

            // render scores list
            renderScores(highScores, scoreList);
            winnerForm.classList.add('none');
            scoreList.classList.remove('none');
        } else {
            renderError('Incorrect name! English characters and numbers only.', winnerForm);
        }
    }

    // Count Scores
    //==============================================================================================================
    function calcScore(turns, time) {
        var result = 0;
        var mins = time.getMinutes();
        var secs = time.getSeconds();
        var maxTime = 2 * 60;
        var timeBonus = 500;
        var userTimeSec = mins * 60 + secs;
        var perc, bonus;

        // guess bonus
        _.forEach(turns, function (turn) {
            // if (turn.sheeps > 0) {
            //     result += turn.sheeps * 5;
            // }
            if (turn.rams > 0) {
                result += turn.rams * 10;
            }

        });

        //timebonus
        if (userTimeSec < maxTime) {
            perc = 100 * userTimeSec / maxTime;
            bonus = (100 - perc) / 100 * timeBonus;

            result += _.round(bonus, -1);
        }

        return result;
    }

    // LocalStorage actions
    //==============================================================================================================
    function saveResults(nickname, score) {
        if (Modernizr.localstorage) {
            playerStorage.setItem('nickname', nickname);
            playerStorage.setItem('score', score);

        } else {
            // localStorage not supported
            return false;
        }
    }

    // Try Again
    //==============================================================================================================
    function tryAgainAction(ev) {
        location.reload(true);
    }

    // Render secret after win
    //==============================================================================================================
    function renderSecret(secret) {
        var digits = secret.split('');

        digit1.innerText = digits[0];
        digit2.innerText = digits[1];
        digit3.innerText = digits[2];
        digit4.innerText = digits[3];
    }

    //Render Error
    //==============================================================================================================
    function renderError(message, appendTo) {
        var error;
        error = document.createElement('div');
        error.className = 'guess__error';
        error.innerText = message;

        appendTo.appendChild(error);

        setTimeout(function () {
            appendTo.removeChild(error);
        }, 2000);

    }

    // Render Turn Data
    //==============================================================================================================
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

    // Render Turn Data
    //==============================================================================================================
    function renderScores(highScores, appendTo) {
        var containerUL, containerLI, scoreSpan, title;
        var scoreBlock = document.createDocumentFragment();

        //container UL
        containerUL = document.createElement('ul');
        containerUL.className = 'scorelist__container';

        _.forEach(highScores, function (score, i) {

            //container
            containerLI = document.createElement('li');
            containerLI.classList.add('scorelist__row');
            if (score.nickname === userObj.nickname) {
                containerLI.classList.add('user-score');
            }


            //title
            title = document.createElement('h2');
            title.classList.add('scorelist__title');
            title.innerText = (i + 1) + '. ' + score.nickname;

            //score
            scoreSpan = document.createElement('span');
            scoreSpan.classList.add('scorelist__score');
            scoreSpan.innerText = score.score;

            //appends
            title.appendChild(scoreSpan);
            containerLI.appendChild(title);
            containerUL.appendChild(containerLI);
        });
        //appends
        scoreBlock.appendChild(containerUL);
        appendTo.insertBefore(scoreBlock, appendTo.firstChild);
        // return scoreBlock;

    }

    // Secret Number Generator
    //==============================================================================================================
    function generateSecret() {
        var digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        digits.sort(function () {
            return Math.random() - 0.5
        });

        return '0' + digits.slice(0, 3).join('');
    }

    // Sheeps and Rams Counter
    //==============================================================================================================
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

    // Only digits and special keys
    //==============================================================================================================
    function specialKeysInput(ev) {
        var numbers = _.range(48, 58);
        var numbersPad = _.range(96, 106);
        var additional = [8, 9, 13, 16, 17, 27, 35, 36, 37, 38, 46];
        var keys = _.concat(numbers, numbersPad, additional);

        if (_.indexOf(keys, ev.keyCode) > -1) {
            return true;
        } else {
            ev.preventDefault();
            return false;
        }
    }


})();