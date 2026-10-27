import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Store,
  Palette,
  Clock,
  Sparkles,
  Users,
  Eye,
  Rocket,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  QrCode,
  Wand2,
  AlertCircle
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { TEMPLATE_THEMES } from '../../config/templates';

export const OnboardingWizard: React.FC = () => {
  const { activeTenant, updateActiveTenant } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('Đã đồng bộ');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Step 1: Info
  const [salonName, setSalonName] = useState('');
  const [slug, setSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [slugStatus, setSlugStatus] = useState<{ available: boolean; message?: string } | null>(null);

  // Step 2: Branding & Templates
  const [templateTheme, setTemplateTheme] = useState('BLUSH_KOREA');
  const [brandColor, setBrandColor] = useState('#D46B84');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bookingPolicy, setBookingPolicy] = useState('Quý khách vui lòng đến trước 10 phút. Nếu có việc bận xin vui lòng báo trước ít nhất 2 giờ.');

  // Step 3: Working Hours (0=Sun, 1=Mon, ..., 6=Sat)
  const [workingHours, setWorkingHours] = useState<any[]>([
    { dayOfWeek: 1, isOpen: true, openTime: '09:00', closeTime: '20:30' },
    { dayOfWeek: 2, isOpen: true, openTime: '09:00', closeTime: '20:30' },
    { dayOfWeek: 3, isOpen: true, openTime: '09:00', closeTime: '20:30' },
    { dayOfWeek: 4, isOpen: true, openTime: '09:00', closeTime: '20:30' },
    { dayOfWeek: 5, isOpen: true, openTime: '09:00', closeTime: '20:30' },
    { dayOfWeek: 6, isOpen: true, openTime: '09:00', closeTime: '20:30' },
    { dayOfWeek: 0, isOpen: true, openTime: '09:00', closeTime: '19:00' }
  ]);

  // Step 4: Services
  const [services, setServices] = useState<any[]>([
    { name: 'Sơn Gel Hàn Quốc Cao Cấp', category: 'Sơn Gel', durationMinutes: 45, price: 160000, description: 'Sơn gel bền màu, bóng đẹp 3-4 tuần' },
    { name: 'Đắp Gel Nối Móng Tự Nhiên', category: 'Đắp Móng', durationMinutes: 75, price: 320000, description: 'Nối form móng thanh lịch, bảo vệ móng thật' }
  ]);

  // Step 5: Staff (Optional)
  const [staff, setStaff] = useState<any[]>([]);

  // Step 7: Published website details
  const [publishedSlug, setPublishedSlug] = useState('');

  // Days mapping in Vietnamese
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  // Preset Colors for Quick Selection
  const colorPresets = [
    { name: 'Hồng Pastel (Mặc định)', color: '#D46B84' },
    { name: 'Rượu Vang Đỏ (Wine)', color: '#9B2226' },
    { name: 'Vàng Kim Sang Trọng (Gold)', color: '#C5A059' },
    { name: 'Xanh Ngọc Emerald (Sage)', color: '#2A9D8F' },
    { name: 'Tím Oải Hương (Lavender)', color: '#7E57C2' },
    { name: 'Đen Huyền Bí & Vàng', color: '#1E293B' }
  ];

  // Load existing draft from server upon mount
  useEffect(() => {
    async function loadDraft() {
      try {
        const res = await api.getOnboardingDraft();
        if (res.tenant) {
          setSalonName(res.tenant.name || '');
          setSlug(res.tenant.slug || '');
          setPhone(res.tenant.phone || '');
          setAddress(res.tenant.address || '');
          setDescription(res.tenant.description || '');
          setPublishedSlug(res.tenant.slug || '');
        }

        if (res.settings) {
          if (res.settings.brandColor) setBrandColor(res.settings.brandColor);
          if (res.settings.templateTheme) setTemplateTheme(res.settings.templateTheme);
          if (res.settings.logoUrl) setLogoUrl(res.settings.logoUrl);
          if (res.settings.bannerUrl) setBannerUrl(res.settings.bannerUrl);
          if (res.settings.bookingPolicy) setBookingPolicy(res.settings.bookingPolicy);
        }

        if (res.workingHours && res.workingHours.length > 0) {
          setWorkingHours(res.workingHours);
        }

        if (res.services && res.services.length > 0) {
          setServices(res.services);
        }

        if (res.staff && res.staff.length > 0) {
          setStaff(res.staff);
        }

        // Restore current step if draft exists and was not finished
        if (res.currentStep && res.currentStep >= 1 && res.currentStep <= 7) {
          setCurrentStep(res.currentStep);
        }
      } catch (err: any) {
        console.error('Error loading onboarding draft:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDraft();
  }, []);

  // Check slug availability when slug changes
  const checkSlug = async (candidate: string) => {
    if (!candidate || candidate.length < 3) return;
    try {
      const res = await api.checkSlugAvailability(candidate);
      setSlugStatus(res);
    } catch (e) {
      setSlugStatus(null);
    }
  };

  // Autosave when user moves to next step
  const saveStepData = async (stepNumber: number) => {
    setSaving(true);
    setSaveStatus('Đang lưu...');
    try {
      let data: any = {};
      if (stepNumber === 1) {
        data = { name: salonName, slug, phone, address, description };
      } else if (stepNumber === 2) {
        data = { brandColor, templateTheme, logoUrl, bannerUrl, bookingPolicy };
      } else if (stepNumber === 3) {
        data = { workingHours };
      } else if (stepNumber === 4) {
        data = { services };
      } else if (stepNumber === 5) {
        data = { staff };
      }

      await api.saveOnboardingStep(stepNumber, data);
      setSaveStatus('Đã tự động lưu');
      if (activeTenant && (salonName !== activeTenant.name || slug !== activeTenant.slug)) {
        updateActiveTenant({ name: salonName, slug });
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi lưu thông tin');
      setSaveStatus('Lỗi lưu');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    setError('');

    // Step validations
    if (currentStep === 1) {
      if (!salonName.trim()) {
        setError('Vui lòng nhập tên tiệm nail của bạn.');
        return;
      }
      if (!slug.trim()) {
        setError('Vui lòng nhập đường link (slug) cho website tiệm.');
        return;
      }
    }

    if (currentStep === 4) {
      if (services.length === 0) {
        setError('Vui lòng thêm ít nhất 1 dịch vụ để khách có thể đặt lịch.');
        return;
      }
    }

    await saveStepData(currentStep);

    if (currentStep === 6) {
      // Publish step
      try {
        setSaving(true);
        const pubRes = await api.publishWebsite();
        setPublishedSlug(pubRes.slug);
        updateActiveTenant({ isPublished: true, slug: pubRes.slug });
        setCurrentStep(7);
      } catch (err: any) {
        setError(err.message || 'Lỗi xuất bản website.');
      } finally {
        setSaving(false);
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // 1-Click apply sample preset
  const handleApplyPreset = async () => {
    try {
      setSaving(true);
      const res = await api.applySampleTemplate();
      if (res.preset) {
        setBrandColor(res.preset.themeColor);
        setBookingPolicy(res.preset.bookingPolicy);
        setWorkingHours(res.preset.workingHours);
        setServices(res.preset.services);
      }
      setSaveStatus('Đã áp dụng mẫu chuẩn!');
      alert('Đã áp dụng mẫu dịch vụ, bảng giá & giờ mở cửa chuẩn thành công! Bạn có thể chỉnh sửa lại bất cứ lúc nào.');
    } catch (err: any) {
      setError(err.message || 'Lỗi áp dụng mẫu');
    } finally {
      setSaving(false);
    }
  };

  // Add / remove service
  const addService = () => {
    setServices([
      ...services,
      { name: '', category: 'Dịch vụ chính', durationMinutes: 45, price: 150000, description: '' }
    ]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateServiceField = (index: number, field: string, val: any) => {
    const updated = [...services];
    updated[index][field] = val;
    setServices(updated);
  };

  // Add / remove staff
  const addStaff = () => {
    setStaff([
      ...staff,
      { name: '', role: 'Chuyên viên Nail', phone: '' }
    ]);
  };

  const removeStaff = (index: number) => {
    setStaff(staff.filter((_, i) => i !== index));
  };

  const updateStaffField = (index: number, field: string, val: any) => {
    const updated = [...staff];
    updated[index][field] = val;
    setStaff(updated);
  };

  // Working hour update
  const toggleDayOpen = (dayIndex: number) => {
    setWorkingHours(workingHours.map((h) => (h.dayOfWeek === dayIndex ? { ...h, isOpen: !h.isOpen } : h)));
  };

  const updateHourField = (dayIndex: number, field: 'openTime' | 'closeTime', val: string) => {
    setWorkingHours(workingHours.map((h) => (h.dayOfWeek === dayIndex ? { ...h, [field]: val } : h)));
  };

  const stepsList = [
    { num: 1, title: 'Thông tin tiệm', icon: Store },
    { num: 2, title: 'Thương hiệu & Màu', icon: Palette },
    { num: 3, title: 'Giờ mở cửa', icon: Clock },
    { num: 4, title: 'Dịch vụ & Bảng giá', icon: Sparkles },
    { num: 5, title: 'Nhân viên (Tùy chọn)', icon: Users },
    { num: 6, title: 'Kiểm tra website', icon: Eye },
    { num: 7, title: 'Xuất bản', icon: Rocket }
  ];

  const publicUrl = `${window.location.origin}/s/${slug || publishedSlug}`;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Đang tải thiết lập tiệm...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid var(--border)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>💅</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            NailVibe Wizard
          </span>
          <span className="badge badge-trial" style={{ marginLeft: '4px' }}>
            Thiết Lập 5 Phút
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {saveStatus}
          </span>
          <button
            onClick={handleApplyPreset}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
            title="Tự động điền dịch vụ và giờ làm việc chuẩn cho tiệm nail"
          >
            <Wand2 size={15} /> Áp Dụng Dữ Liệu Mẫu Chuẩn
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary btn-sm"
          >
            Vào Dashboard
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '32px auto 0', padding: '0 20px' }}>
        {/* Stepper Progress Indicator */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            marginBottom: '12px'
          }}>
            {stepsList.map((s) => {
              const Icon = s.icon;
              const isPast = s.num < currentStep;
              const isCurrent = s.num === currentStep;

              return (
                <div
                  key={s.num}
                  onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: s.num < currentStep ? 'pointer' : 'default',
                    zIndex: 2,
                    flex: 1
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    background: isPast
                      ? 'var(--success)'
                      : isCurrent
                      ? 'var(--primary)'
                      : '#FFFFFF',
                    color: isPast || isCurrent ? '#FFFFFF' : 'var(--text-muted)',
                    border: isPast || isCurrent ? 'none' : '2px solid var(--border)',
                    boxShadow: isCurrent ? '0 0 0 4px var(--primary-light)' : 'none',
                    transition: 'all 0.2s ease'
                  }}>
                    {isPast ? <Check size={18} /> : <Icon size={18} />}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? 'var(--primary)' : 'var(--text-muted)',
                    marginTop: '6px',
                    textAlign: 'center'
                  }}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar line */}
          <div style={{
            height: '4px',
            background: 'var(--border)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%`,
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--success) 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            border: '1px solid #FECACA',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Step Content Card */}
        <div className="card animate-fade-in" style={{ padding: '36px', borderRadius: '24px' }}>
          {/* STEP 1: Salon Information */}
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span className="badge badge-trial" style={{ marginBottom: '6px' }}>Bước 1 trên 7</span>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Thông Tin Cơ Bản Về Tiệm Nail</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Thông tin này sẽ hiển thị ở đầu website đặt lịch để khách hàng dễ dàng liên hệ và tìm đường đến tiệm.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Tên Tiệm Nail <span style={{ color: 'var(--primary)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Luna Nail Studio"
                  value={salonName}
                  onChange={(e) => {
                    setSalonName(e.target.value);
                    if (!slug) {
                      const auto = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                      setSlug(auto);
                      checkSlug(auto);
                    }
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Đường Dẫn Đặt Lịch (Slug Website) <span style={{ color: 'var(--primary)' }}>*</span></label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    padding: '11px 14px',
                    background: 'var(--bg-subtle)',
                    border: '1.5px solid var(--border)',
                    borderRight: 'none',
                    borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem'
                  }}>
                    nailvibe.vn/s/
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                    placeholder="luna-nail"
                    value={slug}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setSlug(clean);
                      checkSlug(clean);
                    }}
                    required
                  />
                </div>
                {slugStatus && (
                  <div style={{
                    fontSize: '0.8rem',
                    marginTop: '6px',
                    color: slugStatus.available ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {slugStatus.message}
                  </div>
                )}
                <small style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>
                  Đường dẫn ngắn gọn, không dấu tiếng Việt. Khách sẽ truy cập link này để đặt lịch.
                </small>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Hotline / Số Điện Thoại Tiệm</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="0901 234 567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Địa Chỉ Tiệm</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="142 Nguyễn Trãi, Q.1, TP.HCM"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Lời Giới Thiệu Ngắn (Không bắt buộc)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Tiệm nail chuyên phong cách Hàn Quốc, sơn gel xịn, phòng máy lạnh thoải mái..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Branding & Colors */}
          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span className="badge badge-trial" style={{ marginBottom: '6px' }}>Bước 2 trên 7</span>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Chọn Phong Cách Template & Thương Hiệu</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Chọn một mẫu giao diện phù hợp với gu thẩm mỹ của tiệm. Mọi màu sắc và chi tiết sẽ tự động biến đổi!
                </p>
              </div>

              {/* Template Themes Selector */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <label className="form-label" style={{ fontSize: '0.95rem', margin: 0 }}>
                    Chọn Phong Cách Mẫu Website (Templates):
                  </label>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Bao gồm 5 mẫu bố cục riêng biệt cho từng gu thẩm mỹ
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px'
                }}>
                  {Object.values(TEMPLATE_THEMES).map((theme) => {
                    const isSelected = templateTheme === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => {
                          setTemplateTheme(theme.id);
                          setBrandColor(theme.primaryColor);
                        }}
                        style={{
                          border: isSelected ? `2.5px solid ${theme.primaryColor}` : '1.5px solid var(--border)',
                          borderRadius: '18px',
                          overflow: 'hidden',
                          background: theme.isDark ? '#0F172A' : '#FFFFFF',
                          color: theme.isDark ? '#F8FAFC' : 'var(--text-main)',
                          cursor: 'pointer',
                          position: 'relative',
                          boxShadow: isSelected ? `0 10px 30px -4px ${theme.primaryColor}50` : 'var(--shadow-sm)',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          display: 'flex',
                          flexDirection: 'column',
                          transform: isSelected ? 'translateY(-3px)' : 'none'
                        }}
                      >
                        {/* Mini Banner Preview */}
                        <div style={{
                          height: '95px',
                          backgroundImage: `url(${theme.bannerPlaceholder})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: theme.isDark
                              ? 'linear-gradient(180deg, rgba(11,15,25,0.4) 0%, rgba(15,23,42,0.95) 100%)'
                              : 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.9) 100%)'
                          }} />
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            display: 'flex',
                            gap: '6px'
                          }}>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: theme.primaryColor,
                              color: theme.isDark ? '#0B0F19' : '#FFFFFF'
                            }}>
                              {theme.badge}
                            </span>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: 'rgba(0,0,0,0.5)',
                              color: '#FFFFFF'
                            }}>
                              {theme.previewTag}
                            </span>
                          </div>

                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: theme.primaryColor,
                            border: isSelected ? '2px solid #FFF' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFF',
                            fontSize: '12px',
                            fontWeight: 800
                          }}>
                            {isSelected ? '✓' : ''}
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <h4 style={{ fontSize: '1.02rem', fontWeight: 800, marginBottom: '2px', color: theme.isDark ? '#FFF' : 'var(--text-main)' }}>
                              {theme.name}
                            </h4>
                            <div style={{ fontSize: '0.78rem', color: theme.primaryColor, fontWeight: 700, marginBottom: '8px' }}>
                              {theme.subtitle}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: theme.isDark ? '#94A3B8' : 'var(--text-muted)', lineHeight: 1.45, marginBottom: '12px' }}>
                              {theme.description}
                            </p>

                            {/* Feature Bullets */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                              {theme.features?.map((f, idx) => (
                                <div key={idx} style={{ fontSize: '0.75rem', color: theme.isDark ? '#CBD5E1' : '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ color: theme.primaryColor, fontWeight: 800 }}>•</span>
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div style={{
                            paddingTop: '10px',
                            borderTop: `1px solid ${theme.isDark ? '#334155' : 'var(--border)'}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: theme.primaryColor }} />
                              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: theme.bgColor, border: '1px solid #CBD5E1' }} />
                              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: theme.cardBg, border: '1px solid #CBD5E1' }} />
                            </div>
                            <span style={{
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              color: isSelected ? theme.primaryColor : 'var(--text-muted)'
                            }}>
                              {isSelected ? '✓ Đang áp dụng' : 'Bấm để chọn mẫu'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Color Customization */}
              <div className="form-group">
                <label className="form-label">Tùy Chỉnh Thêm Màu Chủ Đạo (Tùy chọn)</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {colorPresets.map((preset) => (
                    <button
                      type="button"
                      key={preset.color}
                      onClick={() => setBrandColor(preset.color)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: brandColor === preset.color ? `2px solid ${preset.color}` : '1.5px solid var(--border)',
                        background: brandColor === preset.color ? 'var(--primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: preset.color }} />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    style={{ width: '48px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '140px' }}
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                  />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Mã màu HEX tùy chọn</span>
                </div>
              </div>

              {/* Logo & Banner URLs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Link Ảnh Logo Tiệm (Tùy chọn)</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Có thể dán link ảnh logo hoặc cập nhật sau trong Dashboard.</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Link Ảnh Bìa / Banner Tiệm (Tùy chọn)</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Ảnh không gian tiệm hoặc mẫu móng đẹp.</small>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Chính Sách & Lưu Ý Đặt Lịch</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={bookingPolicy}
                  onChange={(e) => setBookingPolicy(e.target.value)}
                  placeholder="Vui lòng đến đúng giờ trước 10 phút..."
                />
              </div>
            </div>
          )}

          {/* STEP 3: Working Hours */}
          {currentStep === 3 && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span className="badge badge-trial" style={{ marginBottom: '6px' }}>Bước 3 trên 7</span>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Cài Đặt Giờ Mở Cửa Hàng Ngày</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Hệ thống dựa vào giờ mở cửa để chỉ nhận lịch trong thời gian tiệm hoạt động.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {workingHours.map((h) => {
                  const dayLabel = dayNames[h.dayOfWeek];
                  return (
                    <div
                      key={h.dayOfWeek}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: h.isOpen ? '#FFFFFF' : 'var(--bg-subtle)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '160px' }}>
                        <input
                          type="checkbox"
                          checked={h.isOpen}
                          onChange={() => toggleDayOpen(h.dayOfWeek)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 600, color: h.isOpen ? 'var(--text-main)' : 'var(--text-light)' }}>
                          {dayLabel}
                        </span>
                      </div>

                      {h.isOpen ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mở:</span>
                          <input
                            type="time"
                            className="form-input"
                            style={{ width: '110px', padding: '6px 10px', fontSize: '0.88rem' }}
                            value={h.openTime}
                            onChange={(e) => updateHourField(h.dayOfWeek, 'openTime', e.target.value)}
                          />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Đến:</span>
                          <input
                            type="time"
                            className="form-input"
                            style={{ width: '110px', padding: '6px 10px', fontSize: '0.88rem' }}
                            value={h.closeTime}
                            onChange={(e) => updateHourField(h.dayOfWeek, 'closeTime', e.target.value)}
                          />
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                          Nghỉ (Đóng cửa)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Services & Prices */}
          {currentStep === 4 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <span className="badge badge-trial" style={{ marginBottom: '6px' }}>Bước 4 trên 7</span>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Danh Sách Dịch Vụ & Bảng Giá</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Nhập các dịch vụ làm móng của tiệm để khách hàng chọn khi đặt lịch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addService}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={16} /> Thêm Dịch Vụ
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {services.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      background: '#FFFFFF',
                      display: 'grid',
                      gridTemplateColumns: '2fr 1.2fr 1fr 1.2fr auto',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Tên dịch vụ</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="VD: Sơn gel Hàn Quốc"
                        value={s.name}
                        onChange={(e) => updateServiceField(idx, 'name', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Danh mục</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Sơn Gel"
                        value={s.category}
                        onChange={(e) => updateServiceField(idx, 'category', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Thời lượng (phút)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={s.durationMinutes}
                        onChange={(e) => updateServiceField(idx, 'durationMinutes', Number(e.target.value))}
                        min={15}
                        step={15}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Giá (VNĐ)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={s.price}
                        onChange={(e) => updateServiceField(idx, 'price', Number(e.target.value))}
                        step={10000}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        padding: '8px',
                        marginTop: '16px'
                      }}
                      title="Xóa dịch vụ"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Staff (Optional) */}
          {currentStep === 5 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <span className="badge badge-trial" style={{ marginBottom: '6px' }}>Bước 5 trên 7</span>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Thợ Làm Móng / Nhân Viên (Không bắt buộc)</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Nếu bạn làm một mình, có thể bỏ qua bước này. Khách sẽ tự động đặt lịch với tiệm.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addStaff}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={16} /> Thêm Thợ Móng
                </button>
              </div>

              {staff.length === 0 ? (
                <div style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: 'var(--bg-subtle)',
                  borderRadius: '16px',
                  border: '1px dashed var(--border)'
                }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '14px' }}>
                    Hiện tại chưa có nhân viên nào. Tiệm sẽ hoạt động ở chế độ <strong>"Chủ tiệm tự phục vụ"</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={addStaff}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={15} /> Thêm Thợ Làm Móng Đầu Tiên
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {staff.map((st, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        background: '#FFFFFF',
                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr 1fr auto',
                        gap: '12px',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Tên thợ</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="VD: Thu Thảo"
                          value={st.name}
                          onChange={(e) => updateStaffField(idx, 'name', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Chức danh / Tay nghề</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Chuyên viên Nail Art"
                          value={st.role}
                          onChange={(e) => updateStaffField(idx, 'role', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SĐT</label>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder="090..."
                          value={st.phone || ''}
                          onChange={(e) => updateStaffField(idx, 'phone', e.target.value)}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeStaff(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          padding: '8px',
                          marginTop: '16px'
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Interactive Live Preview */}
          {currentStep === 6 && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span className="badge badge-trial" style={{ marginBottom: '6px' }}>Bước 6 trên 7</span>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Kiểm Tra & Xem Trước Website</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Đây là giao diện khách hàng sẽ thấy khi bấm vào link tiệm của bạn. Hãy kiểm tra các thông tin đã chuẩn chưa.
                </p>
              </div>

              {/* Theme-Aware Live Preview Card */}
              {(() => {
                const currentTheme = TEMPLATE_THEMES[templateTheme] || TEMPLATE_THEMES.BLUSH_KOREA;
                const isDarkTheme = currentTheme.isDark;
                return (
                  <div style={{
                    border: isDarkTheme ? '2px solid rgba(212, 175, 55, 0.4)' : '2px solid var(--border)',
                    borderRadius: currentTheme.cardBorderRadius || '20px',
                    overflow: 'hidden',
                    background: currentTheme.cardBg,
                    color: currentTheme.textColor,
                    boxShadow: isDarkTheme ? '0 16px 40px rgba(0, 0, 0, 0.6)' : 'var(--shadow-md)',
                    transition: 'all 0.3s ease'
                  }}>
                    {/* Header Mockup */}
                    <div style={{
                      padding: '30px 28px',
                      background: isDarkTheme
                        ? 'linear-gradient(135deg, #151C2C 0%, #0B0F19 100%)'
                        : currentTheme.layoutType === 'salon-landing'
                        ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
                        : `linear-gradient(135deg, ${brandColor} 0%, #1E293B 100%)`,
                      color: '#FFFFFF',
                      borderBottom: isDarkTheme ? '1px solid rgba(212, 175, 55, 0.3)' : 'none'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          background: isDarkTheme ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255,255,255,0.25)',
                          color: isDarkTheme ? '#F3D279' : '#FFFFFF',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontWeight: 800,
                          letterSpacing: '0.5px'
                        }}>
                          {currentTheme.name}
                        </span>
                        <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>● Xem Trước Giao Diện Khách Thấy</span>
                      </div>
                      <h3 style={{
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: '#FFF',
                        fontFamily: isDarkTheme ? "'Playfair Display', Georgia, serif" : 'inherit'
                      }}>
                        {salonName || 'Tiệm Nail Của Bạn'}
                      </h3>
                      <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>
                        📍 {address || 'Chưa cập nhật địa chỉ'} | 📞 {phone || 'Chưa có SĐT'}
                      </p>
                    </div>

                    {/* Body Summary */}
                    <div style={{ padding: '24px', backgroundColor: currentTheme.bgColor }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: currentTheme.textColor }}>
                        Dịch vụ mẫu nổi bật ({services.length}):
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                        {services.slice(0, 3).map((s, i) => (
                          <div key={i} style={{
                            padding: '14px',
                            background: currentTheme.cardBg,
                            borderRadius: '14px',
                            border: isDarkTheme ? '1px solid rgba(212, 175, 55, 0.25)' : '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)'
                          }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: currentTheme.textColor }}>{s.name}</div>
                            <div style={{ color: brandColor, fontWeight: 800, fontSize: '0.92rem', marginTop: '4px' }}>
                              {Number(s.price).toLocaleString()}đ <span style={{ fontSize: '0.75rem', color: currentTheme.textMuted, fontWeight: 500 }}>({s.durationMinutes}p)</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {bookingPolicy && (
                        <div style={{
                          background: currentTheme.cardBg,
                          border: isDarkTheme ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid var(--border)',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          color: currentTheme.textColor
                        }}>
                          <strong>Chính sách đặt lịch:</strong> {bookingPolicy}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* STEP 7: Website Published Success! */}
          {currentStep === 7 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Check size={36} />
              </div>

              <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
                🎉 Website Đặt Lịch Đã Được Xuất Bản!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 28px' }}>
                Khách hàng giờ đây đã có thể truy cập đường link hoặc quét mã QR dưới đây để đặt lịch trực tuyến với tiệm bạn.
              </p>

              {/* QR Code Container */}
              <div style={{
                background: '#FFFFFF',
                padding: '24px',
                borderRadius: '20px',
                display: 'inline-block',
                border: '2px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '24px'
              }}>
                <QRCodeCanvas
                  value={publicUrl}
                  size={190}
                  level="H"
                  fgColor={brandColor}
                  bgColor="#FFFFFF"
                />
                <div style={{ marginTop: '10px', fontWeight: 700, fontSize: '0.9rem' }}>{salonName}</div>
              </div>

              {/* Public Link Box */}
              <div style={{
                maxWidth: '480px',
                margin: '0 auto 28px',
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-subtle)',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid var(--border)'
              }}>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' }}>
                  {publicUrl}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(publicUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="btn btn-sm"
                  style={{
                    background: copied ? 'var(--success)' : 'var(--primary)',
                    color: '#FFF',
                    border: 'none',
                    marginLeft: '8px'
                  }}
                >
                  <Copy size={14} /> {copied ? 'Đã sao chép' : 'Sao chép link'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <a
                  href={`/s/${publishedSlug || slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <ExternalLink size={16} /> Mở Thử Website
                </a>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-primary"
                >
                  Vào Bảng Điều Khiển Quản Lý <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Actions Bar (Steps 1 to 6) */}
          {currentStep < 7 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '36px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border)'
            }}>
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1 || saving}
                className="btn btn-secondary"
              >
                <ChevronLeft size={16} /> Quay Lại
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={saving}
                className="btn btn-primary"
                style={{ minWidth: '160px' }}
              >
                {saving
                  ? 'Đang lưu...'
                  : currentStep === 6
                  ? 'Xuất Bản Website Ngay 🚀'
                  : 'Tiếp Tục'}
                {currentStep !== 6 && <ChevronRight size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
