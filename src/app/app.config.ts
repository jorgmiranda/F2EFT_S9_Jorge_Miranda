import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

/**
 * App Config
 */
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),
      provideFirebaseApp (()=>
        initializeApp({
          apiKey: "AIzaSyBPoMNLlOSzZPLcj4vSDVN5vC9bu1SxDGU",
          authDomain: "sumativa3-e62f1.firebaseapp.com",
          projectId: "sumativa3-e62f1",
          storageBucket: "sumativa3-e62f1.appspot.com",
          messagingSenderId: "648196024739",
          appId: "1:648196024739:web:ca2b80afb4c9f7d275d216",
          measurementId: "G-8XCL8GX3VE"
        })
      ),
      provideStorage (() => getStorage())
    
  ]
};
