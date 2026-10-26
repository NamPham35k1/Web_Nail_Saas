import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Plus, Edit2, Trash2, Users, Phone, Mail, Sparkles } from 'lucide-react';

export const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Chuyên viên Nail');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await api.getStaff();
      setStaff(res.staff || []);
    } catch (err) {
      console.error('Error loading staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setRole('Chuyên viên Nail');
    setPhone('');
    setEmail('');
    setAvatarUrl('');
    setError('');
    setShowModal(true);
  };

  const openEditModal = (st: any) => {
    setEditingId(st.id);
    setName(st.name);
    setRole(st.role);
    setPhone(st.phone || '');
    setEmail(st.email || '');
    setAvatarUrl(st.avatarUrl || '');
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingId) {
        await api.updateStaff(editingId, { name, role, phone, email, avatarUrl });
      } else {
        await api.createStaff({ name, role, phone, email, avatarUrl });
      }
      setShowModal(false);
      await loadStaff();
    } catch (err: any) {
      setError(err.message || 'Lỗi lưu nhân viên');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này không?')) {
      try {
        await api.deleteStaff(id);
        await loadStaff();
      } catch (err: any) {
        alert(err.message || 'Lỗi xóa nhân viên');
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Đội Ngũ Thợ Làm Móng</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Quản lý danh sách chuyên viên để khách hàng chọn thợ khi đặt lịch
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={16} /> Thêm Thợ Móng Mới
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Đang tải danh sách nhân viên...
        </div>
      ) : staff.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <Users size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h3>Chưa có nhân viên nào</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Nếu bạn làm một mình, hệ thống sẽ tự động để khách đặt lịch với tiệm mà không cần chọn thợ.
          </p>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} /> Thêm Thợ Móng Đầu Tiên
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {staff.map((st) => (
            <div
              key={st.id}
              className="card"
              style={{
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  {st.avatarUrl ? (
                    <img
                      src={st.avatarUrl}
                      alt={st.name}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }}
                    />
                  ) : (
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.2rem'
                    }}>
                      {st.name[0]}
                    </div>
                  )}

                  <div>
                    <h3 style={{ fontSize: '1.15rem' }}>{st.name}</h3>
                    <span className="badge badge-trial">{st.role}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  {st.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} /> {st.phone}
                    </div>
                  )}
                  {st.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} /> {st.email}
                    </div>
                  )}
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '4px' }}>
                    Tổng số lịch phục vụ: {st._count?.appointments || 0}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => openEditModal(st)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                >
                  <Edit2 size={13} /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(st.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 8px', color: 'var(--danger)' }}
                  title="Xóa"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {showModal && (
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
          <div className="card animate-fade-in" style={{ maxWidth: '480px', width: '100%', borderRadius: '24px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>
              {editingId ? 'Chỉnh Sửa Thông Tin Thợ' : 'Thêm Thợ Làm Móng'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Tên và tay nghề sẽ hiển thị để khách hàng chọn khi đặt lịch.
            </p>

            {error && (
              <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '14px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên Thợ Làm Móng *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Thu Thảo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Chức Danh / Chuyên Môn</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Master Nail & Vẽ Hoa Nổi, Chuyên Viên Đắp Bột..."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Số Điện Thoại</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="090..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Link Ảnh Đại Diện (Tùy chọn)</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {submitting ? 'Đang lưu...' : 'Lưu Thợ Móng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
