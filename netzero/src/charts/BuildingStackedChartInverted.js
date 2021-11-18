import { element, objectOf } from 'prop-types';
import React,{useState} from 'react'
import { Bar } from "react-chartjs-2";
import firebase from '../../src/firebase'
import {Sum } from "react-lodash"

const BuildingStackedChartInverted = ({data}) => {

    let prop = data
     
    const [stackedData_, setstackedData] = useState([])
  const [_lighting, setLighting] = useState([])
  const [docs, setdocs] = useState([])
 
let labels = ["Lighting", "Lighting External", "Appliances", "Space Heating", "Cooling", "Water Heating", "Cooking"]
 
     React.useEffect(()=>(
    viewSiteInfo()
        ),[data])

    const viewSiteInfo = () =>{
        

        let data = [];
         firebase.firestore().collection("sites").where("neighbourhood_id","==", prop.id).where("model_tag","==", "Buildings").get().then((doc)=>{        
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              data.push(nb)
            }) 
            getMe(data)
            setdocs(data)
    
     //console.log((Object.values(group)))
     let lighting = []
  

      setLighting(lighting)    
          //   setstackedData(Object.values(group))
         createStackData(data)    
            })
    } 

    let lighting = 0
    let lighting_external = 0
    let appliances = 0
    let space_heating = 0
    let cooling = 0
    let water_heating = 0
    let pool_pump = 0
    let cooking = 0
 
    const getMe = (data) =>{
               
    }

    const createStackData = (data) =>{
      setLighting([]) 
    let lighting = [] 
    data.forEach(element =>{
       
            if(element.lighting === 0)
            {
                let asd = {
                    label : element.model,
                    data : 0
                }
                lighting.push(asd)
            }
            else{
                let asd = {
                    label : element.model,
                    data : element.lighting
                }
                lighting.push(asd)
            }
          
        
    })
  //  console.log(lighting)
    // stackedData_.map((a)=>{     
    //      let asd = a.values.map(item => item.lighting).reduce((prev, curr) => prev + curr, 0)
    //      lighting.push(asd)   
    // }) 

setLighting(lighting) 
    }
 
    
 
    const stackedData = {
        labels: labels.map((a)=>(
          a
        )),
        datasets: [
         
        //   {
        //     label: 'Lighting',
        //     data:  lighting.map((l)=>(
        //       l.data/100
        //     )),
        //     backgroundColor: 'rgba(255, 99, 132, 1)',
        //     borderWidth: 2,
        //   },
        //   {
        //     label: 'Lighting External',
        //     data: lighting_external.map((b)=>(
        //       b
        //     )),
        //     backgroundColor: 'rgba(54, 162, 235, 1)',
        //     borderWidth: 2,
        //   },
        //   {
        //     label: 'Appliances',
        //     data: appliances.map((a)=>(
        //       a
        //     )),
        //     backgroundColor:'rgba(255, 206, 86, 1)',
        //     borderWidth: 2,
        //   },
        //   {
        //     label: 'Space Heating',
        //     data: space_heating.map((a)=>(
        //       a
        //     )),
        //     backgroundColor:  'rgba(75, 192, 192,1)',
        //     borderWidth: 2,
        //   },
        //     {
        //     label: 'Cooling',
        //     data: cooling.map((a)=>(
        //       a
        //     )),
        //     backgroundColor: 'rgba(153, 102, 255, 1)',
        //     borderWidth: 2,
        //   },
        //   {
        //     label: 'Water heating',
        //     data: water_heating.map((a)=>(
        //       a
        //     )),
        //     backgroundColor:   'rgba(55, 578, 64, 1)',
        //     borderWidth: 2,
        //   },
        //   {
        //     label: 'Cooking',
        //     data: cooking.map((a)=>(
        //       a
        //     )),
        //     backgroundColor: 'rgba(255, 49, 86, 1)',
        //     borderWidth: 2,
        //   },
          
         ],
         
      };
      
      const stackedDataoptions = {
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
        <div style={{marginTop:"40px"}}>
        {/* {stackedData_.map((a)=>(
  <>
  <h6>{a.l}</h6>
  {a.values.map(item => item.lighting).reduce((prev, curr) => prev + curr, 0)} 
  {a.values.map((b)=>(
    <> 
    <p>{b.lighting}<br/></p>
    </>
  ))}
  </> 
))} */}
 {docs.map((a)=>(
     <p>{a.lighting} - {a.model}</p>
 ))}
            <h6>Stationery Energy (Electricity) By End User(Swapped)</h6>
             <Bar data={stackedData} options={stackedDataoptions} />
    
     {
         labels.map((a)=>(
             <p>{a}</p>
         ))
     }
        </div>
    )
}

export default BuildingStackedChartInverted
