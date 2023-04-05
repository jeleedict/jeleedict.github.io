const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const participants = ['Alice', 'Bob', 'Charlie', 'David', 'Eva'];
const images = [
    'https://example.com/image1.png',
    'https://example.com/image2.png',
    'https://example.com/image3.png',
    'https://example.com/image4.png',
    'https://example.com/image5.png',
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

function generateLadder() {
    canvas.width = participants.length * 100;
    canvas.height = 600;
    preloadImages();
    drawLadder();
    updateParticipantSelect();
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

