import PropTypes from 'prop-types';

const { View, Text, StyleSheet, Pressable } = require('react-native');

const Link = ({ onPress, children }) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.label}>{children}</Text>
      </Pressable>
    </View>
  );
};

export default Link;

Link.propTypes = {
  onPress: PropTypes.func,
  children: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#1B4371',
  },
});
