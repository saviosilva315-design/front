function criarPedido() {
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;

    fetch("https://meuback-ulyh.onrender.com/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao, status: "aberto" })
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById("titulo").value = "";
        document.getElementById("descricao").value = "";
        carregarPedidos();
    });
}

function carregarPedidos() {
    fetch("https://meuback-ulyh.onrender.com/pedidos")
        .then(res => res.json())
        .then(pedidos => {
            const div = document.getElementById("lista");
            div.innerHTML = "";
            pedidos.forEach(p => {
                div.innerHTML += `<p><strong>${p.titulo}</strong> - ${p.descricao}</p>`;
            });
        });
}

carregarPedidos();

function salvarFornecedor() {
    const nome = document.getElementById("fornecedorNome").value;

    fetch("https://meuback-ulyh.onrender.com/fornecedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById("msgFornecedor").innerText = "Fornecedor salvo!";
        document.getElementById("fornecedorNome").value = "";
        carregarFornecedores();
    });
}

function carregarFornecedores() {
    fetch("https://meuback-ulyh.onrender.com/fornecedores")
        .then(res => res.json())
        .then(lista => {
            const div = document.getElementById("listaFornecedores");
            div.innerHTML = "";
            lista.forEach(f => {
                div.innerHTML += `<p>${f.nome}</p>`;
            });
        });
}

carregarFornecedores();
    .then(() => {
        document.getElementById("msgFornecedor").innerText = "Fornecedor salvo!";
        document.getElementById("fornecedorNome").value = "";
    });
}