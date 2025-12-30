const API = "https://meuback-ulyh.onrender.com";

// ===================== CARREGAR FORNECEDORES =====================

function carregarFornecedores() {
    fetch(`${API}/fornecedores`)
        .then(res => res.json())
        .then(fornecedores => {
            const lista = document.getElementById("listaFornecedores");
            lista.innerHTML = "";

            fornecedores.forEach(f => {
                const div = document.createElement("div");
                div.className = "fornecedor";

                div.innerHTML = `
                    <strong>${f.nome}</strong><br>
                    Contato: ${f.contato}<br><br>

                    <button onclick="editarFornecedor(${f.id}, '${f.nome}', '${f.contato}')">Editar</button>
                    <button onclick="excluirFornecedor(${f.id})">Excluir</button>

                    <h4>Produtos:</h4>
                    <div id="produtos-${f.id}">Carregando...</div>

                    <input id="produtoNome-${f.id}" placeholder="Nome do produto">
                    <br>
                    <input id="produtoPreco-${f.id}" placeholder="Preço" type="number">
                    <br>
                    <button onclick="adicionarProduto(${f.id})">Adicionar Produto</button>
                `;

                lista.appendChild(div);

                carregarProdutos(f.id);
            });
        });
}

// ===================== ADICIONAR FORNECEDOR =====================

function adicionarFornecedor() {
    const nome = document.getElementById("nome").value;
    const contato = document.getElementById("contato").value;

    fetch(`${API}/fornecedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, contato })
    })
        .then(() => {
            carregarFornecedores();
            document.getElementById("nome").value = "";
            document.getElementById("contato").value = "";
        });
}

// ===================== EDITAR FORNECEDOR =====================

function editarFornecedor(id, nomeAtual, contatoAtual) {
    const nome = prompt("Novo nome:", nomeAtual);
    const contato = prompt("Novo contato:", contatoAtual);

    if (!nome || !contato) return;

    fetch(`${API}/fornecedores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, contato })
    })
        .then(() => {
            alert("Fornecedor atualizado!");
            carregarFornecedores();
        });
}

// ===================== EXCLUIR FORNECEDOR =====================

function excluirFornecedor(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    fetch(`${API}/fornecedores/${id}`, { method: "DELETE" })
        .then(() => carregarFornecedores());
}

// ===================== PRODUTOS =====================

function carregarProdutos(fornecedorId) {
    fetch(`${API}/produtos?fornecedorId=${fornecedorId}`)
        .then(res => res.json())
        .then(produtos => {
            const div = document.getElementById(`produtos-${fornecedorId}`);
            div.innerHTML = "";

            produtos.forEach(p => {
                const item = document.createElement("div");

                item.innerHTML = `
                    ${p.nome} - R$ ${p.preco}
                    <button onclick="editarProduto(${p.id}, '${p.nome}', ${p.preco}, ${fornecedorId})">Editar</button>
                    <button onclick="excluirProduto(${p.id}, ${fornecedorId})">Excluir</button>
                `;

                div.appendChild(item);
            });
        });
}

function adicionarProduto(fornecedorId) {
    const nome = document.getElementById(`produtoNome-${fornecedorId}`).value;
    const preco = Number(document.getElementById(`produtoPreco-${fornecedorId}`).value);

    fetch(`${API}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco, fornecedorId })
    })
        .then(() => {
            carregarProdutos(fornecedorId);
            document.getElementById(`produtoNome-${fornecedorId}`).value = "";
            document.getElementById(`produtoPreco-${fornecedorId}`).value = "";
        });
}

function editarProduto(id, nomeAtual, precoAtual, fornecedorId) {
    const nome = prompt("Novo nome:", nomeAtual);
    const preco = prompt("Novo preço:", precoAtual);

    if (!nome || !preco) return;

    fetch(`${API}/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome,
            preco: Number(preco),
            fornecedorId
        })
    })
        .then(() => {
            alert("Produto atualizado!");
            carregarProdutos(fornecedorId);
        });
}

function excluirProduto(id, fornecedorId) {
    fetch(`${API}/produtos/${id}`, { method: "DELETE" })
        .then(() => carregarProdutos(fornecedorId));
}

// ===================== INICIAR =====================

carregarFornecedores();
