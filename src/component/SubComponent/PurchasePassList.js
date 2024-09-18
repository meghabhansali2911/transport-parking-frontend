import React, { useEffect, useState } from 'react';
import Header from '../Dashboard/Header';
import { NavBar } from '../Dashboard/NavBar';
import axios from 'axios';
import SearchBar from './SearchBar'; // Ensure this path is correct

export const PurchasePassList = () => {
    const [vehicleList, setVehicleList] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [message, setMessage] = useState("Loading....");

    async function fetchData() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_NODE_URL}vehicles/purchase-pass-list`);

            if (response.data.status === true) {
                setVehicleList(response.data.data);
                setFilteredVehicles(response.data.data); // Initialize filtered list
                if (response.data.data.length === 0) setMessage("No Purchase Pass Yet");
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
    }, []);

    // Utility function to format dates
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short' }; // You can change 'short' to 'long' for full month names
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

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
            <div className="main-container">
                <NavBar />
                <div className="main">
                    <div className="report-container">
                        <div className="report-header">
                            <h1 className="recent-Articles">Purchased Pass List</h1>
                            <SearchBar onSearch={handleSearch} /> {/* Include SearchBar here */}
                        </div>

                        {filteredVehicles.length > 0 ? (
                            <div className="report-body">
                                <div className="report-topic-heading">
                                    <div className="t-op">Vehicle Number</div>
                                    <div className="t-op">Vehicle Type</div>
                                    <div className="t-op">Days</div>
                                    <div className="t-op">Purchase Date</div>
                                    <div className="t-op">Expiry Date</div>
                                    <div className="t-op">Amount</div>
                                </div>
                                <div className="items">
                                    {filteredVehicles.map((vehicle, index) => (
                                        <div className="item1" key={index}>
                                            <div className="t-op-nextlvl">{vehicle.vehicle_number}</div>
                                            <div className="t-op-nextlvl">{vehicle.vehicle_type}</div>
                                            <div className="t-op-nextlvl">{vehicle.days}</div>
                                            <div className="t-op-nextlvl">{formatDate(vehicle.purchase_date)}</div>
                                            <div className="t-op-nextlvl">{formatDate(vehicle.expiry_date)}</div>
                                            <div className="t-op-nextlvl">{vehicle.amount}</div>
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
        </>
    );
};
