export interface IFriendUser {
  UID: string;
  followedAt: string;
}

export interface IFriendsDoc {
  followers: IFriendUser[];
  following: IFriendUser[];
}

export interface ILikeDoc {
    itemID: string;
    likes: ILike[];
}

export interface ILike{
  uid: string;
  likedAt: string;
}