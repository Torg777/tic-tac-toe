let startBlock = document.querySelector(".start-block");
let gameBlock = document.querySelector(".game-block");
let startNumInp = document.querySelector(".num");
let startBtn = document.querySelector(".start-button");
let xOrO = document.querySelectorAll(".btn_x_o");
let tokenButtons = document.querySelector(".token_buttons");
let userToken;
let computerToken;
let boxArr = [];
let score = [];
let timerId;
let oIsClicked = true;
let lastGame = true;
let selectToken;
let gameEnd = false;
let firstWin = true;
let preoritet = [];
let verifiedIndexVertical = [];
let verifiedIndexHorizonal = [];
let verifiedIndexAngLeft = [];
let verifiedIndexAngRight = [];
let verifedXO = {};


startBtn.addEventListener("click", () => {
  let n = +startNumInp.value;
  if (userToken == undefined) {
    if (selectToken == undefined) {
      selectToken = document.createElement("p");
      selectToken.style = "color:red";
      selectToken.innerText = "please select your token";
      tokenButtons.prepend(selectToken);
    }
  } else {
    if (selectToken != undefined) {
      selectToken.remove();
    }
    if (n % 2 != 0 && n <= 9) {
      startBlock.classList = "start-block d-flex d-none";
      gameBlock.classList = "game-block d-flex";

      createTable(n);
      userClick(n);
    } else {
      selectToken = document.createElement("p");
      selectToken.style = "color:red";
      selectToken.innerText = "Please select the number that matches the rules";
      tokenButtons.prepend(selectToken);
    }
  }
});

xOrO.forEach((e, i) => {
  xOrO[0].innerText = "X";
  xOrO[1].innerText = "O";
  e.addEventListener("click", () => {
    if (i == 0) {
      whatToken = 1;
      userToken = "X";
      computerToken = "O";
    } else {
      whatToken = 0;
      userToken = "O";
      computerToken = "X";
    }
    e.style.border = "1px solid blue";
    xOrO[whatToken].style.border = "none";
  });
});

function createTable(n) {
  let table = document.createElement("div");
  table.classList = "table d-flex";
  preoritet = [];
  verifedXO = {
    horizonal: [],
    vertical: [],
    angLeft: [],
    angRight: [],
  }
  for (i = 0; i < n; i++) {
    verifedXO.horizonal.push({ user: false, computer: false, userAmountWin: n, computerAmountWin: n });
    verifedXO.vertical.push({ user: false, computer: false, userAmountWin: n, computerAmountWin: n });
  }
  verifedXO.angLeft.push({ user: false, computer: false, userAmountWin: n, computerAmountWin: n });
  verifedXO.angRight.push({ user: false, computer: false, userAmountWin: n, computerAmountWin: n });
  for (i = 0; i < n * n; i++) {
    let box = document.createElement("div");
    box.classList = `box d-flex box-${i}`;
    box.setAttribute(
      "style",
      `width:${(300 - n * 2) / n}px;height: ${(300 - n * 2) / n}px`
    );
    boxArr.push(box);
    table.append(box);
    score.push(i);

    preoritet.push(0);
    verifiedIndexHorizonal.push(false);
    verifiedIndexVertical.push(false);
    verifiedIndexAngLeft.push(false);
    verifiedIndexAngRight.push(false);
  }

  if (userToken == "O" && lastGame) {
    lastGame = false;
    cumputerClick(n);
  } else {
    userClick(n);
  }
  gameBlock.append(table);
}

function userClick(n) {
  boxArr.forEach((e, i) => {
    e.addEventListener("click", () => {
      if (!isNaN(score[i]) && oIsClicked) {
        e.innerText = userToken;
        score[i] = userToken;
        oIsClicked = false;
      } else return;
      // whoWon(n);
      checkClick(n);
      cumputerClick(n);
    });
  });
}

