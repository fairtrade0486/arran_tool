export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, product, imageBase64, imageType } = req.body;

  const BRAND_VOICE = `You are a copywriter for AARAN, a Korean women's fashion brand.
AARAN's brand identity:
- "Cool, but never cold. Free-spirited, yet never undone."
- Natural femininity — effortless, slightly unfinished, intentionally low-key
- The woman who carries presence without trying
- Tone: literary, understated, never loud or salesy
Rules:
- Never use exclamation marks
- Never use pushy sales language
- Write like a mood, not an advertisement
- Korean output should feel like it was written by a real person, not an AI`;

  const PROMPTS = {
    caption_kr: (item) => `다음 상품에 대한 AARAN 브랜드 인스타그램 캡션을 한국어로 작성해줘. 상품/무드: ${item}. 조건: 2-4줄, 감성적이고 담담한 톤, 느슨하고 자연스럽게. 절대 과장하지 말 것. 캡션만 출력.`,
    hashtag: (item) => `AARAN 여성복에 맞는 인스타그램 해시태그를 한국어와 영어 섞어서 15-20개 만들어줘. 상품/무드: ${item}. 반드시 포함: #아란 #
