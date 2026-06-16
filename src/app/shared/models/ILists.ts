export interface IItemList {
    itemId: string;
    id: string;
    type: 'collection' | 'wishlist';
    addedAt: string;
}

export interface IList {
  id?: string;
  title: string;
  isPublic?: boolean;
  createdAt: any;
  items: IItemList[];
}