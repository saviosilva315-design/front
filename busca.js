const API = "https://meuback-ulyh.onrender.com";

async function buscar() {
    const termo = document.getElementById("busca").value.trim();
    const div = document.getElementById("resultados");

    if (!termo) {
        div.innerHTML = "<p>Digite algo para buscar.</p>";
        return;
    }

    div.innerHTML = "Buscando...";

    // Puxa todos os produtos
    const respProdutos = await fetch(`${API}/produtos`);
    const produtos = await respProdutos.json();

    // Filtra produtos pelo nome digitado
    const encontrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(termo.toLowerCase())
    );

    if (encontrados.length === 0) {
        div.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    // Puxa fornecedores
    const respFor = await fetch(`${API}/fornecedores`);
    const fornecedores = await respFor.json();

    let html = "";

    encontrados.forEach(prod => {
        const fornecedor = fornecedores.find(f => f.id === prod.fornecedorId);
        
        html += `
            <div class="item">
                <h3>${prod.nome}</h3>
                <p>Fornecedor: <strong>${fornecedor?.nome || "Desconhecido"}</strong></p>
            </div>
            <hr>
        `;
    });

    div.innerHTML = html;
}
