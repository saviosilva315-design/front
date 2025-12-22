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

document.getElementById("fornecedorContato").addEventListener("input", function () {
    aplicarMascaraTelefone(this);
});

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
            <strong>Pedido ${pedido.id}</strong><br>
            Produto: ${pedido.produtoId}<br>
            Fornecedor: ${pedido.fornecedorId}
            <button class="btn btn-danger btn-sm float-end" onclick="excluirPedido(${pedido.id})">Excluir</button>
        `;
        lista.appendChild(item);
    });
}

/* ======================== CRIAR PEDIDO ======================== */

async function criarPedido() {
    const produtoId = document.getElementById("selectProdutoPedido").value;
    const fornecedorId = document.getElementById("selectFornecedorPedido").value;

    if (!produtoId || !fornecedorId) {
        alert("Selecione produto e fornecedor.");
        return;
    }

    await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produtoId, fornecedorId })
    });

    carregarPedidos();
}

/* ======================== EXCLUIR PEDIDO ======================== */

async function excluirPedido(id) {
    await fetch(`${API_URL}/pedidos/${id}`, { method: "DELETE" });
    carregarPedidos();
}

/* ======================== SALVAR FORNECEDOR ======================== */

async function salvarFornecedor() {
    const nome = document.getElementById("fornecedorNome").value;
    const contato = document.getElementById("fornecedorContato").value;

    if (!nome || !contato) {
        alert("Preencha nome e contato.");
        return;
    }

    await fetch(`${API_URL}/fornecedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, contato })
    });

    document.getElementById("fornecedorNome").value = "";
    document.getElementById("fornecedorContato").value = "";

    carregarFornecedores();
    carregarProdutos();
}

/* ======================== CARREGAR FORNECEDORES ======================== */

async function carregarFornecedores() {
    const resposta = await fetch(`${API_URL}/fornecedores`);
    const fornecedores = await resposta.json();

    const lista = document.getElementById("listaFornecedores");
    lista.innerHTML = "";

    const select = document.getElementById("selectFornecedorPedido");
    select.innerHTML = '<option value="">Selecione um fornecedor</option>';

    fornecedores.forEach(f => {
        const item = document.createElement("li");
        item.className = "list-group-item";

        item.innerHTML = `
            <strong>${f.nome}</strong><br>
            <small>Contato: ${f.contato || "Não informado"}</small>
        `;

        lista.appendChild(item);

        const option = document.createElement("option");
        option.value = f.id;
        option.textContent = f.nome;
        select.appendChild(option);
    });
}

/* ======================== SALVAR PRODUTO ======================== */

async function salvarProduto(fornecedorId) {
    const nome = document.getElementById(`produtoNome-${fornecedorId}`).value;

    if (!nome) return;

    await fetch(`${API_URL}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, fornecedorId })
    });

    document.getElementById(`produtoNome-${fornecedorId}`).value = "";

    carregarProdutos();
    carregarFornecedores();
}

/* ======================== CARREGAR PRODUTOS PARA SELECT ======================== */

async function carregarProdutos() {
    const resposta = await fetch(`${API_URL}/produtos`);
    const produtos = await resposta.json();

    const select = document.getElementById("selectProdutoPedido");
    select.innerHTML = '<option value="">Selecione um produto</option>';

    produtos.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.nome;
        option.dataset.fornecedor = p.fornecedorId;
        select.appendChild(option);
    });
}

/* ======================== AO SELECIONAR PRODUTO, CARREGA FORNECEDOR ======================== */

document.getElementById("selectProdutoPedido").addEventListener("change", function () {
    const produtoId = this.value;
    const opt = this.querySelector(`option[value='${produtoId}']`);

    if (!opt) return;

    const fornecedorId = opt.dataset.fornecedor;
    document.getElementById("selectFornecedorPedido").value = fornecedorId;
});

/* ======================== INICIALIZAÇÃO ======================== */

carregarFornecedores();
carregarProdutos();
carregarPedidos();
