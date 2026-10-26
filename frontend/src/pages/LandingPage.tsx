import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Smartphone, QrCode, CheckCircle2, Shield, ArrowRight, Star, Heart } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{
        height: '76px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>💅</span>
          <span style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary) 0%, #8E2943 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            NailVibe
          </span>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
            background: 'var(--primary-light)',
            color: 'var(--primary)'
          }}>
            SaaS Platform
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#features" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
            Tính Năng
          </a>
          <a href="#demo" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
            Xem Tiệm Mẫu
          </a>
          <a href="#pricing" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
            Bảng Giá
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/login" className="btn btn-secondary btn-sm" style={{ padding: '8px 18px' }}>
            Đăng Nhập
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '8px 20px' }}>
            Tạo Website Miễn Phí <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '80px 20px 60px',
        textAlign: 'center',
        background: 'radial-gradient(50% 50% at 50% 10%, rgba(212, 107, 132, 0.12) 0%, rgba(250, 248, 249, 0) 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--primary-light)',
            color: 'var(--primary-dark)',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            marginBottom: '24px',
            border: '1px solid rgba(212, 107, 132, 0.2)'
          }}>
            <Sparkles size={16} color="var(--primary)" />
            Nền tảng tạo website đặt lịch số 1 dành riêng cho Tiệm Nail
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            lineHeight: 1.15,
            marginBottom: '20px',
            fontWeight: 800,
            color: '#1E293B'
          }}>
            Tạo Website Đặt Lịch Nail Riêng <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #B74D68 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Chỉ Trong 5 Phút – Không Cần Biết Kỹ Thuật
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            maxWidth: '720px',
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            Mỗi tiệm sở hữu một website đặt lịch công khai riêng biệt <code>/s/ten-tiem</code>, mã QR để bàn sang trọng,
            hệ thống tự động tính khung giờ trống và bảng điều khiển lịch hẹn thông minh.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ minWidth: '220px' }}>
              Bắt Đầu Dùng Thử 14 Ngày <ArrowRight size={18} />
            </Link>
            <a href="#demo" className="btn btn-secondary btn-lg" style={{ minWidth: '180px' }}>
              Trải Nghiệm Tiệm Mẫu
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', fontSize: '0.9rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} color="var(--success)" /> Không cần thẻ tín dụng</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} color="var(--success)" /> Không cần cài Node.js hay máy chủ</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} color="var(--success)" /> Dữ liệu cách ly an toàn 100%</span>
          </div>
        </div>
      </section>

      {/* Demo Salons Showcase */}
      <section id="demo" style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-trial" style={{ marginBottom: '8px' }}>Trực Quan & Thực Tế</span>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Xem Website Các Tiệm Đang Hoạt Động</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Click để trải nghiệm ngay quy trình khách hàng đặt lịch trên website công khai của từng tiệm.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Demo 1: Luna Nail Studio */}
          <div className="card" style={{
            borderRadius: '24px',
            overflow: 'hidden',
            padding: 0,
            border: '2px solid rgba(212, 107, 132, 0.25)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{
              height: '140px',
              backgroundImage: 'url(https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&auto=format&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '-24px',
                left: '24px',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundImage: 'url(https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                border: '3px solid #FFFFFF',
                boxShadow: 'var(--shadow-md)'
              }} />
            </div>

            <div style={{ padding: '36px 24px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>Luna Nail Studio</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>/s/luna-nail</p>
                </div>
                <span className="badge badge-confirmed">● Đang hoạt động</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '18px', minHeight: '42px' }}>
                Không gian phong cách Hàn Quốc, chuyên sơn gel cao cấp & nail art vẽ tay hoa nổi.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="/s/luna-nail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.88rem' }}
                >
                  Mở Trang Đặt Lịch
                </a>
              </div>
            </div>
          </div>

          {/* Demo 2: Mi Nail Studio */}
          <div className="card" style={{
            borderRadius: '24px',
            overflow: 'hidden',
            padding: 0,
            border: '2px solid rgba(42, 157, 143, 0.25)'
          }}>
            <div style={{
              height: '140px',
              backgroundColor: '#2A9D8F',
              backgroundImage: 'linear-gradient(135deg, #2A9D8F 0%, #1D6B62 100%)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '-24px',
                left: '24px',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                color: '#2A9D8F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                border: '3px solid #FFFFFF',
                boxShadow: 'var(--shadow-md)'
              }}>
                💅
              </div>
            </div>

            <div style={{ padding: '36px 24px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>Mi Nail Studio</h3>
                  <p style={{ fontSize: '0.85rem', color: '#2A9D8F', fontWeight: 600 }}>/s/mi-nail-studio</p>
                </div>
                <span className="badge badge-confirmed">● Đang hoạt động</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '18px', minHeight: '42px' }}>
                Chuyên móng đắp bột ombre sang trọng phong cách Châu Âu hiện đại tại Cầu Giấy, Hà Nội.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="/s/mi-nail-studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: '0.88rem', borderColor: '#2A9D8F', color: '#2A9D8F' }}
                >
                  Mở Trang Đặt Lịch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '70px 20px', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.1rem', marginBottom: '12px' }}>Tất Cả Những Gì Chủ Tiệm Cần Để Vận Hành</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
              Thiết kế đơn giản, thân thiện tối đa với người không rành công nghệ. Không thuật ngữ phức tạp.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px'
          }}>
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Smartphone size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Website Đặt Lịch Riêng</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Sở hữu đường link riêng biệt như <code>/s/ten-tiem</code>. Khách chọn dịch vụ, thợ làm móng và ngày giờ tiện lợi trên điện thoại.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-gold-light)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <QrCode size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Tạo Mã QR Đặt Lịch Tự Động</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Hệ thống tự tạo mã QR thương hiệu chất lượng cao. In ra để bàn thu ngân hoặc dán trước cửa tiệm để khách quét đặt lịch.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-teal-light)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Tính Khung Giờ Trống Tự Động</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Không còn lo trùng lịch. Hệ thống tự trừ giờ làm việc, ngày nghỉ và các lịch đã hẹn trước để chỉ hiển thị slot còn trống.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Onboarding Siêu Tốc 5 Phút</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Có sẵn mẫu dịch vụ chuẩn cho tiệm nail Việt Nam (Sơn gel, Đắp bột, Móng úp...). Áp dụng chỉ với 1 click chuột là xong!
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Cách Ly Dữ Liệu Tuyệt Đối</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Kiến trúc Multi-tenant chuẩn enterprise. Khách hàng và thông tin tiệm này hoàn toàn được bảo mật, không thể bị tiệm khác xem trộm.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Star size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Tùy Biến Không Cần Lập Trình</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Tự đổi tên tiệm, màu sắc thương hiệu, tải logo, cập nhật giá dịch vụ, thêm thợ móng trực tiếp ngay trên điện thoại hoặc máy tính.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        backgroundColor: '#0F172A',
        color: '#94A3B8',
        padding: '50px 20px 30px',
        fontSize: '0.9rem'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
              💅 NailVibe
            </div>
            <p>Nền tảng SaaS số hóa lịch hẹn cho tiệm nail Việt Nam.</p>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/login" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Đăng Nhập</Link>
            <Link to="/register" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Đăng Ký</Link>
            <a href="/api/health" target="_blank" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Trạng Thái Hệ Thống</a>
          </div>
        </div>
        <div style={{ maxWidth: '1100px', margin: '30px auto 0', paddingTop: '20px', borderTop: '1px solid #1E293B', textAlign: 'center', fontSize: '0.8rem' }}>
          © 2026 NailVibe Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
