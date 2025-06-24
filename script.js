const mysteryCards = [
    { text: "+1 Coin", img: "resources/images/coin.png" },
    { text: "-1 Coin", img: "resources/images/coin.png" },
    { text: "+3 Coins", img: "resources/images/coin.png" },
    { text: "-3 Coins", img: "resources/images/coin.png" },
    { text: "Go back 1 space", img: "resources/images/back1.png" },
    { text: "Go back 3 spaces", img: "resources/images/back3.png" },
    { text: "Go forward 1 space", img: "resources/images/forward1.png" },
    { text: "Go forward 3 spaces", img: "resources/images/forward3.png" },
    { text: "Skip your turn", img: "resources/images/skip.png" },
    { text: "Lose all your coins", img: "resources/images/lose.png" },
    { text: "Swap places with 1st", img: "resources/images/swap.png" },
    { text: "Star Shield: You are safe from going back (One time use)", img: "resources/images/shield.webp" }
];

const questionCards = [
    "What are you interested in lately?",
    "What are you looking forward to this summer?",
    "If you were an animal, what would you be?",
    "Have you ever seen a tanuki?",
    "What is your favorite food to eat in summer?",
    "What season do you NOT like, and why?",
    "Would you rather be really strong, or really fast?",
    "Can you eat 100 plates of sushi?",
    "What are you worried about now?",
    "What is your favorite chain restaurant or cafe?",
    "What is the most important thing to you?",
    "How many times a week do you go to a convenience store?",
    "Is sleeping easy for you?",
    "What is your dream job?",
    "Would you rather live in your hometown, or somewhere else?",
    "Do you want to live in a foreign country? If yes, where do you want to live?",
    "If you could create a new ice cream flavor, what would it be?",
    "What do you usually eat for breakfast?",
    "How often do you play video games?",
    "Which do you prefer, Playstation or Nintendo?",
    "Lucky 7: Write a 7 letter word on the board",
    "Lucky ABC: Sing the ABC song",
    "Super Lucky: 先⽣に答えてもらったり、代わりにチャレンジをやってもらったりするのに使えます (One time use)",
    "How are you? Draw a picture of how you feel on the board.",
    "Hey Katie! Ask Katie a question.",
    "Hey Katie! Ask Katie a question.",
    "Hey Katie! Ask Katie a question.",
    "HELL-O: Say 3 words that start with the letter O"
];

let drawnCards = [];
let coins = 0;

function drawCard(type) {
    const list = type === 'mystery' ? mysteryCards : questionCards;
    const card = list[Math.floor(Math.random() * list.length)];
    drawnCards.push(card);
    updateDrawnCards();
    showCardPopup(card); // ✅ show popup here
}


function updateDrawnCards() {
    const ul = document.getElementById('drawnCards');
    ul.innerHTML = '';

    drawnCards.forEach(card => {
        const li = document.createElement('li');

        if (typeof card === 'object') {
            // Mystery card with image
            const img = document.createElement('img');
            img.src = card.img;
            img.alt = card.text;
            img.style.width = '30px'; // adjust size as needed
            img.style.marginRight = '10px';
            li.appendChild(img);

            const span = document.createElement('span');
            span.textContent = card.text;
            li.appendChild(span);
        } else {
            // Question card (plain text)
            li.textContent = card;
        }

        ul.appendChild(li);
    });
}


function changeCoins(amount) {
    coins += amount;
    document.getElementById('coinCount').textContent = coins;
}

function resetGame() {
    drawnCards = [];
    coins = 0;
    updateDrawnCards();
    document.getElementById('coinCount').textContent = coins;
}

function showFlyAnimation(symbol) {
    const anim = document.getElementById('flyAnimation');
    anim.textContent = symbol;
    anim.style.opacity = 1;
    anim.style.transform = 'translate(-50%, -50%) scale(1.5)';

    setTimeout(() => {
        anim.style.opacity = 0;
        anim.style.transform = 'translate(-50%, -50%) scale(0.5)';
    }, 800);
}

function showBigMessage(text) {
    const messageBox = document.getElementById('bigMessage');
    messageBox.textContent = text;
    messageBox.style.opacity = 1;

    setTimeout(() => {
        messageBox.style.opacity = 0;
    }, 2000);
}

function showCardPopup(card) {
    const popup = document.getElementById("cardPopup");
    const popupImg = document.getElementById("popupImg");
    const popupText = document.getElementById("popupText");

    // Check if it's a mystery card with image or just text
    if (typeof card === "object") {
        popupImg.src = card.img;
        popupImg.style.display = "block";
        popupText.textContent = card.text;
    } else {
        popupImg.style.display = "none";
        popupText.textContent = card;
    }

    popup.classList.add("show");

    // Hide after 2.5 seconds
    setTimeout(() => {
        popup.classList.remove("show");
    }, 2500);
}

