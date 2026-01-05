// ==============================
// CONFIGURAÇÃO DA API
// ==============================
const API = "https://SEU-BACKEND.onrender.com";

// ==============================
// FORMATAR TELEFONE
// ==============================
function formatPhone(value) {
    value = value.replace(/\D/g, '');

    if (value.length === 11) {
        return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    if (value.length === 10) {
        return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return value;
}

// ==============================
// RENDERIZAR CARDS DO BACKEND
// ==============================
async function renderSuppliers() {
    const cardsContainer = document.getElementById('supplier-cards');
    cardsContainer.innerHTML = "Carregando fornecedores...";

    try {
        const response = await fetch(`${API}/fornecedores`);
        const suppliers = await response.json();

        cardsContainer.innerHTML = "";

        suppliers.forEach(supplier => {
            const card = document.createElement('div');
            card.className = 'supplier-card';

            card.innerHTML = `
                <h3>${supplier.nome}</h3>
                <p>Contato: ${supplier.contact || "Não informado"}</p>
            `;

            cardsContainer.appendChild(card);
        });
    } catch (error) {
        cardsContainer.innerHTML = "Erro ao carregar fornecedores.";
        console.error("Erro ao carregar fornecedores:", error);
    }
}

// ==============================
// CRIAR FORNECEDOR VIA BACKEND
// ==============================
async function createSupplier(name, contact) {
    try {
        await fetch(`${API}/fornecedores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: name, contact })
        });

        renderSuppliers(); // atualiza a tela
    } catch (error) {
        console.error("Erro ao salvar fornecedor:", error);
    }
}

// ==============================
// EVENTOS DO FORMULÁRIO
// ==============================
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

        if (!name || !contact) {
            alert("Preencha nome e telefone!");
            return;
        }

        createSupplier(name, contact);
        form.reset();
    });
});
