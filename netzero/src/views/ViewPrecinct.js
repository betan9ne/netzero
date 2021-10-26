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
                    <Col><h1 style={{color:"white"}}>Neighbourhoods</h1></Col>
                    <Col> <Button color="info" onClick={toggle}>Create neighbourhood</Button>
                 </Col>
                    </Row>           
            </div>
            
   <Container>
       <Row>
       <Col xs="3" style={{padding:"20px"}}> <h3>Neighbourhoods</h3><br/></Col>
         <Col xs="6"></Col>
           <Col  xs="3"></Col>
       </Row>
   </Container>
            <h1>{data.precint}</h1>
            <Button color="danger" onClick={toggle}>Create Block</Button>
           {blocks.length  === 0 ? <><p>You have no blocks</p>     
                </> : 
                <>
                <h4>List of Blocks</h4>
                {blocks.map((nb)=>(
                    <p>
                 <Link to={{pathname:"/viewBlock/"+nb.id,state: nb}}>{nb.block}</Link>
                 </p>
                ))}
                </>
                }
        </div>
    )
}

export default ViewPrecinct
