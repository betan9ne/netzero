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