import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';
import { updatePaymentStatusById } from '../utils/dynamo';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN!;
    const body = JSON.parse(event.body || '{}');

    console.log('[webhook] Corpo recebido:', JSON.stringify(body, null, 2));

    if (body.topic === 'merchant_order' || body.type === 'merchant_order') {
      console.log('[webhook] Evento merchant_order recebido, ignorando.');
      return {
        statusCode: 200,
        body: 'Evento merchant_order ignorado',
      };
    }

    if (body.type !== 'payment' && body.topic !== 'payment') {
      console.log('[webhook] Evento não relacionado a pagamento, ignorando:', body.type || body.topic);
      return {
        statusCode: 200,
        body: 'Evento não relacionado a pagamento ignorado',
      };
    }

    const paymentId = body.data?.id || body.resource;

    if (!paymentId) {
      console.warn('[webhook] ID do pagamento não encontrado no body.');
      return {
        statusCode: 400,
        body: 'ID do pagamento não encontrado.',
      };
    }
    const { data: payment } = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    console.log('[webhook] Dados completos do pagamento:', JSON.stringify(payment, null, 2));

    const externalReference = payment.external_reference;
    const status = payment.status;

    if (!externalReference) {
      console.warn('[webhook] external_reference não presente na resposta.');
      return {
        statusCode: 400,
        body: 'external_reference ausente.',
      };
    }

    const statusValidos = ['approved', 'rejected', 'pending', 'cancelled', 'in_process'];
    if (!statusValidos.includes(status)) {
      console.warn(`[webhook] Status "${status}" não é válido.`);
    }

    await updatePaymentStatusById(externalReference, status);
    console.info(`[webhook] Pagamento ${externalReference} atualizado com status "${status}".`);

    return {
      statusCode: 200,
      body: 'OK',
    };
  } catch (error: any) {
    console.error('[webhook] Erro ao processar webhook:', {
      message: error.message,
      code: error.code,
      response: {
        status: error.response?.status,
        data: error.response?.data,
      },
    });

    return {
      statusCode: 500,
      body: 'Erro interno no webhook',
    };
  }
};
