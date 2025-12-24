import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { score, totalQuestions } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `TONE:
- Sarkastisch, frech, aber sympathisch
- Niemals beleidigend oder verletzend
- Eher „familiäres Necken" als Spott
- Kurz, pointiert, lustig
- Kein Coaching, keine Erklärungen

INPUT:
- totalQuestions: ${totalQuestions}
- correctAnswers: ${score}

RULES:
- First: write a 3–5 sentence sarcastic summary of the performance in German.
- Then: display four scores from 0–100 (integers):
  • Intelligenz
  • Wissen
  • Peinlichkeit
  • Schönheitspunkte (ALWAYS exactly 100, no exceptions)
- The scores should loosely correlate with the performance, but humor > precision.
- Peinlichkeit increases when performance is worse.
- Intelligenz und Wissen increase when performance is better.
- Schönheitspunkte are always 100, even if everything else is terrible.

GIFT LOGIC (STRICT):
- Calculate percentage = ${score} / ${totalQuestions}
- The gift is unlocked ONLY if percentage ≥ 0.9 (90%)
- No soft rules, no mercy overrides

OUTPUT FORMAT (STRICT, FOLLOW EXACTLY):

1) A sarcastic evaluation paragraph (no headline)
2) A blank line
3) The score block exactly like this:

Intelligenz: XX/100
Wissen: XX/100
Peinlichkeit: XX/100
Schönheitspunkte: 100/100

4) A blank line
5) Final verdict:
- If unlocked:
  "🎁 Geschenk freigeschaltet. Leistung akzeptiert."
- If NOT unlocked:
  "❌ Geschenk leider nicht freigeschaltet. Das tut beim Zuschauen weh."

IMPORTANT:
- Do NOT explain the rules
- Do NOT mention calculations
- Do NOT add emojis except the single one in the final verdict
- Do NOT add extra text before or after the required output`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein sarkastischer Quiz-Auswerter. Befolge die Anweisungen EXAKT.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate evaluation' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const evaluation = data.choices[0].message.content;

    // Calculate if prize is unlocked
    const percentage = score / totalQuestions;
    const prizeUnlocked = percentage >= 0.9;

    return NextResponse.json({ evaluation, prizeUnlocked });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
