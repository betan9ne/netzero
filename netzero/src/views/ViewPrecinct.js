import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal, ModalHeader, ModalBody, Container, Row, Col, ModalFooter, Input } from 'reactstrap';
import useGetBlocks from '../hooks/useGetBlocks';


const ViewPrecinct = props => {

    let data = props.location.state
    let blocks = useGetBlocks(data.id).docs
    const [modal, setModal] = useState(false);
    const [block, setblock] = useState()
    const [b, setb] = useState([])

    const toggle = () => setModal(!modal);
  
    const addblock = ()=>{
        firebase.firestore().collection('blocks').add(
            {block: block, 
            precinct_id : data.id,
            neighbourhood_id: data.neighbourhood_id,
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
        <Input type="text" required value={block} onChange={e =>setblock(e.target.value)} placeholder="block" />
       
             </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addblock}>Confirm</Button>{' '}
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
   
      <div style={{background:"#fdb940", padding:20}}>
                <Row>
                    <Col><h1 style={{color:"white"}}>Blocks</h1>
                    <h4>{data.precint}</h4></Col>
                    <Col>  <Button color="danger" onClick={toggle}>Create Block</Button>
                 </Col>
                    </Row>           
            </div>
            
   <Container>
       <Row>
       <Col xs="3" style={{padding:"20px"}}><h3>Blocks</h3><br/>
       {blocks.length  === 0 ? <><p>You have no blocks</p>     
                </> : 
                <>
                {blocks.map((nb)=>(
                    <p style={{mbackground:"#fdb940", border:"2px solid #000000", borderColor: "black",textAlign: "center",  padding:15, width:200, borderRadius:15, fontSize:18, color:"black", marginBottom:30 }}>
                    {/* to={{pathname:"/viewBlock/"+nb.id,state: nb}} */}
                 <a onClick={()=>setb(nb)} style={{color:"black", cursor: "pointer",fontWeight:"bold",}}  >{nb.block}</a>
                 </p>
                ))}
                </>
                }
       </Col>
         <Col xs="6" style={{padding:"40px"}}>
        {b.id === undefined ? null :  <Link to={{pathname:"/setSites/"+b.id,state: b}} style={{color:"white", background:"#333",
        borderRadius:"10px", padding:"10px 30px"}}>Assign Site</Link>}
         </Col>
           <Col  xs="3"></Col>
       </Row>
   </Container>
         
        </div>
    )
}

export default ViewPrecinct
