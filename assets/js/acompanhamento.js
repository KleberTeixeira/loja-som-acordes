document.addEventListener('DOMContentLoaded', function() {
    // Obtém o ID do pedido da URL
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('pedido');
    
    // Busca o pedido no histórico
    const historico = JSON.parse(localStorage.getItem('historicoPedidos') || []);
    const pedido = historico.find(p => p.id === pedidoId);
    
    if (!pedido) {
        alert('Pedido não encontrado!');
        window.location.href = 'index.html';
        return;
    }
    
    // Preenche as informações básicas
    document.getElementById('tracking-order-number').textContent = pedido.id;
    
    const dataPedido = new Date(pedido.data);
    document.getElementById('tracking-order-date').textContent = dataPedido.toLocaleDateString('pt-BR');
    document.getElementById('tracking-order-total').textContent = formatPrice(pedido.total);
    
    // Preenche os produtos
    const productsContainer = document.getElementById('tracking-products');
    pedido.itens.forEach(item => {
        const productElement = document.createElement('div');
        productElement.className = 'tracking-product';
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="product-info">
                <h4>${item.name}</h4>
                <div class="product-price">${formatPrice(item.price)}</div>
                <div class="product-quantity">Quantidade: ${item.quantity}</div>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
    
    // Preenche o endereço
    const addressContainer = document.getElementById('tracking-address');
    addressContainer.innerHTML = `
        <p>${pedido.endereco.rua}, ${pedido.endereco.numero}</p>
        ${pedido.endereco.complemento ? `<p>${pedido.endereco.complemento}</p>` : ''}
        <p>${pedido.endereco.bairro}</p>
        <p>${pedido.endereco.cidade} - ${pedido.endereco.estado}</p>
        <p>CEP: ${pedido.endereco.cep}</p>
        ${pedido.endereco.referencia ? `<p>Referência: ${pedido.endereco.referencia}</p>` : ''}
    `;
    
    // Simula o progresso do pedido (em produção, isso viria da API)
    simularProgressoPedido(pedido);
});

function formatPrice(price) {
    return 'R$ ' + price.toFixed(2).replace('.', ',');
}

function simularProgressoPedido(pedido) {
    const dataPedido = new Date(pedido.data);
    const agora = new Date();
    const diffHoras = (agora - dataPedido) / (1000 * 60 * 60);
    console.log(agora - dataPedido);
    console.log(diffHoras);
    
    // Define os estágios do pedido baseado no tempo decorrido
    if (diffHoras < 2) {
        atualizarProgresso(1); // Apenas confirmado
        document.getElementById('step1-date').textContent = formatarData(dataPedido, 0);
    } else if (diffHoras < 24) {
        atualizarProgresso(2); // Processando
        document.getElementById('step1-date').textContent = formatarData(dataPedido, 0);
        document.getElementById('step2-date').textContent = formatarData(dataPedido, 2);
    } else if (diffHoras < 72) {
        atualizarProgresso(3); // Enviado
        document.getElementById('step1-date').textContent = formatarData(dataPedido, 0);
        document.getElementById('step2-date').textContent = formatarData(dataPedido, 2);
        document.getElementById('step3-date').textContent = formatarData(dataPedido, 24);
    } else {
        atualizarProgresso(4); // Entregue
        document.getElementById('step1-date').textContent = formatarData(dataPedido, 0);
        document.getElementById('step2-date').textContent = formatarData(dataPedido, 2);
        document.getElementById('step3-date').textContent = formatarData(dataPedido, 24);
        document.getElementById('step4-date').textContent = formatarData(dataPedido, 48);
    }
}

function atualizarProgresso(passoAtual) {
    const steps = document.querySelectorAll('.progress-steps .step');
    const progressFill = document.getElementById('progress-fill');
    
    steps.forEach((step, index) => {
        if (index < passoAtual) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Atualiza a barra de progresso
    const percentual = ((passoAtual - 1) / (steps.length - 1)) * 100;
    progressFill.style.width = `${percentual}%`;
}

function formatarData(dataInicial, horasAdicionais) {
    const data = new Date(dataInicial);
    data.setHours(data.getHours() + horasAdicionais);
    
    const hoje = new Date();
    if (data.toDateString() === hoje.toDateString()) {
        return 'Hoje, ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    } else {
        return data.toLocaleDateString('pt-BR');
    }
}