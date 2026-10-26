import React, { useState } from 'react';
import { Sparkles, X, Check, ShieldCheck } from 'lucide-react';

interface PlanBannerProps {
  plan?: string;
  planName?: string;
  trialRemainingDays?: number | null;
}

export const PlanBanner: React.FC<PlanBannerProps> = ({
  plan = 'TRIAL',
  trialRemainingDays
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isTrial = plan === 'TRIAL';

  return (
    <>
      {isTrial && (
        <div style={{
          background: 'linear-gradient(90deg, #FFF0F3 0%, #FFE4E8 100%)',
          borderBottom: '1px solid rgba(212, 107, 132, 0.2)',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.86rem',
          color: 'var(--primary-dark)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <Sparkles size={16} color="var(--primary)" />
            <span>
              Bạn đang sử dụng <strong>Gói Dùng Thử Miễn Phí</strong>
              {trialRemainingDays !== null && trialRemainingDays !== undefined && (
                <> (Còn <strong>{trialRemainingDays} ngày</strong>)</>
              )}
              . Toàn bộ tính năng tạo website và nhận lịch đặt online đã sẵn sàng!
            </span>
          </div>

          <button
            onClick={() => setShowUpgradeModal(true)}
            className="btn btn-sm"
            style={{
              background: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '999px',
              padding: '4px 14px'
            }}
          >
            Xem các gói dịch vụ
          </button>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
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
            maxWidth: '750px',
            width: '100%',
            position: 'relative',
            borderRadius: '24px',
            padding: '36px 32px'
          }}>
            <button
              onClick={() => setShowUpgradeModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span className="badge badge-trial" style={{ marginBottom: '10px' }}>Bảng Giá & Gói Dịch Vụ</span>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Nâng Tầm Tiệm Nail Với NailVibe</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Chọn gói phù hợp với quy mô tiệm của bạn. Cam kết không khóa dữ liệu bất ngờ!
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {/* Basic Plan */}
              <div style={{
                border: '1.5px solid var(--border)',
                borderRadius: '18px',
                padding: '24px',
                background: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Gói Cơ Bản (Basic)</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Dành cho tiệm 1-5 thợ móng</p>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
                    199.000đ <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/tháng</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--success)" /> Tối đa 5 nhân viên làm móng</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--success)" /> Tối đa 30 dịch vụ & bảng giá</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--success)" /> Tùy chỉnh màu sắc & banner thương hiệu</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--success)" /> Mã QR đặt lịch riêng</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    alert('Chức năng liên hệ kích hoạt gói Basic đã được ghi nhận. Quản trị viên NailVibe sẽ hỗ trợ bạn.');
                    setShowUpgradeModal(false);
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: '24px' }}
                >
                  Chọn Gói Basic
                </button>
              </div>

              {/* Pro Plan */}
              <div style={{
                border: '2px solid var(--primary)',
                borderRadius: '18px',
                padding: '24px',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8FA 100%)',
                position: 'relative',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '24px',
                  background: 'var(--primary)',
                  color: '#FFFFFF',
                  padding: '2px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  PHỔ BIẾN NHẤT
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '4px', color: 'var(--primary-dark)' }}>Gói Chuyên Nghiệp (Pro)</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Dành cho tiệm đông khách & chuỗi</p>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px' }}>
                    499.000đ <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/tháng</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--success)" /> Không giới hạn nhân viên</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--success)" /> Không giới hạn dịch vụ</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--success)" /> Báo cáo doanh thu & khách quen</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--success)" /> Hỗ trợ cấu hình tên miền riêng (.vn / .com)</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={16} color="var(--primary)" /> Hỗ trợ kỹ thuật 24/7</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    alert('Chức năng liên hệ nâng cấp gói Pro đã được ghi nhận. Quản trị viên NailVibe sẽ hỗ trợ bạn.');
                    setShowUpgradeModal(false);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '24px' }}
                >
                  Nâng Cấp Gói Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
