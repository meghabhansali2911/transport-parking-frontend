// import './Dashboard.css';
import './../../App.css';
import React from 'react';
import Header from './Header';
import { NavBar } from './NavBar';
function Dashboard() {
    return (
        <>
            <Header />
            <div className="main-container">
                <NavBar />
            </div>
        </>
    );
}

export default Dashboard;
