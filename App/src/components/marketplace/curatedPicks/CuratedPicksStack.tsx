import React, { useState, useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Like from "../../../assets/LIKE.png";
import Nope from "../../../assets/nope.png";
import Cart from "../../../assets/LIKE.png"; //Replace with a Cart Icon
import CuratedPicksCard from "./CuratedPicksCard";
import { Outfit } from "../../../store/curatedPicksStore";

interface CuratedPicksStackProps {
  data: Outfit[];
  onSwipeRight: (outfit: Outfit) => void;
  onSwipeLeft: (outfit: Outfit) => void;
  onSwipeUp: (outfit: Outfit) => void;
}


const ROTATION = 60;
const SWIPE_VELOCITY = 800;
const SWIPE_UP_VELOCITY = 700; // ✅ Velocity threshold for swipe up

const CuratedPicksStack: React.FC<CuratedPicksStackProps> = ({
  data,
  onSwipeRight,
  onSwipeLeft,
  onSwipeUp
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);
  const [expanded, setExpanded] = useState(false);


  const currentOutfit = data[currentIndex];
  const nextOutfit = data[nextIndex];

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const hiddenTranslateX = 2 * screenWidth;
  const hiddenTranslateY = -screenHeight / 2; // ✅ Define off-screen translation for swipe up

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const rotate = useDerivedValue(
    () =>
      interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
      "deg"
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: rotate.value },
    ],
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-hiddenTranslateX, 0, hiddenTranslateX],
          [1, 0.8, 1]
        ),
      },
    ],
    opacity: interpolate(
      translateX.value,
      [-hiddenTranslateX, 0, hiddenTranslateX],
      [1, 0.5, 1]
    ),
  }));

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, hiddenTranslateX / 5], [0, 1]),
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -hiddenTranslateX / 5], [0, 1]),
  }));

  const cartStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, hiddenTranslateY / 5], [0, 1]),
  }));

  const panGesture = Gesture.Pan()
    .minDistance(1)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.velocityX) < SWIPE_VELOCITY && Math.abs(event.velocityY) < SWIPE_UP_VELOCITY) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        return;
      }

      if (event.velocityY < -SWIPE_UP_VELOCITY) {
        // ✅ SWIPE UP to Add to Cart
        translateY.value = withSpring(hiddenTranslateY, {}, () => {
          runOnJS(onSwipeUp)(currentOutfit);
          runOnJS(setCurrentIndex)(currentIndex + 1);
        });
        return;
      }

      translateX.value = withSpring(
        hiddenTranslateX * Math.sign(event.velocityX),
        {},
        () => runOnJS(setCurrentIndex)(currentIndex + 1)
      );

      const onSwipe = event.velocityX > 0 ? onSwipeRight : onSwipeLeft;
      onSwipe && runOnJS(onSwipe)(currentOutfit);
    });

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex]);

  return (
    <GestureHandlerRootView style={styles.root}>
      {nextOutfit && (
        <View style={styles.nextCardContainer}>
          <Animated.View style={[styles.animatedCard, nextCardStyle]}>
            <CuratedPicksCard outfit={nextOutfit} />
          </Animated.View>
        </View>
      )}

      {currentOutfit && (
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.animatedCard, cardStyle]}>
            <Animated.Image
              source={Like}
              style={[styles.like, { left: 10 }, likeStyle]}
              resizeMode="contain"
            />
            <Animated.Image
              source={Nope}
              style={[styles.nope, { right: 10 }, nopeStyle]}
              resizeMode="contain"
            />
            <Animated.Image
              source={Cart}
              style={[styles.cart, cartStyle]} // ✅ Cart Icon for swipe up
              resizeMode="contain"
            />
            <CuratedPicksCard outfit={currentOutfit} />
          </Animated.View>
        </GestureDetector>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  animatedCard: {
    width: "90%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  nextCardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  like: {
    width: 100,
    height: 100,
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1,
    opacity: 0,
  },
  nope: {
    width: 100,
    height: 100,
    position: "absolute",
    top: 20,
    right: 10,
    zIndex: 1,
    opacity: 0,
  },
  cart: {
    width: 100,
    height: 100,
    position: "absolute",
    bottom: 20,
    zIndex: 1,
    opacity: 0, // ✅ Initially hidden
  },
});

export default CuratedPicksStack;


// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, useWindowDimensions,ScrollView,Text } from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   useDerivedValue,
//   interpolate,
//   withSpring,
//   runOnJS,
// } from "react-native-reanimated";
// import {
//   Gesture,
//   GestureDetector,
//   GestureHandlerRootView,
// } from "react-native-gesture-handler";
// import Like from "../../../assets/LIKE.png";
// import Nope from "../../../assets/nope.png";
// import Cart from "../../../assets/LIKE.png"; //Replace with a Cart Icon
// import CuratedPicksCard from "./CuratedPicksCard";
// import { Product } from "../../../types/types";
// import { useCartStore } from "../../../store/cartStore";

// interface CuratedPicksStackProps {
//   data: Product[];
//   onSwipeRight: (item: Product) => void;
//   onSwipeLeft: (item: Product) => void;
// }

// const ROTATION = 60;
// const SWIPE_VELOCITY = 800;
// const SWIPE_UP_VELOCITY = 700; // ✅ Velocity threshold for swipe up

// const CuratedPicksStack: React.FC<CuratedPicksStackProps> = ({
//   data,
//   onSwipeRight,
//   onSwipeLeft,
// }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [nextIndex, setNextIndex] = useState(currentIndex + 1);
//   const [expanded, setExpanded] = useState(false);


//   const currentProfile = data[currentIndex];
//   const nextProfile = data[nextIndex];

//   const { addToCart } = useCartStore(); // ✅ Zustand Cart Store

//   const { width: screenWidth, height: screenHeight } = useWindowDimensions();
//   const hiddenTranslateX = 2 * screenWidth;
//   const hiddenTranslateY = -screenHeight / 2; // ✅ Define off-screen translation for swipe up

//   const translateX = useSharedValue(0);
//   const translateY = useSharedValue(0);

//   const rotate = useDerivedValue(
//     () =>
//       interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
//       "deg"
//   );

//   const cardStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateX: translateX.value },
//       { translateY: translateY.value },
//       { rotate: rotate.value },
//     ],
//   }));
  
//   const nextCardStyle = useAnimatedStyle(() => ({
//     transform: [
//       {
//         scale: interpolate(
//           translateX.value,
//           [-hiddenTranslateX, 0, hiddenTranslateX],
//           [1, 0.8, 1]
//         ),
//       },
//     ],
//     opacity: interpolate(
//       translateX.value,
//       [-hiddenTranslateX, 0, hiddenTranslateX],
//       [1, 0.5, 1]
//     ),
//   }));

//   const likeStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(translateX.value, [0, hiddenTranslateX / 5], [0, 1]),
//   }));

//   const nopeStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(translateX.value, [0, -hiddenTranslateX / 5], [0, 1]),
//   }));

//   const cartStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(translateY.value, [0, hiddenTranslateY / 5], [0, 1]),
//   }));

//   const panGesture = Gesture.Pan()
//   .enabled(!expanded) // ✅ Allow only when not expanded
//   .minDistance(10) // ✅ Prevent accidental triggers
//   .onUpdate((event) => {
//     translateX.value = event.translationX;
//     translateY.value = event.translationY;
//   })
//   .onEnd((event) => {
//     if (expanded) return; // ✅ Prevent swipe gestures when expanded

//     if (Math.abs(event.velocityX) < SWIPE_VELOCITY && Math.abs(event.velocityY) < SWIPE_UP_VELOCITY) {
//       translateX.value = withSpring(0);
//       translateY.value = withSpring(0);
//       return;
//     }

//     if (event.velocityY < -SWIPE_UP_VELOCITY) {
//       // ✅ SWIPE UP to Add to Cart
//       translateY.value = withSpring(hiddenTranslateY, {}, () => {
//         runOnJS(addToCart)(currentProfile);
//         runOnJS(setCurrentIndex)(currentIndex + 1);
//       });
//       return;
//     }

//     translateX.value = withSpring(
//       hiddenTranslateX * Math.sign(event.velocityX),
//       {},
//       () => runOnJS(setCurrentIndex)(currentIndex + 1)
//     );

//     const onSwipe = event.velocityX > 0 ? onSwipeRight : onSwipeLeft;
//     onSwipe && runOnJS(onSwipe)(currentProfile);
//   });

// const tapGesture = Gesture.Tap()
//   .onEnd(() => {
//     if (!expanded) {
//       runOnJS(setExpanded)(true); // ✅ Expands when tapped
//     }
//   });

