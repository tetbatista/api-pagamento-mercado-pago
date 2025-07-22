import { APIGatewayProxyHandler } from 'aws-lambda';
import { checkPaymentStatus } from '../utils/dynamo';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('[confirmPayment] Evento recebido:', JSON.stringify(event));
  
  const id_payment = event.queryStringParameters?.id_payment;
  console.log('[confirmPayment] id_payment recebido:', id_payment);

  if (!id_payment) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'ID do pagamento não informado' }),
    };
  }

  try {
    const status = await checkPaymentStatus(id_payment);
    console.log('[confirmPayment] Status retornado do DynamoDB:', status);

    if (!status) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          confirmado: false,
          status: 'not_found',
          message: 'Pagamento não encontrado no sistema.',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        confirmado: status === 'approved',
        status,
      }),
    };
  } catch (error) {
    console.error('[confirmPayment] Erro ao consultar status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao verificar status do pagamento' }),
    };
  }
};