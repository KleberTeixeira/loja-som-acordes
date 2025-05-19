// Elementos do DOM
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');

// Produtos
let featuredProducts = [];

// Carrinho de compras
let cart = [];

// Função para formatar preço
function formatPrice(price) {
    return 'R$ ' + price.toFixed(2).replace('.', ',');
}

// Função para atualizar o contador do carrinho
window.updateCartCount = function() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}


// Função para calcular o total do carrinho
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Função para atualizar o carrinho
function updateCart() {
    if (!cartItemsContainer) return; // Sai se o container não existir
    
    // Limpa o conteúdo atual
    cartItemsContainer.innerHTML = '';
    
    // Adiciona cada item do carrinho
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.dataset.id = item.id;
        
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="remove-item">Remover</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Atualiza o total apenas se o elemento existir
    if (cartTotalElement) {
        const total = calculateCartTotal();
        cartTotalElement.textContent = formatPrice(total);
    }            
    // Atualiza o contador
    updateCartCount();
}

// Função para mostrar notificação do carrinho
function showCartNotification(product, quantity = 1) {
    const notification = document.getElementById('cart-notification');
    const productContainer = document.getElementById('notification-product');
    
    // Preencher com os dados do produto
    productContainer.innerHTML = `
        <div class="notification-product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="notification-product-details">
            <div class="notification-product-name">${product.name}</div>
            <div class="notification-product-price">${formatPrice(product.price)}</div>
            <div>Quantidade: ${quantity}</div>
        </div>
    `;
    
    // Mostrar a notificação
    notification.style.display = 'block';
    
    // Esconder após 5 segundos
    setTimeout(() => {
        if (notification.style.display === 'block') {
            notification.style.display = 'none';
        }
    }, 5000);
}

// Função para adicionar item ao carrinho
function addToCart(productId, quantity = 1) {
    // Verifica se o produto já está no carrinho
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Incrementa a quantidade se já estiver no carrinho
        existingItem.quantity += quantity;
    } else {
        // Encontra o produto na lista de produtos
        const allProducts = [...featuredProducts];
        const productToAdd = allProducts.find(product => product.id === productId);
        
        if (productToAdd) {
            // Adiciona o produto ao carrinho com quantidade 1
            cart.push({
                id: productToAdd.id,
                name: productToAdd.name,
                price: productToAdd.price,
                image: productToAdd.image,
                quantity: quantity
            });
        }
    }
    
    // Atualiza o carrinho
    updateCart();
    
    // Mostra mensagem de sucesso
    const productName = cart.find(item => item.id === productId).name;
    //alert(`${productName} foi adicionado ao carrinho!`);

    // Mostrar notificação
    const allProducts = [...featuredProducts];
    const productToAdd = allProducts.find(p => p.id === productId);
    if (productToAdd) {
        showCartNotification(productToAdd, quantity);
    }

    saveCartToStorage();

}

// Função para remover item do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
}

// Função para alterar quantidade de um item
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        // Remove o item se a quantidade for menor que 1
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
        saveCartToStorage();
    }
    
}

// Função para carregar produtos do JSON
async function loadProducts() {
    try {
        const response = await fetch('produtos.json');
        if (!response.ok) {
            throw new Error('Falha ao carregar produtos');
        }
        const data = await response.json();
        featuredProducts = data.featuredProducts; // Armazena os produtos na variável global
        return data;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        featuredProducts = []; // Mantém vazio em caso de erro
        return {
            featuredProducts: []
        };
    }
}

