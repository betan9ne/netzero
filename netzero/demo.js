<b>Residential</b>
<p onClick={()=>setSiteInfo("Low density","Residential")}>Low density</p>
<p  onClick={()=>setSiteInfo("Low density Pool","Residential")}>Low Density Pool</p>
<p onClick={()=>setSiteInfo("Medium density","Residential")}>Medium Density</p>
<p  onClick={()=>setSiteInfo("High density","Residential")}>High Density</p>
<b>Commercial or Other</b>
<p onClick={()=>setSiteInfo("Business & Commercial","Commercial")}>Business & Commercial</p>
<p onClick={()=>setSiteInfo("Education","Commercial")}>Education</p>
<p onClick={()=>setSiteInfo("Residential","Commercial")}>Residential</p>
<p onClick={()=>setSiteInfo("Office","Commercial")}>Office</p>
<p onClick={()=>setSiteInfo("Religious","Commercial")}>Religious</p>
<p onClick={()=>setSiteInfo("Government","Commercial")}>Government</p>
<p onClick={()=>setSiteInfo("Public Open Space","Commercial")}>Public Open Space</p>
<p onClick={()=>setSiteInfo("Vacant Land","Commercial")}>Vacant Land</p>
<p onClick={()=>setSiteInfo("Public Service Infrastructure","Commercial")}>Public Service Infrastructure</p>
<b>Infrastructure</b>
<p onClick={()=>setSiteInfo("Street Lights","Infrastructure")}>Street Lights</p>
<p onClick={()=>setSiteInfo("Traffic Lights","Infrastructure")}>Traffic Lights</p>
<b>Transport</b>
<p onClick={()=>setSiteInfo("Small petrol","Transport")}>Small petrol</p>
<p onClick={()=>setSiteInfo("Small Diesel","Transport")}>Small Diesel</p>
<p onClick={()=>setSiteInfo("Medium Petrol","Transport")}>Medium Petrol</p>
<p onClick={()=>setSiteInfo("Medium Diesel","Transport")}>Medium Diesel</p>
<p onClick={()=>setSiteInfo("Large Petrol","Transport")}>Large Petrol</p>
<p onClick={()=>setSiteInfo("Large Diesel","Transport")}>Large Diesel</p>
<b>Warehouse</b>
<p onClick={()=>setSiteInfo("Light industrial","Warehouse")}>Light industrial</p>
<p onClick={()=>setSiteInfo("Medium industrial","Warehouse")}>Medium industrial</p>
<p onClick={()=>setSiteInfo("High industrial","Warehouse")}>High industrial</p>

        <br/><br/>
             <div style={{display:"flex", flexWrap:"wrap"}}>
          {filter && filter.map((f)=>(
             <p style={{padding:10, cursor:"pointer", border:"thin solid #888888", borderRadius:8, marginRight:10}} onClick={()=>filterChart(f)}>{f}</p>
         ))}
         <p style={{padding:10, cursor:"pointer", border:"thin solid #888888", borderRadius:8, marginRight:10}} onClick={()=>filterChart("")}>Clear</p>
         </div>
         <p>Showing results for  : <b>{selectedFilter && selectedFilter}</b></p>
  // for (const key in Residential) {
        //     if (Residential.hasOwnProperty(key)) {

        //     console.log(`${key}: ${Residential[key]}`);
        //     }
        // }

           {/* <Col>
            Set Site values<br/><br/>
            {site} - {tag}
            <Input type="number" required value={siteValue} onChange={e =>setsiteValue(e.target.value)} placeholder="site value" /><br/>
            <Button color="primary" onClick={()=>updateObject(site)}>Confirm</Button>
            </Col> */}

            const filterChart = (filter) =>{
               setselectedFilter(filter)
               let newData = []
                  docs.filter(function(tag) {
                     if(tag.site_tag === filter)
                     {
                       newData.push(tag)
                     }
                     return newData
                   });
                   getDataandLabels(newData)
                 //  setdocs(newData)
                 
             }

             const filterChart = (filter) =>{
              setselectedFilter(filter)
              let newData = []
                 docs.filter(function(tag) {
                    if(tag.site_tag === filter)
                    {
                      newData.push(tag)
                    }
                    return newData
                  });
                  getDataandLabels(newData)
                //  setdocs(newData)
                
            }
              
               {/* <h5><b>{b.block}</b></h5>
        <Link to={{pathname:"/setSites/"+b.id,state: b}} style={{color:"white", background:"#333",
        borderRadius:"10px", padding:"10px 30px"}}>Assign Site</Link> 
         <Button color="danger" onClick={toggle}>Update Block</Button></>:  */}

            let result
            let abc =  neighbourhood.reduce((r, e) =>{
               let l = e.model
              if(!r[l])
              {
                r[l] = {l, _tag:[e]}
              }
              else
              {
                r[l]._tag.push(e)
              } 
              return r
            }, {}) 
             result = Object.values(abc)
                 result.map(c =>(
               filter_.push(c.l)     
               
            ))
             setfilter(filter_)

             const filterChart = (filter) =>{
              setselectedFilter(filter)
              let newData = []
                 docs.filter(function(tag) {
                    if(tag.site_tag === filter)
                    {
                      newData.push(tag)
                    }
                    return newData
                  });
                  getDataandLabels(newData)
                //  setdocs(newData)
                
                }

                asd.map((a)=>(
                  console.log(a)
                ))
               
        
                let asd = Object.keys(buildings)
                asd.forEach(element => {
                 console.log(element)
                });
              
        
                      let result
                      let abc =  buildings.reduce((r, e) =>{
                        let l = e.model
                        if(!r[l])r[l] = {l, _tag:[e]}
                        else r[l]._tag.push(e)
                        return r
                      }, {}) 
                       result = Object.values(abc)
                           result.map(c =>(
                         buildings.push(c.l)   
                      ))
                     setbuildingsData(buildings).

                        // _data.forEach(element => {
        //     console.log(Object.keys(element))
        //    // label.push(element.model)
        // });

      //   _data.forEach(element => {
      //       data.push(element.scopeValue)
      //   });
      //  console.log(data)

      {p ? <>
        <Row>
          <Col xs="6"></Col>
          <Col xs="6">{graphSummaries.map((a)=>(
            <>
            <b>{a.label}</b>
            <p>{a.data}</p>
            </>
          ))} </Col>
        </Row>
        <br/>
        <Row>
          <Col xs="6"></Col>
          <Col xs="6">
            {baselineEmissions.map((a)=>(
              <>
              <b>{a.label}</b>
              <p>{a.data}</p>
              </>
            ))}
          </Col>
        </Row></>
           : null }