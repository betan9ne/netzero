import React,{useState} from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Container, Row, Col, Button, Label, Input } from 'reactstrap';
import firebase from '../../src/firebase'

function Login() {

    let history = useHistory()

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [errorMsg, seterrorMsg] = useState("")
    const signin = ()=>{
        firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    if(user)
    {
        history.push("Neighbourhood")
    }
    // ...
  })
  .catch((error) => {
      seterrorMsg(error.message)
    var errorCode = error.code;
    var errorMessage = error.message;
  });
    }
    return (
        <Container>
            
          <Row>
        <Col xs="6"><h1>Login</h1></Col>
        <Col xs="6"><h2>Sign In</h2>
        <p>Welcome bback, please login to continue</p>
        <p>{errorMsg}</p>
        <Label for="exampleEmail">Email</Label>
        <Input type="email" name="email" id="email" required value={email} onChange={e =>setemail(e.target.value)} placeholder="Email" />
        <Input type="password" name="password" required value={password} onChange={e =>setpassword(e.target.value)} id="password" placeholder="Password" />
   <p>Forgot password</p>
   <Button color="danger" onClick={()=>signin()}>Sign in</Button>
   {/* <Link to={"/Neighbourhood"}>Sign in</Link> */}
        </Col>
      </Row>
      </Container>
    )
}

export default Login
