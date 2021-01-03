import React, { useEffect, useRef, useState } from 'react';
import { Image, PermissionsAndroid, Platform, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

import Search from '../Search'
import Directions from '../Directions';
import Details from '../Details';
import { getPixelSize } from "../../utils";

import markerImage from "../../assets/marker.png";
import backImage from "../../assets/back.png";
import {
    Back,
    LocationBox,
    LocationText,
    LocationTimeBox,
    LocationTimeText,
    LocationTimeTextSmall
  } from "./style";

const Map = () => {
    const [region, setRegion] = useState(null);
    const [destination, setDestination] = useState(null);
    const [duration, setDuration] = useState(null);
    const [location, setLocation] = useState(null);

    Geocoder.init('AIzaSyCwZPr0RTIRVcX0JrSXk6NvQAQeQkkIBzE');

    useEffect(() => {
        async function requestPermission(params) {
            if (Platform.OS === 'ios') {
                return getCurrentLocation();
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Device current location permission',
                            message: 'Allow app to get your current location',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'Confirm',
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        return getCurrentLocation();
                    } else {
                        console.log('Location permission denied');
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
        requestPermission();
    },[])

     function getCurrentLocation() {
        Geolocation.requestAuthorization();
        Geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                Geocoder.from({ latitude, longitude })
                .then(response => {
                    const address = response.results[0].formatted_address;
                    console.log('RESPONSE', address)
                    const location = address.substring(0, address.indexOf(','));
                    setLocation(location);
                })
                .catch(error => console.log('ERROR',error))
                
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0143,
                    longitudeDelta: 0.0134
                })
            },
            (erro) => { console.log(erro) },
            {
                timeout: 5000,
                enableHighAccuracy: true,
                maximumAge: 1000,
            }
        )
    }

    function handleLocationSelected(data, { geometry }) {
        const { location : { lat: latitude, lng: longitude} } = geometry;

        setDestination({
            latitude,
            longitude,
            title: data.structured_formatting.main_text,
        })
    }

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
                ref={el => (this.mapView = el)}
            > 
                {
                    destination && (
                        <>
                        <Directions 
                            origin={region}
                            destination={destination}
                            onReady={result => {
                                setDuration(Math.floor(result.duration))
                                this.mapView.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: getPixelSize(20),
                                        left: getPixelSize(20),
                                        top: getPixelSize(20),
                                        bottom: getPixelSize(180)
                                      }
                                });
                            }}
                        />
                        <Marker 
                            coordinate={destination}
                            anchor={{ x: 0, y: 0}}
                            image={markerImage}
                        > 
                        <LocationBox>
                            <LocationText>{destination.title}</LocationText>
                        </LocationBox>
                        </Marker>

                        <Marker 
                            coordinate={region}
                            anchor={{ x: 0, y: 0}}
                        > 
                        <LocationBox>
                            <LocationTimeBox>
                                <LocationTimeText>{duration}</LocationTimeText>
                                <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                            </LocationTimeBox>
                            <LocationText>{location}</LocationText>
                        </LocationBox>
                        </Marker>
                        </>
                    )
                }
            </MapView>
            {
                destination ? 
                <>
                    <Back onPress={() => setDestination(null)}>
                        <Image source={backImage} />
                    </Back>
                    <Details />
                </> :
                <Search onLocationSelected={handleLocationSelected}/>
            }
            
        </View>
    )
}

export default Map;