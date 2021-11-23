import React,{useState} from 'react'
import { Bar } from "react-chartjs-2";
import firebase from '../../src/firebase'
import { Col, Row, } from 'reactstrap';
const BuildingStackedChartInverted = ({data}) => {

    let prop = data
     
    const [stackedData_, setstackedData] = useState([])
    const [Religous, setReligous] = useState([])
    const [Education, setEducation] = useState([])
   const [Government, setGovernment] = useState([])
   const [MuncipalOffice, setMuncipalOffice] = useState([])
   const [PublicOpenSpace, setPublicOpenSpace] = useState([])
   const [PublicServiceInfrastructure, setPublicServiceInfrastructure] = useState([])
   const [BusinessCommercial, setBusinessCommercial] = useState([])
   const [VacantLand, setVacantLand] = useState([])
   const [WarehouseLight, setWarehouseLight] = useState([])
   const [warehouseMed, setwarehouseMed] = useState([])
   const [warehouseHigh, setwarehouseHigh] = useState([])
   const [ResidentialLow, setResidentialLow] = useState([])
   const [ResidentialMed, setResidentialMed] = useState([])
   const [ResidentialHigh, setResidentialHigh] = useState([])
 
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
          //   setstackedData(Object.values(group))
         createStackData(data)    
            })
    } 
   
    const getMe = (data) =>{
      let totalLighting = 0
     // console.log(data)
      data.filter((val)=>{
        if(val.model === "Residential (High Density)"){      
        
          let  data = [
            val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
            ]
            setResidentialHigh(data)
          }
          if(val.model === "Residential (Medium Density)"){      
            let  data = [
              val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
              ]
              setResidentialMed(data)
            }
            if(val.model === "Residential (Low Density)"){      
              let  data = [
                val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
                ]
                setResidentialLow(data)
              }
              if(val.model === "Warehouse (High Industrial)"){      
                let  data = [
                  val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
                  ]
                  setwarehouseHigh(data)
                }
                if(val.model === "Warehouse (Medium Industrial)"){      
                  let  data = [
                    val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
                    ]
                    setwarehouseMed(data)
                  }
                  if(val.model === "Warehouse (Light Industrial)"){      
                    let  data = [
                      val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
                      ]
                      setWarehouseLight(data)
                    }
        if(val.model === "Business & Commercial"){ 
          let  data = [
          totalLighting = totalLighting+ (val.lighting/100), val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
          ]
          setBusinessCommercial(data)
        }
        if(val.model === "Education"){      
          let  data = [
            val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
            ]
            setEducation(data)
          }
          if(val.model === "Government"){      
            let  data = [
              val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
              ]
              setGovernment(data)
            }
            if(val.model === "Municipal Office"){      
              let  data = [
                val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
                ]
                setMuncipalOffice(data)
              }
              if(val.model === "Public Open Space"){      
                let  data = [
                  val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
                  ]
                  setPublicOpenSpace(data)
                }
                if(val.model === "Public Service Infrastructure"){      
                  let  data = [
                    val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
                    ]
                    setPublicServiceInfrastructure(data)
                  }
                  if(val.model === "Religious"){      
                    let  data = [
                      val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
                      ]
                      setReligous(data)
                    }
                    if(val.model === "Vacant Land"){      
                      let  data = [
                        val.lighting/100, val.lighting_external, val.appliances,val.space_heating, val.cooling, val.water_heating, val.cooking         
                        ]
                        setVacantLand(data)
                      }
      })
        
    }
 
    const createStackData = (data) =>{
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
 
    }

    const stackedData = {
        labels: labels.map((a)=>(
          a
        )),
        datasets: [         
          {
            label: 'Business & Commercial',
            data: BusinessCommercial.map((l)=>(
            l
            )),
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
          },
          {
            label: 'Education',
            data: Education.map((b)=>(
              b
            )),
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
          },
          {
            label: 'Government',
            data: Government.map((a)=>(
              a
            )),
            backgroundColor:'rgba(255, 206, 86, 1)',
            borderWidth: 2,
          },
          {
            label: 'Muncipal Office',
            data: MuncipalOffice.map((a)=>(
              a
            )),
            backgroundColor:  'rgba(75, 192, 192,1)',
            borderWidth: 2,
          },
            {
            label: 'Public Open Space',
            data: PublicOpenSpace.map((a)=>(
              a
            )),
            backgroundColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
          },
          {
            label: 'Public Service Infrastructure',
            data: PublicServiceInfrastructure.map((a)=>(
              a
            )),
            backgroundColor:   'rgba(55, 578, 64, 1)',
            borderWidth: 2,
          },
          {
            label: 'Religious',
            data: Religous.map((a)=>(
              a
            )),
            backgroundColor: 'rgba(255, 49, 86, 1)',
            borderWidth: 2,
          },
          {
            label: 'Vacant Land',
            data: VacantLand.map((a)=>(
              a
            )),
            backgroundColor: '#94D2BD',
            borderWidth: 2,
          },
          {
            label: 'Residential High Density',
            data: ResidentialHigh.map((a)=>(
              a
            )),
            backgroundColor: "#AE0366",
            borderWidth: 2,
          },
          {
            label: 'Residential Medium Density',
            data: ResidentialMed.map((a)=>(
              a
            )),
            backgroundColor: '#04A777',
            borderWidth: 2,
          },
          {
            label: 'Residential Low Density',
            data: ResidentialLow.map((a)=>(
              a
            )),
            backgroundColor: '#005F73',
            borderWidth: 2,
          },
          {
            label: 'Warehouse Light Industrial',
            data: WarehouseLight.map((a)=>(
              a
            )),
            backgroundColor: '#820263',
            borderWidth: 2,
          },
          {
            label: 'Warehouse Medium Industrial',
            data: warehouseMed.map((a)=>(
              a
            )),
            backgroundColor: '#D90368',
            borderWidth: 2,
          },
          {
            label: 'Warehouse High Industrial',
            data: warehouseHigh.map((a)=>(
              a
            )),
            backgroundColor: '#FB8B24)',
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
   <h6>Stationery Energy (Electricity) By End Use </h6>         
         <Bar data={stackedData} options={stackedDataoptions} />
   </Col>
   <Col>
   {/* {
         labels.map((a)=>(
             <p>{a}             
              {a.lighting.map(item => parseInt(item.scopeValue)).reduce((prev, curr) => prev + curr, 0)} 
             </p>
         ))
        
     } */}
    
   </Col>
 </Row> 
        </div>
    )
}

export default BuildingStackedChartInverted
