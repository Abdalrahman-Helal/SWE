// const score = { 
//   wins: 0,
//   losses : 0,
//   ties: 0
// };

let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0,
};
updateScoreElement();

// if(!score) {
//   score ={ 
//     wins: 0,
//     losses: 0,
//     ties: 0,
//   }
// }

let isAutoPlaying = false;
let intervalId;

// const autoPlay = () => {

// };

function autoPlay() {
  if (!isAutoPlaying) {
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);
    isAutoPlaying = true;
    document.querySelector('.js-autoPlay-button').innerHTML = 'Stop Playing';
  } else {
    clearInterval(intervalId);
    isAutoPlaying = false;
    document.querySelector('.js-autoPlay-button').innerHTML = 'Auto Play';
  }
}

document.querySelector('.js-rock-button').addEventListener('click', () => {
  playGame('rock');
});

document.querySelector('.js-paper-button').addEventListener('click', () => {
  playGame('paper');
})

document.querySelector('.js-scissors-button').addEventListener('click', () => {
  playGame('scissors');
})

document.querySelector('.js-autoPlay-button').addEventListener('click', () => {
  autoPlay();
})




document.querySelector('.js-reset-button').addEventListener('click', () => {
  score.wins = 0; score.losses = 0; score.ties = 0;
  localStorage.removeItem('score');
  updateScoreElement();
})

document.body.addEventListener('keydown', (event) => {
  if (event.key === 'r' || event.key === 'R') {
    playGame('rock');
  }
  else if (event.key === 'p' || event.key === 'P') {
    playGame('paper');
  }
  else if (event.key === 's' || event.key === 'S') {
    playGame('scissors');
  }
  else if (event.key === 'a' || event.key === 'A') {
    autoPlay();
  }
  else if (event.key === 'Backspace') {
    showResetConfirmation();
  }
  else if(event.key === 'y' || event.key === 'Y') {
    resetScore();
  }
  else if (event.key === 'n' || event.key === 'N') {
    hideResetConfirmation();
  }
});

function showResetConfirmation() {
  document.querySelector('.js-p-confirm').innerHTML = `Are you sure you want to reset the score ? <button class="js-yes-score">Yes</button>
    <button class="js-no-score">No</button>`;

  document.querySelector('.js-yes-score').addEventListener('click', () => {
    resetScore();
  })

  document.querySelector('.js-no-score').addEventListener('click', () => {
    hideResetConfirmation();
  })
}

// document.body.addEventListener('keydown', (event) => {
//   if (event.key === 'a' || event.key === 'A') {
//     autoPlay();
//   }
// })


// document.body.addEventListener('keydown', (event) => {
//   if (event.key === 'Backspace') {
//     document.querySelector('.js-p-confirm').innerHTML = `Are you sure you want to reset the score ? <button class="js-yes-score">Yes</button>
//     <button class="js-no-score">No</button>`;

//     document.querySelector('.js-yes-score').addEventListener('click', () => {
//       score.wins = 0; score.losses = 0; score.ties = 0;
//       localStorage.removeItem('score');
//       updateScoreElement(); document.querySelector('.js-p-confirm').innerHTML = ''
//     })

//     document.querySelector('.js-no-score').addEventListener('click', () => {
//       document.querySelector('.js-p-confirm').innerHTML = ''
//     })
//   }

// })



function playGame(playerMove) {
  const computerMove = pickComputerMove();
  let result = '';

  if (playerMove === 'scissors') {
    if (computerMove === 'rock') {
      result = 'You lose.';
    } else if (computerMove === 'paper') {
      result = 'You win.';
    } else {
      result = 'Tie.';
    }

  } else if (playerMove === 'paper') {
    if (computerMove === 'rock') {
      result = 'You win.';
    } else if (computerMove === 'paper') {
      result = 'Tie.';
    } else {
      result = 'You lose.';
    }

  } else if (playerMove === 'rock') {
    if (computerMove === 'rock') {
      result = 'Tie.';
    } else if (computerMove === 'paper') {
      result = 'You lose.';
    } else {
      result = 'You win.';
    }
  }

  if (result === 'You win.') {
    score.wins += 1;
  }
  else if (result === 'You lose.') {
    score.losses += 1;
  }
  else if (result === 'Tie.') {
    score.ties += 1;
  }

  localStorage.setItem('score', JSON.stringify(score));
  updateScoreElement();

  document.querySelector('.js-result').innerHTML = result;


  document.querySelector('.js-moves').innerHTML = ` You 
      <img src="Images/${playerMove}-emoji.png" class="move-icons">  
      <img src="Images/${computerMove}-emoji.png" class="move-icons">
      Computer`;



  //alert(`You picked ${playerMove} and Computer picked ${computerMove}. result ${result}
  // Wins ${score.wins}, losses ${score.losses} , Ties ${score.ties}`)
}

function updateScoreElement() {
  document.querySelector('.js-score').innerHTML = `Wins ${score.wins}, losses ${score.losses} , Ties ${score.ties}`;
}

function resetScore() {
  score.wins = 0; score.losses = 0; score.ties = 0;
  localStorage.removeItem('score');
  hideResetConfirmation();
  updateScoreElement();
}

function hideResetConfirmation() {
  document.querySelector('.js-p-confirm').innerHTML = ''
}


function pickComputerMove() {
  const randomNumber = Math.random();
  let computerMove = '';
  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = 'rock';
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'paper';
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = 'scissors';
  }
  return computerMove
}



