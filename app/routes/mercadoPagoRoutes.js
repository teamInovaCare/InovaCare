const express = require("express");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const router = express.Router();

// Configuração do cliente Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

router.post("/create-preference", async (req, res) => {
  try {
    const { title, price } = req.body;
    
    console.log('=== DEBUG MERCADO PAGO ===');
    console.log('Dados recebidos:', { title, price });
    console.log('Tipo do preço:', typeof price);
    
    // Garantir que o preço seja um número válido
    const precoNumerico = parseFloat(price);
    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      console.log('Preço inválido, usando valor padrão');
      throw new Error('Preço inválido');
    }
    
    console.log('Preço numérico:', precoNumerico);

    const preference = new Preference(client);

    const preferenceData = {
      body: {
        items: [
          {
            title: title || 'Consulta Médica',
            quantity: 1,
            currency_id: "BRL",
            unit_price: precoNumerico,
          },
        ],
        back_urls: {
          success: "https://inovacare-1.onrender.com/feedback?status=success",
          failure: "https://inovacare-1.onrender.com/feedback?status=failure",
          pending: "https://inovacare-1.onrender.com/feedback?status=pending",
        },
         auto_return: "approved",
      },
    };
    
    console.log('Dados da preferência:', JSON.stringify(preferenceData, null, 2));
    
    const result = await preference.create(preferenceData);
    
    console.log('Preferência criada com sucesso:', result.id);
    console.log('=== FIM DEBUG MERCADO PAGO ===');

    res.json({ id: result.id });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    res.status(500).json({ error: "Erro ao criar pagamento", details: error.message });
  }
});

router.get("/feedback", (req, res) => {
  const { status, payment_id } = req.query;
  res.render("pages/feedback", { status, payment_id });
});

module.exports = router;
