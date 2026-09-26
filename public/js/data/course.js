/**
 * Percurso do curso: o "mapa do metrô de Seul".
 *
 * Cada trimestre é uma LINHA e cada unidade é uma ESTAÇÃO. Uma estação sem
 * `steps` ainda não tem conteúdo e aparece no mapa como "Em breve".
 *
 * Formato dos passos (ver lib/lesson.js):
 *  - learn(título, texto, [[hangul, romanização, português], …])
 *  - choice({ prompt, ko?, listen?, lang, options, answer, explain? })
 *      lang = idioma das opções: 'ko' (Hangul), 'pt' ou 'rom' (romanização)
 *  - build(tradução, peças certas, peças a mais, explicação?)
 *  - read(hangul, [romanizações aceitas], tradução)
 */

const learn = (title, text, items) => ({
  type: 'learn',
  title,
  text,
  items: items.map(([ko, rom, pt]) => ({ ko, rom, pt })),
});

const choice = ({ prompt, ko, listen = false, lang, options, answer, explain }) => ({
  type: 'choice',
  prompt,
  ko,
  listen,
  lang,
  options,
  answer,
  explain,
});

const build = (pt, tiles, extra, explain) => ({ type: 'build', pt, tiles, extra, explain });

const read = (ko, answers, pt) => ({ type: 'read', ko, answers, pt });

export const LINES = [
  {
    id: 'l1',
    number: 1,
    name: 'Chegar a Seul',
    months: 'Meses 1–3',
    level: 'zero',
    tag: 'A1 · TOPIK 1',
    goal: 'Kit de viagem',
  },
  {
    id: 'l2',
    number: 2,
    name: 'O dia a dia',
    months: 'Meses 4–6',
    level: 'basico',
    tag: 'A2 · TOPIK 2',
    goal: 'Conversas simples',
  },
  {
    id: 'l3',
    number: 3,
    name: 'Conversar',
    months: 'Meses 7–9',
    level: 'intermedio',
    tag: 'B1 · TOPIK 3',
    goal: 'Falar sem roteiro',
  },
  {
    id: 'l4',
    number: 4,
    name: 'Viver em coreano',
    months: 'Meses 10–12',
    level: 'avancado',
    tag: 'B1+ · TOPIK 3–4',
    goal: 'Autonomia',
  },
];

