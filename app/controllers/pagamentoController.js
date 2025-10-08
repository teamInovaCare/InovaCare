const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

const criarPreferencia = async (req, res) => {
    try {
        console.log('Dados recebidos:', req.body);
        const { title, price } = req.body;
        
        if (!title || !price) {
            return res.status(400).json({ error: 'Título e preço são obrigatórios' });
        }

        const preference = new Preference(client);
        const body = {
            items: [{
                title: title,
                unit_price: parseFloat(price),
                quantity: 1,
            }]
        };

        console.log('Criando preferência com:', body);
        const response = await preference.create({ body });
        console.log('Resposta do MP:', response);
        
        res.json({ id: response.id });
    } catch (error) {
        console.error('Erro detalhado:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

module.exports = { criarPreferencia };