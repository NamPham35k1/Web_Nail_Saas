import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Copy, Check, Download, ExternalLink } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  salonName: string;
  slug: string;
  brandColor?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  salonName,
  slug,
  brandColor = '#D46B84'
}) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const origin = window.location.origin;
  const publicUrl = `${origin}/s/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode-${slug}.png`;
      a.click();
    }
  };

  return (
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
        maxWidth: '440px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        borderRadius: '24px',
        padding: '32px 28px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: brandColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '26px'
        }}>
          💅
        </div>

        <h3 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>Mã QR Đặt Lịch Tiệm</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          In mã này đặt tại quầy thu ngân hoặc bàn làm móng để khách quét đặt lịch nhanh chóng.
        </p>

        {/* QR Code Container */}
        <div
          ref={qrRef}
          style={{
            background: '#FFFFFF',
            padding: '20px',
            borderRadius: '18px',
            display: 'inline-block',
            border: '2px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '20px'
          }}
        >
          <QRCodeCanvas
            value={publicUrl}
            size={200}
            level="H"
            fgColor={brandColor}
            bgColor="#FFFFFF"
          />
          <div style={{ marginTop: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
            {salonName}
          </div>
        </div>

        {/* URL Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-subtle)',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '0.88rem',
          marginBottom: '20px',
          textAlign: 'left',
          overflow: 'hidden'
        }}>
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'var(--text-main)',
            fontWeight: 500
          }}>
            {publicUrl}
          </span>
          <button
            onClick={handleCopy}
            className="btn btn-sm"
            style={{
              flexShrink: 0,
              background: copied ? 'var(--success)' : 'var(--primary)',
              color: '#FFF',
              border: 'none',
              marginLeft: '8px'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Đã sao chép' : 'Sao chép'}
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDownload}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            <Download size={16} /> Tải ảnh QR (PNG)
          </button>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            <ExternalLink size={16} /> Xem Website
          </a>
        </div>
      </div>
    </div>
  );
};
