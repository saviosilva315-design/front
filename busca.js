const API = "https://meuback-ulyh.onrender.com";
let fornecedoresEncontradosIds = [];

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

  // ✅ IDs únicos de fornecedores retornados
  fornecedoresEncontradosIds = [...new Set(filtrados.map(p => p.fornecedorid).filter(Boolean))];

  const lista = document.getElementById("resultadoBusca");
  lista.innerHTML = "";

  if (filtrados.length === 0) {
    lista.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  filtrados.forEach(p => {
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

async function enviarParaTodosResultados() {
  const text = document.getElementById("mensagemBusca").value.trim();

  if (!text) {
    alert("Digite a mensagem antes de enviar.");
    return;
  }

  if (!fornecedoresEncontradosIds.length) {
    alert("Faça uma busca primeiro para encontrar fornecedores.");
    return;
  }

  const resp = await fetch(`${API}/digisac/send-many`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fornecedorIds: fornecedoresEncontradosIds, text })
  });

  const json = await resp.json();
  if (!resp.ok || !json.ok) {
    alert(json.erro || "Falha no envio em lote.");
    return;
  }

  alert(`Envio concluído. Enviados: ${json.enviados} | Falharam: ${json.falharam}`);
}
