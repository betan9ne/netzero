import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom'
import useGetNeighbourhood from '../hooks/useGetNeighbourhood'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Row, Input, Container } from 'reactstrap';

function Neighbourhood() {

    let neighbourhoods = useGetNeighbourhood().docs
    let history = useHistory()
    const [neighbourhood, setneighbourhood] = useState("")
    const [modal, setModal] = useState(false);

    const logout = ()=>{
        firebase.auth().signOut().then(() => {
        
          }).catch((error) => {
            alert(error)
          });
    }

    const addneighbourhood = ()=>{
        firebase.firestore().collection('neighbourhood').add({neighbourhood: neighbourhood, createdAt: new Date().toLocaleDateString()}).then((data)=>{
            toggle()
        }).catch((e)=>{
            alert(JSON.stringify(e))
        })
    }

    

    const toggle = () => setModal(!modal);
  
    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={toggle}>&times;</button>;

    return (
        <div>
             <Modal isOpen={modal} toggle={toggle}   external={externalCloseBtn}>
        <ModalHeader>Add new neighbourhood</ModalHeader>
        <ModalBody>
        <Input type="email" name="email" id="email" required value={neighbourhood} onChange={e =>setneighbourhood(e.target.value)} placeholder="Email" />
       
             </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addneighbourhood}>Confirm</Button>{' '}
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
            <div style={{background:"#fdb940", padding:20}}>
                <Row>
                    <Col><h1 style={{color:"white"}}>Neighbourhoods</h1></Col>
                    <Col> <Button color="info" onClick={toggle}>Create neighbourhood</Button>
                    <Button color="danger"  style={{marginLeft:20 }}onClick={()=>logout()}>Logout</Button></Col>
                    </Row>           
            </div>
            
<Container>
    <Row>
        <Col xs="3"> <p>List of Neighbourhoods</p>
           
           {neighbourhoods.length  === 0 ? <><p>You have no neighbourhoods</p>     
           </> : 
           <>
           {neighbourhoods.map((nb)=>(
               <p style={{marginBottom:40}}>
            <Link style={{background:"#fdb940", padding:15, width:200, borderRadius:15, fontSize:18, color:"black", marginBottom:30 }} to={{pathname:"/viewNeighbourhood/"+nb.id,state: nb}}>{nb.neighbourhood}</Link>
            </p>
           ))}
           </>
           }</Col>
        <Col xs="6"><p>Statistics</p></Col>
        <Col xs="3"><p>Summary</p></Col>

    </Row>
</Container>
           
            <div></div>
        </div>
    )
}

export default Neighbourhood
