document.addEventListener('DOMContentLoaded', function() {
    // Carregar itens do carrinho do localStorage
    const savedCart = localStorage.getItem('shoppingCart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const cartItemsContainer = document.getElementById('checkout-cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.querySelector('.cart-count');

    // Função para formatar preço
    function formatPrice(price) {
        return 'R$ ' + price.toFixed(2).replace('.', ',');
    }
    
    // Função para calcular o total do carrinho
    function calculateCartTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Atualizar a exibição do carrinho
    function updateCheckoutCart() {
        // Limpar itens atuais
        cartItemsContainer.innerHTML = '';
        
        // Adicionar cada item
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'checkout-cart-item';
            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <div class="item-price">${formatPrice(item.price)}</div>
                    <div class="item-quantity">Quantidade: ${item.quantity}</div>
                </div>
                <div class="item-total">${formatPrice(item.price * item.quantity)}</div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Atualizar totais
        const subtotal = calculateCartTotal();
        cartSubtotalElement.textContent = formatPrice(subtotal);
        cartTotalElement.textContent = formatPrice(subtotal); // Neste exemplo, não estamos calculando frete

        // Atualizar contador do carrinho no header
        updateCartCount();

    }
    
    // Dados de usuários fictícios (em um sistema real, isso viria de um backend)
    const users = [
        { email: 'kleber@teste.com', password: '123456', name: 'Kleber Teixeira' },
        { email: 'outro@cliente.com', password: 'musica123', name: 'Maria Souza' }
    ];
    
    
    // Adicione esta função para manter consistência com script.js
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }








    // Função para lidar com o login
    function handleLogin(email, password) {
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Login bem-sucedido
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            
            // Atualizar a UI
            updateLoginUI(true, user.name);
            
            // Mostrar mensagem de sucesso
            alert(`Bem-vindo de volta, ${user.name}!`);
            
            return true;
        } else {
            // Login falhou
            alert('E-mail ou senha incorretos. Por favor, tente novamente.');
            return false;
        }
    }
    
    // Função para atualizar a UI após login/logout
    function updateLoginUI(isLoggedIn, userName = '') {
        const loginForm = document.querySelector('.login-form');
        const loggedInSection = document.querySelector('.logged-in-section');
        const proceedButton = document.getElementById('proceed-to-address');
        
        if (isLoggedIn) {
            // Esconder formulário de login e mostrar mensagem de boas-vindas
            loginForm.style.display = 'none';
            
            // Criar ou atualizar seção de usuário logado
            let loggedInDiv = document.querySelector('.logged-in-section');
            if (!loggedInDiv) {
                loggedInDiv = document.createElement('div');
                loggedInDiv.className = 'logged-in-section';
                document.querySelector('.checkout-login').appendChild(loggedInDiv);
            }
            
            loggedInDiv.innerHTML = `
                <h3>Bem-vindo, ${userName}!</h3>
                <p>Você está logado e pode continuar sua compra.</p>
                <button id="logout-btn" class="btn btn-secondary">Sair</button>
            `;
            
            // Adicionar evento ao botão de logout
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
            
            // Habilitar botão de continuar
            proceedButton.disabled = false;
            proceedButton.textContent = 'Continuar para Endereço';
        } else {
            // Mostrar formulário de login e esconder mensagem de boas-vindas
            loginForm.style.display = 'block';
            
            // Remover seção de usuário logado se existir
            const loggedInDiv = document.querySelector('.logged-in-section');
            if (loggedInDiv) {
                loggedInDiv.remove();
            }
            
            // Desabilitar botão de continuar
            proceedButton.disabled = true;
            proceedButton.textContent = 'Faça login para continuar';
        }
    }
    
    // Função para lidar com logout
    function handleLogout() {
        localStorage.removeItem('loggedInUser');
        updateLoginUI(false);
        alert('Você saiu da sua conta.');
    }
    
    // Configurar formulário de login
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            
            handleLogin(email, password);
        });
    }
    
   
    // Verificar estado de login ao carregar a página
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        updateLoginUI(true, user.name);
    } else {
        updateLoginUI(false);
    }
    
    // Inicializar a página
    updateCheckoutCart();
    
    updateCartCount(); // Atualiza o contador ao carregar a página

    // Verificar se há hash #carrinho na URL e rolar até a seção
    if (window.location.hash === '#carrinho') {
        document.getElementById('carrinho').scrollIntoView();
    }









    // Botão "Continuar para Endereço"
    document.getElementById('proceed-to-address').addEventListener('click', function(e) {
        e.preventDefault();

        // Verifica se há itens no carrinho
        if (cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione produtos antes de continuar.');
            return;
        }

        // Verifica se o usuário está logado
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            alert('Por favor, faça login para continuar.');
            return;
        }

        // Oculta a seção do carrinho
        document.querySelector('.checkout-cart').style.display = 'none';
        document.querySelector('.checkout-login').style.display = 'none';

        // Mostra a seção de endereço
        document.getElementById('address-section').style.display = 'block';

        // Atualiza a barra de progresso
        document.getElementById('step-cart').classList.remove('active');
        document.getElementById('step-address').classList.add('active');

    });

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
        cepInput.classList.add('loading-cep');
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            if (data.erro) {
                mostrarErroCEP('CEP não encontrado');
                return;
            }
            
            // Preenche os campos com os dados da API
            document.getElementById('street').value = data.logradouro || '';
            document.getElementById('neighborhood').value = data.bairro || '';
            document.getElementById('city').value = data.localidade || '';
            document.getElementById('state').value = data.uf || '';
            
            // Foca no campo número após preencher
            document.getElementById('number').focus();
            
            // Esconde mensagem de erro se existir
            document.getElementById('cep-error').style.display = 'none';
            
        } catch (error) {
            mostrarErroCEP('Erro ao buscar CEP. Tente novamente.');
            console.error('Erro na busca do CEP:', error);
        } finally {
            cepInput.classList.remove('loading-cep');
        }
    }

    function mostrarErroCEP(mensagem) {
        const cepError = document.getElementById('cep-error');
        cepError.textContent = mensagem;
        cepError.style.display = 'block';
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

    // Função para calcular parcelas
    function calcularParcelas(total) {
        const select = document.getElementById('card-installments');
        select.innerHTML = '';
        
        // Limite de 12 parcelas ou valor mínimo de R$ 50,00 por parcela
        const maxParcelas = Math.min(12, Math.floor(total / 50));
        
        for (let i = 1; i <= maxParcelas; i++) {
            const valorParcela = total / i;
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}x de ${formatPrice(valorParcela)} ${i === 1 ? '' : 'sem juros'}`;
            select.appendChild(option);
        }
    }

    // Função para formatar número do cartão
    function formatarNumeroCartao(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        input.value = value.substring(0, 19);
    }

    // Função para formatar data de validade
    function formatarDataValidade(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value;
    }

    // Botão "Continuar para Pagamento"
    document.getElementById('proceed-to-payment').addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!validarEndereco()) {
            alert('Por favor, preencha todos os campos obrigatórios do endereço.');
            return;
        }
        
        // Oculta a seção de endereço
        document.getElementById('address-section').style.display = 'none';
        
        // Mostra a seção de pagamento
        document.getElementById('payment-section').style.display = 'block';
        
        // Atualiza a barra de progresso
        document.getElementById('step-address').classList.remove('active');
        document.getElementById('step-payment').classList.add('active');
        
        // Calcula as parcelas
        const total = calculateCartTotal();
        calcularParcelas(total);
        
        // Salva o endereço (simulação)
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
    });
    
    // Alternar entre métodos de pagamento
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('credit-card-form').style.display = 'none';
            document.getElementById('pix-form').style.display = 'none';
            document.getElementById('boleto-form').style.display = 'none';
            
            document.getElementById(`${this.value}-form`).style.display = 'block';
        });
    });
    
    // Formatação dos campos do cartão
    document.getElementById('card-number').addEventListener('input', function() {
        formatarNumeroCartao(this);
    });
    
    document.getElementById('card-expiry').addEventListener('input', function() {
        formatarDataValidade(this);
    });
    
    // Validação do formulário de pagamento
    document.querySelector('.payment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        let isValid = true;
        
        if (paymentMethod === 'credit-card') {
            const cardFields = ['card-number', 'card-name', 'card-expiry', 'card-cvv'];
            cardFields.forEach(field => {
                const element = document.getElementById(field);
                if (!element.value.trim()) {
                    element.style.borderColor = '#d32f2f';
                    isValid = false;
                } else {
                    element.style.borderColor = '#ddd';
                }
            });
            
            // Validação simples do número do cartão
            const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                document.getElementById('card-number').style.borderColor = '#d32f2f';
                isValid = false;
            }
        }
        
        if (!isValid) {
            alert('Por favor, preencha corretamente os dados do pagamento.');
            return;
        }
        
        // Processamento do pedido (simulação)
        processarPedido(paymentMethod);
    });



    // Evento do botão Finalizar Compra
    document.getElementById('finalize-purchase').addEventListener('click', function(e) {
        e.preventDefault();
        finalizarCompra();
    });






});

// Função para processar o pedido (simulação)
function processarPedido(paymentMethod) {
    const pedido = {
        id: Date.now().toString(),
        data: new Date().toISOString(),
        itens: JSON.parse(localStorage.getItem('shoppingCart')),
        endereco: JSON.parse(localStorage.getItem('enderecoEntrega')),
        pagamento: paymentMethod,
        total: calculateCartTotal()
    };
    
    // Simulação de processamento
    setTimeout(() => {
        // Limpa o carrinho
        localStorage.removeItem('shoppingCart');
        
        // Redireciona para página de confirmação
        window.location.href = `confirmacao.html?pedido=${pedido.id}`;
    }, 1500);
    
    // Mostra feedback visual
    const btn = document.getElementById('finalize-purchase');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
}










// Função para validar os dados do cartão de crédito
function validarCartaoCredito() {
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const cardName = document.getElementById('card-name').value.trim();
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv = document.getElementById('card-cvv').value.trim();

    // Validação básica - em produção, use uma biblioteca específica
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        alert('Número do cartão inválido');
        return false;
    }

    if (cardName.length < 3) {
        alert('Nome no cartão inválido');
        return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        alert('Data de validade inválida (MM/AA)');
        return false;
    }

    if (cardCvv.length < 3 || cardCvv.length > 4 || !/^\d+$/.test(cardCvv)) {
        alert('CVV inválido');
        return false;
    }

    return true;
}

// Função para simular o processamento do pagamento
async function processarPagamento(paymentMethod) {
    // Simula um delay de processamento
    return new Promise(resolve => {
        setTimeout(() => {
            // Em produção, aqui você faria uma chamada à API de pagamento
            const success = Math.random() > 0.1; // 90% de chance de sucesso para simulação
            resolve(success);
        }, 2000);
    });
}

// Função para finalizar a compra
async function finalizarCompra() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Validação específica para cada método de pagamento
    if (paymentMethod === 'credit-card' && !validarCartaoCredito()) {
        return;
    }

    // Mostra o overlay de carregamento
    document.getElementById('loading-overlay').style.display = 'flex';
    const finalizeBtn = document.getElementById('finalize-purchase');
    finalizeBtn.disabled = true;
    finalizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';

    try {
        // Processa o pagamento
        const pagamentoSucesso = await processarPagamento(paymentMethod);

        if (!pagamentoSucesso) {
            throw new Error('Pagamento não autorizado. Por favor, tente outro método de pagamento.');
        }

        // Cria o objeto do pedido
        const pedido = {
            id: 'PED' + Date.now().toString().slice(-8),
            data: new Date().toISOString(),
            cliente: JSON.parse(localStorage.getItem('loggedInUser')),
            itens: JSON.parse(localStorage.getItem('shoppingCart')),
            endereco: JSON.parse(localStorage.getItem('enderecoEntrega')),
            pagamento: paymentMethod,
            total: calculateCartTotal(),
            status: 'confirmado'
        };

        // Salva o pedido no histórico (simulação)
        const historicoPedidos = JSON.parse(localStorage.getItem('historicoPedidos') || '[]');
        historicoPedidos.push(pedido);
        localStorage.setItem('historicoPedidos', JSON.stringify(historicoPedidos));

        // Limpa o carrinho
        localStorage.removeItem('shoppingCart');
        updateCartCount();

        // Redireciona para a página de confirmação
        window.location.href = `confirmacao.html?pedido=${pedido.id}`;

    } catch (error) {
        alert(error.message);
    } finally {
        document.getElementById('loading-overlay').style.display = 'none';
        finalizeBtn.disabled = false;
        finalizeBtn.textContent = 'Finalizar Compra';
    }
}
