import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Input } from 'reactstrap';
import useGetPrecinct from '../hooks/useGetPrecinct';

const ViewNeighbourhood = props => {
    let data = props.location.state
    let precinct = useGetPrecinct(data.id).docs
    const [modal, setModal] = useState(false);
    const [precint, setprecint] = useState()
    const [p, setp] = useState(null)
    const [docs, setdocs] = useState([])
    const toggle = () => setModal(!modal);
  

    const getBlocks = (p) =>{
        setp(p)
        firebase.firestore().collection("blocks").where("precinct_id","==", p.id).onSnapshot((doc)=>{
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
        <Input type="text" required value={precint} onChange={e =>setprecint(e.target.value)} placeholder="Email" />
       
             </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addprecinct}>Confirm</Button>{' '}
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <div style={{background:"#fdb940", padding:20}}>
                <Row>
                    <Col><h1 style={{color:"white"}}>Precincts</h1>
                    <h4>{data.neighbourhood}</h4>
                    </Col>
                    <Col> <Button color="danger" onClick={toggle}>Create precinct</Button>
                    
                    </Col>
                    </Row>           
            </div>
           
         <Container>
             <Row>
                 <Col>
                 <h3>List of Precincts</h3>
                  {precinct.length  === 0 ? <p>You have no precinct</p> : <>
                    {precinct.map((nb)=>(
                        <p style={{marginBottom:40, background:"#fdb940", border:"2px solid #000000", borderColor: "black",textAlign: "center",  padding:15, width:200, borderRadius:15, fontSize:18, color:"black", marginBottom:30 }}>
        <a onClick={()=>getBlocks(nb)} style={{color:"black", cursor: "pointer",fontWeight:"bold",}} > {nb.precint}</a>
                 {/* <Link to={{pathname:"/viewPrecinct/"+nb.id,state: nb}}>{nb.precint}</Link> */}
                 </p>
                ))}
                 </> }</Col>
                 <Col xs="6" style={{padding:"40px"}}>
        {p && <Link to={{pathname:"/viewPrecinct/"+p.id,state: p}} style={{color:"white", background:"#333",
        borderRadius:"10px", padding:"10px 30px"}}>View Blocks ({docs.length})</Link>}
        </Col>
        <Col xs="3">
        {docs && docs.length} Blocks Found<br/><br/>
        {docs && docs.map((p)=>(
            <p>{p.block}</p>
        ))}
        </Col>
             </Row>
         </Container>    
        </div>
    )
}

export default ViewNeighbourhood
