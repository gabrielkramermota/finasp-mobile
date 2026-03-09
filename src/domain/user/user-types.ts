export type UserProfile = {
  id: string;
  name: string;
  photoUri?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SaveUserProfileInput = {
  name: string;
  photoUri?: string | null;
};
