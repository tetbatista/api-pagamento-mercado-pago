# API Pagamento Mercado Pago

API RESTful desenvolvida com Node.js, Serverless Framework e TypeScript para facilitar a integração com o Mercado Pago.  
Ela permite criar pagamentos, escutar notificações via Webhook e armazenar informações essenciais no DynamoDB da AWS.
Ideal para devs e empresas que desejam uma solução plug & play para processar pagamentos com o Mercado Pago de forma segura, rápida e escalável.

Durante o desenvolvimento e testes locais, utilizamos o **ngrok** para expor o servidor local e permitir que o Mercado Pago envie notificações de Webhook para nossa aplicação, facilitando a validação e depuração dos eventos de pagamento.

## 📌 Informações Importantes

Para testar o fluxo de pagamento, você pode usar os seguintes dados fictícios para fazer o pagamento:

- 💳 Número do cartão: `1234 5678 9012 3456`  
- 📆 Vencimento: `12/30`  
- 🔐 CVV: `123`  
- 📄 CPF: `123.456.789-09` 

No campo de email, pode usar qualquer email de teste (ou o seu) só para concluir o pagamento.
Após realizar o pagamento, você pode verificar o status acessando a rota de confirmação (conforme documentação das rotas).

---
## 👾 Features

- Criação de preferências de pagamento
- Escuta de Webhooks para notificação de status de pagamento
- Utilizando ngrok para um teste real com notificações automáticas
- Armazenamento e atualização do status dos pagamentos no DynamoDB
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
- Mercado Pago API via Axios
- serverless-offline (para desenvolvimento local)
- ngrok (para expor localmente o webhook)

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/)
- Conta na [AWS](https://aws.amazon.com/)
- Conta no [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- Instalar o Serverless Framework
  ```bash
  npm install -g serverless
  ```
- ngrok para expor o servidor local (necessário para testar webhooks localmente)
  ```bash
  npm install -g ngrok
  ```    
## ⚙️ Criando a integração no Mercado Pago Developer

- Acesse Mercado Pago Developers (https://www.mercadopago.com.br/developers).
- Faça login e crie uma conta, se ainda não tiver.
- Crie uma Aplicação no painel de desenvolvedor.
- Na aplicação, gere as credenciais:
  - 🔐 Access Token (chave secreta para autenticação das requisições no backend)
  - 🔑 Public Key (usada geralmente no frontend, mas pode ser ignorada para este projeto backend)
- Para testes, configure a integração do tipo Checkout Transparente em modo sandbox.
- Defina a URL do Notification URL (Webhook) para apontar para seu backend (local via ngrok para dev, ou url pública no deploy).

## 📦 Instalação e Configuração

**Clone o projeto:**
```bash
git clone https://github.com/tetbatista/api-pagamento-mercado-pago.git
cd api-pagamento-mercado-pago
```

**Instale as dependências:**
```bash
npm install
```

**Crie um arquivo .env na raiz do projeto com as seguintes variáveis (exemplo):**
```bash
MERCADO_PAGO_ACCESS_TOKEN=sua_chave_aqui
MERCADO_PAGO_NOTIFICATION_URL=sua_chave_ngrok-aqui
```

## 🛠️ Criar tabela no DynamoDB
- Para armazenar os pagamentos, crie uma tabela no DynamoDB na região de preferência (adicione ela depois também no serverless.yml):
- Nome da tabela: TableTest (ou o nome que preferir)
- Chave primária: id_payment do tipo String
- Não é obrigatório configurar índices secundários para o funcionamento básico

## 🚀 Rodando localmente com Serverless + Ngrok
Como webhooks precisam ser acessíveis pela internet, usamos o ngrok para expor seu servidor local.

- Inicie o servidor local:
```bash
npm run dev
```

**O servidor vai rodar normalmente em http://localhost:3000 (ou a porta que aparecer no seu console).**

## 🌐 Em outro terminal, rode o ngrok para expor a porta local:

```bash
ngrok http 3000
```
**O ngrok vai gerar uma URL pública (exemplo: https://abc123.ngrok.io). Essa URL será usada para configurar o webhook no Mercado Pago.**

Atualize no painel do Mercado Pago (na configuração da sua aplicação, no campo Notification URL) essa URL do ngrok, adicionando o caminho do webhook, por exemplo:
https://abc123.ngrok.io/webhook/mercado-pago

📢 IMPORTANTE:
Toda vez que você iniciar o ngrok, ele gera uma URL nova. Então, lembre-se de atualizar a URL do webhook no Mercado Pago sempre que reiniciar o ngrok.

## 📩 Testando a API
Criar pagamento: Faça um POST para a rota de criação de preferência (exemplo: /generate-payment ou conforme configuração do seu handler), que vai retornar a URL de pagamento sandbox.
Acesse essa URL, realize o pagamento com os dados de teste fornecidos acima.
O webhook será acionado e vai atualizar o status do pagamento no DynamoDB.

- Você pode consultar o status do pagamento via rota de consulta (exemplo: /confirm-payment?id_payment=...).
