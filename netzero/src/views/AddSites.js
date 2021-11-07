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
    const [category, setcategory] = useState("")
   
    const getModels  = (cat) =>{
        firebase.firestore().collection("models").where("tag","==", cat).get().then((doc)=>{
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
    }
      
    

    function handleChange (event){
        getModels(event.target.value)
        setcategory(event.target.value)
    }

    const calculate  =() =>{
        let electricity = 1.1
        let gas = 0.2
        if(category === "Transport")
                {
            //transport object
            let asd = {
                precinct_id: data.precinct_id,
                neighbourhood_id: data.neighbourhood_id,
                block_id: data.id,
                model:model.model,
                model_tag: model.tag,
                modeInput: modelInput1,
                scopeValue : scopeValue,
                total: scopeValue * modelInput1 * model.emissions
            }
            //end of transport object
            sendToDB(asd)
            return
        }
        else if(category === "Infrastructure")
        {

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
        sendToDB(asd)
        return
        }
        else if(category=== "Buildings")
        {
  //buildings object
  let f1 = (parseInt(scopeValue) * parseInt(model.electricity) * electricity)
  let f2 = (parseInt(scopeValue) * parseInt(model.gas) * gas)
  let asd = {
      precinct_id: data.precinct_id,
      neighbourhood_id: data.neighbourhood_id,
      block_id: data.id,
      model:model.model,
      model_tag: model.tag,
      scopeValue : scopeValue,
      total_carbon_emissions_electricity : parseInt(scopeValue) * parseInt(model.electricity) * electricity,
      lighting :f1 * model.lighting /100,
      lighting_external : f1*model.lighting_external/100,
      appliances : f1*model.appliances/100,
      space_heating : f1*model.space_heating/100,
      cooling : f1*model.cooling/100,
      water_heating: f1*model.water_heating/100,
      pool_pump: f1*model.pool_pump/100,
      cooking: f1*model.cooking/100,
      gas_water_heating: f2*model.gas_water_heating/100,
      gas_cooking: f2*model.gas_cooking/100,
      total_carbon_emissions_gas : parseInt(scopeValue) * parseInt(model.gas) * gas,

     
  }
  //end of buildings
  sendToDB(asd)
  return
        }    
    
    }

    const sendToDB = (object) =>{
        firebase.firestore().collection("sites").where("block_id","==",data.id).where("model","==",model.model).get().then((doc)=>{
            if(doc.docs.length === 1)
            {
                console.log(doc.docs[0].id)
               firebase.firestore().collection("sites").doc(doc.docs[0].id).update(object).then(()=>{
                   alert("Scope updated")
               }).catch((e)=>{
                   alert(e)
               })
               return
            }
            else{
                firebase.firestore().collection("sites").add(object).then((doc)=>{
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
                <Col xs="2">
                <br/>
                <h6>Select a scope</h6>
                <br/>
                <Input
        id="exampleSelect"
        name="select"
        type="select"
        value={category} onChange={handleChange}
      >
         <option value={""}>Select a category</option>
                        <option value="Transport">Transport</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Buildings">Buildings</option>
      </Input>
                          
                </Col>
                    <Col xs="3">
                   
                    <br/>
                    <h6>{category}</h6>
                    <br/>
                {docs && docs.map((d)=>(
                    <>
                    <p onClick={()=>setmodel(d)} style={{cursor:"pointer"}} key={d.id} value={d.model}>{d.model}</p>
                    <hr/>
                    </>
                    )
                )}
            <br/><br/>
            
                    </Col>
                    <Col xs="2"><br/> <h6>{model.model}</h6><br/>
                    {model.tag === "Transport" ? <>
                    <Input type="text" required onChange={(e) => setscopeValue(e.target.value)} placeholder="Enter number of cars" />
           <br/> <Input type="text" required onChange={(e) => setmodelInput1(e.target.value)} placeholder="Enter number of Kms annually" />
           <br/>
                      </> : <>            
                            
            </>
            }

            {model.tag === "Infrastructure" ? <>
                    <Input type="text" required onChange={(e) => setscopeValue(e.target.value)} placeholder="Enter number of street lights" />
              <br/>
                      </> : <>            
                             
            </>
            }

            {model.tag === "Buildings" ? <>
                    <Input type="text" required onChange={(e) => setscopeValue(e.target.value)} placeholder="Enter area" />
          <br/>
                   </> : <>            
                             
            </>
            }
          {scopeValue.length === 0 ? null  : <Button color="warning" style={{color:"white"}} onClick={()=>calculate()} >Calculate and Send</Button>}
            
                    </Col>
                    <Col xs="4"></Col>
                </Row>
            </Container>
         
        </div>
    )
}

export default AddSites
