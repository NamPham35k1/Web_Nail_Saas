import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { QRCodeModal } from '../../components/QRCodeModal';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Share2,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone,
  User,
  ArrowUpRight
} from 'lucide-react';

export const Overview: React.FC = () => {
  const { activeTenant } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Manual appointment modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualServiceId, setManualServiceId] = useState('');
  const [manualStaffId, setManualStaffId] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualTime, setManualTime] = useState('10:00');
  const [manualNotes, setManualNotes] = useState('');
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualError, setManualError] = useState('');

  const loadData = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Load services & staff for manual booking dropdown
    api.getServices().then((res) => {
      setServicesList(res.services || []);
      if (res.services && res.services.length > 0) {
        setManualServiceId(res.services[0].id);
      }
    });
    api.getStaff().then((res) => setStaffList(res.staff || []));
  }, [activeTenant?.id]);

  const origin = window.location.origin;
  const publicUrl = `${origin}/s/${activeTenant?.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Đặt lịch tại ${activeTenant?.name}`,
          text: `Đặt lịch làm móng trực tuyến tiện lợi tại ${activeTenant?.name}:`,
          url: publicUrl
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');
    setManualSubmitting(true);
    try {
      const startTime = `${manualDate}T${manualTime}:00`;
      await api.createAppointment({
        customerName: manualName,
        customerPhone: manualPhone,
        serviceId: manualServiceId,
        staffId: manualStaffId || null,
        startTime,
        notes: manualNotes,
        status: 'CONFIRMED'
      });
      setShowManualModal(false);
      setManualName('');
      setManualPhone('');
      setManualNotes('');
      await loadData();
    } catch (err: any) {
      setManualError(err.message || 'Lỗi thêm lịch hẹn');
    } finally {
      setManualSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Đang tải bảng điều khiển...</p>
      </div>
    );
  }

  const metrics = stats?.metrics || {
    todayAppointmentsCount: 0,
    pendingAppointmentsCount: 0,
    confirmedAppointmentsCount: 0,
    completedAppointmentsCount: 0
  };

  const nextAppt = stats?.nextAppointment;
  const checklist = stats?.checklist;
  const todayList = stats?.todayAppointments || [];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome & Top Quick Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: '#FFFFFF',
        padding: '24px 28px',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', marginBottom: '4px' }}>
            Xin chào, {activeTenant?.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Dưới đây là tình hình lịch hẹn hôm nay của tiệm bạn.
          </p>
        </div>

        {/* Quick Buttons: Manual booking, Share, Copy, QR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowManualModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} /> Thêm Lịch Hẹn Thủ Công
          </button>

          <button
            onClick={handleCopyLink}
            className="btn btn-secondary"
            title="Sao chép link đặt lịch"
          >
            {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
            <span>{copied ? 'Đã sao chép' : 'Sao Chép Link'}</span>
          </button>

          <button
            onClick={handleShare}
            className="btn btn-secondary"
            title="Chia sẻ link tiệm"
          >
            <Share2 size={16} />
            <span>Chia Sẻ</span>
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="btn btn-secondary"
            title="Mã QR tiệm nail"
          >
            <QrCode size={16} />
            <span>Mã QR Tiệm</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px'
      }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Lịch hẹn hôm nay</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {metrics.todayAppointmentsCount}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Khách đã lên lịch trong ngày</span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--warning)' }}>Chờ xác nhận</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>
            {metrics.pendingAppointmentsCount}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cần tiệm gọi hoặc bấm xác nhận</span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)' }}>Đã xác nhận</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
            {metrics.confirmedAppointmentsCount}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sắp tới lượt phục vụ</span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3B82F6' }}>Đã hoàn thành</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6' }}>
            {metrics.completedAppointmentsCount}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Khách đã làm móng xong</span>
        </div>
      </div>

      {/* 2 Columns: Next Appointment Card & Checklist "Hoàn thiện tiệm của bạn" */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* Next Appointment Card */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Lịch Hẹn Tiếp Theo</h3>
            <span className="badge badge-trial">Sắp diễn ra</span>
          </div>

          {nextAppt ? (
            <div style={{
              background: 'linear-gradient(135deg, #FFF0F3 0%, #FFFFFF 100%)',
              border: '1.5px solid rgba(212, 107, 132, 0.25)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {new Date(nextAppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(nextAppt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(nextAppt.startTime).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                </div>
                <span className={`badge ${nextAppt.status === 'CONFIRMED' ? 'badge-confirmed' : 'badge-pending'}`}>
                  {nextAppt.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đang chờ xác nhận'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="var(--primary)" />
                  <strong>{nextAppt.customerName}</strong> ({nextAppt.customerPhone})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--primary)" />
                  <span>Dịch vụ: <strong>{nextAppt.service?.name}</strong> ({Number(nextAppt.totalPrice).toLocaleString()}đ)</span>
                </div>
                {nextAppt.staff && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>💅</span>
                    <span>Thợ móng: <strong>{nextAppt.staff.name}</strong></span>
                  </div>
                )}
                {nextAppt.notes && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', background: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    "{nextAppt.notes}"
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`tel:${nextAppt.customerPhone}`}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Phone size={14} /> Gọi Điện
                </a>
                <a
                  href="/dashboard/appointments"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  Xem Tất Cả Lịch
                </a>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-subtle)',
              borderRadius: '16px',
              color: 'var(--text-muted)'
            }}>
              <Calendar size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.92rem' }}>Hiện chưa có lịch hẹn sắp tới nào.</p>
              <button
                onClick={() => setShowManualModal(true)}
                className="btn btn-outline btn-sm"
                style={{ marginTop: '12px' }}
              >
                + Thêm Lịch Khách Gọi / Đến Trực Tiếp
              </button>
            </div>
          )}
        </div>

        {/* Checklist: "Hoàn thiện tiệm của bạn" */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Hoàn Thiện Tiệm Của Bạn</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Checklist sẵn sàng nhận lịch 100%</p>
            </div>
            <span style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: checklist?.percent === 100 ? 'var(--success)' : 'var(--primary)'
            }}>
              {checklist?.percent || 0}%
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: '6px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden', marginBottom: '18px' }}>
            <div style={{
              height: '100%',
              width: `${checklist?.percent || 0}%`,
              background: checklist?.percent === 100 ? 'var(--success)' : 'var(--primary)',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Checklist Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {checklist?.items?.map((item: any) => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: item.completed ? 'var(--success-bg)' : 'var(--bg-subtle)',
                  borderRadius: '10px',
                  fontSize: '0.88rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: item.completed ? 'var(--success)' : '#CBD5E1',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.completed ? <Check size={13} /> : null}
                  </div>
                  <div>
                    <span style={{ fontWeight: item.completed ? 600 : 500, color: item.completed ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {item.label}
                    </span>
                    {item.note && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: '6px' }}>
                        ({item.note})
                      </span>
                    )}
                  </div>
                </div>

                {!item.completed && (
                  <a
                    href="/onboarding"
                    style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Thiết lập ngay →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Appointments List */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Lịch Hẹn Hôm Nay ({todayList.length})</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Các khách hàng đã đặt lịch làm móng trong ngày</p>
          </div>
          <a href="/dashboard/appointments" className="btn btn-secondary btn-sm">
            Xem Toàn Bộ Lịch <ArrowUpRight size={14} />
          </a>
        </div>

        {todayList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Hôm nay chưa có lịch hẹn nào. Hãy chia sẻ link đặt lịch của bạn lên Facebook hoặc Zalo để đón khách!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>MÃ / GIỜ</th>
                  <th style={{ padding: '10px 12px' }}>KHÁCH HÀNG</th>
                  <th style={{ padding: '10px 12px' }}>DỊCH VỤ</th>
                  <th style={{ padding: '10px 12px' }}>THỢ MÓNG</th>
                  <th style={{ padding: '10px 12px' }}>TỔNG TIỀN</th>
                  <th style={{ padding: '10px 12px' }}>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {todayList.map((a: any) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.appointmentCode}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600 }}>{a.customerName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.customerPhone}</div>
                    </td>
                    <td style={{ padding: '12px' }}>{a.service?.name}</td>
                    <td style={{ padding: '12px' }}>{a.staff?.name || 'Chưa chỉ định'}</td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{Number(a.totalPrice).toLocaleString()}đ</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${a.status === 'CONFIRMED' ? 'badge-confirmed' : a.status === 'PENDING' ? 'badge-pending' : 'badge-completed'}`}>
                        {a.status === 'CONFIRMED' ? 'Đã xác nhận' : a.status === 'PENDING' ? 'Chờ duyệt' : a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Booking Modal */}
      {showManualModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="card animate-fade-in" style={{
            maxWidth: '520px',
            width: '100%',
            borderRadius: '24px',
            padding: '32px'
          }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>Thêm Lịch Hẹn Thủ Công</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Dành cho khách gọi điện thoại hoặc ghé tiệm trực tiếp (Walk-in).
            </p>

            {manualError && (
              <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '14px' }}>
                {manualError}
              </div>
            )}

            <form onSubmit={handleCreateManualBooking}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Tên Khách Hàng *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Chị Phương Anh"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số Điện Thoại *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="090..."
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dịch Vụ Chọn *</label>
                <select
                  className="form-select"
                  value={manualServiceId}
                  onChange={(e) => setManualServiceId(e.target.value)}
                  required
                >
                  {servicesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {Number(s.price).toLocaleString()}đ ({s.durationMinutes}p)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Thợ Làm Móng (Tùy chọn)</label>
                <select
                  className="form-select"
                  value={manualStaffId}
                  onChange={(e) => setManualStaffId(e.target.value)}
                >
                  <option value="">-- Bất kỳ ai / Tiệm tự sắp xếp --</option>
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Ngày Hẹn *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Giờ Hẹn *</label>
                  <input
                    type="time"
                    className="form-input"
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Ghi Chú</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Khách thích màu sơn nude..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={manualSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {manualSubmitting ? 'Đang tạo...' : 'Lưu Lịch Hẹn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {activeTenant && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          salonName={activeTenant.name}
          slug={activeTenant.slug}
          brandColor={stats?.salon?.brandColor || '#D46B84'}
        />
      )}
    </div>
  );
};
