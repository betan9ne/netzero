import React,{useState, useEffect} from 'react'
import {Col, Row, } from 'reactstrap';
import { Doughnut } from "react-chartjs-2";
import firebase from '../../src/firebase'

const BaselineEmissionsPieChart =({data})=> {
  
   const [graphSummaries, setgraphSummaries] = useState([])
    const [baselineEmissions, setbaselineEmissions] = useState([])

    let infrastructure = 0
    let transport = 0
    let energy = 0
    let gas = 0

    useEffect(() => {
       getData(data)
    }, [data])


    const getData = (_data) =>{     
     
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
            {
              label: "Transport",
              data : transport
            },
            {
              label : "Stationery Energy (Electricity)",
              data : energy
            },
            {
              label : "Stationery Energy (Gas)",
              data : gas
            }
          ]
      
          let scopeData = [
            {
              label : "Scope 1",
              data : energy + infrastructure
            },
            {
              label : "Scope 2",
              data : gas + transport
            }
          ]     
         
          setbaselineEmissions(asd)
          setgraphSummaries(scopeData)
       
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

    return (
        <div style={{display:"flex",justifyContent:"center"}}>
             <Row>
          <Col xs="6"><Doughnut data={scopeData} /></Col>
          <Col xs="6"><Doughnut data={baseline} /></Col>
        </Row>
        </div>
    )
}

export default BaselineEmissionsPieChart
