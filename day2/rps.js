// 1 Prompt the user to enter rock, paper, or scissors
// 2 Randomly get computer's selection
// 3 Display winner or tie

// paper beats rock, rock beats scissors, 
// scissors beats paper


function domAlert(msg) {
    var div = document.createElement('div');
    div.innerHTML = msg;
    div.setAttribute('class', 'alert_class');
    document.body.appendChild(div);
}

var promptInput = document.getElementById('promptInput');


promptInput.onkeydown = function(evt) {
    if (evt.key === "Enter") {
        var human = promptInput.value;
        if (human === 'r' || human === 'p' || human === 's') {
            computeWinner(human);
        }
    }
};


function computeWinner(human) {
    var computer = ['r', 'p', 's'][Math.floor(Math.random() * 3)];

    if (human === computer) {
        domAlert('tie: both players picked ' + computer);
    }

    if (human === 'r') {
        if (computer === 'p') {
            domAlert('Computer wins!');
        } else if (computer === 's') {
            domAlert('Human wins!');
        }
    } else if (human === 'p') {
        if (computer === 'r') {
            domAlert('Human wins!');
        } else if (computer === 's') {
            domAlert('comptuer wins!')
        }
    } else { // human === 's'
        if (computer === 'r') {
            domAlert('Computer wins!');
        } else if (computer === 'p') {
            domAlert('Human wins!');
        }
    }
}












