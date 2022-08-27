// obteniendo mis elementos del html
const contain = document.querySelector(".game-container");
const canvas = document.querySelector("#canvas-game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector(".up"); 
const btnLeft = document.querySelector(".left"); 
const btnRight = document.querySelector(".right"); 
const btnDown = document.querySelector(".down");
const secondsHtml = document.querySelector("#seconds_acount");
const minutesHtml = document.querySelector("#minutes_acount");
const miliHtml = document.querySelector("#mili_acount");
const recordSpan = document.querySelector(".record");

// creando imagen de new record
const img = new Image();
img.src = "./new_record.svg"

//creando un nuevo elemento para el start view
const startDiv = document.createElement("div")
    startDiv.className = "start"
const startSpan = document.createElement("span")
    startSpan.className = "space"
const spanLives = document.querySelector(".lives");

//event listener
btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);
window.addEventListener("keydown", keyPress);
startDiv.addEventListener("click", start)
window.addEventListener("load", gameCurrrent);
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

//variables de funcionamiento
let canvasSize;
let elementSize;
let level = 0;
let lives = 2;
// let recordStorage;
let playerTime= 100;
// variables de objetos de posiciones
const playerPosicion = {
    x: undefined,
    y: undefined
}
const gifPosicion = {
    x: undefined,
    y: undefined
}
let enemiesPosicion = [];


// flags variables
let loseFlag = false;
let gameCurrrentFlag = false;
let dibujarPlayer = 0;

//variables chronometer
let secondsValue = 0;
let minutesValue = 0;
let miliValue = 0;
let currentChronometer;
let starActive = 1;

//variables para record


// funsciones de inicio
function setCanvasSize(){
    if(window.innerHeight > window.innerWidth && window.innerWidth < 570){
        canvasSize = window.innerWidth*0.8
    }
    else{
        canvasSize = window.innerHeight*0.7
    }
    canvas.setAttribute("width", canvasSize);
    canvas.setAttribute("height", canvasSize);
    elementSize = canvasSize/10;
    startGame()
}
function gameCurrrent(){

    startDiv.textContent ="START"
    if (lives == 0) {

        startDiv.textContent ="Game Over"
    }
    if (!gameCurrrentFlag){

        contain.appendChild(startDiv)
        startSpan.textContent = "click or perss intro"
        startDiv.appendChild(startSpan)
        } else if (gameCurrrentFlag){
        contain.removeChild(startDiv)
            
        }
        
}
function start(){
    dibujarPlayer = 1;
    loseFlag = false;
    gameCurrrentFlag = true;
    startGame()
    gameCurrrent()
    startChronometer()
}
function gameWin(){
    console.log("ganaste");
    // level = 1;
    // lives = 2;
    stopChronometer()
    let minutesRecord = localStorage.getItem("minutes_Storage")
    let secondsRecord = localStorage.getItem("seconds_Storage")
    let miliRecord = localStorage.getItem("mili_Storage")

    if(minutesRecord || secondsRecord || miliRecord){
        if(minutesValue && minutesValue < minutesRecord){
            localStorage.setItem("minutes_Storage", minutesValue);
            localStorage.setItem("seconds_Storage", secondsValue);
            localStorage.setItem("mili_Storage", miliValue);    
            console.log("minutos");
            game.drawImage(img, canvasSize/6 ,4*elementSize, canvasSize/1.5, 150 )

        } else if(secondsValue && secondsValue < secondsRecord){
            localStorage.setItem("minutes_Storage", minutesValue);
            localStorage.setItem("seconds_Storage", secondsValue);
            localStorage.setItem("mili_Storage", miliValue);    
            console.log("seg");

            game.drawImage(img, canvasSize/6 ,4*elementSize, canvasSize/1.5, 150 )
        
        } else if(miliValue && secondsValue == secondsRecord && miliValue < miliRecord){
            localStorage.setItem("minutes_Storage", minutesValue);
            localStorage.setItem("seconds_Storage", secondsValue);
            localStorage.setItem("mili_Storage", miliValue);    
            console.log("mili");

            game.drawImage(img, canvasSize/6 ,4*elementSize, canvasSize/1.5, 150 )

        }
    } else {
        localStorage.setItem("minutes_Storage", minutesValue);
        localStorage.setItem("seconds_Storage", secondsValue);
        localStorage.setItem("mili_Storage", miliValue) ;

        game.drawImage(img, canvasSize/6 ,4*elementSize, canvasSize/1.5, 150 )

    }

    minutesRecord = localStorage.getItem("minutes_Storage");
    secondsRecord = localStorage.getItem("seconds_Storage");
    miliRecord = localStorage.getItem("mili_Storage");
    recordSpan.textContent = valueFormat(minutesRecord) + ":" + valueFormat(secondsRecord) + ":" + valueFormat(miliRecord);

    game.font = 3*elementSize +"px verdana";
    game.textAlign = "center";
    game.fillText(emojis["WIN"], canvasSize/2, 15+(canvasSize/2));

    level = 0;
    lives = 2;
    playerPosicion.x = undefined;
    playerPosicion.y = undefined;
    setTimeout(()=>{
    gameCurrrentFlag = false;
    resetChronometer()
    }, 4999)
    setTimeout(gameCurrrent, 5000)
    
}
function startGame(){
    
    game.clearRect(0,0, canvasSize, canvasSize);
    enemiesPosicion = [];
    game.font = elementSize + "px verdana";
    game.textAlign = "end"

    const map = maps[level];

    showRecord()
    if(!map){
        gameWin()
        return;
    }
    game

    const mapRows = map.trim().split("\n");
    mapCol = mapRows.map(row => row.trim().split(""));
    mapCol.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementSize*(colI + 1);
            const posY = elementSize*(rowI + 1);
            
            
            game.fillText(emoji, posX, posY)
            
            
            if(col == "O"){
                if(!playerPosicion.x && !playerPosicion.y || loseFlag){
                    playerPosicion.x = posX;
                    playerPosicion.y = posY;
    
                }
            } else if(col == "I"){
                
                    gifPosicion.x = posX.toFixed(2);
                    gifPosicion.y = posY.toFixed(2);

            } else if (col == "X"){
                
                enemiesPosicion.push({
                    x: posX.toFixed(2),
                    y: posY.toFixed(2)
                }) 
                
            }
            

        })
        if(dibujarPlayer){
        game.fillText(emojis["PLAYER"], playerPosicion.x , playerPosicion.y);
        } 
        
    });
}
function showRecord(){
    minutesRecord = localStorage.getItem("minutes_Storage");
    secondsRecord = localStorage.getItem("seconds_Storage");
    miliRecord = localStorage.getItem("mili_Storage");
    
    if(!minutesRecord && !secondsRecord && !miliRecord){
        minutesRecord = 0;
        secondsRecord = 0;
        miliRecord =0;
    }
    recordSpan.textContent = valueFormat(minutesRecord) + ":" + valueFormat(secondsRecord) + ":" + valueFormat(miliRecord);
}
//funciones de movimiento
function keyPress(event){
    if (event.code == "ArrowUp"){
        moveUp()
    } else if (event.code == "ArrowLeft"){
        moveLeft()
    } else if (event.code == "ArrowRight"){
        moveRight()
    } else if (event.code == "ArrowDown"){
        moveDown()
    } else if (event.code == "Enter" && !gameCurrrentFlag){
        start()
    }
}
function movePlayer(){
    startGame();

    const gifCollitionX = gifPosicion.x == playerPosicion.x.toFixed(2) ;
    const gifCollitionY = gifPosicion.y == playerPosicion.y.toFixed(2);
    

    if(gifCollitionX && gifCollitionY){
        levelup()

    }
    const enemiesCollition = enemiesPosicion.find(enemy => {
        const enemiesCollitionX = enemy.x == playerPosicion.x.toFixed(2) ;
        const enemiesCollitionY = enemy.y == playerPosicion.y.toFixed(2);

        return enemiesCollitionX && enemiesCollitionY

    })
    if(enemiesCollition){
        game.font = 1.5*elementSize + "px verdana";
        game.textAlign = "end"
        game.fillText(emojis["BOMB_COLLISION"], playerPosicion.x +10 , playerPosicion.y);
        setTimeout(lose, 300);
    }
}
function moveUp(){
    if(Math.floor(playerPosicion.y) > elementSize){
        

        playerPosicion.y = (playerPosicion.y - elementSize) 
        
        movePlayer()
    }
    
}
function moveLeft(){
    if(Math.floor(playerPosicion.x) > elementSize){
        

        playerPosicion.x = (playerPosicion.x - elementSize) 
        
        movePlayer()
    }
}
function moveRight(){
    if(Math.ceil(playerPosicion.x)< 10*elementSize){
        

        playerPosicion.x = (playerPosicion.x + elementSize) 
        
        movePlayer()
    }
}
function moveDown(){
    if(Math.ceil(playerPosicion.y) < 10*elementSize){
        

        playerPosicion.y = (playerPosicion.y + elementSize) 
        
        movePlayer()
    }
}

