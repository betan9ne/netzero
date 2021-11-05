import React,{useState , useEffect} from 'react'
import { Button, Input } from 'reactstrap'
import firebase from '../../src/firebase'
import {Row, Container, Col} from 'reactstrap'
import useGetUsers from './../hooks/useUsers'
import {useHistory} from 'react-router-dom'
function CreateUser() {
  let history = useHistory()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [username, setusername] = useState("")
    const [msg, setmsg] = useState("")
 
    var user
 
let users = useGetUsers().docs
console.log(users)
  const addUser = () =>{
    let data =  {
      email : email,
      username : username
    }
    firebase.firestore().collection("users").add(data).then((doc)=>{
      alert("User account created successfully")
      setemail("")
      setpassword("")
      setusername("")
    }).catch((e)=>{
      alert("Error found", e)
    })
  }

    const createAccount = () =>{
        firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
     user = userCredential.user;
     addUser()
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode,  errorMessage)
    // ..
  });
    }
    return (
        <>
            <div style={{background:"#fdb940", padding:20}}>
                <Row>
                    <Col><h3 style={{color:"white"}}>Manages users</h3>
                    <h5 onClick={()=>history.goBack()} style={{cursor:"pointer"}}>Go Back</h5>
                    </Col>
                    </Row>
                    </div>
                  
          <Container style={{maxWidth:"100%"}}>
            <Row>
             
              <Col xs="3" style={{padding:20}}>
              <h4>Create a new user</h4>
              <br/>
            <Input type="email" name="email" id="email" placeholder="Email" required value={email} onChange={e =>setemail(e.target.value)} />
            <br/>
        <Input type="text"  placeholder="user name" required value={username} onChange={e =>setusername(e.target.value)} />
 <br/>       <Input type="password" name="password" id="password" placeholder="Password" required value={password} onChange={e =>setpassword(e.target.value)} />
     <br/>   <Button color="danger" onClick={()=>createAccount()}>Create account</Button>
        <p>{msg}</p>
        </Col>
        <Col>
        <br/>
        <h4>List of users</h4>
        {users && users.map((u)=>(
          <p>{u.email}</p>
        ))}</Col>
              <Col></Col>
            </Row>
          </Container>
           
        </>
    )
}

export default CreateUser
