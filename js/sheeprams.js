// todo
// add only numbers validation for guess-input
// clear input data on click

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
    guessInput.addEventListener('keydown', function (ev) {
        console.log(ev);
        return ("0123456789".indexOf(ev.key) > -1);
    });
})();