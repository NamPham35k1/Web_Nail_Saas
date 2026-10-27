export interface TemplateTheme {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  description: string;
  badge: string;
  layoutType: 'salon-landing' | 'mini-app-stepper' | 'luxury-noir' | 'split-spa' | 'editorial-lookbook';
  primaryColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  textMuted: string;
  borderColor: string;
  isDark?: boolean;
  bannerPlaceholder: string;
  cardBorderRadius: string;
  accentGlow: string;
  previewTag: string;
  layoutHighlight: string;
  features: string[];
}

export const TEMPLATE_THEMES: Record<string, TemplateTheme> = {
  Y2K_CANDY: {
    id: 'Y2K_CANDY',
    name: 'NailVibe Studio Pro',
    category: 'Landing Page Toàn Diện',
    subtitle: 'Website Salon Hoàn Chỉnh & Chuyên Nghiệp',
    description: 'Bố cục chuẩn Landing Page của các thương hiệu salon lớn: Hero banner rộng lớn, 3 khối cam kết chất lượng, thư viện ảnh nghệ thuật, bảng dịch vụ dạng lưới (Grid) 3 cột và form đặt hẹn nổi bật.',
    badge: 'ĐƯỢC CHỌN NHIỀU NHẤT',
    layoutType: 'salon-landing',
    primaryColor: '#D46B84',
    bgColor: '#FAF8F9',
    cardBg: '#FFFFFF',
    textColor: '#1E293B',
    textMuted: '#64748B',
    borderColor: '#F0E6EA',
    isDark: false,
    bannerPlaceholder: '/assets/salon_interior_luxury.jpg',
    cardBorderRadius: '22px',
    accentGlow: '0 8px 30px rgba(212, 107, 132, 0.2)',
    previewTag: 'Bố cục Landing Page Đa Tầng',
    layoutHighlight: 'Hero lớn • Thống kê tiệm • Bảng giá Grid 3 cột • Form đặt lịch độc lập',
    features: [
      'Giao diện website hoàn chỉnh như thương hiệu quốc tế',
      '3 khối cam kết chất lượng & tay nghề thợ móng',
      'Khu vực thư viện Lookbook nổi bật kèm giá',
      'Chân trang (Footer) đầy đủ giờ mở cửa & bản đồ'
    ]
  },
  BLUSH_KOREA: {
    id: 'BLUSH_KOREA',
    name: 'Seoul Chic Mini-App',
    category: 'Ứng Dụng Di Động (Mobile-First)',
    subtitle: 'Đặt Lịch Từng Bước (Stepper Flow) Siêu Nhanh',
    description: 'Thiết kế tối ưu 100% cho khách hàng lướt trên điện thoại (giống Grab / Zalo Mini-App): Quy trình đặt hẹn chia thành 4 bước tuần tự mượt mà: Chọn dịch vụ ➔ Chọn thợ ➔ Chọn giờ ➔ Hoàn tất.',
    badge: 'CHUẨN SMARTPHONE',
    layoutType: 'mini-app-stepper',
    primaryColor: '#E87A93',
    bgColor: '#FFF7F9',
    cardBg: '#FFFFFF',
    textColor: '#1E293B',
    textMuted: '#64748B',
    borderColor: '#FCE7EC',
    isDark: false,
    bannerPlaceholder: '/assets/salon_interior_luxury.jpg',
    cardBorderRadius: '24px',
    accentGlow: '0 8px 30px rgba(232, 122, 147, 0.25)',
    previewTag: 'Bố cục Stepper 4 Bước Di Động',
    layoutHighlight: 'Thanh tiến trình 4 bước • Nút Tiếp tục/Quay lại • Không cuộn trang dài',
    features: [
      'Khách hàng thao tác cực kỳ trực quan từng bước một',
      'Thanh tiến trình đánh số (1 - 2 - 3 - 4)',
      'Thẻ thợ móng kèm đánh giá sao và tay nghề',
      'Tóm tắt chi phí rõ ràng trước khi bấm đặt lịch'
    ]
  },
  NOIR_LUXURY: {
    id: 'NOIR_LUXURY',
    name: 'Royal Noir VIP Club',
    category: 'Quý Tộc Châu Âu (VIP Lounge)',
    subtitle: 'Kính Mờ Huyền Ảo & Ánh Vàng Kim Hoàng Gia',
    description: 'Bố cục Dark Glassmorphism thượng lưu: Nền đen obsidian huyền bí kết hợp ánh vàng kim 24K, thẻ bài dịch vụ tựa trang sức đắt giá và trải nghiệm phục vụ VIP độc quyền.',
    badge: 'THƯỢNG LƯU VIP',
    layoutType: 'luxury-noir',
    primaryColor: '#D4AF37',
    bgColor: '#0B0F19',
    cardBg: '#131A2A',
    textColor: '#F8FAFC',
    textMuted: '#94A3B8',
    borderColor: 'rgba(212, 175, 55, 0.35)',
    isDark: true,
    bannerPlaceholder: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=1200&auto=format&fit=crop&q=80',
    cardBorderRadius: '20px',
    accentGlow: '0 0 26px rgba(212, 175, 55, 0.4)',
    previewTag: 'Bố cục Kính Mờ & Vàng Hoàng Gia',
    layoutHighlight: 'Dark Glassmorphism • Viền vàng phát sáng • Huy hiệu Vương Miện VIP 👑',
    features: [
      'Nền tối nhung huyền bí không làm chói mắt khách hàng',
      'Đường viền ánh kim và đổ bóng vàng Royal Gold',
      'Menu bảng giá trang sức quý phái',
      'Nút xác nhận đặt lịch VIP phong cách Concierge'
    ]
  },
  EMERALD_SPA: {
    id: 'EMERALD_SPA',
    name: 'Zen Botanical Spa',
    category: 'Màn Hình Chia Đôi (Split-Screen)',
    subtitle: 'Nail Thảo Mộc & Dưỡng Sinh Thư Thái',
    description: 'Bố cục 2 cột Split-Screen 50/50 độc đáo: Cột trái cố định hình ảnh thư giãn, triết lý chăm sóc móng thảo dược & giờ mở cửa; Cột phải cuộn danh sách các liệu trình móng tự nhiên.',
    badge: 'THẢO MỘC DƯỠNG SINH',
    layoutType: 'split-spa',
    primaryColor: '#2A9D8F',
    bgColor: '#F4F9F8',
    cardBg: '#FFFFFF',
    textColor: '#134E48',
    textMuted: '#4B7B75',
    borderColor: 'rgba(42, 157, 143, 0.25)',
    isDark: false,
    bannerPlaceholder: '/assets/emerald_velvet_nails.jpg',
    cardBorderRadius: '18px',
    accentGlow: '0 8px 25px rgba(42, 157, 143, 0.2)',
    previewTag: 'Bố cục Split-Screen 50/50',
    layoutHighlight: 'Cột trái tĩnh giới thiệu tiệm • Cột phải cuộn menu móng & trị liệu',
    features: [
      'Bố cục chia đôi màn hình độc đáo phong cách Resort Spa',
      'Thẻ dịch vụ hiển thị rõ thời gian trị liệu & thảo mộc',
      'Tông màu xanh ngọc bích dịu mắt, giảm căng thẳng',
      'Phù hợp tiệm nail kết hợp gội đầu dưỡng sinh & massage'
    ]
  },
  MINIMAL_CLEAN: {
    id: 'MINIMAL_CLEAN',
    name: 'Vogue Fashion Lookbook',
    category: 'Tạp Chí Nghệ Thuật (Editorial)',
    subtitle: 'Triển Lãm Tác Phẩm & Tối Giản Tinh Tế',
    description: 'Thiết kế theo chuẩn tạp chí thời trang Vogue (Tokyo & Paris): Bố cục tập trung vào hình ảnh triển lãm các bộ móng nghệ thuật khổ lớn (Gallery-First) và menu dịch vụ tối giản tinh tế.',
    badge: 'EDITORIAL NGHỆ THUẬT',
    layoutType: 'editorial-lookbook',
    primaryColor: '#0F172A',
    bgColor: '#F8FAFC',
    cardBg: '#FFFFFF',
    textColor: '#0F172A',
    textMuted: '#64748B',
    borderColor: '#E2E8F0',
    isDark: false,
    bannerPlaceholder: '/assets/french_chrome_nails.jpg',
    cardBorderRadius: '14px',
    accentGlow: '0 4px 20px rgba(15, 23, 42, 0.1)',
    previewTag: 'Bố cục Tạp Chí Triển Lãm',
    layoutHighlight: 'Gallery ảnh khổ lớn đánh số • Menu tối giản • Typography nghệ thuật',
    features: [
      'Triển lãm bộ sưu tập móng nghệ thuật (Lookbook-First)',
      'Font chữ thanh mảnh chuẩn ấn phẩm thời trang cao cấp',
      'Menu dịch vụ kẻ chỉ tối giản tinh tế',
      'Tập trung hoàn toàn vào kỹ thuật tay nghề của nghệ nhân'
    ]
  }
};
