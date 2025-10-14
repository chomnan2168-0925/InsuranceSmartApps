import React, { useState } from "react";

interface Question {
  question: string | JSX.Element; // ✅ Allow JSX or string
  options: string[];
  answer: string;
}

const questions: Question[] = [
  {
    question: (
      <>
        David has 4 apples🍎, Maria has 3 bananas🍌, and Anjo has 5 balls⚽.
        <br /> How many fruits do they all have?
      </>
    ),
    options: ["7", "9", "12"],
    answer: "7",
  },
  {
    question: (
      <>
        You invest $10 💵 in a product and sell it for $15.
        <br /> What’s your profit 💵?
      </>
    ),
    options: ["$25", "$5", "$10"],
    answer: "$5",
  },
  {
    question: (
      <>
        🏢 A company ships 8 boxes📦 per truck🚚. They have 3 trucks today.
        <br /> How many boxes📦 in total?
      </>
    ),
    options: ["24", "18", "11"],
    answer: "24",
  },
  {
    question: (
      <>
        A meeting was planned for 🕒3 PM. Everyone💼 arrived 15 minutes late.
        <br /> What time did it actually start?
      </>
    ),
    options: ["3:15 PM", "2:45 PM", "4:00 PM"],
    answer: "3:15 PM",
  },
  {
    question: (
      <>
        🍔🥤 A meal combo costs $12. A burger 🍔 alone costs $8.
        <br /> How much is the drink 🥤?
      </>
    ),
    options: ["$4", "$3", "$20"],
    answer: "$4",
  },
];

const PuzzleGame: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (selected: string) => {
    if (selected === questions[current].answer) {
      setScore(score + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetGame = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center">
        <h3 className="text-5xl font-bold text-navy-blue mb-4">Game Over! 🎉</h3>
        <p className="text-xl text-gray-700 mb-6">
          You scored{" "}
          <span className="text-xl font-bold text-gold">{score}</span> out of{" "}
          {questions.length}.
        </p>
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-gold text-white rounded-xl shadow hover:bg-yellow-500 transition-all text-lg"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-10 text-center">
      <h3 className="text-2xl font-bold text-navy-blue mb-3">
        Question ({current + 1} of {questions.length})
      </h3>
      <p className="text-lg text-gray-700 mb-8">{questions[current].question}</p>

      <div className="grid grid-cols-3 gap-4">
        {questions[current].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="w-full py-4 text-xl font-semibold rounded-xl border border-gray-300 hover:bg-gold hover:text-white transition-all"
          >
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PuzzleGame;
