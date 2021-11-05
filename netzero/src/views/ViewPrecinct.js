import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal, ModalHeader, ModalBody, Container, Row, Col, ModalFooter, Input } from 'reactstrap';
import useGetBlocks from '../hooks/useGetBlocks';
import { Bar, Pie } from "react-chartjs-2";
import { elementType } from 'prop-types';


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

      const pie2data_ = {
        labels:pie2labels,
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

    const viewSiteInfo = (nb) =>{
        setselectedFilter("All Sites")
        let neighbourhood = [];
        let filter_ = []
        setb(nb)
         firebase.firestore().collection("sites").where("block_id","==", nb.id).get().then((doc)=>{
        
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              neighbourhood.push(nb)
            })

             getDataandLabels(neighbourhood)
          
            setdocs(neighbourhood)

              let result
              let abc =  neighbourhood.reduce((r, e) =>{
                 let l = e.model
                if(!r[l])
                {
                  r[l] = {l, _tag:[e]}
                }
                else
                {
                  r[l]._tag.push(e)
                } 
                return r
              }, {}) 
               result = Object.values(abc)
                   result.map(c =>(
                 filter_.push(c.l)     
                 
              ))
              console.log(abc)
              setfilter(filter_)
                    })
    }

    const getDataandLabels = (_data) =>{
        let label = []
        let data = []
        _data.forEach(element => {
             label.push(element.model)
        });

        _data.forEach(element => {
            data.push(element.total)
        });
total = 0
        _data.forEach(element => {
             total += element.total
        
      });

     console.log(total)
      set_total(total)
        setdata_(data)            
        setlabels(label)
    }

    const filterChart = (filter) =>{
      setselectedFilter(filter)
      let newData = []
         docs.filter(function(tag) {
            if(tag.site_tag === filter)
            {
              newData.push(tag)
            }
            return newData
          });
          getDataandLabels(newData)
        //  setdocs(newData)
        
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
                    <h4 onClick={()=>history.goBack()} style={{cursor:"pointer"}}>{data.precint}</h4></Col>
                    <Col>  <Button color="danger" onClick={toggle}>Create Block</Button>
                 </Col>
                    </Row>           
            </div>
            
   <Container  style={{maxWidth:"100%"}}>
       <Row>
       <Col xs="2" style={{padding:"20px"}}><h5>Blocks</h5><br/>
       {blocks.length  === 0 ? <><p>You have no blocks</p>     
                </> : 
                <>
                {blocks.map((nb)=>(
                    <p key={nb.id} style={{background:nb.id === b.id ? "#fdb940" : "#ffffff", border:"2px solid #000000", borderColor: "black",textAlign: "center",  padding:15, width:200, borderRadius:15, fontSize:18, color:"black", marginBottom:30 }}>
                    {/* to={{pathname:"/viewBlock/"+nb.id,state: nb}} */}
                 <a onClick={()=>viewSiteInfo(nb)} style={{color:nb.id === b.id ? "white":"black", cursor: "pointer",fontWeight:"bold",}}  >{nb.block}</a>
                 </p>
                ))}
                </>
                }
       </Col>
         <Col xs="8" style={{padding:"40px"}}>
        {b.id === undefined ? null : docs.length === 0 ? 
        <div>
        {/* <h5><b>{b.block}</b></h5>
        <Link to={{pathname:"/setSites/"+b.id,state: b}} style={{color:"white", background:"#333",
        borderRadius:"10px", padding:"10px 30px"}}>Assign Site</Link> 
         <Button color="danger" onClick={toggle}>Update Block</Button></>:  */}
         </div> :
         <>
    
         <Container>
           <Row>
          
             <Col>
             <Pie data={data_}   />
             <br/>
             <Bar data= {data_} options={options}/>
              </Col>
           </Row>
         </Container>
       
         </>
         }
       
         </Col>
           <Col  xs="2">
           <br/>
           <h5>Site Summary</h5>
           {_total}
           <Button color="warning">
                 <Link to={{pathname:"/setSites/"+b.id,state: b}} 
                  style={{color:'white', textDecoration:"none"}}>Update Sites</Link>
             </Button><br/> <br/>
           {docs && docs.map((s)=>(
               <div style={{borderBottom:"thin solid #999", marginBottom:20}}>                                 
                       <Row>
                            <Col><p>{s.site_name}{'\n'}{s.model}</p></Col>
                            <Col><p style={{textAlign:"right"}}>{_total && parseInt(s.total/_total*100)}%</p></Col>
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
