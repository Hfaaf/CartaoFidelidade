setTimeout(function() {
    const loggedInUser  = localStorage.getItem("loggedInUser")
    console.log("Usuário logado:", loggedInUser)

    const userCards = JSON.parse(localStorage.getItem(loggedInUser)) || [];
    console.log("Cartões do usuário:", userCards)

    if (userCards.length > 0) {
        window.location.href = "homePage.html";
    } else {
        window.location.href = "Cartao.html";
    }
}, 1000)