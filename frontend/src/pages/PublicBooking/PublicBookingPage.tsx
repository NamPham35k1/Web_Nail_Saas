import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import {
  Sparkles,
  Clock,
  Calendar,
  User,
  Phone,
  MapPin,
  Check,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Crown,
  Heart,
  Leaf,
  Flame,
  Layers,
  Palette,
  Eye,
  Star,
  Smartphone,
  Camera,
  Award,
  Gem,
  Scissors
} from 'lucide-react';
import { TEMPLATE_THEMES, type TemplateTheme } from '../../config/templates';

export const PublicBookingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Live Template Preview Switcher
  const [activeThemeKey, setActiveThemeKey] = useState<string>('BLUSH_KOREA');
  const [saveThemeLoading, setSaveThemeLoading] = useState<boolean>(false);
  const [saveThemeNotice, setSaveThemeNotice] = useState<string>('');

  // Stepper state for Mini-App layout
  const [miniAppStep, setMiniAppStep] = useState<number>(1);

  // Booking Flow State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null); // null = any
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [slotsMessage, setSlotsMessage] = useState<string>('');

  // Customer Contact Info
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>('');

  // Confirmation Modal
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Load Salon Data
  useEffect(() => {
    async function loadSalon() {
      if (!slug) return;
      setLoading(true);
      setError('');
      try {
        const res = await api.getPublicSalon(slug);
        setSalon(res.salon);
        if (res.salon?.settings?.templateTheme) {
          setActiveThemeKey(res.salon.settings.templateTheme);
        }
      } catch (err: any) {
        setError(err.message || 'Không tìm thấy tiệm nail này.');
      } finally {
        setLoading(false);
      }
    }
    loadSalon();
  }, [slug]);

  // Load Slots whenever date, service, or staff changes
  useEffect(() => {
    async function loadSlots() {
      if (!slug || !selectedDate || !selectedService) return;
      setSlotsLoading(true);
      setSelectedSlot('');
      setSlotsMessage('');
      try {
        const res = await api.getPublicSlots(
          slug,
          selectedDate,
          selectedService.id,
          selectedStaff?.id || 'any'
        );
        if (res.available === false) {
          setSlotsMessage(res.message || 'Tiệm đóng cửa vào ngày này.');
          setAvailableSlots([]);
        } else {
          setAvailableSlots(res.slots || []);
        }
      } catch (err) {
        setSlotsMessage('Lỗi tải khung giờ trống.');
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }
    loadSlots();
  }, [slug, selectedDate, selectedService, selectedStaff]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) {
      setBookingError('Vui lòng chọn một dịch vụ làm móng.');
      return;
    }
    if (!selectedSlot) {
      setBookingError('Vui lòng chọn khung giờ hẹn còn trống.');
      return;
    }

    setBookingError('');
    setBookingLoading(true);

    try {
      const res = await api.bookPublicAppointment(slug!, {
        customerName,
        customerPhone,
        customerEmail,
        serviceId: selectedService.id,
        staffId: selectedStaff?.id || null,
        date: selectedDate,
        time: selectedSlot,
        notes: customerNotes
      });

      setConfirmedBooking(res.appointment);
    } catch (err: any) {
      setBookingError(err.message || 'Lỗi đặt lịch hẹn.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleQuickSaveTheme = async (themeId: string) => {
    setActiveThemeKey(themeId);
    setSaveThemeLoading(true);
    try {
      await api.updateSettings({
        templateTheme: themeId,
        brandColor: TEMPLATE_THEMES[themeId]?.primaryColor
      });
      setSaveThemeNotice(`✓ Đã lưu mẫu "${TEMPLATE_THEMES[themeId]?.name}" làm giao diện chính của tiệm!`);
    } catch (err) {
      setSaveThemeNotice(`Đang xem thử mẫu "${TEMPLATE_THEMES[themeId]?.name}"`);
    } finally {
      setSaveThemeLoading(false);
      setTimeout(() => setSaveThemeNotice(''), 4000);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF8F9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '38px', marginBottom: '12px', animation: 'pulseGlow 1.5s infinite' }}>💅</div>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Đang chuẩn bị giao diện website...</p>
        </div>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF8F9', padding: '20px' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '40px 24px', borderRadius: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '14px' }}>💅</div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Không Tìm Thấy Tiệm Nail</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Đường dẫn <code>/s/{slug}</code> không tồn tại hoặc tiệm chưa xuất bản website.
          </p>
          <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>
            Về Trang Chủ NailVibe
          </Link>
        </div>
      </div>
    );
  }

  // Active theme calculation
  const theme: TemplateTheme = TEMPLATE_THEMES[activeThemeKey] || TEMPLATE_THEMES.BLUSH_KOREA;
  const brandColor = salon.settings?.brandColor && activeThemeKey === salon.settings?.templateTheme
    ? salon.settings.brandColor
    : theme.primaryColor;

  const categories = ['ALL', ...Array.from(new Set(salon.services?.map((s: any) => s.category) || []))];
  const filteredServices = selectedCategory === 'ALL'
    ? (salon.services || [])
    : (salon.services || []).filter((s: any) => s.category === selectedCategory);

  const isDark = theme.isDark;
  const cardBgStyle = isDark ? 'rgba(19, 26, 42, 0.88)' : '#FFFFFF';
  const cardBorder = isDark ? '1px solid rgba(212, 175, 55, 0.3)' : `1.5px solid ${theme.borderColor}`;
  const inputBg = isDark ? 'rgba(11, 15, 25, 0.9)' : '#FFFFFF';
  const inputColor = isDark ? '#F8FAFC' : '#1E293B';
  const inputBorder = isDark ? '1.5px solid rgba(212, 175, 55, 0.35)' : '1.5px solid var(--border)';
  const subtleBg = isDark ? 'rgba(21, 28, 44, 0.95)' : 'var(--bg-subtle)';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bgColor,
      color: theme.textColor,
      paddingBottom: '90px',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>

      {/* ========================================================================= */}
      {/* TOP LIVE TEMPLATE SWITCHER BAR: Khách/Chủ tiệm xem & chuyển đổi 5 Mẫu Web */}
      {/* ========================================================================= */}
      <div style={{
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.96)' : '#FFFFFF',
        borderBottom: isDark ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid var(--border)',
        padding: '10px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 2px 14px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          maxWidth: '1120px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.76rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: isDark ? 'rgba(212, 175, 55, 0.2)' : 'var(--primary-light)',
              color: brandColor
            }}>
              <Palette size={14} /> Chọn Mẫu Website:
            </span>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: theme.textColor }}>
              {theme.name}
            </span>
            {saveThemeNotice && (
              <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700, animation: 'fadeIn 0.2s ease' }}>
                {saveThemeNotice}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
            {Object.values(TEMPLATE_THEMES).map((t) => {
              const isCurrent = activeThemeKey === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleQuickSaveTheme(t.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: isCurrent ? 800 : 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: isCurrent
                      ? `2px solid ${t.primaryColor}`
                      : isDark ? '1px solid #334155' : '1px solid var(--border)',
                    backgroundColor: isCurrent
                      ? (t.isDark ? '#1E293B' : `${t.primaryColor}18`)
                      : (isDark ? '#0B0F19' : '#FFFFFF'),
                    color: isCurrent ? t.primaryColor : (isDark ? '#94A3B8' : 'var(--text-muted)'),
                    boxShadow: isCurrent ? `0 2px 10px ${t.primaryColor}30` : 'none',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: t.primaryColor,
                    boxShadow: isCurrent ? `0 0 6px ${t.primaryColor}` : 'none'
                  }} />
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5 KIẾN TRÚC MẪU WEBSITE HOÀN TOÀN KHÁC BIỆT                               */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* MẪU 1: NAILVIBE STUDIO PRO (Bố Cục Landing Page Salon Toàn Diện Đa Tầng)    */}
      {/* ------------------------------------------------------------------------- */}
      {theme.layoutType === 'salon-landing' && (
        <div>
          {/* Hero Banner Section */}
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            color: '#FFFFFF',
            padding: '60px 24px 70px',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: salon.settings?.bannerUrl ? `url(${salon.settings.bannerUrl})` : `url(${theme.bannerPlaceholder})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.25
            }} />
            
            <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                {salon.settings?.logoUrl ? (
                  <img
                    src={salon.settings.logoUrl}
                    alt={salon.name}
                    style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: `4px solid ${brandColor}`, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
                  />
                ) : (
                  <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: brandColor, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                    💅
                  </div>
                )}

                <div style={{ flex: 1, minWidth: '280px' }}>
                  <span style={{ background: `${brandColor}30`, border: `1px solid ${brandColor}`, color: '#FFB3C6', padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800 }}>
                    ★ SALON CHUYÊN NGHIỆP PRO
                  </span>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFF', marginTop: '8px', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                    {salon.name}
                  </h1>
                  <p style={{ fontSize: '1rem', color: '#CBD5E1', maxWidth: '650px', lineHeight: 1.5 }}>
                    {salon.description || 'Không gian làm móng sang trọng, trang thiết bị chuẩn quốc tế và chuyên viên tay nghề cao.'}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <a
                    href="#booking-section"
                    style={{
                      background: `linear-gradient(135deg, ${brandColor} 0%, #C05570 100%)`,
                      color: '#FFF',
                      padding: '14px 28px',
                      borderRadius: '14px',
                      fontWeight: 800,
                      fontSize: '1rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(212,107,132,0.4)'
                    }}
                  >
                    <span>Đặt Lịch Ngay</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>

              {/* 3 Cam kết chất lượng Salon */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                marginTop: '40px',
                paddingTop: '30px',
                borderTop: '1px solid rgba(255,255,255,0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Gem size={20} color={brandColor} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Sơn Gel & Đá Nhập Khẩu</div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Bền màu, an toàn tuyệt đối cho móng</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={20} color={brandColor} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Thợ Móng Chuyên Nghiệp</div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Kỹ thuật chuẩn form, chăm sóc tỉ mỉ</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} color={brandColor} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Tiệt Trùng Y Khoa 100%</div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Dụng cụ khử khuẩn bằng tia UV</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lookbook Gallery Showcase */}
          <div style={{ maxWidth: '1080px', margin: '40px auto 0', padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: brandColor, textTransform: 'uppercase' }}>Bộ Sưu Tập Tiệm</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textColor, margin: '4px 0 0' }}>Mẫu Móng Nghệ Thuật Hot Nhất</h2>
              </div>
              <span style={{ fontSize: '0.82rem', color: theme.textMuted }}>Bấm chọn mẫu để tự động điền dịch vụ</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {(salon.services?.filter((s: any) => s.imageUrl)?.slice(0, 4) || []).map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedService(item);
                    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: selectedService?.id === item.id ? `2.5px solid ${brandColor}` : '1.5px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ height: '150px', position: 'relative' }}>
                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.65)', color: '#FFF', padding: '2px 8px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800 }}>
                      {Number(item.price).toLocaleString()}đ
                    </span>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: theme.textColor }}>{item.name}</div>
                    <div style={{ fontSize: '0.76rem', color: brandColor, fontWeight: 700, marginTop: '4px' }}>
                      {selectedService?.id === item.id ? '✓ Đang chọn' : '+ Đặt làm mẫu này'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* MẪU 2: SEOUL CHIC MINI-APP (Quy Trình Stepper 4 Bước Chuẩn Điện Thoại)    */}
      {/* ------------------------------------------------------------------------- */}
      {theme.layoutType === 'mini-app-stepper' && (
        <div style={{ maxWidth: '640px', margin: '24px auto 0', padding: '0 16px' }}>
          {/* Mini-App Header Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(232, 122, 147, 0.1)',
            border: '1.5px solid #FCE7EC',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            {salon.settings?.logoUrl ? (
              <img
                src={salon.settings.logoUrl}
                alt={salon.name}
                style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${brandColor}`, margin: '0 auto 12px' }}
              />
            ) : (
              <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: '#FFF0F3', color: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 12px' }}>
                🌸
              </div>
            )}
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>{salon.name}</h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>📍 {salon.address || 'Tiệm Nail Phong Cách Hàn Quốc'}</p>

            {/* 4-Step Stepper Tabs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #F6E6EB'
            }}>
              {[
                { step: 1, label: 'Dịch vụ' },
                { step: 2, label: 'Thợ móng' },
                { step: 3, label: 'Ngày & Giờ' },
                { step: 4, label: 'Xác nhận' }
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => miniAppStep > s.step && setMiniAppStep(s.step)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: miniAppStep > s.step ? 'pointer' : 'default',
                    flex: 1
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: miniAppStep === s.step ? brandColor : miniAppStep > s.step ? '#10B981' : '#F1F5F9',
                    color: miniAppStep >= s.step ? '#FFFFFF' : '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}>
                    {miniAppStep > s.step ? '✓' : s.step}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: miniAppStep === s.step ? 800 : 500, color: miniAppStep === s.step ? brandColor : 'var(--text-muted)', marginTop: '4px' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* MẪU 3: ROYAL NOIR VIP (Châu Âu Quý Tộc / Dark VIP Lounge)                 */}
      {/* ------------------------------------------------------------------------- */}
      {theme.layoutType === 'luxury-noir' && (
        <div style={{ maxWidth: '1080px', margin: '30px auto 0', padding: '0 24px' }}>
          {/* VIP Hero Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(21, 28, 44, 0.9) 0%, rgba(11, 15, 25, 0.95) 100%)',
            border: '1.5px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '24px',
            padding: '36px 32px',
            boxShadow: '0 16px 50px rgba(0,0,0,0.6)',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                {salon.settings?.logoUrl ? (
                  <img src={salon.settings.logoUrl} alt={salon.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #D4AF37', boxShadow: '0 0 25px rgba(212,175,55,0.5)' }} />
                ) : (
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#131A2A', border: '3px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px' }}>👑</div>
                )}
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#F3D279' }}>
                  ⚜️ THƯỢNG LƯU ROYAL VIP SALON
                </span>
                <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#FFF', fontFamily: "'Playfair Display', Georgia, serif", margin: '6px 0' }}>
                  {salon.name}
                </h1>
                <p style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>📍 {salon.address || 'Không gian VIP sang trọng & riêng tư'}</p>
              </div>
            </div>

            <div style={{
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              padding: '12px 20px',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#F3D279', fontWeight: 700 }}>DỊCH VỤ ĐỘC QUYỀN</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>VIP Concierge 24/7</div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* MẪU 4: ZEN BOTANICAL SPA (Split Screen 50/50 Thảo Mộc & Dưỡng Sinh)        */}
      {/* ------------------------------------------------------------------------- */}
      {theme.layoutType === 'split-spa' && (
        <div style={{ maxWidth: '1100px', margin: '24px auto 0', padding: '0 24px' }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid rgba(42, 157, 143, 0.25)',
            boxShadow: '0 8px 30px rgba(42, 157, 143, 0.08)',
            padding: '24px 32px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: '#E6F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
              🌿
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2A9D8F', textTransform: 'uppercase' }}>BỐ CỤC CHIA ĐÔI SPLIT-SCREEN</span>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#134E48', margin: '2px 0' }}>{salon.name}</h1>
              <p style={{ fontSize: '0.86rem', color: '#4B7B75', margin: 0 }}>Dưỡng sinh, thảo dược thiên nhiên và trị liệu móng thư thái</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* MẪU 5: VOGUE HIGH-FASHION LOOKBOOK (Tạp Chí Nghệ Thuật & Gallery First)    */}
      {/* ------------------------------------------------------------------------- */}
      {theme.layoutType === 'editorial-lookbook' && (
        <div style={{ maxWidth: '1040px', margin: '40px auto 0', padding: '0 24px' }}>
          <div style={{ borderBottom: '2px solid #0F172A', paddingBottom: '24px', marginBottom: '32px' }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>
              NAIL ART EXHIBITION & EDITORIAL STUDIO
            </div>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-1.5px', margin: '8px 0' }}>
              {salon.name}
            </h1>
            <p style={{ fontSize: '0.94rem', color: '#64748B', maxWidth: '620px', lineHeight: 1.6 }}>
              Không gian nghệ thuật móng tối giản, nơi mỗi bàn tay là một tác phẩm được tôn vinh.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOOKING CORE SECTION: Hoạt động đồng bộ trên toàn bộ 5 mẫu layout          */}
      {/* ========================================================================= */}
      <div id="booking-section" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Nếu ở chế độ Mini-App Stepper: Hiển thị giao diện 4 bước riêng biệt */}
        {theme.layoutType === 'mini-app-stepper' ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            border: '1.5px solid #FCE7EC',
            boxShadow: '0 12px 35px rgba(232, 122, 147, 0.12)'
          }}>
            {/* BƯỚC 1 CỦA MINI-APP: Chọn Dịch Vụ */}
            {miniAppStep === 1 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B' }}>Bước 1: Chọn Dịch Vụ Làm Móng</h3>
                  <span style={{ fontSize: '0.8rem', color: brandColor, fontWeight: 700 }}>{filteredServices.length} dịch vụ</span>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '14px', paddingBottom: '4px' }}>
                  {categories.map((cat: any) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: selectedCategory === cat ? `2px solid ${brandColor}` : '1px solid var(--border)',
                        background: selectedCategory === cat ? '#FFF0F3' : '#FFFFFF',
                        color: selectedCategory === cat ? brandColor : 'var(--text-main)',
                        fontWeight: selectedCategory === cat ? 800 : 500,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cat === 'ALL' ? 'Tất cả' : cat}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
                  {filteredServices.map((s: any) => {
                    const isSelected = selectedService?.id === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedService(s)}
                        style={{
                          padding: '14px',
                          borderRadius: '16px',
                          border: isSelected ? `2px solid ${brandColor}` : '1.5px solid #F6E6EB',
                          background: isSelected ? '#FFF7F9' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.94rem', color: isSelected ? brandColor : '#1E293B' }}>{s.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>⏱️ {s.durationMinutes} phút • {s.category}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: brandColor }}>{Number(s.price).toLocaleString()}đ</div>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: isSelected ? brandColor : 'var(--text-muted)' }}>
                            {isSelected ? '✓ Đã chọn' : '+ Chọn'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={!selectedService}
                  onClick={() => setMiniAppStep(2)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    background: selectedService ? brandColor : '#E2E8F0',
                    color: selectedService ? '#FFF' : '#94A3B8',
                    fontWeight: 800,
                    fontSize: '0.98rem',
                    border: 'none',
                    cursor: selectedService ? 'pointer' : 'not-allowed',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Tiếp Tục: Chọn Thợ Móng</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* BƯỚC 2 CỦA MINI-APP: Chọn Thợ Móng */}
            {miniAppStep === 2 && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', marginBottom: '16px' }}>Bước 2: Chọn Chuyên Viên</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                  <div
                    onClick={() => setSelectedStaff(null)}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      border: selectedStaff === null ? `2px solid ${brandColor}` : '1.5px solid var(--border)',
                      background: selectedStaff === null ? '#FFF7F9' : '#FFFFFF',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '6px' }}>✨</div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Bất kỳ ai</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Tiệm tự xếp</div>
                  </div>

                  {salon.staff?.map((st: any) => {
                    const isStaffSelected = selectedStaff?.id === st.id;
                    return (
                      <div
                        key={st.id}
                        onClick={() => setSelectedStaff(st)}
                        style={{
                          padding: '16px',
                          borderRadius: '16px',
                          border: isStaffSelected ? `2px solid ${brandColor}` : '1.5px solid var(--border)',
                          background: isStaffSelected ? '#FFF7F9' : '#FFFFFF',
                          textAlign: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFF0F3', color: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, margin: '0 auto 8px', fontSize: '1.1rem' }}>
                          {st.name[0]}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{st.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{st.role}</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setMiniAppStep(1)}
                    style={{ padding: '12px 20px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Quay Lại
                  </button>
                  <button
                    type="button"
                    onClick={() => setMiniAppStep(3)}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', background: brandColor, color: '#FFF', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                  >
                    Tiếp Tục: Chọn Ngày & Giờ ➔
                  </button>
                </div>
              </div>
            )}

            {/* BƯỚC 3 CỦA MINI-APP: Chọn Ngày & Giờ */}
            {miniAppStep === 3 && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', marginBottom: '16px' }}>Bước 3: Chọn Ngày & Giờ Còn Trống</h3>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Chọn Ngày Hẹn:</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: '8px' }}>Khung Giờ Còn Trống:</label>
                  {slotsLoading ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Đang kiểm tra lịch trống...</p>
                  ) : availableSlots.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Ngày này tiệm đã kín lịch hoặc đóng cửa. Vui lòng chọn ngày khác.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto', marginBottom: '20px' }}>
                      {availableSlots.map((slot) => {
                        const isSlotSelected = selectedSlot === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(slot.time)}
                            style={{
                              padding: '8px 6px',
                              borderRadius: '10px',
                              border: isSlotSelected ? `2px solid ${brandColor}` : '1px solid var(--border)',
                              backgroundColor: isSlotSelected ? brandColor : slot.available ? '#FFFFFF' : '#F1F5F9',
                              color: isSlotSelected ? '#FFFFFF' : slot.available ? '#1E293B' : '#94A3B8',
                              fontWeight: isSlotSelected ? 800 : 600,
                              fontSize: '0.85rem',
                              cursor: slot.available ? 'pointer' : 'not-allowed'
                            }}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setMiniAppStep(2)}
                    style={{ padding: '12px 20px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Quay Lại
                  </button>
                  <button
                    type="button"
                    disabled={!selectedSlot}
                    onClick={() => setMiniAppStep(4)}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', background: selectedSlot ? brandColor : '#E2E8F0', color: selectedSlot ? '#FFF' : '#94A3B8', fontWeight: 800, border: 'none', cursor: selectedSlot ? 'pointer' : 'not-allowed' }}
                  >
                    Tiếp Tục: Điền Thông Tin ➔
                  </button>
                </div>
              </div>
            )}

            {/* BƯỚC 4 CỦA MINI-APP: Điền Thông Tin & Hoàn Tất */}
            {miniAppStep === 4 && (
              <form onSubmit={handleBookingSubmit}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', marginBottom: '16px' }}>Bước 4: Xác Nhận & Đặt Lịch</h3>

                {/* Tóm tắt */}
                <div style={{ background: '#FFF5F7', border: '1px solid #FCE7EC', borderRadius: '14px', padding: '14px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.88rem' }}>
                    <span>Dịch vụ:</span>
                    <strong>{selectedService?.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.88rem' }}>
                    <span>Thời gian hẹn:</span>
                    <strong>{selectedSlot} - {selectedDate}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: brandColor, fontWeight: 800, fontSize: '1rem', paddingTop: '6px', borderTop: '1px solid #FCE7EC', marginTop: '6px' }}>
                    <span>Tổng tiền:</span>
                    <span>{Number(selectedService?.price || 0).toLocaleString()}đ</span>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Họ & Tên *</label>
                  <input
                    type="text"
                    placeholder="VD: Nguyễn Phương Anh"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Số Điện Thoại Nhận Lịch *</label>
                  <input
                    type="tel"
                    placeholder="0901 234 567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Ghi Chú Yêu Cầu</label>
                  <input
                    type="text"
                    placeholder="Mẫu móng mong muốn, form hạnh nhân..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setMiniAppStep(3)}
                    style={{ padding: '12px 20px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Quay Lại
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', background: brandColor, color: '#FFF', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                  >
                    {bookingLoading ? 'Đang gửi...' : 'Xác Nhận Đặt Lịch Ngay 💅'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* CÁC GIAO DIỆN CÒN LẠI (Landing Page, Royal Noir, Split Spa, Vogue): 2 Cột Chuyên Nghiệp */
          <form onSubmit={handleBookingSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '26px' }}>
            
            {/* Cột trái: Chọn Dịch Vụ & Thợ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{
                backgroundColor: cardBgStyle,
                borderRadius: theme.cardBorderRadius,
                padding: '26px',
                border: cardBorder,
                boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.5)' : 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: brandColor,
                    color: isDark ? '#0B0F19' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    1
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: theme.textColor, fontFamily: isDark ? "'Playfair Display', Georgia, serif" : 'inherit' }}>
                    Chọn Dịch Vụ Làm Móng
                  </h3>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
                  {categories.map((cat: any) => {
                    const isCatSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '999px',
                          border: isCatSelected ? `1.5px solid ${brandColor}` : isDark ? '1px solid #334155' : '1px solid var(--border)',
                          background: isCatSelected ? (isDark ? 'rgba(212,175,55,0.2)' : `${brandColor}15`) : (isDark ? '#0D1322' : '#FFFFFF'),
                          color: isCatSelected ? brandColor : theme.textMuted,
                          fontWeight: isCatSelected ? 800 : 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {cat === 'ALL' ? 'Tất cả' : cat}
                      </button>
                    );
                  })}
                </div>

                {/* Dịch vụ list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                  {filteredServices.map((s: any) => {
                    const isSelected = selectedService?.id === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedService(s)}
                        style={{
                          padding: '14px',
                          borderRadius: '16px',
                          border: isSelected ? `2px solid ${brandColor}` : isDark ? '1px solid rgba(212,175,55,0.2)' : '1px solid var(--border)',
                          background: isSelected ? (isDark ? 'rgba(212,175,55,0.15)' : `${brandColor}0D`) : (isDark ? '#0D1322' : '#FFFFFF'),
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          boxShadow: isSelected ? `0 4px 16px ${brandColor}35` : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.94rem', color: isSelected ? brandColor : theme.textColor }}>{s.name}</div>
                          <div style={{ fontSize: '0.78rem', color: theme.textMuted, marginTop: '2px' }}>
                            <Clock size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> {s.durationMinutes} phút {s.category && `• ${s.category}`}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: brandColor }}>{Number(s.price).toLocaleString()}đ</div>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: isSelected ? brandColor : theme.textMuted }}>
                            {isSelected ? '✓ Đã chọn' : '+ Chọn'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Thợ làm móng */}
              {salon.staff && salon.staff.length > 0 && (
                <div style={{
                  backgroundColor: cardBgStyle,
                  borderRadius: theme.cardBorderRadius,
                  padding: '24px',
                  border: cardBorder
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: brandColor, color: isDark ? '#0B0F19' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                      2
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: theme.textColor }}>Chọn Thợ Móng</h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                    <div
                      onClick={() => setSelectedStaff(null)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: selectedStaff === null ? `2px solid ${brandColor}` : isDark ? '1px solid #334155' : '1.5px solid var(--border)',
                        background: selectedStaff === null ? (isDark ? 'rgba(212,175,55,0.2)' : `${brandColor}0A`) : (isDark ? '#0D1322' : '#FFFFFF'),
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>✨</div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: theme.textColor }}>Bất kỳ ai</div>
                      <div style={{ fontSize: '0.74rem', color: theme.textMuted }}>Tiệm tự xếp</div>
                    </div>

                    {salon.staff.map((st: any) => {
                      const isStaffSelected = selectedStaff?.id === st.id;
                      return (
                        <div
                          key={st.id}
                          onClick={() => setSelectedStaff(st)}
                          style={{
                            padding: '12px',
                            borderRadius: '12px',
                            border: isStaffSelected ? `2px solid ${brandColor}` : isDark ? '1px solid #334155' : '1.5px solid var(--border)',
                            background: isStaffSelected ? (isDark ? 'rgba(212,175,55,0.2)' : `${brandColor}0A`) : (isDark ? '#0D1322' : '#FFFFFF'),
                            textAlign: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${brandColor}25`, color: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, margin: '0 auto 6px' }}>
                            {st.name[0]}
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: theme.textColor }}>{st.name}</div>
                          <div style={{ fontSize: '0.72rem', color: theme.textMuted }}>{st.role}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Cột phải: Ngày giờ & Điền thông tin */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{
                backgroundColor: cardBgStyle,
                borderRadius: theme.cardBorderRadius,
                padding: '24px',
                border: cardBorder
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: brandColor, color: isDark ? '#0B0F19' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                    3
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: theme.textColor }}>Chọn Ngày & Giờ Hẹn</h3>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ color: theme.textColor }}>Ngày Hẹn</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', fontSize: '0.95rem', color: inputColor, backgroundColor: inputBg, border: inputBorder, borderRadius: '12px', outline: 'none' }}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ color: theme.textColor, marginBottom: '8px' }}>Khung Giờ Còn Trống:</label>
                  {!selectedService ? (
                    <p style={{ color: theme.textMuted, fontSize: '0.85rem', fontStyle: 'italic' }}>Vui lòng chọn dịch vụ trước để tính khung giờ trống.</p>
                  ) : slotsLoading ? (
                    <p style={{ color: theme.textMuted, fontSize: '0.85rem' }}>Đang kiểm tra lịch trống...</p>
                  ) : availableSlots.length === 0 ? (
                    <p style={{ color: theme.textMuted, fontSize: '0.85rem' }}>Ngày này tiệm đã kín lịch. Vui lòng chọn ngày khác.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                      {availableSlots.map((slot) => {
                        const isSlotSelected = selectedSlot === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(slot.time)}
                            style={{
                              padding: '8px 6px',
                              borderRadius: '10px',
                              border: isSlotSelected ? `2px solid ${brandColor}` : isDark ? '1px solid #334155' : '1px solid var(--border)',
                              backgroundColor: isSlotSelected ? brandColor : slot.available ? (isDark ? '#0D1322' : '#FFFFFF') : (isDark ? '#1F293D' : '#F1F5F9'),
                              color: isSlotSelected ? (isDark ? '#0B0F19' : '#FFFFFF') : slot.available ? theme.textColor : theme.textMuted,
                              fontWeight: isSlotSelected ? 800 : 600,
                              fontSize: '0.85rem',
                              cursor: slot.available ? 'pointer' : 'not-allowed',
                              opacity: slot.available ? 1 : 0.4
                            }}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin khách */}
              <div style={{
                backgroundColor: cardBgStyle,
                borderRadius: theme.cardBorderRadius,
                padding: '24px',
                border: cardBorder
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: brandColor, color: isDark ? '#0B0F19' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                    4
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: theme.textColor }}>Thông Tin Của Bạn</h3>
                </div>

                {bookingError && (
                  <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '14px' }}>
                    {bookingError}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ color: theme.textColor }}>Họ & Tên *</label>
                  <input
                    type="text"
                    placeholder="VD: Nguyễn Phương Anh"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', fontSize: '0.95rem', color: inputColor, backgroundColor: inputBg, border: inputBorder, borderRadius: '12px', outline: 'none' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ color: theme.textColor }}>Số Điện Thoại Nhận Xác Nhận *</label>
                  <input
                    type="tel"
                    placeholder="0901 234 567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', fontSize: '0.95rem', color: inputColor, backgroundColor: inputBg, border: inputBorder, borderRadius: '12px', outline: 'none' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ color: theme.textColor }}>Ghi Chú Yêu Cầu</label>
                  <input
                    type="text"
                    placeholder="Màu sơn, mẫu móng mong muốn..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', fontSize: '0.95rem', color: inputColor, backgroundColor: inputBg, border: inputBorder, borderRadius: '12px', outline: 'none' }}
                  />
                </div>

                {selectedService && selectedSlot && (
                  <div style={{ background: subtleBg, padding: '14px', borderRadius: '14px', marginBottom: '16px', fontSize: '0.88rem', border: isDark ? '1px solid rgba(212,175,55,0.25)' : '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: theme.textMuted }}>Dịch vụ:</span>
                      <strong style={{ color: theme.textColor }}>{selectedService.name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: theme.textMuted }}>Thời gian:</span>
                      <strong style={{ color: theme.textColor }}>{selectedSlot} - {selectedDate}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: brandColor, fontWeight: 800, fontSize: '1rem', marginTop: '6px', paddingTop: '6px', borderTop: isDark ? '1px solid #334155' : '1px solid var(--border)' }}>
                      <span>Tổng chi phí:</span>
                      <span>{Number(selectedService.price).toLocaleString()}đ</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingLoading}
                  style={{
                    width: '100%',
                    height: '50px',
                    fontSize: '1.02rem',
                    fontWeight: 800,
                    cursor: bookingLoading ? 'not-allowed' : 'pointer',
                    borderRadius: '14px',
                    border: 'none',
                    background: isDark ? 'linear-gradient(135deg, #F3D279 0%, #D4AF37 50%, #B3881C 100%)' : `linear-gradient(135deg, ${brandColor} 0%, ${theme.primaryColor} 100%)`,
                    color: isDark ? '#0B0F19' : '#FFFFFF',
                    boxShadow: isDark ? '0 6px 25px rgba(212,175,55,0.4)' : `0 8px 24px ${brandColor}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {bookingLoading ? 'Đang gửi...' : 'Xác Nhận Đặt Lịch Ngay 💅'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmedBooking && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            padding: '36px 28px',
            borderRadius: '24px',
            backgroundColor: cardBgStyle,
            border: cardBorder,
            color: theme.textColor,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Check size={32} />
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '6px', fontWeight: 800 }}>Đặt Lịch Thành Công!</h2>
            <p style={{ color: theme.textMuted, fontSize: '0.9rem', marginBottom: '24px' }}>
              Cảm ơn <strong>{confirmedBooking.customerName}</strong>! Tiệm đã nhận được yêu cầu và sẽ liên hệ sớm.
            </p>

            <div style={{ background: subtleBg, padding: '20px', borderRadius: '16px', textAlign: 'left', fontSize: '0.88rem', marginBottom: '24px', border: isDark ? '1px solid rgba(212,175,55,0.25)' : '1.5px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: theme.textMuted }}>Mã lịch hẹn:</span>
                <span className="badge badge-trial" style={{ fontWeight: 800 }}>{confirmedBooking.code}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: theme.textMuted }}>Dịch vụ:</span>
                <strong style={{ color: theme.textColor }}>{confirmedBooking.serviceName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: theme.textMuted }}>Thời gian:</span>
                <strong style={{ color: theme.textColor }}>
                  {new Date(confirmedBooking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(confirmedBooking.startTime).toLocaleDateString('vi-VN')}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: brandColor, fontWeight: 800, fontSize: '1rem', paddingTop: '8px', borderTop: isDark ? '1px solid #334155' : '1px solid var(--border)' }}>
                <span>Tổng chi phí:</span>
                <span>{Number(confirmedBooking.totalPrice).toLocaleString()}đ</span>
              </div>
            </div>

            <button
              onClick={() => {
                setConfirmedBooking(null);
                setSelectedService(null);
                setSelectedSlot('');
                setMiniAppStep(1);
              }}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', background: brandColor, color: isDark ? '#0B0F19' : '#FFFFFF', fontWeight: 800, border: 'none', cursor: 'pointer' }}
            >
              Hoàn Tất & Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
