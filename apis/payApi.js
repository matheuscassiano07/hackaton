export { criarPreferenciaDePagamento };

// Arquivo: mercado-pago.js

async function criarPreferenciaDePagamento(nome, valor) {
    const accessToken = 'SEU_ACCESS_TOKEN_DE_TESTE_AQUI'; 

    const url = 'https://api.mercadopago.com/checkout/preferences';

    const body = {
        items: [
            {
                title: `Doação para Ações ODS 13 - Apoiador: ${nome}`,
                quantity: 1,
                unit_price: Number(valor),
                currency_id: 'BRL'
            }
        ],
        back_urls: {
            success: window.location.href,
            failure: window.location.href,
            pending: window.location.href
        },
        auto_return: 'approved'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error("Erro ao criar preferência de pagamento:", await response.json());
            return null;
        }

        const preference = await response.json();
        return preference.sandbox_init_point;

    } catch (error) {
        console.error("Erro de conexão ao criar preferência:", error);
        return null;
    }
}

export { criarPreferenciaDePagamento };