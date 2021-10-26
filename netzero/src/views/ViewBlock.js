import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom' 
import { Button, Modal,Row, ModalHeader, ModalBody, ModalFooter, Input, Col, Container } from 'reactstrap';
import useGetSites from '../hooks/useGetSites';
import { Bar } from 'react-chartjs-2';


const ViewBlock =props=> {
    let data = props.location.state
    let sites = useGetSites(data.id).docs
    const[chart, setChartData] = useState()
    const [labels, setlabels] = useState([])
    useEffect(() => {
        getLabels()
    
    }, [sites])

    const getLabels = () =>{
      let labels = []
      let _data = []
        // let asd = sites.reduce(function (r, e) {
        //       // r[a.site_tag] = r[a.site_tag] || [];
        //     // r[a.site_tag].push(a);
        //     // return r;
        // }, Object.create(null));
        let result
        let abc =  sites.reduce((r, e) =>{
          let l = e.site_tag
          if(!r[l])r[l] = {l, _tag:[e]}
          else r[l]._tag.push(e)
          return r
        }, {}) 
         result = Object.values(abc)
        
           result.map(c =>(
           labels.push(c.l)          
        ))
            setlabels(labels)

            result.map(d=>(
              _data.push(d._tag)              
            ))
            setChartData(_data)

           
    }
    // chart && chart.map((a)=>(
    //   <>
    //   <em>{a[0].site_tag}</em><br/>
    //   {a.map((d)=>(
    //     <b>{d.site_name} - {d.site_value}<br/></b>
    //   ))}
    //   </>
    // ))
 
      //console.log(chart)
    const data_ = {
        labels: labels,
        datasets:       
          [              
            {
            label: '# of Blue Votes',
            data: [2, 3, 20, 5, 1, 4],
            backgroundColor: 'rgb(54, 162, 235)',
          },
          {
            label: '# of Green Votes',
            data: [3, 10, 13, 15, 22, 30],
            backgroundColor: 'rgb(75, 192, 192)',
          },]
        
      };
      
      const options = {
        scales: {
          y: {
            stacked: true,
            ticks: {
              beginAtZero: true
            }
          },
          x: {
            stacked: true
          }
        }
      };
      
 
    return (
        <div>
     <Link to={{pathname:"/setSites/"+data.id,state: data}}>Assign Sites to Block</Link>          
<Container>
    <Row>
        <Col xs="3">
        <h1>{data.block}</h1>
            {sites && sites.map((site)=>(
                <div key={site.id}>
                {site.site_tag}<br/>
                <h6>{site.site_name} - {site.site_value}</h6>
                  </div>
            ))}</Col>
    
        <Col>
        <Bar data={data_} options={options} />
        </Col>
     
        {/* {
            label: '# of Blue Votes',
            data: [2, 3, 20, 5, 1, 4],
            backgroundColor: 'rgb(54, 162, 235)',
          } */}
        <Col xs="3">
  
       {/* {chart && chart.map((a)=>(
         <>
         <em>{a[0].site_tag}</em><br/>
         {a.map((d)=>(
           <b>{d.site_name} - {d.site_value}<br/></b>
         ))}
         </>
       ))} */}
        </Col>
    </Row>
    </Container>
          
        </div>
    )
}

export default ViewBlock
