import React from "react";
import { View } from "react-native";
import { useOnboardingStore } from "../../store/useOnBoardingStore";

const ProgressIndicator = () => {
  const { step, totalSteps } = useOnboardingStore();
  
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 16 }}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 25,
            height: 5,
            marginHorizontal: 5,
            backgroundColor: index <= step ? "#843CA7" : "#ccc",
            borderRadius: 5,
          }}
        />
      ))}
    </View>
  );
};

export default ProgressIndicator;
