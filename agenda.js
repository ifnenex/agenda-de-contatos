
let contatos = [];

const API = "http://localhost:3000/contatos";

const form = document.getElementById("formContato");
const nome = document.getElementById("nome");
const telefone = document.getElementById("telefone");
const email = document.getElementById("email");
const categoria = document.getElementById("categoria");
const lista = document.getElementById("listaContatos");
const buscar = document.getElementById("buscar");
const mensagem = document.getElementById("mensagem");
const indice = document.getElementById("indice");
const novoContato = document.getElementById("novoContato");

async function carregarContatos() {
    try {
        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar contatos");
        }

        contatos = await resposta.json();

        mostrarContatos(buscar.value);

    } catch (erro) {
        mensagem.textContent = "Erro ao conectar com o backend.";
    }
}

novoContato.addEventListener("click", function () {
    form.reset();
    indice.value = "";
    mensagem.textContent = "";
});

form.addEventListener("submit", function (e) {
    e.preventDefault();

    mensagem.textContent = "";

    if (
        nome.value.trim() === "" ||
        telefone.value.trim() === "" ||
        email.value.trim() === ""
    ) {
        mensagem.textContent = "Preencha todos os campos obrigatórios.";
        return;
    }

    const telefoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;

    if (!telefoneRegex.test(telefone.value)) {
        mensagem.textContent = "Telefone inválido. Ex: (11) 99999-9999";
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.value)) {
        mensagem.textContent = "E-mail inválido.";
        return;
    }

    const repetido = contatos.some((contato, i) => {
        return contato.email.toLowerCase() === email.value.toLowerCase() &&
               i != indice.value;
    });

    if (repetido) {
        mensagem.textContent = "Este e-mail já está cadastrado.";
        return;
    }

    const contato = {
        nome: nome.value,
        telefone: telefone.value,
        email: email.value,
        categoria: categoria.value
    };

    if (indice.value === "") {
        contatos.push(contato);
    } else {
        contatos[indice.value] = contato;
    }

    form.reset();
    indice.value = "";
    mostrarContatos(buscar.value);
});

function mostrarContatos(filtro = "") {

    lista.innerHTML = "";

    contatos.forEach(function(contato, i) {

        if (!contato.nome.toLowerCase().includes(filtro.toLowerCase()) &&
            !contato.email.toLowerCase().includes(filtro.toLowerCase())) {
            return;
        }

        lista.innerHTML += `
        <tr>
            <td>${contato.nome}</td>
            <td>${contato.telefone}</td>
            <td>${contato.email}</td>
            <td>${contato.categoria}</td>

            <td>
                <button class="editar" onclick="editar(${i})">
                    Editar
                </button>

                <button class="excluir" onclick="excluir(${i})">
                    Excluir
                </button>
            </td>
        </tr>
        `;
    });
}

function editar(i) {

    nome.value = contatos[i].nome;
    telefone.value = contatos[i].telefone;
    email.value = contatos[i].email;
    categoria.value = contatos[i].categoria;

    indice.value = i;
}

function excluir(i) {

    if (confirm("Deseja excluir este contato?")) {

        contatos.splice(i, 1);

        mostrarContatos(buscar.value);
    }
}

buscar.addEventListener("input", function() {
    mostrarContatos(buscar.value);
});

carregarContatos();
