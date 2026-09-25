/**
 * Pontos gramaticais, do nível zero ao avançado.
 *
 * Cada ponto tem: padrão em coreano, explicação em português,
 * uma tabela opcional e exemplos (hangul + romanização + tradução).
 */

export const GRAMMAR = [
  {
    id: 'topico',
    pattern: '은/는',
    title: 'Partícula de tópico',
    level: 'zero',
    explanation: [
      'Marca o tópico da frase — aquilo de que estamos a falar. É como dizer "quanto a…".',
      'Usa-se 은 depois de consoante e 는 depois de vogal. Também serve para contrastar ("eu, por acaso, …").',
    ],
    examples: [
      { ko: '저는 학생이에요.', rom: 'jeoneun haksaengieyo.', pt: 'Eu sou estudante.' },
      { ko: '오늘은 바빠요.', rom: 'oneureun bappayo.', pt: 'Hoje estou ocupado(a).' },
    ],
  },
  {
    id: 'sujeito',
    pattern: '이/가',
    title: 'Partícula de sujeito',
    level: 'zero',
    explanation: [
      'Marca o sujeito, sobretudo quando é informação nova ou quando se quer destacar QUEM faz a ação.',
      'Usa-se 이 depois de consoante e 가 depois de vogal. Atenção às formas irregulares: 나 → 내가, 저 → 제가, 너 → 네가.',
      'Diferença para 은/는: 저는 학생이에요 apresenta um tema ("quanto a mim…"); 제가 할게요 destaca quem ("sou EU que faço").',
    ],
    examples: [
      { ko: '고양이가 귀여워요.', rom: 'goyangiga gwiyeowoyo.', pt: 'O gato é fofo.' },
      { ko: '동생이 있어요.', rom: 'dongsaengi isseoyo.', pt: 'Tenho um irmão mais novo.' },
      { ko: '제가 할게요.', rom: 'jega halgeyo.', pt: 'Eu faço (isso).' },
    ],
  },
  {
    id: 'objeto',
    pattern: '을/를',
    title: 'Partícula de objeto',
    level: 'zero',
    explanation: [
      'Marca o objeto direto — aquilo que recebe a ação do verbo.',
      'Usa-se 을 depois de consoante e 를 depois de vogal. Na fala informal é muitas vezes omitida.',
    ],
    examples: [
      { ko: '밥을 먹어요.', rom: 'babeul meogeoyo.', pt: 'Como arroz. / Faço uma refeição.' },
      { ko: '커피를 마셔요.', rom: 'keopireul masyeoyo.', pt: 'Bebo café.' },
    ],
  },
  {
    id: 'ser',
    pattern: '이에요/예요',
    title: 'Verbo "ser" (polido)',
    level: 'zero',
    explanation: [
      'Junta-se diretamente ao nome: 이에요 depois de consoante e 예요 depois de vogal.',
      'A forma negativa é 이/가 아니에요 ("não sou / não é").',
    ],
    examples: [
      { ko: '학생이에요.', rom: 'haksaengieyo.', pt: 'Sou estudante.' },
      { ko: '의사예요.', rom: 'uisayeyo.', pt: 'Sou médico(a).' },
      {
        ko: '저는 한국 사람이 아니에요.',
        rom: 'jeoneun hanguk sarami anieyo.',
        pt: 'Não sou coreano(a).',
      },
    ],
  },
  {
    id: 'lugar-destino',
    pattern: '에',
    title: 'Destino, localização e tempo',
    level: 'zero',
    explanation: [
      'Indica para onde se vai (com 가다, 오다), onde algo está (com 있다, 없다) e quando algo acontece.',
      'Não muda com consoante ou vogal: é sempre 에.',
    ],
    examples: [
      { ko: '학교에 가요.', rom: 'hakgyoe gayo.', pt: 'Vou à escola.' },
      { ko: '집에 있어요.', rom: 'jibe isseoyo.', pt: 'Estou em casa.' },
      { ko: '세 시에 만나요.', rom: 'se sie mannayo.', pt: 'Encontramo-nos às três.' },
    ],
  },
  {
    id: 'lugar-acao',
    pattern: '에서',
    title: 'Lugar onde se faz uma ação / origem',
    level: 'basico',
    explanation: [
      'Indica o lugar onde uma AÇÃO acontece (estudar, comer, trabalhar…) e também a origem ("de").',
      'Compara: 집에 있어요 (estou em casa — existência) com 집에서 공부해요 (estudo em casa — ação).',
    ],
    examples: [
      {
        ko: '도서관에서 공부해요.',
        rom: 'doseogwaneseo gongbuhaeyo.',
        pt: 'Estudo na biblioteca.',
      },
      { ko: '포르투갈에서 왔어요.', rom: 'poreutugareseo wasseoyo.', pt: 'Vim de Portugal.' },
    ],
  },
  {
    id: 'presente',
    pattern: '-아요/어요/해요',
    title: 'Presente (polido)',
    level: 'zero',
    explanation: [
      'Tira-se o -다 do infinitivo para obter o radical. Se a última vogal do radical for ㅏ ou ㅗ, junta-se 아요; caso contrário, 어요. Os verbos em 하다 passam a 해요.',
      'Quando duas vogais se encontram, contraem-se: 가 + 아요 → 가요, 오 + 아요 → 와요, 마시 + 어요 → 마셔요.',
    ],
    table: {
      head: ['Infinitivo', 'Radical', 'Presente'],
      rows: [
        ['가다', '가', '가요'],
        ['보다', '보', '봐요'],
        ['먹다', '먹', '먹어요'],
        ['마시다', '마시', '마셔요'],
        ['공부하다', '공부하', '공부해요'],
      ],
    },
    examples: [
      {
        ko: '저는 한국어를 공부해요.',
        rom: 'jeoneun hangugeoreul gongbuhaeyo.',
        pt: 'Eu estudo coreano.',
      },
      { ko: '친구를 만나요.', rom: 'chingureul mannayo.', pt: 'Encontro-me com um amigo.' },
    ],
  },
  {
    id: 'passado',
    pattern: '-았어요/었어요/했어요',
    title: 'Passado',
    level: 'basico',
    explanation: [
      'Segue a mesma regra das vogais do presente: ㅏ/ㅗ → 았어요; outras → 었어요; 하다 → 했어요.',
    ],
    table: {
      head: ['Infinitivo', 'Presente', 'Passado'],
      rows: [
        ['가다', '가요', '갔어요'],
        ['보다', '봐요', '봤어요'],
        ['먹다', '먹어요', '먹었어요'],
        ['하다', '해요', '했어요'],
      ],
    },
    examples: [
      { ko: '어제 영화를 봤어요.', rom: 'eoje yeonghwareul bwasseoyo.', pt: 'Ontem vi um filme.' },
      { ko: '밥을 먹었어요.', rom: 'babeul meogeosseoyo.', pt: 'Já comi.' },
      { ko: '숙제를 했어요.', rom: 'sukjereul haesseoyo.', pt: 'Fiz os trabalhos de casa.' },
    ],
  },
  {
    id: 'futuro',
    pattern: '-(으)ㄹ 거예요',
    title: 'Futuro / intenção',
    level: 'basico',
    explanation: [
      'Radical terminado em vogal (ou em ㄹ) → ㄹ 거예요. Radical terminado em consoante → 을 거예요.',
      'Exprime planos ("vou…") e também suposições ("deve…").',
    ],
    examples: [
      {
        ko: '내일 친구를 만날 거예요.',
        rom: 'naeil chingureul mannal geoyeyo.',
        pt: 'Amanhã vou encontrar-me com um amigo.',
      },
      {
        ko: '주말에 책을 읽을 거예요.',
        rom: 'jumare chaegeul ilgeul geoyeyo.',
        pt: 'No fim de semana vou ler um livro.',
      },
    ],
  },
  {
    id: 'formalidade',
    pattern: '합니다체 · 해요체 · 반말',
    title: 'Níveis de formalidade',
    level: 'basico',
    explanation: [
      '합니다체 (formal): notícias, apresentações, clientes, militares. Termina em -ㅂ니다/습니다.',
      '해요체 (polido): o mais usado no dia a dia com desconhecidos, colegas e pessoas mais velhas. Termina em -요.',
      '반말 (informal): só com amigos próximos, pessoas mais novas ou crianças. É o 해요체 sem o 요. Usá-lo com um desconhecido é falta de educação!',
    ],
    table: {
      head: ['Verbo', '합니다체', '해요체', '반말'],
      rows: [
        ['가다', '갑니다', '가요', '가'],
        ['먹다', '먹습니다', '먹어요', '먹어'],
        ['이다', '입니다', '이에요', '이야'],
      ],
    },
    examples: [
      { ko: '감사합니다.', rom: 'gamsahamnida.', pt: 'Obrigado(a). (formal)' },
      { ko: '고마워요.', rom: 'gomawoyo.', pt: 'Obrigado(a). (polido)' },
      { ko: '고마워.', rom: 'gomawo.', pt: 'Obrigado(a). (informal)' },
    ],
  },
  {
    id: 'negacao-an',
    pattern: '안 + verbo',
    title: 'Negação curta',
    level: 'basico',
    explanation: [
      'Coloca-se 안 antes do verbo ou adjetivo. É a forma mais comum na fala.',
      'Nos verbos "nome + 하다", o 안 fica antes do 하다: 공부 안 해요 (e não 안 공부해요).',
    ],
    examples: [
      { ko: '고기를 안 먹어요.', rom: 'gogireul an meogeoyo.', pt: 'Não como carne.' },
      { ko: '오늘은 안 바빠요.', rom: 'oneureun an bappayo.', pt: 'Hoje não estou ocupado(a).' },
      { ko: '운동 안 해요.', rom: 'undong an haeyo.', pt: 'Não faço exercício.' },
    ],
  },
  {
    id: 'negacao-ji',
    pattern: '-지 않다',
    title: 'Negação longa',
    level: 'basico',
    explanation: [
      'Radical + 지 않아요. Significa o mesmo que 안, mas soa mais cuidado e é mais usado na escrita.',
    ],
    examples: [
      { ko: '고기를 먹지 않아요.', rom: 'gogireul meokji anayo.', pt: 'Não como carne.' },
      { ko: '비싸지 않아요.', rom: 'bissaji anayo.', pt: 'Não é caro.' },
    ],
  },
  {
    id: 'conector-go',
    pattern: '-고',
    title: '"E" entre ações ou qualidades',
    level: 'basico',
    explanation: [
      'Radical + 고 liga duas frases: "e", "e depois". O tempo verbal fica só no fim da frase.',
    ],
    examples: [
      {
        ko: '밥을 먹고 커피를 마셔요.',
        rom: 'babeul meokgo keopireul masyeoyo.',
        pt: 'Como e depois bebo café.',
      },
      {
        ko: '이 식당은 싸고 맛있어요.',
        rom: 'i sikdangeun ssago masisseoyo.',
        pt: 'Este restaurante é barato e delicioso.',
      },
    ],
  },
  {
    id: 'conector-aseo',
    pattern: '-아서/어서',
    title: '"Porque" / "e então"',
    level: 'intermedio',
    explanation: [
      'Indica uma causa ou uma sequência em que a segunda ação depende da primeira. Segue a regra das vogais do presente (하다 → 해서).',
      'Não se usa com o passado (-았어서 ✗) nem antes de ordens ou convites.',
    ],
    examples: [
      {
        ko: '피곤해서 일찍 잤어요.',
        rom: 'pigonhaeseo iljjik jasseoyo.',
        pt: 'Como estava cansado(a), dormi cedo.',
      },
      {
        ko: '친구를 만나서 영화를 봤어요.',
        rom: 'chingureul mannaseo yeonghwareul bwasseoyo.',
        pt: 'Encontrei-me com um amigo e (juntos) vimos um filme.',
      },
    ],
  },
  {
    id: 'conector-jiman',
    pattern: '-지만',
    title: '"Mas"',
    level: 'basico',
    explanation: ['Radical + 지만 liga duas ideias que se opõem.'],
    examples: [
      {
        ko: '한국어는 어렵지만 재미있어요.',
        rom: 'hangugeoneun eoryeopjiman jaemiisseoyo.',
        pt: 'O coreano é difícil, mas é divertido.',
      },
      {
        ko: '비싸지만 사고 싶어요.',
        rom: 'bissajiman sago sipeoyo.',
        pt: 'É caro, mas quero comprar.',
      },
    ],
  },
  {
    id: 'querer',
    pattern: '-고 싶다',
    title: 'Querer fazer',
    level: 'basico',
    explanation: [
      'Radical + 고 싶어요 = "quero…". Para falar do desejo de outra pessoa usa-se -고 싶어 해요.',
    ],
    examples: [
      { ko: '한국에 가고 싶어요.', rom: 'hanguge gago sipeoyo.', pt: 'Quero ir à Coreia.' },
      { ko: '뭐 먹고 싶어요?', rom: 'mwo meokgo sipeoyo?', pt: 'O que queres comer?' },
    ],
  },
  {
    id: 'poder',
    pattern: '-(으)ㄹ 수 있다/없다',
    title: 'Poder / conseguir',
    level: 'intermedio',
    explanation: [
      'Radical terminado em vogal → ㄹ 수 있어요; em consoante → 을 수 있어요. Com 없어요 fica "não consigo".',
    ],
    examples: [
      {
        ko: '한글을 읽을 수 있어요.',
        rom: 'hangeureul ilgeul su isseoyo.',
        pt: 'Consigo ler Hangul.',
      },
      { ko: '수영할 수 없어요.', rom: 'suyeonghal su eopseoyo.', pt: 'Não sei nadar.' },
    ],
  },
  {
    id: 'condicional',
    pattern: '-(으)면',
    title: '"Se" / "quando"',
    level: 'intermedio',
    explanation: ['Radical terminado em vogal (ou ㄹ) → 면; em consoante → 으면.'],
    examples: [
      {
        ko: '시간이 있으면 같이 가요.',
        rom: 'sigani isseumyeon gachi gayo.',
        pt: 'Se tiveres tempo, vamos juntos.',
      },
      {
        ko: '비가 오면 집에 있을 거예요.',
        rom: 'biga omyeon jibe isseul geoyeyo.',
        pt: 'Se chover, vou ficar em casa.',
      },
    ],
  },
  {
    id: 'contexto',
    pattern: '-는데 / -(으)ㄴ데',
    title: 'Dar contexto ou contrastar',
    level: 'intermedio',
    explanation: [
      'Apresenta uma situação de fundo antes de uma pergunta, pedido ou comentário. Verbos → 는데; adjetivos → (으)ㄴ데.',
      'Também pode ter valor de contraste, parecido com "mas".',
    ],
    examples: [
      {
        ko: '배가 고픈데 뭐 먹을까요?',
        rom: 'baega gopeunde mwo meogeulkkayo?',
        pt: 'Tenho fome… comemos alguma coisa?',
      },
      {
        ko: '비가 오는데 우산이 없어요.',
        rom: 'biga oneunde usani eopseoyo.',
        pt: 'Está a chover e não tenho guarda-chuva.',
      },
    ],
  },
  {
    id: 'porque-nikka',
    pattern: '-(으)니까',
    title: '"Porque" (com ordens e convites)',
    level: 'intermedio',
    explanation: [
      'Radical terminado em vogal → 니까; em consoante → 으니까.',
      'Ao contrário de -아서/어서, pode ser seguido de ordens ("faz…") e convites ("vamos…").',
    ],
    examples: [
      {
        ko: '비가 오니까 우산을 가져가세요.',
        rom: 'biga onikka usaneul gajyeogaseyo.',
        pt: 'Como está a chover, leve o guarda-chuva.',
      },
      {
        ko: '늦었으니까 택시를 타요.',
        rom: 'neujeosseunikka taeksireul tayo.',
        pt: 'Como já é tarde, vamos de táxi.',
      },
    ],
  },
  {
    id: 'porque-ttaemune',
    pattern: '-기 때문에',
    title: '"Porque" (formal / escrito)',
    level: 'avancado',
    explanation: [
      'Radical + 기 때문에. Dá uma razão de forma clara e objetiva; muito usado em textos e no TOPIK escrito.',
      'Com nomes usa-se 때문에 diretamente: 일 때문에 = "por causa do trabalho".',
    ],
    examples: [
      {
        ko: '시험이 있기 때문에 공부해야 해요.',
        rom: 'siheomi itgi ttaemune gongbuhaeya haeyo.',
        pt: 'Como tenho um exame, tenho de estudar.',
      },
      {
        ko: '일 때문에 못 갔어요.',
        rom: 'il ttaemune mot gasseoyo.',
        pt: 'Não pude ir por causa do trabalho.',
      },
    ],
  },
  {
    id: 'parecer',
    pattern: '-(으)ㄴ/는/(으)ㄹ 것 같다',
    title: '"Parece que…"',
    level: 'avancado',
    explanation: [
      'Exprime uma suposição. Futuro: (으)ㄹ 것 같아요; presente de verbos: 는 것 같아요; adjetivos: (으)ㄴ 것 같아요.',
      'Também se usa para suavizar opiniões, o que soa mais educado em coreano.',
    ],
    examples: [
      { ko: '비가 올 것 같아요.', rom: 'biga ol geot gatayo.', pt: 'Parece que vai chover.' },
      {
        ko: '이 옷이 더 예쁜 것 같아요.',
        rom: 'i osi deo yeppeun geot gatayo.',
        pt: 'Acho que esta roupa é mais bonita.',
      },
    ],
  },
];
