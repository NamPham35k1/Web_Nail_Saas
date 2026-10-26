import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    setError('');
    setLoading(true);
    try {
      await login({ email: demoEmail, password: '123456' });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập tiệm mẫu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(50% 50% at 50% 50%, rgba(212, 107, 132, 0.08) 0%, rgba(250, 248, 249, 1) 100%)'
    }}>
      <div className="card animate-fade-in" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '40px 32px',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px' }}>💅</span>
            <span style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--primary) 0%, #8E2943 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              NailVibe
            </span>
          </Link>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '6px' }}>Đăng Nhập Quản Trị Tiệm</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Quản lý lịch hẹn, dịch vụ và website của tiệm bạn
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            border: '1px solid #FECACA',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Đăng Nhập</label>
            <input
              type="email"
              className="form-input"
              placeholder="ten@tiemnail.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Mật Khẩu</label>
            </div>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px', height: '46px' }}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập Ngay'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Logins for Pair Programming / Review */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>
            ⚡ ĐĂNG NHẬP NHANH VỚI TÀI KHOẢN MẪU
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('luna@nailvibe.vn')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              Tiệm Luna Nail
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('minail@nailvibe.vn')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              Tiệm Mi Nail
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Đăng ký tạo website mới
          </Link>
        </div>
      </div>
    </div>
  );
};
