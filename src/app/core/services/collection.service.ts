import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs } from '@angular/fire/firestore';
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
  
}