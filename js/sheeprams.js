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
        this.value = '';
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
        return '0' + _.random(100,999);
    }

    // setInterval(function () {
    //     console.log(generateNumber());
    // }, 1000);


})();