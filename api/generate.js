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
    hashtag: (item) => `AARAN 여성복에 맞는 인스타그램 해시태그를 한국어와 영어 섞어서 15-20개 만들어줘. 상품/무드: ${item}. 반드시 포함: #아란 #aaran #aaran_seoul. 해시태그만 출력.`,
    story: (item) => `AARAN 인스타그램 스토리용 짧은 문구를 만들어줘. 상품/무드: ${item}. 조건: 한 줄 또는 두 줄. 임팩트 있게. 문구만 출력.`,
    season_mood: (item) => `AARAN 이번 시즌 무드 소개 글을 한국어로 써줘. 키워드/무드: ${item}. 조건: 4-6줄. 룩북 첫 페이지처럼. 시적이고 담담하게. 글만 출력.`,
  };

  const prompt = BRAND_VOICE + '\n\n' + PROMPTS[type](product || '사진 속 상품과 무드를 참고해서');

  const parts = [];
  if (imageBase64) {
    parts.push({ inlineData: { mimeType: imageType, data: imageBase64 } });
    parts.push({ text: prompt + (product ? '' : '\n\n사진 속 상품의 색상, 소재, 스타일, 전체적인 무드를 분석해서 카피를 써줘.') });
  } else {
    parts.push({ text: prompt });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] }),
      }
    );
    const data = await response.json();
    if (data.error) return res.status(200).json({ text: `오류: ${data.error.message}` });
const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '생성 실패';
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: '오류가 발생했어요.' });
  }
}
