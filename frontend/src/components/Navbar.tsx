import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { QRCodeModal } from './QRCodeModal';
import { ExternalLink, QrCode, LogOut, ChevronDown, Store } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, activeTenant, tenants, switchTenant, logout } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);

  return (
    <>
      <header style={{
        height: '68px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Brand & Active Salon Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontSize: '24px' }}>💅</span>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--primary) 0%, #8E2943 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              NailVibe
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '6px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              textTransform: 'uppercase'
            }}>
              SaaS
            </span>
          </a>

          {/* Salon Switcher */}
          {activeTenant && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowTenantMenu(!showTenantMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <Store size={15} color="var(--primary)" />
                <span>{activeTenant.name}</span>
                {tenants.length > 1 && <ChevronDown size={14} color="var(--text-muted)" />}
              </button>

              {showTenantMenu && tenants.length > 1 && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '220px',
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '6px',
                  zIndex: 100
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', padding: '6px 10px' }}>
                    DANH SÁCH TIỆM
                  </div>
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        switchTenant(t);
                        setShowTenantMenu(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        background: t.id === activeTenant.id ? 'var(--primary-light)' : 'none',
                        color: t.id === activeTenant.id ? 'var(--primary)' : 'var(--text-main)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: t.id === activeTenant.id ? 700 : 500
                      }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side quick actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {activeTenant && (
            <>
              {/* QR Code button */}
              <button
                onClick={() => setShowQR(true)}
                className="btn btn-secondary btn-sm"
                title="Mã QR tiệm nail"
              >
                <QrCode size={15} />
                <span>Mã QR Tiệm</span>
              </button>

              {/* View Public Page button */}
              <a
                href={`/s/${activeTenant.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                <ExternalLink size={15} />
                <span>Trang Đặt Lịch</span>
              </a>
            </>
          )}

          {/* User profile dropdown / logout */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '8px', borderLeft: '1px solid var(--border)', paddingLeft: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.fullName}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
              </div>

              <button
                onClick={logout}
                title="Đăng xuất"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* QR Code Modal */}
      {activeTenant && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          salonName={activeTenant.name}
          slug={activeTenant.slug}
        />
      )}
    </>
  );
};
