const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const participants = ['Alice', 'Bob', 'Charlie', 'David', 'Eva'];
const images = [
    '../images/bio-photo.jpg',
    '../images/bio-photo.jpg',
    '../images/bio-photo.jpg',
    '../images/bio-photo.jpg',
    '../images/bio-photo.jpg',
];

let imageElements = [];
let ladderPath = [];
const ladderSpeed = 3;
let animationInProgress = false;
let selectedParticipant = null;

function preloadImages() {
    imageElements = images.map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });
}


let winnersCount = 1;
let results = [];

function generateWinners() {
  results = [];
  for (let i = 0; i < participants.length; i++) {
    results.push(false);
  }

  for (let i = 0; i < winnersCount; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * participants.length);
    } while (results[randomIndex]);
    results[randomIndex] = true;
  }
}

document.getElementById("winners").addEventListener("change", (event) => {
  winnersCount = parseInt(event.target.value);
});


let ladderMatrix = [];

function createLadderMatrix(ladderHeight) {
  ladderMatrix = [];
  for (let i = 0; i < ladderHeight; i++) {
    const row = [];
    for (let j = 0; j < participants.length - 1; j++) {
      row.push(Math.random() > 0.5);
    }
    ladderMatrix.push(row);
  }
}

function generateLadderPath(start) {
  const path = [];
  let currentPosition = start;
  
  for (let i = 0; i < ladderMatrix.length; i++) {
    if (currentPosition > 0 && ladderMatrix[i][currentPosition - 1]) {
      currentPosition--;
    } else if (currentPosition < participants.length - 1 && ladderMatrix[i][currentPosition]) {
      currentPosition++;
    }
    path.push(currentPosition);
  }
  return path;
}


function generateLadder() {
    canvas.width = participants.length * 100;
    canvas.height = 600;
    preloadImages();
    createLadderMatrix(10);
    drawLadder();
    updateParticipantSelect();
    generateWinners(); 
}

let ladderLines = []; // 사다리 다리 정보를 저장할 변수

function addLadderLine() {
  const randomIndex = Math.floor(Math.random() * (participants.length - 1));
  const randomHeight = Math.random() * (canvas.height - 100) + 50;
  const line = {
    x1: randomIndex * 100 + 50,
    y1: randomHeight,
    x2: (randomIndex + 1) * 100 + 50,
    y2: randomHeight,
  };
  ladderLines.push(line);
  drawLadder();
}


function drawLadder() {

    for (let i = 0; i < participants.length; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 100 + 50, 0);
        ctx.lineTo(i * 100 + 50, canvas.height);
        ctx.stroke();

        ctx.drawImage(imageElements[i], i * 100 + 25, 0, 50, 50);
    }

     for (let i = 0; i < ladderMatrix.length; i++) {
        for (let j = 0; j < participants.length - 1; j++) {
            if (ladderMatrix[i][j]) {
                ctx.beginPath();
                ctx.moveTo(j * 100 + 50, i * 100 + 100);
                ctx.lineTo((j + 1) * 100 + 50, i * 100 + 100);
                ctx.stroke();
            }
        }
    }

    
    for (let line of ladderLines) {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
    }
    
    for (let i = 0; i < participants.length; i++) {
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    if (results[i]) {
      ctx.fillText("당첨", i * 100 + 50, canvas.height - 10);
    } else {
      ctx.fillText("꽝", i * 100 + 50, canvas.height - 10);
    }
  }
}

function updateParticipantSelect() {
    const select = document.getElementById('selectedParticipant');
    select.innerHTML = '';
    participants.forEach((participant, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = participant;
        select.add(option);
    });
}


function startLadder() {
    if (animationInProgress) return;
    selectedParticipant = parseInt(document.getElementById('selectedParticipant').value);
    ladderPath = generateLadderPath(selectedParticipant);
    animateLadder();
}


function generateLadderPath(start) {
    const path = [];
    let currentPosition = start;
    for (let i = 0; i < 5; i++) {
        if (currentPosition > 0 && Math.random() > 0.5) {
            currentPosition--;
        } else if (currentPosition < participants.length - 1 && Math.random() > 0.5) {
            currentPosition++;
        }
        path.push(currentPosition);
    }
    return path;
}

function animateLadder() {
    
    animationInProgress = true;
    let step = 0;
    let stepProgress = 0;
    const img = new Image();
    img.src = images[selectedParticipant];
    
    const animateStep = () => {
        if (step >= ladderPath.length) {
            animationInProgress = false;
            return;
        }
        
        stepProgress += ladderSpeed;
        if (stepProgress >= 100) {
            stepProgress = 0;
            step++;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLadder();
        ctx.drawImage(
            img,
            ladderPath[step] * 100 + 25,
            50 + step * 100 + stepProgress,
            50,
            50
        );
        
        requestAnimationFrame(animateStep);
    };
    
    requestAnimationFrame(animateStep);
}

