import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Row,  Input, Col, Container, } from 'reactstrap';
import { FiCheck, FiEdit } from "react-icons/fi";
import useGetSites from '../hooks/useGetSites';

const  AddNewSites = props => {
    let history = useHistory()
    let data = props.location.state
    let sites = useGetSites(data.id).docs
    const [docs, setdocs] = useState([])
    const [currentForm, setcurrentForm] = useState("")
    const [scopeValue, setscopeValue] = useState("")
    const [modelInput1, setmodelInput1] = useState("")
     const [model, setcategory] = useState("")
   // const [sites, setsites] = useState([])
   
useEffect(() => {
    getModels()
  
}, [])

const enableDisable = (id) =>{    
if(id === currentForm)
{
    return "number"
}
else{
    return "hidden"
}
    
}

    const getModels  = (cat) =>{
        firebase.firestore().collection("models").get().then((doc)=>{
            const models = [];
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              models.push(nb)
            })

            let result
            let abc =  models.reduce((r, e) =>{
               let l = e.tag
              if(!r[l])
              {
                r[l] = {l, tag:[e]}
              }
              else
              {
                r[l].tag.push(e)
              } 
              return r
            }, {})
            result = Object.values(abc)
             setdocs(result)
        })
    }
      
    

    // function handleChange (event){
    //     getModels(event.target.value)
    //     setcategory(event.target.value)
    // }
    const handleChange = (value, category, tag) => {
        console.log(value, category)
        if(tag === 2){
            setmodelInput1(value)
        }
        else{
            setscopeValue(value)
        }
            
            setcategory(category)
      }

      const getCurrentForm = (id, category) =>{
          console.log(id, category.tag)
            setcurrentForm(id)
          setcategory(category)
      }

 

    const calculate  =() =>{
   
        let electricity = 1.1
        let gas = 0.2
        if(model.tag === "Transport")
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
        else if(model.tag === "Infrastructure")
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
else if(model.tag === "Residential Pools")
{
            //residential  object
            let asd = {
                precinct_id: data.precinct_id,
                neighbourhood_id: data.neighbourhood_id,
                block_id: data.id,
                model:model.model,
                model_tag: model.tag,
                scopeValue : scopeValue,
                total: scopeValue * model.watts * model.hours *electricity
            }
            sendToDB(asd)
            //end of residential object
}

        else if(model.tag=== "Buildings")
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
      lighting :f1 * model.lighting,
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
                  setcurrentForm("")
               }).catch((e)=>{
                   alert(e)
               })
               return
            }
            else{
                firebase.firestore().collection("sites").add(object).then((doc)=>{
                 //  alert("scope added")
                 setcurrentForm("")
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
                    <Col xs="6">                  
                    <br/>
                {docs && docs.map((d)=>(
                    <>
                    <b>{d.l}</b><br/><br/>
                    {d.tag.map((tag, index)=>(
                        <form  key={index} style={{background:"#efefef", padding:"10px", marginBottom:"10px", borderRadius:"15px"}} id={tag.id}>
                        <Row style={{ }}>
                        <Col xs="4">
                        {tag.tag === "Transport" ? 
                       
                        <div style={{display:"flex", margin:"0"}}>
                    <Input type={enableDisable(tag.id)} name="cars" style={{marginRight:"10px"}} required onChange={(e) => handleChange(e.target.value, tag)}  placeholder="cars" />
            <Input type={enableDisable(tag.id)} name="kms" required onChange={(e) =>  handleChange(e.target.value, tag, 2)} placeholder=" kms" />
           <br/>
                      </div> : null
            }

            {tag.tag === "Infrastructure" ? <div style={{margin:"0"}}>
                    <Input type={enableDisable(tag.id)} name="lights" required onChange={(e) => handleChange(e.target.value, tag)} placeholder="lights" />
                 </div> : null
            }

            {tag.tag === "Buildings" ?   <div style={{display:"flex", margin:"0"}}>
              <Input type={enableDisable(tag.id)} name="area" required onChange={(e) =>  handleChange(e.target.value, tag)} 
              placeholder={tag.model.includes("Residential") ? "people" : "area"} />
             </div> : null
            }
            {/* {tag.model.includes("Residential") ? <>{tag.model}</> : null} */}
            {tag.tag === "Residential Pools" ?  <div style={{margin:"0"}}>
           
                    <Input type={enableDisable(tag.id)} name="area" required onChange={(e) =>  handleChange(e.target.value, tag)} placeholder="area" />
                </div> : null
            }
                         </Col>
                         <Col xs="2">
                           
                           {currentForm === tag.id ? <Button onClick={()=>calculate()} color="warning" type="button" style={{color:"white"}} ><FiCheck size={24} color="white"   /></Button>: 
                           <Button color="" type="button" onClick={()=>getCurrentForm(tag.id, tag)} style={{color:"white"}} ><FiEdit size={24} color="black"   /></Button>     }           
                           </Col>
                        <Col xs="6">
                        <p> 
                        {tag.model}                        
                        </p></Col>
                     
                        </Row>
                        </form>
                    ))}
                     </>
                    )
                )}
            <br/><br/>
            
                    </Col>

                    <Col xs="6"><br/> <h6>Site Summary</h6><br/>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"20px" }}>
                    {sites.map((a)=>(
                        <div style={{background:"#efefef", padding:"10px", borderRadius:"15px"}}>
                        <p>{a.model}</p>
                         <b>{a.scopeValue}</b>
                        </div>
                    ))}
                    </div>
                
                    </Col>
                    
                </Row>
            </Container>
         
        </div>
    )
}

export default AddNewSites
