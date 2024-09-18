import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/Context';

export const NavBar = () => {
    const navigate = useNavigate();
    const { setClicked } = useContext(DataContext);

    // Function to handle navigation
    const handleNav = () => {
        try {
            // Navigate to vehicle list page and reset states
            setClicked(false);
            navigate('/vehicle-list');
        } catch (error) {
            console.error('An error occurred while navigating:', error);
        }
    };

    return (
        <div className="navcontainer">
            <nav className="nav">
                <div className="nav-upper-options">
                    <div className="option2 nav-option" onClick={() => {
                        setClicked(false);
                        navigate('/vehicle-list')
                    }}>
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
                            className="nav-img"
                            alt="Registered Vehicles"
                        />
                        <h6>Registered <br /> Vehicle List</h6>
                    </div>
                    <div className="option2 nav-option" onClick={() => {
                        setClicked(false);
                        navigate('/pass-list')
                    }}>
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
                            className="nav-img"
                            alt="Registered Vehicles"
                        />
                        <h6>Purchase  <br /> Pass List</h6>
                    </div>

                    <div className="option2 nav-option" onClick={() => {
                        setClicked(false);
                        navigate('/parking-slot-list')
                    }}>
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
                            className="nav-img"
                            alt="Registered Vehicles"
                        />
                        <h6>Parking  <br /> Slot List</h6>
                    </div>
                </div>
            </nav>
        </div>
    );
};
