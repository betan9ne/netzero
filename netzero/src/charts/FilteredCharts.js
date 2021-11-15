import React,{useEffect, useState} from 'react'
import firebase from '../../src/firebase'
import {useHistory, Link} from 'react-router-dom'
import useGetNeighbourhood from '../hooks/useGetNeighbourhood'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Row, Input, Container, ButtonGroup } from 'reactstrap';
import { Doughnut, Bar } from "react-chartjs-2";


const FilteredCharts = () => {

    let neighbourhoods = useGetNeighbourhood().docs

    const viewSiteInfo = (nb, tag) =>{
      
        settag(tag)
       let neighbourhood = [];
          let buildings = []
          getPrecinctData(nb.id)
          setb(nb)
           firebase.firestore().collection("sites").where("neighbourhood_id","==", nb.id).get().then((doc)=>{
          
              doc.docs.forEach(document => {
                const nb = {
                  id: document.id,
                  ...document.data()
                }
                neighbourhood.push(nb)
              })
             
              //get buildings data
              neighbourhood.filter((val)=>{
                if(val.model_tag === tag)
                {
                  buildings.push(val)
                }
              })
             // setdocs(transport)
             
                getGasData(neighbourhood)
               
             let group = buildings.reduce((r, a) => {
              r[a.model] = [...r[a.model] || [], a];
           return r;
          }, {});           
          
        let asd = Object.entries(group)
  
             getDataandLabels(asd)
       //       console.log(result)
          //       setfilter(filter_)
                      })
      }

      const getGasData = (data)=>{
   

        let total_water_heating = 0
        let total_gas_cooking = 0
      
          data.filter((val)=>{
            if(val.gas_water_heating){
              total_water_heating  = total_water_heating + val.gas_water_heating
            }
            if(val.gas_cooking){
              total_gas_cooking = total_gas_cooking + val.gas_cooking
            }
          })
      
          let asd = [
            {
              label : "Water Heating",
              data : total_water_heating
            },
            {
              label :"Cooking",
              data : total_gas_cooking
            }
          ]

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
         
            setdata_(data)            
            setlabels(label)
        }
    

    return (
        <>
          <div style={{display:"flex", marginBottom:20, justifyContent:"center"}}>
        <ButtonGroup>
         <Button color="warning" style={{color:"white"}} onClick={()=>viewSiteInfo(id,"Buildings")}>Stationary Energy (Electricity)</Button>
         <Button color="warning" style={{color:"white"}}  onClick={()=>viewSiteInfo(id,"Transport")}>Transport Emissions</Button>
         <Button  color="warning" style={{color:"white"}}  onClick={()=>viewSiteInfo(id,"Gas")}>Stationary Energy (Gas)</Button>
          </ButtonGroup>
        </div>   
        </>
    )
}

export default FilteredCharts
