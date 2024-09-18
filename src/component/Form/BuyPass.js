import React, { useState, useEffect, useContext } from 'react';
import Header from '../Dashboard/Header';
import { NavBar } from '../Dashboard/NavBar';
import axios from 'axios';
import debounce from 'lodash.debounce'; // Ensure lodash.debounce is installed
import { DataContext } from '../../context/Context';

export const BuyPass = ({ data }) => {
    const { setClicked } = useContext(DataContext);

    const [formValue, setFormValue] = useState({
        owner_name: data.userDetails.owner_name,
        days: 1,
        vehicle_type: data.userDetails.vehicle_type,
        vehicle_number: data.userDetails.vehicle_number,
    });

    const [passAmount, setPassAmount] = useState(0);
    const [error, setError] = useState('');

    const fetchPassAmount = debounce(async (days, vehicleType) => {
        if (!days || !vehicleType) return;
        try {
            const response = await axios.get(`${process.env.REACT_APP_NODE_URL}vehicles/pass-rates/?days=${days}&vehicle_type=${vehicleType}`);
            setPassAmount(response.data.data.amount);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch pass amount.');
        }
    }, 200);

    useEffect(() => {
        fetchPassAmount(formValue.days, formValue.vehicle_type);
    }, [formValue.days, formValue.vehicle_type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formValue.days <= 0) {
            setError('Select a valid number of days to buy a pass.');
            return;
        }
        await purchasePass();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValue((prevState) => ({ ...prevState, [name]: value }));

        // Validate 'days' input
        if (name === 'days') {
            const daysValue = parseInt(value, 10);
            if (daysValue > 365) {
                setError('Number of days cannot exceed 365.');
                return; // Exit early if validation fails
            }
            fetchPassAmount(value, formValue.vehicle_type);
        }

        setError('');
    };

    const purchasePass = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_NODE_URL}vehicles/purchase-pass`, {
                vehicle_number: formValue.vehicle_number,
                days: Number(formValue.days),
                vehicle_type: formValue.vehicle_type,
            });

            if (response.data.status) {
                alert(response.data.message);
                setClicked(false);
            } else {
                setError(response.data.message || 'Failed to purchase pass.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setError('An error occurred while purchasing the pass.');
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
                            <h1 className="recent-Articles">Buy Vehicle Pass</h1>
                        </div>

                        <div className="signin_div">
                            <form onSubmit={handleSubmit}>
                                <div className="filed-content">
                                    <input className="fill-input" type="text" name="owner_name" value={formValue.owner_name} placeholder="Owner Name" readOnly />
                                </div>

                                <div className="filed-content">
                                    <select className="fill-input" name="vehicle_type" value={formValue.vehicle_type} onChange={handleChange} readOnly>
                                        <option value="">Select Vehicle Type</option>
                                        <option value="cycle">Cycle</option>
                                        <option value="motorcycle">Motorcycle</option>
                                        <option value="car">Car</option>
                                    </select>
                                </div>

                                <div className="filed-content">
                                    <input className="fill-input" type="text" name="vehicle_number" value={formValue.vehicle_number} placeholder="Vehicle Number (e.g., MH-01-RS-1234)" readOnly />
                                </div>

                                <div className="filed-content">
                                    <input
                                        className="fill-input"
                                        type="number"
                                        name="days"
                                        value={formValue.days}
                                        onChange={handleChange}
                                        min="1"
                                        max="365"
                                        placeholder="Enter number of days"
                                    />
                                    <div className="days-label">Days</div> {/* Added descriptive div */}
                                </div>


                                <div className="filed-content">
                                    <input className="fill-input" type="text" name="pass_amount" value={passAmount} readOnly />
                                </div>

                                <span style={{ color: 'red', textAlign: 'left', display: 'block' }}>{error}</span>

                                <div className="next-btn mt-4">
                                    <button type="submit">Purchase Pass</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
