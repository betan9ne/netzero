import React,{useState} from 'react'
import { Bar } from "react-chartjs-2";
import firebase from '../../src/firebase'

const BuildingsStackedChart =({data}) => {
    let prop = data
     const [docs, setdocs] = useState([])
const [stackData, setstackData] = useState([])

  const [lighting, setLighting] = useState([])
  const [lighting_external, setLightingExternal] = useState([])
  const [appliances, setAppliances] = useState([])
  const [cooking, setCooking] = useState([])
  const [cooling, setCooling] = useState([])
  const [space_heating, setSpaceHeating] = useState([])
  const [water_heating, setWaterHeating] = useState([])

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
        //     let group = data.reduce((r, a) => {
        //       r[a.model_tag] = [...r[a.model_tag] || [], a];
        //    return r;
        //   }, {});           
          
        // let asd = Object.entries(group)
              setdocs(data)   
              createStackData(data)    
             
       })
    }
    
    const createStackData = (data) =>{
      let lighting = []
      let lighting_external = []
      let appliances = []
      let cooking = []
      let cooling = []
      let space_heating = []
      let water_heating = []

      let lighting_total = 0

      data.filter((val)=>{
        if(val.lighting){
          lighting_total +=val.lighting
          lighting.push(lighting_total)
        }
         if(val.lighting_external)
        {
          lighting_external.push(val.lighting_external)
        }
         if(val.appliances)
        {
          appliances.push(val.appliances)
        }
         if(val.space_heating){
          space_heating.push(val.space_heating)
        }
         if(val.cooling)
        {
          cooling.push(val.cooling)
        }
         if(val.water_heating)
        {
          water_heating.push(val.water_heating)
        }         
         if(val.cooking){
          cooking.push(val.cooking)
        }
     

     //   console.log(finalData)
        
      })
   //   console.log(lighting)    
      setLighting(lighting)
      setLightingExternal(lighting_external)
      setCooking(cooking)
      setCooling(cooling)
      setSpaceHeating(space_heating)
      setWaterHeating(water_heating)
      setAppliances(appliances)
    }
 
  
    const stackedData = {
        labels: docs.map((a)=>(
          a.model
        )),
        datasets: [
          {
            label: 'Lighting',
            data: lighting.map((a)=>(
              a
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
        <div>
      
             <Bar data={stackedData} options={stackedDataoptions} />
        </div>
    )
}

export default BuildingsStackedChart
