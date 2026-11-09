# La Docura Confeitaria Gourmet

Site de apresentação e encomendas de doces, bolos e docinhos artesanais para festas. A vitrine permite escolher itens e quantidades, informa uma estimativa, aplica o prazo mínimo configurável e prepara o pedido no WhatsApp **+55 11 95484-1299**. O painel privado fica em `/gestao/`.

## Configuração

Defina `NEON_AUTH_BASE_URL` no `.env.local` (gerado pelo Neon CLI) ou nas variáveis de Actions do GitHub e execute `npm run build:pages`. Essa URL é pública; nunca use aqui a connection string do banco. O build empacota o SDK da Neon para a página estática.

O fluxo de cadastro e login fica em `/auth.html`. Ele usa Managed Better Auth, mostra a sessão atual e permite sair. No GitHub, cadastre `NEON_AUTH_BASE_URL` em **Settings → Secrets and variables → Actions → Variables**; use o valor da branch `production`. A connection string permanece somente em `.env.local`, ignorado pelo Git.

## Supabase

1. No SQL Editor do projeto correto, execute `supabase/schema.sql` e depois `supabase/bakery-settings.sql`. O segundo arquivo cria a configuração do prazo mínimo, inicialmente 7 dias.
2. Cadastre a conta da confeiteira em `public.admins` e não habilite cadastro público.
3. Publique `supabase/functions/create-booking` com `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, e os segredos de e-mail da função, se quiser notificações por e-mail. Essa função também verifica o prazo mínimo no servidor ao registrar a encomenda.
4. Configure as URLs e o WhatsApp no build do site e publique o site com HTTPS.

No painel, a confeiteira pode definir antecedência entre 1 e 60 dias, acompanhar encomendas por data e atualizar o status para recebido, confirmado, entregue ou cancelado. A entrega é combinada à parte e paga pelo cliente. O sinal de 50% e o saldo são informados na mensagem do pedido; a confirmação, o envio dos dados Pix e a conferência do pagamento são feitos diretamente pelo WhatsApp.

Os preços são estimativas editáveis em `shop.js`, não uma cotação de mercado garantida. As fotos mostradas na conversa não foram disponibilizadas como arquivos no repositório; as imagens atualmente na vitrine são ilustrativas. Coloque as fotos reais e o arquivo do logo em `assets/` para substituir as imagens provisórias.
