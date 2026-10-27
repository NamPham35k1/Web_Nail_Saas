import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Palette,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  Smartphone,
  Crown,
  Leaf,
  Camera,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { TEMPLATE_THEMES, type TemplateTheme } from '../../config/templates';

export const TemplatesPage: React.FC = () => {
  const { activeTenant, updateActiveTenant } = useAuth();
  const [currentThemeId, setCurrentThemeId] = useState<string>('BLUSH_KOREA');
  const [loading, setLoading] = useState<boolean>(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    async function loadTenantData() {
      try {
        const res = await api.getCurrentTenant();
        if (res.tenant?.settings?.templateTheme) {
          setCurrentThemeId(res.tenant.settings.templateTheme);
        }
      } catch (err: any) {
        console.error('Lỗi tải cài đặt:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTenantData();
  }, [activeTenant?.id]);

  const handleActivateTheme = async (theme: TemplateTheme) => {
    setActivating(theme.id);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await api.updateSettings({
        templateTheme: theme.id,
        brandColor: theme.primaryColor
      });

      setCurrentThemeId(theme.id);
      setSuccessMessage(`Đã kích hoạt thành công mẫu "${theme.name}" cho website tiệm của bạn!`);

      if (updateActiveTenant && activeTenant) {
        updateActiveTenant({
          ...activeTenant,
          settings: {
            ...activeTenant.settings,
            templateTheme: theme.id,
            brandColor: theme.primaryColor
          }
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi kích hoạt mẫu giao diện.');
    } finally {
      setActivating(null);
    }
  };

  const getThemeIcon = (layoutType: string) => {
    switch (layoutType) {
      case 'salon-landing':
        return <Layers size={18} />;
      case 'mini-app-stepper':
        return <Smartphone size={18} />;
      case 'luxury-noir':
        return <Crown size={18} />;
      case 'split-spa':
        return <Leaf size={18} />;
      case 'editorial-lookbook':
        return <Camera size={18} />;
      default:
        return <Sparkles size={18} />;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Đang tải danh sách mẫu website...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        color: '#FFFFFF',
        padding: '36px 32px',
        borderRadius: '24px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(212, 107, 132, 0.25)',
            border: '1px solid rgba(212, 107, 132, 0.4)',
            color: '#FFB3C6',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            marginBottom: '12px'
          }}>
            <Palette size={14} /> KHO MẪU WEBSITE NAILVIBE THEME STORE
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
            Chọn Mẫu Giao Diện Website Tiệm Của Bạn
          </h1>
          <p style={{ fontSize: '0.94rem', color: '#94A3B8', lineHeight: 1.6 }}>
            NailVibe cung cấp <strong>5 mẫu website hoàn chỉnh</strong> với kiến trúc bố cục, phong cách thị giác và trải nghiệm đặt lịch hoàn toàn khác biệt. Bạn có thể đổi mẫu bất cứ lúc nào với 1 click!
          </p>
        </div>

        {activeTenant?.slug && (
          <a
            href={`/s/${activeTenant.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #D46B84 0%, #C05570 100%)',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '14px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(212, 107, 132, 0.4)'
            }}
          >
            <Eye size={16} /> Xem Website Của Tiệm <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Notifications */}
      {successMessage && (
        <div style={{
          background: 'var(--success-bg)',
          color: 'var(--success)',
          border: '1px solid #A7F3D0',
          padding: '14px 18px',
          borderRadius: '14px',
          fontSize: '0.92rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{
          background: 'var(--danger-bg)',
          color: 'var(--danger)',
          border: '1px solid #FECACA',
          padding: '14px 18px',
          borderRadius: '14px',
          fontSize: '0.92rem',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          {errorMessage}
        </div>
      )}

      {/* Template Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {Object.values(TEMPLATE_THEMES).map((theme) => {
          const isActive = currentThemeId === theme.id;
          const isActivatingThis = activating === theme.id;

          return (
            <div
              key={theme.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: isActive ? `2.5px solid ${theme.primaryColor}` : '1.5px solid var(--border)',
                overflow: 'hidden',
                boxShadow: isActive ? `0 12px 36px ${theme.primaryColor}30` : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                {/* Visual Header Mockup */}
                <div style={{
                  height: '160px',
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
                      : 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.95) 100%)'
                  }} />

                  {/* Top Badges */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '14px',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: theme.primaryColor,
                      color: theme.isDark ? '#0B0F19' : '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      {theme.badge}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#FFFFFF',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {theme.category}
                    </span>
                  </div>

                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '14px',
                      background: 'var(--success)',
                      color: '#FFFFFF',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 8px rgba(16,185,129,0.4)'
                    }}>
                      <Check size={14} /> ĐANG SỬ DỤNG
                    </div>
                  )}

                  {/* Layout Tag inside Banner */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: theme.primaryColor,
                      color: theme.isDark ? '#0B0F19' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      {getThemeIcon(theme.layoutType)}
                    </span>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      color: theme.isDark ? '#FFF' : '#1E293B',
                      textShadow: theme.isDark ? '0 1px 4px rgba(0,0,0,0.8)' : 'none'
                    }}>
                      {theme.previewTag}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div style={{ padding: '24px 24px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      {theme.name}
                    </h3>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: theme.primaryColor, fontWeight: 700, marginBottom: '10px' }}>
                    {theme.subtitle}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {theme.description}
                  </p>

                  {/* Layout Architecture Highlights */}
                  <div style={{
                    padding: '10px 14px',
                    background: 'var(--bg-subtle)',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    marginBottom: '16px',
                    border: '1px solid var(--border)'
                  }}>
                    📐 <strong>Kiến trúc:</strong> {theme.layoutHighlight}
                  </div>

                  {/* Feature Highlights */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {theme.features.map((feature, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-main)' }}>
                        <span style={{ color: theme.primaryColor, fontWeight: 800 }}>✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                padding: '16px 24px 24px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '12px'
              }}>
                <button
                  type="button"
                  disabled={isActive || isActivatingThis}
                  onClick={() => handleActivateTheme(theme)}
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '14px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: isActive ? 'default' : 'pointer',
                    background: isActive
                      ? '#E2E8F0'
                      : `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryColor}E6 100%)`,
                    color: isActive ? '#64748B' : (theme.isDark ? '#0B0F19' : '#FFFFFF'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: isActive ? 'none' : `0 4px 14px ${theme.primaryColor}40`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isActivatingThis ? (
                    'Đang kích hoạt...'
                  ) : isActive ? (
                    <>
                      <Check size={16} /> Giao Diện Đang Dùng
                    </>
                  ) : (
                    <>
                      <span>Kích Hoạt Mẫu Này</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                {activeTenant?.slug && (
                  <a
                    href={`/s/${activeTenant.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--border)',
                      background: '#FFFFFF',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <Eye size={15} /> Xem Web
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
