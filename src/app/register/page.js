"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '../hooks/useAuth';
import styles from './register.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        display_name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/home');
        }
    }, [isAuthenticated, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
        
        setError('');
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength += 1;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const result = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            display_name: formData.display_name || formData.username,
        });

        if (result.success) {
            router.push('/home');
        } else {
            setError(result.error || 'Registration failed');
        }

        setLoading(false);
    };

    const getStrengthColor = () => {
        if (passwordStrength === 0) return '#ef4444';
        if (passwordStrength <= 2) return '#f59e0b';
        if (passwordStrength <= 3) return '#10b981';
        return '#00d4ff';
    };

    return (
        <div className={styles.page}>
            {/* Animated Space Background */}
            <div className={styles.spaceBackground}>
                <div className={styles.stars}></div>
                <div className={styles.stars2}></div>
                <div className={styles.stars3}></div>
            </div>

            {/* Register Container */}
            <div className={styles.container}>
                <div className={styles.registerCard}>
                    <div className={styles.cardGlow}></div>
                    
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.logo}>
                            <div className={styles.logoIcon}>🚀</div>
                        </div>
                        <h1 className={styles.title}>Join The Mentora AI</h1>
                        <p className={styles.subtitle}>Begin your journey to AI mastery</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.errorMessage}>
                                <span className={styles.errorIcon}>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className={styles.inputGrid}>
                            {/* Username */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="username" className={styles.label}>
                                    <span className={styles.labelText}>Username</span>
                                    <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}>👤</span>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="Choose your username"
                                        disabled={loading}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    <span className={styles.labelText}>Email</span>
                                    <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}>✉️</span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="your.email@example.com"
                                        disabled={loading}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Display Name */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="display_name" className={styles.label}>
                                    <span className={styles.labelText}>Display Name</span>
                                    <span className={styles.optional}>(optional)</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}>🌟</span>
                                    <input
                                        type="text"
                                        id="display_name"
                                        name="display_name"
                                        value={formData.display_name}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="What should we call you?"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="password" className={styles.label}>
                                    <span className={styles.labelText}>Password</span>
                                    <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}>🔒</span>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="Create a strong password"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>
                                {formData.password && (
                                    <div className={styles.passwordStrength}>
                                        <div className={styles.strengthBar}>
                                            <div 
                                                className={styles.strengthFill}
                                                style={{
                                                    width: `${(passwordStrength / 5) * 100}%`,
                                                    backgroundColor: getStrengthColor()
                                                }}
                                            ></div>
                                        </div>
                                        <span className={styles.strengthText}>
                                            {passwordStrength <= 2 ? 'Weak' : 
                                             passwordStrength <= 3 ? 'Good' : 
                                             'Strong'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="confirmPassword" className={styles.label}>
                                    <span className={styles.labelText}>Confirm Password</span>
                                    <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}>✓</span>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="Re-enter your password"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    Creating Account...
                                </>
                            ) : (
                                'Launch Your Journey'
                            )}
                        </button>

                        {/* Terms */}
                        <div className={styles.terms}>
                            <p className={styles.termsText}>
                                By creating an account, you agree to our{' '}
                                <a href="#" className={styles.termsLink}>Terms</a> and{' '}
                                <a href="#" className={styles.termsLink}>Privacy Policy</a>
                            </p>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            Already have an account?{' '}
                            <Link href="/login" className={styles.link}>
                                Sign In Now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Side Info Panel */}
                <div className={styles.infoPanel}>
                    <div className={styles.infoContent}>
                        <h3 className={styles.infoTitle}>Why Join AI Mentora?</h3>
                        
                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>🚀</span>
                                <div>
                                    <h4>Personalized Learning</h4>
                                    <p>AI-powered paths based on your goals</p>
                                </div>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>🤖</span>
                                <div>
                                    <h4>Real AI Practice</h4>
                                    <p>Learn by doing with actual AI tools</p>
                                </div>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>📊</span>
                                <div>
                                    <h4>Progress Tracking</h4>
                                    <p>Monitor your growth and achievements</p>
                                </div>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>🏆</span>
                                <div>
                                    <h4>Gamified Experience</h4>
                                    <p>Earn XP, unlock levels, and compete</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>500+</span>
                                <span className={styles.statLabel}>Active Learners</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>98%</span>
                                <span className={styles.statLabel}>Satisfaction</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>100+</span>
                                <span className={styles.statLabel}>AI Tools</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}