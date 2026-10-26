import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { prisma } from '../db/prisma.js';

describe('NailVibe Multi-Tenant Platform Test Suite', () => {
  let tenant1Token: string;
  let tenant1Id: string;
  let tenant1Slug: string;
  let tenant1ServiceId: string;

  let tenant2Token: string;
  let tenant2Id: string;
  let tenant2Slug: string;
  let tenant2ServiceId: string;

  beforeAll(async () => {
    // Clean up test users & tenants
    await prisma.appointment.deleteMany();
    await prisma.service.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.workingHours.deleteMany();
    await prisma.tenantSettings.deleteMany();
    await prisma.onboardingDraft.deleteMany();
    await prisma.tenantMembership.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.tenant.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // 1. Health checks
  it('Health Check: /api/health and /api/health/db should return 200 OK', async () => {
    const healthRes = await request(app).get('/api/health');
    expect(healthRes.status).toBe(200);
    expect(healthRes.body.status).toBe('ok');

    const dbRes = await request(app).get('/api/health/db');
    expect(dbRes.status).toBe(200);
    expect(dbRes.body.database).toBe('connected');
  });

  // 2. Register Tenant 1
  it('Register Tenant 1: Should create user, salon tenant, slug, and initial draft', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'salon1@nailvibe.vn',
        password: 'password123',
        fullName: 'Chủ Tiệm Một',
        salonName: 'Luna Nail Beauty',
        phone: '0901111222'
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.tenant.name).toBe('Luna Nail Beauty');
    expect(res.body.tenant.slug).toMatch(/^luna-nail-beauty/);

    tenant1Token = res.body.token;
    tenant1Id = res.body.tenant.id;
    tenant1Slug = res.body.tenant.slug;
  });

  // 3. Register Tenant 2 and test slug collision avoidance
  it('Slug Collision & Register Tenant 2: Same salon name generates a unique distinct slug', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'salon2@nailvibe.vn',
        password: 'password123',
        fullName: 'Chủ Tiệm Hai',
        salonName: 'Luna Nail Beauty', // Same salon name as tenant 1!
        phone: '0903333444'
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.tenant.slug).not.toBe(tenant1Slug); // Slugs must not collide!
    expect(res.body.tenant.slug).toContain('luna-nail-beauty');

    tenant2Token = res.body.token;
    tenant2Id = res.body.tenant.id;
    tenant2Slug = res.body.tenant.slug;
  });

  // 4. Duplicate email rejection
  it('Auth Validation: Cannot register with an already registered email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'salon1@nailvibe.vn',
        password: 'anotherpassword',
        fullName: 'Người Khác',
        salonName: 'Tiệm Mới'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Email này đã được sử dụng');
  });

  // 5. Login
  it('Login: Authenticates user and returns active tenant context', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'salon1@nailvibe.vn',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.activeTenant.id).toBe(tenant1Id);
  });

  // 6. Onboarding Wizard: Save progress & draft persistence
  it('Onboarding Wizard: Autosaves step data and persists across sessions', async () => {
    // Step 2: Branding
    const step2Res = await request(app)
      .post('/api/onboarding/step')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id)
      .send({
        step: 2,
        data: {
          brandColor: '#E07A5F',
          bookingPolicy: 'Vui lòng đến đúng giờ.'
        }
      });

    expect(step2Res.status).toBe(200);
    expect(step2Res.body.currentStep).toBe(2);

    // Fetch draft to verify persistence
    const draftRes = await request(app)
      .get('/api/onboarding/draft')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id);

    expect(draftRes.status).toBe(200);
    expect(draftRes.body.settings.brandColor).toBe('#E07A5F');
  });

  // 7. Onboarding 1-click apply sample preset
  it('Onboarding Wizard: 1-click apply sample template seeds standard services & hours', async () => {
    const sampleRes = await request(app)
      .post('/api/onboarding/apply-sample')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id);

    expect(sampleRes.status).toBe(200);

    // Verify services were created for tenant 1
    const servicesRes = await request(app)
      .get('/api/services')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id);

    expect(servicesRes.status).toBe(200);
    expect(servicesRes.body.services.length).toBeGreaterThanOrEqual(4);
    tenant1ServiceId = servicesRes.body.services[0].id;
  });

  // 8. Publish Website
  it('Onboarding Wizard: Publishes the website and activates public booking', async () => {
    const pubRes = await request(app)
      .post('/api/onboarding/publish')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id);

    expect(pubRes.status).toBe(200);
    expect(pubRes.body.isPublished).toBe(true);
    expect(pubRes.body.publicUrl).toBe(`/s/${tenant1Slug}`);
  });

  // 9. Add distinct service for Tenant 2 to test isolation
  it('Tenant 2 Setup: Add a custom service for Tenant 2', async () => {
    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${tenant2Token}`)
      .set('x-tenant-id', tenant2Id)
      .send({
        name: 'Đắp Móng Kim Cương Tenant 2',
        category: 'Đắp Móng',
        durationMinutes: 90,
        price: 990000
      });

    expect(res.status).toBe(201);
    tenant2ServiceId = res.body.service.id;
  });

  // 10. CRITICAL MULTI-TENANT ISOLATION TESTS
  it('DATA ISOLATION: Tenant 1 CANNOT see or access Tenant 2 services', async () => {
    // Tenant 1 lists services: must NOT contain Tenant 2's exclusive service
    const res = await request(app)
      .get('/api/services')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id);

    expect(res.status).toBe(200);
    const serviceNames = res.body.services.map((s: any) => s.name);
    expect(serviceNames).not.toContain('Đắp Móng Kim Cương Tenant 2');
  });

  it('SECURITY TEST: Tenant 1 CANNOT tamper or delete Tenant 2 service even with forged ID', async () => {
    // Tenant 1 tries to delete Tenant 2's service
    const deleteRes = await request(app)
      .delete(`/api/services/${tenant2ServiceId}`)
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id);

    // Must be 404 Not Found (or 403 Forbidden)
    expect([403, 404]).toContain(deleteRes.status);

    // Verify service still exists for Tenant 2
    const verifyRes = await request(app)
      .get('/api/services')
      .set('Authorization', `Bearer ${tenant2Token}`)
      .set('x-tenant-id', tenant2Id);

    const found = verifyRes.body.services.find((s: any) => s.id === tenant2ServiceId);
    expect(found).toBeDefined();
  });

  it('SECURITY TEST: User cannot bypass tenant check by sending another tenant ID in header', async () => {
    // User 1 tries to make request claiming to be Tenant 2
    const forgedRes = await request(app)
      .get('/api/tenant/current')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant2Id); // User 1 is NOT a member of Tenant 2!

    expect(forgedRes.status).toBe(403);
    expect(forgedRes.body.error).toContain('không có quyền truy cập');
  });

  // 11. Public Booking on /s/:slug
  it('Public Website: Anyone can view public salon profile by slug without auth', async () => {
    const res = await request(app).get(`/api/public/salon/${tenant1Slug}`);
    expect(res.status).toBe(200);
    expect(res.body.salon.name).toBe('Luna Nail Beauty');
    expect(res.body.salon.services.length).toBeGreaterThan(0);
    // Ensure sensitive data like user passwords or revenue are NOT returned
    expect(res.body.salon.passwordHash).toBeUndefined();
    expect(res.body.salon.memberships).toBeUndefined();
  });

  it('Public Booking: Customer books appointment on /s/:slug', async () => {
    // Check available slots first
    const slotsRes = await request(app)
      .get(`/api/public/salon/${tenant1Slug}/slots?date=2026-11-20&serviceId=${tenant1ServiceId}`);

    expect(slotsRes.status).toBe(200);
    expect(slotsRes.body.available).toBe(true);
    expect(slotsRes.body.slots.length).toBeGreaterThan(0);

    const targetSlot = slotsRes.body.slots[0].time;

    // Customer submits booking
    const bookRes = await request(app)
      .post(`/api/public/salon/${tenant1Slug}/book`)
      .send({
        customerName: 'Khách Hàng Thử Nghiệm',
        customerPhone: '0988776655',
        customerEmail: 'customer@gmail.com',
        serviceId: tenant1ServiceId,
        date: '2026-11-20',
        time: targetSlot,
        notes: 'Khách thích tông hồng pastel'
      });

    expect(bookRes.status).toBe(201);
    expect(bookRes.body.appointment.code).toMatch(/^NV-/);
    expect(bookRes.body.appointment.customerName).toBe('Khách Hàng Thử Nghiệm');
  });

  // 12. Dashboard Scoping: Tenant 1 dashboard shows the booked appointment; Tenant 2 sees 0
  it('Dashboard Scoping: Tenant 1 sees their appointments; Tenant 2 sees only their own', async () => {
    const t1Dash = await request(app)
      .get('/api/stats/dashboard')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id);

    expect(t1Dash.status).toBe(200);
    expect(t1Dash.body.checklist.hasServices).toBe(true);
    expect(t1Dash.body.checklist.isPublished).toBe(true);

    const t1Appts = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id);

    expect(t1Appts.status).toBe(200);
    expect(t1Appts.body.appointments.length).toBeGreaterThan(0);

    // Tenant 2 appointments list should NOT see Tenant 1's appointment
    const t2Appts = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${tenant2Token}`)
      .set('x-tenant-id', tenant2Id);

    expect(t2Appts.status).toBe(200);
    const customerNames = t2Appts.body.appointments.map((a: any) => a.customerName);
    expect(customerNames).not.toContain('Khách Hàng Thử Nghiệm');
  });

  // 13. Update salon profile & settings
  it('No-Code Salon Config: Update salon name and brand settings via dashboard', async () => {
    const updateRes = await request(app)
      .put('/api/tenant/profile')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id)
      .send({
        name: 'Luna Luxury Nail Spa',
        address: '77 Hai Bà Trưng, Quận 1',
        phone: '0909999888'
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.tenant.name).toBe('Luna Luxury Nail Spa');

    const settingsRes = await request(app)
      .put('/api/tenant/settings')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id)
      .send({
        brandColor: '#C5A059' // Luxury Gold
      });

    expect(settingsRes.status).toBe(200);
    expect(settingsRes.body.settings.brandColor).toBe('#C5A059');
  });

  // 14. Slug Change & Warning
  it('Slug Change: Successfully change slug with warning about old links', async () => {
    const newSlug = `luna-luxury-${Math.floor(100 + Math.random() * 900)}`;
    const res = await request(app)
      .put('/api/tenant/slug')
      .set('Authorization', `Bearer ${tenant1Token}`)
      .set('x-tenant-id', tenant1Id)
      .send({ slug: newSlug });

    expect(res.status).toBe(200);
    expect(res.body.newSlug).toBe(newSlug);
    expect(res.body.warning).toContain('Lưu ý');
  });
});
