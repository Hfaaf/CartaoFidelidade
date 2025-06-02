# Marca Aqui - Planejamento do Projeto

Este documento descreve o planejamento inicial para o desenvolvimento da aplicação "Marca Aqui", um sistema de cartão de fidelidade digital com foco na simplicidade de acesso para o cliente final através do WhatsApp.

## 1. Entendimento do Problema

**Proposta de Valor:** Facilitar o acesso e uso de cartões de fidelidade para clientes finais, eliminando a necessidade de cadastros tradicionais complexos (preenchimento de formulários longos, criação de usuário/senha). O acesso ao cartão é feito via um link único enviado por WhatsApp.

**Diferencial:** Acesso simplificado via WhatsApp. O cadastro inicial do cliente pela empresa ainda é necessário, mas de forma simplificada.

## 2. Requisitos

### 2.1 Requisitos Funcionais Principais (RF)

*   **Cadastro do Cliente pela Empresa:** Empresas devem poder cadastrar seus clientes no sistema (através da página de gerenciamento) para que o link do cartão fidelidade seja gerado e enviado.
*   **Registro de Pontos/Check-ins:** Mecanismo para adicionar pontos ou check-ins ao cartão do cliente (e.g., manual pela empresa, leitura de QR Code, integração com PDV). *Este é um RF crítico.*
*   **Resgate de Recompensas:** Clientes devem poder solicitar o resgate de recompensas, e empresas devem poder validar e registrar esse resgate.
*   **Múltiplos Tipos de Cartões por Empresa (Opcional):** Permitir que uma empresa crie diferentes tipos de cartões de fidelidade (e.g., um para café, outro para almoço).
*   **Notificações (Opcional, mas útil):** Enviar notificações via WhatsApp para clientes sobre novos pontos, recompensas alcançadas ou promoções.

### 2.2 Requisitos Não Funcionais (RNF)

*   **Escalabilidade:** A arquitetura deve suportar um número crescente de empresas e clientes.
*   **Performance:** Tempo de carregamento rápido para a página do cartão do cliente e para a área administrativa das empresas.
*   **Backup e Recuperação de Dados:** Essencial para os dados das empresas e clientes.
*   **Disponibilidade:** Alta disponibilidade do serviço.
*   **LGPD/Privacidade de Dados:** Tratamento dos dados dos clientes (especialmente telefone) em conformidade com a LGPD, incluindo obtenção de consentimento para envio de mensagens.

## 3. Arquitetura e Tecnologias Sugeridas

### 3.1 Backend
*   **API REST:**
    *   **Opções de Tecnologia:** Node.js (Express.js/NestJS), Python (Django/Flask), Ruby on Rails, Java (Spring Boot), PHP (Laravel/Symfony).
*   **Banco de Dados:**
    *   **Opções:**
        *   Relacional (PostgreSQL, MySQL): Para dados estruturados e transações.
        *   NoSQL (MongoDB): Para flexibilidade, especialmente se os dados dos cartões forem variáveis.

### 3.2 Frontend
*   **Página de Gerenciamento para Empresas (Admin):**
    *   **Tecnologia Sugerida:** Framework JavaScript moderno (React, Vue.js, Angular, ou Svelte) para interfaces ricas e interativas.
*   **Página Pública do Cartão do Cliente:**
    *   **Tecnologia Sugerida:** HTML, CSS, e JavaScript puro podem ser suficientes, visando leveza e rapidez.

### 3.3 Integração WhatsApp
*   **Plataformas:** Análise de custos, limitações de envio e facilidade de integração de plataformas como Twilio (API Oficial) ou Z-API (Não Oficial, com ressalvas).
*   **Message Templates:** Para APIs oficiais, necessidade de modelos de mensagem pré-aprovados.
*   **Webhooks:** Considerar para recebimento de respostas do cliente (e.g., "PARAR").

## 4. Etapas de Desenvolvimento (Visão Geral)

### 4.1 Design UX/UI
*   Priorizar uma etapa de design de interface e experiência do usuário, especialmente para a área administrativa, para garantir intuitividade.

### 4.2 Desenvolvimento da API REST (Endpoints Chave)
*   **Autenticação e Gestão da Empresa:**
    *   `POST /business/register` (Registro da empresa na plataforma)
    *   `POST /login` (Login da empresa)
    *   `POST /reset-password` (Reset de senha da empresa)
    *   `GET /dashboard` (Dashboard da empresa)
*   **Gerenciamento de Modelos de Cartões Fidelidade (pela Empresa):**
    *   `POST /business/cards` (Criar modelo de cartão)
    *   `PUT /business/cards/:cardId` (Atualizar modelo)
    *   `GET /business/cards` (Listar modelos)
    *   `DELETE /business/cards/:cardId` (Deletar modelo)
