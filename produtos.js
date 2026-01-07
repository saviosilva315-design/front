const API = "https://meuback-ulyh.onrender.com";

// Carregar fornecedores no select
async function carregarFornecedores() {
    const resposta = await fetch(`${API}/fornecedores`);
    const fornecedores = await resposta.json();

    const select = document.getElementById("fornecedorSelect");
    select.innerHTML = '<option value="">Selecione o fornecedor</option>';

    fornecedores.forEach(f => {
        const option = document.createElement("option");
        option.value = f.id;
        option.textContent = f.nome;
        select.appendChild(option);
    });
}

// Carregar lista de produtos
async function carregarProdutos() {
    const resposta = await fetch(`${API}/produtos`);
    const produtos = await resposta.json();

    const lista = document.getElementById("listaProdutos");
    lista.innerHTML = "";

    produtos.forEach(p => {
        const div = document.createElement("div");
        div.className = "fornecedor-item";

        div.innerHTML = `
            <strong>${p.nome}</strong><br>
            Fornecedor ID: ${p.fornecedorid}
            <br>
            <button class="del" onclick="removerProduto(${p.id})">Excluir</button>
        `;

        lista.appendChild(div);
    });
}

// Adicionar produto
async function adicionarProduto() {
    const nome = document.getElementById("nomeProduto").value.trim();
    const fornecedorId = document.getElementById("fornecedorSelect").value;

    if (!nome || !fornecedorId) {
        alert("Preencha os campos!");
        return;
    }

    await fetch(`${API}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, fornecedorId })
    });

    document.getElementById("nomeProduto").value = "";
    document.getElementById("fornecedorSelect").value = "";

    carregarProdutos();
}

// Remover produto
async function removerProduto(id) {
    if (!confirm("Deseja excluir este produto?")) return;

    await fetch(`${API}/produtos/${id}`, { method: "DELETE" });

    carregarProdutos();
}

// Carregar tudo ao abrir
carregarFornecedores();
carregarProdutos();
