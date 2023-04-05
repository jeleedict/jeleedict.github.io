const canvas = document.getElementById('ladderCanvas');
const ctx = canvas.getContext('2d');
let participants = [];
let images = [];

let imageElements = [];

function preloadImages() {
    imageElements = images.map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });
}


function generateLadder() {
    preloadImages();
    participants = document.getElementById('participants').value.split(',').map(p => p.trim());
    images = document.getElementById('images').value.split(',').map(url => url.trim());
    
    if (participants.length !== images.length) {
        alert('참가자와 이미지의 수가 일치하지 않습니다. 다시 입력해주세요.');
        return;
    }
    
    canvas.width = participants.length * 100;
    canvas.height = 500;

    drawLadder();
}

function drawLadder() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < participants.length; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 100 + 50, 0);
        ctx.lineTo(i * 100 + 50, canvas.height);
        ctx.stroke();

        ctx.drawImage(imageElements[i], i * 100 + 25, 0, 50, 50);
    }


    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < participants.length - 1; j++) {
            if (Math.random() > 0.5) {
                ctx.beginPath();
                ctx.moveTo(j * 100 + 50, i * 100 + 100);
                ctx.lineTo((j + 1) * 100 + 50, i * 100 + 100);
                ctx.stroke();
            }
        }
    }
}


function showResults() {
    const numSelected = parseInt(document.getElementById('numSelected').value);
    if (isNaN(numSelected) || numSelected < 1 || numSelected > participants.length) {
        alert('선택되어야 할 숫자가 올바르지 않습니다. 다시 입력해주세요.');
        return;
    }

    const selectedIndices = getRandomIndices(numSelected, participants.length);
    alert('선택된 참가자: ' + selectedIndices.map(index => participants[index]).join(', '));
}

function getRandomIndices(count, max) {
    const indices = [];
    while (indices.length < count) {
        const index = Math.floor(Math.random() * max);
        if (!indices.includes(index)) {
            indices.push(index);
        }
    }
    return indices;
}


const ladderSpeed = 3;
let selectedParticipant = null;
let animationInProgress = false;
let ladderPath = [];

function generateLadder() {
    // ...
    updateParticipantSelect();
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

