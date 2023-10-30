

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import './App.css';

// import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit,addDoc, serverTimestamp } from 'firebase/firestore';
// import { getAnalytics } from 'firebase/analytics';
// import { FieldValue } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDbf52J3aToHHyONnTKAGqivsMpqdcudLo",
  authDomain: "terminal-talk.firebaseapp.com",
  projectId: "terminal-talk",
  storageBucket: "terminal-talk.appspot.com",
  messagingSenderId: "623580911511",
  appId: "1:623580911511:web:37119583cd2bc9e065d6d2",
  measurementId: "G-Y09VT33HC7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const firestore = getFirestore(app);
// const analytics = getAnalytics(app);
const db = getFirestore(app);


function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div>
        <Navbar></Navbar>
      </div>
      <section>
        {user ? <Terminal />:<EmptyFunction />}
      </section>
    </div>
  );
}

function Terminal(){
  const dummy = useRef()
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));
  const [messages] = useCollectionData(q, { idField: 'id' });
  const [formValue,setFormValue]= useState('');


  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
  
    await addDoc(collection(db, 'messages'), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });
  
    setFormValue('');

    dummy.current.scrollIntoView({behavior:'smooth'})
  };
  

  return (
    <>
      <div>
        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <div ref={dummy}></div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=> setFormValue(e.target.value)}></input>
        <button type="submit">Send</button>
      </form>
    </>
  );

}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  const altImgURL = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
  let imgToShow=photoURL;

  if(photoURL===undefined){
    imgToShow=altImgURL;
  }
  return(
    <div className={`message ${messageClass}`}>
     <img src={imgToShow} alt='No img'></img>
      <p>{text}</p>
    </div>
  ) 
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  return(
    <button onClick={signInWithGoogle}>Sign in</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() =>auth.signOut()}>Sign Out</button>
  )
}

function EmptyFunction(){
  
  return(
    <div></div>
    )
  }
  function Navbar(){
  const [user] = useAuthState(auth)
  return(
    <div className='nav'>
       {user ? <SignOut />:<SignIn />}
    </div>
    
  )
}
export default App;
