document.addEventListener('DOMContentLoaded', function() {
    // Carregar itens do carrinho do localStorage
    const savedCart = localStorage.getItem('shoppingCart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const cartCountElement = document.querySelector('.cart-count');

    // Função para formatar preço
    function formatPrice(price) {
        return 'R$ ' + price.toFixed(2).replace('.', ',');
    }
    
    // Função para calcular o total do carrinho
    function calculateCartTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Atualizar contador do carrinho
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }

    // Formata o CEP enquanto digita
    function formatarCEP(e) {
        var v = e.target.value.replace(/\D/g, "");
        v = v.replace(/^(\d{5})(\d)/, "$1-$2");
        e.target.value = v;
    }

    // Busca o endereço via API ViaCEP
    async function buscarCEP(cep) {
        cep = cep.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            mostrarErroCEP('CEP inválido. Digite 8 números.');
            return;
        }

        const cepInput = document.getElementById('cep');
        const searchBtn = document.getElementById('search-cep');
        const searchText = document.getElementById('search-cep-text');
        const searchSpinner = document.getElementById('search-cep-spinner');
        
        // Mostra o spinner e desabilita o botão
        searchText.style.display = 'none';
        searchSpinner.style.display = 'inline-block';
        searchBtn.disabled = true;
        cepInput.classList.add('loading-cep');
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.erro) {
                mostrarErroCEP('CEP não encontrado');
                return;
            }
            
            document.getElementById('street').value = data.logradouro || '';
            document.getElementById('neighborhood').value = data.bairro || '';
            document.getElementById('city').value = data.localidade || '';
            document.getElementById('state').value = data.uf || '';
            document.getElementById('number').focus();
            document.getElementById('cep-error').style.display = 'none';
            
        } catch (error) {
            console.error('Erro na busca do CEP:', error);
            
            let errorMessage = 'Erro ao buscar CEP. Tente novamente.';
            if (error.name === 'AbortError') {
                errorMessage = 'A requisição demorou muito. Verifique sua conexão e tente novamente.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Não foi possível conectar ao serviço de CEP. Verifique sua conexão.';
            }
            
            mostrarErroCEP(errorMessage);
        } finally {
            // Restaura o botão e remove o spinner
            searchText.style.display = 'inline-block';
            searchSpinner.style.display = 'none';
            searchBtn.disabled = false;
            cepInput.classList.remove('loading-cep');
        }
    }
    
    function mostrarErroCEP(mensagem) {
        const cepError = document.getElementById('cep-error');
        cepError.textContent = mensagem;
        cepError.style.display = 'block';
    }

    // Função para validar o formulário de endereço
    function validarEndereco() {
        const requiredFields = ['street', 'number', 'neighborhood', 'city', 'state'];
        let isValid = true;

        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                element.style.borderColor = '#d32f2f';
                isValid = false;
            } else {
                element.style.borderColor = '#ddd';
            }
        });

        return isValid;
    }

    // Busca CEP quando clicar no botão
    document.getElementById('search-cep').addEventListener('click', function() {
        const cep = document.getElementById('cep').value;
        buscarCEP(cep);
    });
    
    // Busca CEP ao pressionar Enter no campo
    document.getElementById('cep').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscarCEP(this.value);
        }
    });

    // Botão "Continuar para Pagamento"
    document.getElementById('address-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarEndereco()) {
            alert('Por favor, preencha todos os campos obrigatórios do endereço.');
            return;
        }
        
        // Salva o endereço no localStorage
        const endereco = {
            cep: document.getElementById('cep').value,
            rua: document.getElementById('street').value,
            numero: document.getElementById('number').value,
            complemento: document.getElementById('complement').value,
            bairro: document.getElementById('neighborhood').value,
            cidade: document.getElementById('city').value,
            estado: document.getElementById('state').value,
            referencia: document.getElementById('reference').value
        };
        localStorage.setItem('enderecoEntrega', JSON.stringify(endereco));
        
        // Redireciona para a página de pagamento
        window.location.href = 'pagamento.html';
    });

    // Verificar estado de login ao carregar a página
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'checkout.html';
    }

    // Atualizar contador do carrinho ao carregar a página
    updateCartCount();
});