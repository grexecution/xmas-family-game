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

type TextQuestion = {
  id: number;
  type: "text";
  category: "History" | "Music" | "Architecture" | "Fun" | "Austria";
  question: string;
  hint?: string;
  imageUrl?: string;
  correctAnswers: string[];
  caseSensitive?: boolean;
};

type Question = MCQuestion | DateQuestion | PinQuestion | TextQuestion;

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
        threshold: 150,
      }
    : {
        id: 1,
        type: "pin",
        category: "Austria",
        question: "Tippe auf die Karte: Wo liegt ungefähr Anif?",
        mapUrl: "/austria-map.png",
        mapWidth: 960,
        mapHeight: 536,
        correctPoint: { x: 210, y: 200 },
        threshold: 150,
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
      threshold: 150,
    },
    {
      id: 5,
      type: "mc",
      category: "History",
      question: "Welcher Kaiser führte die Tradition des geschmückten Weihnachtsbaums in Österreich ein?",
      options: [
        "Kaiser Franz Joseph I.",
        "Kaiser Karl I.",
        "Kaiserin Maria Theresia",
        "Kaiser Franz II.",
      ],
      correctIndex: 0,
    },
    {
      id: 6,
      type: "mc",
      category: "History",
      question: "Wann wurde der erste Wiener Christkindlmarkt am Rathausplatz eröffnet?",
      options: [
        "1764",
        "1892",
        "1924",
        "1955",
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
        "Spaß",
        "Der Preis am Ende",
        "Rechthaben",
      ],
      correctIndex: 2,
    },
    {
      id: 9,
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
      type: "text",
      category: "Music",
      question: "Weihnachts-Emoji-Rätsel: 🚗🏠🎄",
      hint: "Beliebter Weihnachtssong",
      correctAnswers: ["Driving Home for Christmas", "Driving Home For Christmas", "driving home for christmas"],
      caseSensitive: false,
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
      type: "mc",
      category: "Fun",
      question: "Und zum Abschluss: Wer ist der ultimative Quizmaster?",
      options: ["Gregor Wallner", "Armin Assinger", "Günther Jauch", "Steve Harvey"],
      correctIndex: 0,
    },
  ];
};

