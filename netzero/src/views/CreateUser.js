import React,{useState} from 'react'
import { Button, Input } from 'reactstrap'
import firebase from '../../src/firebase'

function CreateUser() {

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    var user
    const createAccount = () =>{
        firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
     user = userCredential.user;
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
  });
    }
    return (
        <div>
            <h1>Create New user</h1>
            <p>{JSON.stringify(user)}</p>
            <Input type="email" name="email" id="email" placeholder="Email" required value={email} onChange={e =>setemail(e.target.value)} />
        <Input type="password" name="password" id="password" placeholder="Password" required value={password} onChange={e =>setpassword(e.target.value)} />
        <Button color="danger" onClick={()=>createAccount()}>Create account</Button>
        </div>
    )
}

export default CreateUser
