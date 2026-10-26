import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Smartphone,
  QrCode,
  CheckCircle2,
  Shield,
  ArrowRight,
  Star,
  Palette,
  ExternalLink,
  Award,
  Zap,
  Clock,
  Heart
} from 'lucide-react';
import { TEMPLATE_THEMES, type TemplateTheme } from '../config/templates';

export const LandingPage: React.FC = () => {
  const [activeTemplateKey, setActiveTemplateKey] = useState<string>('BLUSH_KOREA');
  const activeTemplate = TEMPLATE_THEMES[activeTemplateKey];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FAF9FA' }}>
      {/* Top Header */}
      <header style={{
        height: '76px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
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

        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#templates" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
            5 Giao Diện Salon
          </a>
          <a href="#lookbook" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
            Mẫu Móng Thịnh Hành
          </a>
          <a href="#demo" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
            Tiệm Đang Chạy
          </a>
          <a href="#features" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
            Tính Năng
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/login" className="btn btn-secondary btn-sm" style={{ padding: '8px 18px' }}>
            Đăng Nhập
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Tạo Website Miễn Phí <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero Section - Modern Split Layout with High-End Photography */}
      <section style={{
        padding: '70px 24px 60px',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '48px',
        alignItems: 'center'
      }}>
        {/* Left Column: Headlines & CTAs */}
        <div>
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
            marginBottom: '20px',
            border: '1px solid rgba(212, 107, 132, 0.25)'
          }}>
            <Sparkles size={16} color="var(--primary)" />
            Nền tảng tạo website đặt lịch số 1 dành riêng cho Tiệm Nail
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)',
            lineHeight: 1.15,
            marginBottom: '20px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em'
          }}>
            Website Đặt Lịch Nail <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #B74D68 60%, #E07A5F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Sang Trọng & Đậm Phong Cách
            </span>
            <br />
            Chỉ Trong 5 Phút
          </h1>

          <p style={{
            fontSize: '1.12rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '32px',
            maxWidth: '540px'
          }}>
            Mỗi tiệm nail sở hữu một đường link riêng biệt <code>/s/ten-tiem</code>, mã QR để bàn sang trọng, hình ảnh dịch vụ sắc nét và bộ tính khung giờ trống tự động thông minh.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ minWidth: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Tạo Web Ngay (14 Ngày Thử) <ArrowRight size={18} />
            </Link>
            <a href="#demo" className="btn btn-secondary btn-lg" style={{ minWidth: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Trải Nghiệm Tiệm Mẫu
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--success)" />
              <span><strong>Không cần thẻ tín dụng</strong> – Bắt đầu hoàn toàn miễn phí</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--success)" />
              <span><strong>5 giao diện cao cấp có sẵn</strong> (Hàn Quốc, Dark Luxury, Spa Thảo Mộc, Y2K, Minimalist)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--success)" />
              <span><strong>Không cần kỹ thuật</strong> – Thêm dịch vụ và chỉnh giá trên điện thoại</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Frame with Glassmorphic Elements */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'relative',
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 24px 60px -15px rgba(212, 107, 132, 0.28)',
            border: '8px solid #FFFFFF'
          }}>
            <img
              src="/assets/luxury_nail_hero.jpg"
              alt="Nail Booking Mobile App Experience"
              style={{
                width: '100%',
                height: '460px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(15,23,42,0.7) 100%)'
            }} />

            {/* Bottom Caption Overlay */}
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', color: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ backgroundColor: 'var(--primary)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                  Trực Quan
                </span>
                <span style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>Giao diện khách đặt trên di động</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 700 }}>
                Trải nghiệm chạm mượt mà – Khách đặt lịch chỉ trong 30 giây
              </h3>
            </div>
          </div>

          {/* Floating Glassmorphic Stat Chip Top Right */}
          <div style={{
            position: 'absolute',
            top: '-18px',
            right: '-12px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            padding: '12px 18px',
            borderRadius: '18px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Star size={22} fill="#D97706" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E293B' }}>4.9 / 5.0</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1,280+ lượt hài lòng</div>
            </div>
          </div>

          {/* Floating Glassmorphic Stat Chip Bottom Left */}
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '-16px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            padding: '12px 20px',
            borderRadius: '18px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E293B' }}>Tiết kiệm 3h/ngày</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tự động hóa toàn bộ slot trống</div>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook Showcase: Mẫu Móng & Dịch Vụ Thịnh Hành */}
      <section id="lookbook" style={{ padding: '70px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span className="badge badge-trial" style={{ marginBottom: '8px' }}>Đậm Chất Nghệ Thuật</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '10px', color: '#0F172A' }}>
              Bộ Sưu Tập Mẫu Móng & Dịch Vụ Đang Thịnh Hành
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
              Nâng tầm thương hiệu salon với hình ảnh dịch vụ sắc nét, chân thực, giúp khách hàng bị cuốn hút ngay từ cái nhìn đầu tiên.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {/* Lookbook 1 */}
            <div className="card" style={{ padding: 0, borderRadius: '22px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/assets/french_chrome_nails.jpg"
                  alt="Sơn Gel Tráng Gương Nude"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--primary)'
                }}>
                  Hot Trend
                </span>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Glazed Chrome Nails
                </div>
                <h4 style={{ fontSize: '1.1rem', marginTop: '4px', marginBottom: '6px' }}>Sơn Gel Tráng Gương Nude</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Ánh ngọc trai tráng gương thời thượng, sang trọng và thanh lịch cho các nàng công sở.
                </p>
              </div>
            </div>

            {/* Lookbook 2 */}
            <div className="card" style={{ padding: 0, borderRadius: '22px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/assets/nail_art_showcase.jpg"
                  alt="Nail Art Hoa Nổi 3D & Mắt Mèo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#D946EF'
                }}>
                  Korean Blossom
                </span>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#D946EF', fontWeight: 700, textTransform: 'uppercase' }}>
                  Hand-Crafted Art
                </div>
                <h4 style={{ fontSize: '1.1rem', marginTop: '4px', marginBottom: '6px' }}>Nail Art Hoa Nổi 3D Tinh Xảo</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Kỹ thuật vẽ tay hoa 3D tỉ mỉ kết hợp kim tuyến lấp lánh phong cách nàng thơ Hàn Quốc.
                </p>
              </div>
            </div>

            {/* Lookbook 3 */}
            <div className="card" style={{ padding: 0, borderRadius: '22px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/assets/emerald_velvet_nails.jpg"
                  alt="Mắt Mèo Velvet Ngọc Bích"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#2A9D8F'
                }}>
                  Emerald Luxury
                </span>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#2A9D8F', fontWeight: 700, textTransform: 'uppercase' }}>
                  Magnetic Cat-Eye
                </div>
                <h4 style={{ fontSize: '1.1rem', marginTop: '4px', marginBottom: '6px' }}>Mắt Mèo Velvet Ngọc Bích</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Hạt từ tính mắt mèo chuyển sắc sâu thẳm, phối cùng lá vàng gold sang trọng quý phái.
                </p>
              </div>
            </div>

            {/* Lookbook 4 */}
            <div className="card" style={{ padding: 0, borderRadius: '22px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/assets/salon_interior_luxury.jpg"
                  alt="Không Gian Salon Chuẩn Quốc Tế"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#D4AF37'
                }}>
                  VIP Space
                </span>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>
                  Salon Experience
                </div>
                <h4 style={{ fontSize: '1.1rem', marginTop: '4px', marginBottom: '6px' }}>Không Gian Salon Thư Giãn</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Không gian sang trọng chuẩn phong cách Hàn Quốc tạo ấn tượng chuyên nghiệp tuyệt đối.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Templates Showcase: 5 Phong Cách Giao Diện Tiệm Nail Đẳng Cấp */}
      <section id="templates" style={{ padding: '70px 24px', backgroundColor: '#FAF9FA', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-trial" style={{ marginBottom: '8px' }}>5 Mẫu Độc Quyền</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '10px', color: '#0F172A' }}>
              Chọn Giao Diện Phù Hợp Với Cá Tính Salon Của Bạn
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
              Thay đổi toàn bộ phong cách website đặt lịch chỉ với 1 click. Không cần code, không cần thiết kế lại.
            </p>
          </div>

          {/* Template Selection Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
            {Object.values(TEMPLATE_THEMES).map((t) => {
              const isSelected = activeTemplateKey === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTemplateKey(t.id)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '999px',
                    border: isSelected ? `2px solid ${t.primaryColor}` : '1.5px solid var(--border)',
                    backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: t.primaryColor,
                    display: 'inline-block'
                  }} />
                  <span style={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.9rem', color: isSelected ? '#0F172A' : 'var(--text-muted)' }}>
                    {t.name}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    backgroundColor: `${t.primaryColor}20`,
                    color: t.primaryColor
                  }}>
                    {t.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Template Detailed Preview Card */}
          <div style={{
            backgroundColor: activeTemplate.isDark ? activeTemplate.cardBg : '#FFFFFF',
            color: activeTemplate.textColor,
            borderRadius: '24px',
            overflow: 'hidden',
            border: `2px solid ${activeTemplate.borderColor}`,
            boxShadow: 'var(--shadow-lg)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center'
          }}>
            {/* Banner Preview */}
            <div style={{ position: 'relative', height: '340px' }}>
              <img
                src={activeTemplate.bannerPlaceholder}
                alt={activeTemplate.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)'
              }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '24px', color: '#FFFFFF' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  backgroundColor: activeTemplate.primaryColor,
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.78rem'
                }}>
                  {activeTemplate.badge}
                </span>
                <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginTop: '6px', fontWeight: 800 }}>
                  {activeTemplate.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>{activeTemplate.subtitle}</p>
              </div>
            </div>

            {/* Template Info & Features */}
            <div style={{ padding: '36px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Palette size={20} color={activeTemplate.primaryColor} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: activeTemplate.primaryColor }}>
                  {activeTemplate.subtitle}
                </span>
              </div>

              <h3 style={{ fontSize: '1.5rem', marginBottom: '14px', color: activeTemplate.textColor }}>
                Phong cách {activeTemplate.name}
              </h3>

              <p style={{ fontSize: '0.95rem', color: activeTemplate.textMuted, lineHeight: 1.6, marginBottom: '24px' }}>
                {activeTemplate.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: activeTemplate.isDark ? '#1F293D' : '#F8FAFC', border: `1px solid ${activeTemplate.borderColor}` }}>
                  <div style={{ fontSize: '0.75rem', color: activeTemplate.textMuted }}>Màu sắc chủ đạo</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: activeTemplate.primaryColor, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: activeTemplate.primaryColor }} />
                    {activeTemplate.primaryColor}
                  </div>
                </div>

                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: activeTemplate.isDark ? '#1F293D' : '#F8FAFC', border: `1px solid ${activeTemplate.borderColor}` }}>
                  <div style={{ fontSize: '0.75rem', color: activeTemplate.textMuted }}>Phù hợp nhất</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '4px', color: activeTemplate.textColor }}>
                    {activeTemplate.badge}
                  </div>
                </div>
              </div>

              <Link to="/register" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: activeTemplate.primaryColor }}>
                Chọn Giao Diện Này & Bắt Đầu <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Salons Showcase with Real Images */}
      <section id="demo" style={{ padding: '70px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-trial" style={{ marginBottom: '8px' }}>Trực Quan & Thực Tế</span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '10px', color: '#0F172A' }}>
            Xem Website Các Tiệm Đang Hoạt Động
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Click để trải nghiệm ngay quy trình khách hàng đặt lịch trên website công khai của từng tiệm.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '28px'
        }}>
          {/* Demo 1: Luna Nail Studio */}
          <div className="card" style={{
            borderRadius: '24px',
            overflow: 'hidden',
            padding: 0,
            border: '2px solid rgba(212, 107, 132, 0.25)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{
              height: '180px',
              backgroundImage: 'url(/assets/salon_interior_luxury.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)' }} />
              <div style={{
                position: 'absolute',
                bottom: '-28px',
                left: '24px',
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundImage: 'url(https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                border: '4px solid #FFFFFF',
                boxShadow: 'var(--shadow-md)'
              }} />
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(255,255,255,0.92)',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '4px 12px',
                borderRadius: '999px'
              }}>
                Giao Diện Hàn Quốc Pastel
              </span>
            </div>

            <div style={{ padding: '40px 24px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Luna Nail Studio</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>/s/luna-nail</p>
                </div>
                <span className="badge badge-confirmed">● Đang hoạt động</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '18px', minHeight: '44px', lineHeight: 1.5 }}>
                Không gian phong cách Hàn Quốc, chuyên sơn gel tráng gương ngọc trai, hoa nổi 3D tinh xảo tại Quận 1, TP. HCM.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="/s/luna-nail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  Mở Trang Đặt Lịch <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Demo 2: Mi Nail Studio */}
          <div className="card" style={{
            borderRadius: '24px',
            overflow: 'hidden',
            padding: 0,
            border: '2px solid rgba(42, 157, 143, 0.25)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{
              height: '180px',
              backgroundImage: 'url(/assets/emerald_velvet_nails.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />
              <div style={{
                position: 'absolute',
                bottom: '-28px',
                left: '24px',
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: '#2A9D8F',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                border: '4px solid #FFFFFF',
                boxShadow: 'var(--shadow-md)'
              }}>
                💅
              </div>
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(255,255,255,0.92)',
                color: '#2A9D8F',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '4px 12px',
                borderRadius: '999px'
              }}>
                Giao Diện Spa Thảo Mộc
              </span>
            </div>

            <div style={{ padding: '40px 24px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Mi Nail Studio</h3>
                  <p style={{ fontSize: '0.85rem', color: '#2A9D8F', fontWeight: 600 }}>/s/mi-nail-studio</p>
                </div>
                <span className="badge badge-confirmed">● Đang hoạt động</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '18px', minHeight: '44px', lineHeight: 1.5 }}>
                Chuyên móng đắp bột ombre sang trọng phong cách Châu Âu & mắt mèo ngọc bích ánh kim tại Cầu Giấy, Hà Nội.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="/s/mi-nail-studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: '0.9rem', borderColor: '#2A9D8F', color: '#2A9D8F', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  Mở Trang Đặt Lịch <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '70px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px', color: '#0F172A' }}>
              Tất Cả Những Gì Chủ Tiệm Cần Để Tự Do Vận Hành
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
              Thiết kế đơn giản, thân thiện tối đa với người không rành công nghệ. Không thuật ngữ phức tạp.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Smartphone size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Website Đặt Lịch Chuẩn Sang Trọng</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Sở hữu đường link riêng biệt <code>/s/ten-tiem</code>. Khách chọn dịch vụ kèm hình ảnh trực quan, thợ làm móng và ngày giờ tiện lợi ngay trên điện thoại.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--accent-gold-light)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <QrCode size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Tạo Mã QR Đặt Lịch Tự Động</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Hệ thống tự tạo mã QR thương hiệu chất lượng cao. In ra để bàn thu ngân hoặc dán trước cửa tiệm để khách quét đặt lịch tức thì.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--accent-teal-light)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Tính Khung Giờ Trống Tự Động</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Không còn lo trùng lịch. Hệ thống tự trừ giờ làm việc, ngày nghỉ và các lịch đã hẹn trước để chỉ hiển thị slot còn trống thực tế.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Onboarding Siêu Tốc 5 Phút</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Có sẵn mẫu dịch vụ chuẩn cho tiệm nail Việt Nam (Sơn gel, Đắp bột, Móng úp...). Áp dụng chỉ với 1 click chuột là xong!
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Cách Ly Dữ Liệu Tuyệt Đối</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Kiến trúc Multi-tenant chuẩn enterprise. Khách hàng và thông tin tiệm này hoàn toàn được bảo mật, không thể bị tiệm khác xem trộm.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Palette size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Tùy Biến 5 Phong Cách Không Cần Code</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Tự đổi tên tiệm, template thương hiệu, tải logo, cập nhật ảnh mẫu móng và bảng giá trực tiếp ngay trên điện thoại hoặc máy tính.
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
        padding: '50px 24px 30px',
        fontSize: '0.9rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
              💅 NailVibe SaaS
            </div>
            <p>Nền tảng tạo website đặt lịch số 1 dành riêng cho tiệm nail Việt Nam.</p>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/login" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Đăng Nhập</Link>
            <Link to="/register" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Đăng Ký</Link>
            <a href="/api/health" target="_blank" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Trạng Thái Hệ Thống</a>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '30px auto 0', paddingTop: '20px', borderTop: '1px solid #1E293B', textAlign: 'center', fontSize: '0.8rem' }}>
          © 2026 NailVibe Platform. All rights reserved. Nền tảng Đặt Lịch Nail Đa Tiệm.
        </div>
      </footer>
    </div>
  );
};
