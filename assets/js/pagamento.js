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
    document.getElementById('payment-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        let isValid = true;
        
        if (paymentMethod === 'credit-card') {
            isValid = validarCartaoCredito();
        }
        
        if (!isValid) {
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
            const finalizeBtn = document.getElementById('finalize-purchase');
            finalizeBtn.disabled = false;
            finalizeBtn.textContent = 'Finalizar Compra';
        }
    });

    // Verificar estado de login ao carregar a página
    const loggedInUser = localStorage.getItem('loggedInUser');
    const endereco = localStorage.getItem('enderecoEntrega');
    
    if (!loggedInUser || !endereco) {
        window.location.href = 'checkout.html';
    }

    // Calcular parcelas ao carregar a página
    const total = calculateCartTotal();
    calcularParcelas(total);

    // Atualizar contador do carrinho ao carregar a página
    updateCartCount();
});