// prettier-ignore
export const STATIONS = [
  /* ───────────── Linha 1 · Chegar a Seul ───────────── */
  {
    id: 'l1-vogais',
    line: 'l1',
    title: 'Vogais básicas',
    minutes: 6,
    stamp: { ko: '모음', pt: 'Vogais' },
    steps: [
      learn(
        'As vogais',
        'No começo da sílaba, a vogal vem sempre com o ㅇ, que é mudo. Clique no alto-falante para ouvir.',
        [
          ['아', 'a', 'como o "á" de "pá"'],
          ['어', 'eo', '"ó" aberto, sem arredondar a boca'],
          ['오', 'o', '"ô" fechado, boca redonda'],
          ['우', 'u', 'como o "u" de "tatu"'],
          ['으', 'eu', '"u" com os lábios esticados'],
          ['이', 'i', 'como o "i" de "vi"'],
        ],
      ),
      choice({ prompt: 'Qual é o som desta sílaba?', ko: '오', lang: 'rom', options: ['o', 'a', 'u', 'eo'], answer: 'o' }),
      choice({ prompt: 'Qual destas se lê "eo"?', lang: 'ko', options: ['어', '아', '오', '우'], answer: '어' }),
      choice({ prompt: 'Ouça e escolha a sílaba certa.', ko: '우', listen: true, lang: 'ko', options: ['우', '으', '오', '이'], answer: '우' }),
      learn(
        'Um tracinho a mais',
        'Um traço extra acrescenta um "i" antes da vogal: ㅏ vira ㅑ, ㅓ vira ㅕ, e assim por diante.',
        [
          ['야', 'ya', '"iá"'],
          ['여', 'yeo', '"ió" aberto'],
          ['요', 'yo', '"iô"'],
          ['유', 'yu', '"iu"'],
        ],
      ),
      choice({ prompt: 'Qual é o som desta sílaba?', ko: '요', lang: 'rom', options: ['yo', 'ya', 'yu', 'yeo'], answer: 'yo' }),
      read('아이', ['ai'], 'criança'),
      read('우유', ['uyu'], 'leite'),
      read('오이', ['oi'], 'pepino'),
      build('leite', ['우', '유'], ['아', '요']),
    ],
  },
  {
    id: 'l1-consoantes',
    line: 'l1',
    title: 'Consoantes básicas',
    minutes: 7,
    stamp: { ko: '자음', pt: 'Consoantes' },
    steps: [
      learn('Primeiras consoantes', 'Aqui cada consoante aparece com a vogal ㅏ, para você ouvir o som.', [
        ['가', 'ga', 'entre "gá" e "cá"'],
        ['나', 'na', 'como "ná"'],
        ['다', 'da', 'entre "dá" e "tá"'],
        ['라', 'ra', 'como o "r" de "caro"'],
        ['마', 'ma', 'como "má"'],
      ]),
      learn('Mais consoantes', 'O ㅇ é mudo no começo da sílaba: 아 se lê só "a".', [
        ['바', 'ba', 'entre "bá" e "pá"'],
        ['사', 'sa', 'como "sá"'],
        ['자', 'ja', 'como "djá"'],
        ['하', 'ha', '"h" soprado'],
        ['아', 'a', 'ㅇ mudo + ㅏ'],
      ]),
      choice({ prompt: 'Qual é o som desta sílaba?', ko: '나', lang: 'rom', options: ['na', 'da', 'ma', 'ra'], answer: 'na' }),
      choice({ prompt: 'Qual sílaba se lê "ma"?', lang: 'ko', options: ['마', '바', '나', '사'], answer: '마' }),
      choice({ prompt: 'Ouça e escolha a sílaba certa.', ko: '다', listen: true, lang: 'ko', options: ['다', '라', '나', '가'], answer: '다' }),
      read('나무', ['namu'], 'árvore'),
      read('바다', ['bada'], 'mar'),
      read('하마', ['hama'], 'hipopótamo'),
      read('모자', ['moja'], 'boné / chapéu'),
      choice({ prompt: 'O que significa esta palavra?', ko: '바다', lang: 'pt', options: ['mar', 'árvore', 'país', 'boné'], answer: 'mar' }),
      build('país', ['나', '라'], ['다', '마']),
    ],
  },
  {
    id: 'l1-sons',
    line: 'l1',
    title: 'Com sopro e tensas',
    minutes: 6,
    stamp: { ko: '소리', pt: 'Sons' },
    steps: [
      learn(
        'Consoantes com sopro',
        'Coloque a mão na frente da boca: nestas consoantes você sente um sopro de ar.',
        [
          ['카', 'ka', '"k" com sopro'],
          ['타', 'ta', '"t" com sopro'],
          ['파', 'pa', '"p" com sopro'],
          ['차', 'cha', '"tch" com sopro'],
        ],
      ),
      learn('Consoantes tensas', 'As letras dobradas são tensas: sem ar e com a garganta firme.', [
        ['까', 'kka', '"k" tenso'],
        ['따', 'tta', '"t" tenso'],
        ['빠', 'ppa', '"p" tenso'],
        ['싸', 'ssa', '"s" forte'],
        ['짜', 'jja', '"tch" tenso'],
      ]),
      choice({
        prompt: 'Qual destas tem sopro de ar?',
        lang: 'ko',
        options: ['타', '다', '따'],
        answer: '타',
        explain: 'ㅌ é a versão com sopro de ㄷ. As letras dobradas, como ㄸ, são tensas e sem ar.',
      }),
      choice({
        prompt: 'Qual destas é tensa?',
        lang: 'ko',
        options: ['빠', '바', '파'],
        answer: '빠',
        explain: 'As consoantes tensas são as dobradas: ㄲ ㄸ ㅃ ㅆ ㅉ.',
      }),
      choice({ prompt: 'Ouça e escolha a sílaba certa.', ko: '카', listen: true, lang: 'ko', options: ['카', '가', '까'], answer: '카' }),
      read('커피', ['keopi'], 'café'),
      read('토마토', ['tomato'], 'tomate'),
      read('아빠', ['appa'], 'papai'),
      read('코', ['ko'], 'nariz'),
      build('pizza', ['피', '자'], ['비', '차']),
    ],
  },
  {
    id: 'l1-batchim',
    line: 'l1',
    title: 'Batchim e primeiras palavras',
    minutes: 7,
    stamp: { ko: '받침', pt: 'Batchim' },
    steps: [
      learn(
        'A consoante de baixo',
        'A consoante que fica embaixo da sílaba é o batchim. No fim da sílaba só existem 7 sons: k, n, t, l, m, p e ng.',
        [
          ['밥', 'bap', 'arroz / refeição'],
          ['물', 'mul', 'água'],
          ['산', 'san', 'montanha'],
          ['강', 'gang', 'rio'],
          ['밖', 'bak', 'lado de fora'],
          ['옷', 'ot', 'roupa'],
        ],
      ),
      choice({
        prompt: 'Qual é o som final desta palavra?',
        ko: '옷',
        lang: 'rom',
        options: ['t', 's', 'ch', 'n'],
        answer: 't',
        explain: 'No fim da sílaba, ㅅ soa como "t". Por isso 옷 se lê "ot".',
      }),
      choice({
        prompt: 'Qual é o som final desta palavra?',
        ko: '밖',
        lang: 'rom',
        options: ['k', 'kk', 'g', 'ng'],
        answer: 'k',
        explain: 'ㄲ no fim da sílaba soa como um "k" simples.',
      }),
      read('한국', ['hanguk'], 'Coreia'),
      read('김치', ['gimchi', 'kimchi'], 'kimchi'),
      read('사랑', ['sarang'], 'amor'),
      read('학생', ['haksaeng'], 'estudante'),
      choice({ prompt: 'O que significa esta palavra?', ko: '사랑', lang: 'pt', options: ['amor', 'água', 'roupa', 'rio'], answer: 'amor' }),
      build('Coreia', ['한', '국'], ['항', '극']),
    ],
  },
  {
    id: 'l1-cumprimentos',
    line: 'l1',
    title: 'Cumprimentos',
    minutes: 7,
    stamp: { ko: '인사', pt: 'Cumprimentos' },
    steps: [
      learn('Palavras mágicas', 'Com estas quatro você já resolve muita coisa na Coreia.', [
        ['안녕하세요', 'annyeonghaseyo', 'Olá (educado)'],
        ['감사합니다', 'gamsahamnida', 'Obrigado(a) (formal)'],
        ['네', 'ne', 'Sim'],
        ['아니요', 'aniyo', 'Não'],
      ]),
      learn(
        'Desculpas e despedidas',
        'Há dois "tchau": 가세요 ("vá bem") para quem vai embora e 계세요 ("fique bem") para quem fica.',
        [
          ['죄송합니다', 'joesonghamnida', 'Desculpe (formal)'],
          ['괜찮아요', 'gwaenchanayo', 'Tudo bem / Não tem problema'],
          ['안녕히 가세요', 'annyeonghi gaseyo', 'Tchau (para quem vai embora)'],
          ['안녕히 계세요', 'annyeonghi gyeseyo', 'Tchau (para quem fica)'],
        ],
      ),
      choice({ prompt: 'Como dizer "obrigado(a)" de forma formal?', lang: 'ko', options: ['감사합니다', '죄송합니다', '안녕하세요', '괜찮아요'], answer: '감사합니다' }),
      choice({ prompt: 'Ouça e escolha o significado.', ko: '안녕하세요', listen: true, lang: 'pt', options: ['Olá', 'Obrigado(a)', 'Desculpe', 'Sim'], answer: 'Olá' }),
      choice({ prompt: 'Você esbarrou em alguém no metrô. O que você diz?', lang: 'ko', options: ['죄송합니다', '감사합니다', '네', '안녕히 계세요'], answer: '죄송합니다' }),
      choice({
        prompt: 'Você sai de uma loja e o vendedor fica lá. Você diz:',
        lang: 'ko',
        options: ['안녕히 계세요', '안녕히 가세요'],
        answer: '안녕히 계세요',
        explain: '계세요 é para quem FICA (o vendedor). 가세요 é para quem VAI embora.',
      }),
      choice({ prompt: 'O que significa esta palavra?', ko: '아니요', lang: 'pt', options: ['Não', 'Sim', 'Tudo bem', 'Olá'], answer: 'Não' }),
      build('Tchau (para quem vai embora)', ['안녕히', '가세요'], ['계세요', '하세요']),
      read('네', ['ne'], 'sim'),
    ],
  },
  {
    id: 'l1-apresentacao',
    line: 'l1',
    title: 'Apresentar-se',
    minutes: 8,
    stamp: { ko: '소개', pt: 'Apresentação' },
    steps: [
      learn(
        'Quem é você?',
        'Para dizer "eu sou…", use 저는 + nome + 이에요 (depois de consoante) ou 예요 (depois de vogal).',
        [
          ['저는 학생이에요', 'jeoneun haksaengieyo', 'Eu sou estudante'],
          ['저는 마리아예요', 'jeoneun mariayeyo', 'Eu sou a Maria'],
          ['이름이 뭐예요?', 'ireumi mwoyeyo', 'Qual é o seu nome?'],
          ['만나서 반가워요', 'mannaseo bangawoyo', 'Prazer em conhecer'],
          ['저도 반가워요', 'jeodo bangawoyo', 'O prazer é meu'],
        ],
      ),
      learn('De onde você é?', 'Frases para falar de você.', [
        ['브라질 사람이에요', 'beurajil saramieyo', 'Sou brasileiro(a)'],
        ['포르투갈에 살아요', 'poreutugare sarayo', 'Moro em Portugal'],
        ['한국어를 공부해요', 'hangugeoreul gongbuhaeyo', 'Estudo coreano'],
      ]),
      choice({
        prompt: '학생 termina em consoante (ㅇ). Qual forma está certa?',
        lang: 'ko',
        options: ['학생이에요', '학생예요'],
        answer: '학생이에요',
        explain: 'Depois de consoante usamos 이에요. Depois de vogal, 예요.',
      }),
      choice({
        prompt: '의사 (médico) termina em vogal. Qual forma está certa?',
        lang: 'ko',
        options: ['의사예요', '의사이에요'],
        answer: '의사예요',
        explain: 'Depois de vogal usamos 예요.',
      }),
      choice({ prompt: 'Ouça e escolha o significado.', ko: '이름이 뭐예요?', listen: true, lang: 'pt', options: ['Qual é o seu nome?', 'Prazer em conhecer', 'Onde você mora?', 'Eu sou estudante'], answer: 'Qual é o seu nome?' }),
      build('Eu sou estudante.', ['저는', '학생이에요'], ['의사예요', '저도']),
      build('Sou brasileiro(a).', ['브라질', '사람이에요'], ['포르투갈', '살아요']),
      choice({ prompt: 'Alguém diz 만나서 반가워요. Como você responde?', lang: 'ko', options: ['저도 반가워요', '죄송합니다', '아니요'], answer: '저도 반가워요' }),
      read('이름', ['ireum'], 'nome'),
    ],
  },
  {
    id: 'l1-numeros',
    line: 'l1',
    title: 'Números e dinheiro',
    minutes: 8,
    stamp: { ko: '숫자', pt: 'Números' },
    steps: [
      learn('De 1 a 5', 'Estes são os números sino-coreanos, usados com dinheiro, datas e telefones.', [
        ['일', 'il', '1'],
        ['이', 'i', '2'],
        ['삼', 'sam', '3'],
        ['사', 'sa', '4'],
        ['오', 'o', '5'],
      ]),
      learn('De 6 a 10', 'Para 20, 30…: 이십 (2 × 10), 삼십 (3 × 10).', [
        ['육', 'yuk', '6'],
        ['칠', 'chil', '7'],
        ['팔', 'pal', '8'],
        ['구', 'gu', '9'],
        ['십', 'sip', '10'],
      ]),
      learn(
        'Dinheiro',
        'Atenção: em coreano, 10.000 tem nome próprio, 만. Por isso 20.000 é 이만 ("dois dez-mil").',
        [
          ['백', 'baek', '100'],
          ['천', 'cheon', '1.000'],
          ['만', 'man', '10.000'],
          ['원', 'won', 'won (a moeda coreana)'],
          ['얼마예요?', 'eolmayeyo', 'Quanto custa?'],
        ],
      ),
      choice({ prompt: 'Qual é o número 7?', lang: 'ko', options: ['칠', '팔', '일', '사'], answer: '칠' }),
      choice({ prompt: 'Ouça e escolha o número.', ko: '삼', listen: true, lang: 'pt', options: ['3', '4', '8', '10'], answer: '3' }),
      choice({
        prompt: 'Como se diz 20?',
        lang: 'ko',
        options: ['이십', '십이', '이백', '이천'],
        answer: '이십',
        explain: '이십 = 2 × 10. Já 십이 = 10 + 2 = 12.',
      }),
      choice({ prompt: 'Quanto é isto?', ko: '오천 원', lang: 'pt', options: ['5.000 won', '500 won', '50.000 won', '5 won'], answer: '5.000 won' }),
      choice({
        prompt: 'Como se diz 10.000 won?',
        lang: 'ko',
        options: ['만 원', '십천 원', '천 원', '백 원'],
        answer: '만 원',
        explain: 'Os coreanos contam em blocos de 10.000 (만), não de 1.000.',
      }),
      read('육', ['yuk'], '6'),
      build('3.000 won', ['삼천', '원'], ['삼백', '천']),
    ],
  },
  {
    id: 'l1-cafe',
    line: 'l1',
    title: 'No café',
    minutes: 8,
    stamp: { ko: '카페', pt: 'Café' },
    steps: [
      learn(
        'Fazendo o pedido',
        '주세요 quer dizer "me dê, por favor". Serve para pedir quase tudo! 한 é o número 1 nativo, usado para contar coisas.',
        [
          ['아메리카노', 'amerikano', 'americano (café)'],
          ['한 잔', 'han jan', 'um copo / uma xícara'],
          ['주세요', 'juseyo', 'me dê, por favor'],
          ['아메리카노 한 잔 주세요', 'amerikano han jan juseyo', 'Um americano, por favor'],
        ],
      ),
      learn('No balcão', 'Frases que você vai ouvir e usar.', [
        ['따뜻한 거', 'ttatteutan geo', 'quente'],
        ['아이스', 'aiseu', 'gelado'],
        ['여기서 먹을게요', 'yeogiseo meogeulgeyo', 'Vou comer aqui'],
        ['포장해 주세요', 'pojanghae juseyo', 'Para viagem, por favor'],
        ['여기요!', 'yeogiyo', 'Com licença! (para chamar o atendente)'],
      ]),
      choice({ prompt: 'Para pedir algo educadamente, termine a frase com:', lang: 'ko', options: ['주세요', '있어요', '이에요', '가요'], answer: '주세요' }),
      choice({ prompt: 'Ouça e escolha o significado.', ko: '포장해 주세요', listen: true, lang: 'pt', options: ['Para viagem, por favor', 'Vou comer aqui', 'Quente, por favor', 'Com licença!'], answer: 'Para viagem, por favor' }),
      choice({ prompt: 'Você quer chamar o atendente. O que diz?', lang: 'ko', options: ['여기요!', '안녕히 계세요', '네', '감사합니다'], answer: '여기요!' }),
      build('Um americano, por favor.', ['아메리카노', '한 잔', '주세요'], ['두 잔', '있어요']),
      choice({ prompt: 'O atendente pergunta "따뜻한 거요?". Ele quer saber se o café é:', lang: 'pt', options: ['quente', 'grande', 'para viagem', 'doce'], answer: 'quente' }),
      build('Vou comer aqui.', ['여기서', '먹을게요'], ['포장해', '거기서']),
      read('커피', ['keopi'], 'café'),
    ],
  },
  {
    id: 'l1-metro',
    line: 'l1',
    title: 'No metrô',
    minutes: 8,
    stamp: { ko: '지하철', pt: 'Metrô' },
    steps: [
      learn('Palavras do metrô', 'O metrô de Seul é enorme, mas as placas são claras quando você conhece estas palavras.', [
        ['지하철', 'jihacheol', 'metrô'],
        ['역', 'yeok', 'estação'],
        ['호선', 'hoseon', 'linha (2호선 = linha 2)'],
        ['출구', 'chulgu', 'saída'],
        ['갈아타다', 'garatada', 'fazer baldeação'],
      ]),
      learn('Perguntas e avisos', 'A última frase é o aviso que você ouve dentro do trem.', [
        ['명동역이 어디예요?', 'myeongdongyeogi eodiyeyo', 'Onde fica a estação Myeongdong?'],
        ['몇 호선이에요?', 'myeot hoseonieyo', 'Qual é a linha?'],
        ['3번 출구', 'sambeon chulgu', 'saída 3'],
        ['다음 역은 서울역입니다', 'daeum yeogeun seoullyeogimnida', 'A próxima estação é a Estação de Seul'],
      ]),
      choice({ prompt: 'O que significa esta palavra?', ko: '출구', lang: 'pt', options: ['saída', 'entrada', 'linha', 'estação'], answer: 'saída' }),
      choice({ prompt: 'Ouça o aviso e escolha o significado.', ko: '다음 역은 서울역입니다', listen: true, lang: 'pt', options: ['A próxima estação é a Estação de Seul', 'Onde fica a Estação de Seul?', 'Faça baldeação na Estação de Seul', 'Saída 3'], answer: 'A próxima estação é a Estação de Seul' }),
      choice({ prompt: 'Para perguntar onde fica algo, termine com:', lang: 'ko', options: ['어디예요?', '얼마예요?', '뭐예요?', '주세요'], answer: '어디예요?' }),
      build('Onde fica a estação Myeongdong?', ['명동역이', '어디예요?'], ['얼마예요?', '출구']),
      choice({ prompt: '2호선 quer dizer:', lang: 'pt', options: ['a linha 2', 'a saída 2', '2 estações', '2 bilhetes'], answer: 'a linha 2' }),
      read('역', ['yeok'], 'estação'),
      read('출구', ['chulgu'], 'saída'),
    ],
  },
  {
    id: 'l1-compras',
    line: 'l1',
    title: 'Compras',
    minutes: 8,
    stamp: { ko: '쇼핑', pt: 'Compras' },
    steps: [
      learn('Na loja', '이거 quer dizer "isto" — aponte e pergunte!', [
        ['이거', 'igeo', 'isto'],
        ['이거 얼마예요?', 'igeo eolmayeyo', 'Quanto custa isto?'],
        ['카드 돼요?', 'kadeu dwaeyo', 'Aceita cartão?'],
        ['봉투', 'bongtu', 'sacola'],
      ]),
      learn('No mercado', 'Pedir desconto é comum nos mercados de rua, mas não nas lojas.', [
        ['너무 비싸요', 'neomu bissayo', 'Está muito caro'],
        ['좀 깎아 주세요', 'jom kkakka juseyo', 'Me dá um desconto?'],
        ['영수증 주세요', 'yeongsujeung juseyo', 'O recibo, por favor'],
        ['이거 주세요', 'igeo juseyo', 'Vou levar isto'],
      ]),
      choice({ prompt: 'Ouça e escolha o significado.', ko: '카드 돼요?', listen: true, lang: 'pt', options: ['Aceita cartão?', 'Quanto custa?', 'Tem sacola?', 'Está caro'], answer: 'Aceita cartão?' }),
      choice({ prompt: 'No mercado, o preço parece alto. Você diz:', lang: 'ko', options: ['너무 비싸요', '너무 싸요', '감사합니다', '카드 돼요?'], answer: '너무 비싸요' }),
      build('Quanto custa isto?', ['이거', '얼마예요?'], ['저거', '주세요']),
      build('O recibo, por favor.', ['영수증', '주세요'], ['봉투', '얼마예요?']),
      choice({ prompt: 'O vendedor pergunta "봉투 필요하세요?". Ele está oferecendo:', lang: 'pt', options: ['uma sacola', 'um desconto', 'o recibo', 'o troco'], answer: 'uma sacola' }),
      choice({
        prompt: 'Quanto é isto?',
        ko: '만 오천 원',
        lang: 'pt',
        options: ['15.000 won', '5.000 won', '10.500 won', '1.500 won'],
        answer: '15.000 won',
        explain: '만 (10.000) + 오천 (5.000) = 15.000 won.',
      }),
      read('이거', ['igeo'], 'isto'),
    ],
  },

  /* ───────────── Linhas 2 a 4: em construção ───────────── */
  { id: 'l2-tempos', line: 'l2', title: 'Passado e futuro', minutes: 10, stamp: { ko: '시제', pt: 'Tempos' } },
  { id: 'l2-rotina', line: 'l2', title: 'Rotina, família e casa', minutes: 10, stamp: { ko: '일상', pt: 'Rotina' } },
  { id: 'l2-planos', line: 'l2', title: 'Planos e convites', minutes: 10, stamp: { ko: '약속', pt: 'Planos' } },
  { id: 'l2-telefone', line: 'l2', title: 'Telefonar e marcar encontros', minutes: 10, stamp: { ko: '전화', pt: 'Telefone' } },
  { id: 'l2-conectores', line: 'l2', title: 'Ligar ideias: -고, -아서, -지만', minutes: 10, stamp: { ko: '연결', pt: 'Conectores' } },
  { id: 'l3-respeito', line: 'l3', title: 'Formas de respeito -(으)시-', minutes: 12, stamp: { ko: '존댓말', pt: 'Respeito' } },
  { id: 'l3-opinioes', line: 'l3', title: 'Dar opiniões e comparar', minutes: 12, stamp: { ko: '의견', pt: 'Opiniões' } },
  { id: 'l3-historias', line: 'l3', title: 'Contar histórias', minutes: 12, stamp: { ko: '이야기', pt: 'Histórias' } },
  { id: 'l3-discurso', line: 'l3', title: 'Contar o que outros disseram', minutes: 12, stamp: { ko: '전달', pt: 'Recados' } },
  { id: 'l3-leitura', line: 'l3', title: 'Ler textos curtos', minutes: 12, stamp: { ko: '읽기', pt: 'Leitura' } },
  { id: 'l4-noticias', line: 'l4', title: 'Notícias fáceis e dramas', minutes: 15, stamp: { ko: '뉴스', pt: 'Notícias' } },
  { id: 'l4-escrita', line: 'l4', title: 'Escrever parágrafos', minutes: 15, stamp: { ko: '쓰기', pt: 'Escrita' } },
  { id: 'l4-trabalho', line: 'l4', title: 'Entrevista e trabalho', minutes: 15, stamp: { ko: '면접', pt: 'Trabalho' } },
  { id: 'l4-topik', line: 'l4', title: 'Simulado TOPIK', minutes: 20, stamp: { ko: '시험', pt: 'TOPIK' } },
];

export const findStation = (id) => STATIONS.find((station) => station.id === id);
export const findLine = (id) => LINES.find((line) => line.id === id);
export const stationsOfLine = (lineId) => STATIONS.filter((station) => station.line === lineId);
export const hasContent = (station) => Array.isArray(station.steps) && station.steps.length > 0;
