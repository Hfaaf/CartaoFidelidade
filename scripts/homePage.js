const loggedInUser = localStorage.getItem("loggedInUser");
const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];
const userDetails = cadastros.find(cadastro => cadastro.email === loggedInUser);

if (userDetails) {
    document.getElementById('user-name').textContent = userDetails.nome;
    document.getElementById('user-email').textContent = userDetails.email;
}

const userCards = JSON.parse(localStorage.getItem(loggedInUser)) || [];
const userCardsDiv = document.getElementById('user-cards');

const usersData = localStorage.getItem("usersData");

let clientes = [];
if (usersData) {
    const data = JSON.parse(usersData);
    clientes = Object.values(data).flat();
}

userCards.forEach(card => {
    const cardName = card.name.toLowerCase();

    const clientesComCartao = clientes.filter(cliente =>
        cliente.linkedCards?.some(linkedCard => linkedCard.name?.toLowerCase() === cardName)
    );

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.classList.add('card');


    const firstClients = clientesComCartao.slice(0, 3);
    const remainingClientsCount = (clientesComCartao.length || 0) - firstClients.length;

    const clientsHTML = firstClients.map(cliente => `<li>${cliente.name}</li>`).join('');


    cardDiv.innerHTML = `
        <div id="card-details">
            <h2 class="card-name">${card.name}</h2>
            <p class="card-reward">${card.reward}</p>
            <div class="stamps-count">
                ${card.stamps} ${card.stamps === 1 ? 'selo' : 'selos'}
            </div>
            <div class="clients-section">
                <h4>Clientes com cartão:</h4>
                ${clientesComCartao.length > 0 ? `
                    <ul class="client-list">
                        ${clientsHTML}
                    </ul>
                   ${remainingClientsCount > 0 ? `<p class="extra-clients">+${remainingClientsCount} cliente(s)</p>` : ''}
                ` : '<p>Nenhum cliente vinculado a este cartão.</p>'}
            </div>
        </div>
    `;

    userCardsDiv.appendChild(cardDiv);

    cardDiv.addEventListener('click', (event) => {
        const modal = document.getElementById('modal');
        const modalClientList = document.getElementById('modal-client-list');
        modalClientList.innerHTML = '';

        if (clientesComCartao.length === 0) {
            modalClientList.innerHTML = '<li>Nenhum cliente vinculado.</li>';
        } else {
            clientesComCartao.forEach(cliente => {
                const cardInfo = cliente.linkedCards.find(c => c.name.toLowerCase() === cardName);
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>Nome: ${cliente.name}</strong><br>
                    Telefone: ${cliente.phone}<br>
                    Pontos marcados: ${cardInfo?.markedStamps ?? 0}
                `;
                modalClientList.appendChild(li);
            });
        }

        modal.classList.remove('hidden');
        modal.classList.add('show');
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.classList.remove('show');
    });
});
function sair() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../index.html";
}