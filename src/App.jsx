import { Outlet } from "react-router";
import { Header, Footer } from "./components/index";
function App() {

  return (
    <>
     <Header />
     <Outlet/>
     <Footer />
    </>
  )
}

export default App;