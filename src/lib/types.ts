export type PropertySummary = {
  propertyId: string;
  hostname: string;
  city: string;
  heroImageSrc: string;
  price_per_night: number;
  name: string;
};

export type PropertyDetail = {
  property_id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  country: string;
  postal_code: number;
  address: string;
  price_per_night: number;
  imageList: string[];
  hero_image_src: string;
  guests: number;
  bedroom: number;
  beds: number;
  bathroom: number;
  type: string; // Will be removed in a future step, keeping for compatibility for now.
  rating: number; // Will be removed in a future step
  reviewsCount: number; // Will be removed in a future step
  hostname: string;
  host_avatar_src: string; // Will be removed in a future step
};

export type Booking = {
  bookingId: string;
  property: PropertyDetail;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
};
