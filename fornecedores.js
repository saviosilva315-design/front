const API_BASE = "https://meuback-ulyh.onrender.com";

let fornecedores = [];
let produtosCache = {};

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

async function apiGet(path) {
    try {
        const response = await fetch(API_BASE + path);
        return await response.json();
    } catch {
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
    } catch {
        return null;
    }
}

async function apiDelete(path) {
    try {
        await fetch(API_BASE + path, { method: "DELETE" });
    } catch {}
}

async function carregarFornecedores() {
    showLoading();

    const data = await apiGet("/fornecedores");

    hideLoading();

    fornecedores = data || [];
    renderizarFornecedores();
}

function renderizarFornecedores() {
    const container = document.getElementById("suppliers-container");
    container.innerHTML = "";

    if (fornecedores.length === 0) {
        container.innerHTML = `<p style="text-align:center;color:#777;">Nenhum fornecedor cadastrado ainda.</p>`;
        return;
    }

    fornecedores.forEach(fornecedor => {
        const card = document.createElement("div");
        card.className = "supplier-card";

        card.innerHTML = `
            <h3>${fornecedor.name}</h3>
            <p>Contato: ${fornecedor.contact}</p>

            <button class="delete-supplier" onclick="deletarFornecedor(${fornecedor.id})">
                Excluir Fornecedor
            </button>

            <div class="products-area">
                <h4>Produtos</h4>
                <div class="products-list" id="products-${fornecedor.id}">
                    <div class="loading-spinner small"></div>
                </div>

                <form class="add-product-form" onsubmit="adicionarProduto(event, ${fornecedor.id})">
                    <input type="text" placeholder="Nome do Produto" required id="produto-nome-${fornecedor.id}">
                    <input type="number" step="0.01" placeholder="Preço" required id="produto-preco-${fornecedor.id}">
                    <button type="submit">Adicionar Produto</button>
                </form>
            </div>
        `;

        container.appendChild(card);
        carregarProdutos(fornecedor.id);
    });
}

async function carregarProdutos(fornecedorId) {
    const lista = document.getElementById(`products-${fornecedorId}`);

    const data = await apiGet(`/produtos?fornecedorId=${fornecedorId}`);

    if (!data) {
        lista.innerHTML = `<p style="color:#999;">Erro ao carregar produtos.</p>`;
        return;
    }

    produtosCache[fornecedorId] = data;
    renderizarProdutos(fornecedorId);
}

function renderizarProdutos(fornecedorId) {
    const lista = document.getElementById(`products-${fornecedorId}`);
    const produtos = produtosCache[fornecedorId] || [];

    lista.innerHTML = "";

    if (produtos.length === 0) {
        lista.innerHTML = `<p style="color:#777;">Nenhum produto.</p>`;
        return;
    }

    produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "product-mini-card";

        card.innerHTML = `
            <span>${produto.name} - R$ ${produto.price.toFixed(2)}</span>
            <button onclick="deletarProduto(${produto.id}, ${fornecedorId})">X</button>
        `;

        lista.appendChild(card);
    });
}

async function adicionarProduto(event, fornecedorId) {
    event.preventDefault();

    const nome = document.getElementById(`produto-nome-${fornecedorId}`).value;
    const preco = parseFloat(document.getElementById(`produto-preco-${fornecedorId}`).value);

    const criado = await apiPost("/produtos", {
        name: nome,
        price: preco,
        fornecedorId
    });

    if (!criado || !criado.id) {
        alert("Erro ao criar produto.");
        return;
    }

    produtosCache[fornecedorId].push(criado);
    renderizarProdutos(fornecedorId);

    document.getElementById(`produto-nome-${fornecedorId}`).value = "";
    document.getElementById(`produto-preco-${fornecedorId}`).value = "";
}

async function deletarProduto(id, fornecedorId) {
    await apiDelete(`/produtos/${id}`);
    produtosCache[fornecedorId] = produtosCache[fornecedorId].filter(p => p.id !== id);
    renderizarProdutos(fornecedorId);
}

async function adicionarFornecedor(event) {
    event.preventDefault();

    const nome = document.getElementById("supplier-name").value;
    const contato = document.getElementById("supplier-phone").value;

    const criado = await apiPost("/fornecedores", {
        name: nome,
        contact: contato
    });

    if (!criado || !criado.id) {
        alert("Erro ao criar fornecedor.");
        return;
    }

    fornecedores.push(criado);
    renderizarFornecedores();
}

async function deletarFornecedor(id) {
    await apiDelete(`/fornecedores/${id}`);
    fornecedores = fornecedores.filter(f => f.id !== id);
    renderizarFornecedores();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("create-supplier-form").addEventListener("submit", adicionarFornecedor);
    carregarFornecedores();
});
