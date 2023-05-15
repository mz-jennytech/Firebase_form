import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  getDoc, updateDoc
} from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyDUDr5b7wj9afw4iDXA8Ozn2g255r4zCfo",
  authDomain: "fir-9-dojo-be99e.firebaseapp.com",
  projectId: "fir-9-dojo-be99e",
  storageBucket: "fir-9-dojo-be99e.appspot.com",
  messagingSenderId: "994408324953",
  appId: "1:994408324953:web:1d488c3a7b65aa68e7f648"
};

// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'books')

//queries
const q = query(colRef, orderBy('createdAt'))

// reaal time collecion data
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = []
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id })
  })
  console.log(books)
})

// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()
  
  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
})

// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
})

//get a single document
const docRef = doc(db, 'books', 'zgLapbwM4Vr23lak6iJA')

  //update for new changes
const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
  })

//updating a document
// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, {
    title: 'updated title'
  })
  .then(() => {
    updateForm.reset()
  })

})

// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      //console.log('user created:', userCredential.user)
      signupForm.reset()  
    })
    .catch((err) => {
      console.log(err.message)
    })
})
// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
     // console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
     //console.log('user logged in:', userCredential.user)
      loginForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user ststus changed', user)
  
})
// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing')
  unsubCol()
  unsubDoc()
  unsubAuth()
})