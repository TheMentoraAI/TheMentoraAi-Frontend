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
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>,
      slug: "chatgpt"
    },
    {
      title: "CANVA AI",
      description: "Design with AI-powered tools",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>,
      slug: "canva"
    },
    {
      title: "NOTION AI",
      description: "Boost productivity with AI assistance",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
      slug: "notion"
    },
    {
      title: "CURSOR AI",
      description: "AI-powered code editor mastery",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
      slug: "cursor"
    },
    {
      title: "JASPER AI",
      description: "Content creation with AI",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
      slug: "jasper"
    },
    {
      title: "MIDJOURNEY",
      description: "AI art generation mastery",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
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
                {[
                  <svg key="1" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
                  <svg key="2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
                  <svg key="3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>,
                  <svg key="4" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                ].map((icon, i) => (
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
                <div className={styles.statIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>
                    {loading ? "..." : `${stats?.streak_days || 0} days`}
                  </span>
                  <span className={styles.statLabel}>Learning Streak</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>
                    {loading ? "..." : `${stats?.total_xp?.toLocaleString() || 0} XP`}
                  </span>
                  <span className={styles.statLabel}>XP Earned</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>
                    {loading ? "..." : enrolledTracks.length}
                  </span>
                  <span className={styles.statLabel}>Courses Started</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
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
                    {allTracks.find(t => t.slug === enrolledTracks[0].track_slug)?.icon || <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
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
                  <div className={styles.emptyIcon}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
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