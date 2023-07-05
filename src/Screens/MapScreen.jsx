import { View } from 'react-native';
import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PropTypes } from 'prop-types';

const MapScreen = ({ route }) => {
  const { coords } = route.params;
  return (
    <View>
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          region={{
            ...coords,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          mapType="standard"
          minZoomLevel={15}
          onMapReady={() => console.log('Map is ready')}
          onRegionChange={() => console.log('Region change')}
        >
          <Marker
            title="Photo"
            coordinate={{ ...coords }}
            description="location"
          />
        </MapView>
      </View>
    </View>
  );
};

export default MapScreen;

MapScreen.propTypes = {
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
