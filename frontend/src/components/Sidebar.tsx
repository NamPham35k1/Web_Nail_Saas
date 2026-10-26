import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Sparkles, Users, UserCheck, Settings, Wand2, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { activeTenant } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Tổng Quan', icon: LayoutDashboard, end: true },
    { to: '/dashboard/appointments', label: 'Quản Lý Lịch Hẹn', icon: Calendar },
    { to: '/dashboard/services', label: 'Dịch Vụ & Bảng Giá', icon: Sparkles },
    { to: '/dashboard/staff', label: 'Đội Ngũ Nhân Viên', icon: Users },
    { to: '/dashboard/customers', label: 'Hồ Sơ Khách Hàng', icon: UserCheck },
    { to: '/dashboard/settings', label: 'Cài Đặt Thương Hiệu', icon: Settings },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 'calc(100vh - 68px)',
      padding: '24px 16px'
    }}>
      <div>
        {/* Navigation list */}
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', padding: '0 12px 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Menu Quản Trị
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  transition: 'all 0.15s ease'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo & Help Box */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <NavLink
          to="/onboarding"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-subtle)',
            color: 'var(--primary-dark)',
            textDecoration: 'none',
            fontSize: '0.86rem',
            fontWeight: 600,
            border: '1px dashed var(--primary)'
          }}
        >
          <Wand2 size={16} color="var(--primary)" />
          <span>Mở Lại Wizard Cài Đặt</span>
        </NavLink>

        {activeTenant && (
          <div style={{
            background: 'linear-gradient(135deg, #FFF0F3 0%, #FFFFFF 100%)',
            border: '1px solid rgba(212, 107, 132, 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
              <Globe size={14} /> Website Tiệm
            </div>
            <div style={{ color: 'var(--text-muted)', marginBottom: '8px', wordBreak: 'break-all' }}>
              /s/{activeTenant.slug}
            </div>
            <span className={`badge ${activeTenant.isPublished ? 'badge-confirmed' : 'badge-pending'}`}>
              {activeTenant.isPublished ? '● Đang hoạt động' : '○ Chưa xuất bản'}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
