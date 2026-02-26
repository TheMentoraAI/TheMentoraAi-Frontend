"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";
import Footer from "../../components/Footer";
import useAuth from "../hooks/useAuth";
import { userAPI, trackAPI } from "../../utils/api";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [enrolledTracks, setEnrolledTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch user stats and enrolled tracks
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        // Fetch stats
        console.log('Fetching user stats from:', `${process.env.NEXT_PUBLIC_API_URL}/api/users/stats`);
        const statsResponse = await userAPI.getStats();
        console.log('Stats response:', statsResponse.data);
        setStats(statsResponse.data);

        // Fetch enrolled tracks
        console.log('Fetching enrolled tracks from:', `${process.env.NEXT_PUBLIC_API_URL}/api/tracks/enrolled`);
        const tracksResponse = await trackAPI.getEnrolled();
        console.log('Tracks response:', tracksResponse.data);
        setEnrolledTracks(tracksResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          data: error.response?.data
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // All available tracks (for browsing)
  const allTracks = [
    {
      title: "ChatGPT Mastery",
      description: "Master prompt engineering and AI workflows",
      icon: "💬",
      slug: "chatgpt"
    },
    {
      title: "CANVA AI",
      description: "Design with AI-powered tools",
      icon: "🎨",
      slug: "canva"
    },
    {
      title: "NOTION AI",
      description: "Boost productivity with AI assistance",
      icon: "📝",
      slug: "notion"
    },
    {
      title: "CURSOR AI",
      description: "AI-powered code editor mastery",
      icon: "💻",
      slug: "cursor"
    },
    {
      title: "JASPER AI",
      description: "Content creation with AI",
      icon: "✍️",
      slug: "jasper"
    },
    {
      title: "MIDJOURNEY",
      description: "AI art generation mastery",
      icon: "🖼️",
      slug: "midjourney"
    }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <Sidebar />

        <div className={styles.content}>
          {/* HERO SECTION */}
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Welcome to <span className={styles.gradientText}>The Mentora AI</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Master AI tools with personalized learning paths. Start your journey to becoming an AI expert.
              </p>

              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>100+</span>
                  <span className={styles.statLabel}>AI Tools Covered</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>500+</span>
                  <span className={styles.statLabel}>Active Learners</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>98%</span>
                  <span className={styles.statLabel}>Satisfaction Rate</span>
                </div>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.floatingIcons}>
                {["🤖", "💡", "🚀", "⚡"].map((icon, i) => (
                  <div key={i} className={styles.floatingIcon} style={{ animationDelay: `${i * 0.5}s` }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* QUICK STATS */}
          <section className={styles.statsSection}>
            <h2 className={styles.sectionTitle}>Your Learning Dashboard</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🔥</div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>
                    {loading ? "..." : `${stats?.streak_days || 0} days`}
                  </span>
                  <span className={styles.statLabel}>Learning Streak</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>⭐</div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>
                    {loading ? "..." : `${stats?.total_xp?.toLocaleString() || 0} XP`}
                  </span>
                  <span className={styles.statLabel}>XP Earned</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📚</div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>
                    {loading ? "..." : enrolledTracks.length}
                  </span>
                  <span className={styles.statLabel}>Courses Started</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏱️</div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>
                    {loading ? "..." : `${Math.round(stats?.total_hours || 0)}h`}
                  </span>
                  <span className={styles.statLabel}>Hours Learning</span>
                </div>
              </div>
            </div>
          </section>

          {/* CURRENT LEARNING */}
          <section className={styles.currentLearning}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Continue Learning</h2>
              <Link href="/Dashboard" className={styles.viewAll}>
                View Dashboard →
              </Link>
            </div>

            {loading ? (
              <div className={styles.currentCourse}>
                <p>Loading your courses...</p>
              </div>
            ) : enrolledTracks.length > 0 ? (
              <div className={styles.currentCourse}>
                <div className={styles.courseHeader}>
                  <div className={styles.courseIcon}>
                    {allTracks.find(t => t.slug === enrolledTracks[0].track_slug)?.icon || "📚"}
                  </div>
                  <div className={styles.courseInfo}>
                    <h3 className={styles.courseTitle}>
                      {allTracks.find(t => t.slug === enrolledTracks[0].track_slug)?.title || enrolledTracks[0].track_name}
                    </h3>
                    <p className={styles.courseDesc}>
                      {allTracks.find(t => t.slug === enrolledTracks[0].track_slug)?.description || "Continue your learning journey"}
                    </p>
                  </div>
                </div>

                <div className={styles.courseProgress}>
                  <div className={styles.progressInfo}>
                    <span className={styles.progressLabel}>Course Progress</span>
                    <span className={styles.progressPercent}>
                      {Math.round(enrolledTracks[0].percent_complete || 0)}%
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${enrolledTracks[0].percent_complete || 0}%` }}
                    />
                  </div>
                  <div className={styles.progressDetails}>
                    <span>
                      {enrolledTracks[0].tasks_completed || 0} tasks completed
                    </span>
                    <span>
                      Last activity: {enrolledTracks[0].last_accessed
                        ? new Date(enrolledTracks[0].last_accessed).toLocaleDateString()
                        : "Never"}
                    </span>
                  </div>
                </div>

                <div className={styles.courseActions}>
                  <Link href={`/track/${enrolledTracks[0].track_slug}`} className={styles.primaryBtn}>
                    Continue Learning →
                  </Link>
                  <Link href="/Dashboard" className={styles.secondaryBtn}>
                    Review Progress
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.currentCourse}>
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📚</div>
                  <h3>No courses started yet</h3>
                  <p>Browse the tracks below and start your AI learning journey!</p>
                </div>
              </div>
            )}
          </section>

          {/* EXPLORE TRACKS */}
          <section className={styles.tracksSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Explore AI Tracks</h2>
              <p className={styles.sectionSubtitle}>Choose your path to AI mastery</p>
            </div>

            <div className={styles.tracksGrid}>
              {allTracks.map((track, index) => {
                const enrollment = enrolledTracks.find(et => et.track_slug === track.slug);
                return (
                  <TrackCard
                    key={index}
                    {...track}
                    enrolled={!!enrollment}
                    progress={enrollment?.percent_complete || 0}
                  />
                );
              })}
            </div>
          </section>

          {/* LEARNING PATH */}
          <section className={styles.pathSection}>
            <h2 className={styles.sectionTitle}>Your Learning Path</h2>
            <div className={styles.pathVisualization}>
              <div className={styles.pathStep}>
                <div className={styles.stepCircle}>1</div>
                <div className={styles.stepContent}>
                  <h4>Foundation</h4>
                  <p>Learn AI basics and terminology</p>
                </div>
              </div>
              <div className={styles.pathStep}>
                <div className={styles.stepCircle}>2</div>
                <div className={styles.stepContent}>
                  <h4>Core Tools</h4>
                  <p>Master essential AI applications</p>
                </div>
              </div>
              <div className={styles.pathStep}>
                <div className={styles.stepCircle}>3</div>
                <div className={styles.stepContent}>
                  <h4>Specialization</h4>
                  <p>Focus on your chosen AI tools</p>
                </div>
              </div>
              <div className={styles.pathStep}>
                <div className={styles.stepCircle}>4</div>
                <div className={styles.stepContent}>
                  <h4>Mastery</h4>
                  <p>Become an AI expert</p>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </main>
  );
}

/* TRACK CARD COMPONENT */
function TrackCard({ title, description, progress, icon, slug, enrolled }) {
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);

  const handleStart = async () => {
    if (enrolled) {
      router.push(`/track/${slug}`);
      return;
    }

    // Redirect to Questionnaire for Personalization
    const params = new URLSearchParams({
      track: slug,
      title: title
    });

    router.push(`/questionnaire?${params.toString()}`);
  };

  return (
    <div className={styles.trackCard}>
      <div className={styles.trackCardHeader}>
        <div className={styles.trackIcon}>{icon}</div>
        <div className={styles.trackInfo}>
          <h3 className={styles.trackTitle}>{title}</h3>
          <p className={styles.trackDesc}>{description}</p>
        </div>
      </div>

      <div className={styles.trackProgress}>
        {enrolled ? (
          <>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.progressText}>{Math.round(progress)}% Complete</span>
          </>
        ) : (
          <span className={styles.newLabel}>New Track</span>
        )}
      </div>

      <div className={styles.trackActions}>
        <button
          onClick={handleStart}
          className={enrolled ? styles.continueBtn : styles.exploreBtn}
          disabled={enrolling}
        >
          {enrolling ? "Enrolling..." : enrolled ? "Continue" : "Start Learning"}
        </button>
        <button className={styles.previewBtn}>
          Preview
        </button>
      </div>
    </div>
  );
}