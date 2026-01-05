const API = "https://meuback-ulyh.onrender.com";

async function buscar() {
    const termo = document.getElementById("busca").value.trim();
    const div = document.getElementById("resultados");

    if (!termo) {
        div.innerHTML = "<p>Digite o nome de um produto para buscar.</p>";
        return;
    }

    div.innerHTML = "Buscando...";

    // Buscar todos os produtos e fornecedores ao mesmo tempo
    const [respProdutos, respFor] = await Promise.all([
        fetch(`${API}/produtos`),
        fetch(`${API}/fornecedores`)
    ]);

    const produtos = await respProdutos.json();
    const fornecedores = await respFor.json();

    // Filtrar produtos que contenham o texto digitado
    const encontrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(termo.toLowerCase())
    );

    if (encontrados.length === 0) {
        div.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    let html = "";

    encontrados.forEach(prod => {
        // Encontrar o fornecedor do produto
        const fornecedor = fornecedores.find(f => f.id === prod.fornecedorId);

        html += `
            <div class="item">
                <h3>Produto: ${prod.nome}</h3>

                <p><strong>Fornecedor:</strong> ${fornecedor ? fornecedor.nome : "Não encontrado"}</p>
                <p><strong>Contato:</strong> ${fornecedor ? fornecedor.contato : "Não informado"}</p>
            </div>
            <hr>
        `;
    });

    div.innerHTML = html;
}
