
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
            const quantity = parseInt(document.querySelector('.quantity-input').value);
            addToCart(product.id, quantity); // Passar a quantidade como parâmetro
            showCartNotification(product, quantity); // Mostrar a quantidade correta
        });
    } else {
        // Produto não encontrado - redirecionar para home
        window.location.href = 'index.html';
    }
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