import { Injectable } from '@angular/core';

import {
  Firestore,
  collection,
  doc,
  collectionData,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Data {
}
