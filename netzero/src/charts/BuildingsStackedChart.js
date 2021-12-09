import React,{useState} from 'react'
import { Bar } from "react-chartjs-2";
import firebase from '../../src/firebase'
import { Col, Row, } from 'reactstrap';

const BuildingsStackedChart =({data}) => {
 
    let prop = data
     const [labels, setlabels] = useState([])
    const [stackedData_, setstackedData] = useState([])
  const [lighting, setLighting] = useState([])
  const [lighting_external, setLightingExternal] = useState([])
  const [appliances, setAppliances] = useState([])
  const [cooking, setCooking] = useState([])
  const [cooling, setCooling] = useState([])
  const [space_heating, setSpaceHeating] = useState([])
  const [water_heating, setWaterHeating] = useState([])

 
     React.useEffect(()=>(
       data.tag === "block"
       ? viewSiteInfo2():
          viewSiteInfo()

           
        ),[data])

        const viewSiteInfo2 = () =>{
          let data = [];
  
  
           firebase.firestore().collection("sites").where("neighbourhood_id","==", prop.data.neighbourhood_id).where("model_tag","==", "Buildings").get().then((doc)=>{        
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
        createStackData(Object.values(group))
            setlabels(Object.keys(group))
             setstackedData(Object.values(group))
              
              })
      }


    const viewSiteInfo = () =>{
        let data = [];


         firebase.firestore().collection("sites").where("neighbourhood_id","==", prop.data.id).where("model_tag","==", "Buildings").get().then((doc)=>{        
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
      createStackData(Object.values(group))
          setlabels(Object.keys(group))
           setstackedData(Object.values(group))
            
            })
    }
    
  

    const createStackData = (data) =>{
    //   setLighting([])
  
    //    setLightingExternal([])
    //    setCooking([])
    //   setCooling([])
    //  setSpaceHeating([])
    //    setWaterHeating([])
    // setAppliances([])
    let lighting = []
    let lighting_external = []
    let cooking = []
    let cooling = []
    let water_heating = []
    let space_heating = []
    let appliances = []
      
    data.map((a)=>{     
         let asd = a.values.map(item => item.lighting).reduce((prev, curr) => prev + curr, 0)
         lighting.push(asd)   
    })
    setLighting(lighting)
    data.map((a)=>{     
      let asd = a.values.map(item => item.lighting_external).reduce((prev, curr) => prev + curr, 0)
      lighting_external.push(asd)   
 })
 
 data.map((a)=>{     
  let asd = a.values.map(item => item.cooking).reduce((prev, curr) => prev + curr, 0)
  cooking.push(asd)   
})
 
data.map((a)=>{     
  let asd = a.values.map(item => item.appliances).reduce((prev, curr) => prev + curr, 0)
  appliances.push(asd)   
})
 
data.map((a)=>{     
  let asd = a.values.map(item => item.cooling).reduce((prev, curr) => prev + curr, 0)
  cooling.push(asd)   
})

data.map((a)=>{     
  let asd = a.values.map(item => item.space_heating).reduce((prev, curr) => prev + curr, 0)
  space_heating.push(asd)   
})

data.map((a)=>{     
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
            data:   lighting.map((l)=>(
              l/100
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
            backgroundColor:   'rgba(255, 223, 999, 1)',
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
        },
        plugins: {
          legend: {
              display: true,
           position:'right'
          }
      }
      };
  
    return (
        <div style={{marginTop:"40px"}}>
       
    <Row>
      <Col xs="8">
      <h6>Stationery Energy (Electricity) By Building Type</h6>
           {stackedData_ && <Bar data={stackedData} options={stackedDataoptions} />}
      </Col>
      <Col style={{display:"grid", gridTemplateColumns:"1fr 1fr"}}>
      {/* {stackedData_.map((a)=>(
  <>
  <p style={{borderBottom: "thin solid #999", width:"100%"}}>
                <span style={{fontWeight:"bold", fontSize:"12px"}}>
              {a.l}
              </span><br/>
              <span style={{textAlign:"right"}}>{a.values.map(item => parseInt(item.scopeValue)).reduce((prev, curr) => prev + curr, 0)} 
              </span>
              </p>     
  </> 
))} */}
      </Col>
    </Row>
          
    
        </div>
    )
}

export default BuildingsStackedChart
