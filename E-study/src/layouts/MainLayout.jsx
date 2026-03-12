import { Outlet } from "react-router-dom"
import Sidebar from "../components/SideBar"
import "../styles/Layout.css"

function MainLayout(){

  return(

    <div className="layout">

      <Sidebar/>

      <main className="content">
        <Outlet/>
      </main>

    </div>

  )

}

export default MainLayout