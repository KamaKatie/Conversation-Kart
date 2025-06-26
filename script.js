// ----- Global State -----
let players = [];
let currentPlayerIndex = 0; // For turn-based logic
let cardHistory = [];       // Each entry: { playerIndex, card, type, coinChange }
let drawnCards = [];

// ----- Card Data -----
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
    "Super Lucky: 先生に答えてもらったり、代わりにチャレンジをやってもらったりするのに使えます (One time use)",
    "How are you? Draw a picture of how you feel on the board.",
    "Hey Katie! Ask Katie a question.",
    "Hey Katie! Ask Katie a question.",
    "Hey Katie! Ask Katie a question.",
    "HELL-O: Say 3 words that start with the letter O"
];

// ----- Characters -----
const characterPool = [
    { name: "Mario", img: "resources/images/mario.webp", icon: "resources/images/mario-icon.png", color: "#ff4d4d" },
    { name: "Peach", img: "resources/images/peach.webp", icon: "resources/images/peach-icon.png", color: "#ff6cd5" },
    { name: "Yoshi", img: "resources/images/yoshi.webp", icon: "resources/images/yoshi-icon.png", color: "#7fff7f" },
    { name: "Luigi", img: "resources/images/luigi.webp", icon: "resources/images/luigi-icon.png", color: "#00b911" },
    { name: "Toad", img: "resources/images/toad.webp", icon: "resources/images/toad-icon.png", color: "#ffffff" },
    { name: "Donkey Kong", img: "resources/images/donkeykong.webp", icon: "resources/images/donkeykong-icon.png", color: "#92410e" },
    { name: "Bowser", img: "resources/images/bowser.webp", icon: "resources/images/bowser-icon.png", color: "#ffc400" }
];

// ----- UI Update Functions -----

function updatePlayerSummary() {
    const container = document.getElementById('playerSummary');
    container.innerHTML = '';

    players.forEach((player, index) => {
        const box = document.createElement('div');
        box.className = 'player-box';

        if (index === currentPlayerIndex) {
            box.style.border = '3px solid gold';
            box.style.boxShadow = '0 0 10px gold';
        }

        // Removed the cards list from here
        box.innerHTML = `
            <h3>${player.name}</h3>
            <img src="${player.character.icon}" alt="${player.character.name}">
            <p>${player.character.name}</p>
            <p>Coins: ${player.coins}</p>
        `;

        container.appendChild(box);
    });
}

function updateDrawnCards() {
    const ul = document.getElementById('drawnCards');
    ul.innerHTML = '';

    // Reverse the card history so newest is first
    [...cardHistory].reverse().forEach(entry => {
        const li = document.createElement('li');
        const player = players[entry.playerIndex];

        const cardContentFragment = document.createDocumentFragment();

        if (typeof entry.card === 'object') {
            const img = document.createElement('img');
            img.src = entry.card.img;
            img.alt = entry.card.text;
            img.style.width = '30px';
            img.style.marginRight = '10px';
            cardContentFragment.appendChild(img);

            const span = document.createElement('span');
            span.textContent = entry.card.text;
            cardContentFragment.appendChild(span);
        } else {
            const span = document.createElement('span');
            span.textContent = entry.card;
            cardContentFragment.appendChild(span);
        }

        li.appendChild(cardContentFragment);

        if (player && player.character && player.character.icon) {
            const playerIcon = document.createElement('img');
            playerIcon.src = player.character.icon;
            playerIcon.alt = player.name;
            playerIcon.style.width = '24px';
            playerIcon.style.height = '24px';
            playerIcon.style.verticalAlign = 'middle';
            playerIcon.style.marginLeft = '8px';
            li.appendChild(playerIcon);
        }

        ul.appendChild(li); // This works because the list is reversed
    });
}

// ----- Game Logic -----

function drawCard(type) {
    const list = type === 'mystery' ? mysteryCards : questionCards;
    const card = list[Math.floor(Math.random() * list.length)];
    // drawnCards.push(card); // No longer push to drawnCards here
    showCardPopup(card);
    // updateDrawnCards(); // This call will now happen after cardHistory.push

    let coinChange = 0;

    if (type === 'mystery') {
        // players[currentPlayerIndex].cards.push(card); // Removed card storage in player object
        updatePlayerSummary();

        // Detect coin changes
        const text = typeof card === "object" ? card.text : card;
        if (text.includes("+1 Coin")) coinChange = 1;
        if (text.includes("-1 Coin")) coinChange = -1;
        if (text.includes("+3 Coins")) coinChange = 3;
        if (text.includes("-3 Coins")) coinChange = -3;
        if (text.includes("Lose all your coins")) coinChange = -players[currentPlayerIndex].coins;

        changeCoins(coinChange);
    }

    // Save to undo history - this is where we track the drawn card
    cardHistory.push({ playerIndex: currentPlayerIndex, card, type, coinChange });
    updateDrawnCards(); // Call updateDrawnCards AFTER pushing to history
}

