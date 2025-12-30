const API = "https://meuback-ulyh.onrender.com";

// ===============================
// CARREGAR FORNECEDORES
// ===============================

function carregarFornecedores() {
    fetch(API + "/fornecedores")
        .then(res => res.json())
        .then(data => {
            renderizarFornecedores(data);
        })
        .catch(err => console.error("Erro ao carregar fornecedores:", err));
}

// ===============================
// RENDERIZAR FORNECEDORES
// ===============================

function renderizarFornecedores(fornecedores) {
    const lista = document.getElementById("listaFornecedores");
    lista.innerHTML = "";

    fornecedores.forEach(f => {
        const div = document.createElement("div");
        div.className = "fornecedor";

        div.innerHTML = `
            <strong>${f.nome}</strong><br>
            Contato: ${f.contato}<br><br>

            <button onclick="deletarFornecedor(${f.id})">Excluir</button>

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
}

// ===============================
// CARREGAR PRODUTOS
// ===============================

function carregarProdutos(fornecedorId) {
    fetch(API + `/produtos?fornecedorId=${fornecedorId}`)
        .then(res => res.json())
        .then(produtos => {
            const div = document.getElementById(`produtos-${fornecedorId}`);
            div.innerHTML = "";

            if (produtos.length === 0) {
                div.innerHTML = "Nenhum produto cadastrado.";
                return;
            }

            produtos.forEach(p => {
                const item = document.createElement("div");

                const preco = p.preco ? p.preco.toFixed(2) : "0.00";

                item.innerHTML = `
                    ${p.nome} - R$ ${preco}
                    <button onclick="deletarProduto(${p.id}, ${fornecedorId})">X</button>
                `;

                div.appendChild(item);
            });
        });
}

// ===============================
// ADICIONAR PRODUTO
// ===============================

function adicionarProduto(fornecedorId) {
    const nome = document.getElementById(`produtoNome-${fornecedorId}`).value;
    const preco = Number(document.getElementById(`produtoPreco-${fornecedorId}`).value);

    fetch(API + "/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome,
            preco,
            fornecedorId
        })
    })
        .then(() => carregarProdutos(fornecedorId));
}

// ===============================
// EXCLUIR PRODUTO
// ===============================

function deletarProduto(id, fornecedorId) {
    fetch(API + `/produtos/${id}`, {
        method: "DELETE"
    })
        .then(() => carregarProdutos(fornecedorId));
}

// ===============================
// ADICIONAR FORNECEDOR
// ===============================

function adicionarFornecedor() {
    const nome = document.getElementById("nome").value;
    const contato = document.getElementById("contato").value;

    fetch(API + "/fornecedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, contato })
    })
        .then(() => carregarFornecedores());
}

// ===============================
// EXCLUIR FORNECEDOR
// ===============================

function deletarFornecedor(id) {
    fetch(API + `/fornecedores/${id}`, { method: "DELETE" })
        .then(() => carregarFornecedores());
}

// ===============================
// BUSCAR MELHOR PREÇO
// ===============================

function buscarMelhorPreco() {
    const termo = document.getElementById("pesquisa").value.trim().toLowerCase();
    const box = document.getElementById("resultadoBusca");

    if (!termo) {
        box.innerHTML = "Digite o nome de um produto.";
        return;
    }

    fetch(API + "/produtos")
        .then(res => res.json())
        .then(todosProdutos => {
            const filtrados = todosProdutos.filter(p =>
                p.nome.toLowerCase().includes(termo)
            );

            if (filtrados.length === 0) {
                box.innerHTML = "Nenhum produto encontrado.";
                return;
            }

            // menor preço
            const melhor = filtrados.reduce((a, b) =>
                a.preco < b.preco ? a : b
            );

            fetch(API + "/fornecedores")
                .then(res => res.json())
                .then(fornecedores => {
                    const fornecedor = fornecedores.find(f => f.id === melhor.fornecedorId);

                    if (!fornecedor) {
                        box.innerHTML = "Fornecedor não encontrado.";
                        return;
                    }

                    box.innerHTML = `
                        Melhor preço encontrado:<br>
                        Produto: <strong>${melhor.nome}</strong><br>
                        Preço: <strong>R$ ${melhor.preco.toFixed(2)}</strong><br>
                        Fornecedor: <strong>${fornecedor.nome}</strong>
                    `;
                });
        });
}

// ===============================
// INICIAR
// ===============================

carregarFornecedores();
