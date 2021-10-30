import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal, ModalHeader, ModalBody, Container, Row, Col, ModalFooter, Input } from 'reactstrap';
import useGetBlocks from '../hooks/useGetBlocks';
import { PolarArea } from "react-chartjs-2";

const ViewPrecinct = props => {
    let history = useHistory()
    let data = props.location.state
    let blocks = useGetBlocks(data.id).docs
    const [modal, setModal] = useState(false);
    const [block, setblock] = useState()
    const [b, setb] = useState([])
    const [docs, setdocs] = useState([])
    const [labels, setlabels] = useState([])
    const [_data, setdata_] = useState([])

    const toggle = () => setModal(!modal);
  
console.log(labels)




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
        let label = []
        let data = []
        setb(nb)
         firebase.firestore().collection("sites").where("block_id","==", nb.id).get().then((doc)=>{
            const neighbourhood = [];
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              neighbourhood.push(nb)
            })

            doc.docs.forEach(element => {
                label.push(element.data().site_name)
            });

            doc.docs.forEach(element => {
                data.push(element.data().site_value)
            });
            setdata_(data)            
            setlabels(label)
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
         <PolarArea data={data_} />
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
