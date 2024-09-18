import React, { useContext, useEffect, useState } from 'react';
import Header from '../Dashboard/Header';
import { NavBar } from '../Dashboard/NavBar';
import axios from 'axios';
import { DataContext } from '../../context/Context';
import { ParkingSlotForm } from '../Form/ParkingSlotForm';
import SearchBar from './SearchBar';

export const ParkingSlotList = () => {
    const { clicked, setClicked, perform, setPerform, userId, userDetails } = useContext(DataContext);
    const [vehicleList, setVehicleList] = useState([]);
    const [message, setMessage] = useState("Loading....");
    const [filteredVehicles, setFilteredVehicles] = useState([]);

    async function fetchData() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_NODE_URL}vehicles/booked-parking-slot-list`);

            if (response.data.status) {
                setVehicleList(response.data.data);
                setFilteredVehicles(response.data.data);
                if (response.data.data.length === 0) setMessage("No vehicles found in parking");
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error('An error occurred while fetching vehicle data:', error);
            setMessage("Failed to load parked vehicles");
        }
    }

    useEffect(() => {
        fetchData();
    }, [clicked]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    function handleBookSlot() {
        setClicked(true);
        setPerform("Book");
    }

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

    const handleReleaseSlot = async (slotId) => {
        if (!slotId) {
            setMessage('Please provide a valid slot ID to release.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_NODE_URL}vehicles/release-slot`, { slot_id: slotId });

            if (response.data.status) {
                setMessage('Slot released successfully.');
                fetchData(); // Refresh the list after release
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error('An error occurred while releasing the slot:', error);
            setMessage('Failed to release the slot.');
        }
    };

    return (
        <>
            <Header />
            {clicked ? (
                perform === "Book" && <ParkingSlotForm data={{ userId, userDetails }} />
            ) : (
                <div className="main-container">
                    <NavBar />
                    <div className="main">
                        <div className="report-container">
                            <div className="report-header">
                                <h1 className="recent-Articles">Parking Slot List</h1>
                                <SearchBar onSearch={handleSearch} />
                                <button className="add" onClick={handleBookSlot}>Book Slot</button>
                            </div>

                            {filteredVehicles.length > 0 ? (
                                <div className="report-body">
                                    <div className="report-topic-heading">
                                        <div className="t-op">Slot Number</div>
                                        <div className="t-op">Vehicle Number</div>
                                        <div className="t-op">Vehicle Type</div>
                                        <div className="t-op">Parking Time</div>
                                        <div className="t-op">Action</div>
                                    </div>
                                    <div className="items">
                                        {filteredVehicles.map((vehicle, index) => (
                                            <div className="item1" key={index}>
                                                <div className="t-op-nextlvl">{vehicle.slot_number}</div>
                                                <div className="t-op-nextlvl">{vehicle.vehicle_number}</div>
                                                <div className="t-op-nextlvl">{vehicle.vehicle_type}</div>
                                                <div className="t-op-nextlvl">{formatDate(vehicle.parking_time)}</div>
                                                <button className="edit" onClick={() => handleReleaseSlot(vehicle.slot_id)}>Release Slot</button>
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
