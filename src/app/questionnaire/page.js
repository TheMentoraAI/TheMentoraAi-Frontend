"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./questionaire.module.css";
import { trackAPI } from "../../utils/api";

const Icons = {
  Student: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  Briefcase: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Code: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Rocket: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  Box: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Megaphone: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
  PenTool: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  GraduationCap: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  Zap: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  MessageSquare: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  TrendingUp: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Workflow: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="18" y1="9" x2="18" y2="15"/></svg>,
  Sprout: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>,
  Leaf: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  TreePine: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.8 1.7H17Z"/><path d="M12 22v-3"/></svg>
};

function QuestionnaireContent() {
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
          { label: "Student", value: "student", icon: Icons.Student },
          { label: "Professional", value: "professional", icon: Icons.Briefcase },
          { label: "Developer", value: "developer", icon: Icons.Code },
          { label: "Founder", value: "founder", icon: Icons.Rocket },
          { label: "Product Manager", value: "product_manager", icon: Icons.Box },
          { label: "Marketer", value: "marketer", icon: Icons.Megaphone },
          { label: "Designer", value: "designer", icon: Icons.PenTool },
          { label: "Educator", value: "educator", icon: Icons.GraduationCap }
        ]
      },
      {
        id: "goal",
        title: "What is your main goal?",
        subtitle: "We'll prioritize content that matches this.",
        options: [
          { label: "Boost Productivity", value: "productivity", icon: Icons.Zap },
          { label: "Learn Prompt Engineering", value: "prompting", icon: Icons.MessageSquare },
          { label: "Build AI Apps", value: "coding", icon: Icons.Code },
          { label: "Upskill for Career", value: "career", icon: Icons.TrendingUp },
          { label: "Automate Workflows", value: "automation", icon: Icons.Workflow }
        ]
      },
      {
        id: "level",
        title: "What's your current AI knowledge?",
        subtitle: "We'll suggest the right starting point.",
        options: [
          { label: "Total Beginner", value: "beginner", icon: Icons.Sprout },
          { label: "I've used ChatGPT", value: "intermediate", icon: Icons.Leaf },
          { label: "Advanced User", value: "advanced", icon: Icons.TreePine }
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

export default function Questionnaire() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>}>
      <QuestionnaireContent />
    </Suspense>
  );
}
