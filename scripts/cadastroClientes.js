const LOGGED_USER_KEY = "loggedInUser";
const USERS_KEY = "usersData";

const userForm = document.getElementById('user-form');
const userIdField = document.getElementById('user-id');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const usersList = document.getElementById('users-list');
const searchInput = document.getElementById('search');

let usersData = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
let isEditing = false;

const loggedInUser = localStorage.getItem(LOGGED_USER_KEY);

if (!loggedInUser) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "../pages/index.html";
}

function saveUsersToStorage() {
    localStorage.setItem(USERS_KEY, JSON.stringify(usersData));
}

function clearForm() {
    userForm.reset();
    userIdField.value = '';
    isEditing = false;
    formTitle.textContent = 'Adicionar Usuário';
}

function renderUsers() {
    const usersToRender = usersData[loggedInUser] || [];
    usersList.innerHTML = '';

    if (usersToRender.length === 0) {
        usersList.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum usuário cadastrado</td></tr>';
        return;
    }

    usersToRender.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.phone}</td>
            <td>
            ${user.linkedCards && user.linkedCards.length > 0 ?
                user.linkedCards.map(card => `
                    <div class="linked-card">
                        <div class="card-header">
                            <strong>${card.name}</strong>
                            <div class="card-actions">
                                <button class="edit-card-btn" 
                                    data-user-id="${user.id}" 
                                    data-card-name="${card.name}">
                                    <i class="bi bi-stamp"></i> Gerenciar Cartão
                                </button>
                                <button class="unlink-card-btn" 
                                        data-user-id="${user.id}" 
                                        data-card-name="${card.name}">
                                    <i class="bi bi-trash"></i> Remover
                                </button>
                            </div>
                        </div>
                        <p>Recompensa: ${card.reward}</p>
                        <div class="stamps-progress">
                            ${Array.from({ length: card.stamps }, (_, i) => `
                                <div class="stamp-mini ${i < (card.markedStamps || 0) ? 'marked' : ''}"></div>
                            `).join('')}
                        </div>
                        <p>${card.markedStamps || 0}/${card.stamps} selos</p>
                    </div>
                `).join('') :
                'Nenhum cartão vinculado'}
            </td>
            <td class="action-btns">
                <button class="edit-btn" data-id="${user.id}">Editar</button>
                <button class="delete-btn" data-id="${user.id}">Excluir</button>
                <button class="link-card-btn" data-id="${user.id}">Vincular Cartão</button>
            </td>
        `;
        usersList.appendChild(row);
    });

    document.querySelectorAll('.edit-card-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const userId = this.dataset.userId;
            const cardName = this.dataset.cardName;
            openStampEditor(userId, cardName);
        });
    });

    document.querySelectorAll('.unlink-card-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const userId = this.dataset.userId;
            const cardName = this.dataset.cardName;

            if (confirm(`Tem certeza que deseja desvincular o cartão "${cardName}"?`)) {
                const user = usersData[loggedInUser].find(u => u.id === userId);
                if (user && user.linkedCards) {
                    user.linkedCards = user.linkedCards.filter(card => card.name !== cardName);
                    saveUsersToStorage();
                    showToast(`Cartão "${cardName}" desvinculado com sucesso!`);
                    renderUsers();
                }
            }
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEdit);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
    document.querySelectorAll('.link-card-btn').forEach(btn => {
        btn.addEventListener('click', handleLinkCard);
    });
}

function addUser(name, phone) {
    const newUser = {
        id: Date.now().toString(),
        name,
        phone,
        linkedCards: []
    };

    if (!usersData[loggedInUser]) {
        usersData[loggedInUser] = [];
    }

    usersData[loggedInUser].push(newUser);
    saveUsersToStorage();
    renderUsers();
    alert('Usuário adicionado com sucesso!');
}

function updateUser(id, name, phone) {
    const index = usersData[loggedInUser].findIndex(user => user.id === id);
    if (index !== -1) {
        usersData[loggedInUser][index] = {
            ...usersData[loggedInUser][index],
            name,
            phone
        };
        saveUsersToStorage();
        renderUsers();
        alert('Usuário atualizado com sucesso!');
    }
}

function deleteUser(id) {
    usersData[loggedInUser] = usersData[loggedInUser].filter(user => user.id !== id);
    saveUsersToStorage();
    renderUsers();
    alert('Usuário excluído com sucesso!');
}

function handleLinkCard(e) {
    const userId = e.target.dataset.id;
    const user = usersData[loggedInUser].find(user => user.id === userId);

    if (!user) return;

    const userCards = JSON.parse(localStorage.getItem(loggedInUser)) || [];

    if (userCards.length === 0) {
        alert("Você não tem cartões criados. Crie um cartão primeiro.");
        return;
    }

    const modal = document.getElementById('cards-modal');
    const cardsContainer = document.getElementById('modal-cards-container');
    cardsContainer.innerHTML = '';

    userCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-in-modal';
        cardElement.dataset.cardName = card.name;
        cardElement.innerHTML = `
            <h4>${card.name}</h4>
            <p><strong>Recompensa:</strong> ${card.reward}</p>
            <p><strong>Selos:</strong> ${card.markedStamps || 0}/${card.stamps}</p>
            <div class="stamps-preview">
                ${Array.from({ length: card.stamps }, (_, i) =>
            `<div class="stamp-in-preview ${i < (card.markedStamps || 0) ? 'marked' : ''}"></div>`
        ).join('')}
            </div>
        `;

        cardElement.addEventListener('click', function () {
            document.querySelectorAll('.card-in-modal').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });

        cardsContainer.appendChild(cardElement);
    });

    modal.style.display = 'block';

    document.querySelector('.close-modal').onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    document.getElementById('confirm-link').onclick = function () {
        const selectedCard = document.querySelector('.card-in-modal.selected');
        if (!selectedCard) {
            alert('Por favor, selecione um cartão');
            return;
        }

        const cardName = selectedCard.dataset.cardName;
        const selectedCardData = userCards.find(card => card.name === cardName);

        if (!user.linkedCards) {
            user.linkedCards = [];
        }

        if (user.linkedCards.some(card => card.name === cardName)) {
            alert(`O cartão "${cardName}" já está vinculado a este cliente.`);
            modal.style.display = 'none';
            return;
        }

        user.linkedCards.push(selectedCardData);
        saveUsersToStorage();
        alert(`Cartão "${cardName}" vinculado com sucesso!`);
        modal.style.display = 'none';
        renderUsers();
    };
}

function handleEdit(e) {
    const userId = e.target.dataset.id;
    const userToEdit = usersData[loggedInUser].find(user => user.id === userId);
    if (userToEdit) {
        userIdField.value = userToEdit.id;
        nameInput.value = userToEdit.name;
        phoneInput.value = userToEdit.phone;
        isEditing = true;
        formTitle.textContent = 'Editar Usuário';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function handleDelete(e) {
    const userId = e.target.dataset.id;
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        deleteUser(userId);
    }
}

function filterUsers(query) {
    const usersToRender = usersData[loggedInUser] || [];
    const filteredUsers = usersToRender.filter(user => {
        const searchTerm = query.toLowerCase();
        return user.name.toLowerCase().includes(searchTerm) ||
            user.phone.toLowerCase().includes(searchTerm);
    });

    renderFilteredUsers(filteredUsers);
}

function renderFilteredUsers(filteredUsers) {
    usersList.innerHTML = '';
    if (filteredUsers.length === 0) {
        usersList.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum usuário encontrado</td></tr>';
        return;
    }

    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.phone}</td>
            <td>
                ${user.linkedCards && user.linkedCards.length > 0 ?
                user.linkedCards.map(card =>
                    `<div class="linked-card">
                            <strong>${card.name}</strong><br>
                            Recompensa: ${card.reward}<br>
                            Selos: ${card.markedStamps || 0}/${card.stamps}
                        </div>`
                ).join('') :
                'Nenhum cartão vinculado'}
            </td>
            <td class="action-btns">
                <button class="edit-btn" data-id="${user.id}">Editar</button>
                <button class="delete-btn" data-id="${user.id}">Excluir</button>
                <button class="link-card-btn" data-id="${user.id}">Vincular Cartão</button>
            </td>
        `;
        usersList.appendChild(row);
    });
}

userForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (name && phone) {
        if (isEditing) {
            updateUser(userIdField.value, name, phone);
        } else {
            addUser(name, phone);
        }
        clearForm();
    }
});

cancelBtn.addEventListener('click', clearForm);
searchInput.addEventListener('input', e => {
    filterUsers(e.target.value.trim());
});

function setupCardEditing() {
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-card-btn')) {
            const userId = e.target.dataset.userId;
            const cardName = e.target.dataset.cardName;
            openStampEditor(userId, cardName);
        }
    });
}

function openStampEditor(userId, cardName) {
    const user = usersData[loggedInUser].find(u => u.id === userId);
    if (!user || !user.linkedCards) return;

    const card = user.linkedCards.find(c => c.name === cardName);
    if (!card) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
    <div class="modal-content stamp-editor">
        <span class="close-modal">&times;</span>
        <h3>Editar Cartão: ${cardName}</h3>
        <p><strong>Recompensa:</strong> ${card.reward}</p>
        <p><strong>Cliente:</strong> ${user.name} (${user.phone})</p>
        
        <div class="stamps-display">
            ${Array.from({ length: card.stamps }, (_, i) => `
                <div class="stamp-selector ${i < card.markedStamps ? 'marked' : ''}" 
                     data-index="${i}"></div>
            `).join('')}
        </div>
        
        <div class="stamp-controls">
            <button id="save-stamps-btn">Salvar Alterações</button>
            <button id="share-card-btn">Enviar via WhatsApp</button>
            <button id="cancel-stamps-btn">Cancelar</button>
        </div>
        
        <div class="stamp-counter">
            Selos marcados: <span id="stamp-count">${card.markedStamps || 0}</span>/${card.stamps}
        </div>
    </div>
`;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.querySelector('#cancel-stamps-btn').onclick = () => modal.remove();

    const stampElements = modal.querySelectorAll('.stamp-selector');
    stampElements.forEach(stamp => {
        stamp.addEventListener('click', function () {
            const index = parseInt(this.dataset.index);
            const isMarked = this.classList.contains('marked');

            stampElements.forEach((s, i) => {
                if (i <= index) {
                    isMarked ? s.classList.remove('marked') : s.classList.add('marked');
                } else {
                    s.classList.remove('marked');
                }
            });

            updateStampCount();
        });
    });

    modal.querySelector('#save-stamps-btn').onclick = () => {
        const markedCount = modal.querySelectorAll('.stamp-selector.marked').length;
        card.markedStamps = markedCount;
        saveUsersToStorage();
        alert('Selos atualizados com sucesso!');
        modal.remove();
        renderUsers();
    };
    modal.querySelector('#share-card-btn').onclick = () => {
        shareCard(card, user.phone);
    };

    function updateStampCount() {
        const count = modal.querySelectorAll('.stamp-selector.marked').length;
        modal.querySelector('#stamp-count').textContent = count;
    }
}


function shareCard(card, userPhone) {
    const cleanedPhone = userPhone.replace(/\D/g, '');

    if (cleanedPhone.length < 10) {
        alert("Número de telefone inválido.");
        return;
    }

    const formattedPhone = `55${cleanedPhone}`

    const displayPhone = formatPhoneBR(userPhone)

    const message = `*Cartão Fidelidade ${card.name}*\n\n` +
        `*Recompensa:* ${card.reward}\n` +
        `*Progresso:* ${card.markedStamps || 0}/${card.stamps} selos\n\n` +
        `Acompanhe seu progresso!\n\n` +
        `📱 Enviado para: ${displayPhone}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

function formatPhoneBR(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned[2]} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else {
        return phone;
    }
}


setupCardEditing();

renderUsers();