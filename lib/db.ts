
import { Profile, Service, Booking, Payment, UserRole } from '../types';

const STORAGE_KEYS = {
  USERS: 'shn_users',
  PROFILES: 'shn_profiles',
  SERVICES: 'shn_services',
  BOOKINGS: 'shn_bookings',
  PAYMENTS: 'shn_payments',
  SESSION: 'shn_session'
};

const get = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const set = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

const notifyAuthChange = () => {
  window.dispatchEvent(new Event('auth-change'));
};

const seedData = () => {
  if (get(STORAGE_KEYS.PROFILES).length === 0) {
    // Admin Seed
    const adminId = 'admin123';
    const profiles = [
      { id: adminId, full_name: 'System Admin', role: 'admin', created_at: new Date().toISOString() },
      { id: 'p1', full_name: 'Chukwudi Okafor', role: 'provider', created_at: new Date().toISOString() },
      { id: 'p2', full_name: 'Tunde Bakare', role: 'provider', created_at: new Date().toISOString() },
      { id: 's1', full_name: 'Amaka Eze', role: 'seeker', created_at: new Date().toISOString() }
    ];
    set(STORAGE_KEYS.PROFILES, profiles);
    
    const users = [
      { id: adminId, email: 'admin@skillhub.com', password: 'admin' },
      { id: 'p1', email: 'provider1@test.com', password: 'password' },
      { id: 'p2', email: 'provider2@test.com', password: 'password' },
      { id: 's1', email: 'seeker1@test.com', password: 'password' }
    ];
    set(STORAGE_KEYS.USERS, users);
  }

  if (get(STORAGE_KEYS.SERVICES).length === 0) {
    const mockServices: Service[] = [
      {
        id: '1',
        provider_id: 'p1',
        title: 'Professional Plumbing Services',
        category: 'Plumbing',
        description: 'Quality plumbing for homes and offices.',
        price: 5000,
        location: 'Ikeja, Lagos',
        created_at: new Date().toISOString(),
        rating: 4.8,
        review_count: 127,
        completed_jobs: 234,
        is_verified: true,
        availability_status: 'available'
      },
      {
        id: '2',
        provider_id: 'p2',
        title: 'Professional Photography',
        category: 'Photography',
        description: 'Capturing your best moments.',
        price: 30000,
        location: 'Gbagada, Lagos',
        created_at: new Date().toISOString(),
        rating: 4.9,
        review_count: 176,
        completed_jobs: 423,
        is_verified: true,
        is_featured: true,
        availability_status: 'busy'
      }
    ];
    set(STORAGE_KEYS.SERVICES, mockServices);
  }
};

seedData();

