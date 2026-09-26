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
      'Marca o tópico da frase — aquilo de que estamos falando. É como dizer "quanto a…".',
      'Use 은 depois de consoante e 는 depois de vogal. Também serve para contrastar ("eu, já eu…").',
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
      'Use 이 depois de consoante e 가 depois de vogal. Atenção às formas irregulares: 나 → 내가, 저 → 제가, 너 → 네가.',
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
      'Use 을 depois de consoante e 를 depois de vogal. Na fala informal ela é muitas vezes omitida.',
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
      'Vai direto depois do substantivo: 이에요 depois de consoante e 예요 depois de vogal.',
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
      { ko: '세 시에 만나요.', rom: 'se sie mannayo.', pt: 'A gente se encontra às três.' },
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
      'Tire o -다 do infinitivo para obter o radical. Se a última vogal do radical for ㅏ ou ㅗ, junte 아요; senão, 어요. Os verbos em 하다 viram 해요.',
      'Quando duas vogais se encontram, elas se contraem: 가 + 아요 → 가요, 오 + 아요 → 와요, 마시 + 어요 → 마셔요.',
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
      { ko: '친구를 만나요.', rom: 'chingureul mannayo.', pt: 'Vou me encontrar com um amigo.' },
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
      {
        ko: '어제 영화를 봤어요.',
        rom: 'eoje yeonghwareul bwasseoyo.',
        pt: 'Ontem eu vi um filme.',
      },
      { ko: '밥을 먹었어요.', rom: 'babeul meogeosseoyo.', pt: 'Já comi.' },
      { ko: '숙제를 했어요.', rom: 'sukjereul haesseoyo.', pt: 'Fiz a lição de casa.' },
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
        pt: 'Amanhã vou me encontrar com um amigo.',
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
      'Coloque 안 antes do verbo ou adjetivo. É a forma mais comum na fala.',
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
        pt: 'Encontrei um amigo e (juntos) vimos um filme.',
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
      'Radical + 고 싶어요 = "quero…". Para falar do desejo de outra pessoa, use -고 싶어 해요.',
    ],
    examples: [
      { ko: '한국에 가고 싶어요.', rom: 'hanguge gago sipeoyo.', pt: 'Quero ir à Coreia.' },
      { ko: '뭐 먹고 싶어요?', rom: 'mwo meokgo sipeoyo?', pt: 'O que você quer comer?' },
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
        pt: 'Se você tiver tempo, vamos juntos.',
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
      'Com substantivos, use 때문에 direto: 일 때문에 = "por causa do trabalho".',
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
  {
    id: 'demonstrativos',
    pattern: '이 / 그 / 저',
    title: 'Isto, isso e aquilo',
    level: 'zero',
    explanation: [
      '이 = perto de quem fala; 그 = perto de quem ouve (ou algo já mencionado); 저 = longe dos dois.',
      'Vêm sempre antes de um substantivo: 이 사람 (esta pessoa). Com 거 (coisa) formam 이거, 그거 e 저거.',
    ],
    table: {
      head: ['', 'Perto de mim', 'Perto de você', 'Longe'],
      rows: [
        ['coisa', '이거', '그거', '저거'],
        ['lugar', '여기', '거기', '저기'],
        ['pessoa', '이 사람', '그 사람', '저 사람'],
      ],
    },
    examples: [
      { ko: '이거 뭐예요?', rom: 'igeo mwoyeyo?', pt: 'O que é isto?' },
      { ko: '저 사람은 누구예요?', rom: 'jeo sarameun nuguyeyo?', pt: 'Quem é aquela pessoa?' },
    ],
  },
  {
    id: 'contadores',
    pattern: 'número + 개 / 명 / 잔 / 병 / 장',
    title: 'Contadores',
    level: 'zero',
    explanation: [
      'Para contar coisas, usamos número NATIVO + contador. A ordem é: coisa + número + contador (사과 두 개 = duas maçãs).',
      'Antes do contador, 하나, 둘, 셋, 넷 e 스물 encurtam: 한, 두, 세, 네, 스무.',
    ],
    table: {
      head: ['Contador', 'Para contar', 'Exemplo'],
      rows: [
        ['개', 'coisas em geral', '한 개'],
        ['명', 'pessoas', '두 명'],
        ['잔', 'copos, xícaras', '세 잔'],
        ['병', 'garrafas', '네 병'],
        ['장', 'folhas, ingressos', '다섯 장'],
        ['살', 'idade', '스무 살'],
      ],
    },
    examples: [
      { ko: '커피 두 잔 주세요.', rom: 'keopi du jan juseyo.', pt: 'Dois cafés, por favor.' },
      { ko: '가족이 네 명이에요.', rom: 'gajogi ne myeongieyo.', pt: 'Somos quatro na família.' },
    ],
  },
  {
    id: 'pedido-juseyo',
    pattern: 'N 주세요 / -아/어 주세요',
    title: 'Pedir coisas e favores',
    level: 'zero',
    explanation: [
      'Substantivo + 주세요 = "me dê, por favor": 물 주세요.',
      'Verbo na forma -아/어 + 주세요 = "faça (isso) para mim, por favor": 기다려 주세요. 좀 antes do verbo deixa o pedido mais suave.',
    ],
    examples: [
      { ko: '영수증 주세요.', rom: 'yeongsujeung juseyo.', pt: 'O recibo, por favor.' },
      {
        ko: '사진 좀 찍어 주세요.',
        rom: 'sajin jom jjigeo juseyo.',
        pt: 'Tire uma foto, por favor.',
      },
    ],
  },
  {
    id: 'meio-rota',
    pattern: '(으)로 · 에서 … 까지',
    title: 'Meio de transporte e trajeto',
    level: 'basico',
    explanation: [
      '(으)로 indica o meio ou a direção: 버스로 (de ônibus), 오른쪽으로 (para a direita). Depois de vogal ou ㄹ, só 로; depois das outras consoantes, 으로.',
      '에서 … 까지 = de … até … (lugares). Para o tempo, use 부터 … 까지: 아홉 시부터 여섯 시까지.',
    ],
    examples: [
      { ko: '지하철로 가요.', rom: 'jihacheollo gayo.', pt: 'Vou de metrô.' },
      {
        ko: '집에서 학교까지 걸어서 가요.',
        rom: 'jibeseo hakgyokkaji georeoseo gayo.',
        pt: 'Vou a pé de casa até a escola.',
      },
      {
        ko: '월요일부터 금요일까지 일해요.',
        rom: 'woryoilbuteo geumyoilkkaji ilhaeyo.',
        pt: 'Trabalho de segunda a sexta.',
      },
    ],
  },
  {
    id: 'progressivo',
    pattern: '-고 있다',
    title: '"Estar fazendo" (progressivo)',
    level: 'basico',
    explanation: [
      'Radical + 고 있어요 = ação em andamento: 먹다 → 먹고 있어요 (estou comendo).',
      'No passado: -고 있었어요 (estava fazendo).',
    ],
    examples: [
      {
        ko: '지금 뭐 하고 있어요?',
        rom: 'jigeum mwo hago isseoyo?',
        pt: 'O que você está fazendo agora?',
      },
      { ko: '음악을 듣고 있어요.', rom: 'eumageul deutgo isseoyo.', pt: 'Estou ouvindo música.' },
    ],
  },
  {
    id: 'imperativo',
    pattern: '-(으)세요 · -지 마세요',
    title: 'Instruções e proibições educadas',
    level: 'basico',
    explanation: [
      'Radical + (으)세요 = faça (educado): 가세요, 앉으세요. Depois de consoante entra 으.',
      'Radical + 지 마세요 = não faça: 걱정하지 마세요 (não se preocupe).',
    ],
    examples: [
      { ko: '여기 앉으세요.', rom: 'yeogi anjeuseyo.', pt: 'Sente-se aqui.' },
      { ko: '늦지 마세요.', rom: 'neutji maseyo.', pt: 'Não se atrase.' },
    ],
  },
  {
    id: 'convite',
    pattern: '-(으)ㄹ까요?',
    title: '"Vamos…?" e "Será que…?"',
    level: 'basico',
    explanation: [
      'Radical + (으)ㄹ까요? convida ou pede a opinião do outro: 같이 갈까요? (vamos juntos?).',
      'Depois de vogal, -ㄹ까요; depois de consoante, -을까요 (먹을까요?).',
    ],
    examples: [
      { ko: '커피 마실까요?', rom: 'keopi masilkkayo?', pt: 'Vamos tomar um café?' },
      { ko: '어디서 만날까요?', rom: 'eodiseo mannalkkayo?', pt: 'Onde nos encontramos?' },
    ],
  },
  {
    id: 'incapacidade',
    pattern: '못 / -지 못하다',
    title: '"Não consigo"',
    level: 'basico',
    explanation: [
      '못 antes do verbo = não conseguir (por incapacidade ou impedimento), diferente de 안, que é não querer ou simplesmente não fazer.',
      'Nos verbos com 하다, o 못 entra antes do 하다: 수영 못 해요.',
    ],
    examples: [
      {
        ko: '매운 음식을 못 먹어요.',
        rom: 'maeun eumsigeul mot meogeoyo.',
        pt: 'Não consigo comer comida apimentada.',
      },
      { ko: '어제 못 잤어요.', rom: 'eoje mot jasseoyo.', pt: 'Ontem não consegui dormir.' },
    ],
  },
  {
    id: 'adjetivo-nome',
    pattern: '-(으)ㄴ + substantivo',
    title: 'Adjetivo antes do substantivo',
    level: 'basico',
    explanation: [
      'Para descrever uma coisa, o adjetivo vem antes dela com -(으)ㄴ: 크다 → 큰 가방, 작다 → 작은 방.',
      'Adjetivos com 있다/없다 usam -는: 맛있는 음식, 재미없는 영화.',
    ],
    examples: [
      { ko: '좋은 사람이에요.', rom: 'joeun saramieyo.', pt: 'É uma boa pessoa.' },
      {
        ko: '맛있는 음식을 먹었어요.',
        rom: 'masinneun eumsigeul meogeosseoyo.',
        pt: 'Comi uma comida gostosa.',
      },
    ],
  },
  {
    id: 'irregulares',
    pattern: 'ㅂ · ㄷ · ㅡ · 르',
    title: 'Verbos irregulares',
    level: 'basico',
    explanation: [
      'Alguns radicais mudam antes de uma vogal. Os mais comuns são estes quatro grupos.',
      'Dica: aprenda cada verbo junto com a forma -아/어요, como um par (듣다 · 들어요).',
    ],
    table: {
      head: ['Tipo', 'Infinitivo', 'Presente', 'O que muda'],
      rows: [
        ['ㅂ', '덥다', '더워요', 'ㅂ vira 우'],
        ['ㄷ', '듣다', '들어요', 'ㄷ vira ㄹ'],
        ['ㅡ', '바쁘다', '바빠요', 'o ㅡ some'],
        ['르', '모르다', '몰라요', '르 vira ㄹ라/ㄹ러'],
      ],
    },
    examples: [
      { ko: '한국어가 어려워요.', rom: 'hangugeoga eoryeowoyo.', pt: 'Coreano é difícil.' },
      { ko: '음악을 들어요.', rom: 'eumageul deureoyo.', pt: 'Escuto música.' },
    ],
  },
  {
    id: 'objetivo',
    pattern: '-(으)러 가다/오다',
    title: 'Ir ou vir PARA fazer algo',
    level: 'basico',
    explanation: [
      'Radical + (으)러 + 가다/오다 indica o objetivo do movimento: 먹으러 가요 (vou comer).',
      'Só funciona com verbos de movimento (가다, 오다, 다니다…).',
    ],
    examples: [
      { ko: '밥 먹으러 가요.', rom: 'bap meogeureo gayo.', pt: 'Vou comer.' },
      {
        ko: '한국어 배우러 왔어요.',
        rom: 'hangugeo baeureo wasseoyo.',
        pt: 'Vim aprender coreano.',
      },
    ],
  },
  {
    id: 'quando-ttae',
    pattern: '-(으)ㄹ 때',
    title: '"Quando…"',
    level: 'basico',
    explanation: [
      'Radical + (으)ㄹ 때 = quando (no momento em que). Substantivos usam só 때: 방학 때.',
      'Para algo já concluído: -았/었을 때 (한국에 갔을 때 = quando fui à Coreia).',
    ],
    examples: [
      {
        ko: '시간이 있을 때 책을 읽어요.',
        rom: 'sigani isseul ttae chaegeul ilgeoyo.',
        pt: 'Quando tenho tempo, leio.',
      },
      {
        ko: '어릴 때 브라질에 살았어요.',
        rom: 'eoril ttae beurajire sarasseoyo.',
        pt: 'Quando era criança, morava no Brasil.',
      },
    ],
  },
  {
    id: 'nominalizacao',
    pattern: '-기 · -는 것',
    title: 'Verbo como substantivo',
    level: 'basico',
    explanation: [
      '-기 e -는 것 transformam o verbo em "o ato de…": 보기 (ver), 요리하는 것 (cozinhar).',
      'Muito usado com gostos e hobbies: 노래하는 것을 좋아해요 (gosto de cantar). Na fala, 것을 vira 걸.',
    ],
    examples: [
      {
        ko: '제 취미는 영화 보기예요.',
        rom: 'je chwimineun yeonghwa bogiyeyo.',
        pt: 'Meu hobby é ver filmes.',
      },
      {
        ko: '요리하는 것을 좋아해요.',
        rom: 'yorihaneun geoseul joahaeyo.',
        pt: 'Gosto de cozinhar.',
      },
    ],
  },
  {
    id: 'frequencia-mada',
    pattern: '마다 · 매일',
    title: '"Todo / cada"',
    level: 'basico',
    explanation: [
      'N + 마다 = cada / todo: 주말마다 (todo fim de semana), 아침마다 (toda manhã).',
      'Algumas palavras já têm 매 (cada): 매일 (todo dia), 매주 (toda semana), 매년 (todo ano).',
    ],
    examples: [
      {
        ko: '주말마다 등산해요.',
        rom: 'jumalmada deungsanhaeyo.',
        pt: 'Faço trilha todo fim de semana.',
      },
      {
        ko: '매일 한국어를 공부해요.',
        rom: 'maeil hangugeoreul gongbuhaeyo.',
        pt: 'Estudo coreano todos os dias.',
      },
    ],
  },
  {
    id: 'experiencia',
    pattern: '-아/어 보다 · -(으)ㄴ 적이 있다',
    title: 'Experimentar e "já fiz"',
    level: 'intermedio',
    explanation: [
      '-아/어 보세요 = experimente (fazer): 입어 보세요 (experimente vestir).',
      '-(으)ㄴ 적이 있어요 = já fiz alguma vez; com 없어요 = nunca fiz.',
    ],
    examples: [
      {
        ko: '이거 한번 먹어 보세요.',
        rom: 'igeo hanbeon meogeo boseyo.',
        pt: 'Experimente comer isto.',
      },
      { ko: '한국에 간 적이 있어요.', rom: 'hanguge gan jeogi isseoyo.', pt: 'Já fui à Coreia.' },
    ],
  },
  {
    id: 'permissao',
    pattern: '-아/어도 되다 · -(으)면 안 되다',
    title: 'Pode e não pode',
    level: 'intermedio',
    explanation: [
      '-아/어도 돼요? = posso…? A resposta positiva: 네, 돼요.',
      '-(으)면 안 돼요 = não pode (proibição).',
    ],
    examples: [
      { ko: '사진 찍어도 돼요?', rom: 'sajin jjigeodo dwaeyo?', pt: 'Posso tirar foto?' },
      {
        ko: '여기서 담배 피우면 안 돼요.',
        rom: 'yeogiseo dambae piumyeon an dwaeyo.',
        pt: 'Não pode fumar aqui.',
      },
    ],
  },
];