// Função para renderizar produtos (atualizada)
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Limpa o container

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;

        let priceHTML = `
            <div class="product-price">${formatPrice(product.price)}</div>
        `;
        
        if (product.originalPrice) {
            priceHTML = `
                <div class="product-price">
                    <span class="original-price">${formatPrice(product.originalPrice)}</span>
                    ${formatPrice(product.price)}
                </div>
            `;
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                ${priceHTML}
                <div class="installment">${product.installments}</div>
                <div class="descricao">
                    <p>${product.description || ''}</p>
                </div>
                <button class="add-to-cart">Adicionar ao Carrinho</button>
            </div>
        `;

        container.appendChild(productCard);
        
        // Adiciona evento de clique no produto
        productCard.addEventListener('click', function(e) {
            // Impede o comportamento padrão do clique
            e.preventDefault();            
            if (!e.target.classList.contains('add-to-cart') && !e.target.closest('.add-to-cart')) {
                localStorage.setItem('selectedProduct', JSON.stringify(product));
                window.location.href = `produto.html?id=${product.id}`;
            }
        });
    });
}

// Renderizar produtos quando a página carregar
document.addEventListener('DOMContentLoaded', async function() {

    // Carrega produtos do JSON e armazena em featuredProducts
    await loadProducts();

    // Renderiza os produtos
    if (document.getElementById('featured-products')) {
        renderProducts(featuredProducts, 'featured-products');
    }

    // Adiciona evento de clique nas categorias
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProductsByCategory(category);
            
            // Atualiza a categoria ativa
            document.querySelectorAll('.category-card').forEach(c => {
                c.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Adicionar evento de clique nos botões "Adicionar ao Carrinho"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.id);
            addToCart(productId);
        }
        
        // Abrir/fechar carrinho
        if (e.target === cartIcon || e.target.closest('#cart-icon')) {
            cartModal.style.display = 'block';
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        
        if (e.target === closeCart || e.target === overlay) {
            cartModal.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Manipular quantidade no carrinho
        if (e.target.classList.contains('quantity-btn')) {
            const cartItem = e.target.closest('.cart-item');
            const productId = parseInt(cartItem.dataset.id);
            
            if (e.target.classList.contains('plus')) {
                changeQuantity(productId, 1);
            } else if (e.target.classList.contains('minus')) {
                changeQuantity(productId, -1);
            }
        }
        
        // Remover item do carrinho
        if (e.target.classList.contains('remove-item')) {
            const cartItem = e.target.closest('.cart-item');
            const productId = parseInt(cartItem.dataset.id);
            removeFromCart(productId);
        }

        if (e.target.classList.contains('checkout-btn')) {
            e.preventDefault();
            
            // Verificar se há itens no carrinho
            if (cart.length === 0) {
                alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
                return;
            }
            
            // Gerar um ID de sessão fictício (como no exemplo do Megasom)
            const sessionId = generateSessionId();
            
            // Redirecionar para a página de checkout com os parâmetros
            window.location.href = `checkout.html?session_id=${sessionId}&store_id=1139574#carrinho`;
        }

    });
    
    
    // Adicionar evento de submit no formulário de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            if (email.includes('@')) {
                alert(`Obrigado por assinar nossa newsletter! Um e-mail foi enviado para ${email}`);
                this.querySelector('input').value = '';
            } else {
                alert('Por favor, insira um e-mail válido.');
            }
        });
    }

    // Fechar notificação do carrinho (com verificação)
    const closeNotification = document.getElementById('close-notification');
    if (closeNotification) {
        closeNotification.addEventListener('click', function() {
            document.getElementById('cart-notification').style.display = 'none';
        });
    }
    
    // Ir para o carrinho (com verificação)
    const goToCartButton = document.querySelector('.go-to-cart');
    if (goToCartButton) {
        goToCartButton.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('cart-notification').style.display = 'none';
            document.getElementById('cart-modal').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        });
    }

});

function filterProductsByCategory(category) {
    const productsGrid = document.getElementById('featured-products');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = ''; // Limpa os produtos atuais
    
    if (category === 'all') {
        renderProducts(featuredProducts, 'featured-products');
    } else {
        const filteredProducts = featuredProducts.filter(product => product.category === category);
        renderProducts(filteredProducts, 'featured-products');
    }
}

// Função para salvar o carrinho no localStorage
window.saveCartToStorage = function() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCount(); // Atualiza o contador sempre que o carrinho é salvo
}

// Função para carregar o carrinho do localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Função para gerar um ID de sessão aleatório (simulando o comportamento do Megasom)
function generateSessionId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 20; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

loadCartFromStorage(); // Carregar o carrinho salvo ao iniciar        