type Screen =
  | "start"
  | "quiz"
  | "ai-evaluation"
  | "answer-review"
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

  // Text question state
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

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
              answers,
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
    setTextAnswer("");
    setShowImageModal(false);
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

  const handleTextSubmit = () => {
    if (currentQuestion.type !== "text") return;
    if (!textAnswer.trim()) return;

    const userAnswer = textAnswer.trim();
    const isCorrect = currentQuestion.correctAnswers.some(answer => {
      if (currentQuestion.caseSensitive) {
        return userAnswer === answer;
      }
      return userAnswer.toLowerCase() === answer.toLowerCase();
    });

    setAnswers([...answers, {
      question: currentQuestion.question,
      userAnswer: userAnswer,
      correctAnswer: currentQuestion.correctAnswers[0],
      isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
    }

    setTextAnswer("");
    setShowImageModal(false);
    advanceQuestion();
  };

  const advanceQuestion = () => {
    // Remove focus from any active element to prevent hover/focus states
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

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
        <button
          className="btn-primary"
          onClick={() => selectFamily("Matis Family")}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', padding: '18px 24px' }}
        >
          <img
            src="/matis.png"
            alt="Matis Family"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3.5px solid rgba(255, 215, 0, 0.7)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25), 0 0 20px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            }}
          />
          <span style={{ fontSize: '17px', letterSpacing: '0.5px' }}>Matis Family</span>
        </button>
        <button
          className="btn-primary"
          onClick={() => selectFamily("Wallner Family")}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', padding: '18px 24px' }}
        >
          <img
            src="/wallner.png"
            alt="Wallner Family"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3.5px solid rgba(255, 215, 0, 0.7)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25), 0 0 20px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            }}
          />
          <span style={{ fontSize: '17px', letterSpacing: '0.5px' }}>Wallner Family</span>
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
            <div className="map-container" style={{ position: 'relative' }}>
              <img
                ref={imgRef}
                src={currentQuestion.mapUrl}
                alt="Austria Map"
                onClick={handleImageClick}
                style={{ cursor: "crosshair", display: "block", width: '100%', height: 'auto' }}
              />
              {pinPoint && imgRef.current && (
                <div
                  className="pin-marker-overlay"
                  style={{
                    left: `${(pinPoint.x / imgRef.current.naturalWidth) * 100}%`,
                    top: `${(pinPoint.y / imgRef.current.naturalHeight) * 100}%`,
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

        {currentQuestion.type === "text" && (
          <div>
            {currentQuestion.hint && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.12), rgba(34, 139, 34, 0.08))',
                padding: '14px 18px',
                borderRadius: '14px',
                marginBottom: '24px',
                fontSize: 'clamp(13px, 3.5vw, 15px)',
                color: '#2c3e50',
                fontStyle: 'italic',
                border: '1.5px solid rgba(255, 215, 0, 0.35)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                fontWeight: '500',
                letterSpacing: '0.2px'
              }}>
                💡 Tipp: {currentQuestion.hint}
              </div>
            )}

            {currentQuestion.imageUrl && (
              <>
                <div
                  onClick={() => setShowImageModal(true)}
                  style={{
                    cursor: 'pointer',
                    marginBottom: '24px',
                    border: '3px solid rgba(255, 215, 0, 0.4)',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), 0 0 40px rgba(255, 215, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.4)';
                  }}
                >
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Frage Bild"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: 'clamp(11px, 3vw, 13px)',
                    fontWeight: '700',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '0.3px'
                  }}>
                    🔍 Klicken zum Vergrößern
                  </div>
                </div>

                {showImageModal && (
                  <div
                    onClick={() => setShowImageModal(false)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.95)',
                      zIndex: 9999,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={currentQuestion.imageUrl}
                      alt="Vergrößertes Bild"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      background: 'white',
                      color: '#DC143C',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}>
                      ×
                    </div>
                  </div>
                )}
              </>
            )}

            <input
              type="text"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && textAnswer.trim()) {
                  handleTextSubmit();
                }
              }}
              placeholder="Deine Antwort hier eingeben..."
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(220, 20, 60, 0.5)';
                e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12), 0 0 0 3px rgba(220, 20, 60, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(220, 20, 60, 0.25)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
              }}
              style={{
                width: '100%',
                minHeight: 'clamp(50px, 11vw, 56px)',
                fontSize: 'clamp(15px, 3.5vw, 17px)',
                fontWeight: '600',
                padding: '14px 18px',
                border: '2px solid rgba(220, 20, 60, 0.25)',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ffffff 0%, #fffbfb 100%)',
                color: '#2c3e50',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                letterSpacing: '0.2px'
              }}
            />

            <button
              className="btn-primary"
              onClick={handleTextSubmit}
              disabled={!textAnswer.trim()}
            >
              Antwort absenden
            </button>
          </div>
        )}
      </div>
    );
  }

  // AI Evaluation screen
  if (screen === "ai-evaluation") {
    // Parse scores from AI evaluation
    const parseScores = (text: string) => {
      const intelligenzMatch = text.match(/Intelligenz:\s*(\d+)\/100/);
      const wissenMatch = text.match(/Wissen:\s*(\d+)\/100/);
      const peinlichkeitMatch = text.match(/Peinlichkeit:\s*(\d+)\/100/);
      const schoenheitMatch = text.match(/Schönheitspunkte:\s*(\d+)\/100/);

      return {
        intelligenz: intelligenzMatch ? parseInt(intelligenzMatch[1]) : 0,
        wissen: wissenMatch ? parseInt(wissenMatch[1]) : 0,
        peinlichkeit: peinlichkeitMatch ? parseInt(peinlichkeitMatch[1]) : 0,
        schoenheit: schoenheitMatch ? parseInt(schoenheitMatch[1]) : 100
      };
    };

    // Extract text without scores
    const getEvaluationText = (text: string) => {
      return text.split(/Intelligenz:/)[0].trim();
    };

    // Extract final verdict
    const getFinalVerdict = (text: string) => {
      const verdictMatch = text.match(/(🎁|❌).*$/);
      return verdictMatch ? verdictMatch[0] : '';
    };

    const scores = aiEvaluation ? parseScores(aiEvaluation) : null;
    const evaluationText = aiEvaluation ? getEvaluationText(aiEvaluation) : '';
    const finalVerdict = aiEvaluation ? getFinalVerdict(aiEvaluation) : '';

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
            <>
              <p style={{ marginBottom: '24px' }}>{evaluationText}</p>

              {scores && (
                <div style={{ marginBottom: '24px' }}>
                  {/* Intelligenz */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', color: '#2c3e50', fontSize: 'clamp(13px, 3.5vw, 15px)' }}>🧠 Intelligenz</span>
                      <span style={{ fontWeight: '800', color: '#4A90E2', fontSize: 'clamp(13px, 3.5vw, 15px)' }}>{scores.intelligenz}/100</span>
                    </div>
                    <div style={{
                      height: '28px',
                      background: 'linear-gradient(135deg, #e8eef5 0%, #f0f4f8 100%)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '2px solid rgba(74, 144, 226, 0.15)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${scores.intelligenz}%`,
                        background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 10px rgba(74, 144, 226, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        position: 'relative'
                      }} />
                    </div>
                  </div>

                  {/* Wissen */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', color: '#2c3e50', fontSize: 'clamp(13px, 3.5vw, 15px)' }}>📚 Wissen</span>
                      <span style={{ fontWeight: '800', color: '#9B59B6', fontSize: 'clamp(13px, 3.5vw, 15px)' }}>{scores.wissen}/100</span>
                    </div>
                    <div style={{
                      height: '28px',
                      background: 'linear-gradient(135deg, #f3eef8 0%, #f8f4fb 100%)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '2px solid rgba(155, 89, 182, 0.15)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${scores.wissen}%`,
                        background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
                        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                        boxShadow: '0 2px 10px rgba(155, 89, 182, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        position: 'relative'
                      }} />
                    </div>
                  </div>

                  {/* Peinlichkeit */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', color: '#2c3e50', fontSize: 'clamp(13px, 3.5vw, 15px)' }}>😳 Peinlichkeit</span>
                      <span style={{ fontWeight: '800', color: '#E74C3C', fontSize: 'clamp(13px, 3.5vw, 15px)' }}>{scores.peinlichkeit}/100</span>
                    </div>
                    <div style={{
                      height: '28px',
                      background: 'linear-gradient(135deg, #fdecea 0%, #fff5f4 100%)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '2px solid rgba(231, 76, 60, 0.15)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${scores.peinlichkeit}%`,
                        background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
                        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
                        boxShadow: '0 2px 10px rgba(231, 76, 60, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        position: 'relative'
                      }} />
                    </div>
                  </div>

                  {/* Schönheitspunkte */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', color: '#2c3e50', fontSize: 'clamp(13px, 3.5vw, 15px)' }}>✨ Schönheitspunkte</span>
                      <span style={{ fontWeight: '800', color: '#F39C12', fontSize: 'clamp(13px, 3.5vw, 15px)' }}>{scores.schoenheit}/100</span>
                    </div>
                    <div style={{
                      height: '28px',
                      background: 'linear-gradient(135deg, #fef5e7 0%, #fffbf0 100%)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '2px solid rgba(243, 156, 18, 0.15)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${scores.schoenheit}%`,
                        background: 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)',
                        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.6s',
                        boxShadow: '0 2px 10px rgba(243, 156, 18, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        position: 'relative'
                      }} />
                    </div>
                  </div>
                </div>
              )}

              {finalVerdict && (
                <p style={{
                  fontSize: 'clamp(16px, 4vw, 18px)',
                  fontWeight: '700',
                  textAlign: 'center',
                  padding: '16px',
                  background: prizeUnlocked
                    ? 'linear-gradient(135deg, rgba(34, 139, 34, 0.15), rgba(46, 139, 87, 0.1))'
                    : 'linear-gradient(135deg, rgba(220, 20, 60, 0.15), rgba(231, 76, 60, 0.1))',
                  borderRadius: '12px',
                  border: prizeUnlocked
                    ? '2px solid rgba(34, 139, 34, 0.3)'
                    : '2px solid rgba(220, 20, 60, 0.3)',
                  marginTop: '8px'
                }}>
                  {finalVerdict}
                </p>
              )}
            </>
          )}
        </div>

        {!loadingEvaluation && (
          <>
            {prizeUnlocked ? (
              <>
                <button
                  className="btn-primary"
                  onClick={() => setScreen("prize-reveal")}
                  style={{
                    background: 'linear-gradient(135deg, #228B22 0%, #2E8B57 100%)',
                    borderColor: 'rgba(255, 215, 0, 0.6)',
                    borderWidth: '2px',
                    marginBottom: '14px',
                    fontSize: 'clamp(17px, 4vw, 19px)',
                    fontWeight: '800',
                    boxShadow: '0 10px 32px rgba(34, 139, 34, 0.5), 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 40px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    animation: 'glow 2s ease-in-out infinite',
                    letterSpacing: '0.5px'
                  }}
                >
                  🎁 Geschenk ansehen 🎁
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setScreen("answer-review")}
                  style={{
                    background: 'linear-gradient(135deg, #5a6c7d 0%, #7a8a9a 100%)',
                    fontSize: 'clamp(14px, 3.5vw, 15px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 6px 20px rgba(90, 108, 125, 0.35), 0 3px 10px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                >
                  Antworten überprüfen
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-primary"
                  onClick={() => setScreen("answer-review")}
                  style={{ marginBottom: '12px' }}
                >
                  Antworten überprüfen
                </button>
                <button className="btn-primary" onClick={resetQuiz}>
                  Nochmal versuchen
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
  }

  // Answer Review screen
  if (screen === "answer-review") {
    return (
      <div className="container">
        <h2>📋 Antwortübersicht</h2>
        <div className="result-text" style={{ marginBottom: '20px', fontSize: 'clamp(18px, 4vw, 20px)' }}>
          {score}/{questions.length} richtig
        </div>

        <div style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '24px' }}>
          {answers.map((answer, index) => (
            <div
              key={index}
              style={{
                background: answer.isCorrect
                  ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)'
                  : 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                border: answer.isCorrect ? '2px solid #28a745' : '2px solid #dc3545',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: answer.isCorrect ? '#155724' : '#721c24',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>{answer.isCorrect ? '✅' : '❌'}</span>
                <span>Frage {index + 1}</span>
              </div>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {answer.question}
              </div>
              <div style={{ fontSize: '14px', color: '#495057' }}>
                <div>
                  <strong>Deine Antwort:</strong> {answer.userAnswer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={() => setScreen("ai-evaluation")}
        >
          Zurück zur Auswertung
        </button>
      </div>
    );
  }

  // Prize reveal screen
  if (screen === "prize-reveal") {
    return (
      <div className="container">
        <h1 style={{ marginBottom: '24px' }}>🎁 Euer Geschenk 🎁</h1>
        <div className="prize-text">
          <h3>🎬 1 Jahr Curiosity Stream Premium</h3>
          {"\n\n"}
          Tausende Dokumentationen über Geschichte, Wissenschaft, Natur, Technologie und vieles mehr. Streamt auf allen Geräten – ohne Werbung, in HD-Qualität.
          {"\n\n"}
          Von historischen Ereignissen bis zu den Geheimnissen des Universums: Entdeckt die Welt mit den besten Dokumentarfilmen und Serien.
          {"\n\n"}
          💌 Der Gutscheincode wird euch automatisch am 25.12. per E-Mail zugestellt.
        </div>
        <button className="btn-primary" onClick={resetQuiz}>
          Fertig
        </button>
      </div>
    );
  }

  return null;
}
