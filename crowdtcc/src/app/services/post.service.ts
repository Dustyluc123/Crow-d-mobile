// src/app/services/post.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  where,
  doc,
  getDoc,
  DocumentSnapshot,
  QuerySnapshot,
  DocumentData,
  QueryConstraint
} from '@angular/fire/firestore';
// import { Post } from './post.interface'; // <-- REMOVA ESTA LINHA (ANTIGA LINHA 18)
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);
  postCollection = collection(this.firestore, 'posts');

  async getUserProfile(uid: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userDoc = await getDoc(userDocRef);
    return userDoc.data();
  }

  async getPosts(
    lastVisible: DocumentSnapshot<DocumentData> | null,
    activeFeedType: string,
    userProfile: any
  ): Promise<QuerySnapshot<DocumentData>> {

    const constraints: QueryConstraint[] = [
      orderBy('timestamp', 'desc'),
      limit(10)
    ];

    if (lastVisible) {
      constraints.push(startAfter(lastVisible));
    }

    if (activeFeedType === 'friends') {
      const currentUser = this.authService.currentUser.value;
      if (!currentUser) return { docs: [], empty: true } as unknown as QuerySnapshot<DocumentData>;

      const friendsSnapshot = await getDocs(collection(this.firestore, `users/${currentUser.uid}/friends`));
      const friendIds = friendsSnapshot.docs.map(doc => doc.id);

      if (friendIds.length > 0) {
        constraints.push(where('authorId', 'in', friendIds));
      } else {
        return { docs: [], empty: true } as unknown as QuerySnapshot<DocumentData>;
      }
    } else if (activeFeedType === 'hobbies') {
      const userHobbies = userProfile?.hobbies || [];
      if (userHobbies.length > 0) {
        constraints.push(where('hobbies', 'array-contains-any', userHobbies));
      } else {
        return { docs: [], empty: true } as unknown as QuerySnapshot<DocumentData>;
      }
    }

    const finalQuery = query(this.postCollection, ...constraints);
    return getDocs(finalQuery);
  }
}
