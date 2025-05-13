const mainScreen = document.getElementById('main-screen');
const formScreen = document.getElementById('form-screen');
const createCardBtn = document.getElementById('create-card-btn');
const createBtn = document.getElementById('create-btn');
const cardNameInput = document.getElementById('card-name');
const cardRewardInput = document.getElementById('card-reward');
const stampCountSelect = document.getElementById('stamp-count');

createCardBtn.addEventListener('click', () => {
    mainScreen.classList.add('hidden');
    formScreen.classList.remove('hidden');
});

createBtn.addEventListener('click', createCard);

function createCard() {
    if (!cardNameInput.value || !cardRewardInput.value) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const currentCard = {
        name: cardNameInput.value,
        reward: cardRewardInput.value,
        stamps: parseInt(stampCountSelect.value),
        markedStamps: 0
    };

    const loggedInUser  = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("Você precisa estar logado para criar um cartão.");
        return;
    }

    const userCards = JSON.parse(localStorage.getItem(loggedInUser)) || [];
    userCards.push(currentCard);

    localStorage.setItem(loggedInUser, JSON.stringify(userCards));

    window.location.href = `homePage.html?name=${encodeURIComponent(currentCard.name)}&reward=${encodeURIComponent(currentCard.reward)}&stamps=${currentCard.stamps}`;
}

function generateStamps() {
    stampsGrid.innerHTML = '';
    
    for (let i = 0; i < currentCard.stamps; i++) {
        const stamp = document.createElement('div');
        stamp.className = 'stamp';
        stamp.textContent = i + 1;
        
        stamp.addEventListener('click', () => {
            stamp.classList.toggle('marked');
            updateMarkedStamps();
        });
        
        stampsGrid.appendChild(stamp);
    }
}

function updateMarkedStamps() {
    currentCard.markedStamps = document.querySelectorAll('.stamp.marked').length;
}

function shareCard() {
    const shareData = {
        title: `Cartão Fidelidade: ${currentCard.name}`,
        text: `Estou usando o cartão fidelidade MARCAQUI! ${currentCard.reward} (${currentCard.markedStamps}/${currentCard.stamps} selos)`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .catch(err => console.log('Erro ao compartilhar:', err));
    } else {
        const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('Informações do cartão copiadas! Cole para compartilhar.'))
            .catch(err => console.log('Erro ao copiar:', err));
    }
}

function resetApp() {
    cardNameInput.value = '';
    cardRewardInput.value = '';
    stampCountSelect.value = '10';
    currentCard = {
        name: '',
        reward: '',
        stamps: 0,
        markedStamps: 0
    };
    
    cardScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
}