import { computed, inject, Injectable, signal } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, user, User, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { from, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firebaseAuth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router = inject(Router);

  public isAuthenticated = computed(() => !!this.userData());

  private _userData = signal<any | null | undefined>(undefined);
  public userData = this._userData.asReadonly();

  constructor() {
    user(this.firebaseAuth).subscribe(async (firebaseUser) => {
      this._userData.set(firebaseUser);
    });
  }

  login(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(
      (response) => {
        return response;
      },
      (error) => { throw error }
    );
    return from(promise);
  }

  loginWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.firebaseAuth, provider).then(
      (promise) => {

        this.checkOrCreateProfile(promise.user).then(profileData => {
          this.router.navigate(['/profile']);
        });
        
        return promise
      },
      (error) => { throw error }
    );
    return from(promise);
  }

logout(): Observable<void> {
  return from(signOut(this.firebaseAuth)).pipe(
    tap(() => {
      this.router.navigate(['/login']);
      localStorage.removeItem('UID');
    })
  );
}



  async checkOrCreateProfile(user: User): Promise<any> {

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const profileData = userSnap.data();
      this._userData.set(profileData);
      localStorage.setItem('UID', user.uid);
      return profileData;
    } else {
      const newUserProfile = {
        displayName: user.displayName || `User${user.uid.substring(0, 5)}`,
        photoURL: user.photoURL || 'https://example.com/default-profile.png',
        username: `user_${user.uid.substring(0, 5)}`,
        createdAt: new Date(),
        followers: [],
        following: [],
        badges: [],
        config: {
          theme: 'light',
          notifications: true,
          privateProfile: false,
          showCollections: true,
          showWishlist: true,
          showActivity: true
        }
      };
      await setDoc(userDocRef, newUserProfile);
      return newUserProfile;
    }
  }

}
