// Posição do topo do solo no eixo dos Y
var groundY = 22;
// velocidade inicial no eixo dos Y
var velY = 0;
// velocidade de salto no eixo dos Y
var velJump = 900;
// gravidade
var gravity = 2500;

// Posição inicial do dinossauro no eixo dos x
var dinoPosX = 42;
// Posição inicial do dinossauro no eixo dos y
var dinoPosY = groundY; 

// Posição do topo do solo no eixo dos X
var groundX = 0;
// Velocidade inicial da frame
var frameVel = 1280/3;
// Velocidade inicial do jogo
var gameVel = 1;
// score inicial do jogo
var score = 0;

// dino esta parado
var stopped = false;
// dino esta a saltar
var jumping = false;

var timeObstacleWait = 2;
var timeObstacleMin = 0.7;
var timeObstacleMax = 1.8;
var obstaclePosY = 16;
var obstacles = [];

var timeCloudWait = 0.5;
var timeCloudMin = 0.7;
var timeCloudMax = 2.7;
var maxCloudY = 270;
var minCloudY = 100;
var clouds = [];
var velCloud = 0.5;

var frame;
var dino;
var points;
var ground;
var gameOver;

function start() {
    gameOver = document.querySelector(".game-over");
    ground = document.querySelector(".ground");
    frame = document.querySelector(".frame");
    points = document.querySelector(".points");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", handleSpaceDown);
}

function update() {

    if(stopped) return;
    
    moveDinoUp();
    moveGround();

    createClouds();
    moveClouds();

    createObstacles()
    moveObstacles();

    detectColision();

    // atualizar a posição no eixo dos Y
    velY -= gravity * deltaTime;
}

function handleSpaceDown(ev){
    if(ev.keyCode == 32){
        jump();
    }
}

function jump(){
    /** 
     * Se a posição do dinossauro no eixo dos Y 
     * for igual à posição do topo do solo
     * então o estado de jumping deve passar a verdadeiro, 
     * a velocidade de salto deve ser atribuida à velocidade
     * do eixo dos Y e a animação dino-running deve ser removida
     * visto que o dinossauro vai saltar 
     * (dino.classList.remove(X))
    */
    if(dinoPosY === groundY) {
        jumping = true
        velY = velJump
        dino.classList.remove("dino-running")
    }
}

function moveDinoUp() {
    /** 
     * A posição do dino no eixo dos Y tem de 
     * ser incrementada com o tempo que demorou 
     * a fazer o salto (deltaTime) multiplicado
     * pela velocidade no eixo dos Y. Se a posição
     * do dino no eixo dos Y for menor que a posição
     * do topo do solo, então devemos ajustar 
     * a posição do dino chamando a função touchGround().
     * Qualquer que seja o resultado do if anterior, 
     * deves sempre actualizar a posição do dino no 
     * CSS também chamando dino.style.bottom = dinoPosY+"px";
    */
    dinoPosY += deltaTime * velY
    if(dinoPosY < groundY){
        touchGround()
    }
    dino.style.bottom = dinoPosY+"px"
}

function touchGround() {
    /** 
     * Para garantir que o dino volta ao topo 
     * do solo e ao estado de running, temos de 
     * atualizar a posição do dino no deixo dos Y com 
     * a posição do solo no eixo dos Y, e atribuir 0 à 
     * velocidade no eixo dos Y. Se o estado de jumping 
     * estiver activo, quer dizer que o dino está parado,
     * por isso temos de activar a animação de running 
     * outra vez através da instrução 
     * dino.classList.add("dino-running"). Não te esqueças
     * de atualizar o estado de jumping para false.
     */
    dinoPosY = groundY 
    velY = 0
    if(jumping){
        dino.classList.add("dino-running")
    }
    jumping = false
}

function moveGround() {
    /**
     * Incrementa a posição do solo no eixo dos x
     * com o resultado da chamada do calculateDisplacement().
     * Atualiza a posição do ground no CSS (ground.style.left)
     * com o resto negativo da posição do solo no eixo dos X 
     * pela largura actual da frame (frame.clientWidth). 
     * ground.style.left guarda uma string com um valor em pixeis, 
     * por isso, não te esqueças de ao resultado 
     * concatenar "px".
     */
    groundX += calculateDisplacement()
    ground.style.left = -(groundX % frame.clientWidth) + "px"
}

function calculateDisplacement() {
    /**
     * Calcula o espaçamento para a animação 
     * do solo. O espaçamento é a velocidade 
     * da frame multiplicado pelo tempo entre 
     * updates do jogo (deltaTime) multiplicado
     * pela velocidade do jogo.
     */
    return frameVel * deltaTime * gameVel ; 
}

function createClouds() {
    /**
     * Para criar uma nuvem tens de primeiro
     * decrementar o tempo de espera para criar
     * uma nuvem com o tempo de update do jogo (deltaTime).
     * Depois se, o timeCloudWait for menor ou igual a 0
     * então queremos chamar a função createCloud()
     * para adicionar uma nova nuvem.
     */
    timeCloudWait -= deltaTime
    if(timeCloudWait <= 0)
    createCloud()
}

