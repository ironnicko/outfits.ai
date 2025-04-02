import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useOnboardingStore } from "../../store/useOnBoardingStore";
import ProgressIndicator from "../../components/Onboarding/progressIndicator";
import OnboardingQuestion from "../../components/Onboarding/questionComp";
import NextButton from "../../components/Onboarding/nextButton";
import SelfieAnalysisScreen from "../ColorTheory/selfieScreen";
import SafeScreen from "../../components/SafeScreen";
import { useAuthStore } from "../../store/authStore";

export const onboardingQuestions = [
  {
    id: "gender",
    text: "What's your gender?",
    type: "single-select",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Non Binary / Gender Fluid", value: "non_binary" },
      { label: "Prefer not to say", value: "prefer_not_say" },
    ],
  },
  {
    id: "dob",
    text: "What's your DOB?",
    type: "date",
  },
  {
    id: "style",
    text: "How would you describe your personal style?",
    type: "multi-select",
    options: [
      { label: "Casual", value: "casual" },
      { label: "Streetwear", value: "streetwear" },
      { label: "Formal", value: "formal" },
      { label: "Ethnic / Traditional", value: "ethnic_traditional" },
      { label: "Minimalist", value: "minimalist" },
      { label: "Bold & Experimental", value: "bold_experimental" },
      { label: "Sporty / Athleisure", value: "sporty_athleisure" },
      { label: "Luxury / Designer", value: "luxury_designer" },
    ],
  },
  {
    id: "colors",
    text: "Which colors do you love to wear?",
    type: "multi-select",
    options: [
      { label: "Black", value: "black" },
      { label: "White", value: "white" },
      { label: "Blue", value: "blue" },
      { label: "Red", value: "red" },
      { label: "Green", value: "green" },
      { label: "Beige / Neutrals", value: "beige_neutrals" },
      { label: "Pastels", value: "pastels" },
      { label: "Bold & Bright Shades", value: "bold_bright" },
      { label: "Monochrome", value: "monochrome" },
    ],
  },
  {
    id: "dressing_challenges",
    text: "On what occasions do you have difficulty getting dressed?",
    type: "multi-select",
    options: [
      { label: "For work", value: "work" },
      { label: "For social events & parties", value: "social_events" },
      { label: "For casual everyday wear", value: "casual_wear" },
      { label: "For weather changes", value: "weather_changes" },
      { label: "For fitness & travel", value: "fitness_travel" },
    ],
  },
  {
    id: "body_shape",
    text: "Which body type best characterizes your shape?",
    type: "single-select",
    options: [
      { label: "Hourglass", value: "hourglass", image: require("../../assets/Hourglass.jpeg") },
      { label: "Triangle", value: "triangle", image: require("../../assets/triangle.jpeg") },
      { label: "Inverted Triangle", value: "inverted_triangle", image: require("../../assets/inverted_triangle.jpeg") },
      { label: "Rectangle", value: "rectangle", image: require("../../assets/Rectangle.jpeg") },
    ],
  },
  {
    id: "photos",
    text: "Add 3 full-body single photos",
    type: "photo-upload",
    minRequired: 3,
  },
];

const OnboardingScreen = () => {
  const { step, setTotalSteps } = useOnboardingStore();

  useEffect(() => {
    setTotalSteps(onboardingQuestions.length + 1);
  }, [setTotalSteps]);

  const currentQuestion = onboardingQuestions[step];

  const isFinalStep = step === onboardingQuestions.length;

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <ProgressIndicator
            totalSteps={onboardingQuestions.length + 1}
            currentStep={step}
          />

          {!isFinalStep && (
            <OnboardingQuestion question={currentQuestion} />
          )}
        </View>

        {isFinalStep ? (
          <View style={styles.fullFlex}>
            <SelfieAnalysisScreen />
          </View>
        ) : (
          <View style={styles.bottomContainer}>
            <NextButton />
          </View>
        )}
      </View>
    </SafeScreen>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    justifyContent: "space-between",
  },
  topContainer: {
    padding: 20,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  fullFlex: {
    flex: 1,
    padding: 20,
  },
});