import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom'
import useGetNeighbourhood from '../hooks/useGetNeighbourhood'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Row, Input, Container, ButtonGroup } from 'reactstrap';
import {PolarArea} from 'react-chartjs-2'
import { FiLogOut, FiUser, FiUsers } from "react-icons/fi";

function Neighbourhood() {

    let neighbourhoods = useGetNeighbourhood().docs
    let history = useHistory()
    const [neighbourhood, setneighbourhood] = useState("")
    const [docs, setdocs] = useState([])
    const [labels, setlabels] = useState([])
    const [modal, setModal] = useState(false);
    const [docsData, setDataDocs] = useState([])    
    const [id, setid] = useState(null)
    const [_data, setdata_] = useState([])
    const [filter, setfilter] = useState([])
    const [selectedFilter, setselectedFilter] = useState()
    const [b, setb] = useState([])

    const logout = ()=>{
        firebase.auth().signOut().then(() => {
        history.push("/")
          }).catch((error) => {
            alert(error)
          });
    }

    const viewSiteInfo = (nb) =>{

        setselectedFilter("All Sites")
        let neighbourhood = [];
        let filter_ = []
        setb(nb)
         firebase.firestore().collection("sites").where("neighbourhood_id","==", nb.id).get().then((doc)=>{
        
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              neighbourhood.push(nb)
            })
              getDataandLabels(neighbourhood)
           // funnyfunction(neighbourhood)
           
           let group = neighbourhood.reduce((r, a) => {
            r[a.site_name] = [...r[a.site_name] || [], a];
         return r;
        }, {});
      
        let sdf = []
        let asd = Object.keys(group)
        asd.forEach(element => {
          console.log(element)
        });
        setDataDocs(asd)

              let result
              let abc =  neighbourhood.reduce((r, e) =>{
                let l = e.site_tag
                if(!r[l])r[l] = {l, _tag:[e]}
                else r[l]._tag.push(e)
                return r
              }, {}) 
               result = Object.values(abc)
                   result.map(c =>(
                 filter_.push(c.l)     
                 
              ))
              setfilter(filter_)
                    })
    }
 

    const getDataandLabels = (_data) =>{
        let label = []
        let data = []
        _data.forEach(element => {
        //    console.log(element)
            label.push(element.site_name)
        });

        _data.forEach(element => {
            data.push(element.site_value)
        });
        setdata_(data)            
        setlabels(label)
    }



    const data_ = {
        labels:labels,
        datasets: [
          {
            label: '# of Votes',
            data: _data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
            ],
            borderWidth: 1,
          },
        ],
      };

    const getPrecincts = (n) =>{
        setid(n)
        viewSiteInfo(n)
        firebase.firestore().collection("precinct").where("neighbourhood_id","==", n.id).onSnapshot((doc)=>{
            const neighbourhood = [];
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              neighbourhood.push(nb)
            })
            setdocs(neighbourhood)
         })
    }

    const addneighbourhood = ()=>{
        firebase.firestore().collection('neighbourhood').add({neighbourhood: neighbourhood, createdAt: new Date().toLocaleDateString()}).then((data)=>{
            toggle()
        }).catch((e)=>{
            alert(JSON.stringify(e))
        })
    }

    console.log(docsData)

    const toggle = () => setModal(!modal);
  
    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={toggle}>&times;</button>;

    return (
        <div>
             <Modal isOpen={modal} toggle={toggle}   external={externalCloseBtn}>
        <ModalHeader>Add new neighbourhood</ModalHeader>
        <ModalBody>
        <Input type="text" required value={neighbourhood} onChange={e =>setneighbourhood(e.target.value)} placeholder="Neighbourhood" />
       
             </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addneighbourhood}>Confirm</Button>{' '}
          </ModalFooter>
      </Modal>
            <div style={{background:"#fdb940", padding:20}}>
                <Row>
                    <Col><h3 style={{color:"white"}}>Neighbourhoods</h3></Col>

                    <Col style={{display:'flex', justifyContent:'flex-end'}}>                     
                    <Button color="info" onClick={toggle}>Create neighbourhood</Button>
                   
                    <Button color="warning"  style={{marginLeft:20 }}onClick={()=>history.push("CreateUser")}> <FiUsers size={30} color="white"/></Button>
                    <Button color="warning"  style={{marginLeft:20 }}onClick={()=>logout()}><FiLogOut  size={30} color="white"/></Button>
                    
                    </Col>
                    </Row>           
            </div>
            
<Container style={{maxWidth:"100%"}}>
    <Row>
        <Col xs="2" style={{padding:"20px"}}> <h6>List of neighbourhoods</h6><br/>
           
           {neighbourhoods.length  === 0 ? <><p>You have no neighbourhoods</p>     
           </> : 
           <div style={{display:"flex", flexDirection: "column"}}>
           {neighbourhoods.map((nb)=>(
               <p onClick={()=>getPrecincts(nb)} style={{background:nb.id === b.id ? "#fdb940" : "#ffffff", 
                    border:"1px solid #000000", borderColor: "black",textAlign: "center",  padding:10, 
                     borderRadius:10, fontSize:16, color:nb.id === b.id ? "white":"black", cursor: "pointer",fontWeight:"bold",
                      marginBottom:30 }}>
           {nb.neighbourhood}
            </p>
           ))}
           </div>
           }</Col>
        <Col style={{padding:"40px"}}>
        {id && 
        <>
        <ButtonGroup>
          <Button color="warning"><Link to={{pathname:"/viewNeighbourhood/"+id.id,state: id}} style={{color:"white", textDecoration:"none"}}>View Precincts</Link></Button>
        <Button>Update Neighbourhood</Button>
        </ButtonGroup>
        
        </>
        }
 
        </Col>
        <Col xs="2" style={{padding:"20px"}}>
        <h6>Precints</h6>
       <br/>
        {docs && docs.map((p)=>(
            <p style={{ border:"1px solid #000000", borderColor: "black",textAlign: "center",  padding:10, 
                     borderRadius:10,}}>{p.precint}</p>
        ))}
        </Col>

    </Row>
</Container>
           
            <div></div>
        </div>
    )
}

export default Neighbourhood
