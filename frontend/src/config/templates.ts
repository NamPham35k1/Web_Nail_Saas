export interface TemplateTheme {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  primaryColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  textMuted: string;
  borderColor: string;
  isDark?: boolean;
  bannerPlaceholder: string;
}

export const TEMPLATE_THEMES: Record<string, TemplateTheme> = {
  BLUSH_KOREA: {
    id: 'BLUSH_KOREA',
    name: 'Hàn Quốc Nude Pastel',
    subtitle: 'Ngọt ngào & Thanh lịch',
    description: 'Phong cách phổ biến nhất tại Việt Nam. Tông hồng phấn nude nhẹ nhàng, viền mềm mại, tạo cảm giác thư giãn, nữ tính.',
    badge: 'PHỔ BIẾN NHẤT',
    primaryColor: '#D46B84',
    bgColor: '#FAF8F9',
    cardBg: '#FFFFFF',
    textColor: '#1E293B',
    textMuted: '#64748B',
    borderColor: '#F0E6EA',
    isDark: false,
    bannerPlaceholder: '/assets/salon_interior_luxury.jpg'
  },
  NOIR_LUXURY: {
    id: 'NOIR_LUXURY',
    name: 'Châu Âu Quý Tộc (Dark Luxury)',
    subtitle: 'Sang trọng & Quyền lực',
    description: 'Nền tối đen tuyền huyền bí kết hợp ánh vàng kim Royal Gold. Dành cho các salon nail cao cấp, phân khúc khách hàng VIP.',
    badge: 'VIP LUXURY',
    primaryColor: '#D4AF37',
    bgColor: '#0B0F19',
    cardBg: '#151C2C',
    textColor: '#F8FAFC',
    textMuted: '#94A3B8',
    borderColor: 'rgba(212, 175, 55, 0.3)',
    isDark: true,
    bannerPlaceholder: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=1200&auto=format&fit=crop&q=80'
  },
  EMERALD_SPA: {
    id: 'EMERALD_SPA',
    name: 'Spa Thảo Mộc (Emerald Wellness)',
    subtitle: 'Thiên nhiên & Thư thái',
    description: 'Tông xanh ngọc bích và sage thanh mát. Rất phù hợp cho các tiệm nail kết hợp gội đầu dưỡng sinh, massage trị liệu và chăm sóc móng thảo dược.',
    badge: 'THẢO MỘC',
    primaryColor: '#2A9D8F',
    bgColor: '#F4F9F8',
    cardBg: '#FFFFFF',
    textColor: '#134E48',
    textMuted: '#4B7B75',
    borderColor: 'rgba(42, 157, 143, 0.25)',
    isDark: false,
    bannerPlaceholder: '/assets/emerald_velvet_nails.jpg'
  },
  Y2K_CANDY: {
    id: 'Y2K_CANDY',
    name: 'Gen Z Pop Candy',
    subtitle: 'Trẻ trung & Năng động',
    description: 'Sự kết hợp giữa tím oải hương và hồng neon cá tính. Thu hút mạnh mẽ đối tượng học sinh, sinh viên và khách hàng sành điệu thích vẽ móng trendy.',
    badge: 'HOT TREND',
    primaryColor: '#D946EF',
    bgColor: '#FDF4FF',
    cardBg: '#FFFFFF',
    textColor: '#3B0764',
    textMuted: '#701A75',
    borderColor: 'rgba(217, 70, 239, 0.25)',
    isDark: false,
    bannerPlaceholder: '/assets/nail_art_showcase.jpg'
  },
  MINIMAL_CLEAN: {
    id: 'MINIMAL_CLEAN',
    name: 'Tối Giản Tinh Tế (Minimalist)',
    subtitle: 'Hiện đại phong cách Nhật Bản',
    description: 'Gam màu ghi xám graphite và trắng sứ tối giản tuyệt đối. Mang đến cảm giác chuyên nghiệp, tập trung hoàn toàn vào tay nghề kỹ thuật.',
    badge: 'MINIMAL',
    primaryColor: '#475569',
    bgColor: '#F8FAFC',
    cardBg: '#FFFFFF',
    textColor: '#0F172A',
    textMuted: '#64748B',
    borderColor: '#E2E8F0',
    isDark: false,
    bannerPlaceholder: '/assets/french_chrome_nails.jpg'
  }
};
