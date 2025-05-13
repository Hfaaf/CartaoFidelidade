
const cadastros = JSON.parse(localStorage.getItem("cadastros")) ||
    [
        {

        },
    ]

const armazenar = () => {
    try {
        localStorage.setItem("cadastros", JSON.stringify(cadastros))
    }
    catch(err) {
        console.log("Não foi possivel guardar no LocalStorage:", err)
    }
}

function Cadastro() {
    const nome = document.getElementById("cadastroNome").value
    const email = document.getElementById("cadastroEmail").value
    const senha = document.getElementById("cadastroSenha").value
    const repetirSenha = document.getElementById("repitaSenha").value


    if (!nome || !email || !senha) {
        alert("Preencha todos os campos!")
        return
    }


    const existe = cadastros.some(cadastro => cadastro.email === email)
    if (existe) {
        alert("Este e-mail já está cadastrado!")
        return
    } else if (senha != repetirSenha) {
        alert("As senhas não são iguais. Tente novamente")
        return
    } else if (senha.length < 6) {
        alert("A senha tem que ter mais que 6 digitos")
        return
    } else if (/[a-zA-z]/.test(senha) == false) {
        alert("A senha tem que ter pelo menos uma letra")
        return
    } else if (/\d/.test(senha) == false) {
        alert("A senha tem que ter pelo menos um numero")
        return
    }

    cadastros.push({ nome, email, senha })

    armazenar()

    alert("Cadastro realizado com sucesso!")
}

function Login() {
    const email = document.getElementById("email").value
    const password = document.getElementById("senha").value

    const cadastrosSalvos = JSON.parse(localStorage.getItem("cadastros")) || []

    const verificar = cadastrosSalvos.find(
        cadastro => cadastro.email === email && cadastro.senha === password
    )

    if (verificar) {
        event.preventDefault()
        localStorage.setItem("loggedInUser", email)
        local = window.document.location.href = "/pages/wait.html"
        console.log(local)
    } else if (email === "" || password === "") {
        alert("Preencha todos os campos por favor")
    }
    else {
        alert("Email ou senha incorreto")
    }
}

console.log(cadastros)  