import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), provideNgxMask(), provideFirebaseApp(() => initializeApp({ "projectId": "physicoll", "appId": "1:797629304898:web:151e29f2da941fe8d1dddb", "storageBucket": "physicoll.firebasestorage.app", "apiKey": "AIzaSyDJQ11QV02mmnpHiClTfCggiVYXD6UlBps", "authDomain": "physicoll.firebaseapp.com", "messagingSenderId": "797629304898", "measurementId": "G-C9YYWNYZDY" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
