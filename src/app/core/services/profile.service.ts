import { inject, Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { IProfile } from '../../shared/models/IProfile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    private firestore: Firestore = inject(Firestore);

    getProfile(uid: string): Observable<IProfile> {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        const promise = getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) {
                return docSnap.data() as IProfile;
            } else {
                throw new Error('Perfil não encontrado');
            }
        });
        return from(promise);
    }

    getProfileByUsername(username: string): Observable<IProfile>{
        const usersCollectionRef = collection(this.firestore, 'users');
        const q = query(usersCollectionRef, where('username', '==', username));
        const promise = getDocs(q).then(querySnapshot => {
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { uid: doc.id, ...doc.data() } as IProfile;
            } else {
                throw new Error('Perfil não encontrado');
            }
        });
        return from(promise);
    }


    createProfile(uid: string, profileData: any): Observable<void> {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        const promise = setDoc(userDocRef, profileData);
        return from(promise);
    }
    
    verifyProfileExists(uid: string): Observable<boolean> {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        const promise = getDoc(userDocRef).then(docSnap => docSnap.exists());
        return from(promise);
    }


}
