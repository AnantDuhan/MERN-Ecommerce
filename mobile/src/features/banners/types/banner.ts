export interface ApiBanner {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image?: { url: string | null };
  active: boolean;
  order: number;
}

export interface BannersResponse {
  success: boolean;
  banners: ApiBanner[];
}

export interface BannerVM {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  imageUrl: string | null;
}