// const swipeDownGesture = Gesture.Pan()
//   .enabled(expanded) // ✅ Enable only when expanded
//   .onUpdate((event) => {
//     if (expanded && event.translationY > 200) {
//       runOnJS(setExpanded)(false); // ✅ Collapses when swiped down
//     }
//   });

  
//   const SCROLL_TOLERANCE = 50; // ✅ Allow some buffer before collapsing

//   const handleScroll = (event) => {
//     const scrollY = event.nativeEvent.contentOffset.y;
//     if (scrollY <= -SCROLL_TOLERANCE) {
//       runOnJS(setExpanded)(false);
//     }
//   };

//   return (
//     <GestureHandlerRootView style={styles.root}>
//       {expanded ? (
//         // ✅ Expanded View with Scrollable Content
//         <GestureDetector gesture={swipeDownGesture}>
//           <Animated.View style={[styles.expandedCard, cardStyle]}>
//             <ScrollView
//               style={styles.scrollContainer}
//               contentContainerStyle={styles.scrollContent}
//               showsVerticalScrollIndicator={false}
//               nestedScrollEnabled={true} // ✅ Allow smooth nested scrolling
//               onScroll={handleScroll} // ✅ Detect scroll movement
//               scrollEventThrottle={16} // ✅ Optimize scroll event performance
//             >
//               <CuratedPicksCard item={currentProfile} expanded={expanded} />
//               <View style={styles.details}>
//                 <Text style={styles.title}>{currentProfile.title}</Text>
//                 <Text style={styles.price}>{currentProfile.price}</Text>
//                 <Text style={styles.description}>
//                   Black solid bodycon dress, round neck, short regular sleeves,
//                   knee-length, straight hem, knitted fabric.
//                 </Text>
//               </View>
//             </ScrollView>
//           </Animated.View>
//         </GestureDetector>
//       ) : (
//         <>
//           {/* ✅ Show Next Card in Stack */}
//           {nextProfile && (
//             <View style={styles.nextCardContainer}>
//               <Animated.View style={[styles.animatedCard, nextCardStyle]}>
//                 <CuratedPicksCard item={nextProfile} />
//               </Animated.View>
//             </View>
//           )}
  
//           {/* ✅ Wrap Both Tap & Pan Gestures */}
//           {currentProfile && (
//             <GestureDetector gesture={Gesture.Simultaneous(tapGesture, panGesture)}>
//               <Animated.View style={[styles.animatedCard, cardStyle]}>
//                 <Animated.Image
//                   source={Like}
//                   style={[styles.like, { left: 10 }, likeStyle]}
//                   resizeMode="contain"
//                 />
//                 <Animated.Image
//                   source={Nope}
//                   style={[styles.nope, { right: 10 }, nopeStyle]}
//                   resizeMode="contain"
//                 />
//                 <Animated.Image
//                   source={Cart}
//                   style={[styles.cart, cartStyle]}
//                   resizeMode="contain"
//                 />
//                 <CuratedPicksCard item={currentProfile} />
//               </Animated.View>
//             </GestureDetector>
//           )}
//         </>
//       )}
//     </GestureHandlerRootView>
//   );  
// }

// const styles = StyleSheet.create({
//   root: {
//     justifyContent: "center",
//     alignItems: "center",
//     flex: 1,
//     width: "100%",
//   },
//   animatedCard: {
//     width: "90%",
//     height: "70%",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   expandedCard: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "#FFF",
//     zIndex: 10, // Ensures it's above other elements
//     flex: 1,
//   },
//   scrollContainer: {
//     flex: 1,
//     width: "100%",
//   },
//   scrollContent: {
//     paddingBottom: 40, // Ensures proper scrolling
//     alignItems: "center",
//   },
//   nextCardContainer: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   like: {
//     width: 100,
//     height: 100,
//     position: "absolute",
//     top: 20,
//     left: 10,
//     zIndex: 1,
//     opacity: 0,
//   },
//   nope: {
//     width: 100,
//     height: 100,
//     position: "absolute",
//     top: 20,
//     right: 10,
//     zIndex: 1,
//     opacity: 0,
//   },
//   cart: {
//     width: 100,
//     height: 100,
//     position: "absolute",
//     bottom: 20,
//     zIndex: 1,
//     opacity: 0, 
//   },
//   details: {
//     padding: 16,
//     width: "100%",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#843CA7",
//     textAlign: "center",
//     marginVertical: 10,
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     textAlign: "center",
//   },
//   description: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 10,
//     textAlign: "center",
//   },
// });


// export default CuratedPicksStack;