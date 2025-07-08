
export type Property = {
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
  type: string;
  rating: number;
  reviewsCount: number;
  hostname: string;
  host_avatar_src: string;
  amenities: string[];
};

export type Booking = {
  bookingId: string;
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
};
