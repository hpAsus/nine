// todo
// for guess-input on submit check if it's 4 digits number


(function () {

    var options = {
        guessInputID: 'guess-input',
        guessBtnID: 'guess-btn'
    };

    var guessInput = document.getElementById(options.guessInputID);
    var guessBtn = document.getElementById(options.guessBtnID);

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


    // PC Number Generator
    function generateNumber() {
        return '0' + _.random(100, 999);
    }

    console.log(generateNumber());

    var pcNumber = '0375';
    var guess = '7145';

    console.log(countSheepsNRams('0375', '7145'));
    console.log(countSheepsNRams('0375', '7175'));

    function countSheepsNRams(number, guess) {
        var num1 = number.split('');
        var num2 = guess.split('');
        var results = {
            sheeps: 0,
            rams: 0
        };
        _.forEach(num2, function (digit) {
            
        });
        /*var same = _.intersection(num1, num2);

        console.log(same);
        if (same.length) {
            _.forEach(same, function (item) {
                var pos1 = _.indexOf(num1, item);
                var pos2 = _.indexOf(num2, item);
                if (pos1 !== pos2) {
                    results.sheeps++;
                } else {
                    results.rams++;
                }
            });
        } else {
            return 0;
        }*/
        return results;
    }

    // setInterval(function () {
    //     console.log(generateNumber());
    // }, 1000);


})();