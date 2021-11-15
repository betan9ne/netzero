import React,{useState} from 'react'
import { Bar } from "react-chartjs-2";
import firebase from '../../src/firebase'

const CarbonEmissionsStackedChart =({data})=> {
    let prop = data
     const [docs, setdocs] = useState([])

    React.useEffect(()=>(
    viewSiteInfo()
        ),[prop])

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
              setdocs(data)   
              console.log("here",data)         
       })
    }
    

    const stackedData = {
        labels: docs.map((a)=>(
          a.model
        )),
        datasets: [
          {
            label: 'Lighting',
            data: docs.map((a)=>(
              a.lighting
            )),
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
          },
          {
            label: 'Lighting External',
            data: docs.map((a)=>(
              a.lighting_external
            )),
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
          },
          {
            label: 'Appliances',
            data: docs.map((a)=>(
              a.appliances
            )),
            backgroundColor:'rgba(255, 206, 86, 1)',
            borderWidth: 2,
          },
          {
            label: 'Space Heating',
            data: docs.map((a)=>(
              a.space_heating
            )),
            backgroundColor:  'rgba(75, 192, 192,1)',
            borderWidth: 2,
          },
          {
            label: 'Cooling',
            data: docs.map((a)=>(
              a.cooling
            )),
            backgroundColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
          },
          {
            label: 'Water heating',
            data: docs.map((a)=>(
              a.water_heating
            )),
            backgroundColor:   'rgba(255, 159, 64, 1)',
            borderWidth: 2,
          },
          {
            label: 'Cooking',
            data: docs.map((a)=>(
              a.cooking
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

export default CarbonEmissionsStackedChart
