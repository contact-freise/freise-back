import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';
import {
  deleteObject,
  FirebaseStorage,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

@Injectable()
export class AppService {
  private _storage: FirebaseStorage;
  firebaseConfig;

  constructor(private configService: ConfigService) {
    this.firebaseConfig = {
      apiKey: this.configService.get<string>('FIREBASE_API_KEY'),
      authDomain: this.configService.get<string>('FIREBASE_AUTH_DOMAIN'),
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: this.configService.get<string>(
        'FIREBASE_MESSAGING_SENDER_ID',
      ),
      appId: this.configService.get<string>('FIREBASE_APP_ID'),
      measurementId: this.configService.get<string>('FIREBASE_MEASUREMENT_ID'),
    };

    const firebaseApp = initializeApp(this.firebaseConfig);
    this._storage = getStorage(
      firebaseApp,
      'gs://' + this.firebaseConfig.storageBucket,
    );
  }

  getAppStorage() {
    return this._storage;
  }

  getStorageBucketUrl() {
    return `https://firebasestorage.googleapis.com/v0/b/${this.firebaseConfig.storageBucket}/o`;
  }

  async updloadFile(file: Express.Multer.File): Promise<string> {
    const storage = this.getAppStorage();
    const storageRef = ref(storage, file.filename);
    const snapshot = await uploadBytes(storageRef, file.buffer)
      .then((snapshot) => {
        console.debug('Uploaded file!', snapshot.ref?.fullPath);
        return snapshot;
      })
      .catch((error) => {
        console.error('Uh-oh, an error occurred! ' + error);
        return error;
      });
    return `${this.getStorageBucketUrl()}/${encodeURIComponent(snapshot.ref?.fullPath)}?alt=media`;
  }

  deleteFile(file: string) {
    if (!file || file.includes('assets')) return;
    const storage = this.getAppStorage();
    const desertRef = ref(storage, file);

    deleteObject(desertRef)
      .then(() => {
        console.debug(`File ${file} deleted successfully`);
      })
      .catch((error) => {
        if (
          error.name === 'FirebaseError' &&
          error.code === 'storage/object-not-found'
        ) {
          console.error(`File ${file} does not exist`);
          return;
        }
        console.error('Uh-oh, an error occurred! ' + error);
      });
  }
}
