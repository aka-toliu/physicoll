import { inject, Injectable } from '@angular/core';
import { 
  Firestore, 
  doc, 
  docData, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  getDoc,
  setDoc 
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { IFriendUser, IFriendsDoc } from '../../shared/models/ISocial';

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

  /**
   * 1. Ver lista de seguidores (Followers) de um usuário
   */
  getFollowers(userId: string = this.currentUserId): Observable<IFriendUser[]> {
    const docRef = this.getFriendsDocRef(userId);
    return docData(docRef).pipe(
      map((data) => (data as IFriendsDoc)?.followers || [])
    );
  }

  /**
   * 2. Ver lista de quem o usuário está seguindo (Following)
   */
  getFollowing(userId: string = this.currentUserId): Observable<IFriendUser[]> {
    const docRef = this.getFriendsDocRef(userId);
    return docData(docRef).pipe(
      map((data) => (data as IFriendsDoc)?.following || [])
    );
  }

  /**
   * 3. Checar se você segue determinado usuário
   */
  isFollowing(targetUserId: string): Observable<boolean> {
    return this.getFollowing(this.currentUserId).pipe(
      map((followingList) => followingList.some(user => user.UID === targetUserId))
    );
  }

  /**
   * 4. Seguir um usuário
   * Adiciona o targetUserId na sua lista de `following` 
   * e adiciona o seu UID na lista de `followers` do targetUserId.
   */
  followUser(targetUserId: string): Observable<void> {
  const myUid = this.currentUserId;
  if (!myUid || myUid === targetUserId) throw new Error('Operação inválida.');

  const now = new Date().toISOString();

  const myDocRef = this.getFriendsDocRef(myUid);
  const targetDocRef = this.getFriendsDocRef(targetUserId);

  const promise = (async () => {
    // 1. Verifica se EU já sigo esse usuário lendo o meu documento
    const mySnap = await getDoc(myDocRef);
    if (mySnap.exists()) {
      const myData = mySnap.data() as IFriendsDoc;
      const alreadyFollowing = myData.following?.some(item => item.UID === targetUserId);
      
      // Se já segue, cancela a operação para não duplicar
      if (alreadyFollowing) return;
    }

    const myFollowingData: IFriendUser = { UID: targetUserId, followedAt: now };
    const targetFollowerData: IFriendUser = { UID: myUid, followedAt: now };

    // 2. Se não segue, realiza a gravação em ambos os documentos
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

  /**
   * 5. Deixar de seguir / Remover seguidor
   * Como o Firestore `arrayRemove` exige o objeto exato para remoção em arrays,
   * lemos o documento antes para extrair o item correto com seu `followedAt`.
   */
  unfollowUser(targetUserId: string): Observable<void> {
    const myUid = this.currentUserId;
    if (!myUid) throw new Error('Usuário não autenticado.');

    const myDocRef = this.getFriendsDocRef(myUid);
    const targetDocRef = this.getFriendsDocRef(targetUserId);

    const promise = (async () => {
      // Pega meus dados atuais
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

      // Pega os dados do usuário alvo para remover-me da lista de seguidores dele
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

  /**
   * 6. Remover um seguidor (Remover da SUA lista de `followers`)
   */
  removeFollower(followerUserId: string): Observable<void> {
    const myUid = this.currentUserId;
    if (!myUid) throw new Error('Usuário não autenticado.');

    const myDocRef = this.getFriendsDocRef(myUid);
    const targetDocRef = this.getFriendsDocRef(followerUserId);

    const promise = (async () => {
      // Remove ele da minha lista de seguidores
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

      // Remove eu da lista 'following' dele
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
}