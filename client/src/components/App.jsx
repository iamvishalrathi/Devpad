
import {BrowserRouter , Route , Routes , Navigate} from "react-router-dom";

import {v4 as uuidV4} from "uuid"

import Panel from "./Panel.jsx"

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" exact element={<Navigate to={`/code/${uuidV4()}`}/>}></Route>
      <Route path="/code/:id" element={<Panel/>}>
      </Route>
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
