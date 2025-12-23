// fornecedores.js - Arquivo completo para gerenciamento de fornecedores

// Dados mock
let fornecedores = [
    {
        id: 1,
        nome: 'Fornecedor A',
        telefone: '(11) 99999-9999',
        produtos: [
            { id: 1, nome: 'Produto 1', preco: 10.00 },
            { id: 2, nome: 'Produto 2', preco: 20.00 }
        ]
    },
    {
        id: 2,
        nome: 'Fornecedor B',
        telefone: '(21) 88888-8888',
        produtos: [
            { id: 3, nome: 'Produto 3', preco: 15.00 }
        ]
    }
];

let proximoIdFornecedor = 3;
let proximoIdProduto = 4;

// Máscara de telefone
function aplicarMascaraTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{5})(\d{4})$/, '$1-$2');
    return telefone;
}

// Renderizar fornecedores
function renderizarFornecedores() {
    const container = document.getElementById('suppliers-container');
    container.innerHTML = '';

    fornecedores.forEach(fornecedor => {
        const card = document.createElement('div');
        card.className = 'supplier-card';

        card.innerHTML = `
            <h3>${fornecedor.nome}</h3>
            <p>Telefone: ${fornecedor.telefone}</p>

            <div class="products-area">
                <h4>Produtos:</h4>
                <div class="products-list" id="products-${fornecedor.id}"></div>

                <form class="add-product-form" id="form-${fornecedor.id}">
                    <input type="text" placeholder="Nome do produto" id="nome-produto-${fornecedor.id}" required>
                    <input type="number" step="0.01" placeholder="Preço" id="preco-produto-${fornecedor.id}" required>
                    <button type="submit">Adicionar Produto</button>
                </form>
            </div>
        `;

        container.appendChild(card);

        renderizarProdutos(fornecedor.id);

        document.getElementById(`form-${fornecedor.id}`).addEventListener('submit', e => {
            e.preventDefault();
            adicionarProduto(fornecedor.id);
        });
    });
}

// Renderizar produtos de um fornecedor
function renderizarProdutos(fornecedorId) {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    const lista = document.getElementById(`products-${fornecedorId}`);

    lista.innerHTML = '';

    fornecedor.produtos.forEach(produto => {
        const miniCard = document.createElement('div');
        miniCard.className = 'product-mini-card';

        miniCard.innerHTML = `
            <span>${produto.nome} - R$ ${produto.preco.toFixed(2)}</span>
            <button onclick="deletarProduto(${fornecedorId}, ${produto.id})">Deletar</button>
        `;

        lista.appendChild(miniCard);
    });
}

// Criar produto
function adicionarProduto(fornecedorId) {
    const nomeInput = document.getElementById(`nome-produto-${fornecedorId}`);
    const precoInput = document.getElementById(`preco-produto-${fornecedorId}`);

    const nome = nomeInput.value.trim();
    const preco = parseFloat(precoInput.value);

    if (nome && !isNaN(preco)) {
        const fornecedor = fornecedores.find(f => f.id === fornecedorId);

        fornecedor.produtos.push({
            id: proximoIdProduto++,
            nome,
            preco
        });

        nomeInput.value = '';
        precoInput.value = '';

        renderizarProdutos(fornecedorId);
    }
}

// Excluir produto
function deletarProduto(fornecedorId, produtoId) {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    fornecedor.produtos = fornecedor.produtos.filter(p => p.id !== produtoId);

    renderizarProdutos(fornecedorId);
}

// Criar fornecedor
function criarFornecedor() {
    const nomeInput = document.getElementById('supplier-name');
    const telefoneInput = document.getElementById('supplier-phone');

    const nome = nomeInput.value.trim();
    const telefone = aplicarMascaraTelefone(telefoneInput.value);

    if (nome && telefone) {
        fornecedores.push({
            id: proximoIdFornecedor++,
            nome,
            telefone,
            produtos: []
        });

        nomeInput.value = '';
        telefoneInput.value = '';

        renderizarFornecedores();
    }
}

// Eventos iniciais
document.addEventListener('DOMContentLoaded', () => {
    renderizarFornecedores();

    document.getElementById('create-supplier-form').addEventListener('submit', e => {
        e.preventDefault();
        criarFornecedor();
    });

    document.getElementById('supplier-phone').addEventListener('input', e => {
        e.target.value = aplicarMascaraTelefone(e.target.value);
    });
});
