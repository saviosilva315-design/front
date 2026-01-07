const API = "https://meuback-ulyh.onrender.com";

// Carregar tudo
async function carregarTudo() {
    const fornecedoresResposta = await fetch(`${API}/fornecedores`);
    const fornecedores = await fornecedoresResposta.json();

    const produtosResposta = await fetch(`${API}/produtos`);
    const produtos = await produtosResposta.json();

    const lista = document.getElementById("listaFornecedores");
    lista.innerHTML = "";

    fornecedores.forEach(f => {
        const div = document.createElement("div");
        div.className = "fornecedor-item";

        // produtos deste fornecedor
        const produtosFornecedor = produtos.filter(p => p.fornecedorid === f.id);

        div.innerHTML = `
            <strong>${f.nome}</strong> – ${f.contato}
            <button class="del" onclick="removerFornecedor(${f.id})">Excluir fornecedor</button>
            
            <div class="produtos">
                <h4>Produtos:</h4>
                <div id="produtos_${f.id}">
                    ${
                        produtosFornecedor.length === 0
                        ? "<p style='opacity:0.6'>Nenhum produto cadastrado.</p>"
                        : produtosFornecedor.map(p => 
                            `
                            <div>
                                • ${p.nome}  
                                <button class="del" onclick="removerProduto(${p.id})">Excluir</button>
                            </div>
                            `
                        ).join("")
                    }
                </div>

                <div style="margin-top:10px;">
                    <input id="produto_${f.id}" placeholder="Novo produto" style="width:200px;padding:6px;">
                    <button onclick="adicionarProduto(${f.id})">Adicionar produto</button>
                </div>
            </div>
        `;

        lista.appendChild(div);
    });
}

// Adicionar fornecedor
async function adicionarFornecedor() {
    const nome = document.getElementById("nome").value.trim();
    const contato = document.getElementById("contato").value.trim();

    if (!nome || !contato) {
        alert("Preencha os campos!");
        return;
    }

    await fetch(`${API}/fornecedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, contato })
    });

    document.getElementById("nome").value = "";
    document.getElementById("contato").value = "";

    carregarTudo();
}

// Remover fornecedor
async function removerFornecedor(id) {
    if (!confirm("Deseja excluir este fornecedor e seus produtos?")) return;

    await fetch(`${API}/fornecedores/${id}`, { method: "DELETE" });

    carregarTudo();
}

// Adicionar produto ao fornecedor
async function adicionarProduto(fornecedorId) {
    const campo = document.getElementById(`produto_${fornecedorId}`);
    const nomeProduto = campo.value.trim();

    if (!nomeProduto) {
        alert("Digite o nome do produto!");
        return;
    }

    await fetch(`${API}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeProduto, fornecedorId })
    });

    campo.value = "";
    carregarTudo();
}

// Remover produto
async function removerProduto(id) {
    if (!confirm("Excluir este produto?")) return;

    await fetch(`${API}/produtos/${id}`, { method: "DELETE" });

    carregarTudo();
}

carregarTudo();
