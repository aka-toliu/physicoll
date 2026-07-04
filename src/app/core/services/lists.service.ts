import { inject, Injectable } from '@angular/core';
import { Firestore, doc, setDoc, increment, addDoc, collection, collectionData, docData, deleteDoc, updateDoc, arrayUnion, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { IMovieTrack } from '../../shared/models/IMovies';
import { Auth } from '@angular/fire/auth';
import { IItemList, IList } from '../../shared/models/ILists';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor() { }

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private get userId(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');
    return user.uid;
  }

  private userID = localStorage.getItem('UID');

  createList(list: IList): Observable<string> {
    const colRef = collection(this.firestore, `users/${this.userID}/lists`);
    const newList: IList = {
      ...list,
      createdAt: new Date(),
      items: []
    };
    return from(addDoc(colRef, newList).then(docRef => docRef.id));
  }

  deleteList(listID: string): Observable<void> {
    const docRef = doc(this.firestore, `users/${this.userID}/lists/${listID}`);
    return from(deleteDoc(docRef));
  }

  getUserLists(): Observable<IList[]> {
    const colRef = collection(this.firestore, `users/${this.userID}/lists`);
    return collectionData(colRef, { idField: 'id' }) as Observable<IList[]>;
  }

  getListById(listID: string): Observable<IList | undefined> {
    const docRef = doc(this.firestore, `users/${this.userId}/lists/${listID}`);
    return docData(docRef, { idField: 'id' }) as Observable<IList | undefined>;
  }


  addItemToList(listID: string, movieItem: Omit<IItemList, 'itemId' | 'addedAt'>): Observable<void> {
    const docRef = doc(this.firestore, `users/${this.userID}/lists/${listID}`);
    
    const newItem: IItemList = {
      ...movieItem,
      itemId: crypto.randomUUID(), 
      addedAt: new Date().toISOString()
    };

    const promise = updateDoc(docRef, {
      items: arrayUnion(newItem)
    });

    return from(promise);
  }

  removeItemFromListById(listID: string, itemId: string): Observable<void> {
  const docRef = doc(this.firestore, `users/${this.userId}/lists/${listID}`);

  const promise = getDoc(docRef).then(snapshot => {
    if (!snapshot.exists()) return;

    const data = snapshot.data() as IList;
    if (!data || !data.items) return;

    const updatedItems = data.items.filter(item => item.itemId !== itemId);

    return updateDoc(docRef, { items: updatedItems });
  });

  return from(promise);
}



}