function checkClick(n) {
  // horizontal check
  for (i = 0; i < n; i++) {
    let changed = false;
    for (k = i * n; k < i * n + n; k++) {
      if (!verifiedIndexHorizonal[k] && isNaN(score[k])) {
        verifiedIndexHorizonal[k] = true;
        preoritet[k] = 0;
        if (score[k] == userToken) {
          verifedXO.horizonal[i].user = true;
          changed = true;
          verifiedIndexHorizonal[i].userAmountWin--
        }
        else {
          verifedXO.horizonal[i].computer = true;
          changed = true;
          verifiedIndexHorizonal[i].computerAmountWin--
        };
      }
      if (k == i * n + n - 1 && changed) {
        k = i * n;
        changed = false;
      }
      if (!isNaN(score[k]) && !changed) {
        if ((verifedXO.horizonal[i].user && !verifedXO.horizonal[i].computer) || (!verifedXO.horizonal[i].user && verifedXO.horizonal[i].computer)) {
          preoritet[k]++
        }
        if (verifedXO.horizonal[i].userAmountWin == 1) {
          preoritet[k] += 5
        } else if (verifedXO.horizonal[i].computerAmountWin == 1) {
          preoritet[k] += 10
        }
      }
    }
  }

  //vertical check
  for (i = 0; i < n; i++) {
    let changed = false;
    for (k = i; k <= n ** 2 + i - n; k = k + n) {
      if (!verifiedIndexVertical[k] && isNaN(score[k])) {
        verifiedIndexVertical[k] = true;
        preoritet[k] = 0;
        if (score[k] == userToken) {
          verifedXO.vertical[i].user = true;
          changed = true;
          verifedXO.vertical[i].userAmountWin--;
        }
        else {
          verifedXO.vertical[i].computer = true;
          changed = true;
          verifedXO.vertical[i].computerAmountWin--;
        };
      }
      if (k == n ** 2 + i - n && changed) {
        k = i;
        changed = false;
      }
      if (!isNaN(score[k]) && !changed) {
        if ((verifedXO.vertical[i].user && !verifedXO.vertical[i].computer) || (!verifedXO.vertical[i].user && verifedXO.vertical[i].computer)) {
          preoritet[k]++
        }
        if (verifedXO.vertical[i].userAmountWin == 1) {
          preoritet[k] += 5
        } else if (verifedXO.vertical[i].computerAmountWin == 1) {
          preoritet[k] += 10
        }
      }
    }
  }

  let changed = false;
  // angLeft
  for (k = 0; k <= n ** 2 - 1; k = k + n + 1) {
    if (!verifiedIndexAngLeft[k] && isNaN(score[k])) {
      verifiedIndexAngLeft[k] = true;
      preoritet[k] = 0;
      if (score[k] == userToken) {
        verifedXO.angLeft[0].user = true;
        changed = true;
        verifedXO.angLeft[0].userAmountWin--
      }
      else {
        verifedXO.angLeft[0].computer = true;
        changed = true;
        verifedXO.angLeft[0].computerAmountWin--
      };
    }
    if (k == n ** 2 - 1 && changed) {
      k = 0;
      changed = false;
    }
    if (!isNaN(score[k]) && !changed) {
      if ((verifedXO.angLeft[0].user && !verifedXO.angLeft[0].computer) || (!verifedXO.angLeft[0].user && verifedXO.angLeft[0].computer)) {
        preoritet[k]++
      }
      if (verifedXO.angLeft[0].userAmountWin == 1) {
        preoritet[k] += 5
      } else if (verifedXO.angLeft[0].computerAmountWin == 1) {
        preoritet[k] += 10
      }
    }
  }

  // angRight
  for (k = n - 1; k <= n ** 2 - n; k = k + n - 1) {
    if (!verifiedIndexAngRight[k] && isNaN(score[k])) {
      verifiedIndexAngRight[k] = true;
      preoritet[k] = 0;
      if (score[k] == userToken) { 
        verifedXO.angRight.user = true;
         changed = true;
         verifedXO.angRight[0].userAmountWin--
        }
      else {
        verifedXO.angRight.computer = true;
        changed = true;
        verifedXO.angRight[0].computerAmountWin--
      };
    }
    if (k == n ** 2 - n && changed) {
      k = n - 1;
      changed = false;
    }
    if (!isNaN(score[k]) && !changed) {
      if ((verifedXO.angRight.user && !verifedXO.angRight.computer) || (!verifedXO.angRight.user && verifedXO.angRight.computer)) {
        preoritet[k]++
      }
      if (verifedXO.angRight[0].userAmountWin == 1) {
        preoritet[k] += 5
      } else if (verifedXO.angRight[0].computerAmountWin == 1) {
        preoritet[k] += 10
      }
    }
  }
}


function cumputerClick(n) {
  if (!gameEnd) {
    //preoritet click
    let item = preoritet.indexOf(Math.max(...preoritet));

    score[item] = computerToken;
    timerId = setTimeout(() => {
      boxArr[item].innerText = computerToken;
      oIsClicked = true;
    }, 1000);



    //   let random = Math.floor(Math.random() * n ** 2);

    //   if (!isNaN(score[random])) {
    //     score[random] = computerToken;
    //     timerId = setTimeout(() => {
    //       boxArr[random].innerText = computerToken;
    //       oIsClicked = true;
    //     }, 1000);
    //   } else {
    //     cumputerClick(n);
    //   }

    // checkClick(n);
    whoWon(n);
  }

  gameEnd = false;
}

