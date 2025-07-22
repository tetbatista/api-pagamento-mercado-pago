import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';
import { savePayment } from '../utils/dynamo';
import { v4 as uuid } from 'uuid';

const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN!;
console.log('ACCESS_TOKEN:', ACCESS_TOKEN);
const NOTIFICATION_URL = process.env.MERCADO_PAGO_NOTIFICATION_URL!;
console.log('NOTIFICATION_URL:', NOTIFICATION_URL);

const createPreference = async (title: string, price: number) => {
  const id_payment = uuid();

  const payload = {
    items: [
      {
        title,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: price,
      },
    ],
    external_reference: id_payment,
    payment_methods: {
      excluded_payment_types: [
        { id: 'ticket' },
        { id: 'atm' },
      ],
      installments: 1,
    },
    back_urls: {
      success: 'https://superlative-tulumba-e009b3.netlify.app/success',
      failure: 'https://superlative-tulumba-e009b3.netlify.app/failure',
      pending: 'https://superlative-tulumba-e009b3.netlify.app/pending',
    },
    auto_return: 'approved',
    notification_url: NOTIFICATION_URL,
  };

  console.log('Payload para Mercado Pago:', JSON.stringify(payload, null, 2));

  const response = await axios.post(
    'https://api.mercadopago.com/checkout/preferences',
    payload,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );

  console.log('Response Mercado Pago:', JSON.stringify(response.data, null, 2));

  const id_preference = response.data.id;
  const initPoint = response.data.sandbox_init_point; // Sempre sandbox

  await savePayment(id_payment, id_preference, 'pendente');

  return {
    url: initPoint,
    id_payment,
  };
};

// Plano Padrão Mensal Teste
export const standardMonthlyPlan: APIGatewayProxyHandler = async () => {
  try {
    const { url, id_payment } = await createPreference('Plano Padrão Mensal', 1.0);
    return {
      statusCode: 200,
      body: JSON.stringify({ url, id_payment }),
    };
  } catch (error: any) {
    console.error('Erro ao criar preferência:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao gerar link de pagamento.' }),
    };
  }
};
