import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { answers, score, totalQuestions } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Filter wrong answers
    const wrongAnswers = answers.filter((a: any) => !a.isCorrect);

    // Build prompt for ChatGPT
    const wrongAnswersText = wrongAnswers.map((a: any) =>
      `- Frage: "${a.question}"\n  Deine Antwort: "${a.userAnswer}"\n  Richtige Antwort: "${a.correctAnswer}"`
    ).join('\n\n');

    const prompt = `Du bist ein sarkastischer, humorvoller Quiz-Auswerter für ein Österreich-Quiz. Schreibe eine kurze (2-3 Sätze), witzige und leicht sarkastische Auswertung auf Deutsch.

Ergebnis: ${score}/${totalQuestions} Punkte

Falsche Antworten:
${wrongAnswersText || 'Keine - Perfekt!'}

Schreibe die Auswertung in einem freundlich-spöttischen Ton. Erwähne spezifisch 1-2 der falschen Antworten auf lustige Weise. Halte es kurz und unterhaltsam!`;

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
            content: 'Du bist ein witziger, sarkastischer Quiz-Auswerter.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 200,
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

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
