import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useOnboardingStore } from "../../store/useOnBoardingStore";
import { onboardingQuestions } from "../../screens/Onboarding/newUserOnboarding"; // Import questions directly

const NextButton = () => {
  const { step, totalSteps, nextStep, answers } = useOnboardingStore();

  const currentQuestionId = onboardingQuestions[step]?.id;
  const currentAnswer = answers[currentQuestionId];

  // Check if the question is answered
  const isAnswered =
    currentAnswer && (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : currentAnswer !== null);

  return (
    <TouchableOpacity
      style={{
        backgroundColor: isAnswered ? "#843CA7" : "#ccc",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        opacity: isAnswered ? 1 : 0.6,
      }}
      disabled={!isAnswered} // Disable button if no answer
      onPress={isAnswered ? nextStep : null} // Only proceed if answered
    >
      <Text style={{ color: "#FFF", fontSize: 18 }}>Next</Text>
    </TouchableOpacity>
  );
};

export default NextButton;
