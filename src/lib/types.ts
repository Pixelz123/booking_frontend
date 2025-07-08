export type Property = {
  id: string;
  name: string;
  type: string;
  city: string;
  country: string;
  heroImage: string;
  images: string[];
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  host: {
    name: string;
    avatar: string;
  };
  details: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  amenities: string[];
  description: string;
};
