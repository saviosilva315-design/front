const BASE_URL = "https://meuback-ulyh.onrender.com";

// ===============================
//     PEDIDOS
// ===============================

function criarPedido() {
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;

    fetch(`${BASE_URL}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao, status: "aberto" })
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById("titulo").value = "";
        document.getElementById("descricao").value = "";
        carregarPedidos();
    });
}

function carregarPedidos() {
    fetch(`${BASE_URL}/pedidos`)
        .then(res => res.json())
        .then(pedidos => {
            const div = document.getElementById("lista");
            div.innerHTML = "";
            pedidos.forEach(p => {
                div.innerHTML += `
                    <p>
                        <strong>${p.titulo}</strong> - ${p.descricao}
                        <button onclick="excluirPedido(${p.id})">Excluir</button>
                    </p>
                `;
            });
        });
}

function excluirPedido(id) {
    fetch(`${BASE_URL}/pedidos/${id}`, { method: "DELETE" })
        .then(() => carregarPedidos());
}

carregarPedidos();

// ===============================
//     FORNECEDORES
// ===============================

function salvarFornecedor() {
    const nome = document.getElementById("fornecedorNome").value;

    fetch(`${BASE_URL}/fornecedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById("msgFornecedor").innerText = "Fornecedor salvo!";
        document.getElementById("fornecedorNome").value = "";
        carregarFornecedores();
    });
}

function carregarFornecedores() {
    fetch(`${BASE_URL}/fornecedores`)
        .then(res => res.json())
        .then(lista => {
            const div = document.getElementById("listaFornecedores");
            div.innerHTML = "";

            lista.forEach(f => {
                div.innerHTML += `
                    <div style="margin-bottom:15px;">
                        <p>
                            <strong>${f.nome}</strong>
                            <button onclick="excluirFornecedor(${f.id})">Excluir fornecedor</button>
                        </p>

                        <div id="produtos-${f.id}"></div>

                        <input id="produto-nome-${f.id}" placeholder="Nome do produto">
                        <button onclick="adicionarProduto(${f.id})">Adicionar Produto</button>

                        <hr>
                    </div>
                `;

                carregarProdutos(f.id);
            });
        });
}

function excluirFornecedor(id) {
    fetch(`${BASE_URL}/fornecedores/${id}`, { method: "DELETE" })
        .then(() => carregarFornecedores());
}

carregarFornecedores();

// ===============================
//     PRODUTOS POR FORNECEDOR
// ===============================

function adicionarProduto(fornecedorId) {
    const nomeProd = document.getElementById(`produto-nome-${fornecedorId}`).value;

    fetch(`${BASE_URL}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeProd, fornecedorId })
    })
    .then(() => {
        document.getElementById(`produto-nome-${fornecedorId}`).value = "";
        carregarProdutos(fornecedorId);
    });
}

function carregarProdutos(fornecedorId) {
    fetch(`${BASE_URL}/produtos`)
        .then(res => res.json())
        .then(produtos => {
            const lista = produtos.filter(p => p.fornecedorId == fornecedorId);
            const div = document.getElementById(`produtos-${fornecedorId}`);

            div.innerHTML = "<strong>Produtos:</strong><ul>" 
                + lista.map(p => 
                    `<li>
                        ${p.nome}
                        <button onclick="excluirProduto(${p.id}, ${fornecedorId})">
                            Excluir
                        </button>
                    </li>`
                ).join("") 
                + "</ul>";
        });
}

function excluirProduto(id, fornecedorId) {
    fetch(`${BASE_URL}/produtos/${id}`, { method: "DELETE" })
        .then(() => carregarProdutos(fornecedorId));
}
