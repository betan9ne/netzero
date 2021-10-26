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
    const [docs, setdocs] = useState([])    
    const [id, setid] = useState(null)
    const logout = ()=>{
        firebase.auth().signOut().then(() => {
        
          }).catch((error) => {
            alert(error)
          });
    }

    const getPrecincts = (n) =>{
        setid(n)
        firebase.firestore().collection("precinct").where("neighbourhood_id","==", n.id).onSnapshot((doc)=>{
            const neighbourhood = [];
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              neighbourhood.push(nb)
            })
            setdocs(neighbourhood)
         })
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
        <Input type="text" required value={neighbourhood} onChange={e =>setneighbourhood(e.target.value)} placeholder="Neighbourhood" />
       
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
        <Col xs="3" style={{padding:"20px"}}> <h3>Neighbourhoods</h3><br/>
           
           {neighbourhoods.length  === 0 ? <><p>You have no neighbourhoods</p>     
           </> : 
           <div style={{display:"flex", flexDirection: "column"}}>
           {neighbourhoods.map((nb)=>(
               <p style={{marginBottom:40, background:"#fdb940", border:"2px solid #000000", borderColor: "black",textAlign: "center",  padding:15, width:200, borderRadius:15, fontSize:18, color:"black", marginBottom:30 }}>
            <a style={{color:"black", cursor: "pointer",fontWeight:"bold",}} onClick={()=>getPrecincts(nb)}>{nb.neighbourhood}</a>
            </p>
           ))}
           </div>
           }</Col>
        <Col xs="6" style={{padding:"40px"}}>
        {id && <Link to={{pathname:"/viewNeighbourhood/"+id.id,state: id}} style={{color:"white", background:"#333",
        borderRadius:"10px", padding:"10px 30px"}}>View Precincts ({docs.length})</Link>}
        </Col>
        <Col xs="3">
        {docs && docs.length} Precinct Found<br/><br/>
        {docs && docs.map((p)=>(
            <p>{p.precint}</p>
        ))}
        </Col>

    </Row>
</Container>
           
            <div></div>
        </div>
    )
}

export default Neighbourhood
