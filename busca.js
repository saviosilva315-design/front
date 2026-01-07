const API = "https://meuback-ulyh.onrender.com";

async function buscar() {
    const termo = document.getElementById("campoBusca").value.trim();

    if (!termo) {
        alert("Digite algo para buscar!");
        return;
    }

    // Buscar produtos
    const respostaProdutos = await fetch(`${API}/produtos`);
    const produtos = await respostaProdutos.json();

    // Buscar fornecedores
    const respostaFornecedores = await fetch(`${API}/fornecedores`);
    const fornecedores = await respostaFornecedores.json();

    const filtrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(termo.toLowerCase())
    );

    const lista = document.getElementById("resultadoBusca");
    lista.innerHTML = "";

    if (filtrados.length === 0) {
        lista.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    filtrados.forEach(p => {

        // Encontrar o fornecedor do produto
        const fornecedor = fornecedores.find(f => f.id === p.fornecedorid);

        const div = document.createElement("div");
        div.className = "fornecedor-item";

        div.innerHTML = `
            <strong>${p.nome}</strong><br>
            Fornecedor: ${fornecedor ? fornecedor.nome : "Desconhecido"}<br>
            Contato: ${fornecedor ? fornecedor.contato : "Não informado"}<br><br>
        `;

        lista.appendChild(div);
    });
}
