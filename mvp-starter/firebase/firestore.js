/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  querySnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { getDownloadURL } from "./storage";

const RECEIPTS_COLLECTION = "receipts";
export async function addReceipt(
  uid,
  date,
  locationName,
  address,
  items,
  amount,
  imageBucket
) {
  addDoc(collection(db, RECEIPTS_COLLECTION), {
    uid,
    date,
    locationName,
    address,
    items,
    amount,
    imageBucket,
  });
}

export async function getReceipts(uid, setReceipts, setIsLoadingReceipts) {
  const q = query(
    collection(db, RECEIPTS_COLLECTION),
    where("uid", "==", uid),
    orderBy("date", "desc")
  );
  const unsubscribe = onSnapshot(q, async (snapshot) => {
    let receipts = [];
    for (const doc of snapshot.docs) {
      const receipt = doc.data();
      await receipts.push({
        ...receipt,
        date: receipt["date"].toDate(),
        id: doc.id,
        imageUrl: await getDownloadURL(receipt["imageBucket"]),
      });
    }
    setReceipts(receipts);
    setIsLoadingReceipts(false);
  });
  return unsubscribe;
}

export function updateReceipt(
  docId,
  uid,
  date,
  locationName,
  address,
  items,
  amount,
  imageBucket
) {
  setDoc(doc(db, RECEIPTS_COLLECTION, docId), {
    uid,
    date,
    locationName,
    address,
    items,
    amount,
    imageBucket,
  });
}

export function deleteReceipt(docId) {
  deleteDoc(doc(db, RECEIPTS_COLLECTION, docId));
}
