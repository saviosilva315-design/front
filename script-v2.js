const API_URL = "https://meuback-ulyh.onrender.com";

/* ======================== MÁSCARA TELEFONE ======================== */

function aplicarMascaraTelefone(input) {
    let v = input.value.replace(/\D/g, "");

    if (v.length > 11) v = v.slice(0, 11);

    if (v.length >= 1) v = "(" + v;
    if (v.length >= 3) v = v.slice(0, 3) + ") " + v.slice(3);

    if (v.length >= 10) {
        if (v.length <= 14) {
            v = v.slice(0, 9) + v.slice(9, 13).replace(/(\d{4})(\d)/, "$1-$2");
        } else {
            v = v.slice(0, 10) + v.slice(10).replace(/(\d{5})(\d)/, "$1-$2");
        }
    }

    input.value = v;
}

/* ======================== CARREGAR PEDIDOS ======================== */

async function carregarPedidos() {
    const resposta = await fetch(`${API_URL}/pedidos`);
    const pedidos = await resposta.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    pedidos.forEach(pedido => {
        const item = document.createElement("li");
        item.className = "list-group-item";

        item.innerHTML = `
            <strong>${pedido.titulo}</strong><br>
            ${pedido.descricao}<br>
            <small>Produto ID: ${pedido.produtoId || "Nenhum"}</small><br>
            <small>Fornecedor ID: ${pedido.fornecedorId || "Nenhum"}</small>

            <button class="btn btn-danger btn-sm float-end" onclick="excluirPedido(${pedido.id})">
                Excluir
            </button>
        `;

        lista.appendChild(item);
    });
}

/* ======================== CRIAR PEDIDO ======================== */

async function criarPedido() {
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const produtoId = document.getElementById("selectProdutoPedido").value;
    const fornecedorId = document.getElementById("selectFornecedorPedido").value;

    await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            titulo,
            descricao,
            status: "aberto",
            produtoId,
            fornecedorId
        })
    });

    carregarPedidos();

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("selectProdutoPedido").value = "";
    document.getElementById("selectFornecedorPedido").innerHTML =
        '<option value="">Selecione um fornecedor</option>';
}

/* ======================== EXCLUIR PEDIDO ======================== */

async function excluirPedido(id) {
    await fetch(`${API_URL}/pedidos/${id}`, { method: "DELETE" });
    carregarPedidos();
}

/* ======================== CARREGAR FORNECEDORES ======================== */

async function carregarFornecedores() {
    const resposta = await fetch(`${API_URL}/fornecedores`);
    const fornecedores = await resposta.json();

    const lista = document.getElementById("listaFornecedores");
    lista.innerHTML = "";

    fornecedores.forEach(fornecedor => {
        const item = document.createElement("li");
        item.className = "list-group-item";

        item.innerHTML = `
            item.innerHTML = `
    <strong>${fornecedor.nome}</strong><br>
    <small>Contato: ${fornecedor.contato ? fornecedor.contato : "Não informado"}</small>
`;

            <button class="btn btn-danger btn-sm float-end ms-2" onclick="excluirFornecedor(${fornecedor.id})">
                Excluir
            </button>

            <div class="mt-3">
                <input id="produtoNome-${fornecedor.id}" class="form-control mb-2"
                    placeholder="Nome do produto">

                <button class="btn btn-secondary btn-sm" onclick="salvarProduto(${fornecedor.id})">
                    Adicionar Produto
                </button>

                <ul id="produtos-${fornecedor.id}" class="list-group mt-2"></ul>
            </div>
        `;

        lista.appendChild(item);

        carregarProdutosDoFornecedor(fornecedor.id);
    });
}

/* ======================== SALVAR FORNECEDOR ======================== */

async function salvarFornecedor() {
    const nome = document.getElementById("fornecedorNome").value;
    const contato = document.getElementById("fornecedorContato").value;

    await fetch(`${API_URL}/fornecedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, contato })
    });

    document.getElementById("fornecedorNome").value = "";
    document.getElementById("fornecedorContato").value = "";

    carregarFornecedores();
    carregarProdutosParaPedido();
}

/* ======================== EXCLUIR FORNECEDOR ======================== */

async function excluirFornecedor(id) {
    await fetch(`${API_URL}/fornecedores/${id}`, { method: "DELETE" });
    carregarFornecedores();
    carregarProdutosParaPedido();
}

/* ======================== PRODUTOS ======================== */

async function salvarProduto(fornecedorId) {
    const nome = document.getElementById(`produtoNome-${fornecedorId}`).value;

    await fetch(`${API_URL}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, fornecedorId })
    });

    document.getElementById(`produtoNome-${fornecedorId}`).value = "";

    carregarProdutosDoFornecedor(fornecedorId);
    carregarProdutosParaPedido();
}

async function carregarProdutosDoFornecedor(fornecedorId) {
    const resposta = await fetch(`${API_URL}/produtos`);
    const produtos = await resposta.json();

    const lista = document.getElementById(`produtos-${fornecedorId}`);
    lista.innerHTML = "";

    produtos
        .filter(p => p.fornecedorId == fornecedorId)
        .forEach(produto => {
            const item = document.createElement("li");
            item.className = "list-group-item";

            item.innerHTML = `
                ${produto.nome}
                <button class="btn btn-danger btn-sm float-end"
                    onclick="excluirProduto(${produto.id}, ${fornecedorId})">
                    Excluir
                </button>
            `;

            lista.appendChild(item);
        });
}

async function excluirProduto(id, fornecedorId) {
    await fetch(`${API_URL}/produtos/${id}`, { method: "DELETE" });
    carregarProdutosDoFornecedor(fornecedorId);
    carregarProdutosParaPedido();
}

/* ======================== PRODUTOS PARA PEDIDO ======================== */

async function carregarProdutosParaPedido() {
    const resposta = await fetch(`${API_URL}/produtos`);
    const produtos = await resposta.json();

    const select = document.getElementById("selectProdutoPedido");
    select.innerHTML = '<option value="">Selecione um produto</option>';

    produtos.forEach(produto => {
        const option = document.createElement("option");
        option.value = produto.id;
        option.textContent = produto.nome;
        select.appendChild(option);
    });
}

/* ======================== FILTRAR FORNECEDOR PELO PRODUTO ======================== */

document.getElementById("selectProdutoPedido").addEventListener("change", async function () {
    const produtoId = this.value;

    const resposta = await fetch(`${API_URL}/produtos`);
    const produtos = await resposta.json();

    const produto = produtos.find(p => p.id == produtoId);

    const fornecedorId = produto?.fornecedorId;

    const respostaFor = await fetch(`${API_URL}/fornecedores`);
    const fornecedores = await respostaFor.json();

    const selectFornecedor = document.getElementById("selectFornecedorPedido");
    selectFornecedor.innerHTML = "<option value=''>Selecione um fornecedor</option>";

    fornecedores.forEach(f => {
        if (f.id == fornecedorId) {
            const option = document.createElement("option");
            option.value = f.id;
            option.textContent = `${f.nome} (${f.contato || "sem contato"})`;
            selectFornecedor.appendChild(option);
        }
    });
});

/* ======================== EVENTO DE MÁSCARA ======================== */

document.getElementById("fornecedorContato").addEventListener("input", function () {
    aplicarMascaraTelefone(this);
});

/* ======================== INICIALIZAÇÃO ======================== */

carregarPedidos();
carregarFornecedores();
carregarProdutosParaPedido();

