import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import './App.css';
import Login from "./Login/Login";
import CreateUser from "./views/CreateUser";
import Neighbourhood from "./views/Neighbourhood";
import ViewNeighbourhood from "./views/ViewNeighbourhood";

function App() {
  return (
    <Router>
       <div className="App">      
      <Switch>      
      <Route path="/viewNeighbourhood" component={ViewNeighbourhood}></Route>
      <Route path="/CreateUser"><CreateUser/></Route>
      <Route path="/Neighbourhood"><Neighbourhood/></Route>
      <Route path="/"><Login/> </Route>
      </Switch>
      </div>
      </Router>
  );
}

export default App;
