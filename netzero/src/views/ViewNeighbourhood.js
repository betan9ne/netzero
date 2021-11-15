import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Input, ButtonGroup } from 'reactstrap';
import useGetPrecinct from '../hooks/useGetPrecinct';
import { Doughnut, Bar } from "react-chartjs-2";
import BaselineEmissionsPieChart from '../charts/BaselineEmissionsPieChart';
const ViewNeighbourhood = props => {
    let data = props.location.state
    let precinct = useGetPrecinct(data.id).docs
    const [modal, setModal] = useState(false);
    const [precint, setprecint] = useState()
    const [p, setp] = useState(null)
    const [b, setb] = useState([])
    const [gasData, setgasData] = useState()
    const [docs, setdocs] = useState([])
    const [blocks, setblocks] = useState([])
    const [labels, setlabels] = useState([])
    const [_data, setdata_] = useState([])
    const [baselineEmissions, setbaselineEmissions] = useState([])
    const [graphSummaries, setgraphSummaries] = useState([])
    const [filter, setfilter] = useState([])
    const [selectedFilter, setselectedFilter] = useState()
    const [tag, settag] = useState("")
    const toggle = () => setModal(!modal);


  let history = useHistory()


    
  const predata_ = {
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



  const data_ = {
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

  const viewSiteInfo = (nb, tag) =>{
      setb(nb)
      getBlocks(nb)
      settag(tag)
      let neighbourhood = [];
         let buildings = []
         getPrecinctData(nb.id)
         setb(nb)
          firebase.firestore().collection("sites").where("precinct_id","==", nb.id).get().then((doc)=>{
         
             doc.docs.forEach(document => {
               const nb = {
                 id: document.id,
                 ...document.data()
               }
               neighbourhood.push(nb)
             })
            setdocs(neighbourhood)
             //get buildings data
             neighbourhood.filter((val)=>{
               if(val.model_tag === tag)
               {
                 buildings.push(val)
               }
             })
 
             console.log(buildings)
            
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
  //  console.log(total_water_heating, total_gas_cooking)
 setgasData(asd)
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
    //console.log(_data)
    setdata_(data)            
    setlabels(label)
}

 

const getPrecinctData = (p) =>{
 // console.log(p)
  firebase.firestore().collection("sites").where("precinct_id","==", p).onSnapshot((doc)=>{
    const data = [];
    doc.docs.forEach(document => {
      const nb = {
        id: document.id,
        ...document.data()
      }
      data.push(nb)
    })
    
    getData(data)
 })
}

let infrastructure = 0
let transport = 0
let energy = 0
let gas = 0
const getData = (_data) =>{
 
 // console.log(_data)
  _data.filter((val)=>{
     
    if(val.model_tag === "Infrastructure")
    {
      infrastructure +=val.total
    }

    if(val.model_tag === "Transport")
    {
     transport +=val.total
    }

    if(val.model_tag === "Buildings")
    {
     energy +=val.total_carbon_emissions_electricity
    }
    if(val.model_tag === "Buildings")
    {
     gas +=val.total_carbon_emissions_gas
    }

    
  }
  )
    let asd =[
      // {
      //   label : "Infrastructure",
      //   data : infrastructure
      // },
      {
        label: "Transport",
        data : transport
      },
      {
        label : "Energy",
        data : energy
      },
      {
        label : "Gas",
        data : gas
      }
    ]

    let scopeData = [
      {
        label : "Total Electricity Emissions + Infrastructure",
        data : energy + infrastructure
      },
      {
        label : "Total Gas Emissions + Transport",
        data : gas + transport
      }
    ]
   
    setbaselineEmissions(asd)
    setgraphSummaries(scopeData)
 
}

    const getBlocks = (p) =>{
        setp(p)
        getPrecinctData(p)
          firebase.firestore().collection("blocks").where("precinct_id","==", p.id).onSnapshot((doc)=>{
            const neighbourhood = [];
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              neighbourhood.push(nb)
            })
            setblocks(neighbourhood)
         })
    }


    

    const addprecinct = ()=>{
        firebase.firestore().collection('precinct').add(
            {precint: precint, 
                neighbourhood_id: data.id,
                neighbourhood_name: data.neighbourhood,
            createdAt: new Date().toLocaleDateString()
            }).then((data)=>{
            toggle()
        }).catch((e)=>{
            alert(JSON.stringify(e))
        })
    }
    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={toggle}>&times;</button>;

    return (
        <div>
              <Modal isOpen={modal} toggle={toggle}   external={externalCloseBtn}>
        <ModalHeader>Add new precinct</ModalHeader>
        <ModalBody>
        <Input type="text" required value={precint} onChange={e =>setprecint(e.target.value)} placeholder="precinct" />       
             </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addprecinct}>Confirm</Button>{' '}
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <div style={{background:"#fdb940", padding:20}}>
                <Row>
                    <Col><h3 style={{color:"white"}}>Precincts</h3>
                    <h6 onClick={()=>history.goBack()} style={{cursor:"pointer"}}>{data.neighbourhood}</h6>
                    </Col>
                    <Col></Col>
                    </Row>           
            </div>
           
         <Container  style={{maxWidth:"100%"}}>
             <Row>
                 <Col xs="2" style={{padding:"20px"}}>
                <Row>
                  <Col> <h6>List of Precincts</h6>
                  <Button color="secondary" onClick={toggle}>Create precinct</Button></Col>
                   
                </Row>
                
                 <br/>
                  {precinct.length  === 0 ? <p>You have no precinct</p> : <>
                    {precinct.map((nb)=>(
                      <p onClick={()=>viewSiteInfo(nb)}  key={nb.id} style={{background:nb.id === b.id ? "#fdb940" : "#ffffff", 
                    border:"1px solid #000000", borderColor: "black",textAlign: "center",  padding:10, 
                     borderRadius:10, fontSize:16, color:nb.id === b.id ? "white":"black", cursor: "pointer",fontWeight:"bold",
                      marginBottom:30 }}> 
                      {nb.precint}                 
                 </p>
                ))}
                 </> }</Col>
 
                 <Col xs="8"   style={{padding:"40px"}}>
                 {p &&  <BaselineEmissionsPieChart data={docs} />}
<br/><br/>
        {p &&
        <>
        <div style={{display:"flex", marginBottom:20, justifyContent:"center"}}>
        <ButtonGroup>
         <Button color="warning" style={{color:"white"}} onClick={()=>viewSiteInfo(p,"Buildings")}>Stationary Energy (Electricity)</Button>
         <Button color="warning" style={{color:"white"}}  onClick={()=>viewSiteInfo(p,"Transport")}>Transport Emissions</Button>
         <Button  color="warning" style={{color:"white"}}  onClick={()=>viewSiteInfo(p,"Gas")}>Stationary Energy (Gas)</Button>
          </ButtonGroup>
        </div>
        </>
        }
        <br/><br/>
        <h6>Baseline emissions from all blocks in this precinct</h6>
        {tag}
         { tag === "Gas" ? <Bar data={gasdata_} options={options} /> :
         <Bar data= {predata_} options={options}/> }
 
        <br/>
      

    <br/>
   
           </Col>

        <Col xs="2" style={{padding:"20px"}}>
        {p &&   <>  <Button color="warning"><Link to={{pathname:"/viewPrecinct/"+p.id,state: p}} 
        style={{color:"white", textDecoration:"none"}}>View Blocks</Link></Button><br/><br/>
        <Button>Update Precinct</Button> </> }
        </Col>
             </Row>
         </Container>    
        </div>
    )
}

export default ViewNeighbourhood
