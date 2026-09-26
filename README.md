# Haru (하루) · Coreano, um dia de cada vez

Plataforma web **gratuita** para aprender coreano **do zero**, com interface em **português do
Brasil**. O Hangul aparece sempre acompanhado da **romanização revista** e da tradução.

**Escopo atual, com honestidade:** as Linhas 1 e 2 formam um curso completo de cerca de
**6 meses** (A1 → A2, nível do TOPIK 1–2) para quem estuda uns 15 minutos por dia. As Linhas
3 e 4 (B1) existem em versão introdutória e vão crescer.

🌐 Site: <https://sccpscar.github.io/KoreanCourse/>

## Funcionalidades

| Área                 | O que tem                                                                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Percurso**         | Um "mapa do metrô de Seul" com 80 estações (lições de 6 a 15 min): Linhas 1 e 2 completas (30 estações cada) e Linhas 3 e 4 introdutórias (10 cada), com Passaporte de selos |
| **Praticar**         | Flashcards com repetição espaçada (SM-2), Quiz relâmpago, Leitura rápida (60 s) e Pronúncia com microfone                                                                    |
| **Hangul**           | Tabelas de vogais e consoantes, treino de leitura, batchim e ordem dos traços animada                                                                                        |
| **Vocabulário**      | 703 palavras em 17 categorias e 4 níveis, com áudio                                                                                                                          |
| **Gramática**        | 38 pontos explicados com exemplos e tabelas                                                                                                                                  |
| **Motivação**        | Dias seguidos (com 1 dia de descanso por semana), meta diária de 5 a 30 min, sem "vidas" nem notificações de culpa                                                           |
| **Conta (opcional)** | Registro para maiores de 13 anos, sincronização entre aparelhos, exportar e apagar os dados                                                                                  |

Sem conta, tudo funciona igual e o progresso fica no navegador.

## Tecnologias e decisões

- **HTML, CSS e JavaScript puros** (módulos ES), sem framework e sem etapa de build: o
  que está em `public/` é exatamente o que vai para o ar.
- **GitHub Pages** para hospedar (gratuito e estático).
- **Supabase** (Postgres + Auth, região UE/Paris) para as contas. Todas as tabelas têm
  **Row Level Security**: cada pessoa só lê e escreve as próprias linhas.
- **Web Speech API** do navegador para o áudio (síntese de voz) e para o reconhecimento de fala.
- **Fontes auto-hospedadas** (Bricolage Grotesque, Lexend, Jua e Noto Sans KR): nenhum
  pedido a serviços de terceiros para carregar a página.
- **Segurança**: Content-Security-Policy restritiva (só scripts do próprio site), nada de
  `innerHTML` com texto do usuário (usamos `textContent`/`esc()`), nenhum `onclick` ou
  `style` inline.
- **Qualidade**: ESLint, Prettier, Vitest (testes unitários) e Playwright (testes no
  navegador), todos rodando no GitHub Actions.

### Estrutura de pastas

```text
public/                 site publicado
├── index.html          aplicação (uma única página, com rotas por #)
├── privacidade.html    política de privacidade (RGPD/LGPD)
├── css/                variáveis de design, componentes e estilos de cada área
├── js/
│   ├── main.js         ponto de entrada ÚNICO: chama os init*() de cada módulo
│   ├── core/           infraestrutura: rotas, armazenamento, contas, sincronização, microfone…
│   ├── lib/            lógica PURA (sem DOM), toda testada: SRS, streak, lições, quiz…
│   ├── data/           conteúdo: curso (data/course/line-N.js), vocabulário, gramática, Hangul
│   └── features/       telas: Início, lições, flashcards, jogos, conta…
├── fonts/ e vendor/    fontes e a biblioteca do Supabase (copiadas do npm)
supabase/migrations/    SQL do banco de dados (tabelas, RLS e funções)
tests/                  testes unitários (Vitest)
e2e/                    testes no navegador (Playwright)
scripts/                servidor local e cópia de fontes/bibliotecas
```

