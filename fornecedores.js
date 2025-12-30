@@ -1,7 +1,16 @@
// =====================================
// CONFIGURAÇÃO
// =====================================

const API_BASE = "https://meuback-ulyh.onrender.com";

let fornecedores = [];
let produtosCache = {};
let produtosCache = {}; // produtos por fornecedor


// =====================================
// SPINNER
// =====================================

function showLoading() {
    const container = document.getElementById("suppliers-container");
@@ -15,11 +24,16 @@ function hideLoading() {
    document.getElementById("suppliers-container").innerHTML = "";
}


// =====================================
// API
// =====================================

async function apiGet(path) {
    try {
        const response = await fetch(API_BASE + path);
        return await response.json();
    } catch {
    } catch (e) {
        return null;
    }
}
@@ -31,18 +45,27 @@ async function apiPost(path, body) {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        return await response.json();
    } catch {
    } catch (e) {
        return null;
    }
}

async function apiDelete(path) {
    try {
        await fetch(API_BASE + path, { method: "DELETE" });
    } catch {}
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

@@ -54,12 +77,17 @@ async function carregarFornecedores() {
    renderizarFornecedores();
}


// =====================================
// RENDERIZAR FORNECEDORES
// =====================================

function renderizarFornecedores() {
    const container = document.getElementById("suppliers-container");
    container.innerHTML = "";

    if (fornecedores.length === 0) {
        container.innerHTML = `<p style="text-align:center;color:#777;">Nenhum fornecedor cadastrado ainda.</p>`;
        container.innerHTML = `<p style="text-align:center;color:#777;">Nenhum fornecedor ainda.</p>`;
        return;
    }

@@ -68,22 +96,23 @@ function renderizarFornecedores() {
        card.className = "supplier-card";

        card.innerHTML = `
            <h3>${fornecedor.name}</h3>
            <p>Contato: ${fornecedor.contact}</p>
            <h3>${fornecedor.nome}</h3>
            <p>Contato: ${fornecedor.contato}</p>

            <button class="delete-supplier" onclick="deletarFornecedor(${fornecedor.id})">
                Excluir Fornecedor
            </button>

            <div class="products-area">
                <h4>Produtos</h4>
                <div class="products-list" id="products-${fornecedor.id}">

                <div id="products-${fornecedor.id}">
                    <div class="loading-spinner small"></div>
                </div>

                <form class="add-product-form" onsubmit="adicionarProduto(event, ${fornecedor.id})">
                    <input type="text" placeholder="Nome do Produto" required id="produto-nome-${fornecedor.id}">
                    <input type="number" step="0.01" placeholder="Preço" required id="produto-preco-${fornecedor.id}">
                    <input type="text" id="produto-nome-${fornecedor.id}" placeholder="Nome do Produto" required>
                    <input type="number" id="produto-preco-${fornecedor.id}" step="0.01" placeholder="Preço" required>
                    <button type="submit">Adicionar Produto</button>
                </form>
            </div>
@@ -94,101 +123,129 @@ function renderizarFornecedores() {
    });
}

async function carregarProdutos(fornecedorId) {
    const lista = document.getElementById(`products-${fornecedorId}`);

// =====================================
// CARREGAR PRODUTOS
// =====================================

async function carregarProdutos(fornecedorId) {
    const data = await apiGet(`/produtos?fornecedorId=${fornecedorId}`);

    if (!data) {
        lista.innerHTML = `<p style="color:#999;">Erro ao carregar produtos.</p>`;
        return;
        produtosCache[fornecedorId] = [];
    } else {
        produtosCache[fornecedorId] = data;
    }

    produtosCache[fornecedorId] = data;
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
        lista.innerHTML = `<p style="color:#777;">Nenhum produto.</p>`;
        lista.innerHTML = `<p style="color:#777;">Nenhum produto cadastrado.</p>`;
        return;
    }

    produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "product-mini-card";

        const preco = produto.preco ? produto.preco.toFixed(2) : "0.00";

        card.innerHTML = `
            <span>${produto.name} - R$ ${produto.price.toFixed(2)}</span>
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

    const nome = document.getElementById(`produto-nome-${fornecedorId}`).value;
    const nome = document.getElementById(`produto-nome-${fornecedorId}`).value.trim();
    const preco = parseFloat(document.getElementById(`produto-preco-${fornecedorId}`).value);

    const criado = await apiPost("/produtos", {
        name: nome,
        price: preco,
        nome,
        preco,
        fornecedorId
    });

    if (!criado || !criado.id) {
        alert("Erro ao criar produto.");
        return;
    }
    if (!produtosCache[fornecedorId]) produtosCache[fornecedorId] = [];

    produtosCache[fornecedorId].push(criado);
    renderizarProdutos(fornecedorId);

    document.getElementById(`produto-nome-${fornecedorId}`).value = "";
    document.getElementById(`produto-preco-${fornecedorId}`).value = "";
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
        name: nome,
        contact: contato
        nome,
        contato
    });

    if (!criado || !criado.id) {
        alert("Erro ao criar fornecedor.");
        return;
    }

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
    document.getElementById("create-supplier-form").addEventListener("submit", adicionarFornecedor);
    document.getElementById("create-supplier-form")
        .addEventListener("submit", adicionarFornecedor);

    carregarFornecedores();
});
