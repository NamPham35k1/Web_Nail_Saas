import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with sample salons and multi-tenant data...');

  // Clear existing data
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.tenantSettings.deleteMany();
  await prisma.onboardingDraft.deleteMany();
  await prisma.tenantMembership.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('123456', 10);

  // User 1: Luna Owner
  const lunaOwner = await prisma.user.create({
    data: {
      email: 'luna@nailvibe.vn',
      fullName: 'Nguyễn Thu Thảo',
      phone: '0901234567',
      passwordHash
    }
  });

  // Tenant 1: Luna Nail Studio
  const lunaTenant = await prisma.tenant.create({
    data: {
      name: 'Luna Nail Studio',
      slug: 'luna-nail',
      phone: '0901234567',
      email: 'contact@lunanail.vn',
      address: '142 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
      description: 'Không gian làm móng sang trọng phong cách Hàn Quốc, chuyên viên giàu kinh nghiệm, sơn gel nhập khẩu chính hãng.',
      isPublished: true,
      plan: 'TRIAL',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      subscriptionStatus: 'ACTIVE'
    }
  });

  await prisma.tenantMembership.create({
    data: {
      userId: lunaOwner.id,
      tenantId: lunaTenant.id,
      role: 'OWNER'
    }
  });

  await prisma.tenantSettings.create({
    data: {
      tenantId: lunaTenant.id,
      brandColor: '#D46B84', // Rose Gold / Soft Blush
      brandSecondaryColor: '#FFF0F5',
      logoUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&auto=format&fit=crop&q=80',
      bannerUrl: '/assets/salon_interior_luxury.jpg',
      templateTheme: 'BLUSH_KOREA',
      bookingPolicy: 'Quý khách vui lòng đến trước 10 phút. Nếu hủy hoặc đổi lịch, xin báo trước 2 giờ.',
      slotIntervalMinutes: 30,
      leadTimeHours: 1,
      maxAdvanceDays: 30
    }
  });

  await prisma.onboardingDraft.create({
    data: {
      tenantId: lunaTenant.id,
      currentStep: 7,
      isCompleted: true,
      draftData: JSON.stringify({ isCompleted: true })
    }
  });

  // Working Hours for Luna (Mon to Sun)
  for (let day = 0; day <= 6; day++) {
    await prisma.workingHours.create({
      data: {
        tenantId: lunaTenant.id,
        dayOfWeek: day,
        isOpen: day !== 1, // Open everyday except Monday
        openTime: '09:00',
        closeTime: day === 0 ? '19:00' : '20:30'
      }
    });
  }

  // Services for Luna with real photography
  const lunaServicesData = [
    {
      name: 'Sơn Gel Tráng Gương Nude',
      category: 'Sơn Gel',
      durationMinutes: 45,
      price: 180000,
      description: 'Sơn gel tráng gương ngọc trai bóng mịn, bền đẹp 3-4 tuần, bảng màu hơn 300 tone màu xu hướng.',
      imageUrl: '/assets/french_chrome_nails.jpg'
    },
    {
      name: 'Đắp Gel Nối Móng Tự Nhiên',
      category: 'Đắp Móng',
      durationMinutes: 75,
      price: 320000,
      description: 'Kéo dài móng nhẹ nhàng, không nặng tay, form móng chuẩn thanh lịch.',
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&auto=format&fit=crop&q=80'
    },
    {
      name: 'Móng Mắt Mèo Ngọc Bích Ánh Kim',
      category: 'Nail Art',
      durationMinutes: 60,
      price: 260000,
      description: 'Hiệu ứng mắt mèo velvet chuyển sắc huyền ảo, điểm xuyết lá vàng hoàng gia.',
      imageUrl: '/assets/emerald_velvet_nails.jpg'
    },
    {
      name: 'Nail Art Vẽ Hoa Nổi 3D Tinh Xảo',
      category: 'Nail Art',
      durationMinutes: 40,
      price: 220000,
      description: 'Vẽ tay tinh tế từng ngón, hoa nổi 3D kết hợp mắt mèo lấp lánh.',
      imageUrl: '/assets/nail_art_showcase.jpg'
    },
    {
      name: 'Combo Cắt Da & Spa Dưỡng Móng OPI',
      category: 'Spa Chăm Sóc',
      durationMinutes: 35,
      price: 120000,
      description: 'Tẩy tế bào chết, ngâm nước ấm muối khoáng, massage tinh dầu dưỡng.',
      imageUrl: '/assets/luxury_nail_hero.jpg'
    }
  ];

  const lunaServices = [];
  for (const s of lunaServicesData) {
    const created = await prisma.service.create({
      data: { ...s, tenantId: lunaTenant.id }
    });
    lunaServices.push(created);
  }

  // Staff for Luna
  const staff1 = await prisma.staff.create({
    data: {
      tenantId: lunaTenant.id,
      name: 'Thu Thảo',
      role: 'Master Nail & Form Designer',
      phone: '0901234567',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    }
  });

  const staff2 = await prisma.staff.create({
    data: {
      tenantId: lunaTenant.id,
      name: 'Bảo Trân',
      role: 'Chuyên viên Nail Art',
      phone: '0908888777',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  });

  // Appointments for Luna
  const today = new Date();
  today.setHours(10, 0, 0, 0);

  const appt1Start = new Date(today.getTime() + 1.5 * 60 * 60 * 1000); // 11:30
  const appt1End = new Date(appt1Start.getTime() + 45 * 60 * 1000);

  const appt2Start = new Date(today.getTime() + 4 * 60 * 60 * 1000); // 14:00
  const appt2End = new Date(appt2Start.getTime() + 75 * 60 * 1000);

  await prisma.appointment.create({
    data: {
      tenantId: lunaTenant.id,
      appointmentCode: 'NV-201',
      customerName: 'Hoàng Phương Anh',
      customerPhone: '0912345678',
      customerEmail: 'phuonganh@gmail.com',
      serviceId: lunaServices[0].id,
      staffId: staff1.id,
      startTime: appt1Start,
      endTime: appt1End,
      status: 'CONFIRMED',
      totalPrice: lunaServices[0].price,
      notes: 'Khách thích màu thạch hồng nude'
    }
  });

  await prisma.appointment.create({
    data: {
      tenantId: lunaTenant.id,
      appointmentCode: 'NV-202',
      customerName: 'Trần Mai Ly',
      customerPhone: '0938112233',
      serviceId: lunaServices[1].id,
      staffId: staff2.id,
      startTime: appt2Start,
      endTime: appt2End,
      status: 'PENDING',
      totalPrice: lunaServices[1].price,
      notes: 'Lần đầu đến tiệm, tư vấn form móng hạnh nhân'
    }
  });

  // Customer record
  await prisma.customer.create({
    data: {
      tenantId: lunaTenant.id,
      name: 'Hoàng Phương Anh',
      phone: '0912345678',
      email: 'phuonganh@gmail.com',
      totalVisits: 1,
      totalSpent: lunaServices[0].price,
      notes: 'Khách quen tính nhẹ nhàng'
    }
  });

  // Tenant 2: Mi Nail Studio (Demonstrating Multi-Tenant Isolation)
  const miOwner = await prisma.user.create({
    data: {
      email: 'minail@nailvibe.vn',
      fullName: 'Lê Diễm My',
      phone: '0977889900',
      passwordHash
    }
  });

  const miTenant = await prisma.tenant.create({
    data: {
      name: 'Mi Nail Studio',
      slug: 'mi-nail-studio',
      phone: '0977889900',
      email: 'minailstudio@gmail.com',
      address: '88 Cầu Giấy, Hà Nội',
      description: 'Chuyên móng đắp bột & gel phong cách Châu Âu hiện đại.',
      isPublished: true,
      plan: 'BASIC',
      subscriptionStatus: 'ACTIVE'
    }
  });

  await prisma.tenantMembership.create({
    data: {
      userId: miOwner.id,
      tenantId: miTenant.id,
      role: 'OWNER'
    }
  });

  await prisma.tenantSettings.create({
    data: {
      tenantId: miTenant.id,
      brandColor: '#2A9D8F', // Emerald Teal Accent
      brandSecondaryColor: '#E8F6F4',
      bannerUrl: '/assets/emerald_velvet_nails.jpg',
      templateTheme: 'EMERALD_SPA',
      bookingPolicy: 'Vui lòng báo trước nếu bạn đến muộn quá 15 phút.'
    }
  });

  for (let day = 0; day <= 6; day++) {
    await prisma.workingHours.create({
      data: {
        tenantId: miTenant.id,
        dayOfWeek: day,
        isOpen: true,
        openTime: '08:30',
        closeTime: '21:00'
      }
    });
  }

  const miService = await prisma.service.create({
    data: {
      tenantId: miTenant.id,
      name: 'Đắp Bột Ombre Phong Cách Tây',
      category: 'Đắp Bột',
      durationMinutes: 90,
      price: 380000,
      description: 'Kỹ thuật ombre mượt mà, bền chắc phong cách Châu Âu sang trọng.',
      imageUrl: '/assets/emerald_velvet_nails.jpg'
    }
  });

  await prisma.service.create({
    data: {
      tenantId: miTenant.id,
      name: 'Sơn Gel Tráng Gương Châu Âu',
      category: 'Sơn Gel',
      durationMinutes: 45,
      price: 200000,
      description: 'Tráng gương ngọc trai cao cấp chuẩn salon quốc tế.',
      imageUrl: '/assets/french_chrome_nails.jpg'
    }
  });

  await prisma.appointment.create({
    data: {
      tenantId: miTenant.id,
      appointmentCode: 'NV-301',
      customerName: 'Nguyễn Hải Yến',
      customerPhone: '0945678901',
      serviceId: miService.id,
      startTime: new Date(today.getTime() + 5 * 60 * 60 * 1000),
      endTime: new Date(today.getTime() + 6.5 * 60 * 60 * 1000),
      status: 'CONFIRMED',
      totalPrice: miService.price
    }
  });

  console.log('Seed completed successfully!');
  console.log('Tenant 1: luna-nail (Owner: luna@nailvibe.vn / 123456)');
  console.log('Tenant 2: mi-nail-studio (Owner: minail@nailvibe.vn / 123456)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
