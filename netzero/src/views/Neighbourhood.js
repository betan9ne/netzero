import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom'
import useGetNeighbourhood from '../hooks/useGetNeighbourhood'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Row, Input, Container, ButtonGroup } from 'reactstrap';
import { Doughnut, Bar } from "react-chartjs-2";
import { FiLogOut, FiUser, FiUsers } from "react-icons/fi";
import BuildingsStackedChart from '../charts/BuildingsStackedChart';
import BaselineEmissionsPieChart from '../charts/BaselineEmissionsPieChart';
import BuildingStackedChartInverted from '../charts/BuildingStackedChartInverted';

function Neighbourhood() {

    let neighbourhoods = useGetNeighbourhood().docs
    let history = useHistory()
    const [neighbourhood, setneighbourhood] = useState("")
    const [docs, setdocs] = useState([])
    const [gasData, setgasData] = useState()
    const [labels, setlabels] = useState([])
    const [modal, setModal] = useState(false);
    const [tag, settag] = useState("") 
    const [baselineEmissions, setbaselineEmissions] = useState([])
    const [graphSummaries, setgraphSummaries] = useState([])
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

    const getPrecinctData = (id) =>{
      firebase.firestore().collection("sites").where("neighbourhood_id","==", id).onSnapshot((doc)=>{
        const data = [];
        doc.docs.forEach(document => {
          const nb = {
            id: document.id,
            ...document.data()
          }
          data.push(nb)
        })
        setdocs(data)
       
     })
    }
    
    let infrastructure = 0
    let transport = 0
    let energy = 0
    let gas = 0

   


    const viewSiteInfo = (nb, tag) =>{
      
      settag(tag)
     let neighbourhood = [];
        let buildings = []
        getPrecinctData(nb.id)
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
          //  setdocs(transport)
           
              getGasData(neighbourhood)
             
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


  
 const getGasData = (data)=>{
   

  let total_water_heating = 0
  let total_gas_cooking = 0

    data.filter((val)=>{
      if(val.gas_water_heating){
        total_water_heating  = total_water_heating + val.gas_water_heating
      }
      if(val.gas_cooking){
        total_gas_cooking = total_gas_cooking + val.gas_cooking
      }
    })

    let asd = [
      {
        label : "Water Heating",
        data : total_water_heating
      },
      {
        label :"Cooking",
        data : total_gas_cooking
      }
    ]
     
 setgasData(asd)
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
            data: _data && _data,
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

       
    const gasdata_ = {
      labels:gasData&& gasData.map((g)=>(
        g.label
      )),
      datasets: [
        {
          label: '',
          data: gasData&& gasData.map((g)=>(
            g.data
          )),
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
         //   setdocs(neighbourhood)
         })
    }

    const baseline = {
      labels:baselineEmissions.map((a)=>(
        a.label
      )),
      datasets: [
        {
          label: '',
          data: baselineEmissions.map((a)=>(
            a.data
          )),
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

    const scopeData = {
      labels:graphSummaries.map((a)=>(
        a.label
      )),
      datasets: [
        {
          label: '',
          data: graphSummaries.map((a)=>(
            a.data
          )),
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

            <div style={{background:"#fdb940", position:"fixed", left:0, right:0, top:0, zIndex:10000, padding:5}}>
                <Row>
                    <Col><h4 style={{color:"white"}}>Neighbourhoods</h4></Col>

                    <Col style={{display:'flex', justifyContent:'flex-end'}}>    
                    {id && 
        <>
          <Button color="warning">
          <Link to={{pathname:"/viewNeighbourhood/"+id.id,state: id}} style={{color:"white", textDecoration:"none"}}>View Precincts</Link>
          </Button><br/><br/>
        <Button>Update</Button>
        </>
        }                 
                       <Button color="warning"  style={{marginLeft:20 }}onClick={()=>history.push("CreateUser")}> <FiUsers size={24} color="white"/></Button>
                    <Button color="warning"  style={{marginLeft:20 }}onClick={()=>logout()}><FiLogOut  size={24} color="white"/></Button>
                    
                    </Col>
                    </Row>           
            </div>
            
<Container style={{maxWidth:"100%", marginTop:"70px"}}>
    <Row>
        <Col xs="2" > <h6>List of neighbourhoods</h6><br/>
        <Button color="secondary" onClick={toggle}>Create neighbourhood</Button>
        <br/><br/>
           {neighbourhoods.length  === 0 ? <><p>You have no neighbourhoods</p>     
           </> : 
           <div style={{display:"flex", flexDirection: "column"}}>
           {neighbourhoods.map((nb)=>(
               <p onClick={()=>getPrecincts(nb)} key={nb.id} style={{background:nb.id === b.id ? "#fdb940" : "#ffffff", 
                    border:"1px solid #000000", borderColor: "black",textAlign: "center",  padding:10, 
                     borderRadius:10, fontSize:16, color:nb.id === b.id ? "white":"black", cursor: "pointer",fontWeight:"bold",
                      marginBottom:30 }}>
           {nb.neighbourhood}
            </p>
           ))}
           </div>
           }</Col>
        <Col xs="10" style={{ }}>
        
        <Row>
          <Col xs="12">
          
          {docs.length === 0 ? <h6>Select a neighbourhood to show details</h6> :  <BaselineEmissionsPieChart data={docs} />}
 <br/><br/>
         
        <Row>
          <Col xs="8">
          {id && 
          <div style={{display:"flex", marginBottom:20,}}>
          
        <ButtonGroup>
         <Button color="warning" style={{color:"white"}} onClick={()=>viewSiteInfo(id,"Buildings")}>Stationary Energy (Electricity)</Button>
         <Button color="warning" style={{color:"white"}}  onClick={()=>viewSiteInfo(id,"Transport")}>Transport Emissions</Button>
         <Button  color="warning" style={{color:"white"}}  onClick={()=>viewSiteInfo(id,"Gas")}>Stationary Energy (Gas)</Button>
          </ButtonGroup>
        </div>
        }
          { tag === "Gas" ? gasData.length === 0 ? null : <Bar data={gasdata_} options={options} /> : _data.length === 0 ? null : <Bar data= {data_} options={options}/> }
           </Col>
          <Col xs="4">
            <h6>Input Summary</h6>
            {tag === "Gas" ? 
            gasData.map((a, index)=>(
              <p style={{borderBottom: "thin solid #999"}}>
                <span style={{fontWeight:"bold", fontSize:"12px"}}>
              {a.label}
              </span>
              <br/>
              <span style={{fontSize:"14px"}}>{a.data/1000}</span>
              </p>
            ))
             :
          <>
            <Row>
              <Col xs="9">
            {labels.map((a, index)=>(
              <p style={{borderBottom: "thin solid #999"}}>
                <span style={{fontWeight:"bold", fontSize:"12px"}}>
              {a}
              </span></p>        
            ))}</Col>
              <Col xs="3">                
            {_data.map((a, index)=>(
              <p style={{borderBottom: "thin solid #999"}}>
                <span style={{fontWeight:"bold", fontSize:"12px"}}>
              {a}
              </span></p>     
            ))}
              </Col>
            </Row>
            </>
            }
        </Col>
        </Row>
       <Row>
         <Col xs="12"> {id && <BuildingsStackedChart data={id} /> }
        {id && <BuildingStackedChartInverted data={id} /> }</Col>
        
       </Row>
          </Col> 
        </Row>
       
        </Col>
    </Row>
</Container>
           
            <div></div>
        </div>
    )
}

export default Neighbourhood
