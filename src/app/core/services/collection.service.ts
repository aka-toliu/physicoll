import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getCountFromServer, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { ICollectionItem } from '../../shared/models/ICollection';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor() { }

  private firestore: Firestore = inject(Firestore);

  addToCollection(uid: string | null, item: ICollectionItem): Observable<ICollectionItem> {
    const userCollectionRef = collection(this.firestore, `users/${uid}/collection`);
    const promise = addDoc(userCollectionRef, item).then(docRef => {
      return { ...item, id: docRef.id } as ICollectionItem;
    });
    return from(promise);
  }

  editCollectionItem(uid: string | null, itemId: string, updatedItem: Partial<ICollectionItem>): Observable<void> {
    const docRef = doc(this.firestore, `users/${uid}/collection/${itemId}`);
    const promise = getDoc(docRef).then(docSnap => {
      if (docSnap.exists()) {
        return updateDoc(docRef, updatedItem);
      } else {
        throw new Error('Item não encontrado');
      }
    });
    return from(promise);
  }

  deleteCollectionItem(uid: string | null, itemId: string): Observable<void> {
    const docRef = doc(this.firestore, `users/${uid}/collection/${itemId}`);
    const promise = getDoc(docRef).then(docSnap => {
      if (docSnap.exists()) {
        return deleteDoc(docRef);
      } else {
        throw new Error('Item não encontrado');
      }
    });
    return from(promise);
  }

  getCollection(uid: string | null): Observable<ICollectionItem[]> {
    const userCollectionRef = collection(this.firestore, `users/${uid}/collection`);
    const promise = getDocs(userCollectionRef).then(querySnapshot => {
      const items: ICollectionItem[] = [];
      querySnapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() } as ICollectionItem);
      });
      return items;
    });
    return from(promise);
  }

  getCollectionItem(uid: string | null, itemId: string): Observable<ICollectionItem | null> {
    const docRef = doc(this.firestore, `users/${uid}/collection/${itemId}`);
    const promise = getDoc(docRef).then(docSnap => {
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ICollectionItem;
      } else {
        return null;
      }
    });
    return from(promise);
  }

  getCollectionCount(uid: string): Observable<number> {
    const collectionRef = collection(this.firestore, `users/${uid}/collection`);
    const promise = getCountFromServer(collectionRef).then(snapshot => {
      return snapshot.data().count; 
    });
    return from(promise);
  }

  getFormatCount(uid: string, format: string): Observable<number> {
    const collectionRef = collection(this.firestore, `users/${uid}/collection`);
    const q = query(collectionRef, where('format', '==', format));
    const promise = getCountFromServer(q).then(snapshot => snapshot.data().count);
    return from(promise);
  }
  
}