export const db = {
  auth: {
    signUp: async ({ email, password, options }: any) => {
      const users = get(STORAGE_KEYS.USERS);
      if (users.find((u: any) => u.email === email)) throw new Error('User already exists');
      const newUser = { id: Math.random().toString(36).substr(2, 9), email, password };
      users.push(newUser);
      set(STORAGE_KEYS.USERS, users);
      const profile: Profile = {
        id: newUser.id,
        full_name: options.data.full_name,
        role: options.data.role,
        created_at: new Date().toISOString(),
        email: email
      };
      const profiles = get(STORAGE_KEYS.PROFILES);
      profiles.push(profile);
      set(STORAGE_KEYS.PROFILES, profiles);
      const session = { user: newUser, profile };
      set(STORAGE_KEYS.SESSION, session);
      notifyAuthChange();
      return { data: { user: newUser, session }, error: null };
    },
    signIn: async ({ email, password }: any) => {
      const users = get(STORAGE_KEYS.USERS);
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid credentials');
      const profiles = get(STORAGE_KEYS.PROFILES);
      const profile = profiles.find((p: any) => p.id === user.id);
      const session = { user, profile };
      set(STORAGE_KEYS.SESSION, session);
      notifyAuthChange();
      return { data: { user, session }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      notifyAuthChange();
    },
    getSession: () => {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      return session ? JSON.parse(session) : null;
    }
  },
  profiles: {
    update: async (id: string, updates: Partial<Profile>) => {
      const profiles = get(STORAGE_KEYS.PROFILES);
      const idx = profiles.findIndex((p: any) => p.id === id);
      if (idx !== -1) {
        profiles[idx] = { ...profiles[idx], ...updates };
        set(STORAGE_KEYS.PROFILES, profiles);
        const session = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (session) {
          const sessionObj = JSON.parse(session);
          if (sessionObj.user.id === id) {
            sessionObj.profile = { ...sessionObj.profile, ...updates };
            localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionObj));
            notifyAuthChange();
          }
        }
      }
    },
    getAll: async () => get(STORAGE_KEYS.PROFILES)
  },
  services: {
    getAll: async () => {
      const services = get(STORAGE_KEYS.SERVICES);
      const profiles = get(STORAGE_KEYS.PROFILES);
      return services.map((s: any) => ({
        ...s,
        profiles: profiles.find((p: any) => p.id === s.provider_id)
      }));
    },
    getById: async (id: string) => {
      const services = get(STORAGE_KEYS.SERVICES);
      const profiles = get(STORAGE_KEYS.PROFILES);
      const service = services.find((s: any) => s.id === id);
      if (service) {
        service.profiles = profiles.find((p: any) => p.id === service.provider_id);
      }
      return service;
    },
    create: async (data: any) => {
      const services = get(STORAGE_KEYS.SERVICES);
      const newService = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        rating: 5.0, review_count: 0, completed_jobs: 0, is_verified: true, availability_status: 'available'
      };
      services.push(newService);
      set(STORAGE_KEYS.SERVICES, services);
      return newService;
    },
    delete: async (id: string) => {
      const services = get(STORAGE_KEYS.SERVICES).filter((s: any) => s.id !== id);
      set(STORAGE_KEYS.SERVICES, services);
    }
  },
  bookings: {
    getAll: async () => {
      const b = get(STORAGE_KEYS.BOOKINGS);
      const s = get(STORAGE_KEYS.SERVICES);
      const p = get(STORAGE_KEYS.PROFILES);
      return b.map((item: any) => ({
        ...item,
        services: s.find((x: any) => x.id === item.service_id),
        seeker_profile: p.find((x: any) => x.id === item.seeker_id),
        provider_profile: p.find((x: any) => x.id === item.provider_id)
      }));
    },
    getByUser: async (userId: string, role: UserRole) => {
      const bookings = get(STORAGE_KEYS.BOOKINGS);
      const services = get(STORAGE_KEYS.SERVICES);
      const profiles = get(STORAGE_KEYS.PROFILES);
      const filtered = bookings.filter((b: any) => 
        role === 'seeker' ? b.seeker_id === userId : b.provider_id === userId
      );
      return filtered.map((b: any) => ({
        ...b,
        services: services.find((s: any) => s.id === b.service_id),
        seeker_profile: profiles.find((p: any) => p.id === b.seeker_id),
        provider_profile: profiles.find((p: any) => p.id === b.provider_id)
      }));
    },
    create: async (data: any) => {
      const bookings = get(STORAGE_KEYS.BOOKINGS);
      const newBooking = { ...data, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString(), status: data.status || 'pending' };
      bookings.push(newBooking);
      set(STORAGE_KEYS.BOOKINGS, bookings);
      return newBooking;
    },
    updateStatus: async (id: string, status: string) => {
      const bookings = get(STORAGE_KEYS.BOOKINGS);
      const idx = bookings.findIndex((b: any) => b.id === id);
      if (idx !== -1) {
        bookings[idx].status = status;
        set(STORAGE_KEYS.BOOKINGS, bookings);
      }
    }
  },
  payments: {
    getAll: async () => {
      const p = get(STORAGE_KEYS.PAYMENTS);
      const b = get(STORAGE_KEYS.BOOKINGS);
      const s = get(STORAGE_KEYS.SERVICES);
      return p.map((item: any) => ({
        ...item,
        booking: {
          ...b.find((x: any) => x.id === item.booking_id),
          services: s.find((x: any) => x.id === (b.find((y: any) => y.id === item.booking_id)?.service_id))
        }
      }));
    },
    getByUser: async (userId: string) => {
      const all = await db.payments.getAll();
      return all.filter((p: any) => p.user_id === userId || p.booking?.provider_id === userId);
    },
    create: async (data: any) => {
      const payments = get(STORAGE_KEYS.PAYMENTS);
      const newPayment = { ...data, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
      payments.push(newPayment);
      set(STORAGE_KEYS.PAYMENTS, payments);
      return newPayment;
    }
  }
};