*   **Gerenciamento de Clientes (pela Empresa):**
    *   `POST /business/clients` (Empresa cadastra cliente, dispara geração de token e envio de link via WhatsApp)
    *   `GET /business/clients` (Listar clientes da empresa)
    *   `PUT /business/clients/:clientId` (Editar dados do cliente)
    *   `GET /business/clients/:clientId/history` (Histórico de um cliente)
*   **Operações no Cartão do Cliente (pela Empresa):**
    *   `POST /business/clients/:clientId/points` (Adicionar pontos/check-in)
    *   `POST /business/clients/:clientId/redeem` (Registrar resgate de recompensa)
*   **Gerenciamento de Recompensas (pela Empresa):**
    *   `POST /business/rewards` (Criar recompensa)
    *   `PUT /business/rewards/:rewardId` (Atualizar recompensa)
    *   `GET /business/rewards` (Listar recompensas)
    *   `DELETE /business/rewards/:rewardId` (Deletar recompensa)
*   **Acesso Público (Cliente):**
    *   `GET /client/:token` (Retorna dados do cartão do cliente através de um token único)
*   **Integração WhatsApp (Interno):**
    *   `POST /send-link` (Chamado internamente após cadastro do cliente ou em outros momentos pertinentes)

### 4.3 Geração de Link com Token
*   O cadastro do cliente é feito pela empresa em sua área administrativa.
*   **Formato da URL do Cliente:** `https://dominio.com/client/:tokenUnico`

### 4.4 Desenvolvimento do Frontend (Admin e Cliente)

## 5. Segurança

*   **Token de Acesso ao Cartão do Cliente (`/client/:token`):**
    *   Idealmente de longa duração ou sem expiração.
    *   Deve ser revogável pela empresa (e.g., solicitação do cliente, suspeita de fraude).
*   **Tokens JWT para Áreas Administrativas:**
    *   Expiração curta (e.g., horas).
    *   Implementar mecanismo de refresh token.
*   **Criptografia de Dados Pessoais:** Nome e telefone do cliente devem ser armazenados com segurança (e.g., criptografia em repouso).
*   **Validação de Entradas:** Em todos os endpoints da API.
*   **Proteção contra Ataques Comuns:** OWASP Top 10 (XSS, SQL Injection, CSRF, etc.).
*   **Rate Limiting:** Para evitar abuso da API.

## 6. Testes

### 6.1 Testes Funcionais
*   Fluxo de cadastro da empresa.
*   Cadastro de clientes pela empresa.
*   Geração e envio do link do cartão.
*   Visualização do cartão pelo cliente.
*   Registro de pontos/check-ins.
*   Resgate de recompensas.
*   Gerenciamento de cartões e recompensas pela empresa.

### 6.2 Testes de Segurança
*   Garantir que um link/token não possa ser reutilizado por outro cliente indevidamente.
*   Controle de acesso: um usuário de uma empresa não pode ver/gerenciar dados de outra.
*   Testes de vulnerabilidade (OWASP Top 10).

### 6.3 Testes de Integração
*   Comunicação entre frontend (admin/cliente), backend (API) e API do WhatsApp.

### 6.4 Testes de Performance/Carga (Recomendado)
*   Verificar comportamento do sistema com múltiplos acessos simultâneos, especialmente à página do cartão do cliente.

## 7. Implantação

### 7.1 Backend e Banco de Dados
*   **Hospedagem da API REST:** Plataformas como Heroku, AWS (EC2, ECS, Lambda), Google Cloud (Run, App Engine), DigitalOcean App Platform.
*   **Hospedagem do Banco de Dados:** Serviços como AWS RDS, Google Cloud SQL, MongoDB Atlas, ou gerenciado na mesma plataforma da API.

### 7.2 CI/CD (Integração Contínua/Entrega Contínua)
*   Configurar pipelines para automatizar testes e deploys.

## 8. Manutenção e Evolução

*   **Monitoramento e Logs:** Implementar sistema de monitoramento de performance (APM) e coleta de logs centralizados.
*   **Feedback dos Usuários (Empresas):** Criar canal para coletar feedback das empresas para guiar futuras evoluções.
*   **Custos Operacionais:** Monitorar custos de API do WhatsApp, hospedagem, banco de dados, etc.

## 9. Considerações Adicionais

*   **Modelo de Negócio/Monetização:**
    *   Como a "Marca Aqui" vai gerar receita? (Ex: SaaS com mensalidade para empresas, planos baseados em número de clientes, cartões ou mensagens).
*   **Onboarding das Empresas:**
    *   Como será o processo para uma nova empresa começar a usar a plataforma? (Ex: Self-service, processo de vendas/configuração manual).
*   **Termos de Uso e Política de Privacidade:**
    *   Essenciais para as empresas e para os clientes finais.
    *   Deixar claro como os dados são usados, especialmente o número de telefone, em conformidade com a LGPD.

---
Parabéns pela iniciativa e pelo planejamento inicial detalhado!
