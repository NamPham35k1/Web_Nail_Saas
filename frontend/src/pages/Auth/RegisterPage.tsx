import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [salonName, setSalonName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        salonName,
        fullName,
        email,
        password,
        phone
      });
      // Redirect directly to Onboarding Wizard
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Đăng ký không thành công.');
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
        maxWidth: '520px',
        width: '100%',
        padding: '40px 32px',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
          <h2 style={{ fontSize: '1.45rem', marginBottom: '6px' }}>Bắt Đầu Tạo Website Tiệm Nail</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Miễn phí 14 ngày trải nghiệm, sẵn sàng website đặt lịch trong 5 phút
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên Tiệm Nail Của Bạn <span style={{ color: 'var(--primary)' }}>*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="VD: Tiệm Nail Của Bé, Venus Nail Art..."
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Họ & Tên Chủ Tiệm <span style={{ color: 'var(--primary)' }}>*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="Nguyễn Thị Lan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Số Điện Thoại Tiệm</label>
              <input
                type="tel"
                className="form-input"
                placeholder="0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Quản Trị <span style={{ color: 'var(--primary)' }}>*</span></label>
            <input
              type="email"
              className="form-input"
              placeholder="lan@tiemnail.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật Khẩu <span style={{ color: 'var(--primary)' }}>*</span></label>
            <input
              type="password"
              className="form-input"
              placeholder="Ít nhất 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div style={{
            background: 'var(--bg-subtle)',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="var(--success)" /> Tự động tạo link đặt lịch riêng <code>/s/ten-tiem</code>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="var(--success)" /> Có sẵn mẫu dịch vụ chuẩn để áp dụng trong 1 click
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Đang khởi tạo tiệm...' : 'Tạo Tiệm & Thiết Lập Ngay'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Đã có tài khoản tiệm?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Đăng nhập tại đây
          </Link>
        </div>
      </div>
    </div>
  );
};
