# Finasp

Aplicativo mobile para planejamento financeiro mensal com foco em uso local no aparelho.

O app atual funciona como uma planilha mensal guiada por blocos:

- renda
- despesas fixas
- parcelas
- pessoas a pagar
- reserva e investimentos

Tudo fica salvo em SQLite no proprio dispositivo.

## O que o app faz hoje

- onboarding local com nome e foto de perfil
- dashboard mensal com cards de resumo
- grafico simples de distribuicao dos gastos do mes
- card com maiores gastos do periodo
- filtro de mes com navegacao entre meses na aba `Resumo`
- filtro por tipo de bloco
- ordenacao alfabetica, por valor, por vencimento ou por data
- cadastro de renda, despesa fixa, parcela, pessoa a pagar e investimento
- listagem dos itens do mes com acoes rapidas
- edicao de nome e foto na aba `Config`
- barra de progresso nas parcelas
- marcacao de parcelas pagas
- marcacao de pagamentos para pessoas como concluidos ou reabertos
- lembretes locais para pessoas a pagar no dia configurado, quando a permissao de notificacao e concedida
- reset do banco local mantendo o perfil do usuario

## Fluxo atual

1. no primeiro acesso, o usuario configura nome e foto
2. escolhe o mes que quer visualizar na aba `Resumo`
3. adiciona os blocos do planejamento mensal nas outras abas usando esse mesmo mes ativo
4. acompanha cards, grafico, maiores gastos e sobra no dashboard
5. entra em "Itens do mes" para ordenar, revisar, remover e marcar pagamentos

## Telas atuais

- `Resumo`
- `Cadastro`
- `Itens`
- `Config`

## Dominio ativo do app

Hoje o fluxo principal roda em cima destas tabelas:

- `income_items`
- `fixed_expense_items`
- `installment_items`
- `person_payment_items`
- `investment_items`
- `user_profile`

As tabelas `accounts`, `categories`, `entries` e `recurring_entries` continuam no schema como base para uma expansao futura, mas nao sao o centro do fluxo atual da interface.

## Regras atuais de negocio

### Mes financeiro

Cada item e salvo com `competenceMonth`.

O filtro de mes controla:

- o que aparece no dashboard
- o que aparece na lista de itens
- o mes em que novos cadastros sao salvos

### Parcelas

Parcelas possuem:

- valor mensal
- dia de vencimento
- quantidade total
- quantidade paga
- referencia opcional

No dashboard e na lista, cada parcela mostra:

- progresso percentual
- valor ja pago
- valor restante
- quantidade restante

### Pessoas a pagar

Pagamentos para pessoas possuem:

- nome da pessoa
- valor
- dia do pagamento
- descricao opcional
- status pago / em aberto

Quando o vencimento esta no futuro e a permissao de notificacao foi aceita, o app agenda um lembrete local no aparelho para o dia configurado.

## Stack

- Expo 54
- React Native
- TypeScript
- NativeWind
- SQLite local com `expo-sqlite`
- Drizzle ORM
- `expo-image-picker`
- `expo-notifications`

## Persistencia

O app nao depende de backend hoje.

Persistencia atual:

- perfil local no SQLite
- dados financeiros no SQLite
- foto de perfil salva no armazenamento do app
- lembretes via notificacoes locais

## Estrutura principal

```text
src/
  app/
    dashboard/
    entries/
    recurring-entries/
    settings/
    welcome/
  components/
    branding/
    planner/
    profile/
    ui/
  core/
    navigation/
  domain/
    finance/
    planner/
    user/
  service/
    notifications/
    planner/
    user/
  storage/
    profile/
    sqlite/
  styles/
  theme/
  utils/
```

## Scripts

- `npm run start`
- `npm run android`
- `npm run android:emulator`
- `npm run android:boot-emulator`
- `npm run android:env`
- `npm run doctor`
- `npm run build:configure`
- `npm run build:android:preview`
- `npm run build:android:production`
- `npm run build:ios:preview`
- `npm run build:ios:production`
- `npm run web`
- `npm run lint`
- `npm run format`

## Build e release

O projeto agora ja tem base para comecar a buildar com EAS.

Identificadores atuais:

- Android package: `com.finasp.app`
- iOS bundle identifier: `com.finasp.app`

Perfis atuais em `eas.json`:

- `development`: dev client interno
- `preview`: build interno para testes
- `production`: build de producao com incremento automatico de versao nativa

Se voce quiser publicar com outro identificador nas lojas, ajuste esses valores em `app.json` antes da primeira publicacao oficial.

## Desenvolvimento

### Banco local

O app cria a estrutura inicial do SQLite automaticamente ao abrir.

Arquivos locais de banco e pastas geradas de migration nao fazem parte do versionamento do projeto.

### UI

A interface atual usa tema escuro proprio do app, com tokens centralizados em:

- `src/styles/global.css`
- `src/theme/app-colors.ts`

## Limites atuais

- sem sincronizacao cloud
- sem autenticacao remota
- sem exportacao
- sem suite automatizada de testes no repositrio

## Objetivo do app

O foco atual e responder rapidamente:

- quanto entrou
- quanto ja esta comprometido
- quanto foi reservado
- quais sao os maiores gastos
- quanto deve sobrar no fim do mes
