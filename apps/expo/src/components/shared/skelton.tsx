import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Dimensions } from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

interface SkeletonLoaderProps {
  rows: number;
  columns: number;
  itemHeight?: number;
  itemWidth?: number;
}

const { width } = Dimensions.get('window');

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ rows, columns, itemHeight = 20, itemWidth = 100 }) => {
  const shimmerTranslateX = useSharedValue(-width);

  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(width, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, [shimmerTranslateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shimmerTranslateX.value }],
    };
  });

  const renderSkeletonItems = () => {
    const skeletonRows = [];
    for (let i = 0; i < rows; i++) {
      const skeletonColumns = [];
      for (let j = 0; j < columns; j++) {
        skeletonColumns.push(
          <View key={`skeleton-item-${i}-${j}`} style={[styles.skeletonItem, { width: itemWidth, height: itemHeight }]}>
            <Animated.View style={[styles.shimmerEffect, animatedStyle]}>
              <LinearGradient
                colors={['#e0e0e0', '#f0f0f0', '#e0e0e0']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
            </Animated.View>
          </View>
        );
      }
      skeletonRows.push(
        <View key={`skeleton-row-${i}`} style={styles.skeletonRow}>
          {skeletonColumns}
        </View>
      );
    }
    return skeletonRows;
  };

  return <View style={styles.skeletonContainer}>{renderSkeletonItems()}</View>;
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } as StyleProp<ViewStyle>,
  skeletonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  } as StyleProp<ViewStyle>,
  skeletonItem: {
    backgroundColor: '#e0e0e0',
    marginRight: 16,
    borderRadius: 4,
    overflow: 'hidden',
  } as StyleProp<ViewStyle>,
  shimmerEffect: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  } as StyleProp<ViewStyle>,
});

export default SkeletonLoader;