function createCloud() {
    let cloud = document.createElement("div");
    frame.appendChild(cloud);
    cloud.classList.add("cloud");
    cloud.posX = frame.clientWidth;
    cloud.style.left = cloud.posX+"px";
    cloud.style.bottom = minCloudY + Math.random() * (maxCloudY-minCloudY)+"px";
    clouds.push(cloud);
    timeCloudWait = timeCloudMin + Math.random() * (timeCloudMax-timeCloudMin) / gameVel;
}

function moveClouds() {
    for (var i = clouds.length - 1; i >= 0; i--) {
        if(clouds[i].posX < -clouds[i].clientWidth) {
            clouds[i].parentNode.removeChild(clouds[i]);
            clouds.splice(i, 1);
        }else{
            clouds[i].posX -= calculateDisplacement() * velCloud;
            clouds[i].style.left = clouds[i].posX+"px";
        }
    }
}

function createObstacles() {
    /**
     * Para criar um obstáculo tens de primeiro
     * decrementar o tempo de espera para criar
     * um obstáculo com o tempo de update do jogo (deltaTime).
     * Depois se, o timeObstacleWait for menor ou igual a 0
     * então queremos chamar a função createObstacle()
     * para adicionar um novo obstáculo.
     */ 
    timeObstacleWait -= deltaTime
    if(timeObstacleWait <= 0)
    createObstacle()
}

function createObstacle() {
    var obstacle = document.createElement("div");
    frame.appendChild(obstacle);
    obstacle.classList.add("cactus");
    if(Math.random() > 0.5) obstacle.classList.add("cactus2");
    obstacle.posX = frame.clientWidth;
    obstacle.style.left = frame.clientWidth+"px";

    obstacles.push(obstacle);
    timeObstacleWait = timeObstacleMin + Math.random() * (timeObstacleMax-timeObstacleMin) / gameVel;
}

function moveObstacles() {
    for (var i = obstacles.length - 1; i >= 0; i--) {
        if(obstacles[i].posX < -obstacles[i].clientWidth) {
            obstacles[i].parentNode.removeChild(obstacles[i]);
            obstacles.splice(i, 1);
            scorePoints();
        }else{
            obstacles[i].posX -= calculateDisplacement();
            obstacles[i].style.left = obstacles[i].posX+"px";
        }
    }
}

function scorePoints() {
    /**
     * Incrementa a variável score em um 
     * ponto e atualiza o valor do placar
     * de pontos com o novo valor (points.innerText = score).
     */
    score += 1 
    points.innerText = score
    ground.style.animationDuration = (3 / gameVel)+"s";
}

function dead() {
    /**
     * Queremos remover da class da div dino 
     * a animação dino-running (dino.classList.remove(X)) 
     * e adicionar a dino-dead (dino.classList.add(X)). 
     * Visto que o dinossauro para, porque esta morto,
     * temos de atualizar a flag stopped com o 
     * booleano true.
     */
}

function gameOverFrame() {
    gameOver.style.display = "block";
}

function detectColision() {
    for (var i = 0; i < obstacles.length; i++) {
        if(obstacles[i].posX > dinoPosX + dino.clientWidth) {
            break; 
        }else{
            /**
             * Cria um if para verificar se a colisao ocorreu.
             * Para verificar se uma colisao ocorre, chama a funcao
             * isCollision com os argumentos dino, obstacles[i], 10, 
             * 30, 15 e 20. Dentro do if, ou seja, se uma colisao 
             * ocorrer queremos mostrar que o utilizador morreu. 
             * Para tal, chama a funcao dead() e depois a gameOverFrame().
             * Nao te esquecas que tens de implementar a funcao dead().
             */
        }
    }
}

/***
 * Implementa uma funcao que chamada isCollision e que recebe
 * os seguintes argumentos: dino, obstacle, paddingTop, paddingRight,
 * paddingBottom e paddingLeft. Dentro da funcao, cria uma variavel 
 * chamada dinoRect e atribui-lhe o resultado de dino.getBoundingClientRect()
 * e outra variavel chamada obstacleRect e atribui-lhe o resultado 
 * de obstacle.getBoundingClientRect(). Depois verifica se a colisao 
 * acontece ou nao.
 * A colisao NAO acontece em qualquer um dos seguintes casos:
 * 1. (dinoRect.top + dinoRect.height - paddingBottom) < (obstacleRect.top)
 * 2. dinoRect.top + paddingTop > (obstacleRect.top + obstacleRect.height)
 * 3. (dinoRect.left + dinoRect.width - paddingRight) < obstacleRect.left
 * 4. dinoRect.left + paddingLeft > (obstacleRect.left + obstacleRect.width)
 */
function isCollision(dino, obstacle, paddingTop, paddingRight,paddingBottom,paddingLeft) {
    var dinoRect = dino.getBoundingClientRect()
    var obstacleRect = obstacle.getBoundingClientRect()
    
    return !((dinoRect.top + dinoRect.height - paddingBottom) < (obstacleRect.top)||
    dinoRect.top + paddingTop > (obstacleRect.top + obstacleRect.height)||
    (dinoRect.left + dinoRect.width - paddingRight) < obstacleRect.left)||
    dinoRect.left + paddingLeft > (obstacleRect.left + obstacleRect.width);

}
