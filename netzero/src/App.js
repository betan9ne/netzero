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
            <Route path="/viewPrecinct/:id" component={ViewPrecinct}></Route>
            <Route path="/setSites/:id" component={SetSites}></Route>
            <Route path="/viewBlock/:id" component={ViewBlock}></Route>
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