function whoWon(n) {
  let wonXNum = 0;
  let wonONum = 0;
  let end = 0;

  for (i = 0; i < n ** 2; i++) {
    if (verifiedIndexHorizonal[i]) {
      end++;
      if (end == n ** 2 - 1) { nobody() }
    }
  }
  for (i = 0; i < n ** 2; i += n) {
    wonXNum = 0;
    wonONum = 0;
    for (y = i; y < n + i; y++) {
      if (score[y] === userToken) {
        wonXNum++;
        if (wonXNum == n && firstWin) {
          firstWin = false;
          wonX();
          return;
        }
      } else {
        wonXNum = 0;
      }
      if (score[y] === computerToken) {
        wonONum++;
        if (wonONum == n && firstWin) {
          firstWin = false;
          wonO();
          return;
        }
      } else {
        wonONum = 0;
      }
    }
    wonXNum = 0;
    wonONum = 0;
  }

  for (i = 0; i < n; i++) {
    wonXNum = 0;
    wonONum = 0;
    for (y = i; y < n ** 2; y += n) {
      if (score[y] === userToken) {
        wonXNum++;

        if (wonXNum == n && firstWin) {
          firstWin = false;
          wonX();
          return;
        }
      } else {
        wonXNum = 0;
      }
      if (score[y] === computerToken) {
        wonONum++;
        if (wonONum == n && firstWin) {
          firstWin = false;
          wonO();
          return;
        }
      } else {
        wonONum = 0;
      }
    }
    wonXNum = 0;
    wonONum = 0;
  }

  wonXNum = 0;
  wonONum = 0;

  for (i = 0; i < n ** 2; i += n + 1) {
    if (score[i] === userToken) {
      wonXNum++;

      if (wonXNum == n && firstWin) {
        firstWin = false;
        wonX();
        return;
      }
    }
    if (score[i] === computerToken) {
      wonONum++;
      if (wonONum == n && firstWin) {
        firstWin = false;
        wonO();
        return;
      }
    }
  }
  wonXNum = 0;
  wonONum = 0;
  for (i = n - 1; i <= n ** 2 - n; i += n - 1) {
    if (score[i] === userToken) {
      wonXNum++;

      if (wonXNum == n && firstWin) {
        firstWin = false;
        wonX();
        return;
      }
    }
    if (score[i] === computerToken) {
      wonONum++;
      if (wonONum == n && firstWin) {
        firstWin = false;
        wonO();
        return;
      }
    }
  }

}

function nobody() {
  gameEnd = true;
  verifiedIndexVertical = [];
  verifiedIndexHorizonal = [];
  verifiedIndexAngLeft = [];
  verifiedIndexAngRight = [];
  verifedXO = {};
  setTimeout(() => {
    if (document.querySelector(".table")) {
      document.querySelector(".table").remove();
    }
    startBlock.classList = "start-block d-flex";
    gameBlock.classList = "game-block d-flex d-none";
    score = [];
    boxArr = [];
    lastGame = true;
    oIsClicked = true;

    clearTimeout(timerId);
    setTimeout(() => {
      alert("Nobody");
      firstWin = true;
    }, 150);
  }, 1000);
}

function wonX() {
  gameEnd = true;
  verifiedIndexVertical = [];
  verifiedIndexHorizonal = [];
  verifiedIndexAngLeft = [];
  verifiedIndexAngRight = [];
  verifedXO = {};
  setTimeout(() => {
    if (document.querySelector(".table")) {
      document.querySelector(".table").remove();
    }
    startBlock.classList = "start-block d-flex";
    gameBlock.classList = "game-block d-flex d-none";
    score = [];
    boxArr = [];
    lastGame = true;
    oIsClicked = true;

    clearTimeout(timerId);
    setTimeout(() => {
      alert("You Win");
      firstWin = true;
    }, 150);
  }, 1000);
}

function wonO() {
  verifiedIndexVertical = [];
  verifiedIndexHorizonal = [];
  verifiedIndexAngLeft = [];
  verifiedIndexAngRight = [];
  verifedXO = {};
  gameEnd = true;
  setTimeout(() => {
    document.querySelector(".table").remove();
    startBlock.classList = "start-block d-flex";
    gameBlock.classList = "game-block d-flex d-none";
    score = [];
    boxArr = [];
    lastGame = true;
    oIsClicked = true;

    clearTimeout(timerId);
    setTimeout(() => {
      alert("Game Over");
      firstWin = true;
    }, 150);
  }, 1500);
}

