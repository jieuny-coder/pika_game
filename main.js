let canvas;
let ctx;

// 캔버스 생성 및 설정
canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 700;

// 만든 캔버스를 HTML에 추가
document.body.appendChild(canvas);

// 이미지 변수 선언
let backgroundImage, gameoverImage, pikamonImage, pokeballImage, ThunderImage;

//  gameover 소환하기위한 변수 설정
let gameover = false // true이면 게임 계속, false이면 게임종료

// 점수판
let score = 0;

// 피카츄 이미지를 위한 X좌표,Y좌표 변수 선언 => 캔버스를 돌아다니니까 계속 좌표가 바뀔예정이라! 
let pikaX = canvas.width/2 - 24
let pikaY = canvas.height - 48

// 번개 저장할 리스트
let thunderList = [];

// 번개를 만들기 위한 재료를 가지고 있는 함수 정의 
function ready_thunder(){
    this.x = 0;
    this.y = 0;
    // 피카츄위치로 좌표를 초기화하기 위한 서브함수
    this.init = function(){
        this.x = pikaX+16;
        this.y = pikaY;
        // 총알상태확인하기 :alive
        this.alive = true //true면 살아있는 번개, false면 소멸되는 총알
        thunderList.push(this) //생성된 번개를 리스트에 추가해주기 
    };
    // 번개 발사되도록 하는 함수 : y좌표값 감소시키기 
    this.update = function(){
        this.y -= 7 ; //y좌표값을 7씩 감소시키겠다.
    }
    // 번개가 발사할때마다 체크하기 
    this.checkHit = function(){
        for(let i=0; i< poketballList.length; i++){
            if(this.y <= poketballList[i].y && this.x >= poketballList[i].x && this.x <= poketballList[i].x+40){
                // 점수 누적시키고
                score++
                // 번개랑 포켓볼 사라지게 만들기
                this.alive = false //소멸될 번개
                poketballList.splice(i,1) //포켓볼리스트에서 i번째에 있는 1개를 잘라내겠다!
            }
        }
    }
}

// 포켓볼 x좌표 랜덤하게 뽑아낼 함수 
function generateRandom(min, max){  //범위지정을위해서 min과 max의 값을 미리 정해두기 
    let randomNum = Math.floor(Math.random()*(max-min+1))+min// Math.random은 0~1까지 랜덤숫자 반환 
    return randomNum
}
// 포켓볼 저장할 리스트
let poketballList = [];
// 포켓볼 생성 클래스~같은 함수
function poketballs(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0 ;  //최상단에서 내려와야하니까 0
        this.x = generateRandom(0,canvas.width-48); //랜덤하게 나와야한다. 그런데 범위는 캔버스시작부터 캔버스넓이-이미지가로길이 만큼으로.
        poketballList.push(this)
    }
    // 포켓볼 아래로 내려오게 만들기 : y값 증가시키기 
    this.update = function(){
        this.y += 2;    // 포켓볼 내려오는 속도 조절

        if(this.y >= canvas.height-48){
            gameover = true;
            // console.log('gameover'); //확인용
        }
    }
}

function loadImage() {
    return new Promise((resolve) => {
        let imagesLoaded = 0;
        const totalImages = 5;

        // 모든 이미지가 로드되었는지 확인하는 함수
        function checkImagesLoaded() {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                resolve(); // 모든 이미지가 로드되면 Promise가 완료됨
            }
        }

        // 배경 이미지
        backgroundImage = new Image();
        backgroundImage.src = './images/background.png';  
        backgroundImage.onload = checkImagesLoaded;

        // 피카츄 이미지
        pikamonImage = new Image();
        pikamonImage.src = './images/pikamon.png';
        pikamonImage.onload = checkImagesLoaded;

        // 포켓볼 이미지
        pokeballImage = new Image();
        pokeballImage.src = './images/pokeball.png';
        pokeballImage.onload = checkImagesLoaded;

        // 공격번개 이미지
        ThunderImage = new Image();
        ThunderImage.src = './images/thunder.png';
        ThunderImage.onload = checkImagesLoaded;

        // 게임오버 이미지
        gameoverImage = new Image();
        gameoverImage.src = './images/gameover.png';
        gameoverImage.onload = checkImagesLoaded;
    });
}

