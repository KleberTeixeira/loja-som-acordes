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
    
    // Função para atualizar o contador do carrinho
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

        // Redireciona para a página de endereço
        window.location.href = 'endereco.html';
    });
});