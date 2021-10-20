import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import useGetPrecinct from '../hooks/useGetPrecinct';

const ViewNeighbourhood = props => {
    let data = props.location.state
    let precinct = useGetPrecinct(data.id).docs
    const [modal, setModal] = useState(false);
const [precint, setprecint] = useState()
    const toggle = () => setModal(!modal);
  
    const addprecinct = ()=>{
        firebase.firestore().collection('precinct').add(
            {precint: precint, 
                neighbourhood_id: data.id,
                neighbourhood_name: data.neighbourhood,
            createdAt: new Date().toLocaleDateString()
            }).then((data)=>{
            toggle()
        }).catch((e)=>{
            alert(JSON.stringify(e))
        })
    }
    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={toggle}>&times;</button>;


    return (
        <div>
              <Modal isOpen={modal} toggle={toggle}   external={externalCloseBtn}>
        <ModalHeader>Add new precinct</ModalHeader>
        <ModalBody>
        <Input type="email" name="email" id="email" required value={precint} onChange={e =>setprecint(e.target.value)} placeholder="Email" />
       
             </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addprecinct}>Confirm</Button>{' '}
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <Button color="danger" onClick={toggle}>Create precinct</Button>
           {data.neighbourhood}
           <div>
           {precinct.length  === 0 ? <><p>You have no precinct</p>     
                </> : 
                <>
                {precinct.map((nb)=>(
                    <p>
                 <Link to={{pathname:"/viewNeighbourhood",state: nb}}>{nb.precint}</Link>
                 </p>
                ))}
                </>
                }
           </div>
        </div>
    )
}

export default ViewNeighbourhood
