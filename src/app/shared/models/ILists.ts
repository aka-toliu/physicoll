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
  isPublic?: boolean;
  createdAt: any;
  items: IItemList[];
}