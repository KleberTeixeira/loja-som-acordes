if (!window.featuredProducts) {
    window.featuredProducts = [];
}

if (!window.cart) {
    window.cart = [];
}

// Função para carregar os dados do produto
function loadProductDetails() {
    // Tenta obter o produto do localStorage primeiro
    const savedProduct = localStorage.getItem('selectedProduct');
    let product = savedProduct ? JSON.parse(savedProduct) : null;
    
    // Se não encontrou no localStorage, tenta pela URL
    if (!product) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        if (featuredProducts && featuredProducts.length > 0) {
            product = featuredProducts.find(p => p.id === productId);
        }
    }
    
    if (product) {
        // Preencher os dados do produto
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-id').textContent = product.id;
        document.getElementById('product-price').textContent = formatPrice(product.price);
        document.getElementById('product-installments').textContent = product.installments;
        document.getElementById('product-description').innerHTML = `<p>${product.descricao || product.description || ''}</p>`;
        
        // Configurar imagens
        const mainImage = document.getElementById('main-product-image');
        mainImage.src = product.image;
        mainImage.alt = product.name;
        
        // Configurar botão de adicionar ao carrinho
        document.getElementById('add-to-cart').addEventListener('click', function() {
            const quantity = parseInt(document.querySelector('.quantity-input').value);
            addToCart(product.id, quantity);
            showCartNotification(product, quantity);
        });
    } else {
        // Produto não encontrado - redirecionar para home
        window.location.href = 'index.html';
    }
}

// Carregar os detalhes do produto quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Carrega os produtos se não estiverem carregados
    if (!featuredProducts || featuredProducts.length === 0) {
        loadProducts().then(() => {
            loadProductDetails();
        });
    } else {
        loadProductDetails();
    }    
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