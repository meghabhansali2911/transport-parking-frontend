import React, { useContext, useEffect, useState } from 'react';
import Header from '../Dashboard/Header';
import { NavBar } from '../Dashboard/NavBar';
import { VehicleForm } from '../Form/VehicleForm';
import { DataContext } from '../../context/Context';
import axios from 'axios';
import { BuyPass } from '../Form/BuyPass';
import SearchBar from './SearchBar';

export const VehicleList = () => {
    const { clicked, setClicked, perform, setPerform, userId, setUserId, userDetails, setUserDetails } = useContext(DataContext);
    const [vehicleList, setVehicleList] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]); // State for filtered vehicles
    const [message, setMessage] = useState("Loading....");

    function handleAddVehicle() {
        setClicked(true);
        setPerform("Add");
    }

    function handleBuyPass(id) {
        setClicked(true);
        setUserId(id);
        setUserDetails(vehicleList.find((vehicle) => vehicle.vehicle_id === id));
    }

    async function fetchData() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_NODE_URL}vehicles/vehicles-list`);

            if (response.data.status === true) {
                setVehicleList(response.data.data);
                setFilteredVehicles(response.data.data); // Initialize filteredVehicles
                if (response.data.data.length === 0) setMessage("No Vehicles Found");
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error('An error occurred while fetching vehicle data:', error);
            setMessage("Failed to load vehicles");
        }
    }

    useEffect(() => {
        fetchData();
    }, [clicked]);

    const handleSearch = (searchTerm) => {
        const filtered = vehicleList.filter(vehicle =>
            vehicle.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredVehicles(filtered);
        if (filtered.length === 0) {
            setMessage("No vehicles found matching your search.");
        } else {
            setMessage("");
        }
    };

    return (
        <>
            <Header />
            {clicked ? (
                perform === "Add" ? <VehicleForm data={{ userId }} /> : <BuyPass data={{ userId, userDetails }} />
            ) : (
                <div className="main-container">
                    <NavBar />
                    <div className="main">
                        <div className="report-container">
                            <div className="report-header">
                                <h1 className="recent-Articles">Vehicle List</h1>
                                <SearchBar onSearch={handleSearch} />
                                <button className="add" onClick={handleAddVehicle}>Add New Vehicle</button>
                            </div>

                            {filteredVehicles.length > 0 ? ( // Use filteredVehicles instead of vehicleList
                                <div className="report-body">
                                    <div className="report-topic-heading">
                                        <div className="t-op">Owner Name</div>
                                        <div className="t-op">Vehicle Type</div>
                                        <div className="t-op">Vehicle Number</div>
                                        <div className="t-op">Phone Number</div>
                                        <div className="t-op">Action</div>
                                    </div>
                                    <div className="items">
                                        {filteredVehicles.map((vehicle, index) => (
                                            <div className="item1" key={index}>
                                                <div className="t-op-nextlvl">{vehicle.owner_name}</div>
                                                <div className="t-op-nextlvl">{vehicle.vehicle_type}</div>
                                                <div className="t-op-nextlvl">{vehicle.vehicle_number}</div>
                                                <div className="t-op-nextlvl">{vehicle.phone_number}</div>
                                                <button className="edit" onClick={() => handleBuyPass(vehicle.vehicle_id)}>Buy Pass</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="item1">
                                    <div className="t-op-nextlvl">{message}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
