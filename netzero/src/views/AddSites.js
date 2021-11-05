import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal,Row, ModalHeader,  ModalBody, ModalFooter, Input, Col, Container } from 'reactstrap';
import useGetSites from '../hooks/useGetSites';

const  AddSites = props => {
    let history = useHistory()
    let data = props.location.state
   
    const [docs, setdocs] = useState([])
    const [model, setmodel] = useState("")
    const [scopeValue, setscopeValue] = useState("")
    const [modelInput1, setmodelInput1] = useState("")
    const [modelINput2, setmodelINput2] = useState("")
    useEffect(() => {
        firebase.firestore().collection("models").get().then((doc)=>{
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

    const calculate  =() =>{
         //transport object
        // let asd = {
        //     precinct_id: data.precinct_id,
        //     neighbourhood_id: data.neighbourhood_id,
        //     block_id: data.id,
        //     model:model.model,
        //     model_tag: model.tag,
        //     modeInput: modelInput1,
        //     scopeValue : scopeValue,
        //     total: scopeValue * modelInput1 * model.emissions
        // }
        //end of transport object

        //infrastructure object
        let asd = {
            precinct_id: data.precinct_id,
            neighbourhood_id: data.neighbourhood_id,
            block_id: data.id,
            model:model.model,
            model_tag: model.tag,
            scopeValue : scopeValue,
            total: scopeValue * model.watts * model.hours
        }
        //end of infrastrucure object

        firebase.firestore().collection("sites").where("block_id","==",data.id).where("model","==",model.model).get().then((doc)=>{
            if(doc.docs.length === 1)
            {
                console.log(doc.docs[0].id)
               firebase.firestore().collection("sites").doc(doc.docs[0].id).update(asd).then(()=>{
                   alert("Scope updated")
               }).catch((e)=>{
                   alert(e)
               })
               return
            }
            else{
                firebase.firestore().collection("sites").add(asd).then((doc)=>{
                    alert("scope added")
                }).catch((e)=>{
                    alert(e)
                })
            }
            
        })


        

    

    }

    return (
        <div>
               <div style={{background:"#fdb940", padding:20}}>
                <Row>
                    <Col><h4 style={{color:"white"}}>Sites</h4>
                    <h6 onClick={()=>history.goBack()}>{data.block}</h6></Col>
                    <Col>  
                 </Col>
                    </Row>           
            </div>
            <Container style={{maxWidth:"100%"}}>
                <Row>
                    <Col xs="3">
                    <br/>
                    
                    
                {docs && docs.map((d)=>(
                    <p onClick={()=>setmodel(d)} key={d.id} value={d.model}>{d.model}</p>
                )
                )}
            <br/><br/>
            
                    </Col>
                    <Col xs="4"> <p>{model.model}</p>
                    {model.tag === "Transport" ? <div>
                    <Input type="text" required onChange={(e) => setscopeValue(e.target.value)} placeholder="Enter scope value here" />
           <br/> <Input type="text" required onChange={(e) => setmodelInput1(e.target.value)} placeholder="Enter model input 1" />
            <p>{model.emissions}</p>
            <Button color="primary" onClick={()=>calculate()} >Calculate</Button>
                    </div> : <>            
                     <br/>          
            </>
            }

            {model.tag === "Infrastructure" ? <div>
                    <Input type="text" required onChange={(e) => setscopeValue(e.target.value)} placeholder="Enter scope value here" />
              <p>{model.watts} - {model.hours}</p>
            <Button color="primary" onClick={()=>calculate()} >Calculate</Button>
                    </div> : <>            
                     <br/>          
            </>
            }
                    </Col>
                    <Col xs="4"></Col>
                </Row>
            </Container>
         
        </div>
    )
}

export default AddSites
