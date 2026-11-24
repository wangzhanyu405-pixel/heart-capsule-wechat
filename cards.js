export const cards = [
  { id: 'moon', type: '诗笺', photo: 17, quote: '愿我如星君如月，夜夜流光相皎洁。', author: '范成大 ·《车遥遥篇》', source: 'https://zh.wikisource.org/zh-hans/車遙遙篇_(范成大)' },
  { id: 'heart', type: '诗笺', photo: 10, quote: '山有木兮木有枝，心悦君兮君不知。', author: '《越人歌》', source: 'https://zh.wikisource.org/zh-hans/越人歌' },
  { id: 'bean', type: '诗笺', photo: 3, quote: '玲珑骰子安红豆，入骨相思知不知。', author: '温庭筠 ·《南歌子词二首》', source: 'https://zh.wikisource.org/zh-hans/全唐诗/卷583' },
  { id: 'echo', type: '诗笺', photo: 7, quote: '只愿君心似我心，定不负相思意。', author: '李之仪 ·《卜算子》', source: 'https://zh.wikisource.org/zh-hans/卜算子_(李之仪)' },
  { id: 'soul', type: '诗笺', photo: 8, quote: '身无彩凤双飞翼，心有灵犀一点通。', author: '李商隐 ·《无题》', source: 'https://zh.wikisource.org/zh-hans/無題_(李商隱)' },
  { id: 'summer', type: '远方来信', photo: 2, quote: 'Shall I compare thee to a summer’s day?', translation: '我可以把你比作夏日吗？', author: 'William Shakespeare · Sonnet 18', source: 'https://www.folger.edu/explore/shakespeares-works/shakespeares-sonnets/read/' },
  { id: 'strange', type: '远方来信', photo: 14, quote: 'I do love nothing in the world so well as you.', translation: '这世上，我最喜欢的就是你。', author: 'William Shakespeare · Much Ado About Nothing', source: 'https://www.folger.edu/explore/shakespeares-works/much-ado-about-nothing/read/4/1/' },
  { id: 'sunlight', type: '远方来信', photo: 9, quote: 'Let my love, like sunlight, surround you and give you a freedom illumined.', translation: '愿我的爱像阳光环绕你，也让你自由而明亮。', author: 'Rabindranath Tagore · Fireflies', source: 'https://bichitra.jdvu.ac.in/manuscript/manuscript_viewer.php?manid=26&mname=RBVBMS_026' },
  { id: 'coffee', type: '约会邀请', photo: 2, quote: '想邀请你，把一个下午慢慢过完。', author: '来自我' },
  { id: 'flower', type: '约会邀请', photo: 3, quote: '花会开，见你的计划也该安排起来了。', author: '来自我' },
  { id: 'hug', type: '心动兑换券', photo: 15, quote: '下次见面，申请多抱你十秒。', author: '来自我' },
  { id: 'swan', type: '心动兑换券', photo: 5, quote: '今天的可爱额度，想全部留给你。', author: '来自我' }
];

export function pickCard(deck, seen, random = Math.random) {
  if (!deck.length) return { card: null, seen: [] };
  const validSeen = Array.isArray(seen) ? seen.filter(id => deck.some(card => card.id === id)) : [];
  const available = deck.filter(card => !validSeen.includes(card.id));
  const pool = available.length ? available : deck;
  const nextSeen = available.length ? validSeen : [];
  const index = Math.min(pool.length - 1, Math.max(0, Math.floor(random() * pool.length)));
  const card = pool[index];
  return { card, seen: [...nextSeen, card.id] };
}
