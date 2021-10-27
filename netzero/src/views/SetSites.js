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
            "Low_Density": 0,
            "Low_Density_Pool": 0,
            "Medium_Density" : 0,
            "High_Density": 0
        })
        let ResidentialArray = []
 
        useEffect(() => {
            const keys = Object.keys(Residential);
              keys.forEach((key, index) => {
               let asd = {
                   site: key,
                   value : Residential[key]
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
        if(siteValue === 0)
        {
            alert("Please enter a valid value")
            return
        }
        if(site.length === 0)
        {
            alert("Please select a site to get started")
            return
        }
        firebase.firestore().collection('sites').add(
            {
            precinct_id: data.precinct_id,
            neighbourhood_id: data.neighbourhood_id,
            block_id: data.id,
            site_name: site,
            site_tag:tag,
            site_value: parseInt(siteValue),
            createdAt: new Date().toLocaleDateString()
            }).then(()=>{
            setsite("")
            setsiteValue("")
            settag("")
        }).catch((e)=>{
            alert(JSON.stringify(e))
        })
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
            <Col xs="6">
                <h6>Residential</h6>
              {residentailArray.map((rA, index)=>(
                  <div>
                  
                  <Row>
                      <Col xs="2"><Input type="number" required defaultValue={rA.value} onChange={(e) => setsiteValue(e.target.value)} placeholder="site value" /></Col>
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
            {/* <Col>
            Set Site values<br/><br/>
            {site} - {tag}
            <Input type="number" required value={siteValue} onChange={e =>setsiteValue(e.target.value)} placeholder="site value" /><br/>
            <Button color="primary" onClick={()=>updateObject(site)}>Confirm</Button>
            </Col> */}
            <Col>Site Summary<br/>
                <h4>{resideintalTotal}</h4>
            {sites && sites.map((site)=>(
                <div>
                    
                <h6>{site.site_name} - {site.site_value}</h6>
                <Button color="danger" onClick={()=>deleteSite(site.id)}>Delete</Button>
                </div>
            ))}
            </Col>
            <Col>
                {JSON.stringify(Residential)}
            </Col>
        </Row>
     </Container>
        </div>
    )
}

export default SetSites
