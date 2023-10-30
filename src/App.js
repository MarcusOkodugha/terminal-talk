

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import './App.css';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit,addDoc, serverTimestamp } from 'firebase/firestore';
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
      <div>
        <TabBar></TabBar>
      </div>
      <div>
        <SendWelcomeMesseges></SendWelcomeMesseges>
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
    const displayName = auth.currentUser.displayName;
    
    await addDoc(collection(db, 'messages'), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
      displayName,
    }); 
  
    setFormValue('');
    dummy.current.scrollIntoView({behavior:'smooth'})
  };
  return (
    <>
    <div>
      <div className='terminal'>
        <div>
          {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        </div>
      </div>

      <div ref={dummy}></div>
      <div>
        <StatusBar></StatusBar>
      </div>
      <form onSubmit={sendMessage} className='input-form'>
          <input placeholder='input:' value={formValue} onChange={(e)=> setFormValue(e.target.value)}></input>
          <button type="submit">Send</button>
      </form>
    </div>
    </>
  );
}

function ChatMessage(props){
  const { text, uid, photoURL,createdAt,displayName } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  const altImgURL = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
  let imgToShow=photoURL;

  const options = {
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12:false,
  };
  const date = new Date(createdAt.toDate());
  const formattedDate = new Intl.DateTimeFormat('sv-SE',options).format(date);

  if(photoURL===undefined){
    imgToShow=altImgURL;
  }
  return(
    <div>
      <div className={`message ${messageClass}`}>
      {/* <img src={imgToShow} alt='No img'></img> */}
        <p>
          <span className='time'>
            {formattedDate}
          </span>
          \
          <span>
            {displayName}
          </span>
          \
          <span>
            {text}
          </span>
        </p>
      </div>
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

function SendWelcomeMesseges(){
  return(
    <div>
    </div>
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

function StatusBar(){
  
  return(
    <div className='status-bar'>
      <p>
        !/bin/bash status [Willys]
      </p>
    </div>
  )
}

function TabBar(){
  return(
    <div className='tab-bar'>
      <Tab></Tab>
    </div>
  )
}
function Tab(){
  return(
    <div className='tab'>
      <p>Terminal 1</p>
      <button className='close-button'>x</button>
    </div>
  )
}
export default App;
