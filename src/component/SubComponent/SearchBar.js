import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value); // Call onSearch every time the input changes
    };

    return (
        <div className="search-box">
            <i className="fas fa-search icon-search"></i> {/* Font Awesome icon */}
            <input
                type="text"
                className="input-search"
                placeholder="Search by Vehicle Number"
                value={searchTerm}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBar;
