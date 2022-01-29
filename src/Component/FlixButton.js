import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

/**
 * @argument {Object} props
 * @argument {string} props.label - Label of Button
 * @argument {boolean} props.disabled - disabled Button onPress - default false
 * @argument {boolean} props.outline - outlined Button component - default false
 * @argument {boolean} props.smallButton - outlined Button component - default false
 * @argument {boolean} props.onPress - function to call when button Pressed - default false
 * @argument {import('react-native').ViewStyle} props.style - Style of component container
 * @argument {import('react-native').TextProps} props.textStyle - Style of component container
 * @argument {boolean} [props.borderless=false] - Ripple Outside View
 */

export default FlixButton = ({
  label = 'Button',
  disabled = false,
  outline = false,
  smallButton = false,
  borderless = false,
  style,
  textStyle,
  ...props
}) => {
  const onButtonPressed = () => {
    requestAnimationFrame(() => {
      props.onPress && props.onPress();
    });
  };

  const labelColor = outline ? 'black' : 'white';

  const bgColor = pressed =>
    disabled
      ? '#33C19961'
      : pressed
      ? '#33C19946'
      : outline || props.children
      ? 'transparent'
      : style?.backgroundColor || '#33C199';
  const borderColor = pressed =>
    disabled
      ? '#33C19961'
      : pressed
      ? '#33C19946'
      : outline
      ? '#33C199'
      : style?.backgroundColor || 'transparent';

  const showChild = () => {
    if (props.children) return props.children;
    else
      return <Text style={[styles.label, {color: labelColor}]}>{label}</Text>;
  };

  return (
    <Pressable
      disabled={disabled}
      android_ripple={{color: '#33C19946', borderless}}
      hitSlop={4}
      onPress={onButtonPressed}
      style={({pressed}) => [
        {
          backgroundColor: bgColor(pressed),
          borderWidth: 1,
          borderColor: borderColor(pressed),
        },
        styles.containerView,
        style,
      ]}
      {...props}>
      {showChild()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  containerView: {borderRadius: 6, elevation: 4},
  label: {
    margin: 8,
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
});
