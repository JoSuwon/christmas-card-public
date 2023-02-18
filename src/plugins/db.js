/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, equalTo, query, orderByChild } from "firebase/database";
import moment from "moment";
import { nanoid } from 'nanoid';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "authDomain",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId",
  measurementId: "measurementId",
  databaseURL: "databaseURL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export async function writeUserData(userId, user) {
  const db = getDatabase(app);
  await set(ref(db, 'users/' + userId), user);
}

export async function readUserData(userId) {
  const db = getDatabase(app);
  const userRef = ref(db, 'users/' + userId);

  return new Promise(resolve => {
    onValue(userRef, (snapshot) => {
      resolve(snapshot.val());
    });
  });
}

export async function writePost(userId, post) {
  const db = getDatabase(app);
  const id = nanoid();
  post = {
    id,
    userId,
    ...post,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  }
  await set(ref(db, 'posts/' + id), post);

  return id;
}

export async function readPost(postId) {
  const db = getDatabase(app);
  const postRef = ref(db, 'posts/' + postId);

  return new Promise(resolve => {
    onValue(postRef, (snapshot) => {
      resolve(snapshot.val());
    });
  });
}

export async function readPostsByUserId(userId) {
  const db = getDatabase(app);
  const postsRef = query(ref(db, 'posts'), orderByChild('userId'), equalTo(userId));
  // const postsRef = ref(db, 'posts');

  return new Promise(resolve => {
    onValue(postsRef, (snapshot) => {
      resolve(snapshot.val());
    });
  });
}

export async function readReceivePostId(userId) {
  const db = getDatabase(app);
  const receivePostIdRef = ref(db, 'receivePostId/' + userId);

  return new Promise(resolve => {
    onValue(receivePostIdRef, (snapshot) => {
      resolve(snapshot.val());
    });
  });
}

export async function writeReceivePostId(userId, postId) {
  const db = getDatabase(app);
  let receivePostId = await readReceivePostId(userId);

  if(receivePostId?.length > 0) {
    receivePostId.push(postId);
    receivePostId = [... new Set(receivePostId)];
  } else {
    receivePostId = [postId];
  }

  await set(ref(db, 'receivePostId/' + userId), receivePostId);

  return readReceivePostId(userId);
}