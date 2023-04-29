import './App.css';
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import LogTransaction from "./pages/LogTransaction";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/log-transactions" element={<LogTransaction />} />
    </Routes>
  );
}

export default App;
