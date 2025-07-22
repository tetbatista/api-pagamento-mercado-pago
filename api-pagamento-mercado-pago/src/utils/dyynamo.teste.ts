import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, QueryCommand} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'regiao-da-tabela' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'nome-da-tabela';

export const savePayment = async (id_payment: string, id_preference: string, status: string = 'pending') => {
  const now = Math.floor(Date.now() / 1000);
  const TTL = now + 60 * 60 * 24; // 24h

  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      id_payment,
      id_preference,
      status,
      criaded_in: now,
      expires_in: TTL,
    },
  }));
  console.log(`[savePayment] Payment saved with ID: ${id_payment}`);
};

export const updatePaymentStatusById = async (id_payment: string, status: string) => {
  await docClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id_payment },
    UpdateExpression: 'SET #s = :s',
    ExpressionAttributeNames: {
      '#s': 'status',
    },
    ExpressionAttributeValues: {
      ':s': status,
    },
  }));

  console.log(`[updatePaymentStatusById] Status updated to "${status}" on payment ${id_payment}`);
};

export const checkPaymentStatus = async (id_payment: string): Promise<string | null> => {
  console.info('[checkPaymentStatus] Checking status for payment:', id_payment);

  try {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id_payment },
    }));

    if (result.Item) {
      console.info('[checkPaymentStatus] Status found:', result.Item.status);
      return result.Item.status;
    }

    console.warn('[checkPaymentStatus] Payment not found in table.');
    return null;
  } catch (error) {
    console.error('[checkPaymentStatus] Error querying DynamoDB.', error);
    throw error;
  }
};

export const searchPaymentByIdPreference = async (id_preference: string) => {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'id_preference-index',
    KeyConditionExpression: 'id_preference = :ip',
    ExpressionAttributeValues: {
      ':ip': id_preference,
    },
  }));

  return result.Items?.[0] || null;
};