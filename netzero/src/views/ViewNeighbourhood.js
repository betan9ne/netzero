import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Input } from 'reactstrap';
import useGetPrecinct from '../hooks/useGetPrecinct';
import { PolarArea } from "react-chartjs-2";
const ViewNeighbourhood = props => {
    let data = props.location.state
    let precinct = useGetPrecinct(data.id).docs
    const [modal, setModal] = useState(false);
    const [precint, setprecint] = useState()
    const [p, setp] = useState(null)
    const [b, setb] = useState([])
    const [docs, setdocs] = useState([])
    const [blocks, setblocks] = useState([])
    const [labels, setlabels] = useState([])
    const [_data, setdata_] = useState([])
    const [filter, setfilter] = useState([])
    const [selectedFilter, setselectedFilter] = useState()
    const toggle = () => setModal(!modal);

  let history = useHistory()

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

  const viewSiteInfo = (nb) =>{
      getBlocks(nb)
     
    setselectedFilter("All Sites")
    let neighbourhood = [];
    let filter_ = []
    setb(nb)
     firebase.firestore().collection("sites").where("precinct_id","==", nb.id).get().then((doc)=>{
    
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
            let l = e.block_id
            if(!r[l])r[l] = {l, _tag:[e]}
            else r[l]._tag.push(e)
            return r
          }, {}) 
           result = Object.values(abc)
               result.map(c =>(
             filter_.push(c.l)     
             
          ))
          setfilter(filter_)
          console.log(filter_)
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


    const getBlocks = (p) =>{
        setp(p)
        console.log(p)
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
        <Input type="text" required value={precint} onChange={e =>setprecint(e.target.value)} placeholder="Email" />
       
             </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addprecinct}>Confirm</Button>{' '}
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <div style={{background:"#fdb940", padding:20}}>
                <Row>
                    <Col><h1 style={{color:"white"}}>Precincts</h1>
                    <h4 onClick={()=>history.goBack()} style={{cursor:"pointer"}}>{data.neighbourhood}</h4>
                    </Col>
                    <Col> <Button color="danger" onClick={toggle}>Create precinct</Button>
                    
                    </Col>
                    </Row>           
            </div>
           
         <Container  style={{maxWidth:"100%"}}>
             <Row>
                 <Col xs="2">
                 <br/>
                 <h5>List of Precincts</h5>
                 <br/>
                  {precinct.length  === 0 ? <p>You have no precinct</p> : <>
                    {precinct.map((nb)=>(
                        <p style={{marginBottom:40, background: "#fdb940", border:"2px solid #000000", borderColor: "black",textAlign: "center",  padding:15, width:200, borderRadius:15, fontSize:18, color:"black", marginBottom:30 }}>
        <a onClick={()=>viewSiteInfo(nb)} style={{color:"black", cursor: "pointer",fontWeight:"bold",}} > {nb.precint}</a>
                 {/* <Link to={{pathname:"/viewPrecinct/"+nb.id,state: nb}}>{nb.precint}</Link> */}
                 </p>
                ))}
                 </> }</Col>
 
                 <Col xs="8" style={{padding:"40px"}}>
        {p && <Link to={{pathname:"/viewPrecinct/"+p.id,state: p}} style={{color:"white", background:"#333",
        borderRadius:"10px", padding:"10px 30px"}}>View Blocks ({docs.length})</Link>}
         {/* {_data.length === 0 ? null :  <PolarArea data={data_}   />} */}
        </Col>

        <Col xs="2">
                 <br/>
       <h5> {blocks && blocks.length} Blocks Found</h5><br/>
        {blocks && blocks.map((p)=>(
            <p style={{background:"#444", borderRadius:"15px", border:"2px solid #fdb940", color:"white", alignSelf:"flex-start", padding:"15px 20px", textAlign:"center"}}>{p.block}</p>
        ))}
        </Col>
             </Row>
         </Container>    
        </div>
    )
}

export default ViewNeighbourhood
