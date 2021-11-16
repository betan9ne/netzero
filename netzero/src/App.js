import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import './App.css';
import React,{useEffect, useState} from 'react'
import Login from "./Login/Login";
import CreateUser from "./views/CreateUser";
import Neighbourhood from "./views/Neighbourhood";
import SetSites from "./views/SetSites";
import ViewBlock from "./views/ViewBlock";
import ViewNeighbourhood from "./views/ViewNeighbourhood";
import ViewPrecinct from "./views/ViewPrecinct";
import firebase from './firebase'
import UpdateSites from "./views/UpdateSites";
import AddSites from "./views/AddSites";
import Manage from "./views/Manage";
import AddNewSites from "./views/AddNewSites";
import VIewBlocks from "./views/VIewBlocks";
function App() {

const [state, setstate] = useState(false)  

useEffect(() => {
  firebase.auth().onAuthStateChanged((user)=>{
    if(user){
      setstate(true)      
    }
    
      })
}, [state])
 

  if(state)
  {
    return(
      <Router>
             <div className="App">      
            <Switch>      
            <Route path="/viewNeighbourhood/:id" component={ViewNeighbourhood}></Route>
            <Route path="/CreateUser"><CreateUser/></Route>
            <Route path="/viewPrecinct/:id" component={VIewBlocks}></Route>
            <Route path="/setSites/:id" component={AddNewSites}></Route>
            <Route path="/manage" component={Manage}></Route>
            <Route path="/viewBlock/:id" component={ViewBlock}></Route>
            <Route path="/updateSites/:id" component={UpdateSites}></Route>
            <Route path="/"><Neighbourhood/></Route>                   
            </Switch>
            </div>
            </Router>
        )
  }
  else{
    return(
<Router>
       <div className="App">      
      <Switch>      
          <Route path="/"><Login/> </Route>
      </Switch>
      </div>
      </Router>
    )
  }
 
}

export default App;