// 눌러진 버튼의 정보를 저장해둘 변수지정
let keysdown={};
// 방향키로 캐릭터 움직이게하는 함수 
function setupkeyboard(){

    // 키 눌렀을때 
    document.addEventListener('keydown',function(event){
        // console.log('어떤키가 눌렸는지에 대한 정보:',event.key); //확인용
        keysdown[event.key]=true;
        // console.log('키다운객체에 들어가는 값 확인하기:',keysdown);
    });

    // 눌렀던 키를 뗐을때 
    document.addEventListener('keyup',function(event){
        delete keysdown[event.key]
        // console.log('버튼누른후',keysdown);
        // 스페이스바를 뗐을때 번개발사~~
        if(event.key == " "){
            thunder()  //번개생성함수
        }
    });
}

// 번개생성함수
function thunder(){
    console.log('번개발사key');
    let T = new ready_thunder() //새로 생성한 번개를 T에 저장 
    T.init()  //피카츄좌표에 맞춰서 번개좌표 초기화~
    console.log('번개리스트 보자보자',thunderList);
    
}

// 1초마다 포켓볼생성
function createpokeball(){
    const interval = setInterval(function(){
        let P = new poketballs()
        P.init()
    },1000)  //시간단위를 ms를 사용 ( 1s = 1000ms )   
}

// 피카츄,번개,포켓볼 좌표값 업데이트 함수 
function update(){
    // 피카츄 오른쪽 이동
    if('ArrowRight' in keysdown){ //오른쪽방향키이름 : ArrowRight
        pikaX += 5     //피카츄이미지를 오른쪽으로 5씩 이동시켜보겠다. 피카츄 이미지 이동 속도
    } 
    // 피카츄 왼쪽 이동
    if('ArrowLeft' in keysdown){
        pikaX -=5
    }

    // 피카츄가 캔버스 밖으로 나가지 못하도록 범위제한
    if(pikaX <= 0){
        pikaX = 0
    }
    if(pikaX >= canvas.width-48){
        pikaX = canvas.width-48;
    }

    // 번개y좌표 업데이트하는 함수 호출
    for(let i=0 ; i < thunderList.length; i++){
        if(thunderList[i].alive){
            thunderList[i].update();
            // 번개가 포켓볼 쳤는지 안쳤는지 확인
            thunderList[i].checkHit();
        }   
    }
    // 포켓볼 y좌표 업데이트하는 함수 호출 
    for(let i=0 ; i < poketballList.length; i++){
        poketballList[i].update();
    }
}

// 이미지를 그리는 함수
function render() {
    // 1. 배경 이미지 그리기
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    // 2.피카츄 이미지  => 여기서는 x,y 좌표가 따로 지정할 필요가 있다. 
    ctx.drawImage(pikamonImage, pikaX, pikaY);

    // 번개는 여러개니까 for문 사용하기 
    for(let i=0; i <thunderList.length; i++){
        // 번개 상태에따라서 보여줄지 말지 결정하는 조건문 
        if(thunderList[i].alive){
            ctx.drawImage(ThunderImage, thunderList[i].x ,thunderList[i].y);
        }
    }
    // 포켓볼도 여러개니까 for문 사용
    for(let i=0; i <poketballList.length; i++){
        ctx.drawImage(pokeballImage, poketballList[i].x ,poketballList[i].y);
    }

    // 누적시킨 점수 보여주기 
    ctx.fillText(`Score:${score}`,20,20);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
}

// 애니메이션처럼 이미지를 반복적으로 그리는 함수
function main() {
    if(!gameover){
        update();  //피카츄 좌표이동 함수
        render();
        // console.log('애니매이션함수는 메인함수를 미친듯이 호출중이다!'); //확인용! 
        requestAnimationFrame(main); // main 함수가 계속 호출되어 화면을 갱신
    }else{
        // 게임오버 이미지 호출해주기
        ctx.drawImage(gameoverImage,10,100,380,380);
    }
}

// 이미지가 모두 로드된 후에 main 함수를 실행
loadImage().then(() => {
    // 포켓볼 떨어져라!
    createpokeball();
    // 방향키함수 실행
    setupkeyboard();
    main(); // 이미지를 다 로드한 후에 main 함수 호출
});

