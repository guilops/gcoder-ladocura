# Gcoder

Site institucional responsivo para divulgar criação de sites e serviços de informática, com contatos configuráveis, formulário de contato por e-mail e painel privado de gestão. A identidade usa tema escuro com detalhes neon, imagens ilustrativas e logotipo vetorial.

## Logotipo

Os arquivos prontos para uso digital e impressão ficam em [`assets/logos/`](./assets/logos/):

- [`gcoder-logo-black.svg`](./assets/logos/gcoder-logo-black.svg): para fundo claro e impressão.
- [`gcoder-logo-white.svg`](./assets/logos/gcoder-logo-white.svg): para fundo escuro.
- [`gcoder-mark.svg`](./assets/logos/gcoder-mark.svg): símbolo quadrado para favicon ou avatar.

São SVGs vetoriais: podem ser redimensionados para impressão sem perder definição. Os links de download das versões preta e branca também ficam no rodapé. O logotipo no cabeçalho é um link para o início da página.

## Configuração do site

1. Copie `.env.example` para `.env` e preencha as informações públicas:

   ```env
   SUPABASE_URL=https://SEU-PROJETO.supabase.co
   SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA_ANON_OU_PUBLISHABLE
   WHATSAPP_NUMBER=5511953687653
   CONTACT_EMAIL=guilhermelopes_dev@hotmail.com
   INSTAGRAM_URL=https://instagram.com/seuusuario
   SERVICE_AREA=Atendimento em sua região
   BUSINESS_NAME=Gcoder
   BUSINESS_TAGLINE=TECNOLOGIA SEM COMPLICAÇÃO
   ```

2. Gere a configuração pública usada pelo site:

   ```powershell
   npm run build
   ```

   O comando grava os valores públicos em `config.js`. A URL e a chave pública do Supabase devem ser informadas juntas; sem elas, os links de contato continuam funcionando, mas a agenda fica desativada. Depois de alterar `.env`, rode novamente o build.

**Nunca** coloque `SUPABASE_SERVICE_ROLE_KEY`, chave do Resend ou outra credencial privada no `.env` que alimenta o site, em `config.js` ou em qualquer arquivo publicado. O endereço de WhatsApp deve conter o código do país e da região, só com números. Instagram deve ser a URL completa do perfil. `.env` está ignorado pelo Git.

## Supabase e agenda

O formulário público não reserva datas nem promete prazos: ele prepara um e-mail para a Gcoder com o assunto, os dados de contato e a descrição do pedido. A pessoa revisa e envia a mensagem pelo aplicativo de e-mail do próprio dispositivo. Solicitações de criação de site, dúvidas e pedidos de conversa usam o mesmo formulário. Para formatação ou manutenção de computador, o site informa que entrega e retirada no endereço combinado são responsabilidade do cliente.

O painel privado em `/gestao/` preserva o calendário interno: login, consulta dos registros antigos, duração dos serviços, exportação `.ics` e bloqueio de dias ou horários. Os novos pedidos enviados pelo formulário de contato **não** criam agendamentos nem aparecem automaticamente nesse calendário. O tempo e a eventual marcação são combinados depois de avaliar o serviço.

1. Crie ou selecione um projeto Supabase pertencente à Gcoder. **Confira o projeto antes de publicar funções ou executar SQL.** Este repositório veio com uma referência local de outro projeto no arquivo `supabase/config.toml`; não publique nele. Atualize a referência com a do projeto Gcoder:

   ```powershell
   npx supabase login
   npx supabase link --project-ref REF_DO_PROJETO_GCODER
   ```

2. No SQL Editor do projeto Gcoder, execute `supabase/schema.sql`. Se estiver atualizando um banco que já tinha a agenda antiga e não for reaplicar o schema, execute `supabase/upgrade-schedule-blocks.sql`. Os novos serviços são adicionados à tabela de durações; os registros antigos de serviços permanecem no histórico dos pedidos.
3. Crie o usuário administrador em **Authentication → Users → Add user**. Depois, conceda acesso somente a esse usuário:

   ```sql
   insert into public.admins (user_id) values ('UUID-DO-USUARIO-ADMINISTRADOR');
   ```

   Não habilite cadastro público. O painel só abre para usuários explicitamente autorizados na tabela `admins`.
4. Configure os segredos de e-mail no projeto Gcoder, se quiser receber notificações. Use um domínio de remetente verificado no Resend:

   ```powershell
   npx supabase secrets set RESEND_API_KEY="SUA_CHAVE_RESEND" ADMIN_EMAIL="EMAIL_DA_GCODER" EMAIL_FROM="Gcoder <agenda@SEU_DOMINIO_VERIFICADO>" BUSINESS_NAME="Gcoder" --project-ref REF_DO_PROJETO_GCODER
   ```

5. Se ainda for usar os endpoints de disponibilidade da agenda, publique as funções no projeto Gcoder:

   ```powershell
   npx supabase functions deploy booking-slots --no-verify-jwt
   npx supabase functions deploy create-booking --no-verify-jwt
   ```

   As Edge Functions usam `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` como segredos do ambiente Supabase. A chave privada não é enviada ao navegador. A função de consulta retorna disponibilidade sem divulgar dados pessoais dos clientes. Elas não são necessárias para o formulário atual, que envia a mensagem pelo aplicativo de e-mail do visitante.

## Teste e publicação

Rode `npm run build`, abra o `index.html` por um servidor estático local ou publique os arquivos em uma hospedagem estática com HTTPS. Antes de divulgar o QR code do cartão, confira os links de contato, teste se o formulário abre o aplicativo de e-mail com todos os dados e confirme que `/gestao/` funciona. O formulário exige que a pessoa envie a mensagem depois de revisar o rascunho. Um domínio publicado com HTTPS ajuda os leitores de QR code a abrirem o site com segurança.

As fotos externas são ilustrativas; substitua-as por imagens próprias quando desejar. O QR code deve apontar para a URL final do site publicado.
