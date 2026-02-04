import { api } from '@/services/api';

export interface UserStats {
  totalEvents: number;
  totalCars: number;
  totalBadges: number;
}

export interface UserCrew {
  id: string;
  name: string;
  tag: string;
  insigniaUrl: string;
  isLeader: boolean;
}

export interface UserCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  nickname: string;
  trim: string;
  thumbnailUrl: string;
  specs: {
    engine: string;
    horsepower: number;
    torque: number;
    transmission: string;
    drivetrain: string;
    fuelType: string;
  },
  modsList: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string | null;
  bannerUrl?: string | null;
  isOnline: boolean;
  joinedAt: string;
  stats: UserStats;
  crew?: UserCrew | null;
  garage?: UserCar[];
  achievements?: unknown[];
}

export interface UpdateUserPayload {
  name: string;
  bio: string;
}

export interface CreateCarPayload {
  brand: string;
  model: string;
  year: number;
  color: string;
  nickname: string;
  trim: string;
  specs: {
    engine: string;
    horsepower: number;
    torque: number;
    transmission: string;
    drivetrain: string;
    fuelType: string;
  };
  modsList: string[];
}

export const userService = {
  getUser: (id: string) => api.get<UserProfile>(`/users/${id}`),
  updateUser: (id: string, payload: UpdateUserPayload) =>
    api.patch<UserProfile>(`/users/${id}`, payload),
  updateAvatar: (id: string, data: FormData) =>
    api.postMultipart<UserProfile>(`/users/update-picture/${id}`, data),
  updateBanner: (id: string, data: FormData) =>
    api.postMultipart<UserProfile>(`/users/update-banner/${id}`, data),
  createCar: (userId: string, payload: CreateCarPayload) =>
    api.post<UserCar>(`/garage/${userId}`, payload),
};