function changeCoins(amount) {
    players[currentPlayerIndex].coins += amount;
    updatePlayerSummary();
}

function resetGame() {
    drawnCards = []; // This array is now largely unused for display
    cardHistory = [];
    players.forEach(player => {
        // player.cards = []; // No longer needed as cards aren't stored here
        player.coins = 0;
    });
    updateDrawnCards();
    updatePlayerSummary();
}

function undoLastAction() {
    if (cardHistory.length === 0) return;

    const last = cardHistory.pop();
    // drawnCards.pop(); // No longer relevant for display

    if (last.type === 'mystery') {
        // players[last.playerIndex].cards.pop(); // No longer needed
        players[last.playerIndex].coins -= last.coinChange; // Reverse coin change directly
    }

    updateDrawnCards();
    updatePlayerSummary();
}

function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    highlightCurrentPlayer();
}

function highlightCurrentPlayer() {
    const display = document.getElementById('currentPlayerDisplay');
    if (display && players.length > 0) {
        display.innerHTML = ''; // Clear previous content

        const player = players[currentPlayerIndex];

        const labelSpan = document.createElement('span');
        labelSpan.textContent = 'Current Player: ';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = player.character.name;
        nameSpan.style.padding = "5px";
        nameSpan.style.borderRadius = "10px";
        nameSpan.style.boxShadow = "2px 2px 2px rgba(0, 0, 0, 0.3)"
        nameSpan.style.background = player.character.color;
        if (player.character.name === "Toad") {
            nameSpan.style.color = "red";
        } else
            nameSpan.style.color = "white";

        const iconImg = document.createElement('img');
        iconImg.src = player.character.icon;
        iconImg.alt = player.character.name;
        iconImg.style.width = '24px';
        iconImg.style.height = '24px';
        iconImg.style.verticalAlign = 'middle';
        iconImg.style.marginLeft = '6px';

        display.appendChild(labelSpan);
        display.appendChild(nameSpan);
        display.appendChild(iconImg);
    }

    updatePlayerSummary();
}


// ----- Popup and Animation -----

function showCardPopup(card) {
    const popup = document.getElementById("cardPopup");
    const popupImg = document.getElementById("popupImg");
    const popupText = document.getElementById("popupText");

    if (typeof card === "object") {
        popupImg.src = card.img;
        popupImg.style.display = "block";
        popupText.textContent = card.text;
    } else {
        popupImg.style.display = "none";
        popupText.textContent = card;
    }

    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 2500);
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

// ----- Character Assignment -----

function assignCharacters() {
    const count = parseInt(document.getElementById('playerCount').value);
    const shuffled = [...characterPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    players = selected.map((char, i) => ({
        name: `Player ${i + 1}`,
        character: char,
        // cards: [], // Removed initialization for cards, as they are no longer stored here
        coins: 0
    }));

    const container = document.getElementById('characterAssignments');
    container.innerHTML = '';

    players.forEach(player => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>${player.name}: ${player.character.name}</p>
            <img src="${player.character.img}" alt="${player.character.name}" style="width:80px;">
        `;
        container.appendChild(div);
    });

    document.getElementById('startGameBtn').style.display = 'inline-block';
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('playerSummary').style.display = 'flex';
    updatePlayerSummary();
    highlightCurrentPlayer();
}

function showStartScreen() {
    // Clear the current game state
    resetGame();
    // Reset current player index
    currentPlayerIndex = 0;
    // Hide the game screen
    document.getElementById('gameScreen').style.display = 'none';
    // Hide player UI
    document.getElementById('playerSummary').style.display = 'none';
    // Show the start screen
    document.getElementById('startScreen').style.display = 'block';
    // Clear character assignments display on the start screen
    document.getElementById('characterAssignments').innerHTML = '';
    // Hide the "Start Game" button until characters are reassigned
    document.getElementById('startGameBtn').style.display = 'none';
}