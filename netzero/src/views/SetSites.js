import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal,Row, ModalHeader, ModalBody, ModalFooter, Input, Col, Container } from 'reactstrap';
import useGetSites from '../hooks/useGetSites';

const SetSites = props => {

    let history = useHistory()
    let data = props.location.state
    const [site, setsite] = useState("")
    const [siteValue, setsiteValue] = useState(0)
    const [tag, settag] = useState("")
    const [residentailArray, setresidentailArray] = useState([])
    const [infrastructureArray, setinfrastructureArray] = useState([])
    const [warehouseArray, setwarehouseArray] = useState([])
  const [transportArray, settransportArray] = useState([])
  const [commericalArray, setcommericalArray] = useState([])
    let sites = useGetSites(data.id).docs

    const [Residential, setResidential] = useState(
        {
            "Low_Density": 0,
            "Low_Density_Pool": 0,
            "Medium_Density" : 0,
            "High_Density": 0
        })
      const [Warehouse, setWarehouse] = useState({
            "Light_Industrial": 0,
            "Medium_industrial": 0,
            "High_Industrial": 0
      })

       const [infrastructure, setinfrastructure] = useState({
           "Street_Lights": 0,
           "Traffic_Lights": 0
       })

       const [Transport, settransport] = useState({
           "Small_Petrol":0,
           "Small_Diesel": 0,
           "Medium_Petrol": 0,
           "Medium_Diesel": 0,
           "Large_Petrol": 0,
           "Large_Diesel": 0
       })

       const [Commercial, setcommercial] = useState({
           "Business_&_Commercial": 0,
           "Education": 0,
           "Residential" : 0,
           "Office": 0,
           "Religious": 0,
           "Government": 0,
           "Public_Open_Space": 0,
           "Vacant_Land": 0,
           "Public_Service_Infrastructure": 0
       })
       let ResidentialArray = []
       let InfrastructureArray = []
       let WarehouseArray = []
       let TransportArray = []
       let CommeercialArray=[]

        useEffect(() => {
            
            const keys = Object.keys(Residential);
              keys.forEach((key, index) => {
               let asd = {
                   site: key,
                   value : Residential[key],
                   tag : "Residential"
               }
             ResidentialArray.push(asd)    
             });

             const infrastructureKeys = Object.keys(infrastructure);
             infrastructureKeys.forEach((key, index) => {
              let asd = {
                  site: key,
                  value : infrastructure[key],
                  tag : "Infrastructure"
              }
            InfrastructureArray.push(asd)    
            });

            const warehouseKeys = Object.keys(Warehouse);
            warehouseKeys.forEach((key, index) => {
             let asd = {
                 site: key,
                 value : Warehouse[key],
                 tag : "Warehouse"
             }
           WarehouseArray.push(asd)    
           });

           const TransportKeys = Object.keys(Transport);
           TransportKeys.forEach((key, index) => {
            let asd = {
                site: key,
                value : Transport[key],
                tag : "Transport"
            }
          TransportArray.push(asd)    
          });

          const CommercialKeys = Object.keys(Commercial);
          CommercialKeys.forEach((key, index) => {
           let asd = {
               site: key,
               value : Commercial[key],
               tag : "Commercial"
           }
           CommeercialArray.push(asd)    
         });


            setresidentailArray(ResidentialArray)
            setinfrastructureArray(InfrastructureArray)
            setwarehouseArray(WarehouseArray)
            setcommericalArray(CommeercialArray)
            settransportArray(TransportArray)
        }, [Residential, infrastructure, Warehouse, Transport, Commercial])

    const deleteSite =(id) =>{
        firebase.firestore().collection("sites").doc(id).delete().then(()=>{
                alert('Site deleted')
        }).catch((e)=>{
            alert("Failed to delete item.")
        })
    }

    const setSiteInfo = (sitename, siteTag) =>{
            setsite(sitename)
            settag(siteTag)
    }
    const updateObject = (key, tag) =>{
        let newKey = key.replaceAll(" ", "_")
        if(tag === "Residential"){
            setResidential(prevResidential =>({...prevResidential, [newKey]:parseInt(siteValue)}))
        }
        else if(tag === "Infrastructure"){
            setinfrastructure(prevInfrastructure =>({...prevInfrastructure, [newKey]:parseInt(siteValue)}))
        }
        else if(tag === "Warehouse"){
            setWarehouse(prevWarehouse =>({...prevWarehouse, [newKey]:parseInt(siteValue)}))
        }
        else if(tag === "Commercial"){
            setcommercial(prevCommercial =>({...prevCommercial, [newKey]:parseInt(siteValue)}))
        }
        else if(tag === "Transport"){
            settransport(prevTransport =>({...prevTransport, [newKey]:parseInt(siteValue)}))
        }
        
       
      //  const keys = Object.keys(Residential);
       
        // keys.forEach((key, index) => {
        //     console.log(key)
        //  //   setResidentialTotal(prevResidentialTotal=>(prevResidentialTotal + Residential[key]))
        //  //totalResidential=  totalResidential + Residential[key]
       
        // });
     //   setResidentialTotal(totalResidential)
    
        
    }

    
    const addSite = ()=>{
        let Rtotal = 0
        let Ttotal = 0
        let Ctotal = 0
        let Wtotal = 0
        let Itotal = 0

        residentailArray.forEach(element => {
            Rtotal = Rtotal + element.value
          
        });
        infrastructureArray.forEach(element => {
            Itotal = Itotal + element.value
          
        });
        transportArray.forEach(element => {
            Ttotal = Ttotal + element.value
          
        });
        commericalArray.forEach(element => {
            Ctotal = Ctotal + element.value
          
        });
        warehouseArray.forEach(element => {
            Wtotal = Wtotal + element.value
          
        });
        try {
            if(Rtotal > 0)
            {
                addSites(residentailArray)
              }
              if(Ttotal > 0)
              {
                addSites(transportArray)
            }
            if(Ctotal > 0)
            {
            addSites(commericalArray)
            }
            if(Wtotal > 0)
            {
                addSites(warehouseArray)
            }
            if(Itotal > 0)
            {
                addSites(infrastructureArray)
                }
                history.goBack()             

        } catch (error) {
           alert(error) 
        }
            
            
      

        
    }

const addSites = (site_data) =>{
            site_data.forEach(element => {
            firebase.firestore().collection('sites').add(
                {
                precinct_id: data.precinct_id,
                neighbourhood_id: data.neighbourhood_id,
                block_id: data.id,
                site_name: element.site,
                site_tag: element.tag,
                site_value: parseInt(element.value),
                createdAt: new Date().toLocaleDateString()
                }).then(()=>{
               
            }).catch((e)=>{
                alert(JSON.stringify(e))
            })
        });
}

    return (
        <div>
            <div style={{background:"#fdb940", padding:20}}>
                <Row>
                    <Col><h1 style={{color:"white"}}>Sites</h1>
                    <h4>{data.block}</h4></Col>
                    <Col>  
                 </Col>
                    </Row>           
            </div>
           
                <Container>
        <Row>
            <Col xs="8">
                <h6>Residential</h6>
              {residentailArray.map((rA, index)=>(
                  <div>
                  
                  <Row>
                      <Col xs="2"><Input type="number" required onChange={(e) => setsiteValue(e.target.value)} placeholder="0" /></Col>
                      <Col> <p key={index} onClick={()=>setSiteInfo(rA.site.replaceAll("_", " "),"Residential")}>
                 {rA.site.replaceAll("_", " ")}
                 </p></Col>
                      <Col>
                      <Button color="primary" onClick={()=>updateObject(rA.site, rA.tag)}>Confirm</Button>
                      </Col>
                  </Row>
                
                 </div>
              ))}

                <h6>Infrastructure</h6>
              {infrastructureArray.map((rA, index)=>(
                  <div>
                  
                  <Row>
                      <Col xs="2"><Input type="number" required onChange={(e) => setsiteValue(e.target.value)} placeholder="0" /></Col>
                      <Col> <p key={index} onClick={()=>setSiteInfo(rA.site.replaceAll("_", " "),"Infrastructure")}>
                 {rA.site.replaceAll("_", " ")}
                 </p></Col>
                      <Col>
                      <Button color="primary" onClick={()=>updateObject(rA.site, rA.tag)}>Confirm</Button>
                      </Col>
                  </Row>
                
                 </div>
              ))}

              <h6>Warehouse</h6>
              {warehouseArray.map((rA, index)=>(
                  <div>
                  
                  <Row>
                      <Col xs="2"><Input type="number" required onChange={(e) => setsiteValue(e.target.value)} placeholder="0" /></Col>
                      <Col> <p key={index} onClick={()=>setSiteInfo(rA.site.replaceAll("_", " "),"Infrastructure")}>
                 {rA.site.replaceAll("_", " ")}
                 </p></Col>
                      <Col>
                      <Button color="primary" onClick={()=>updateObject(rA.site, rA.tag)}>Confirm</Button>
                      </Col>
                  </Row>
                
                 </div>
              ))}

              <h6>Transport</h6>
              {transportArray.map((rA, index)=>(
                  <div>
                  
                  <Row>
                      <Col xs="2"><Input type="number" required onChange={(e) => setsiteValue(e.target.value)} placeholder="0" /></Col>
                      <Col> <p key={index} onClick={()=>setSiteInfo(rA.site.replaceAll("_", " "),"Infrastructure")}>
                 {rA.site.replaceAll("_", " ")}
                 </p></Col>
                      <Col>
                      <Button color="primary" onClick={()=>updateObject(rA.site, rA.tag)}>Confirm</Button>
                      </Col>
                  </Row>
                
                 </div>
              ))}

              <h6>Commercial & Other</h6>
              {commericalArray.map((rA, index)=>(
                  <div>
                  
                  <Row>
                      <Col xs="2"><Input type="number" required onChange={(e) => setsiteValue(e.target.value)} placeholder="0" /></Col>
                      <Col> <p key={index} onClick={()=>setSiteInfo(rA.site.replaceAll("_", " "),"Infrastructure")}>
                 {rA.site.replaceAll("_", " ")}
                 </p></Col>
                      <Col>
                      <Button color="primary" onClick={()=>updateObject(rA.site, rA.tag)}>Confirm</Button>
                      </Col>
                  </Row>
                
                 </div>
              ))}


            </Col>
         
            <Col  xs="4">Site Summary<br/>
                   
                {residentailArray.map((rA)=>(
                    rA.value=== 0 ? null : 
                    <Row>
                        <Col><b>{rA.site}</b></Col>
                        <Col><p style={{textAlign:"right"}}>{rA.value}</p></Col>
                    </Row>
                    
                ))}
                {infrastructureArray.map((rA)=>(
                    rA.value=== 0 ? null : 
                    <Row>
                        <Col><b>{rA.site}</b></Col>
                        <Col><p style={{textAlign:"right"}}>{rA.value}</p></Col>
                    </Row>
                    
                ))}

                {warehouseArray.map((rA)=>(
                    rA.value=== 0 ? null : 
                    <Row>
                        <Col><b>{rA.site}</b></Col>
                        <Col><p style={{textAlign:"right"}}>{rA.value}</p></Col>
                    </Row>
                    
                ))}

                {transportArray.map((rA)=>(
                    rA.value=== 0 ? null : 
                    <Row>
                        <Col><b>{rA.site}</b></Col>
                        <Col><p style={{textAlign:"right"}}>{rA.value}</p></Col>
                    </Row>
                    
                ))}
                {commericalArray.map((rA)=>(
                    rA.value=== 0 ? null : 
                    <Row>
                        <Col><b>{rA.site}</b></Col>
                        <Col><p style={{textAlign:"right"}}>{rA.value}</p></Col>
                    </Row>
                    
                ))}
                <Button color="primary" onClick={()=>addSite()}>Add Sites</Button>
            
            </Col>
            
        </Row>
     </Container>
        </div>
    )
}

export default SetSites
