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

  private _userProfile = signal<User | null | undefined>(undefined);
  public userProfile = this._userProfile.asReadonly();

  public isAuthenticated = computed(() => !!this._userProfile());

  private _userData = signal<any | null | undefined>(undefined);
  public userData = this._userData.asReadonly();

  constructor() {
    user(this.firebaseAuth).subscribe(async (firebaseUser) => {
      this._userProfile.set(firebaseUser);

      if (firebaseUser) {
        const profileData = await this.checkOrCreateProfile(firebaseUser);
        this._userData.set(profileData);
      } else {
        this._userData.set(null);
      }
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
          this._userData.set(profileData);
        });

        this._userProfile.set(promise.user);
        this.router.navigate(['/profile']);

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
    })
  );
}



  async checkOrCreateProfile(user: User): Promise<any> {

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      return userSnap.data();
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
