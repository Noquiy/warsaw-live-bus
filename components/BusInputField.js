import React, { useState, useRef, useEffect } from "react";
import styles from '../src/styles/styles.module.css';
import { ZtmSession } from '../api/warsaw-wtp-api';

const ztmSession = new ZtmSession('98d4a59a-0237-4480-9842-6811337ea267');


const BusInputField = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [busNumbers, setBusNumbers] = useState([
        '175',
        '102',
        '103', '104', '105', '106', '107', '108', '110', '111', '112', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '131', '132', '133', '134', '135', '136', '138', '139', '140', '141', '142', '143', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '196', '197', '198', '199', '200', '201', '202', '203', '204', '207', '208', '209', '210', '211', '212', '213', '217', '218', '219', '220', '221', '222', '225', '226', '228', '234', '239', '240', '245', '249', '250', '251', '255', '256', '262', '263', '264'
        // Add more bus numbers as needed
    ]);
    const [userInput, setUserInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const [busLocations, setBusLocations] = useState([]); 

    const handleInputChange = (e) => {
        setUserInput(e.target.value);

        // Filter the suggestions based on the user's input
        const filteredSuggestions = busNumbers.filter((bus) =>
            bus.toLowerCase().includes(e.target.value.toLowerCase())
        );

        setShowDropdown(true);
    };

    const handleSelectOption = (bus) => {
        setUserInput(bus);
        setShowDropdown(false);
        getBusLocation(bus);
    };

    const handleInputFocus = () => {
        if (userInput === '') {
            setShowDropdown(true);
        }
    };

    const handleClickOutside = (e) => {
        if (
            inputRef.current &&
            !inputRef.current.contains(e.target) &&
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target)
        ) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const suggestions = busNumbers.filter((bus) =>
        bus.toLowerCase().includes(userInput.toLowerCase())
    );

    const getBusLocation = async (busNumber) => {
        try {
            const response = await fetch('http://localhost:3000/getBusLocation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ busNumber }),
            });

            if (response.status === 200) {
                const locations = await response.json();
                setBusLocations(locations);
                console.log(setBusLocations);
            } else {
                throw new Error ('Server Error');
            }

        } catch (error) {
            console.error('Error fetching bus locations:', error);
        }
    }

    const [map, setMap] = useState(null);
    const markers = []; 

    const createMarker = (lat, lng) => {
        if (map) {
            const marker = new google.maps.Marker({
                position: { lat, lng },
                map,
                title: 'Bus Location', 
            });
            markers.push(marker); 
        }
    };    

    const updateMarkers = (locations) => {
        clearMarkers();
        locations.forEach(location => {
            createMarker(location.location.latitude, location.location.longitude);
        });
    };

    const clearMarkers = () => {
        markers.forEach(marker => {
            marker.setMap(null);
        });
        markers.length = 0; 
    };

    return (
        <div className={isSidebarOpen ? styles['sidebar-open'] : styles['sidebar']}>
            <div className={styles['custom-input-container']} ref={inputRef}>
                <h1>Warsaw Bus Live</h1>
                <input
                    type="text"
                    placeholder="Enter bus number"
                    value={userInput}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                />
                {showDropdown && (
                    <div className={styles['custom-dropdown']} ref={dropdownRef}>
                        {suggestions.map((bus, index) => (
                            <div
                                key={index}
                                className={styles['custom-option']}
                                onClick={() => handleSelectOption(bus)}
                            >
                                {bus}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                {busLocations.map((location, index) => (
                    <div key={index}>
                        Latitude: {location.location.latitude}, Longitude: {location.location.longitude}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusInputField;