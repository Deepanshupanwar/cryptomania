import { Routes ,Route} from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
function App() {
  return (
   <div>
    <Routes>
      <Route index element={<h1>
      Hello world!
    </h1>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
    </Routes>
   </div>
  );
}

export default App;
