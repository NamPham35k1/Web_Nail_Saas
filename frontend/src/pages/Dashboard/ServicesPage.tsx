import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Plus, Edit2, Trash2, Sparkles, Clock, Check, X } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal add/edit
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Sơn Gel');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [price, setPrice] = useState(150000);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await api.getServices();
      setServices(res.services || []);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setCategory('Sơn Gel');
    setDurationMinutes(45);
    setPrice(150000);
    setDescription('');
    setError('');
    setShowModal(true);
  };

  const openEditModal = (s: any) => {
    setEditingId(s.id);
    setName(s.name);
    setCategory(s.category);
    setDurationMinutes(s.durationMinutes);
    setPrice(s.price);
    setDescription(s.description || '');
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingId) {
        await api.updateService(editingId, {
          name,
          category,
          durationMinutes: Number(durationMinutes),
          price: Number(price),
          description
        });
      } else {
        await api.createService({
          name,
          category,
          durationMinutes: Number(durationMinutes),
          price: Number(price),
          description
        });
      }
      setShowModal(false);
      await loadServices();
    } catch (err: any) {
      setError(err.message || 'Lỗi lưu dịch vụ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa dịch vụ này không?')) {
      try {
        await api.deleteService(id);
        await loadServices();
      } catch (err: any) {
        alert(err.message || 'Lỗi xóa dịch vụ');
      }
    }
  };

  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Dịch Vụ & Bảng Giá Tiệm</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Quản lý menu làm móng, thời lượng thực hiện và giá công khai trên website đặt lịch
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={16} /> Thêm Dịch Vụ Mới
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Đang tải bảng giá dịch vụ...
        </div>
      ) : services.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <Sparkles size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h3>Chưa có dịch vụ nào</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Hãy thêm các dịch vụ của tiệm (sơn gel, đắp bột...) để khách có thể chọn đặt lịch.
          </p>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} /> Thêm Dịch Vụ Đầu Tiên
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {categories.map((cat) => {
            const catServices = services.filter((s) => s.category === cat);
            return (
              <div key={cat} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '18px' }}>💅</span>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>{cat}</h3>
                  <span className="badge badge-trial">{catServices.length} dịch vụ</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '16px'
                }}>
                  {catServices.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        border: '1.5px solid var(--border)',
                        borderRadius: '16px',
                        padding: '18px',
                        background: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{s.name}</h4>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                            {Number(s.price).toLocaleString()}đ
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          <Clock size={14} /> Thời lượng: <strong>{s.durationMinutes} phút</strong>
                        </div>

                        {s.description && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                            {s.description}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                        <button
                          onClick={() => openEditModal(s)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        >
                          <Edit2 size={13} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
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
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
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
          <div className="card animate-fade-in" style={{ maxWidth: '500px', width: '100%', borderRadius: '24px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>
              {editingId ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Điền thông tin và giá tiền để hiển thị trên website đặt lịch.
            </p>

            {error && (
              <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '14px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên Dịch Vụ *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Sơn Gel Hàn Quốc Cao Cấp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Danh Mục</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Sơn Gel, Đắp Bột, Móng Úp, Nail Art, Spa Móng..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Thời Lượng (Phút) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    min={15}
                    step={15}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Giá (VNĐ) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    step={10000}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mô Tả Chi Tiết (Tùy chọn)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Bao gồm cắt da, dưỡng OPI, sơn 2 lớp gel và phủ bóng..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
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
                  {submitting ? 'Đang lưu...' : 'Lưu Dịch Vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
