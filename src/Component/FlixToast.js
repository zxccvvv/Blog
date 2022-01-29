import React from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

class Toast extends React.PureComponent {
  animation = new Animated.Value(0);
  closeOnTimeout = null;

  componentDidMount() {
    const {duration, onClose} = this.props;
    Animated.timing(this.animation, {
      toValue: 1,
      useNativeDriver: true,
      duration: 250,
    }).start();

    if (duration !== 0) {
      this.closeOnTimeout = setTimeout(() => {
        Animated.timing(this.animation, {
          toValue: 0,
          useNativeDriver: true,
          duration: 250,
        }).start(() => onClose());
      }, duration);
    }
  }

  closeManual() {
    Animated.timing(this.animation, {
      toValue: 0,
      useNativeDriver: true,
      duration: 250,
    }).start(() => this.props.onClose());
  }

  render() {
    const {message, status, type, label, onPress} = this.props;
    const styleAnimation = {
      opacity: this.animation,
      transform: [
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    };
    const colorStatus = {
      danger: '#CC0000',
      warning: '#FF8800',
      success: '#007E33',
      info: '#0099CC',
      normal: '#2E2E2E',
    };
    return (
      <Animated.View
        style={[
          styles.toastView,
          {
            backgroundColor: colorStatus[status],
            alignSelf: type === 'snackbar' ? 'stretch' : 'center',
          },
          styleAnimation,
        ]}>
        <Text style={styles.toastText}>{message}</Text>
        {label && (
          <TouchableOpacity
            style={{flex: 0.4}}
            onPress={() => {
              this.closeManual();
              onPress();
            }}>
            <Text style={styles.toastText}>{label}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }
}

Toast.defaultProps = {
  duration: 3000,
  status: 'normal',
};

export default class FlixToast extends React.PureComponent {
  animation = new Animated.Value(0);
  constructor() {
    super();
    FlixToast.Flix = this;
    this.state = {
      toastList: [],
    };
  }

  /**
   * @argument {string} message - Message to show in Toast
   * @argument {Object} [options]
   * @argument {('danger'|'warning'|'success'|'info')}  [options.status=''] - Status for different color of Toast
   * @argument {('toast'|'snackbar')} [options.type="toast"] - show Toast or SnackBar
   * @argument {number} options.duration - show Toast or SnackBar
   * @argument {string} options.label - show Toast or SnackBar
   * @argument {function} options.onPress - show Toast or SnackBar
   *
   * @example
   *
   * ```js
   * FlixToast.show('I'm Toast')
   * ```
   */
  static show(message, options) {
    FlixToast.Flix.show(message, options);
  }

  show(message, options) {
    const id = Math.random().toString();
    const onClose = () => {
      this.hide(id);
    };
    requestAnimationFrame(() => {
      this.setState({
        toastList: [
          // ...this.state.toastList,
          {message, key: id, onClose, ...options},
        ],
      });
    });
  }

  hide(id) {
    this.setState({
      toastList: this.state.toastList.filter(t => t.key !== id),
    });
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : undefined}
        style={styles.containerView}
        pointerEvents="box-none">
        {this.state.toastList.map((el, index) => (
          <Toast {...el} />
        ))}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  containerView: {
    position: 'absolute',
    bottom: 20,
    zIndex: 999,
    left: 8,
    right: 8,
    borderRadius: 5,
    justifyContent: 'flex-end',
  },
  toastView: {
    padding: 16,
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastText: {color: 'white', fontSize: 16, flex: 1},
});
