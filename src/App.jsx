import { Outlet } from "react-router-dom";
import Header from "./components/Header";


function App() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center">
        <Outlet />
      </main>
    </>
  );
}

export default App;
