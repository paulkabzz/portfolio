import { useState } from 'react';
import styles from './index.module.css';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/auth-context';

const Login: React.FC = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate("/admin"); 
    } catch (error: any) {
      setError(error.message || 'Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Sign in</h1>
          <p className={styles.subtitle}>Welcome back to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Your password"
              required
            />
          </div>
          
          <div className={styles.options}>
            <label className={styles.checkbox}>
              <input type="checkbox" />
              <span className={styles.checkmark}></span>
              Remember me
            </label>
            <a href="#" className={styles.forgotPassword}>
              Forgot password?
            </a>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
          >
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
        
        <div className={styles.footer}>
          <p>
            Don't have an account?{' '}
            <a href="#" className={styles.signupLink}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;