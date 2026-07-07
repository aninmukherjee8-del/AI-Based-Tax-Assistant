import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../services/authService";

const Orb = ({ style }) => (
  <div style={{
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    ...style,
  }} />
);

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setIsLogin(location.pathname !== '/register');
  }, [location.pathname]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const toggleAuthMode = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      const newMode = !isLogin;
      setIsLogin(newMode);
      navigate(newMode ? '/login' : '/register', { replace: true });
      setAnimating(false);
    }, 220);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c14',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%        { transform: translate(30px, -20px) scale(1.05); }
          66%        { transform: translate(-20px, 15px) scale(0.97); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.025; }
          50%        { opacity: 0.055; }
        }
        
        .auth-card {
          animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        
        .google-btn {
          width: 100%;
          padding: 14px;
          background: #ffffff;
          border: 1px solid transparent;
          border-radius: 14px;
          color: #0f172a;
          font-size: 16px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
        }
        
        .google-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
          background: #f8fafc;
        }
        
        .google-btn:active {
          transform: translateY(0);
          box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
        }

        .toggle-link {
          background: none;
          border: none;
          cursor: pointer;
          color: #34d399;
          font-weight: 600;
          font-size: inherit;
          font-family: inherit;
          padding: 0;
          text-decoration: none;
          position: relative;
          transition: color 0.15s;
        }
        
        .toggle-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0; right: 0;
          height: 1px;
          background: #34d399;
          transform: scaleX(0);
          transition: transform 0.2s;
          transform-origin: left;
        }
        
        .toggle-link:hover::after { transform: scaleX(1); }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        animation: 'gridPulse 6s ease-in-out infinite',
      }} />

      {/* Ambient orbs */}
      <Orb style={{ width: 420, height: 420, background: 'radial-gradient(circle, rgba(52,211,153,0.18), transparent 70%)', top: '-80px', right: '-60px', animation: 'orbFloat 14s ease-in-out infinite' }} />
      <Orb style={{ width: 380, height: 380, background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)', bottom: '-100px', left: '-80px', animation: 'orbFloat 18s ease-in-out infinite reverse' }} />
      <Orb style={{ width: 240, height: 240, background: 'radial-gradient(circle, rgba(16,185,129,0.1), transparent 70%)', top: '40%', left: '10%', animation: 'orbFloat 22s ease-in-out infinite 3s' }} />

      <div
        ref={cardRef}
        className="auth-card"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(15, 20, 30, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '48px 40px',
          opacity: animating ? 0.5 : 1,
          transform: animating ? 'scale(0.98)' : 'scale(1)',
          transition: 'opacity 0.22s, transform 0.22s',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            width: 42, height: 42,
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(52,211,153,0.3)',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '20px', color: '#f8fafc', letterSpacing: '-0.01em' }}>
            Tax<span style={{ color: '#34d399' }}>Wise</span>
          </span>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: " sans-serif",
            fontWeight: 800,
            fontSize: '28px',
            color: '#f8fafc',
            margin: '0 0 8px',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
          }}>
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(148,163,184,0.8)', margin: 0, lineHeight: 1.5 }}>
            {isLogin
              ? 'Sign in to access your tax dashboard.'
              : 'Join today and start saving on taxes.'}
          </p>
        </div>

        {/* Google Primary Button */}
        {/* <button className="google-btn">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#ea4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#4285f4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isLogin ? 'Continue with Google' : 'Sign up with Google'}
        </button> */}

        <GoogleLogin
          onSuccess={
            async (credentialResponse) => {
              try{
                const data = await googleLogin(credentialResponse.credential);
                if(data.success){
                  localStorage.setItem("token", data.token);
                  localStorage.setItem("user", JSON.stringify(data.user));
                  navigate("/dashboard");
                }
              }
              catch(error){
                console.error(error);
              }
            }
          }
          onError={()=> {
            console.error("Google login failed");
          }
          }
        />

        

        {/* Fine print */}
        {!isLogin && (
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(100,116,139,0.5)', margin: '20px 0 0', lineHeight: 1.6 }}>
            By continuing, you agree to our{' '}
            <span style={{ color: 'rgba(100,116,139,0.9)', cursor: 'pointer', textDecoration: 'underline' }}>Terms</span>
            {' '}and{' '}
            <span style={{ color: 'rgba(100,116,139,0.9)', cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span>.
          </p>
        )}
      </div>
    </div>
  );
}