const API = "https://meuback-ulyh.onrender.com";

// Buscar produto
async function buscar() {
    const termo = document.getElementById("campoBusca").value.trim();

    if (!termo) {
        alert("Digite algo para buscar!");
        return;
    }

    const resposta = await fetch(`${API}/produtos`);
    const produtos = await resposta.json();

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
        const div = document.createElement("div");
        div.className = "fornecedor-item";

        div.innerHTML = `
            <strong>${p.nome}</strong><br>
            Fornecedor ID: ${p.fornecedorid}<br><br>
        `;

        lista.appendChild(div);
    });
}
