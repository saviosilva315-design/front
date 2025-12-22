let suppliers = [
    { name: 'Fornecedor A', contact: '(11) 99999-9999' },
    { name: 'Fornecedor B', contact: '(21) 88888-8888' }
];

function formatPhone(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
}

function renderSuppliers() {
    const cardsContainer = document.getElementById('supplier-cards');
    cardsContainer.innerHTML = '';

    suppliers.forEach(supplier => {
        const card = document.createElement('div');
        card.className = 'supplier-card';
        card.innerHTML = `
            <h3>${supplier.name}</h3>
            <p>Contato: ${supplier.contact}</p>
        `;
        cardsContainer.appendChild(card);
    });
}

function createSupplier(name, contact) {
    suppliers.push({ name, contact });
    renderSuppliers();
}

document.addEventListener('DOMContentLoaded', () => {
    renderSuppliers();

    const form = document.getElementById('supplier-form');
    const contactInput = document.getElementById('supplier-contact');

    contactInput.addEventListener('input', (e) => {
        e.target.value = formatPhone(e.target.value);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('supplier-name').value.trim();
        const contact = contactInput.value.trim();

        if (name && contact) {
            createSupplier(name, contact);
            form.reset();
        }
    });
});
function addProductToSupplier(supplierId, productName, productPrice) {
    const supplierProductsDiv = document.getElementById(`supplier-products-${supplierId}`);
    const productCard = document.createElement('div');
    productCard.className = 'product-mini-card';
    productCard.innerHTML = `
        <h4>${productName}</h4>
        <p>R$ ${productPrice}</p>
        <button onclick="deleteProduct(this)">Excluir</button>
    `;
    supplierProductsDiv.appendChild(productCard);
}

function deleteProduct(button) {
    const productCard = button.parentElement;
    productCard.remove();
}
