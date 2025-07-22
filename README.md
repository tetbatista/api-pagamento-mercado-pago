# API Pagamento Mercado Pago

API RESTful desenvolvida com Node.js, Serverless Framework e TypeScript para facilitar a integração com o Mercado Pago.  
Ela permite criar pagamentos, escutar notificações via Webhook e armazenar informações essenciais no DynamoDB da AWS.

Ideal para devs e empresas que desejam uma solução plug & play para processar pagamentos com o Mercado Pago de forma segura, rápida e escalável.

---

## 🚀 Features

Localmente, simulando o webhook via Postman

Com ngrok, para um teste real com notificações automáticas

- Criação de preferências de pagamento
- Escuta de Webhooks de notificação de pagamento
- Armazenamento de dados essenciais no DynamoDB
- Projeto pronto para deploy na AWS com Serverless Framework
- Suporte a ambiente local com `serverless-offline`
- Modularizado com TypeScript

---

## 🛠️ Tecnologias

- Node.js
- TypeScript
- AWS Lambda
- Serverless Framework
- DynamoDB
- Mercado Pago SDK
- serverless-offline

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/)
- Conta na [AWS](https://aws.amazon.com/)
- Conta no [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- Instalar o Serverless Framework.

npm install -g serverless
📦 Instalação

Clone o projeto:
git clone https://github.com/seu-usuario/api-pagamento-mercado-pago.git
cd api-pagamento-mercado-pago

Instale as dependências:
npm install

⚙️ Configuração
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

.env
MERCADO_PAGO_ACCESS_TOKEN=sua_chave_aqui
MERCADO_PAGO_PUBLIC_KEY=sua_public_key_aqui
DYNAMO_TABLE_NAME=nome_da_sua_tabela

▶️ Rodar localmente
Use o serverless-offline para testar a API localmente:
npx serverless offline

☁️ Deploy na AWSCertifique-se que sua CLI da AWS está configurada. Para subir a aplicação:
npx serverless deploy

📩 Exemplo de Webhook (para testes)
{
  "action": "payment.created",
  "data": {
    "id": "123456789"
  }
}
🤝 Contribuição
Fique à vontade para abrir issues ou enviar PRs!

📬 Contato
Feito com 💻 por Mateus Batista
