import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";


function App() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
