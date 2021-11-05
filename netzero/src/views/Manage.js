import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal,Row, ModalHeader, ModalBody, ModalFooter, Input, Col, Container } from 'reactstrap';

function Manage() {

    const [docs, setdocs] = useState([])
    const [modelInput, setmodelInput] = useState("")
    const [selectedModel, setselectedModel] = useState([])
    const [factorInput, setfactorInput] = useState("")

    useEffect(() => {
        firebase.firestore().collection("models").onSnapshot((doc)=>{
            const users = [];
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              users.push(nb)
            })
            setdocs(users)
        }) 
    }, [])

    const addMOdelInput = () =>{
        firebase.firestore().collection("models").add({model:modelInput, tag:"Infrastructure"}).then(()=>{
            setmodelInput("")
            alert("Model added Successfully")
          
        }).catch((e)=>{
            alert(e)
        })
    }

    const addFactors = () =>{
        firebase.firestore().collection("models").doc(selectedModel.id).update({hours:factorInput}).then(()=>{
            setmodelInput("")
            alert("factor added Successfully")
          
        }).catch((e)=>{
            alert(e)
        })
    }


    return (
        <div>
            <h4>Admin</h4>
            <Container style={{maxWidth:"100%"}}>
                <Row>
                    <Col xs="3">
                        <h6>Add Model Inputs</h6>
                        <Input type="text" required onChange={(e) => setmodelInput(e.target.value)} placeholder="Enter model here" />
                        <br/>
                        <Button color="primary" onClick={()=>addMOdelInput()}>Confirm</Button>
                    </Col>
                    <Col xs="3">
                        {docs && docs.map((d)=>(
                            <p onClick={()=>setselectedModel(d)}>{d.model} - {d.emissions}<br/>{d.id}</p>
                        ))}
                    </Col>
                    <Col xs="3">
                    <p>{selectedModel.model}</p>
                    <Input type="text" required onChange={(e) => setfactorInput(e.target.value)} placeholder="Enter factor here" />
                        <br/>
                        <Button color="primary" onClick={()=>addFactors()}>Confirm</Button>
                 

                    </Col>
                    <Col xs="3"></Col>
                </Row>
            </Container>
        </div>
    )
}

export default Manage
