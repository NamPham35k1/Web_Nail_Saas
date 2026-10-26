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
  ArrowLeft
} from 'lucide-react';
import { TEMPLATE_THEMES } from '../../config/templates';

export const PublicBookingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF8F9' }}>
        <p style={{ color: 'var(--text-muted)' }}>Đang tải trang đặt lịch của tiệm...</p>
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

  const themeKey = salon.settings?.templateTheme || 'BLUSH_KOREA';
  const theme = TEMPLATE_THEMES[themeKey] || TEMPLATE_THEMES.BLUSH_KOREA;
  const brandColor = salon.settings?.brandColor || theme.primaryColor;
  const categories = ['ALL', ...Array.from(new Set(salon.services?.map((s: any) => s.category) || []))];
  const filteredServices = selectedCategory === 'ALL'
    ? (salon.services || [])
    : (salon.services || []).filter((s: any) => s.category === selectedCategory);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bgColor, color: theme.textColor, paddingBottom: '80px', transition: 'background-color 0.2s ease' }}>
      {/* Salon Hero Header */}
      <div style={{
        position: 'relative',
        backgroundColor: theme.cardBg,
        borderBottom: `1px solid ${theme.borderColor}`
      }}>
        {/* Banner */}
        <div style={{
          height: '200px',
          backgroundColor: brandColor,
          backgroundImage: salon.settings?.bannerUrl
            ? `url(${salon.settings.bannerUrl})`
            : theme.bannerPlaceholder
            ? `url(${theme.bannerPlaceholder})`
            : `linear-gradient(135deg, ${brandColor} 0%, #1E293B 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)' }} />
        </div>

        {/* Salon Info Container */}
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 24px 24px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginTop: '-50px', marginBottom: '16px' }}>
            {/* Logo */}
            {salon.settings?.logoUrl ? (
              <img
                src={salon.settings.logoUrl}
                alt={salon.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `4px solid ${theme.cardBg}`,
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: theme.cardBg
                }}
              />
            ) : (
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: theme.cardBg,
                border: `4px solid ${theme.cardBg}`,
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                color: brandColor
              }}>
                💅
              </div>
            )}

            <div style={{ flex: 1, paddingBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: theme.textColor }}>{salon.name}</h1>
                <span className="badge badge-confirmed" style={{ fontSize: '0.78rem' }}>
                  ● Nhận Lịch Trực Tuyến
                </span>
                <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '999px', background: `${brandColor}20`, color: brandColor, fontWeight: 700 }}>
                  {theme.name}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {salon.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color={brandColor} />
                <span>{salon.address}</span>
              </div>
            )}
            {salon.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={16} color={brandColor} />
                <a href={`tel:${salon.phone}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>
                  {salon.phone}
                </a>
              </div>
            )}
          </div>

          {salon.description && (
            <p style={{ marginTop: '12px', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              {salon.description}
            </p>
          )}

          {/* Policy Notice */}
          {salon.settings?.bookingPolicy && (
            <div style={{
              marginTop: '16px',
              padding: '10px 16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '12px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              <strong>Lưu ý đặt lịch:</strong> {salon.settings.bookingPolicy}
            </div>
          )}
        </div>
      </div>

      {/* Main Booking Form Container */}
      <div style={{ maxWidth: '960px', margin: '32px auto 0', padding: '0 20px' }}>
        <form onSubmit={handleBookingSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          
          {/* LEFT COLUMN: Service & Staff Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Step 1: Services */}
            <div className="card" style={{ padding: '24px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: brandColor,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.2rem' }}>Chọn Dịch Vụ Làm Móng</h3>
              </div>

              {/* Category Filter Tabs */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
                {categories.map((cat: any) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: selectedCategory === cat ? `1.5px solid ${brandColor}` : '1px solid var(--border)',
                      background: selectedCategory === cat ? `${brandColor}15` : '#FFFFFF',
                      color: selectedCategory === cat ? brandColor : 'var(--text-main)',
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat === 'ALL' ? 'Tất cả' : cat}
                  </button>
                ))}
              </div>

              {/* Services List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
                {filteredServices.map((s: any) => {
                  const isSelected = selectedService?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '14px',
                        border: isSelected ? `2px solid ${brandColor}` : '1.5px solid var(--border)',
                        background: isSelected ? `${brandColor}0A` : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? brandColor : 'var(--text-main)' }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <Clock size={12} /> {s.durationMinutes} phút
                        </div>
                        {s.description && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '4px' }}>
                            {s.description}
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: brandColor }}>
                          {Number(s.price).toLocaleString()}đ
                        </div>
                        {isSelected && (
                          <span style={{ fontSize: '0.75rem', color: brandColor, fontWeight: 700 }}>
                            ✓ Đã chọn
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Staff Selection (Optional) */}
            {salon.staff && salon.staff.length > 0 && (
              <div className="card" style={{ padding: '24px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: brandColor,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    2
                  </div>
                  <h3 style={{ fontSize: '1.2rem' }}>Chọn Chuyên Viên (Tùy chọn)</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                  {/* Option: Any staff */}
                  <div
                    onClick={() => setSelectedStaff(null)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: selectedStaff === null ? `2px solid ${brandColor}` : '1.5px solid var(--border)',
                      background: selectedStaff === null ? `${brandColor}0A` : '#FFFFFF',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>✨</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Bất kỳ ai</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tiệm sắp xếp</div>
                  </div>

                  {salon.staff.map((st: any) => {
                    const isSelected = selectedStaff?.id === st.id;
                    return (
                      <div
                        key={st.id}
                        onClick={() => setSelectedStaff(st)}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: isSelected ? `2px solid ${brandColor}` : '1.5px solid var(--border)',
                          background: isSelected ? `${brandColor}0A` : '#FFFFFF',
                          textAlign: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {st.avatarUrl ? (
                          <img
                            src={st.avatarUrl}
                            alt={st.name}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto 6px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--primary-light)',
                            color: brandColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            margin: '0 auto 6px'
                          }}>
                            {st.name[0]}
                          </div>
                        )}
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{st.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{st.role}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Date & Slot Picker + Customer Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Step 3: Date & Available Slots */}
            <div className="card" style={{ padding: '24px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: brandColor,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  3
                </div>
                <h3 style={{ fontSize: '1.2rem' }}>Chọn Ngày & Giờ Còn Trống</h3>
              </div>

              {/* Date Input */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Ngày Hẹn</label>
                <input
                  type="date"
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              {/* Slots */}
              <div>
                <label className="form-label" style={{ marginBottom: '8px' }}>
                  Khung Giờ Trống {selectedService && `(${selectedService.durationMinutes} phút)`}:
                </label>

                {!selectedService ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    Vui lòng chọn dịch vụ ở Bước 1 để tính khung giờ trống chính xác.
                  </p>
                ) : slotsLoading ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Đang kiểm tra lịch trống...</p>
                ) : slotsMessage ? (
                  <div style={{ padding: '12px', background: 'var(--warning-bg)', color: 'var(--warning)', borderRadius: '10px', fontSize: '0.85rem' }}>
                    {slotsMessage}
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Ngày này đã kín lịch hẹn. Vui lòng chọn ngày khác.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot.time)}
                        style={{
                          padding: '8px 6px',
                          borderRadius: '10px',
                          border: selectedSlot === slot.time
                            ? `2px solid ${brandColor}`
                            : '1px solid var(--border)',
                          backgroundColor: selectedSlot === slot.time
                            ? brandColor
                            : slot.available
                            ? '#FFFFFF'
                            : '#F1F5F9',
                          color: selectedSlot === slot.time
                            ? '#FFFFFF'
                            : slot.available
                            ? 'var(--text-main)'
                            : '#94A3B8',
                          fontWeight: selectedSlot === slot.time ? 700 : 500,
                          fontSize: '0.85rem',
                          cursor: slot.available ? 'pointer' : 'not-allowed',
                          opacity: slot.available ? 1 : 0.5
                        }}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step 4: Customer Details & Submit */}
            <div className="card" style={{ padding: '24px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: brandColor,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  4
                </div>
                <h3 style={{ fontSize: '1.2rem' }}>Thông Tin Của Bạn</h3>
              </div>

              {bookingError && (
                <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '14px' }}>
                  {bookingError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Họ & Tên *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Nguyễn Phương Anh"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số Điện Thoại Nhận Xác Nhận *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="0901 234 567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ghi Chú Hoặc Mẫu Móng Mong Muốn</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Thích màu sơn hồng thạch, form móng hạnh nhân..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                />
              </div>

              {/* Booking Summary Box */}
              {selectedService && selectedSlot && (
                <div style={{
                  background: 'var(--bg-subtle)',
                  padding: '14px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  fontSize: '0.88rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Dịch vụ:</span>
                    <strong>{selectedService.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Thời gian:</span>
                    <strong>{selectedSlot} - Ngày {selectedDate}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: brandColor, fontWeight: 800, fontSize: '1rem', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border)' }}>
                    <span>Tổng tiền:</span>
                    <span>{Number(selectedService.price).toLocaleString()}đ</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '1rem',
                  background: brandColor
                }}
              >
                {bookingLoading ? 'Đang gửi yêu cầu đặt lịch...' : 'Xác Nhận Đặt Lịch Ngay 💅'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Booking Confirmation Receipt Modal */}
      {confirmedBooking && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="card animate-fade-in" style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            padding: '36px 28px',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Check size={32} />
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Đặt Lịch Thành Công!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Cảm ơn <strong>{confirmedBooking.customerName}</strong>! Tiệm đã nhận được yêu cầu và sẽ liên hệ sớm để xác nhận.
            </p>

            {/* Receipt Box */}
            <div style={{
              background: 'var(--bg-subtle)',
              padding: '20px',
              borderRadius: '16px',
              textAlign: 'left',
              fontSize: '0.88rem',
              marginBottom: '24px',
              border: '1.5px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mã lịch hẹn:</span>
                <span className="badge badge-trial" style={{ fontWeight: 800 }}>{confirmedBooking.code}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Dịch vụ:</span>
                <strong>{confirmedBooking.serviceName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Thời gian hẹn:</span>
                <strong>
                  {new Date(confirmedBooking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' - '}
                  {new Date(confirmedBooking.startTime).toLocaleDateString('vi-VN')}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tiệm:</span>
                <strong>{confirmedBooking.salonName}</strong>
              </div>
              {confirmedBooking.salonAddress && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Địa chỉ:</span>
                  <span style={{ textAlign: 'right', maxWidth: '60%' }}>{confirmedBooking.salonAddress}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border)', color: brandColor, fontWeight: 800, fontSize: '1rem' }}>
                <span>Tổng chi phí:</span>
                <span>{Number(confirmedBooking.totalPrice).toLocaleString()}đ</span>
              </div>
            </div>

            <button
              onClick={() => {
                setConfirmedBooking(null);
                setSelectedService(null);
                setSelectedSlot('');
              }}
              className="btn btn-primary"
              style={{ width: '100%', background: brandColor }}
            >
              Hoàn Tất & Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
