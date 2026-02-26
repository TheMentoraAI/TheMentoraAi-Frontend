"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./task.module.css";
import Sidebar from "../../../components/Sidebar";
import Footer from "../../../components/Footer";
import useAuth from "../../hooks/useAuth";
import { legacyAPI, trackAPI } from "../../../utils/api";

export default function TaskPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const taskId = resolvedParams.taskId;
  const trackName = searchParams.get("track") || "chatgpt";

  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  // Auth check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // ---- FETCH TASK AND TRACK DATA ----
  useEffect(() => {
    async function fetchTask() {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        // Fetch all lessons to generate task list
        const lessonsResponse = await legacyAPI.getLessons(trackName);
        const lessons = lessonsResponse.data.lessons || [];

        // Generate task list (3 tasks per lesson)
        const taskList = [];
        lessons.forEach((lesson, lessonIndex) => {
          for (let i = 1; i <= 3; i++) {
            taskList.push({
              id: `${lessonIndex + 1}-${i}`, // Match format: 1-1, 1-2, etc.
              lessonIndex,
              taskNumber: i,
              lessonTitle: lesson.title
            });
          }
        });
        setAllTasks(taskList);

        // Find current task index
        // Debug logging to help verify
        console.log("Looking for taskId:", taskId);
        console.log("In taskList:", taskList.map(t => t.id));

        const currentIndex = taskList.findIndex(t => t.id === taskId);
        console.log("Found index:", currentIndex);

        setCurrentTaskIndex(currentIndex >= 0 ? currentIndex : 0);

        // Generate the actual task content
        const res = await legacyAPI.generateTask({ track: trackName, taskId: taskId });
        setTask(res.data.task);
      } catch (err) {
        setTask("Error loading task");
      } finally {
        setLoading(false);
      }
    }

    fetchTask();
  }, [trackName, taskId, isAuthenticated]);

  // ---- EVALUATE ----
  const evaluateTask = async () => {
    setEvaluating(true);

    try {
      const res = await legacyAPI.evaluate({
        prompt,
        output,
        track: trackName,
        taskId: taskId
      });

      const data = res.data;
      setEvaluation(data.evaluation);

      // Parse score from evaluation text
      const scoreMatch = data.evaluation.match(/Score:\s*(\d+(\.\d+)?)\/10/);
      const parsedScore = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
      setScore(parsedScore * 10);

      // Parse Feedback Summary
      const feedbackMatch = data.evaluation.match(/Feedback Summary:\s*(.*)/i);
      const feedbackSummary = feedbackMatch ? feedbackMatch[1].trim() : "";

      // If score is high enough, mark as completed in backend
      if (parsedScore >= 7) {
        setIsCompleted(true);
        try {
          const currentTask = allTasks[currentTaskIndex];

          const payload = {
            track_slug: trackName,
            lesson_index: currentTask ? currentTask.lessonIndex : 0,
            task_index: currentTask ? currentTask.taskNumber : 1,
            prompt: prompt,
            user_output: output,
            ai_evaluation: data.evaluation,
            score: parsedScore * 10,
            xp_earned: 100,
            // time_spent_minutes: 15,
            feedback_summary: feedbackSummary // Save the feedback!
          };

          console.log("Sending completion payload (eval):", payload);

          await trackAPI.completeTask(taskId, payload);
        } catch (err) {
          console.error("Failed to update task completion", err);
        }
      }
    } catch (err) {
      setEvaluation("Error evaluating task");
    }

    setEvaluating(false);
  };

  const handleNextTask = async () => {
    // Save task as completed/attempted even if score is low
    if (!isCompleted) {
      try {
        const currentTask = allTasks[currentTaskIndex];

        const payload = {
          track_slug: trackName,
          lesson_index: currentTask ? currentTask.lessonIndex : 0,
          task_index: currentTask ? currentTask.taskNumber : 1,
          prompt: prompt || "",
          user_output: output || "",
          ai_evaluation: evaluation || "",
          score: score,
          xp_earned: Math.max(50, score), // Give at least 50 XP for attempting
          // time_spent_minutes: 15, // Removed to generic safe compatibility
          feedback_summary: `Attempted with score ${score / 10}/10`
        };

        console.log("Sending completion payload:", payload);

        await trackAPI.completeTask(taskId, payload);
      } catch (err) {
        console.error("Failed to save task attempt", err);
      }
    }

    // Check if there's a next task
    // Always return to track page as per user request (One task per lesson flow)
    router.push(`/track/${trackName}`);
  };

  const handleTryAgain = () => {
    // Clear inputs and evaluation to let user try again
    setPrompt("");
    setOutput("");
    setEvaluation("");
    setScore(0);
    setIsCompleted(false);
  };

  // Clear all inputs
  const clearAll = () => {
    setPrompt("");
    setOutput("");
    setEvaluation("");
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <Sidebar />

        <div className={styles.content}>
          {/* HEADER */}
          <header className={styles.header}>
            <h1 className={styles.title}>AI Task Challenge</h1>
            <p className={styles.subtitle}>Complete the task and get evaluated</p>
            <div className={styles.taskInfo}>
              <span className={styles.taskTag}>Track: {trackName.replace("-", " ")}</span>
              <span className={styles.taskStatus}>
                {isCompleted ? "✅ Completed" : "🚀 Active Task"}
              </span>
            </div>
          </header>

          {/* TASK DISPLAY */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Task Details</h2>
              {loading && <span className={styles.loadingDot}>Loading...</span>}
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>🎯</div>
                <div>
                  <h3 className={styles.cardTitle}>Your Task</h3>
                  <p className={styles.cardHint}>Complete this challenge to advance</p>
                </div>
              </div>

              <div className={styles.taskContent}>
                {loading ? (
                  <div className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                    <span>Generating adaptive task...</span>
                  </div>
                ) : (
                  <pre className={styles.taskText}>{task}</pre>
                )}
              </div>
            </div>
          </section>

          {/* INPUT SECTIONS */}
          <div className={styles.inputsGrid}>
            {/* PROMPT INPUT */}
            <div className={styles.inputSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Your Prompt</h2>
                <span className={styles.sectionHint}>Step 1: Write your prompt</span>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>💭</div>
                  <h3 className={styles.cardTitle}>AI Prompt</h3>
                </div>

                <textarea
                  className={styles.textarea}
                  placeholder="Paste the prompt you gave to the AI here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                />

                <div className={styles.charCount}>
                  {prompt.length} characters
                </div>
              </div>
            </div>

            {/* LLM OUTPUT */}
            <div className={styles.inputSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>AI Response</h2>
                <span className={styles.sectionHint}>Step 2: Paste AI's response</span>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>🤖</div>
                  <h3 className={styles.cardTitle}>LLM Output</h3>
                </div>

                <textarea
                  className={styles.textarea}
                  placeholder="Paste the AI response/output here..."
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  rows={6}
                />

                <div className={styles.charCount}>
                  {output.length} characters
                </div>
              </div>
            </div>
          </div>

          {/* EVALUATION CONTROLS */}
          <section className={styles.evaluationSection}>
            <div className={styles.controls}>
              <button
                className={styles.clearBtn}
                onClick={clearAll}
                disabled={!prompt && !output && !evaluation}
              >
                Clear All
              </button>

              <button
                className={`${styles.evaluateBtn} ${evaluating ? styles.evaluating : ''}`}
                onClick={evaluateTask}
                disabled={evaluating || !prompt || !output}
              >
                {evaluating ? (
                  <>
                    <div className={styles.spinner}></div>
                    Evaluating...
                  </>
                ) : (
                  'Evaluate Task'
                )}
              </button>
            </div>

            {/* EVALUATION RESULT */}
            {evaluation && (
              <div className={styles.evaluationResult}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Evaluation Result</h2>
                  <span className={`${styles.scoreBadge} ${score >= 70 ? styles.scorePass : styles.scoreFail}`}>
                    Score: {score / 10}/10
                  </span>
                </div>

                <div className={`${styles.card} ${styles.evaluationCard}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>📊</div>
                    <div>
                      <h3 className={styles.cardTitle}>AI Evaluation</h3>
                      <p className={styles.cardHint}>Feedback on your prompt and response</p>
                    </div>
                  </div>

                  <div className={styles.evaluationContent}>
                    <pre className={styles.evalText}>{evaluation}</pre>
                  </div>

                  <div className={styles.evaluationActions}>
                    {isCompleted ? (
                      <button
                        className={styles.primaryBtn}
                        onClick={() => router.push(`/track/${trackName}`)}
                      >
                        Return to Track
                      </button>
                    ) : (
                      <>
                        <button className={styles.secondaryBtn} onClick={handleTryAgain}>
                          Try Again
                        </button>
                        <button className={styles.primaryBtn} onClick={handleNextTask}>
                          Return to Track →
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          <Footer />
        </div>
      </div>
    </main>
  );
}