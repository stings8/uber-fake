import React from 'react';
import { View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// import { Container } from './styles';

const Search = () => {
  return <GooglePlacesAutocomplete
    placeholder="Para onde ?"
    onPress={() => {}}
    textInputProps={{
        autoCapitalize: 'none',
        autoCorrect: false
    }}
    fetchDetails
    enablePoweredByContainer={false}
  />;
}

export default Search;