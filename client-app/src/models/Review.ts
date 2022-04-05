export interface Review {
  reviewUuid: string;
  name: string;
  rating: number;
  review: string;
  reviewedDate: string;
}

export interface Rating {
  total: number;
  averageRating: number;
}

