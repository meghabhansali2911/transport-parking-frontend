import { Routes, Route } from "react-router-dom";
import Dashboard from "./component/Dashboard/Dashboard.js";
import { VehicleList } from "./component/SubComponent/VehicleList.js";
import { PurchasePassList } from "./component/SubComponent/PurchasePassList.js";
import { ParkingSlotList } from "./component/SubComponent/ParkingSlotList.js";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/vehicle-list" element={<VehicleList />}></Route>
        <Route path="/pass-list" element={<PurchasePassList />}></Route>
        <Route path="/parking-slot-list" element={<ParkingSlotList />}></Route>
      </Routes>
    </>
  );
}

export default App;
