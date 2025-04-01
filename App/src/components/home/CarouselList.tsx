import React, { useState } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import CarouselItem from "./CarouselCard";

const { width } = Dimensions.get("window");

interface CarouselProps {
  data: { title: string; subtitle: string; image: any }[];
}

const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <CarouselItem item={item} />}
        onScroll={handleScroll}
      />
      
      {/* Indicator Dots */}
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <View key={index} style={[styles.dot, activeIndex === index && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D3C4E3",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#843CA7",
  },
});

export default Carousel;
