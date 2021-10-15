import logo from './logo.svg';

import {Route,BrowserRouter, Switch} from 'react-router-dom';
import { Home } from './pages/Home/Home';
import {NewRoom} from './pages/Home/NewRoom';
import {AuthContextProvider} from './contexts/AuthContext' 
import Room from './pages/Room/Room';
import AdminRoom from './pages/Room/AdminRoom';


function App() {
  
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/rooms/new" exact component={NewRoom}/>
          <Route path="/rooms/:id" component={Room}/>
          <Route path="/admin/rooms/:id" component={AdminRoom}/>
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App;
