// РАСПОЛОЖЕНИЕ ЯЧЕЕК И ИХ БОРДЕРЫ
const cells = document.getElementsByClassName("cell");
var countFirst = 0;
var countLast = 90;
for (var cell in cells) {
    if (countFirst < 10) {
        cells[countFirst].style.borderTop = "1px solid black";
        countFirst++;
    }
}
for (var cell in cells) {
    if (countLast < 100) {
        cells[countLast].style.borderBottom = "1px solid black";
        countLast++;
    }
}

// КОНЕЦ

// ПЕРЕКЛЮЧАТЕЛЬ Х - П 

const chk = document.getElementById('chk');
const ballX = document.getElementById('ball-x');
const ballSquare = document.getElementById('ball-square');
const board = document.getElementById('board');
var currentClass;

chk.addEventListener('change', () => {
    ballSquare.classList.toggle('show');
    ballX.classList.toggle('hide');

    if (ballSquare.classList.contains('show')) {
        board.classList.remove('x');
        board.classList.add('fill');
        currentClass = FILL_CLASS;
    } else {
        board.classList.remove('fill');
        board.classList.add('x');
        currentClass = X_CLASS;
    }
});

// КОНЕЦ

// ФИКСАЦИЯ КООРДИНАТ ОТНОСИТЕЛЬНО ДОСКИ

function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

var boardTop = getOffset(board).top;
var boardLeft = getOffset(board).left;
const rows = document.getElementById("rows");
const columns = document.getElementById("columns");
const toggle_ = document.getElementById("toggle_");

rows.style.top = (boardTop - 122) + "px";
rows.style.left = boardLeft + "px";
columns.style.top = boardTop + "px";
columns.style.left = (boardLeft - 106) + "px";
toggle_.style.top = (boardTop + 500) + "px";

window.onresize = function () {
    var boardTop = getOffset(board).top;
    var boardLeft = getOffset(board).left;
    rows.style.top = (boardTop - 106) + "px";
    rows.style.left = boardLeft + "px";
    columns.style.top = boardTop + "px";
    columns.style.left = (boardLeft - 106) + "px";
}

// КОНЕЦ

// ЛОГИКА ИГРЫ 
const X_CLASS = 'x';
const FILL_CLASS = 'fill';
const cellElements = document.querySelectorAll('[data-cell]');

var id = 0;
for (var i = 0; i < cellElements.length; i++) {
    cellElements[i].setAttribute("id", id);
    id++;
}

var WINNING_COMBINATION = JSON.parse(localStorage.getItem("WINNING_COMBINATION"));

currentClass = X_CLASS;
var fail = 0;

startGame();

function startGame() {
    cellElements.forEach(cell => {
        cell.addEventListener('click', handleClick)
    });
}

function handleClick(e) {
    const cell = e.target;
    if (checkCell(cell, currentClass) == true) {
        placeMark(cell, currentClass);
    } else {
        fail++;
        console.log(fail)
        cell.classList.add('fail');
        setTimeout(() => cell.classList.remove('fail'), 2000)
        placeMark(cell, swapClass(currentClass));
        var heart = document.getElementById("heart-" + fail);
        heart.classList.add("heart-fall");
        setTimeout(() => heart.style.opacity="0", 1000)
        if (checkFail(fail) == true) {
            const gameOver = document.getElementById("game-over");
            const global = document.getElementById("global");
            gameOver.style.display = "flex";
            global.style.opacity = "0.5";
            global.pointerEvents = "none";
        }
    }
    if (checkWin() == true) {
        const winningMessage = document.getElementById("winning-message");
        winningMessage.style.display = "flex";
        confetti.start();
    }
}

