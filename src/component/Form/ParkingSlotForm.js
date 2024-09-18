import React, { useState, useEffect, useContext } from 'react';
import Header from '../Dashboard/Header';
import { NavBar } from '../Dashboard/NavBar';
import axios from 'axios';
import { DataContext } from '../../context/Context';

export const ParkingSlotForm = ({ data }) => {

    const { setClicked, setPerform } = useContext(DataContext);

    const [formValue, setFormValue] = useState({
        vehicle_type: "",
        vehicle_number: ""
    });

    const [error, setError] = useState(false);

    // Auto-fill for vehicle number
    const handleVehicleNumberChange = (e) => {
        let value = e.target.value.toUpperCase();
        value = value.replace(/[^A-Z0-9]/g, '');  // Allow only letters and numbers

        // Insert hyphens at appropriate positions
        if (value.length > 2) {
            value = value.slice(0, 2) + '-' + value.slice(2);
        }
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5);
        }
        if (value.length > 8) {
            value = value.slice(0, 8) + '-' + value.slice(8, 12);
        }

        setFormValue({
            ...formValue,
            vehicle_number: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const regexVehicleNumber = /^[A-Z]{2}-[0-9]{2}-[A-Z]{2}-[0-9]{4}$/;

            if (!['cycle', 'motorcycle', 'car'].includes(formValue.vehicle_type)) {
                return setError('Select a valid vehicle type.');
            }
            if (!regexVehicleNumber.test(formValue.vehicle_number)) {
                return setError('Enter a valid vehicle number (e.g., MH-01-RS-1234).');
            }

            handleAdd();

        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (event) => {
        setError('');
        setFormValue({
            ...formValue,
            [event.target.name]: event.target.value
        });
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_NODE_URL}vehicles/book-available-slot`, formValue);

            if (response.data.status === true) {
                setFormValue({
                    vehicle_type: "",
                    vehicle_number: ""
                });
                setClicked(false);
                setPerform("");
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
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
                            <h1 className="recent-Articles"> Book a Parking Slot</h1>
                        </div>

                        <div className="signin_div">
                            <form action="">

                                <div className="filed-content">
                                    <select className="fill-input" name="vehicle_type" value={formValue.vehicle_type} onChange={handleChange}>
                                        <option value="">Select Vehicle Type</option>
                                        <option value="cycle">Cycle</option>
                                        <option value="motorcycle">Motorcycle</option>
                                        <option value="car">Car</option>
                                    </select>
                                </div>

                                <div className="filed-content">
                                    <input className="fill-input" type="text" name="vehicle_number" value={formValue.vehicle_number} placeholder="Vehicle Number (e.g., MH-01-RS-1234)" onChange={handleVehicleNumberChange} />
                                </div>

                                <span style={{ color: 'red', textAlign: 'left', display: 'block' }}>{error}</span>

                                <div className="next-btn mt-4">
                                    <button onClick={(e) => handleSubmit(e)}>Book slot</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
