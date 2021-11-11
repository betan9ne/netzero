import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom'
import useGetNeighbourhood from '../hooks/useGetNeighbourhood'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Row, Input, Container, ButtonGroup } from 'reactstrap';
import { Doughnut, Bar } from "react-chartjs-2";
import { FiLogOut, FiUser, FiUsers } from "react-icons/fi";

function Neighbourhood() {

    let neighbourhoods = useGetNeighbourhood().docs
    let history = useHistory()
    const [neighbourhood, setneighbourhood] = useState("")
    const [docs, setdocs] = useState([])
    const [labels, setlabels] = useState([])
    const [modal, setModal] = useState(false);
 const [buildingsData, setbuildingsData] = useState([])   
    const [id, setid] = useState(null)
    const [_data, setdata_] = useState([])

    const [b, setb] = useState([])

    const logout = ()=>{
        firebase.auth().signOut().then(() => {
        history.push("/")
          }).catch((error) => {
            alert(error)
          });
    }

    const viewSiteInfo = (nb, tag) =>{
     let neighbourhood = [];
        let buildings = []
        setb(nb)
         firebase.firestore().collection("sites").where("neighbourhood_id","==", nb.id).get().then((doc)=>{
        
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              neighbourhood.push(nb)
            })
           
            //get buildings data
            neighbourhood.filter((val)=>{
              if(val.model_tag === tag)
              {
                buildings.push(val)
              }
            })
            
           let group = buildings.reduce((r, a) => {
            r[a.model] = [...r[a.model] || [], a];
         return r;
        }, {});           
        
      let asd = Object.entries(group)

           getDataandLabels(asd)
     //       console.log(result)
        //       setfilter(filter_)
                    })
    }
 
  
    const getDataandLabels = (_data) =>{
        let label = []
        let data = []
        
        _data.forEach(e=>{
          label.push(e[0])
           
          let asd = e[1].reduce( function(a, b){
            return a + parseInt(b['scopeValue']);
        }, 0);
        data.push(asd) 
        })
     
        setdata_(data)            
        setlabels(label)
    }

    
    const data_ = {
        labels:labels,
        datasets: [
          {
            label: '',
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

      const options = {
        indexAxis: 'y',
             elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: false,
            text: '',
          },
        },
      };

    const getPrecincts = (n) =>{
        setid(n)
        viewSiteInfo(n, "Buildings")
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
          <div style={{display:"flex", marginBottom:20, justifyContent:"center"}}>
        <ButtonGroup>
         <Button color="warning" style={{color:"white"}} onClick={()=>viewSiteInfo(id,"Buildings")}>Buildings Emissions</Button>
         <Button color="warning" style={{color:"white"}}  onClick={()=>viewSiteInfo(id,"Transport")}>Transport Emissions</Button>
         <Button  color="warning" style={{color:"white"}}  onClick={()=>viewSiteInfo(id,"Infrastructure")}>Infrastructure Emissions</Button>
          </ButtonGroup>
      
        
        </div>
        }
        <Row>
          <Col xs="8"><br/> <h6>Total Area based Emission</h6>
          <Doughnut data={data_}/>
          <Bar data= {data_} options={options}/>
          </Col>
          <Col></Col>
        </Row>
       
        </Col>
        <Col xs="2" style={{padding:"20px"}}>
        {id && 
        <>
          <Button color="warning">
          <Link to={{pathname:"/viewNeighbourhood/"+id.id,state: id}} style={{color:"white", textDecoration:"none"}}>View Precincts</Link>
          </Button><br/><br/>
        <Button>Update</Button>
        </>
        }
        </Col>
        {/* <Col xs="2" style={{padding:"20px"}}>
        <h6>Precints</h6>
       <br/>
        {docs && docs.map((p)=>(
            <p style={{ border:"1px solid #000000", borderColor: "black",textAlign: "center",  padding:10, 
                     borderRadius:10,}}>{p.precint}</p>
        ))}
        </Col> */}

    </Row>
</Container>
           
            <div></div>
        </div>
    )
}

export default Neighbourhood
