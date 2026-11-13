
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let contatos = [];
let proximoId = 1;

app.get("/contatos", (req, res) => {
    return res.json(contatos);
});

app.get("/contatos/:id", (req, res) => {
    const id = Number(req.params.id);

    const contato = contatos.find(item => item.id === id);

    if (!contato) {
        return res.status(404).json({
            mensagem: "Contato não encontrado."
        });
    }

    return res.json(contato);
});

app.post("/contatos", (req, res) => {
    const dados = req.body;

    if (!dados.nome || !dados.telefone || !dados.email) {
        return res.status(400).json({
            mensagem: "Preencha os campos obrigatórios."
        });
    }

    const repetido = contatos.some(item =>
        item.email.toLowerCase() === dados.email.trim().toLowerCase()
    );

    if (repetido) {
        return res.status(400).json({
            mensagem: "Este e-mail já está cadastrado."
        });
    }

    const novoContato = {
        id: proximoId++,
        nome: dados.nome,
        telefone: dados.telefone,
        email: dados.email,
        categoria: dados.categoria || ""
    };

    contatos.push(novoContato);

    return res.status(201).json(novoContato);
});

app.put("/contatos/:id", (req, res) => {
    const id = Number(req.params.id);

    const indice = contatos.findIndex(item => item.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Contato não encontrado."
        });
    }

    const dados = req.body;

    if (!dados.nome || !dados.telefone || !dados.email) {
        return res.status(400).json({
            mensagem: "Preencha os campos obrigatórios."
        });
    }

    const repetido = contatos.some(item =>
        item.email.toLowerCase() === dados.email.trim().toLowerCase()
        && item.id !== id
    );

    if (repetido) {
        return res.status(400).json({
            mensagem: "Este e-mail já está cadastrado."
        });
    }

    contatos[indice] = {
        id: id,
        nome: dados.nome,
        telefone: dados.telefone,
        email: dados.email,
        categoria: dados.categoria || ""
    };

    return res.json(contatos[indice]);
});

app.delete("/contatos/:id", (req, res) => {
    const id = Number(req.params.id);

    const indice = contatos.findIndex(item => item.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Contato não encontrado."
        });
    }

    contatos.splice(indice, 1);

    return res.json({
        mensagem: "Contato excluído com sucesso."
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
