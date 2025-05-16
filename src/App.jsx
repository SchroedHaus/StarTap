import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import "react-image-crop/dist/ReactCrop.css";


function App() {
  return (
    <>
      <Header />
      <main className="mx-auto px-4 place-content-center items-center flex">
        <Outlet />
      </main>
    </>
  );
}

export default App;
