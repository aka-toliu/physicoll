export interface IProfile {
    uid: string;
    username: string;
    displayName: string;
    photoURL: string;
    createdAt: Date;
    config: {
        theme: 'light' | 'dark';
        notifications: boolean;
        showActivity: boolean;
        showCollections: boolean;
        showWishlist: boolean;
        privateProfile: boolean;
    };
}

export interface IUser {
    uid: string;
    username: string;
    displayName: string;
    photoURL: string;
}