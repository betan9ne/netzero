import React,{useEffect, useState} from 'react'
import { Doughnut, Bar } from "react-chartjs-2";
import { ButtonGroup, Button, Row, Col } from 'reactstrap';
import firebase from '../firebase'

const Inputs = ({data}) => {
 
    const [labels, setlabels] = useState([])
    const [_data, setdata_] = useState([])
    const [tag, settag] = useState(0)
    const [fullData, setfullData] = useState([])


    let asd = []
    useEffect(() => {
        let neighbourhood = [];
        let buildings = []
        let residential = []
        let traffic = []
        let transport = []
        firebase.firestore().collection("sites").where("neighbourhood_id","==", data.id).get().then((doc)=>{
            doc.docs.forEach(document => {
             const nb = {
               id: document.id,
               ...document.data()
             }
             neighbourhood.push(nb)
           })
           
                neighbourhood.filter((val)=>{
             if(val.model_tag === "Buildings")
             {
               buildings.push(val)
             }
             if(val.model.includes("Residential"))
             {
                residential.push(val)
             }
             if(val.model_tag === "Infrastructure")
             {
                 traffic.push(val)
             }   
             if(val.model_tag === "Transport")
             {
                 transport.push(val)
             }             
           })
            
       
               let groupResidential = residential.reduce((r, a)=>{
                   r[a.model] = [...r[a.model] || [], a]
                   return r
               }, {})

               let group = buildings.reduce((r, a) => {
                r[a.model] = [...r[a.model] || [], a];
                return r;
                }, {}); 
                
                let groupTraffic = traffic.reduce((r, a) => {
                    r[a.model] = [...r[a.model] || [], a];
                    return r;
                }, {}); 

                let groupTransport = transport.reduce((r, a) => {
                    r[a.model] = [...r[a.model] || [], a];
                    return r;
                }, {}); 
   
               
        
  
//    let   residentialGroup = Object.entries(groupResidential)
//    let   trafficGroup = Object.entries(groupTraffic)
//    let   transportGroup = Object.entries(groupTransport)
            
                switch (tag) {
                    case 0:
                        console.log(tag)
                    asd =  Object.entries(group)
                        break;
                
                    case 1:
                        console.log(tag)
                    asd =  Object.entries(groupResidential)
                        break;
                
                    case 2:
                        console.log(tag)
                    asd =  Object.entries(groupTraffic)
                        break;
                
                    case 3:
                        console.log(tag)
                    asd =  Object.entries(groupTransport)
                        break;
                
                    default:
                        break;
                }
            
         getDataandLabels(asd)
        })
    }, [data.id, tag])

    const showINfo = (tag) =>{
        settag(tag)
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
        let sdf  = {
            labels : label,
            data : data
        }
        setfullData(sdf)
        setdata_(data)            
        setlabels(label)
    }
console.log(fullData)
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

      //C2C0BD C5ACD9 C2C588
    return (
        <div>
        <div style={{display:"flex", justifyContent:"center"}}>
        <ButtonGroup>
            <Button  style={{background:"#98D0DC", color:"black"}} onClick={()=>showINfo(0)}>Area Summary</Button>
            <Button style={{background:"#98D0DC", color:"black"}}  onClick={()=>showINfo(1)}>People Summary</Button>
            <Button style={{background:"#98D0DC", color:"black"}}  onClick={()=>showINfo(2)}>Infrastructure Summary</Button>
            <Button style={{background:"#98D0DC", color:"black"}}  onClick={()=>showINfo(3)}>Vehicle Summary</Button>
        </ButtonGroup>
        </div>
        <Row>
        <Col xs="5">
                <div style={{background:"#98D0DC", width:"70%", marginTop:"40px", padding:"10px", borderRadius:15}}>
                    <p style={{textAlign:"center", fontWeight:"bold"}}>Summary</p>
                    <div style={{background:"white", padding:"20px", borderRadius:15}}>
                    <Row>
                        <Col xs="10"> {labels.map((a, index)=>(
                        <p key={index}>{a}</p>
                    ))}</Col>
                        <Col xs="2"> {_data.map((a, index)=>(
                        <p key={index}>{a}</p>
                    ))}</Col>
                    </Row>
                   
                    </div>
                </div>

            </Col>
            <Col xs="7"><Doughnut data={data_} options={options} /></Col>
           
        </Row>
        
        </div>
    )
}

export default Inputs
