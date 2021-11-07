import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal, ModalHeader, ModalBody, Container, Row, Col, ModalFooter, Input, ButtonGroup } from 'reactstrap';
import useGetBlocks from '../hooks/useGetBlocks';
import { Bar, Pie, Doughnut } from "react-chartjs-2";



const ViewPrecinct = props => {
  
    let history = useHistory()
    let data = props.location.state
  
    let blocks = useGetBlocks(data.id).docs
    const [modal, setModal] = useState(false);
    const [block, setblock] = useState()
    const [b, setb] = useState([])
    const [docs, setdocs] = useState([])
    const [labels, setlabels] = useState([])
    const [pie2labels, setpie2labels] = useState([])
    const [_data, setdata_] = useState([])
    const [buildingData, setbuildingData] = useState([])
    const [buildingLabels, setbuildingLabels] = useState([])
    const [infrastructureData, setinfrastructureData] = useState([])
    const [buildingValue, setbuildingValue] = useState([])
    const [pie2data, setpie2data] = useState([])
    const [filter, setfilter] = useState([])
    const [selectedFilter, setselectedFilter] = useState()
    let total = 0
    const [_total, set_total] = useState(0)
    const toggle = () => setModal(!modal);

    const data_ = {
        labels:labels,
        datasets: [
          {
            label: '',
            data: _data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderWidth: 1,
          },
        ],
      };

      const pie2data_ = {
        labels:["Petrol", "Diesel"],
        datasets: [
          {
            label: '',
            data: [pie2data.petrol, pie2data.diesel],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderWidth: 1,
          },
        ],
      };

      const _infrastructureData = {
        labels: labels,
        datasets: [
          {
            label: '# of Votes',
            data: _data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      const _buildingdata = {
        labels: buildingLabels,
        datasets: [
          {
            label: '',
            data: buildingValue,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      const options = {
        indexAxis: 'y',
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
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
            text: 'Chart.js Horizontal Bar Chart',
          },
        },
      };

    const addblock = ()=>{
        firebase.firestore().collection('blocks').add(
            {block: block, 
            precinct_id : data.id,
            neighbourhood_id: data.neighbourhood_id,
            createdAt: new Date().toLocaleDateString()
            }).then((data)=>{
            toggle()
        }).catch((e)=>{
            alert(JSON.stringify(e))
        })
    }

    const viewSiteInfo = (filter) =>{
        setfilter(filter)
    
         let transport = [];
     
         firebase.firestore().collection("sites").where("block_id","==", b.id).where("model_tag","==", filter).get().then((doc)=>{        
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              transport.push(nb)
            })
              setdocs(transport)
             getDataandLabels(transport)
             getBuildingsData(transport)
     
                    })
    }

    let petrol = 0
    let diesel = 0
    let all = 0

    const getDataandLabels = (_data) =>{
        let label = []
        let data = []
        _data.forEach(element => {
             label.push(element.model)
        });

        _data.forEach(element => {
            data.push(element.total)
        });
        
        //filter by diesel and petrol

        _data.filter((val)=>{
            if(val.model.toLowerCase().includes("petrol"))
            {
              petrol ++
            }
            else if(val.model.toLowerCase().includes("diesel"))
            {
              diesel ++
            }
            else{
              all ++
            }
            let asd  = {
              petrol : petrol,
              diesel : diesel,
              all : petrol + diesel
            }
            setpie2data(asd)
        })
        
      
        total = 0
        _data.forEach(element => {
             total += element.total        
      });

        set_total(total)
        setdata_(data)            
        setlabels(label)
    }

     
    let lighting = 0
    let lighting_external = 0
    let appliances = 0
    let space_heating = 0
    let cooling = 0
    let water_heating = 0
    let pool_pump = 0
    let cooking = 0
    let gas_water_heating = 0
    let gas_cooking = 0

    const getBuildingsData = (docs) =>{
        docs.filter((val)=>{
          if(val.lighting){
            lighting  += val.lighting
          }
           if(val.lighting_external)
          {
            lighting_external += val.lighting_external
          }
           if(val.appliances)
          {
            appliances += val.appliances
          }
           if(val.space_heating){
            space_heating += val.space_heating
          }
           if(val.cooling)
          {
            cooling += val.cooling
          }
           if(val.water_heating)
          {
            water_heating += val.water_heating
          }
           if(val.pool_pump){
            pool_pump += val.pool_pump
          }
           if(val.cooking){
            cooking +=val.cooking
          }
           if(val.gas_cooking){
            gas_cooking =+ val.gas_cooking
          }
           if(val.gas_water_heating)
          {
            gas_water_heating+=val.gas_water_heating
          }

          let asd = [
            {
              label : "Lighting", value : lighting
            },
            {
              label: "Lighting External", value : lighting_external
            },
          {
            label : "Appliances" , value : appliances
          },
          {
            label : "Space Heating", value : space_heating
          },
        {
          label : "Cooling", value : cooling
        },
        {
          label : "Water Heating", value : water_heating
        },
        {
          label : "Pool Pump", value : pool_pump
        },
        {
          label : "Cooking", value : cooking
        },
        {
          label : "Gas Cooking", value : gas_cooking
        },
        {label: "Gas Water Heating", value : gas_water_heating}

          ]
          setbuildingData(asd)
            let label = []
          let value = []
          asd.forEach(element => {
                label.push(element.label)
          });
          asd.forEach(element => {
            value.push(element.value)
           
      });

          setbuildingValue(value)
          setbuildingLabels(label)
        })

    }

   
    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={toggle}>&times;</button>;
 
    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}   external={externalCloseBtn}>
        <ModalHeader>Add new block</ModalHeader>
        <ModalBody>
        <Input type="text" required value={block} onChange={e =>setblock(e.target.value)} placeholder="block" />       
             </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addblock}>Confirm</Button>{' '}
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
   
      <div style={{background:"#fdb940", padding:20}}>
                <Row>
                    <Col><h3 style={{color:"white"}}>Blocks</h3>
                    <h6 onClick={()=>history.goBack()} style={{cursor:"pointer"}}>{data.precint}</h6></Col>
                    <Col style={{display:"flex", justifyContent:"flex-end", alignSelf:"flex-end"}}> 
                 </Col>
                    </Row>           
            </div>
            
   <Container  style={{maxWidth:"100%"}}>
       <Row>
       <Col xs="2" style={{padding:"20px"}}>
       <Row>
       <Col><h6>Blocks</h6>  <Button color="secondary" onClick={toggle}>Create Block</Button></Col>
       </Row>
       <br/>
       {blocks.length  === 0 ? <><p>You have no blocks</p>     
                </> : 
                <>
                {blocks.map((nb)=>(
                    <p onClick={()=>setb(nb)}  key={nb.id} style={{background:nb.id === b.id ? "#fdb940" : "#ffffff", 
                    border:"1px solid #000000", borderColor: "black",textAlign: "center",  padding:10, 
                     borderRadius:10, fontSize:16, color:nb.id === b.id ? "white":"black", cursor: "pointer",fontWeight:"bold",
                      marginBottom:30 }}>                  
                 {nb.block}
                 </p>
                ))}
                </>
                }
       </Col>
         <Col xs="8" style={{padding:"40px"}}>
        {b.id === undefined ? 
        <div>
      
         </div> :
         <>
         <div style={{display:"flex", marginBottom:20, justifyContent:"center"}}>
         <ButtonGroup>
         <Button color="warning" style={{color:"white"}} onClick={()=>viewSiteInfo("Buildings")}>Buildings Emmissions</Button>
         <Button color="warning" style={{color:"white"}}  onClick={()=>viewSiteInfo("Transport")}>Transport Emmissions</Button>
         <Button  color="warning" style={{color:"white"}}  onClick={()=>viewSiteInfo("Infrastructure")}>Infrastructure Emmissions</Button>
         </ButtonGroup>
         </div>
         <Row>
            {filter === "Transport" ?<Col xs="6"><Pie data={data_}   /> </Col> : ""}
          {filter === "Transport" ?  <Col xs="6"> <Bar data= {data_} options={options}/></Col> : null}
         </Row>
         <Row>
           
           {filter === "Transport" ? <Col xs="6"> <Pie data={pie2data_} /> </Col>: null}
           {filter === "Buildings" ? <>
           <Col xs="6"> <Doughnut data={_buildingdata} /><br/>
                <Bar data={_buildingdata} /> </Col></>: null}
         </Row> 
         <Row>
            {filter === "Infrastructure" ? <Col xs="6"><Pie data={_infrastructureData} /></Col> : null}
           
         </Row>
             
             
         
         </>
         }
       
         </Col>
           <Col  xs="2">
           <br/>
           <h6>Site Summary</h6>
             <Button color="warning">
                 <Link to={{pathname:"/setSites/"+b.id,state: b}} 
                  style={{color:'white', textDecoration:"none"}}>Update Sites</Link>
             </Button><br/> <br/>
           {docs && docs.map((s)=>(
               <div style={{borderBottom:"thin solid #999", marginBottom:20}}>                                 
                       <Row>
                            <Col><p>{s.site_name}{'\n'}{s.model}</p></Col>
                            <Col><p style={{textAlign:"right"}}>{_total && Math.floor(s.total/_total*100)}%</p></Col>
                       </Row>                
               </div>            
        ))}
           </Col>
       </Row>
   </Container>
         
        </div>
    )
}

export default ViewPrecinct
