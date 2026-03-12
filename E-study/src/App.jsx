import { BrowserRouter, Routes, Route } from "react-router-dom"

import MainLayout from "./layouts/MainLayout"

import Tasks from "./pages/Tasks"
import Schedule from "./pages/Schedule"
import Pomodoro from "./pages/Pomodoro"
import Login from "./pages/Login"
import RegisterPage from "./pages/Register"

function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<RegisterPage/>}/>

        <Route element={<MainLayout/>}>

          <Route path="/home" element={<Tasks/>}/>
          <Route path="/schedule" element={<Schedule/>}/>
          <Route path="/pomodoro" element={<Pomodoro/>}/>

        </Route>

      </Routes>

    </BrowserRouter>

  )

}

export default App