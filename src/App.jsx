import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main className="pt-20 max-w-6xl mx-auto px-4 place-content-center">
        <Outlet />
      </main>
    </>
  );
}

export default App;