A regra de ouro da arquitetura: **a lógica fica em `lib/` (funções puras, fáceis de testar)
e as telas em `features/` só desenham e reagem a cliques**.

## Rodar no seu computador

Pré-requisito: [Node.js](https://nodejs.org/) 20 ou mais recente.

```bash
npm install
npm run dev        # site em http://localhost:5173
```

| Comando            | Para quê                                                       |
| ------------------ | -------------------------------------------------------------- |
| `npm run lint`     | ESLint + verificação de formatação (Prettier)                  |
| `npm run format`   | Formata todos os arquivos                                      |
| `npm test`         | Testes unitários (Vitest)                                      |
| `npm run test:e2e` | Testes no navegador (Playwright), inclusive jogar as 80 lições |
| `npm run fonts`    | Copia as fontes do npm para `public/fonts/`                    |
| `npm run vendor`   | Copia a biblioteca do Supabase para `public/vendor/`           |

Na primeira vez, os testes e2e precisam do navegador: `npx playwright install chromium`.

## Publicação

1. No GitHub: **Settings → Pages → Source: GitHub Actions** (uma vez só).
2. Cada `push` na branch `main` roda o workflow `pages.yml`, que publica a pasta `public/`.

### Supabase (contas)

1. Aplique as migrações de `supabase/migrations/` no projeto (em ordem).
2. **Authentication → URL Configuration**: Site URL = endereço do GitHub Pages; em Redirect
   URLs, acrescente também `http://localhost:5173`.
3. **Authentication → Emails → SMTP Settings**: configure um SMTP próprio (o do Supabase só
   serve para testes).
4. Em `public/js/config.js` ficam a URL do projeto e a **chave publicável** (ela é pública
   por natureza; a proteção dos dados vem do RLS). Nunca coloque a chave `service_role` no
   site.

Atenção: no plano gratuito, o Supabase pausa o projeto depois de 7 dias sem uso. Para
reativar, é só entrar no painel e clicar em **Restore**.

## Como acrescentar conteúdo

- **Uma estação nova**: edite `public/js/data/course/line-N.js`. Os passos são criados
  pelas funções de `data/course/steps.js`: `learn`, `choice`, `build` e `read`.
- **Uma palavra nova**: acrescente `['hangul', 'romanização', 'tradução', 'nível']` na
  categoria certa de `public/js/data/vocabulary.js`.
- Rode `npm test` e `npm run test:e2e`: os testes conferem se o Hangul e a romanização são
  válidos e se todas as lições podem ser concluídas.

## Privacidade e leis

O projeto segue o **RGPD** e a lei portuguesa (Lei n.º 58/2019 e Lei n.º 41/2004), e também
a **LGPD** para quem estuda do Brasil:

- sem cookies de rastreamento, sem analytics e sem publicidade;
- o `localStorage` guarda só o que é necessário para o site funcionar;
- contas só para maiores de 13 anos (idade de consentimento digital em Portugal);
- microfone apenas com consentimento explícito, que pode ser retirado;
- direito ao apagamento ("Apagar minha conta") e à portabilidade ("Baixar meus dados").

Detalhes em [`public/privacidade.html`](public/privacidade.html).

## Acessibilidade

Navegação completa pelo teclado (inclusive atalhos nos flashcards e jogos), atributos
`lang="ko"` no texto coreano, ARIA nas abas, diálogos e barras de progresso, contraste AA,
respeito a "reduzir movimento" e layout a partir de 360 px de largura. Os jogos com
cronômetro têm um modo sem tempo.

## Próximos passos

- Ampliar as Linhas 3 e 4 para 30 estações cada (meses 7 a 12) e o vocabulário para ~1.500
  palavras.
- Diálogos e textos mais longos para ouvir e ler.
- Revisão da romanização e das frases por um falante nativo.
- Tutor com IA (conversa e correção de textos): adiado, para o projeto continuar sem custos.

## Licença

Código sob a licença [MIT](LICENSE). As fontes Bricolage Grotesque, Lexend, Jua e Noto Sans KR
estão sob a [SIL Open Font License 1.1](public/fonts/).
