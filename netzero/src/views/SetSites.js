import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal,Row, ModalHeader, ModalBody, ModalFooter, Input, Col, Container } from 'reactstrap';
import useGetSites from '../hooks/useGetSites';

const SetSites = props => {

    let data = props.location.state
    const [site, setsite] = useState("")
    const [siteValue, setsiteValue] = useState(0)
    const [tag, settag] = useState("")
    const [residentailArray, setresidentailArray] = useState([])
    const [resideintalTotal, setResidentialTotal] = useState(0)

    let sites = useGetSites(data.id).docs

    const [Residential, setResidential] = useState(
        {
            "Low_Density": null,
            "Low_Density_Pool": null,
            "Medium_Density" : null,
            "High_Density": null
        })
        let ResidentialArray = []
 
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
            setresidentailArray(ResidentialArray)
        }, [Residential])

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
    const updateObject = (key) =>{
        let newKey = key.replaceAll(" ", "_")
        setResidential(prevResidential =>({...prevResidential, [newKey]:parseInt(siteValue)}))
       
        const keys = Object.keys(Residential);
       
        keys.forEach((key, index) => {
            console.log(key)
            setResidentialTotal(prevResidentialTotal=>(prevResidentialTotal + Residential[key]))
         //totalResidential=  totalResidential + Residential[key]
       
        });
     //   setResidentialTotal(totalResidential)
    
        
    }
 
    const handleChange = () =>{

    }
    
    const addSite = ()=>{
        let total = 0
        residentailArray.forEach(element => {
            total = total + element.value
        });
        console.log(total)
        // residentailArray.forEach(element => {
        //     firebase.firestore().collection('sites').add(
        //         {
        //         precinct_id: data.precinct_id,
        //         neighbourhood_id: data.neighbourhood_id,
        //         block_id: data.id,
        //         site_name: element.site,
        //         site_tag: element.tag,
        //         site_value: parseInt(element.value),
        //         createdAt: new Date().toLocaleDateString()
        //         }).then(()=>{
        //         setsite("")
        //         setsiteValue("")
        //         settag("")
        //     }).catch((e)=>{
        //         alert(JSON.stringify(e))
        //     })
        // });
        
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
                      <Button color="primary" onClick={()=>updateObject(rA.site)}>Confirm</Button>
                      </Col>
                  </Row>
                
                 </div>
              ))}
            </Col>
         
            <Col  xs="4">Site Summary<br/>
                   
                {residentailArray.map((rA)=>(
                    rA.value=== null ? null : 
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
