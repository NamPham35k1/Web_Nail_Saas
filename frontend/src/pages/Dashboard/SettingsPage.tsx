import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { QRCodeModal } from '../../components/QRCodeModal';
import {
  Store,
  Palette,
  Clock,
  Globe,
  AlertTriangle,
  Check,
  Copy,
  QrCode,
  ExternalLink,
  Save,
  CheckCircle2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { activeTenant, updateActiveTenant } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'branding' | 'hours' | 'slug'>('profile');

  // Form State: Profile
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  // Form State: Branding
  const [brandColor, setBrandColor] = useState('#D46B84');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bookingPolicy, setBookingPolicy] = useState('');

  // Form State: Slug
  const [slug, setSlug] = useState('');
  const [slugWarning, setSlugWarning] = useState<string | null>(null);

  // Form State: Working Hours
  const [workingHours, setWorkingHours] = useState<any[]>([]);

  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  const colorPresets = [
    { name: 'Hồng Nude Pastel', color: '#D46B84' },
    { name: 'Rượu Vang Đỏ', color: '#9B2226' },
    { name: 'Vàng Kim Quý Phái', color: '#C5A059' },
    { name: 'Xanh Ngọc Emerald', color: '#2A9D8F' },
    { name: 'Tím Lavender', color: '#7E57C2' },
    { name: 'Đen Sang Trọng', color: '#1E293B' }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getCurrentTenant();
      const t = res.tenant;
      if (t) {
        setName(t.name || '');
        setPhone(t.phone || '');
        setEmail(t.email || '');
        setAddress(t.address || '');
        setDescription(t.description || '');
        setSlug(t.slug || '');

        if (t.settings) {
          setBrandColor(t.settings.brandColor || '#D46B84');
          setLogoUrl(t.settings.logoUrl || '');
          setBannerUrl(t.settings.bannerUrl || '');
          setBookingPolicy(t.settings.bookingPolicy || '');
        }

        if (t.workingHours) {
          setWorkingHours(t.workingHours);
        }
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTenant?.id]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await api.updateProfile({ name, phone, email, address, description });
      updateActiveTenant({ name });
      setMessage('Đã cập nhật thông tin tiệm thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Lỗi cập nhật thông tin tiệm');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await api.updateSettings({ brandColor, logoUrl, bannerUrl, bookingPolicy });
      setMessage('Đã cập nhật thương hiệu & giao diện website thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Lỗi cập nhật thương hiệu');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSlug = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    setSlugWarning(null);

    try {
      const res = await api.updateSlug(slug);
      updateActiveTenant({ slug: res.newSlug });
      setSlug(res.newSlug);
      setMessage(res.message);
      if (res.warning) {
        setSlugWarning(res.warning);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi thay đổi slug');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHours = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await api.updateWorkingHours(workingHours);
      setMessage('Đã cập nhật giờ mở cửa thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Lỗi cập nhật giờ mở cửa');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      const res = await api.togglePublish();
      updateActiveTenant({ isPublished: res.isPublished });
      alert(res.message);
    } catch (err: any) {
      alert(err.message || 'Lỗi thay đổi trạng thái');
    }
  };

  const publicUrl = `${window.location.origin}/s/${slug}`;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Đang tải cài đặt...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Cài Đặt Tiệm & Website</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Cấu hình không cần lập trình: đổi tên, màu sắc, ảnh bìa, giờ mở cửa và link website
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleTogglePublish}
            className={`btn ${activeTenant?.isPublished ? 'btn-secondary' : 'btn-primary'}`}
          >
            {activeTenant?.isPublished ? 'Tạm Dừng Nhận Lịch' : 'Xuất Bản Website Ngay'}
          </button>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <ExternalLink size={15} /> Xem Website Tiệm
          </a>
        </div>
      </div>

      {message && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid #A7F3D0', padding: '12px 16px', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid #FECACA', padding: '12px 16px', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        {[
          { key: 'profile', label: 'Thông Tin Tiệm', icon: Store },
          { key: 'branding', label: 'Giao Diện & Thương Hiệu', icon: Palette },
          { key: 'slug', label: 'Tên Miền & Link Website', icon: Globe },
          { key: 'hours', label: 'Giờ Mở Cửa', icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
                setError('');
                setMessage('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Thông Tin Cơ Bản Của Tiệm</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Thông tin này hiển thị ở đầu trang đặt lịch và hóa đơn xác nhận của khách.
          </p>

          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label">Tên Tiệm Nail *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Số Điện Thoại Tiệm</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Tiệm</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Địa Chỉ Tiệm</label>
              <input
                type="text"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô Tả Tiệm / Slogan</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '12px' }}>
              <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Branding Settings */}
      {activeTab === 'branding' && (
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Màu Sắc & Logo Thương Hiệu</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Tùy biến phong cách trang đặt lịch công khai của tiệm theo nhận diện thương hiệu riêng.
          </p>

          <form onSubmit={handleSaveBranding}>
            <div className="form-group">
              <label className="form-label">Màu Chủ Đạo</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {colorPresets.map((p) => (
                  <button
                    key={p.color}
                    type="button"
                    onClick={() => setBrandColor(p.color)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '999px',
                      border: brandColor === p.color ? `2px solid ${p.color}` : '1.5px solid var(--border)',
                      background: brandColor === p.color ? 'var(--primary-light)' : '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: p.color }} />
                    <span>{p.name}</span>
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
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Link Ảnh Logo (Tùy chọn)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Link Ảnh Bìa / Banner Tiệm</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Chính Sách & Lưu Ý Khi Đặt Lịch</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={bookingPolicy}
                onChange={(e) => setBookingPolicy(e.target.value)}
              />
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '12px' }}>
              <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu Cài Đặt Giao Diện'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Slug Management & Old-Link Warning */}
      {activeTab === 'slug' && (
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Đường Dẫn Đặt Lịch (Slug URL)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Khách hàng sẽ sử dụng liên kết này để truy cập website và đặt lịch làm móng với tiệm bạn.
          </p>

          {/* Current URL & Copy Box */}
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1.5px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                ĐƯỜNG LINK CÔNG KHAI HIỆN TẠI:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                {publicUrl}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="btn btn-secondary btn-sm"
              >
                {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="btn btn-secondary btn-sm"
              >
                <QrCode size={14} /> Mã QR
              </button>
            </div>
          </div>

          {/* Warning banner if slug changed */}
          {slugWarning && (
            <div style={{
              background: 'var(--warning-bg)',
              color: '#B45309',
              border: '1px solid #FDE68A',
              padding: '14px 18px',
              borderRadius: '14px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '24px'
            }}>
              <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Cảnh báo thay đổi đường dẫn:</strong> {slugWarning}
              </div>
            </div>
          )}

          <form onSubmit={handleSaveSlug}>
            <div className="form-group">
              <label className="form-label">Thay Đổi Đường Dẫn (Slug Mới)</label>
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
                  {window.location.origin}/s/
                </span>
                <input
                  type="text"
                  className="form-input"
                  style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  required
                />
              </div>
              <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '6px', display: 'block' }}>
                Chỉ cho phép chữ thường (a-z), số (0-9) và dấu gạch nối (-). Không chứa dấu tiếng Việt hay khoảng trắng.
              </small>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '12px' }}>
              <Save size={16} /> {saving ? 'Đang kiểm tra & lưu...' : 'Cập Nhật Đường Dẫn'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Working Hours */}
      {activeTab === 'hours' && (
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Cài Đặt Lịch Làm Việc & Giờ Mở Cửa</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Hệ thống sẽ chỉ cho phép khách đặt lịch trong khoảng thời gian tiệm mở cửa.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {workingHours.map((h) => {
              const dayLabel = dayNames[h.dayOfWeek];
              return (
                <div
                  key={h.dayOfWeek}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    background: h.isOpen ? '#FFFFFF' : 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '160px' }}>
                    <input
                      type="checkbox"
                      checked={h.isOpen}
                      onChange={() => {
                        setWorkingHours(workingHours.map((item) => (item.dayOfWeek === h.dayOfWeek ? { ...item, isOpen: !item.isOpen } : item)));
                      }}
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
                        onChange={(e) => {
                          setWorkingHours(workingHours.map((item) => (item.dayOfWeek === h.dayOfWeek ? { ...item, openTime: e.target.value } : item)));
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Đóng:</span>
                      <input
                        type="time"
                        className="form-input"
                        style={{ width: '110px', padding: '6px 10px', fontSize: '0.88rem' }}
                        value={h.closeTime}
                        onChange={(e) => {
                          setWorkingHours(workingHours.map((item) => (item.dayOfWeek === h.dayOfWeek ? { ...item, closeTime: e.target.value } : item)));
                        }}
                      />
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                      Đóng cửa (Ngày nghỉ)
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <button onClick={handleSaveHours} disabled={saving} className="btn btn-primary">
            <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu Giờ Mở Cửa'}
          </button>
        </div>
      )}

      {/* QR Code Modal */}
      {activeTenant && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          salonName={name || activeTenant.name}
          slug={slug || activeTenant.slug}
          brandColor={brandColor}
        />
      )}
    </div>
  );
};
