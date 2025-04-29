        // Dados dos produtos
        const featuredProducts = [
            {
                name: "Sax Alto",
                price: 3500.00,
                image: "assets/img/produto_01.jpg",
                installments: "10x de R$ 350,00 sem juros",
                descricao: "ideal para músicos iniciantes e profissionais que buscam um som equilibrado, projeção excepcional e conforto ao tocar. Com acabamento refinado e construção durável, ele oferece afinação precisa e resposta ágil em todas as oitavas."
            },
            {
                name: "Violão Folk Cutaway",
                price: 1400.00,
                image: "assets/img/produto_02.png",
                installments: "10x de R$ 140,00 sem juros",
                descricao: "perfeito para músicos que buscam um som encorpado, projeção potente e acesso facilitado às notas mais agudas. Seu design com recorte no corpo (cutaway) permite maior mobilidade no braço, tornando-o ideal para solos e arranjos mais elaborados."
            },
            {
                name: "Guitarra Fender",
                price: 7730.00,
                image: "assets/img/produto_03.jpeg",
                installments: "10x de R$ 773,00 sem juros",
                descricao: "escolha definitiva para músicos que buscam timbres icônicos, conforto e qualidade incomparável. Reconhecida mundialmente, a Fender entrega versatilidade e performance excepcionais, sendo ideal para diversos estilos musicais, como rock, blues, jazz e pop."
            },
            {
                name: "Bateria Yamaha",
                price: 6890.00,
                image: "assets/img/produto_04.png",
                installments: "10x de R$ 689,00 sem juros",
                descricao: "perfeita para bateristas que buscam um som encorpado, construção robusta e resposta excepcional. Com a qualidade inconfundível da Yamaha, esse kit oferece equilíbrio entre graves profundos, médios definidos e agudos brilhantes, atendendo desde iniciantes até músicos profissionais."
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