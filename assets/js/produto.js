
// Função para carregar os dados do produto
function loadProductDetails() {
    // Obter o ID do produto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // Encontrar o produto na lista
    const allProducts = [...featuredProducts, ...discountProducts];
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
        // Preencher os dados do produto
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-id').textContent = product.id;
        document.getElementById('product-price').textContent = formatPrice(product.price);
        document.getElementById('product-installments').textContent = product.installments;
        document.getElementById('product-description').innerHTML = `<p>${product.descricao}</p>`;
        
        // Configurar imagens
        const mainImage = document.getElementById('main-product-image');
        mainImage.src = product.image;
        mainImage.alt = product.name;
        
        // Adicionar thumbnails (usando a mesma imagem como exemplo)
        const thumbnailsContainer = document.getElementById('thumbnails');
        thumbnailsContainer.innerHTML = `
            <div class="thumbnail active" data-image="${product.image}">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="thumbnail" data-image="${product.image}">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="thumbnail" data-image="${product.image}">
                <img src="${product.image}" alt="${product.name}">
            </div>
        `;
        
        // Adicionar especificações técnicas fictícias
        const specsList = document.getElementById('product-specs');
        specsList.innerHTML = `
            <li><strong>Marca:</strong> ${product.name.split(' ')[0]}</li>
            <li><strong>Modelo:</strong> ${product.name}</li>
            <li><strong>Cor:</strong> Preto</li>
            <li><strong>Material:</strong> Madeira/Metal</li>
            <li><strong>Garantia:</strong> 12 meses</li>
        `;
        
        // Configurar botão de adicionar ao carrinho
        document.getElementById('add-to-cart').addEventListener('click', function() {
            addToCart(product.id);
            showCartNotification(product);
        });
    } else {
        // Produto não encontrado - redirecionar para home
        window.location.href = 'index.html';
    }
}

// Função para formatar preço
function formatPrice(price) {
    return 'R$ ' + price.toFixed(2).replace('.', ',');
}

// Função para mostrar notificação
function showCartNotification(product) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="cart-notification-header">
            <h3>Produto adicionado ao carrinho</h3>
            <button class="close-notification">&times;</button>
        </div>
        <div class="cart-notification-body">
            <div class="notification-message">
                <i class="fas fa-check-circle"></i> Item adicionado com sucesso!
            </div>
            <div class="notification-product">
                <div class="notification-product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="notification-product-details">
                    <div class="notification-product-name">${product.name}</div>
                    <div class="notification-product-price">${formatPrice(product.price)}</div>
                    <div>Quantidade: 1</div>
                </div>
            </div>
            <div class="cart-notification-actions">
                <a href="index.html" class="cart-notification-btn continue-shopping">Continuar comprando</a>
                <a href="carrinho.html" class="cart-notification-btn go-to-cart">Ir para o carrinho</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    notification.style.display = 'block';
    
    // Fechar notificação
    notification.querySelector('.close-notification').addEventListener('click', function() {
        notification.style.display = 'none';
    });
    
    // Esconder após 5 segundos
    setTimeout(() => {
        if (notification.style.display === 'block') {
            notification.style.display = 'none';
        }
    }, 5000);
}

// Carregar os detalhes do produto quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
    
    // Configurar eventos dos thumbnails
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('thumbnail') || e.target.closest('.thumbnail')) {
            const thumbnail = e.target.classList.contains('thumbnail') ? e.target : e.target.closest('.thumbnail');
            const imageSrc = thumbnail.dataset.image;
            
            document.getElementById('main-product-image').src = imageSrc;
            
            // Atualizar thumbnail ativo
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        }

    });
    
    // Configurar seletor de quantidade
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.classList.contains('minus') && value > 1) {
                value -= 1;
            } else if (this.classList.contains('plus')) {
                value += 1;
            }
            
            input.value = value;
        });
    });
});