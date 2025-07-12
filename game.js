document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');
  const restartButton = document.getElementById('restart-button');
  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;

  // Card data with images and display names from index.html
  const cardData = [
    { id: 'goldilocks', image: 'imagenes/cuento.jpg', name: 'Goldilocks' },
    { id: 'papa_bear', image: 'imagenes/oso.jpg', name: 'Papa Bear 🐻' },
    { id: 'mama_bear', image: 'imagenes/osa.jpg', name: 'Mama Bear 🐻' },
    { id: 'baby_bear', image: 'imagenes/osito.jpeg', name: 'Baby Bear 🐻' },
  ];

  // Create and shuffle cards
  function createBoard() {
    cards = [...cardData, ...cardData].map((card, index) => ({ ...card, uniqueId: index }));
    shuffle(cards);
    gameBoard.innerHTML = '';
    cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.dataset.id = card.id;
      cardElement.innerHTML = `
        <img src="${card.image}" alt="${card.name}" loading="lazy" aria-label="Card ${card.name}" />
        <h3>${card.name}</h3>
      `;
      cardElement.addEventListener('click', flipCard);
      gameBoard.appendChild(cardElement);
    });
  }

  // Shuffle array
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Flip card
  function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;
    this.classList.add('flipped');
    if (!firstCard) {
      firstCard = this;
      return;
    }
    secondCard = this;
    lockBoard = true;
    checkMatch();
  }

  // Check for match
  function checkMatch() {
    const isMatch = firstCard.dataset.id === secondCard.dataset.id;
    if (isMatch) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      resetBoard();
      checkWin();
    } else {
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
      }, 1000);
    }
  }

  // Reset board
  function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  // Check for win
  function checkWin() {
    if (document.querySelectorAll('.card.matched').length === cards.length) {
      setTimeout(() => alert('You Won! 🎉'), 500);
    }
  }

  // Restart game
  restartButton.addEventListener('click', () => {
    cards.forEach(card => {
      const cardElement = document.querySelector(`.card[data-id="${card.id}"][data-unique-id="${card.uniqueId}"]`);
      if (cardElement) {
        cardElement.classList.remove('flipped', 'matched');
      }
    });
    createBoard();
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Initialize game
  createBoard();
});