import { inject, Injectable } from '@angular/core';
import { addDoc, collection, CollectionReference, DocumentData, Firestore, QuerySnapshot, getDocs, limit, query, where, deleteDoc } from '@angular/fire/firestore';
import { from, map, Observable, of } from 'rxjs';
import { IWishlistItem } from '../../shared/models/IWishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor() { }

  private firestore: Firestore = inject(Firestore);


  getWishlist(uid: string): Observable<IWishlistItem[]> {
    const userCollectionRef = collection(this.firestore, `users/${uid}/wishlist`);
        const promise = getDocs(userCollectionRef).then(querySnapshot => {
          const items: IWishlistItem[] = [];
          querySnapshot.forEach(doc => {
            items.push({ id: doc.id, ...doc.data() } as IWishlistItem);
          });
          return items;
        });
        return from(promise);
  }

  addToWishlist(uid: string, item: IWishlistItem): Observable<IWishlistItem> {
    const userCollectionRef = collection(this.firestore, `users/${uid}/wishlist`);
    const promise = addDoc(userCollectionRef, item).then(docRef => {
      return { ...item, id: docRef.id } as IWishlistItem;
    });
    return from(promise);
  }

  removeFromWishlist(uid: string, imdbID: string): Observable<void> {
    const wishlistRef = collection(this.firestore, 'users', uid, 'wishlist');
    const q = query(wishlistRef, where("imdbID", "==", imdbID), limit(1));

    const promise = getDocs(q).then(querySnapshot => {
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        return deleteDoc(docRef);
      }
      return;
    });

    return from(promise);
  }

  verifyInWishlist(uid: string, imdbID: string): Observable<boolean> {

    const userDocRef = collection(this.firestore, `users/${uid}/wishlist`);
    const q = query(userDocRef, where("imdbID", "==", imdbID), limit(1));

    const promise = getDocs(q).then(querySnapshot => {
      return !querySnapshot.empty
    })
      .catch(error => {
        console.error('Erro ao verificar item na wishlist:', error);
        return false;
      });

    return from(promise);
  }

}

