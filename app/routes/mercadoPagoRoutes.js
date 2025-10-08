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

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title,
            quantity: 1,
            currency_id: "BRL",
            unit_price: Number(price),
          },
        ],
        back_urls: {
          success: "http://localhost:3000/feedback?status=success",
          failure: "http://localhost:3000/feedback?status=failure",
          pending: "http://localhost:3000/feedback?status=pending",
        },
         auto_return: "approved",
      },
    });

    res.json({ id: result.id });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});

router.get("/feedback", (req, res) => {
  const { status, payment_id } = req.query;
  res.render("pages/feedback", { status, payment_id });
});

module.exports = router;