//funciones de vidas y niveles

function levelup(){
    level++;
    startGame()
}
function lose(){
    if (lives != 0){
        
        dibujarPlayer = 0;
        loseFlag = true;
        gameCurrrentFlag = false; 
        gameCurrrent()
        startGame();
        lives-=1;
        showLives()
    } else {
        gameCurrrentFlag = false; 
        gameCurrrent()
        lives = 2;
        dibujarPlayer = 0;
        loseFlag = true;
        level = 0;
        starActive =1; 
        resetChronometer()
        showLives()
        startGame()
    }
}
function showLives(){
    let heartsArray = Array(lives +1).fill(emojis["HEART"]);
    spanLives.textContent= ""
    heartsArray.forEach(heart => spanLives.append(heart))
}

//crhonometer
function startChronometer(){
    if(starActive){
        currentChronometer = setInterval(()=>{
            miliValue += 1
            if(miliValue == 100){
                miliValue = 0
                secondsValue += 1
                secondsHtml.textContent = valueFormat(secondsValue)
            }
            if(minutesValue == 60){
                secondsValue = 0
                minutesValue += 1
                minutesHtml.textContent = valueFormat(minutesValue)
            }
            miliHtml.textContent = valueFormat(miliValue)
        },10)
    }
    starActive= 0
}
function valueFormat(value){
    return  ("0" + value).slice(-2)
}
function stopChronometer(){
    clearInterval(currentChronometer)
    starActive = 1;
}
function resetChronometer(){
    clearInterval(currentChronometer)
    secondsValue = 0
    minutesValue = 0
    miliValue = 0
    secondsHtml.textContent = "00"
    minutesHtml.textContent = "00"
    miliHtml.textContent = "00"
}


// llamado de la funcion show lives para que se muestren las vidas al inicio 
showLives()

