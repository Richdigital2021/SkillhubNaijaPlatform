
export type UserRole = 'provider' | 'seeker' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  avatar_url?: string;
  email?: string;
}

export interface Service {
  id: string;
  provider_id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  location: string;
  created_at: string;
  profiles?: Profile;
  rating?: number;
  review_count?: number;
  completed_jobs?: number;
  is_featured?: boolean;
  is_verified?: boolean;
  availability_status?: 'available' | 'busy' | 'unavailable';
}

export interface Booking {
  id: string;
  service_id: string;
  provider_id: string;
  seeker_id: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'paid' | 'accepted' | 'completed' | 'cancelled';
  created_at: string;
  services?: Service;
  seeker_profile?: Profile;
  provider_profile?: Profile;
}

export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  currency: string;
  gateway: 'paystack' | 'flutterwave';
  reference: string;
  status: 'successful' | 'pending' | 'failed';
  created_at: string;
  booking?: Booking;
}
