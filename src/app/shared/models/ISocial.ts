export interface IFriendUser {
  UID: string;
  followedAt: string;
}

export interface IFriendsDoc {
  followers: IFriendUser[];
  following: IFriendUser[];
}