function swapClass(currentClass) {
    if (currentClass == X_CLASS) {
        return FILL_CLASS;
    } else {
        return X_CLASS;
    }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function checkCell(cell, currentClass) {
    if (currentClass == FILL_CLASS) {
        for (var index in WINNING_COMBINATION) {
            if (cell.id == WINNING_COMBINATION[index]) {
                return true;
            }
        }
    } else {
        var flag = true;
        for (var index in WINNING_COMBINATION) {
            if (cell.id == WINNING_COMBINATION[index]) {
                flag = false;
            }
        }
        return flag;
    }
}

function checkWin() {
    var total = [];
    var everyFill = document.getElementsByClassName("fill");
    for (var i = 1; i < everyFill.length; i++) {
        total.push(Number(everyFill[i].id))
    }
    if (arraysEqual(total, WINNING_COMBINATION)) {
        return true;
    }
}

function arraysEqual(a1, a2) {
    return JSON.stringify(a1) == JSON.stringify(a2);
}

function checkFail(fail) {
    if (fail == 3) {
        return true;
    } else {
        return false;
    }
}

// КОНЕЦ

// ЗАДАЕМ КООРДИНАТЫ

const columnElements = document.getElementsByClassName("column");
var columns_id = 0;
for (var i = 0; i < columnElements.length; i++) {
    columnElements[i].setAttribute("id", "column-" + columns_id);
    columns_id++;
}

secrNum = 0;
while (secrNum < 10) {
    col = document.getElementById("column-" + secrNum);
    arry = sortArray(counter(defy(secrNum, WINNING_COMBINATION)));
    for (var j = 0; j < arry.length; j++) {
        span = document.createElement("span");
        span.innerHTML = arry[j];
        col.appendChild(span)
    }
 
    secrNum++;
}

function defy(need, arr) {
    result = []
    for (i in arr) {
        num = (arr[i] - arr[i] % 10) / 10;
        if (num == need) {
            result.push(arr[i])
        }
    }
    return result;
}

function counter(result) {
    final = [0,0,0,0,0]
    arr =[]
    for (i in result) {
        arr.push(result[i] % 10)
    }
    return arr;
}

function sortArray(arr) {
    res = new Array();
    temp = new Array();
    for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i]);
        if (arr[i]+1 != arr[i+1]) {
            res.push(temp.length);
            temp = [];
        }
    }
    return res;
}

// КООРДИНАТЫ ДЛЯ РОУС

const rowElements = document.getElementsByClassName("row");
var row_id = 0;
for (var i = 0; i < rowElements.length; i++) {
    rowElements[i].setAttribute("id", "row-" + row_id);
    row_id++;
}

sacrNum = 0;
while (sacrNum < 10) {
    row = document.getElementById("row-" + sacrNum);
    arry = sortArray(acounter(identify(sacrNum, WINNING_COMBINATION)));
    for (var j = 0; j < arry.length; j++) {
        span = document.createElement("span");
        span.innerHTML = arry[j];
        row.appendChild(span)
    }

    sacrNum++;
}

function identify(need, arr) {
    result = []
    for (i in arr) {
        if (arr[i] % 10 == need) {
            result.push(arr[i])
        }
    }
    return result;
}

function acounter(result) {
    final = [0, 0, 0, 0, 0]
    arr = []
    for (i in result) {
        arr.push((result[i] - result[i] % 10) / 10)
    }
    return arr;
}

const changeRole = document.getElementById("change-role");
const creationBoard = document.getElementById("creation-board");
const creationPost = document.getElementById("creation-post");
document.addEventListener("keydown", function (event) {
    if (event.key == "z" && event.ctrlKey == true) {
        changeRole.classList.toggle("show");
    }
    console.log(event)
})

function showCreation() {
    if (changeRole.classList.contains("show")) {
        WINNING_COMBINATION = [];
        creationBoard.classList.toggle("showCreation")
        creationBoard.style.display = "grid";
        creationPost.style.top = (getOffset(creationBoard).top + 720) + "px";
        create();
    }
}

const hostElements = document.querySelectorAll('[data-host]');

var host_id = 0;
for (var i = 0; i < hostElements.length; i++) {
    hostElements[i].setAttribute("id", "host-" + host_id);
    host_id++;
}

function create() {
    hostElements.forEach(host => {
        host.addEventListener('click', handleCreation)
    });
}

function handleCreation(e) {
    const host = e.target;
    placeHost(host);
    // console.log(host.id.replace("host-", ""))
    WINNING_COMBINATION.push(Number(host.id.replace("host-", "")))
}

function placeHost(host) {
    host.classList.add("fill");
}

// ДЕКОРАЦИЯ КВАДРАТИКОВ

const hosts = document.getElementsByClassName("host");
var countF = 0;
var countL = 90;
for (var host in hosts) {
    if (countF < 10) {
        hosts[countF].style.borderTop = "1px solid black";
        countF++;
    }
}
for (var host in hosts) {
    if (countL < 100) {
        hosts[countL].style.borderBottom = "1px solid black";
        countL++;
    }
}

// КОНЕЧНАЯ ФУНКЦИЯ 

function post() {
    console.log(WINNING_COMBINATION.sort())
    localStorage.setItem("WINNING_COMBINATION", JSON.stringify(WINNING_COMBINATION.sort((a, b) => a - b)));
    window.location.reload();
}