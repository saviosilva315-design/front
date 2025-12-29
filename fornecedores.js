// =====================================
// CONFIGURAÇÃO
// =====================================

const API_BASE = "https://meuback-ulyh.onrender.com";

let fornecedores = [];
let produtosCache = {}; // produtos por fornecedor


// =====================================
// SPINNER
// =====================================

function showLoading() {
    const container = document.getElementById("suppliers-container");
    container.innerHTML = `
        <div class="loading-spinner"></div>
        <p style="text-align:center;color:#555;">Carregando...</p>
    `;
}

function hideLoading() {
    document.getElementById("suppliers-container").innerHTML = "";
}


// =====================================
// API
// =====================================

async function apiGet(path) {
    try {
        const response = await fetch(API_BASE + path);
        return await response.json();
    } catch (e) {
        return null;
    }
}

async function apiPost(path, body) {
    try {
        const response = await fetch(API_BASE + path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        return await response.json();
    } catch (e) {
        return null;
    }
}

async function apiDelete(path) {
    try {
        await fetch(API_BASE + path, { method: "DELETE" });
        return true;
    } catch (e) {
        return false;
    }
}


// =====================================
// CARREGAR FORNECEDORES
// =====================================

async function carregarFornecedores() {
    showLoading();

    const data = await apiGet("/fornecedores");

    hideLoading();

    fornecedores = data || [];
    renderizarFornecedores();
}


// =====================================
// RENDERIZAR FORNECEDORES
// =====================================

function renderizarFornecedores() {
    const container = document.getElementById("suppliers-container");
    container.innerHTML = "";

    if (fornecedores.length === 0) {
        container.innerHTML = `<p style="text-align:center;color:#777;">Nenhum fornecedor ainda.</p>`;
        return;
    }

    fornecedores.forEach(fornecedor => {
        const card = document.createElement("div");
        card.className = "supplier-card";

        card.innerHTML = `
            <h3>${fornecedor.nome}</h3>
            <p>Contato: ${fornecedor.contato}</p>

            <button class="delete-supplier" onclick="deletarFornecedor(${fornecedor.id})">
                Excluir Fornecedor
            </button>

            <div class="products-area">
                <h4>Produtos</h4>

                <div id="products-${fornecedor.id}">
                    <div class="loading-spinner small"></div>
                </div>

                <form class="add-product-form" onsubmit="adicionarProduto(event, ${fornecedor.id})">
                    <input type="text" id="produto-nome-${fornecedor.id}" placeholder="Nome do Produto" required>
                    <input type="number" id="produto-preco-${fornecedor.id}" step="0.01" placeholder="Preço" required>
                    <button type="submit">Adicionar Produto</button>
                </form>
            </div>
        `;

        container.appendChild(card);
        carregarProdutos(fornecedor.id);
    });
}


// =====================================
// CARREGAR PRODUTOS
// =====================================

async function carregarProdutos(fornecedorId) {
    const data = await apiGet(`/produtos?fornecedorId=${fornecedorId}`);

    if (!data) {
        produtosCache[fornecedorId] = [];
    } else {
        produtosCache[fornecedorId] = data;
    }

    renderizarProdutos(fornecedorId);
}


// =====================================
// RENDERIZAR PRODUTOS
// =====================================

function renderizarProdutos(fornecedorId) {
    const lista = document.getElementById(`products-${fornecedorId}`);
    const produtos = produtosCache[fornecedorId] || [];

    lista.innerHTML = "";

    if (produtos.length === 0) {
        lista.innerHTML = `<p style="color:#777;">Nenhum produto cadastrado.</p>`;
        return;
    }

    produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "product-mini-card";

        const preco = produto.preco ? produto.preco.toFixed(2) : "0.00";

        card.innerHTML = `
            <span>${produto.nome} - R$ ${preco}</span>
            <button onclick="deletarProduto(${produto.id}, ${fornecedorId})">X</button>
        `;

        lista.appendChild(card);
    });
}


// =====================================
// ADICIONAR PRODUTO
// =====================================

async function adicionarProduto(event, fornecedorId) {
    event.preventDefault();

    const nome = document.getElementById(`produto-nome-${fornecedorId}`).value.trim();
    const preco = parseFloat(document.getElementById(`produto-preco-${fornecedorId}`).value);

    const criado = await apiPost("/produtos", {
        nome,
        preco,
        fornecedorId
    });

    if (!produtosCache[fornecedorId]) produtosCache[fornecedorId] = [];

    produtosCache[fornecedorId].push(criado);
    renderizarProdutos(fornecedorId);
}


// =====================================
// DELETAR PRODUTO
// =====================================

async function deletarProduto(id, fornecedorId) {
    await apiDelete(`/produtos/${id}`);

    produtosCache[fornecedorId] = produtosCache[fornecedorId].filter(p => p.id !== id);
    renderizarProdutos(fornecedorId);
}


// =====================================
// ADICIONAR FORNECEDOR
// =====================================

async function adicionarFornecedor(event) {
    event.preventDefault();

    const nome = document.getElementById("supplier-name").value;
    const contato = document.getElementById("supplier-phone").value;

    const criado = await apiPost("/fornecedores", {
        nome,
        contato
    });

    fornecedores.push(criado);
    renderizarFornecedores();
}


// =====================================
// DELETAR FORNECEDOR
// =====================================

async function deletarFornecedor(id) {
    await apiDelete(`/fornecedores/${id}`);

    fornecedores = fornecedores.filter(f => f.id !== id);
    renderizarFornecedores();
}


// =====================================
// INICIAR
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("create-supplier-form")
        .addEventListener("submit", adicionarFornecedor);

    carregarFornecedores();
});
