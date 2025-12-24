"use client";

import { useState, useRef, useEffect } from "react";

// Question types
type MCQuestion = {
  id: number;
  type: "mc";
  category: "History" | "Music" | "Architecture" | "Fun";
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

type DateQuestion = {
  id: number;
  type: "date";
  category: "History";
  question: string;
  correctISO: string;
  yearRange: { from: number; to: number };
};

type PinQuestion = {
  id: number;
  type: "pin";
  category: "Austria";
  question: string;
  mapUrl: string;
  mapWidth: number;
  mapHeight: number;
  correctPoint: { x: number; y: number };
  threshold: number;
};

type Question = MCQuestion | DateQuestion | PinQuestion;

type Family = "Matis Family" | "Wallner Family";

const getQuestions = (family: Family): Question[] => {
  const q1: PinQuestion = family === "Matis Family"
    ? {
        id: 1,
        type: "pin",
        category: "Austria",
        question: "Tippe auf die Karte: Wo liegt ungefähr Neudörfl?",
        mapUrl: "/austria-map.png",
        mapWidth: 960,
        mapHeight: 536,
        correctPoint: { x: 870, y: 310 },
        threshold: 90,
      }
    : {
        id: 1,
        type: "pin",
        category: "Austria",
        question: "Tippe auf die Karte: Wo liegt ungefähr Salzburg – und noch genauer: Anif?",
        mapUrl: "/austria-map.png",
        mapWidth: 960,
        mapHeight: 536,
        correctPoint: { x: 210, y: 200 },
        threshold: 100,
      };

  return [
    q1,
    {
      id: 2,
      type: "mc",
      category: "Fun",
      question: "Woher stammt die Idee des Wiener Schnitzels ursprünglich?",
      options: ["Wien", "Ungarn", "Italien (Mailand)", "Bayern"],
      correctIndex: 2,
    },
    {
      id: 3,
      type: "mc",
      category: "Fun",
      question: "Warum war Kaiserin Sisi oft monatelang unterwegs?",
      options: [
        "Sie liebte das Reisen und hasste den Wiener Hof",
        "Sie war schwer krank",
        "Sie führte politische Missionen",
        "Sie lebte im Exil",
      ],
      correctIndex: 0,
    },
    {
      id: 4,
      type: "pin",
      category: "Austria",
      question: "Tippe auf die Karte: Wo liegt ungefähr Hallstatt?",
      mapUrl: "/austria-map.png",
      mapWidth: 960,
      mapHeight: 536,
      correctPoint: { x: 250, y: 230 },
      threshold: 90,
    },
    {
      id: 5,
      type: "mc",
      category: "Fun",
      question: "Warum ist Hallstatt international so bekannt?",
      options: [
        "Wegen der Olympischen Spiele",
        "Wegen einer vollständigen Kopie in China",
        "Wegen Goldminen",
        "Wegen eines UNO-Sitzes",
      ],
      correctIndex: 1,
    },
    {
      id: 6,
      type: "mc",
      category: "Fun",
      question: "Warum heißt der Ort früher 'Fucking' heute anders?",
      options: [
        "Wegen EU-Vorschriften",
        "Wegen internationaler Witze und Ortstafeldiebstähle",
        "Wegen politischer Proteste",
        "Wegen eines Übersetzungsfehlers",
      ],
      correctIndex: 1,
    },
    {
      id: 7,
      type: "date",
      category: "History",
      question: "Wann wurde der Österreichische Staatsvertrag unterzeichnet? (Datum auswählen)",
      correctISO: "1955-05-15",
      yearRange: { from: 1950, to: 1960 },
    },
    {
      id: 8,
      type: "mc",
      category: "Fun",
      question: "Was ist bei diesem Quiz wirklich wichtig?",
      options: [
        "Alle Antworten richtig",
        "Diskussionen",
        "Das Geschenk am Ende",
        "Rechthaben",
      ],
      correctIndex: 2,
    },
    {
      id: 9,
      type: "mc",
      category: "Fun",
      question: "Wer ist der ultimative Quizmaster?",
      options: ["Gregor", "Armin Assinger", "Günther Jauch", "Steve Harvey"],
      correctIndex: 3,
    },
    {
      id: 10,
      type: "mc",
      category: "History",
      question: "In welchem Schloss wurde der Österreichische Staatsvertrag 1955 unterzeichnet?",
      options: ["Schönbrunn", "Belvedere", "Hofburg", "Mirabell"],
      correctIndex: 1,
    },
    {
      id: 11,
      type: "mc",
      category: "Music",
      question: "Welcher Song von Falco erreichte Platz 1 in den USA?",
      options: ["Rock Me Amadeus", "Vienna Calling", "Jeanny", "Der Kommissar"],
      correctIndex: 0,
    },
    {
      id: 12,
      type: "mc",
      category: "Music",
      question: "Die Operette 'Die Fledermaus' wurde komponiert von …",
      options: ["Mozart", "Johann Strauss Sohn", "Haydn", "Schubert"],
      correctIndex: 1,
    },
    {
      id: 13,
      type: "mc",
      category: "History",
      question: "Österreich ist der EU beigetreten im Jahr …",
      options: ["1989", "1995", "2002", "2007"],
      correctIndex: 1,
    },
    {
      id: 14,
      type: "mc",
      category: "Music",
      question: "Conchita Wurst gewann den Eurovision Song Contest mit …",
      options: ["Rise Like a Phoenix", "Heroes", "Euphoria", "Waterloo"],
      correctIndex: 0,
    },
    {
      id: 15,
      type: "mc",
      category: "Architecture",
      question: "Das Hundertwasserhaus ist bekannt für …",
      options: [
        "strenge Symmetrie",
        "bunte, organische Formen",
        "Glasfassaden",
        "Beton-Minimalismus",
      ],
      correctIndex: 1,
    },
    {
      id: 16,
      type: "mc",
      category: "Music",
      question: "Das berühmte Neujahrskonzert findet statt im …",
      options: ["Musikverein", "Konzerthaus", "Staatsoper", "Burgtheater"],
      correctIndex: 0,
    },
    {
      id: 17,
      type: "mc",
      category: "Fun",
      question: "Mozart wurde geboren in …",
      options: ["Wien", "Salzburg", "Graz", "Innsbruck"],
      correctIndex: 1,
    },
    {
      id: 18,
      type: "mc",
      category: "Fun",
      question: "Die Donau fließt durch …",
      options: ["Graz", "Wien", "Klagenfurt", "Bregenz"],
      correctIndex: 1,
    },
    {
      id: 19,
      type: "mc",
      category: "Music",
      question: "Die österreichische Band STS sang auf …",
      options: ["Hochdeutsch", "Steirisch", "Wienerisch", "Tirolerisch"],
      correctIndex: 1,
    },
    {
      id: 20,
      type: "pin",
      category: "Austria",
      question: "Tippe auf die Karte: Wo liegt das Dorf Fucking (jetzt Fugging)?",
      mapUrl: "/austria-map.png",
      mapWidth: 960,
      mapHeight: 536,
      correctPoint: { x: 420, y: 185 },
      threshold: 80,
    },
  ];
};

type Screen =
  | "start"
  | "quiz"
  | "ai-evaluation"
  | "prize-unlocked"
  | "prize-reveal";

type AnswerResult = {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [family, setFamily] = useState<Family | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);

  // AI evaluation state
  const [aiEvaluation, setAiEvaluation] = useState<string>("");
  const [loadingEvaluation, setLoadingEvaluation] = useState<boolean>(false);
  const [prizeUnlocked, setPrizeUnlocked] = useState<boolean>(false);

  // Date question state
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Pin question state
  const [pinPoint, setPinPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const imgRef = useRef<HTMLImageElement>(null);

  const questions = family ? getQuestions(family) : [];
  const currentQuestion = questions[currentQuestionIndex];

  // Snowfall effect
  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.textContent = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];
      snowflake.style.left = Math.random() * 100 + 'vw';
      snowflake.style.animationDuration = Math.random() * 3 + 5 + 's';
      snowflake.style.opacity = (Math.random() * 0.6 + 0.4).toString();
      snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
      document.body.appendChild(snowflake);

      setTimeout(() => {
        snowflake.remove();
      }, 8000);
    };

    const interval = setInterval(createSnowflake, 300);
    return () => clearInterval(interval);
  }, []);

  // Fetch AI evaluation when screen changes to ai-evaluation
  useEffect(() => {
    if (screen === "ai-evaluation" && !aiEvaluation && !loadingEvaluation) {
      const fetchEvaluation = async () => {
        setLoadingEvaluation(true);
        try {
          const response = await fetch('/api/evaluate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              score,
              totalQuestions: questions.length,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setAiEvaluation(data.evaluation);
            setPrizeUnlocked(data.prizeUnlocked);
          } else {
            // Fallback evaluation with scores
            const percentage = score / questions.length;
            const unlocked = percentage >= 0.9;
            setPrizeUnlocked(unlocked);

            // Generate fallback scores
            const intelligenz = Math.round(percentage * 85);
            const wissen = Math.round(percentage * 90);
            const peinlichkeit = Math.round((1 - percentage) * 75 + 10);

            // Generate fallback text
            let text = "";
            if (percentage >= 0.9) {
              text = `Respekt! ${score} von ${questions.length} richtig. Das war solide. Fast schon verdächtig gut. Habt ihr etwa gegoogelt?`;
            } else if (percentage >= 0.7) {
              text = `${score} von ${questions.length}. Nicht schlecht, aber auch nicht weltbewegend. Ihr wisst schon ein bisschen was, aber Luft nach oben gibt's trotzdem reichlich.`;
            } else if (percentage >= 0.5) {
              text = `${score} von ${questions.length} Punkte. Joa. Hätte schlimmer sein können. Hätte aber auch deutlich besser sein können. Mittelmäßigkeit in Reinform.`;
            } else {
              text = `${score} von ${questions.length}. Autsch. Das war jetzt nicht so prall. Vielleicht beim nächsten Mal vorher ein bisschen was lernen?`;
            }

            const fallbackEval = `${text}\n\nIntelligenz: ${intelligenz}/100\nWissen: ${wissen}/100\nPeinlichkeit: ${peinlichkeit}/100\nSchönheitspunkte: 100/100\n\n${unlocked ? '🎁 Geschenk freigeschaltet. Leistung akzeptiert.' : '❌ Geschenk leider nicht freigeschaltet. Das tut beim Zuschauen weh.'}`;

            setAiEvaluation(fallbackEval);
          }
        } catch (error) {
          // Fallback evaluation with scores
          const percentage = score / questions.length;
          const unlocked = percentage >= 0.9;
          setPrizeUnlocked(unlocked);

          // Generate fallback scores
          const intelligenz = Math.round(percentage * 85);
          const wissen = Math.round(percentage * 90);
          const peinlichkeit = Math.round((1 - percentage) * 75 + 10);

          // Generate fallback text
          let text = "";
          if (percentage >= 0.9) {
            text = `Respekt! ${score} von ${questions.length} richtig. Das war solide. Fast schon verdächtig gut. Habt ihr etwa gegoogelt?`;
          } else if (percentage >= 0.7) {
            text = `${score} von ${questions.length}. Nicht schlecht, aber auch nicht weltbewegend. Ihr wisst schon ein bisschen was, aber Luft nach oben gibt's trotzdem reichlich.`;
          } else if (percentage >= 0.5) {
            text = `${score} von ${questions.length} Punkte. Joa. Hätte schlimmer sein können. Hätte aber auch deutlich besser sein können. Mittelmäßigkeit in Reinform.`;
          } else {
            text = `${score} von ${questions.length}. Autsch. Das war jetzt nicht so prall. Vielleicht beim nächsten Mal vorher ein bisschen was lernen?`;
          }

          const fallbackEval = `${text}\n\nIntelligenz: ${intelligenz}/100\nWissen: ${wissen}/100\nPeinlichkeit: ${peinlichkeit}/100\nSchönheitspunkte: 100/100\n\n${unlocked ? '🎁 Geschenk freigeschaltet. Leistung akzeptiert.' : '❌ Geschenk leider nicht freigeschaltet. Das tut beim Zuschauen weh.'}`;

          setAiEvaluation(fallbackEval);
        } finally {
          setLoadingEvaluation(false);
        }
      };

      fetchEvaluation();
    }
  }, [screen, aiEvaluation, loadingEvaluation, score, questions.length]);

  const resetQuiz = () => {
    setScreen("start");
    setFamily(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setAiEvaluation("");
    setLoadingEvaluation(false);
    setPrizeUnlocked(false);
    setSelectedDay(null);
    setSelectedMonth(null);
    setSelectedYear(null);
    setPinPoint(null);
  };

  const selectFamily = (selectedFamily: Family) => {
    setFamily(selectedFamily);
    setScreen("quiz");
  };

  const handleMCAnswer = (optionIndex: number) => {
    if (currentQuestion.type !== "mc") return;

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const userAnswer = currentQuestion.options[optionIndex];
    const correctAnswer = currentQuestion.options[currentQuestion.correctIndex];

    console.log('🎯 Multiple Choice Answer:', {
      question: currentQuestion.question,
      userAnswer,
      correctAnswer,
      isCorrect: isCorrect ? '✅ CORRECT' : '❌ WRONG'
    });

    setAnswers([...answers, {
      question: currentQuestion.question,
      userAnswer,
      correctAnswer,
      isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
    }

    advanceQuestion();
  };

  const handleDateSubmit = () => {
    if (currentQuestion.type !== "date") return;
    if (
      selectedDay === null ||
      selectedMonth === null ||
      selectedYear === null
    )
      return;

    const userDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    const isCorrect = userDate === currentQuestion.correctISO;

    const formatDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-');
      return `${day}.${month}.${year}`;
    };

    console.log('📅 Date Answer:', {
      question: currentQuestion.question,
      userAnswer: formatDate(userDate),
      correctAnswer: formatDate(currentQuestion.correctISO),
      isCorrect: isCorrect ? '✅ CORRECT' : '❌ WRONG'
    });

    setAnswers([...answers, {
      question: currentQuestion.question,
      userAnswer: formatDate(userDate),
      correctAnswer: formatDate(currentQuestion.correctISO),
      isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
    }

    setSelectedDay(null);
    setSelectedMonth(null);
    setSelectedYear(null);
    advanceQuestion();
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    console.log('🗺️ Map Click:', {
      clickedCoordinates: `(${Math.round(x)}, ${Math.round(y)})`,
      question: currentQuestion.type === 'pin' ? currentQuestion.question : 'N/A'
    });

    setPinPoint({ x, y });
  };

  const handlePinSubmit = () => {
    if (currentQuestion.type !== "pin") return;
    if (!pinPoint) return;

    const distance = Math.hypot(
      pinPoint.x - currentQuestion.correctPoint.x,
      pinPoint.y - currentQuestion.correctPoint.y
    );

    const isCorrect = distance <= currentQuestion.threshold;

    // Enhanced console logging for map testing
    console.log('\n' + '='.repeat(80));
    console.log('📍 MAP PIN ANSWER - TESTING VICINITY');
    console.log('='.repeat(80));
    console.log(`Question: ${currentQuestion.question}`);
    console.log('-'.repeat(80));
    console.log(`👆 Your Click:       (${Math.round(pinPoint.x)}, ${Math.round(pinPoint.y)})`);
    console.log(`🎯 Correct Point:    (${currentQuestion.correctPoint.x}, ${currentQuestion.correctPoint.y})`);
    console.log(`📏 Distance:         ${Math.round(distance)} pixels`);
    console.log(`⚡ Threshold:        ${currentQuestion.threshold} pixels`);
    console.log('-'.repeat(80));
    if (isCorrect) {
      console.log('✅ RESULT: CORRECT! Distance within threshold.');
      console.log(`   Distance ${Math.round(distance)} ≤ Threshold ${currentQuestion.threshold}`);
    } else {
      console.log('❌ RESULT: WRONG! Distance exceeds threshold.');
      console.log(`   Distance ${Math.round(distance)} > Threshold ${currentQuestion.threshold}`);
      console.log(`   You were ${Math.round(distance - currentQuestion.threshold)} pixels too far.`);
    }
    console.log('='.repeat(80) + '\n');

    setAnswers([...answers, {
      question: currentQuestion.question,
      userAnswer: isCorrect ? "Richtige Region" : "Falsche Region",
      correctAnswer: currentQuestion.question.includes("Neudörfl") ? "Neudörfl (Burgenland)" :
                      currentQuestion.question.includes("Salzburg") ? "Salzburg/Anif" :
                      currentQuestion.question.includes("Hallstatt") ? "Hallstatt (Oberösterreich)" :
                      "Fugging (Oberösterreich)",
      isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
    }

    setPinPoint(null);
    advanceQuestion();
  };

  const advanceQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setScreen("ai-evaluation");
    }
  };

  // Start screen
  if (screen === "start") {
    return (
      <div className="container">
        <h1>🎄 Weihnachts-Quiz 🎄</h1>
        <h2>🎁 Wähle deine Familie 🎁</h2>
        <div style={{ textAlign: 'center', margin: '24px 0', fontSize: '48px', animation: 'float 3s ease-in-out infinite' }}>
          ⛄
        </div>
        <button className="btn-primary" onClick={() => selectFamily("Matis Family")}>
          Matis Family
        </button>
        <button className="btn-primary" onClick={() => selectFamily("Wallner Family")}>
          Wallner Family
        </button>
      </div>
    );
  }

  // Quiz screen
  if (screen === "quiz") {
    return (
      <div className="container">
        <div className="progress">
          Frage {currentQuestionIndex + 1} von {questions.length}
        </div>
        <span className="category">{currentQuestion.category}</span>
        <div className="question">{currentQuestion.question}</div>

        {currentQuestion.type === "mc" && (
          <div>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className="btn-option"
                onClick={() => handleMCAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === "date" && (
          <div>
            <div className="date-select">
              <select
                value={selectedDay ?? ""}
                onChange={(e) =>
                  setSelectedDay(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Tag</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                value={selectedMonth ?? ""}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <option value="">Monat</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear ?? ""}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <option value="">Jahr</option>
                {Array.from(
                  {
                    length:
                      currentQuestion.yearRange.to -
                      currentQuestion.yearRange.from +
                      1,
                  },
                  (_, i) => currentQuestion.yearRange.from + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn-primary"
              onClick={handleDateSubmit}
              disabled={
                selectedDay === null ||
                selectedMonth === null ||
                selectedYear === null
              }
            >
              Weiter
            </button>
          </div>
        )}

        {currentQuestion.type === "pin" && (
          <div>
            <div className="map-container">
              <img
                ref={imgRef}
                src={currentQuestion.mapUrl}
                alt="Austria Map"
                width={currentQuestion.mapWidth}
                height={currentQuestion.mapHeight}
                onClick={handleImageClick}
                style={{ cursor: "crosshair", display: "block" }}
              />
              {pinPoint && (
                <div
                  className="pin-marker-overlay"
                  style={{
                    left: `${(pinPoint.x / currentQuestion.mapWidth) * 100}%`,
                    top: `${(pinPoint.y / currentQuestion.mapHeight) * 100}%`,
                  }}
                />
              )}
            </div>
            <button
              className="btn-primary"
              onClick={handlePinSubmit}
              disabled={!pinPoint}
            >
              Weiter
            </button>
          </div>
        )}
      </div>
    );
  }

  // AI Evaluation screen
  if (screen === "ai-evaluation") {
    return (
      <div className="container">
        <h2>🤖 KI Auswertung</h2>

        <div className="result-text" style={{ marginBottom: '20px', fontSize: 'clamp(20px, 4vw, 24px)' }}>
          {score}/{questions.length} Punkte
        </div>

        <div className="ai-evaluation">
          {loadingEvaluation ? (
            <p style={{ textAlign: 'center', fontSize: '18px' }}>
              Die KI analysiert eure Antworten... 🤔
            </p>
          ) : (
            <p style={{ whiteSpace: 'pre-line' }}>{aiEvaluation}</p>
          )}
        </div>

        {!loadingEvaluation && (
          prizeUnlocked ? (
            <button
              className="btn-primary"
              onClick={() => setScreen("prize-unlocked")}
            >
              Geschenk abholen
            </button>
          ) : (
            <button className="btn-primary" onClick={resetQuiz}>
              Nochmal versuchen
            </button>
          )
        )}
      </div>
    );
  }

  // Prize unlocked screen
  if (screen === "prize-unlocked") {
    return (
      <div className="container">
        <div className="prize-text">
          Geschafft.
          {"\n"}Ihr habt das Geschenk freigeschaltet.
        </div>
        <button
          className="btn-primary"
          onClick={() => setScreen("prize-reveal")}
        >
          Open Prize
        </button>
      </div>
    );
  }

  // Prize reveal screen
  if (screen === "prize-reveal") {
    return (
      <div className="container">
        <div className="prize-text">
          Euer Geschenk:
          {"\n\n"}🎬 1 Jahr Curiosity Stream
          {"\n"}Dokumentationen & Geschichte
          {"\n\n"}Der Gutschein wird euch automatisch am 25.12. zugestellt.
        </div>
        <button className="btn-primary" onClick={resetQuiz}>
          Done
        </button>
      </div>
    );
  }

  return null;
}
