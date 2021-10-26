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
    let sites = useGetSites(data.id).docs

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
            <b>{data.block}</b>
                <Container>
        <Row>
            <Col>
            <b>Residential</b>
            <p onClick={()=>setSiteInfo("Low density","Residential")}>Low density</p>
            <p  onClick={()=>setSiteInfo("Low density Pool","Residential")}>Low Density Pool</p>
            <p onClick={()=>setSiteInfo("Medium density","Residential")}>Medium Density</p>
            <p  onClick={()=>setSiteInfo("High density","Residential")}>High Density</p>
            <b>Commercial or Other</b>
            <p onClick={()=>setSiteInfo("Business & Commercial","Commercial")}>Business & Commercial</p>
            <p onClick={()=>setSiteInfo("Education","Commercial")}>Education</p>
            <p onClick={()=>setSiteInfo("Residential","Commercial")}>Residential</p>
            <p onClick={()=>setSiteInfo("Office","Commercial")}>Office</p>
            <p onClick={()=>setSiteInfo("Religious","Commercial")}>Religious</p>
            <p onClick={()=>setSiteInfo("Government","Commercial")}>Government</p>
            <p onClick={()=>setSiteInfo("Public Open Space","Commercial")}>Public Open Space</p>
            <p onClick={()=>setSiteInfo("Vacant Land","Commercial")}>Vacant Land</p>
            <p onClick={()=>setSiteInfo("Public Service Infrastructure","Commercial")}>Public Service Infrastructure</p>
            <b>Infrastructure</b>
            <p onClick={()=>setSiteInfo("Street Lights","Infrastructure")}>Street Lights</p>
            <p onClick={()=>setSiteInfo("Traffic Lights","Infrastructure")}>Traffic Lights</p>
            <b>Transport</b>
            <p onClick={()=>setSiteInfo("Small petrol","Transport")}>Small petrol</p>
            <p onClick={()=>setSiteInfo("Small Diesel","Transport")}>Small Diesel</p>
            <p onClick={()=>setSiteInfo("Medium Petrol","Transport")}>Medium Petrol</p>
            <p onClick={()=>setSiteInfo("Medium Diesel","Transport")}>Medium Diesel</p>
            <p onClick={()=>setSiteInfo("Large Petrol","Transport")}>Large Petrol</p>
            <p onClick={()=>setSiteInfo("Large Diesel","Transport")}>Large Diesel</p>
            <b>Warehouse</b>
            <p onClick={()=>setSiteInfo("Light industrial","Warehouse")}>Light industrial</p>
            <p onClick={()=>setSiteInfo("Medium industrial","Warehouse")}>Medium industrial</p>
            <p onClick={()=>setSiteInfo("High industrial","Warehouse")}>High industrial</p>

            </Col>
            <Col>
            Set Site values<br/><br/>
            {site} - {tag}
            <Input type="number" required value={siteValue} onChange={e =>setsiteValue(e.target.value)} placeholder="site value" /><br/>
            <Button color="primary" onClick={addSite}>Confirm</Button>
            </Col>
            <Col>Site Summary<br/>
            {sites && sites.map((site)=>(
                <div>
                    
                <h6>{site.site_name} - {site.site_value}</h6>
                <Button color="danger" onClick={()=>deleteSite(site.id)}>Delete</Button>
                </div>
            ))}
            </Col>
        </Row>
     </Container>
        </div>
    )
}

export default SetSites
