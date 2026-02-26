"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./questionaire.module.css";
import { trackAPI } from "../../utils/api";

export default function Questionnaire() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Modes: 
  // 1. Recommendation (No track param) -> Suggest a track
  // 2. Personalization (track param) -> Enroll in THAT track with preferences
  const targetTrack = searchParams.get('track');
  const targetTitle = searchParams.get('title');

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    role: "",
    goal: "",
    level: ""
  });

  const getQuestions = () => {
    // We could customize questions based on track, but generic is fine for now
    return [
      {
        id: "role",
        title: targetTrack ? `Personalizing ${targetTitle}` : "Tell us about yourself",
        subtitle: targetTrack ? "Help us adapt the tasks to your role." : "This helps us contextualize your learning.",
        options: [
          { label: "Student", value: "student", icon: "🎒" },
          { label: "Professional", value: "professional", icon: "💼" },
          { label: "Developer", value: "developer", icon: "💻" },
          { label: "Entrepreneur", value: "founder", icon: "🚀" }
        ]
      },
      {
        id: "goal",
        title: "What is your main goal?",
        subtitle: "We'll prioritize content that matches this.",
        options: [
          { label: "Boost Productivity", value: "productivity", icon: "⚡" },
          { label: "Learn Prompt Engineering", value: "prompting", icon: "🗣️" },
          { label: "Build AI Apps", value: "coding", icon: "🤖" },
          { label: "Upskill for Career", value: "career", icon: "📈" }
        ]
      },
      {
        id: "level",
        title: "What's your current AI knowledge?",
        subtitle: "We'll suggest the right starting point.",
        options: [
          { label: "Total Beginner", value: "beginner", icon: "🌱" },
          { label: "I've used ChatGPT", value: "intermediate", icon: "🌿" },
          { label: "Advanced User", value: "advanced", icon: "🌳" }
        ]
      }
    ];
  };

  const questions = getQuestions();

  const handleSelect = (value) => {
    setAnswers({ ...answers, [questions[step].id]: value });
  };

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      await finishQuestionnaire();
    }
  };

  const finishQuestionnaire = async () => {
    setLoading(true);

    let recommendedTrack = targetTrack || "chatgpt";
    let trackName = targetTitle || "ChatGPT Mastery";

    // If in Recommendation Mode (no targetTrack), infer from answers
    if (!targetTrack) {
      if (answers.goal === "coding" || answers.role === "developer") {
        recommendedTrack = "ai-coding";
        trackName = "AI for Developers";
      }
    }

    try {
      // Enroll with Preferences
      await trackAPI.enroll(recommendedTrack, {
        track_slug: recommendedTrack,
        track_name: trackName,
        preferences: answers // Save the answers!
      });

      // Force hard redirect to ensure state is clear
      window.location.href = `/track/${recommendedTrack}`;

    } catch (err) {
      console.error("Failed to enroll:", err);
      // Even if enroll fails (e.g. already enrolled), go to track
      window.location.href = `/track/${recommendedTrack}`;
    } finally {
      // setLoading(false); // No need if redirecting
    }
  };

  const currentQuestion = questions[step];
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* PROGRESS BAR */}
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>

        <h1 className={styles.title}>{currentQuestion.title}</h1>
        <p className={styles.subtitle}>{currentQuestion.subtitle}</p>

        {/* OPTIONS GRID */}
        <div className={styles.optionsGrid}>
          {currentQuestion.options.map((opt) => (
            <div
              key={opt.value}
              className={`${styles.optionCard} ${currentAnswer === opt.value ? styles.selected : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              <span className={styles.optionIcon}>{opt.icon}</span>
              <span className={styles.optionLabel}>{opt.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          {step > 0 && (
            <button
              className={styles.secondaryBtn}
              onClick={() => setStep(step - 1)}
              disabled={loading}
            >
              Back
            </button>
          )}

          <button
            className={styles.primaryBtn}
            onClick={handleNext}
            disabled={!currentAnswer || loading}
          >
            {loading ? "Personalizing..." : step === questions.length - 1 ? "Finish & Start Learning" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
