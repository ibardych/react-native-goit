import PropTypes from 'prop-types';

const { View, Text, StyleSheet, Pressable } = require('react-native');

const Button = ({ type, onPress, children }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={{ ...styles.button, ...styles[`${type}Button`] }}
        onPress={onPress}
      >
        <Text style={{ ...styles.label, ...styles[`${type}Label`] }}>
          {children}
        </Text>
      </Pressable>
    </View>
  );
};

export default Button;

Button.propTypes = {
  type: PropTypes.string,
  onPress: PropTypes.func,
  children: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    borderRadius: 100,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FF6C00',
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#F6F6F6',
  },
  disabledLabel: {
    color: '#BDBDBD',
  },
});
