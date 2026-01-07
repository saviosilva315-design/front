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

        const produtosFornecedor = produtos.filter(p => p.fornecedorid === f.id);

        div.innerHTML = `
            <strong>${f.nome}</strong> – ${f.contato}
            <button class="del" onclick="removerFornecedor(${f.id})">Excluir fornecedor</button>

            <button onclick="toggleCatalogo(${f.id})">Importar catálogo</button>
            <div id="catalogoBox_${f.id}" style="display:none; margin-top:10px;">
                <textarea id="catalogoTexto_${f.id}" placeholder="Cole aqui o catálogo, um produto por linha..." 
                style="width:90%;height:120px;"></textarea>
                <br>
                <button onclick="importarCatalogo(${f.id})">Importar</button>
            </div>

            <h4 style="display:flex;align-items:center;gap:10px;margin-top:15px;">
                Produtos:
                <button onclick="toggleProdutos(${f.id})" id="toggleBtn_${f.id}">
                    Ocultar
                </button>
            </h4>

            <div class="produtos" id="produtosArea_${f.id}">
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

// Mostrar/ocultar área de produtos
function toggleProdutos(id) {
    const area = document.getElementById(`produtosArea_${id}`);
    const botao = document.getElementById(`toggleBtn_${id}`);

    if (area.style.display === "none") {
        area.style.display = "block";
        botao.textContent = "Ocultar";
    } else {
        area.style.display = "none";
        botao.textContent = "Mostrar";
    }
}

// Mostrar/ocultar caixa de catálogo
function toggleCatalogo(id) {
    const box = document.getElementById(`catalogoBox_${id}`);
    box.style.display = box.style.display === "none" ? "block" : "none";
}

// Importar catálogo
async function importarCatalogo(fornecedorId) {
    const textarea = document.getElementById(`catalogoTexto_${fornecedorId}`);
    const texto = textarea.value.trim();

    if (!texto) {
        alert("Cole algum texto para importar.");
        return;
    }

    const linhas = texto.split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

    const produtosResposta = await fetch(`${API}/produtos`);
    const produtosExistentes = await produtosResposta.json();

    const produtosFornecedorExistentes = produtosExistentes
        .filter(p => p.fornecedorid === fornecedorId)
        .map(p => p.nome.toLowerCase());

    let inseridos = 0;

    for (const nome of linhas) {
        if (!produtosFornecedorExistentes.includes(nome.toLowerCase())) {
            await fetch(`${API}/produtos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, fornecedorId })
            });
            inseridos++;
        }
    }

    alert(`Importação concluída. Produtos adicionados: ${inseridos}`);
    textarea.value = "";
    carregarTudo();
}

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

async function removerFornecedor(id) {
    if (!confirm("Deseja excluir este fornecedor e seus produtos?")) return;

    await fetch(`${API}/fornecedores/${id}`, { method: "DELETE" });

    carregarTudo();
}

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

async function removerProduto(id) {
    if (!confirm("Excluir este produto?")) return;

    await fetch(`${API}/produtos/${id}`, { method: "DELETE" });

    carregarTudo();
}

carregarTudo();
