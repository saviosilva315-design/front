// ------------------------
// PEDIDOS
// ------------------------
function criarPedido() {
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;

    fetch("https://meuback-ulyh.onrender.com/pedidos", {
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

function excluirPedido(id) {
    fetch(`https://meuback-ulyh.onrender.com/pedidos/${id}`, {
        method: "DELETE"
    })
    .then(() => carregarPedidos());
}

function carregarPedidos() {
    fetch("https://meuback-ulyh.onrender.com/pedidos")
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

carregarPedidos();

// ------------------------
// FORNECEDORES
// ------------------------
function salvarFornecedor() {
    const nome = document.getElementById("fornecedorNome").value;

    fetch("https://meuback-ulyh.onrender.com/fornecedores", {
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

function excluirFornecedor(id) {
    fetch(`https://meuback-ulyh.onrender.com/fornecedores/${id}`, {
        method: "DELETE"
    })
    .then(() => carregarFornecedores());
}

// ------------------------
// PRODUTOS
// ------------------------
function adicionarProduto(fornecedorId) {
    const nome = prompt("Nome do produto:");
    if (!nome) return;

    const preco = prompt("Preço do produto:");
    if (!preco) return;

    fetch(`https://meuback-ulyh.onrender.com/fornecedores/${fornecedorId}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco })
    })
    .then(() => carregarFornecedores());
}

// ------------------------
// LISTAGEM DE FORNECEDORES
// ------------------------
function carregarFornecedores() {
    fetch("https://meuback-ulyh.onrender.com/fornecedores")
        .then(res => res.json())
        .then(fornecedores => {

            fetch("https://meuback-ulyh.onrender.com/produtos")
                .then(r => r.json())
                .then(produtos => {

                    const div = document.getElementById("listaFornecedores");
                    div.innerHTML = "";

                    fornecedores.forEach(f => {
                        const produtosDoFornecedor = produtos.filter(p => p.fornecedorId === f.id);

                        div.innerHTML += `
                            <div style="margin-bottom: 20px;">
                                <strong>${f.nome}</strong>
                                <button onclick="excluirFornecedor(${f.id})">Excluir</button>
                                <button onclick="adicionarProduto(${f.id})">Adicionar Produto</button>

                                <ul>
                                    ${produtosDoFornecedor.map(p => `<li>${p.nome} - R$ ${p.preco}</li>`).join("")}
                                </ul>
                            </div>
                        `;
                    });
                });
        });
}

carregarFornecedores();
