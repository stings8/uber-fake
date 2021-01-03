import React from 'react';
import MapViewDirections from 'react-native-maps-directions';

const Directions = ({ destination, origin, onReady }) => {
    console.log(destination)
  return (
      <MapViewDirections
        destination={destination}
        origin={origin}
        onReady={onReady}
        apikey="AIzaSyCwZPr0RTIRVcX0JrSXk6NvQAQeQkkIBzE"
        strokeWidth={3}
        strokeColor="#222"
      />
  )
}

export default Directions;