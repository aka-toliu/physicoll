import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
  collection,
  collectionData,
  where,
  query
} from '@angular/fire/firestore';
import { Observable, from, map, take } from 'rxjs';
import { IFriendUser, IFriendsDoc, ILike } from '../../shared/models/ISocial';
import { IUser } from '../../shared/models/IProfile';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  private firestore = inject(Firestore);

  /**
   * Pega o UID do usuário atualmente logado
   */
  private get currentUserId(): string {
    return localStorage.getItem('UID') || '';
  }

  /**
   * Retorna a referência do documento `social/friends` de um usuário específico
   */
  private getFriendsDocRef(userId: string) {
    return doc(this.firestore, `users/${userId}/social/friends`);
  }

  private getLikesDocRef(userId: string) {
    return doc(this.firestore, `users/${userId}/social/likes`);
  }

  getFollowers(userId: string = this.currentUserId): Observable<IFriendUser[]> {
    const docRef = this.getFriendsDocRef(userId);
    return docData(docRef).pipe(
      map((data) => (data as IFriendsDoc)?.followers || [])
    );
  }

  getFollowing(userId: string = this.currentUserId): Observable<IFriendUser[]> {
    const docRef = this.getFriendsDocRef(userId);
    return docData(docRef).pipe(
      map((data) => (data as IFriendsDoc)?.following || [])
    );
  }

  isFollowing(targetUserId: string): Observable<boolean> {
    return this.getFollowing(this.currentUserId).pipe(
      map((followingList) => followingList.some(user => user.UID === targetUserId))
    );
  }

  followUser(targetUserId: string): Observable<void> {
    const myUid = this.currentUserId;
    if (!myUid || myUid === targetUserId) throw new Error('Operação inválida.');

    const now = new Date().toISOString();

    const myDocRef = this.getFriendsDocRef(myUid);
    const targetDocRef = this.getFriendsDocRef(targetUserId);

    const promise = (async () => {

      const mySnap = await getDoc(myDocRef);
      if (mySnap.exists()) {
        const myData = mySnap.data() as IFriendsDoc;
        const alreadyFollowing = myData.following?.some(item => item.UID === targetUserId);
        if (alreadyFollowing) return;
      }

      const myFollowingData: IFriendUser = { UID: targetUserId, followedAt: now };
      const targetFollowerData: IFriendUser = { UID: myUid, followedAt: now };

      await Promise.all([
        updateDoc(myDocRef, {
          following: arrayUnion(myFollowingData)
        }).catch(async () => {
          await setDoc(myDocRef, { followers: [], following: [myFollowingData] }, { merge: true });
        }),

        updateDoc(targetDocRef, {
          followers: arrayUnion(targetFollowerData)
        }).catch(async () => {
          await setDoc(targetDocRef, { followers: [targetFollowerData], following: [] }, { merge: true });
        })
      ]);
    })();

    return from(promise);
  }

  unfollowUser(targetUserId: string): Observable<void> {
    const myUid = this.currentUserId;
    if (!myUid) throw new Error('Usuário não autenticado.');

    const myDocRef = this.getFriendsDocRef(myUid);
    const targetDocRef = this.getFriendsDocRef(targetUserId);

    const promise = (async () => {
      const mySnap = await getDoc(myDocRef);
      if (mySnap.exists()) {
        const myData = mySnap.data() as IFriendsDoc;
        const itemToRemove = myData.following?.find(item => item.UID === targetUserId);
        if (itemToRemove) {
          await updateDoc(myDocRef, {
            following: arrayRemove(itemToRemove)
          });
        }
      }

      const targetSnap = await getDoc(targetDocRef);
      if (targetSnap.exists()) {
        const targetData = targetSnap.data() as IFriendsDoc;
        const itemToRemove = targetData.followers?.find(item => item.UID === myUid);
        if (itemToRemove) {
          await updateDoc(targetDocRef, {
            followers: arrayRemove(itemToRemove)
          });
        }
      }
    })();

    return from(promise);
  }

  removeFollower(followerUserId: string): Observable<void> {
    const myUid = this.currentUserId;
    if (!myUid) throw new Error('Usuário não autenticado.');

    const myDocRef = this.getFriendsDocRef(myUid);
    const targetDocRef = this.getFriendsDocRef(followerUserId);

    const promise = (async () => {
      const mySnap = await getDoc(myDocRef);
      if (mySnap.exists()) {
        const myData = mySnap.data() as IFriendsDoc;
        const itemToRemove = myData.followers?.find(item => item.UID === followerUserId);
        if (itemToRemove) {
          await updateDoc(myDocRef, {
            followers: arrayRemove(itemToRemove)
          });
        }
      }

      const targetSnap = await getDoc(targetDocRef);
      if (targetSnap.exists()) {
        const targetData = targetSnap.data() as IFriendsDoc;
        const itemToRemove = targetData.following?.find(item => item.UID === myUid);
        if (itemToRemove) {
          await updateDoc(targetDocRef, {
            following: arrayRemove(itemToRemove)
          });
        }
      }
    })();

    return from(promise);
  }

  addLike(ownerUid: string, itemID: string): Observable<void> {
  const docRef = this.getLikesDocRef(ownerUid);
  const like: ILike = {
    likedAt: new Date().toISOString(),
    uid: this.currentUserId
  };

  const promise = setDoc(docRef, {
    [itemID]: {
      itemID: itemID,
      likes: arrayUnion(like)
    }
  }, { merge: true });
  return from(promise);
}

removeLike(ownerUid: string, itemID: string): Observable<void> {
  const docRef = this.getLikesDocRef(ownerUid);
  const myUid = this.currentUserId;

  const promise = (async () => {
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const currentLikes: ILike[] = data?.[itemID]?.likes || [];
      const updatedLikes = currentLikes.filter(like => like.uid !== myUid);

      await updateDoc(docRef, {
        [`${itemID}.likes`]: updatedLikes
      });
    }
  })();

  return from(promise);
}

checkIfLiked(ownerUid: string, itemID: string): Observable<boolean> {
  const docRef = this.getLikesDocRef(ownerUid);
  const myUid = this.currentUserId;

  return docData(docRef).pipe(
    take(1),
    map((data) => {
      const likesArray: ILike[] = data?.[itemID]?.likes || [];
      return likesArray.some(like => like.uid === myUid);
    })
  );
}

checkLikesCount(ownerUid: string, itemID: string): Observable<number> {
  const docRef = this.getLikesDocRef(ownerUid);
  return docData(docRef).pipe(
    take(1),
    map((data) => {
      const likesArray: ILike[] = data?.[itemID]?.likes || [];
      return likesArray.length;
    })
  );
}

searchUsers(searchTerm: string): Observable<Partial<IUser>[]> {
  const usersCollection = collection(this.firestore, 'users');
  const usersQuery = query(
    usersCollection, 
    where('username', '>=', searchTerm),
    where('username', '<=', searchTerm + '\uf8ff')
  );

  return collectionData(usersQuery).pipe(
    take(1),
    map((users: Partial<IUser>[]) => 
      users.map(user => ({
        username: user.username,
        displayName: user.displayName,
        photoURL: user.photoURL
      }))
    )
  );
}

}