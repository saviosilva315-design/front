const API = "https://meuback-ulyh.onrender.com";

// Carregar fornecedores ao abrir a página
async function carregarFornecedores() {
    const resposta = await fetch(`${API}/fornecedores`);
    const fornecedores = await resposta.json();

    const lista = document.getElementById("listaFornecedores");
    lista.innerHTML = "";

    fornecedores.forEach(f => {
        const div = document.createElement("div");
        div.className = "fornecedor-item";

        div.innerHTML = `
            <strong>${f.nome}</strong> – ${f.contato}
            <button onclick="removerFornecedor(${f.id})">Excluir</button>
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

    carregarFornecedores();
}

// Remover fornecedor
async function removerFornecedor(id) {
    if (!confirm("Deseja excluir este fornecedor?")) return;

    await fetch(`${API}/fornecedores/${id}`, { method: "DELETE" });

    carregarFornecedores();
}

carregarFornecedores();
