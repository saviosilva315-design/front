const API = "https://meuback-ulyh.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    carregarFornecedores();
});

async function carregarFornecedores() {
    const lista = document.getElementById("listaFornecedores");
    lista.innerHTML = "Carregando...";

    const resp = await fetch(`${API}/fornecedores`);
    const fornecedores = await resp.json();

    lista.innerHTML = "";

    fornecedores.forEach(f => {
        const div = document.createElement("div");
        div.className = "fornecedor";

        div.innerHTML = `
            <h3>${f.nome}</h3>

            <button onclick="mostrarProdutos(${f.id}, this)">
                Ver produtos
            </button>

            <button onclick="excluirFornecedor(${f.id})" class="del">
                Excluir fornecedor
            </button>

            <div id="produtos-${f.id}" class="produtos"></div>
        `;

        lista.appendChild(div);
    });
}
async function adicionarFornecedor() {
    const nome = document.getElementById("nome").value.trim();

    if (!nome) {
        alert("Digite um nome!");
        return;
    }

    await fetch(`${API}/fornecedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
    });

    document.getElementById("nome").value = "";
    carregarFornecedores();
}
async function mostrarProdutos(fornecedorId, botao) {
    const div = document.getElementById(`produtos-${fornecedorId}`);

    // esconder/mostrar
    if (div.innerHTML.trim() !== "") {
        div.innerHTML = "";
        botao.innerText = "Ver produtos";
        return;
    }

    botao.innerText = "Esconder produtos";

    const resp = await fetch(`${API}/produtos`);
    const produtos = await resp.json();

    const filtrados = produtos.filter(p => p.fornecedorId === fornecedorId);

    let html = "<h4>Produtos:</h4>";

    if (filtrados.length === 0) {
        html += "<p>Nenhum produto cadastrado.</p>";
    } else {
        filtrados.forEach(p => {
            html += `
                <p>
                    • ${p.nome}
                    <button onclick="excluirProduto(${p.id}, ${fornecedorId})" class="del">
                        Remover
                    </button>
                </p>
            `;
        });
    }

    html += `
        <input id="novoProduto-${fornecedorId}" placeholder="Nome do produto">
        <button onclick="adicionarProduto(${fornecedorId})">Adicionar</button>
    `;

    div.innerHTML = html;
}

async function adicionarProduto(fornecedorId) {
    const campo = document.getElementById(`novoProduto-${fornecedorId}`);
    const nome = campo.value.trim();

    if (!nome) {
        alert("Digite o nome do produto!");
        return;
    }

    await fetch(`${API}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, fornecedorId })
    });

    mostrarProdutos(fornecedorId, { innerText: "" });
}
async function excluirProduto(produtoId, fornecedorId) {
    await fetch(`${API}/produtos/${produtoId}`, {
        method: "DELETE"
    });

    mostrarProdutos(fornecedorId, { innerText: "" });
}

async function excluirFornecedor(id) {
    await fetch(`${API}/fornecedores/${id}`, {
        method: "DELETE"
    });

    carregarFornecedores();
}
