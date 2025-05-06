        // Dados dos produtos
        const featuredProducts = [
            {
                id: 1,
                name: "Sax Alto",
                price: 3500.00,
                image: "assets/img/produto_01.jpg",
                installments: "10x de R$ 350,00 sem juros",
                descricao: "com acabamento refinado e construção durável, ele oferece afinação precisa e resposta ágil em todas as oitavas.",
                category: "sopro"
            },
            {
                id: 2,
                name: "Violão Folk Cutaway",
                price: 1400.00,
                image: "assets/img/produto_02.png",
                installments: "10x de R$ 140,00 sem juros",
                descricao: "seu design com recorte no corpo (cutaway) permite maior mobilidade no braço, tornando-o ideal para solos e arranjos mais elaborados.",
                category: "cordas"
            },
            {
                id: 3,
                name: "Guitarra Fender",
                price: 7730.00,
                image: "assets/img/produto_03.jpeg",
                installments: "10x de R$ 773,00 sem juros",
                descricao: "reconhecida mundialmente, a Fender entrega versatilidade e performance excepcionais, sendo ideal para diversos estilos musicais, como rock, blues, jazz e pop.",
                category: "cordas"
            },
            {
                id: 4,
                name: "Bateria Yamaha",
                price: 6890.00,
                image: "assets/img/produto_04.png",
                installments: "10x de R$ 689,00 sem juros",
                descricao: "com a qualidade inconfundível da Yamaha, esse kit oferece equilíbrio entre graves profundos, médios definidos e agudos brilhantes, atendendo desde iniciantes até músicos profissionais.",
                category: "percussao"
            }
        ];
        
        const discountProducts = [
            {
                name: "Controlador DJ 4 Canais",
                price: 1999.90,
                originalPrice: 2599.90,
                image: "https://m.media-amazon.com/images/I/71+U-hQY3BL._AC_SL1500_.jpg",
                installments: "12x de R$ 166,66 sem juros"
            },
            {
                name: "Teclado MIDI 49 Teclas",
                price: 899.00,
                originalPrice: 1199.00,
                image: "https://m.media-amazon.com/images/I/71qod+5XmDL._AC_SL1500_.jpg",
                installments: "6x de R$ 149,83 sem juros"
            },
            {
                name: "Kit Iluminação LED RGB",
                price: 1299.90,
                originalPrice: 1599.90,
                image: "https://m.media-amazon.com/images/I/71JkTa7j0GL._AC_SL1500_.jpg",
                installments: "10x de R$ 129,99 sem juros"
            },
            {
                name: "Guitarra Elétrica Standard",
                price: 1799.00,
                originalPrice: 2199.00,
                image: "https://m.media-amazon.com/images/I/71YHhOZJNEL._AC_SL1500_.jpg",
                installments: "12x de R$ 149,92 sem juros"
            }
        ];
        
        
        // Carrinho de compras
        let cart = [];
        
        // Elementos do DOM
        const cartIcon = document.getElementById('cart-icon');
        const cartModal = document.getElementById('cart-modal');
        const closeCart = document.getElementById('close-cart');
        const overlay = document.getElementById('overlay');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        const cartCountElement = document.querySelector('.cart-count');
        
        // Função para formatar preço
        function formatPrice(price) {
            return 'R$ ' + price.toFixed(2).replace('.', ',');
        }
        
        // Função para atualizar o contador do carrinho
        function updateCartCount() {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
        
        // Função para calcular o total do carrinho
        function calculateCartTotal() {
            return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
        
        // Função para atualizar o carrinho
        function updateCart() {
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
            
            // Atualiza o total
            const total = calculateCartTotal();
            cartTotalElement.textContent = formatPrice(total);
            
            // Atualiza o contador
            updateCartCount();
        }
        
        // Função para mostrar notificação do carrinho
        function showCartNotification(product) {
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
                    <div>Quantidade: 1</div>
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
        function addToCart(productId) {
            // Verifica se o produto já está no carrinho
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                // Incrementa a quantidade se já estiver no carrinho
                existingItem.quantity += 1;
            } else {
                // Encontra o produto na lista de produtos
                const allProducts = [...featuredProducts, ...discountProducts];
                const productToAdd = allProducts.find(product => product.id === productId);
                
                if (productToAdd) {
                    // Adiciona o produto ao carrinho com quantidade 1
                    cart.push({
                        id: productToAdd.id,
                        name: productToAdd.name,
                        price: productToAdd.price,
                        image: productToAdd.image,
                        quantity: 1
                    });
                }
            }
            
            // Atualiza o carrinho
            updateCart();
            
            // Mostra mensagem de sucesso
            const productName = cart.find(item => item.id === productId).name;
            //alert(`${productName} foi adicionado ao carrinho!`);

            // Mostrar notificação
            const allProducts = [...featuredProducts, ...discountProducts];
            const productToAdd = allProducts.find(p => p.id === productId);
            if (productToAdd) {
                showCartNotification(productToAdd);
            }

        }
        
        // Função para remover item do carrinho
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
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
            }
        }

        // Função para renderizar produtos
        function renderProducts(products, containerId) {
            const container = document.getElementById(containerId);
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.dataset.id = product.id;

                let priceHTML = `
                    <div class="product-price">R$ ${formatPrice(product.price)}</div>
                `;
                
                if (product.originalPrice) {
                    priceHTML = `
                        <div class="product-price">
                            <span style="text-decoration: line-through; color: #999; font-size: 16px; margin-right: 10px;">
                                R$ ${formatPrice(product.originalPrice)}
                            </span>
                            R$ ${formatPrice(product.price)}
                        </div>
                    `;
                }
                
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        ${priceHTML}
                        <div class="installment">${product.installments}</div>
                        <div class="descricao">
                            <p>${product.descricao}
                        </div>
                        <button class="add-to-cart">Adicionar ao Carrinho</button>
                    </div>
                `;
                
                container.appendChild(productCard);

            });
        }
        
        // Renderizar produtos quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            renderProducts(featuredProducts, 'featured-products');
            //renderProducts(discountProducts, 'discount-products');

    
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
            });
            
            
            // Adicionar evento de submit no formulário de newsletter
            document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input').value;
                if (email.includes('@')) {
                    alert(`Obrigado por assinar nossa newsletter! Um e-mail foi enviado para ${email}`);
                    this.querySelector('input').value = '';
                } else {
                    alert('Por favor, insira um e-mail válido.');
                }
            });

            // Fechar notificação do carrinho
            document.getElementById('close-notification').addEventListener('click', function() {
                document.getElementById('cart-notification').style.display = 'none';
            });
            
            // Ir para o carrinho
            document.querySelector('.go-to-cart').addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('cart-notification').style.display = 'none';
                document.getElementById('cart-modal').style.display = 'block';
                document.getElementById('overlay').style.display = 'block';
            });


        });

        function filterProductsByCategory(category) {
            const productsGrid = document.getElementById('featured-products');
            productsGrid.innerHTML = ''; // Limpa os produtos atuais
            
            if (category === 'all') {
                renderProducts(featuredProducts, 'featured-products');
            } else {
                const filteredProducts = featuredProducts.filter(product => product.category === category);
                renderProducts(filteredProducts, 'featured-products');
            }
        }