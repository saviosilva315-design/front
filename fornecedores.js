const API = "https://meuback-ulyh.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    carregarFornecedores();
});
async function adicionarFornecedor() {
    const nome = document.getElementById("nome").value.trim();
    const contato = document.getElementById("contato").value.trim();

    if (!nome || !contato) {
        alert("Preencha nome e contato!");
        return;
    }

    await fetch(`${API}/fornecedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, contato })
    });

    carregarFornecedores();
}
async function carregarFornecedores() {
    const lista = document.getElementById("listaFornecedores");
    lista.innerHTML = "Carregando fornecedores...";

    const resp = await fetch(`${API}/fornecedores`);
    const fornecedores = await resp.json();

    lista.innerHTML = "";
        fornecedores.forEach(f => {
        const div = document.createElement("div");
        div.className = "fornecedor";

        div.innerHTML = `
            <h3>${f.nome}</h3>
            <p>Contato: ${f.contato}</p>
            <button onclick="mostrarProdutos(${f.id}, this)">Ver produtos</button>
            <div id="produtos-${f.id}" style="margin-top:10px;"></div>
        `;

        lista.appendChild(div);
    });
}
async function mostrarProdutos(fornecedorId, botao) {
    const div = document.getElementById(`produtos-${fornecedorId}`);

    if (div.innerHTML.trim() !== "") {
        div.innerHTML = "";
        botao.innerText = "Ver produtos";
        return;
    }

    botao.innerText = "Esconder produtos";

    const resp = await fetch(`${API}/fornecedores/${fornecedorId}/produtos`);
    const produtos = await resp.json();
        let html = "<h4>Produtos deste fornecedor:</h4>";

    if (produtos.length === 0) {
        html += "<p>Nenhum produto vinculado.</p>";
    } else {
        produtos.forEach(p => {
            html += `
                <p>
                    • ${p.nome}
                    <button onclick="desvincularProduto(${fornecedorId}, ${p.id})">
                        Remover
                    </button>
                </p>
            `;
        });
    }
        html += `
        <input id="novoProduto-${fornecedorId}" 
               placeholder="Nome do produto">
        <button onclick="vincularProduto(${fornecedorId})">
            Adicionar produto
        </button>
    `;

    div.innerHTML = html;
}
async function vincularProduto(fornecedorId) {
    const campo = document.getElementById(`novoProduto-${fornecedorId}`);
    const nome = campo.value.trim();

    if (!nome) return alert("Digite um nome!");

    const resp = await fetch(`${API}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
    });

    const produto = await resp.json();

    await fetch(`${API}/fornecedores/${fornecedorId}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produtoId: produto.id })
    });

    mostrarProdutos(fornecedorId, { innerText: "" });
}
async function desvincularProduto(fornecedorId, produtoId) {
    await fetch(`${API}/fornecedores/${fornecedorId}/produtos/${produtoId}`, {
        method: "DELETE"
    });

    mostrarProdutos(fornecedorId, { innerText: "" });
}
