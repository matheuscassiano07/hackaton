// Arquivo: apis/payApi.js

async function criarPreferenciaDePagamento(nome, valor) {
    const accessToken = 'TEST-2456748988229588-081715-7aea15cc7e6ff7bd0f1cefb6710cf3f8-207454068'; 

    const url = 'https://api.mercadopago.com/checkout/preferences';

    // Dentro da função criarPreferenciaDePagamento em apis/payApi.js

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
            // <-- A MUDANÇA É AQUI, CZ!
            success: "https://www.google.com.br", // Um endereço que a API aceite
            failure: "https://www.google.com.br", // Pode ser o mesmo pra todos
            pending: "https://www.google.com.br"
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