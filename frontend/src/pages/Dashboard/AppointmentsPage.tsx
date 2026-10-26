import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Check,
  Search,
  Filter,
  Trash2,
  User,
  Phone,
  Sparkles
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      const res = await api.getAppointments(params);
      setAppointments(res.appointments || []);
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [statusFilter, dateFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateAppointmentStatus(id, newStatus);
      await loadAppointments();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật trạng thái');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này không?')) {
      try {
        await api.deleteAppointment(id);
        await loadAppointments();
      } catch (err: any) {
        alert(err.message || 'Lỗi xóa lịch hẹn');
      }
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.customerName?.toLowerCase().includes(q) ||
      a.customerPhone?.toLowerCase().includes(q) ||
      a.appointmentCode?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Quản Lý Lịch Hẹn</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Theo dõi, xác nhận và cập nhật trạng thái lịch hẹn khách đặt
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="date"
            className="form-input"
            style={{ width: '160px', padding: '8px 12px', fontSize: '0.85rem' }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="btn btn-secondary btn-sm"
            >
              Hôm nay / Tất cả
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs & Search */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'ALL', label: 'Tất Cả' },
            { key: 'PENDING', label: 'Chờ Xác Nhận' },
            { key: 'CONFIRMED', label: 'Đã Xác Nhận' },
            { key: 'COMPLETED', label: 'Đã Hoàn Thành' },
            { key: 'CANCELLED', label: 'Đã Hủy' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: statusFilter === tab.key ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: statusFilter === tab.key ? 'var(--primary-light)' : '#FFFFFF',
                color: statusFilter === tab.key ? 'var(--primary)' : 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: statusFilter === tab.key ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-subtle)', borderRadius: '10px', padding: '6px 12px', width: '260px' }}>
          <Search size={16} color="var(--text-light)" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, mã..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Đang tải danh sách lịch hẹn...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Không tìm thấy lịch hẹn nào theo điều kiện lọc này.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <th style={{ padding: '12px 18px' }}>MÃ / NGÀY GIỜ</th>
                  <th style={{ padding: '12px 18px' }}>KHÁCH HÀNG</th>
                  <th style={{ padding: '12px 18px' }}>DỊCH VỤ & GIÁ</th>
                  <th style={{ padding: '12px 18px' }}>THỢ PHỤC VỤ</th>
                  <th style={{ padding: '12px 18px' }}>GHI CHÚ</th>
                  <th style={{ padding: '12px 18px' }}>TRẠNG THÁI</th>
                  <th style={{ padding: '12px 18px', textAlign: 'right' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {new Date(a.startTime).toLocaleDateString('vi-VN')}
                      </div>
                      <span className="badge badge-trial" style={{ marginTop: '4px', fontSize: '0.72rem' }}>
                        {a.appointmentCode}
                      </span>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 600 }}>{a.customerName}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} /> {a.customerPhone}
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 600 }}>{a.service?.name}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>
                        {Number(a.totalPrice).toLocaleString()}đ
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      {a.staff ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px' }}>💅</span>
                          <span>{a.staff.name}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                          Bất kỳ ai
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '16px 18px', maxWidth: '180px' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.notes || '—'}
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <span className={`badge ${
                        a.status === 'CONFIRMED'
                          ? 'badge-confirmed'
                          : a.status === 'PENDING'
                          ? 'badge-pending'
                          : a.status === 'COMPLETED'
                          ? 'badge-completed'
                          : 'badge-cancelled'
                      }`}>
                        {a.status === 'CONFIRMED'
                          ? 'Đã xác nhận'
                          : a.status === 'PENDING'
                          ? 'Chờ duyệt'
                          : a.status === 'COMPLETED'
                          ? 'Hoàn thành'
                          : 'Đã hủy'}
                      </span>
                    </td>

                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {a.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusChange(a.id, 'CONFIRMED')}
                            className="btn btn-sm"
                            style={{ background: 'var(--success)', color: '#FFF', border: 'none', padding: '4px 10px', fontSize: '0.8rem' }}
                            title="Xác nhận lịch hẹn"
                          >
                            <Check size={14} /> Duyệt
                          </button>
                        )}

                        {a.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusChange(a.id, 'COMPLETED')}
                            className="btn btn-sm"
                            style={{ background: '#3B82F6', color: '#FFF', border: 'none', padding: '4px 10px', fontSize: '0.8rem' }}
                            title="Đã làm xong"
                          >
                            Xong
                          </button>
                        )}

                        {a.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleStatusChange(a.id, 'CANCELLED')}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', color: 'var(--danger)' }}
                            title="Hủy lịch"
                          >
                            <XCircle size={14} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(a.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', color: 'var(--text-light)' }}
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
