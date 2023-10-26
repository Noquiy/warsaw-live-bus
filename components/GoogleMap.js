import React, { useEffect, useState } from 'react';

const GoogleMap = () => {

    useEffect(() => {
        async function initMap(){
            const { Map } = await google.maps.importLibrary('maps');
            const map = new Map(document.getElementById('map'), {
                center: { lat: 52.2297, lng: 21.0122 },
                zoom: 12.4,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
            });
        }
        initMap();
    }, []);
    return <div id='map' style={{ height: '100vh ', width: '100%' }}></div>;
};
export default GoogleMap;

