"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className={styles.page}>
      {/* ANIMATED BACKGROUND */}
      <div className={styles.spaceBackground}>
        <div className={styles.stars}></div>
        <div className={styles.stars2}></div>
        <div className={styles.stars3}></div>
        <div className={styles.galaxy}></div>
      </div>

      {/* NAVBAR */}
      <nav className={styles.navbar} style={{
        background: scrollY > 50 ? 'rgba(10, 5, 32, 0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none'
      }}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🚀</div>
            <span className={styles.logoText}>The Mentora AI</span>
          </div>

          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How it Works</a>
            <a href="#pricing" className={styles.navLink}>Pricing</a>
            <Link href="/login" className={styles.navButton}>
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Master <span className={styles.gradientText}>AI Tools</span><br />
              with Intelligent Guidance
            </h1>

            <p className={styles.heroSubtitle}>
              Learn by doing. Mentora AI guides you through real-world AI challenges,
              tracks your progress, and helps you master skills 10x faster.
            </p>

            <div className={styles.heroActions}>
              <Link href="/login" className={styles.primaryButton}>
                <span>Start Learning Free</span>
                <span className={styles.buttonIcon}>🚀</span>
              </Link>

              <button className={styles.secondaryButton}>
                <span>Watch Demo</span>
                <span className={styles.buttonIcon}>▶️</span>
              </button>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100+</span>
                <span className={styles.statLabel}>AI Tools Covered</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>98%</span>
                <span className={styles.statLabel}>Success Rate</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Active Learners</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.floatingCard}>
              <div className={styles.cardGlow}></div>
              <div className={styles.mentorAvatar}>🤖</div>
              <h3>AI Mentor Ready</h3>
              <p>Personalized guidance for every task</p>
              <div className={styles.pulseRing}></div>
              <div className={styles.pulseRing2}></div>
            </div>

            {/* Floating elements */}
            <div className={styles.floatingElement} style={{ top: '20%', left: '10%' }}>💬</div>
            <div className={styles.floatingElement} style={{ top: '60%', right: '15%' }}>🎨</div>
            <div className={styles.floatingElement} style={{ top: '30%', right: '5%' }}>💻</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <span>Explore</span>
          <div className={styles.mouse}>
            <div className={styles.wheel}></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Intelligent Features</h2>
            <p className={styles.sectionSubtitle}>
              Everything you need to master AI tools efficiently
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <FeatureCard
              icon="🧠"
              title="AI-Powered Guidance"
              description="Real-time mentorship while you work with AI tools"
              gradient="blue"
            />
            <FeatureCard
              icon="📊"
              title="Progress Analytics"
              description="Track skill growth, XP, and milestones with detailed insights"
              gradient="purple"
            />
            <FeatureCard
              icon="🎮"
              title="Gamified Learning"
              description="Level up, maintain streaks, and unlock achievements"
              gradient="pink"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How Mentora AI Works</h2>
            <p className={styles.sectionSubtitle}>
              A simple 3-step process to AI mastery
            </p>
          </div>

          <div className={styles.stepsContainer}>
            <div className={styles.connectingLine}></div>

            <Step
              number="01"
              title="Choose Your Track"
              description="Select from 100+ AI tools and learning paths"
              icon="🎯"
              delay="0s"
            />
            <Step
              number="02"
              title="Learn by Doing"
              description="Complete real-world tasks with AI guidance"
              icon="🚀"
              delay="0.2s"
            />
            <Step
              number="03"
              title="Master & Level Up"
              description="Review feedback, improve, and unlock new skills"
              icon="🏆"
              delay="0.4s"
            />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Choose Your Plan</h2>
            <p className={styles.sectionSubtitle}>
              Start for free, upgrade as you grow
            </p>
          </div>

          <div className={styles.pricingGrid}>
            <PricingCard
              title="Free"
              price="₹0"
              period="forever"
              features={["5 AI Tasks per month", "Basic progress tracking", "Community support"]}
              buttonText="Get Started"
              variant="standard"
            />

            <PricingCard
              title="Premium"
              price="₹199"
              period="per month"
              features={["Unlimited AI Tasks", "Advanced analytics", "Priority support", "Custom learning paths"]}
              buttonText="Start Free Trial"
              variant="featured"
              featured={true}
            />

            <PricingCard
              title="Enterprise"
              price="Custom"
              period="contact us"
              features={["Team management", "Custom AI Tasks", "Dedicated support", "API access"]}
              buttonText="Contact Sales"
              variant="standard"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Master AI?</h2>
              <p className={styles.ctaText}>
                Join 500+ learners who are already accelerating their AI skills
              </p>
            </div>

            <div className={styles.ctaActions}>
              <Link href="/login" className={styles.ctaButton}>
                Start Learning Free
              </Link>
              <button className={styles.ctaSecondaryButton}>
                Book a Demo
              </button>
            </div>

            <div className={styles.ctaGlow}></div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* COMPONENTS */

function FeatureCard({ icon, title, description, gradient = 'blue' }) {
  return (
    <div className={`${styles.featureCard} ${styles[`gradient-${gradient}`]}`}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
      <div className={styles.featureGlow}></div>
    </div>
  );
}

function Step({ number, title, description, icon, delay }) {
  return (
    <div
      className={styles.stepCard}
      style={{ animationDelay: delay }}
    >
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>{number}</div>
        <div className={styles.stepIcon}>{icon}</div>
      </div>

      <div className={styles.stepContent}>
        <h3 className={styles.stepTitle}>{title}</h3>
        <p className={styles.stepDescription}>{description}</p>
      </div>

      <div className={styles.stepParticles}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>
    </div>
  );
}

function PricingCard({ title, price, period, features, buttonText, variant, featured = false }) {
  return (
    <div className={`${styles.pricingCard} ${featured ? styles.featured : ''}`}>
      {featured && <div className={styles.featuredBadge}>Most Popular</div>}

      <div className={styles.pricingHeader}>
        <h3 className={styles.pricingTitle}>{title}</h3>
        <div className={styles.pricingAmount}>
          <span className={styles.price}>{price}</span>
          <span className={styles.period}>/{period}</span>
        </div>
      </div>

      <div className={styles.pricingFeatures}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureItem}>
            <span className={styles.checkIcon}>✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <Link
        href="/login"
        className={`${styles.pricingButton} ${featured ? styles.featuredButton : ''}`}
      >
        {buttonText}
      </Link>

      {featured && <div className={styles.pricingGlow}></div>}
    </div>
  );
}