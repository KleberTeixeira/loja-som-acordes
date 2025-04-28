        // Dados dos produtos
        const featuredProducts = [
            {
                name: "Microfone Condensador Profissional",
                price: 599.90,
                image: "https://m.media-amazon.com/images/I/61bEWU3XURL._AC_SL1500_.jpg",
                installments: "10x de R$ 59,99 sem juros"
            },
            {
                name: "Caixa de Som Ativa 15'' 2000W",
                price: 2499.90,
                image: "https://m.media-amazon.com/images/I/71rXVL6Z1wL._AC_SL1500_.jpg",
                installments: "12x de R$ 208,33 sem juros"
            },
            {
                name: "Interface de Áudio 8 Canais",
                price: 1899.00,
                image: "https://m.media-amazon.com/images/I/71Qo5Y2uMCL._AC_SL1500_.jpg",
                installments: "10x de R$ 189,90 sem juros"
            },
            {
                name: "Fone de Ouvido Monitoramento",
                price: 459.90,
                image: "https://m.media-amazon.com/images/I/61C9EQOaJVL._AC_SL1500_.jpg",
                installments: "6x de R$ 76,65 sem juros"
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
        
        // Função para formatar preço
        function formatPrice(price) {
            return price.toFixed(2).replace('.', ',');
        }
        
        // Função para renderizar produtos
        function renderProducts(products, containerId) {
            const container = document.getElementById(containerId);
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                
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
                        <button class="add-to-cart">Adicionar ao Carrinho</button>
                    </div>
                `;
                
                container.appendChild(productCard);
            });
        }
        
        // Renderizar produtos quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            renderProducts(featuredProducts, 'featured-products');
            renderProducts(discountProducts, 'discount-products');
            
            // Adicionar evento de clique nos botões "Adicionar ao Carrinho"
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productName = this.closest('.product-card').querySelector('.product-name').textContent;
                    alert(`${productName} foi adicionado ao carrinho!`);
                });
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
        });