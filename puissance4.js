var game         = true;
var color1       = 'blue';
var color2       = 'red';
var elementColor = color1;
var name         = 'bleu';
var nbRow        = 6;
var nbCol        = 7;
var countBlueRow = 0;
var countBlueCol = [];
var countRedRow  = 0;
var countRedCol  = [];
var countRow     = countBlueRow;
var countCol     = countBlueCol;
var joueur       = false;

createPlayboard(nbRow, nbCol);

function createPlayboard(nbRow, nbCol)
{
    $("#end").hide();    //cacher l'affichage de sortie de jeu
    $("#replay").hide(); //cacher l'affichage de fin de partie
    var gameboard = $('#gameboard');
    for (var row = 0; row < nbRow; row++)
    {
        for (var col = 0; col < nbCol; col++)
        {
            gameboard.append(
                $('<div>')
                    .attr("id", row + "-" + col)
                    .addClass("col")
                    .css("height", (100 / nbRow) + "%")
                    .css("width" , (100 / nbCol) + "%")
            );

            if (row === 0) gameboard.on('click', '#' + row + '-' + col, selectCase);
        }
    }
}

function selectCase(eventMouseClick)
{
    $(eventMouseClick).css("background", elementColor);
    var row = eventMouseClick.target.id.split("-")[0];
    var col = eventMouseClick.target.id.split("-")[1];
    fallDown(row, col);
}

function fallDown(row, col)
{
    setTimeout(function () //setTimeout pour ralentir la chute des carré
    {
        var nextRow = document.getElementById((row + "-" + col).toString());//selectionne le row suivant
        //si le row suivant est libre:
        if ((row < nbRow) && nextRow.style.backgroundColor != color1 && nextRow.style.backgroundColor != color2) {
            changeColorPreviousRow(row, col);
            nextRow.style.background = elementColor;
            row++;
            fallDown(row, col);
        }
        else {
            checkWinInRows();
            checkWinInCols();
            if (game) switchPlayer();
        }
    }, 50);
}

function changeColorPreviousRow(row, col)
{
    if (row > 0) var prevRow = document.getElementById(((row - 1) + "-" + col).toString());
    else var prevRow = document.getElementById(((row) + "-" + col).toString());
    prevRow.style.background = 'white';
    prevRow.style.background = null; //pour que la div change toujours de couleur quand hoveré
}

function switchPlayer()
{
    joueur = !joueur;
    if (joueur == false) {
        name = 'bleu';
        elementColor = 'blue';
        victoryColor = 'lightblue';
        countRow = countBlueRow;
        countCol = countBlueCol;
    }
    else {
        name = 'rouge';
        elementColor = 'red';
        victoryColor = 'tomato';
        countRow = countRedRow;
        countCol = countRedCol;
    }
    var root = document.documentElement;
    $(root).css("--hoverColor", elementColor);
    displayMessage("joueur " + name + " à vous de jouer");
}

function displayMessage(message)
{
    document.getElementById("msg").innerHTML = message;
}

function checkWinInRows()
{
    for (var row = 0; row < nbRow; row++) {
        for (var col = 0; col < nbCol; col++) {
            var id = (row + "-" + col).toString();
            if (document.getElementById(id).style.backgroundColor == color1)
            {
                countBlueCol++;
                if ((countBlueCol) >= 4) win('horizontal', row, col);

            }
            else countBlueCol = 0;
            if (document.getElementById(id).style.backgroundColor == color2)
            {
                countRedCol++;
                if ((countRedCol) >= 4) win('horizontal', row, col);
            }
            else countRedCol = 0;
        }
    }
}

function checkWinInCols()
{
    for (var col = 0; col < nbCol; col++) {
        for (var row = 0; row < nbRow; row++) {
            var id = (row + "-" + col).toString();
            if (document.getElementById(id).style.backgroundColor == color1) {
                countBlueRow++;
                if ((countBlueRow) >= 4) win('vertical', row, col);

            }
            else countBlueRow = 0;
            if (document.getElementById(id).style.backgroundColor == color2) {
                countRedRow++;
                if ((countRedRow) >= 4) win('vertical', row, col);
            }
            else countRedRow = 0;
        }
    }
}

function win(direction, row, col)
{
    if (direction === "horizontal") {
        for (var i = col; i > (col - 4); i--) {
            document.getElementById((row + "-" + i).toString()).style.backgroundColor = victoryColor;
        }
    }
    else if (direction === "vertical") {
        for (var i = row; i > (row - 4); i--) {
            document.getElementById((i + "-" + col).toString()).style.backgroundColor = victoryColor;
        }
    }
    displayMessage("joueur " + name + " vous avez gagné");
    game = false;
    functionAlert();
}

function functionAlert(msg, myYes)
{
    var confirmBox = $("#replay");
    confirmBox.find(".message").text(msg);
    confirmBox.find("#oui").on('click', replay);
    confirmBox.find("#non").on('click', gameover);
    confirmBox.show();
}

function gameover()
{
    //window.location.href = 'https://www.portfolio-romain.fr/';
    $("#main").hide();
    $("#replay").hide();
    $("#end").show();
}

function replay()
{
    var gameboard = $('#gameboard');
    for (var col = 0; col < nbCol; col++) {
        gameboard.off('click', '#0-' + col, selectCase);//disconnect event listener
    }
    location.reload(true);
}