import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import Search from '../Search'
// import { Container } from './styles';

const Map = () => {
    const [region, setRegion] = useState(null);
    useEffect(() => {
        Geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0143,
                    longitudeDelta: 0.0134
                })
            },
            ({ message }) => { console.log(message) },
            {
                timeout: 5000,
                enableHighAccuracy: true,
                maximumAge: 1000,
            }
        )
    }, [])



    return (
        <View style={{
            flex: 1
        }}>
            <MapView
                style={{
                    flex: 1
                }}
                region={region}
                showsUserLocation
                loadingEnabled
            />
            <Search/>
        </View>
    )
}

export default Map;