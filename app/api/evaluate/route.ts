import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { score, totalQuestions, answers } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Filter wrong answers
    const wrongAnswers = answers.filter((a: any) => !a.isCorrect);

    // Build wrong answers text (only if there are any)
    let wrongAnswersText = "";
    if (wrongAnswers.length > 0) {
      wrongAnswersText = "\nFALSCHE ANTWORTEN:\n" + wrongAnswers.map((a: any, i: number) =>
        `${i + 1}. Frage: "${a.question}"\n   Eure Antwort: "${a.userAnswer}"\n   Richtige Antwort: "${a.correctAnswer}"`
      ).join('\n\n');
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
- WICHTIG: Ab 17/20 richtig = Geschenk freigeschaltet!
${wrongAnswersText}

SPECIAL CASES (follow these EXACTLY):
- If score = 20/20: Start with something like "20 von 20? Fix geschummelt, aber passt schon." or similar skeptical tone
- If score = 19/20: Start with something like "19 von 20? Glück gehabt, jedes blinde Huhn findet mal ein Korn." or similar lucky tone
- If score = 18/20: Start with something like "18 von 20? Solide Leistung, Respekt." or similar good performance tone
- If score = 17/20: Start with something like "17 von 20? Gerade so geschafft, Schwein gehabt." or similar barely-made-it tone
- If score < 17: Normal sarcastic commentary about the performance

RULES:
- First: write a 3–5 sentence sarcastic summary in German
- If there are wrong answers: Pick ONLY ONE (at random) and make a specific joke about it
- Do NOT mention all wrong answers, just pick the best one for comedy
- After that add another sarcastic sentence about the overall performance, fitting to the existing text above with a christmas theme.
- Then: display four scores from 0–100 (integers):
  • Intelligenz
  • Wissen
  • Peinlichkeit
  • Schönheitspunkte (ALWAYS exactly 100, no exceptions)
- The scores should loosely correlate with the performance, but humor > precision
- Peinlichkeit increases when performance is worse
- Intelligenz und Wissen increase when performance is better

OUTPUT FORMAT (STRICT, FOLLOW EXACTLY):

1) A sarcastic evaluation paragraph (no headline)
2) A blank line
3) The score block exactly like this:

Intelligenz: XX/100
Wissen: XX/100
Peinlichkeit: XX/100
Schönheitspunkte: 100/100

IMPORTANT:
- Do NOT explain the rules
- Do NOT mention calculations
- Do NOT add emojis
- Do NOT mention the gift or whether it's unlocked
- Do NOT add extra text before or after the required output
- Pick ONLY ONE wrong answer to comment on (the funniest one)`;

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
    let evaluation = data.choices[0].message.content;

    // Calculate if prize is unlocked (server-side is source of truth)
    const percentage = score / totalQuestions;
    const prizeUnlocked = percentage >= 0.85;

    // Append the correct verdict based on server calculation
    evaluation += `\n\n${prizeUnlocked ? '🎁 Geschenk freigeschaltet. Leistung akzeptiert.' : '❌ Geschenk leider nicht freigeschaltet. Das tut beim Zuschauen weh.'}`;

    return NextResponse.json({ evaluation, prizeUnlocked });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
