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

// All 12 questions
const questions: Question[] = [
  {
    id: 1,
    type: "mc",
    category: "History",
    question:
      "In welchem Schloss wurde der Österreichische Staatsvertrag 1955 unterzeichnet?",
    options: ["Schönbrunn", "Belvedere", "Hofburg", "Mirabell"],
    correctIndex: 1,
  },
  {
    id: 2,
    type: "mc",
    category: "Music",
    question: "Welcher Song von Falco erreichte Platz 1 in den USA?",
    options: ["Rock Me Amadeus", "Vienna Calling", "Jeanny", "Der Kommissar"],
    correctIndex: 0,
  },
  {
    id: 3,
    type: "mc",
    category: "Music",
    question: "Die Operette 'Die Fledermaus' wurde komponiert von …",
    options: ["Mozart", "Johann Strauss Sohn", "Haydn", "Schubert"],
    correctIndex: 1,
  },
  {
    id: 4,
    type: "mc",
    category: "History",
    question: "Österreich ist der EU beigetreten im Jahr …",
    options: ["1989", "1995", "2002", "2007"],
    correctIndex: 1,
  },
  {
    id: 5,
    type: "mc",
    category: "Music",
    question: "Conchita Wurst gewann den Eurovision Song Contest mit …",
    options: ["Rise Like a Phoenix", "Heroes", "Euphoria", "Waterloo"],
    correctIndex: 0,
  },
  {
    id: 6,
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
    id: 7,
    type: "mc",
    category: "Music",
    question: "Das berühmte Neujahrskonzert findet statt im …",
    options: ["Musikverein", "Konzerthaus", "Staatsoper", "Burgtheater"],
    correctIndex: 0,
  },
  {
    id: 8,
    type: "mc",
    category: "Fun",
    question: "Mozart wurde geboren in …",
    options: ["Wien", "Salzburg", "Graz", "Innsbruck"],
    correctIndex: 1,
  },
  {
    id: 9,
    type: "mc",
    category: "Fun",
    question: "Die Donau fließt durch …",
    options: ["Graz", "Wien", "Klagenfurt", "Bregenz"],
    correctIndex: 1,
  },
  {
    id: 10,
    type: "mc",
    category: "Music",
    question: "Die österreichische Band STS sang auf …",
    options: ["Hochdeutsch", "Steirisch", "Wienerisch", "Tirolerisch"],
    correctIndex: 1,
  },
  {
    id: 11,
    type: "date",
    category: "History",
    question:
      "Wann wurde der Österreichische Staatsvertrag unterzeichnet? (Datum auswählen)",
    correctISO: "1955-05-15",
    yearRange: { from: 1950, to: 1960 },
  },
  {
    id: 12,
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

type Screen =
  | "start"
  | "quiz"
  | "ai-evaluation"
  | "results"
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);

  // Date question state
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Pin question state
  const [pinPoint, setPinPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const imgRef = useRef<HTMLImageElement>(null);

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

  const resetQuiz = () => {
    setScreen("start");
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedDay(null);
    setSelectedMonth(null);
    setSelectedYear(null);
    setPinPoint(null);
  };

  const startQuiz = () => {
    setScreen("quiz");
  };

  const handleMCAnswer = (optionIndex: number) => {
    if (currentQuestion.type !== "mc") return;

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const userAnswer = currentQuestion.options[optionIndex];
    const correctAnswer = currentQuestion.options[currentQuestion.correctIndex];

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

    setAnswers([...answers, {
      question: currentQuestion.question,
      userAnswer: isCorrect ? "Richtige Region" : "Falsche Region",
      correctAnswer: "Fugging (Oberösterreich)",
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
        <h2>🎁 Für Mama & Papa 🎁</h2>
        <div style={{ textAlign: 'center', margin: '24px 0', fontSize: '48px', animation: 'float 3s ease-in-out infinite' }}>
          ⛄
        </div>
        <button className="btn-primary" onClick={startQuiz}>
          🎅 Quiz Starten 🎅
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
    const [aiEvaluation, setAiEvaluation] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchEvaluation = async () => {
        try {
          const response = await fetch('/api/evaluate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              answers,
              score,
              totalQuestions: questions.length,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setAiEvaluation(data.evaluation);
          } else {
            setAiEvaluation("Die KI konnte keine Auswertung erstellen. Aber ihr habt es großartig gemacht! 🎄");
          }
        } catch (error) {
          setAiEvaluation("Die KI hat gerade Pause. Aber ihr wart super! 🎅");
        } finally {
          setLoading(false);
        }
      };

      fetchEvaluation();
    }, []);

    return (
      <div className="container">
        <h2>🤖 KI Auswertung</h2>
        <div className="ai-evaluation">
          {loading ? (
            <p style={{ textAlign: 'center', fontSize: '18px' }}>
              Die KI analysiert eure Antworten... 🤔
            </p>
          ) : (
            <p>{aiEvaluation}</p>
          )}
        </div>
        <button
          className="btn-primary"
          onClick={() => setScreen("results")}
          disabled={loading}
        >
          Ergebnis anzeigen
        </button>
      </div>
    );
  }

  // Results screen
  if (screen === "results") {
    const passed = score >= 8;

    return (
      <div className="container">
        <div className="result-text">
          Du hast {score}/{questions.length} Punkte.
        </div>
        {passed ? (
          <button
            className="btn-primary"
            onClick={() => setScreen("prize-unlocked")}
          >
            Weiter
          </button>
        ) : (
          <button className="btn-primary" onClick={resetQuiz}>
            Nochmal versuchen
          </button>
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
          {"\n"}Ein gemeinsames Dinner – ich reserviere,
          {"\n"}ihr entscheidet das Datum.
        </div>
        <button className="btn-primary" onClick={resetQuiz}>
          Done
        </button>
      </div>
    );
  }

  return null;
}
