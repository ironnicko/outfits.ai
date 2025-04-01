import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useDerivedValue,
  useSharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';

const { width } = Dimensions.get('window');
const CIRCLE_LENGTH = 80 * Math.PI * 2;
const R = CIRCLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: number; // a number between 0 and 1
  size?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ progress, size = 90 }) => {
  const sharedProgress = useSharedValue(progress);

  sharedProgress.value = progress;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - sharedProgress.value),
  }));

  const progressText = useDerivedValue(() => {
    return `${Math.floor(sharedProgress.value * 60)}`; // You can adjust max value if needed
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <ReText style={styles.text} text={progressText} />
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          stroke="#eee"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={R}
          stroke="#843CA7"
          strokeWidth={6}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

export default CircularProgress;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#843CA7',
  },
});
