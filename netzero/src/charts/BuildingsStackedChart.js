import { element, objectOf } from 'prop-types';
import React,{useState} from 'react'
import { Bar } from "react-chartjs-2";
import firebase from '../../src/firebase'
import {Sum } from "react-lodash"
const BuildingsStackedChart =({data}) => {
 
    let prop = data
     const [docs, setdocs] = useState([])
    const [labels, setlabels] = useState([])
    const [stackedData_, setstackedData] = useState([])
  const [lighting, setLighting] = useState([])
  const [lighting_external, setLightingExternal] = useState([])
  const [appliances, setAppliances] = useState([])
  const [cooking, setCooking] = useState([])
  const [cooling, setCooling] = useState([])
  const [space_heating, setSpaceHeating] = useState([])
  const [water_heating, setWaterHeating] = useState([])

  let lightingObject = {
    label : "lighting",
    data : [1,2,3,4,5,6,7,2,4,6,8,9,1,3]
  }
 let stackedObject = [
   {
     label : "lighting",
     data : [1,2,3,4,5,6,7,2,4,6,8,9,1,3]
   },
   {
    label : "lighting external",
    data : [11,22,33,44,55,66,77,2,4,6,8,0,1,3]
  },
  {
    label : "appliances",
    data : [111,222,333,444,555,666,77,2,4,6,8,0,1,3]
  },
  {
    label : "space heating",
    data : [2,4,6,8,0,1,3, 2,4,6,8,0,1,3]
  },
  {
    label : "cooling",
    data : [1,3,5,7,9,6,4, 2,4,6,8,0,1,3]
  },
  {
    label : "cooking",
    data : [2,3,4,5,6,7,8, 2,4,6,8,0,1,3]
  },
  {
    label : "water heating",
    data : [9,8,7,6,5,4,3, 2,4,6,8,0,1,3]
  }

 ]

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
     
      let group =  data.reduce((r, e) =>{
        let l =  e.model
        if(!r[l])r[l] = {l, values:[e]}
        else r[l].values.push(e)
        return r
      }, {})
          setlabels(Object.keys(group))
           setstackedData(Object.values(group))
           createStackData()    
            })
    }
    
  

    const createStackData = () =>{
    let lighting = []
    let lighting_external = []
    let cooking = []
    let cooling = []
    let water_heating = []
    let space_heating = []
    let appliances = []
      
    stackedData_.map((a)=>{     
         let asd = a.values.map(item => item.lighting).reduce((prev, curr) => prev + curr, 0)
         lighting.push(asd)   
    })
    setLighting(lighting)
  
    stackedData_.map((a)=>{     
      let asd = a.values.map(item => item.lighting_external).reduce((prev, curr) => prev + curr, 0)
      lighting_external.push(asd)   
 })
 
 stackedData_.map((a)=>{     
  let asd = a.values.map(item => item.cooking).reduce((prev, curr) => prev + curr, 0)
  cooking.push(asd)   
})
 
stackedData_.map((a)=>{     
  let asd = a.values.map(item => item.appliances).reduce((prev, curr) => prev + curr, 0)
  appliances.push(asd)   
})
 
stackedData_.map((a)=>{     
  let asd = a.values.map(item => item.cooling).reduce((prev, curr) => prev + curr, 0)
  cooling.push(asd)   
})

stackedData_.map((a)=>{     
  let asd = a.values.map(item => item.space_heating).reduce((prev, curr) => prev + curr, 0)
  space_heating.push(asd)   
})

stackedData_.map((a)=>{     
  let asd = a.values.map(item => item.water_heating).reduce((prev, curr) => prev + curr, 0)
  water_heating.push(asd)   
}) 
  
  
       setLightingExternal(lighting_external)
       setCooking(cooking)
      setCooling(cooling)
     setSpaceHeating(space_heating)
       setWaterHeating(water_heating)
    setAppliances(appliances)
    }
 
    
 
    const stackedData = {
        labels: stackedData_.map((a)=>(
          a.l
        )),
        datasets: [
         
          {
            label: 'Lighting',
            data:  lighting.map((l)=>(
              l
            )),
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
          },
          {
            label: 'Lighting External',
            data: lighting_external.map((b)=>(
              b
            )),
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
          },
          {
            label: 'Appliances',
            data: appliances.map((a)=>(
              a
            )),
            backgroundColor:'rgba(255, 206, 86, 1)',
            borderWidth: 2,
          },
          {
            label: 'Space Heating',
            data: space_heating.map((a)=>(
              a
            )),
            backgroundColor:  'rgba(75, 192, 192,1)',
            borderWidth: 2,
          },
            {
            label: 'Cooling',
            data: cooling.map((a)=>(
              a
            )),
            backgroundColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
          },
          {
            label: 'Water heating',
            data: water_heating.map((a)=>(
              a
            )),
            backgroundColor:   'rgba(255, 159, 64, 1)',
            borderWidth: 2,
          },
          {
            label: 'Cooking',
            data: cooking.map((a)=>(
              a
            )),
            backgroundColor: 'rgba(255, 49, 86, 1)',
            borderWidth: 2,
          },
          
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
            <h6>Stationery Energy (Electricity) By End User</h6>
             <Bar data={stackedData} options={stackedDataoptions} />

  
         
        </div>
    )
}

export default BuildingsStackedChart
