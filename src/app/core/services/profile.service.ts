import { inject, Injectable } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    private firestore: Firestore = inject(Firestore);

    getProfile(uid: string): Observable<any> {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        const promise = getDoc(userDocRef);
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
