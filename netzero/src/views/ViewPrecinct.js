import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal, ModalHeader, ModalBody, Container, Row, Col, ModalFooter, Input } from 'reactstrap';
import useGetBlocks from '../hooks/useGetBlocks';
import { Bar, char } from "react-chartjs-2";

const ViewPrecinct = props => {
    let history = useHistory()
    let data = props.location.state
    let blocks = useGetBlocks(data.id).docs
    const [modal, setModal] = useState(false);
    const [block, setblock] = useState()
    const [b, setb] = useState([])
    const [docs, setdocs] = useState([])

    const toggle = () => setModal(!modal);
  

    const data_ = {
        labels: ["Organic", "Sponsored", "Organic", "Sponsored"],
        previousDate: {
          label: "08/10/2019 - 09/30/2019",
          dataSet: [10000, 150000, 10000, 150000]
        },
        currentDate: {
          label: "10/01/2019 - 11/20/2019",
          dataSet: [10000, 225000, 10000, 225000]
        }
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

    const viewSiteInfo = (nb) =>{
        setb(nb)
      //  alert(JSON.stringify(nb))
        firebase.firestore().collection("sites").where("block_id","==", nb.id).get().then((doc)=>{
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
    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={toggle}>&times;</button>;
 
    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}   external={externalCloseBtn}>
        <ModalHeader>Add new precinct</ModalHeader>
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
                    <Col><h1 style={{color:"white"}}>Blocks</h1>
                    <h4 onClick={()=>history.goBack()}>{data.precint}</h4></Col>
                    <Col>  <Button color="danger" onClick={toggle}>Create Block</Button>
                 </Col>
                    </Row>           
            </div>
            
   <Container>
       <Row>
       <Col xs="3" style={{padding:"20px"}}><h3>Blocks</h3><br/>
       {blocks.length  === 0 ? <><p>You have no blocks</p>     
                </> : 
                <>
                {blocks.map((nb)=>(
                    <p style={{background:nb.id === b.id ? "#fdb940" : "#ffffff", border:"2px solid #000000", borderColor: "black",textAlign: "center",  padding:15, width:200, borderRadius:15, fontSize:18, color:"black", marginBottom:30 }}>
                    {/* to={{pathname:"/viewBlock/"+nb.id,state: nb}} */}
                 <a onClick={()=>viewSiteInfo(nb)} style={{color:nb.id === b.id ? "white":"black", cursor: "pointer",fontWeight:"bold",}}  >{nb.block}</a>
                 </p>
                ))}
                </>
                }
       </Col>
         <Col xs="6" style={{padding:"40px"}}>
        {b.id === undefined ? null : docs.length === 0 ? 
        <>
        <h5><b>{b.block}</b></h5>
        <Link to={{pathname:"/setSites/"+b.id,state: b}} style={{color:"white", background:"#333",
        borderRadius:"10px", padding:"10px 30px"}}>Assign Site</Link> 
         <Button color="danger" onClick={toggle}>Update Block</Button></>: <p>Update data</p>}
         <Bar
        pointStyle="star"
        data={{
          labels: data.labels,
          responsive: true,
          offset: true,
          datasets: [
            {
              label: "Mobile",
              pointStyle: "rectRounded",
              backgroundColor: "#6ED3FF",
              barThickness: 40,
              categoryPercentage: 1,
              data: data_.previousDate.dataSet //From API
            },
            {
              label: "Desktop",
              backgroundColor: "#1497FF",
              barThickness: 40,
              categoryPercentage: 1,
              pointStyle: "triangle",
              data: data_.currentDate.dataSet //From API
            }
          ]
        }}
        height={220}
        options={{
          offsetGridLines: true,
          drawTicks: true,
          layout: {
            padding: {
              top: 30,
              right: 40,
              bottom: 40
            }
          },
          legend: {
            display: true,
            position: "right",
            align: "start",
            labels: {
              usePointStyle: true
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  padding: 5
                },
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                stacked: false,
                gridLines: {
                  drawBorder: false
                },
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 6,
                  padding: 20,
                  callback(n) {
                    if (n < 1e3) return n;
                    if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
                  }
                }
              }
            ]
          }
        }}
      />
         </Col>
           <Col  xs="3">
           <br/>
           <h6>Site Summary</h6>
           {docs && docs.map((s)=>(
               <>                                 
                       <Row>
                            <Col><p>{s.site_tag}{'\n'}{s.site_name}</p></Col>
                            <Col><p>{s.site_value}</p></Col>
                       </Row>
                   <hr/>
               </>
            
        ))}
           </Col>
       </Row>
   </Container>
         
        </div>
    )
}

export default ViewPrecinct
