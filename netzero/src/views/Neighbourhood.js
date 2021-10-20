import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom'
import useGetNeighbourhood from '../hooks/useGetNeighbourhood'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

function Neighbourhood() {

    let neighbourhoods = useGetNeighbourhood().docs
    let history = useHistory()
    const [neighbourhood, setneighbourhood] = useState("")
    const [modal, setModal] = useState(false);

    const logout = ()=>{
        firebase.auth().signOut().then(() => {
            history.push("/")
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

            <h1>Neighbourhoods</h1>
<Button color="danger" onClick={()=>logout()}>Logout</Button>
            <h3>List of Neighbourhoods</h3>
            <Button color="danger" onClick={toggle}>Create neighbourhood</Button>
                {neighbourhoods.length  === 0 ? <><p>You have no neighbourhoods</p>     
                </> : 
                <>
                {neighbourhoods.map((nb)=>(
                    <p>
                 <Link to={{pathname:"/viewNeighbourhood",state: nb}}>{nb.neighbourhood}</Link>
                 </p>
                ))}
                </>
                }
            <div></div>
        </div>
    )
}

export default Neighbourhood
