// src/components/ImprovementChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Sentiment from "sentiment";

const sentimentAnalyzer = new Sentiment();

// --- Helper functions ---
const sleepToNumber = (sleep) => {
  switch ((sleep || "").toLowerCase()) {
    case "poor":
      return 2;
    case "average":
      return 5;
    case "good":
      return 8;
    default:
      return 5;
  }
};

const getScoreColor = (score) => {
  if (score >= 7) return "#22c55e"; // good
  if (score >= 4) return "#f59e0b"; // medium
  return "#ef4444"; // low
};

const calculateSessionScore = (session) => {
  const {
    pain = 5,
    stress = 5,
    energy = 5,
    sleep = "average",
    feedbackText = "",
  } = session;

  const painScore = 10 - pain;
  const stressScore = 10 - stress;
  const energyScore = energy;
  const sleepScore = sleepToNumber(sleep);

  const sentiment = sentimentAnalyzer.analyze(feedbackText);
  const sentimentScore = ((sentiment.comparative + 1) / 2) * 10;

  const totalScore =
    (painScore + stressScore + energyScore + sleepScore + sentimentScore) / 5;

  return Math.round(totalScore * 10) / 10;
};

// --- Reusable Component ---
const ImprovementChart = ({
  sessions = [],
  title = "Improvement Over Sessions",
}) => {
  if (!sessions.length)
    return (
      <p className="text-sm text-slate-400 italic">
        No feedback data available yet.
      </p>
    );

  const chartData = sessions.map((session, index) => ({
    session: index + 1,
    score: calculateSessionScore(session),
    feedbackText: session.feedbackText || "No feedback",
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <h4 className="text-md font-semibold mb-3">{title}</h4>
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="session"
              label={{ value: "Session", position: "insideBottomRight" }}
            />
            <YAxis
              domain={[0, 10]}
              label={{ value: "Score", angle: -90, position: "outsideRight" }}
            />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload && payload.length ? (
                  <div className="bg-white p-2 rounded shadow border text-sm">
                    <strong>Session:</strong> {label}
                    <br />
                    <strong>Feedback:</strong> {payload[0].payload.feedbackText}
                  </div>
                ) : null
              }
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="url(#areaGradient)"
              fill="url(#areaGradient)"
              strokeWidth={3}
              dot={(props) => (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={6}
                  fill={getScoreColor(props.payload.score)}
                  stroke="#fff"
                  strokeWidth={1.5}
                />
              )}
              activeDot={{ r: 8 }}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ImprovementChart;
