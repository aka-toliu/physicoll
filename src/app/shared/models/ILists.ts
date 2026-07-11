export interface IItemList {
    itemId: string;
    id: string;
    type: 'collection' | 'wishlist';
    addedAt: string;
    poster: string;
    title: string;
    order: number;
}

export interface IList {
  id?: string;
  title: string;
  isPrivated?: boolean;
  createdAt: string | Date;
  icon: string;
  items: IItemList[];
}