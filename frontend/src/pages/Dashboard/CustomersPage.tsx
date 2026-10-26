import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { UserCheck, Search, Phone, Calendar, Heart, Shield } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.getCustomers(search);
      setCustomers(res.customers || []);
    } catch (err) {
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Hồ Sơ Khách Hàng</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Danh bạ khách hàng, số lần ghé tiệm và tổng chi tiêu làm móng
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '12px', padding: '8px 14px', width: '280px' }}>
          <Search size={16} color="var(--text-light)" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Đang tải danh sách khách hàng...
          </div>
        ) : customers.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {search ? 'Không tìm thấy khách hàng nào theo từ khóa.' : 'Chưa có khách hàng nào. Khách đặt lịch qua website sẽ tự động lưu hồ sơ tại đây.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <th style={{ padding: '12px 18px' }}>KHÁCH HÀNG</th>
                  <th style={{ padding: '12px 18px' }}>SỐ ĐIỆN THOẠI</th>
                  <th style={{ padding: '12px 18px' }}>EMAIL</th>
                  <th style={{ padding: '12px 18px' }}>SỐ LẦN ĐẾN TIỆM</th>
                  <th style={{ padding: '12px 18px' }}>TỔNG CHI TIÊU</th>
                  <th style={{ padding: '12px 18px' }}>GHI CHÚ / SỞ THÍCH</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          {c.name[0]}
                        </div>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <a href={`tel:${c.phone}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>
                        {c.phone}
                      </a>
                    </td>

                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                      {c.email || '—'}
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge badge-trial">
                        {c.totalVisits} lần
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--primary)' }}>
                      {Number(c.totalSpent).toLocaleString()}đ
                    </td>

                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {c.notes || 'Khách thích sơn thạch, nhẹ nhàng'}
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
