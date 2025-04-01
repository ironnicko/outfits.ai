import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal, FlatList } from "react-native";
import DateTimePicker, { DateType, useDefaultStyles } from "react-native-ui-datepicker";
import { launchImageLibrary } from "react-native-image-picker";
import { useOnboardingStore } from "../../store/useOnBoardingStore";
import dayjs from "dayjs";

const OnboardingQuestion = ({ question }) => {
  const { setAnswer, answers } = useOnboardingStore();
  const selectedAnswer = answers[question.id] || (question.type === "multi-select" ? [] : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<DateType>();

  // For Photo Upload
  const [photos, setPhotos] = useState(answers[question.id] || []);

  // Handles Date Selection
  const handleDateChange = (date) => {
    if (date) {
      setSelected(date);
      setAnswer(question.id, dayjs(date).format("YYYY-MM-DD"));
    }
    setShowDatePicker(false);
  };

  // Handles Single & Multi-Select Answers
  const handleSelect = (option) => {
    if (question.type === "multi-select") {
      const updatedSelection = selectedAnswer.includes(option)
        ? selectedAnswer.filter((item) => item !== option)
        : [...selectedAnswer, option];

      setAnswer(question.id, updatedSelection);
    } else {
      setAnswer(question.id, option);
    }
  };

  // Handles Photo Upload
  const pickImage = async () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      maxWidth: 1024,
      maxHeight: 1024,
      selectionLimit: 3 - photos.length,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error("ImagePicker Error: ", response.errorMessage);
        return;
      }

      if (response.assets) {
        const newPhotos = [...photos, ...response.assets.map((asset) => asset.uri)];
        setPhotos(newPhotos);
        setAnswer(question.id, newPhotos);
      }
    });
  };

  return (
    <View style={{ marginVertical: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>{question.text}</Text>

      {/* Handle Different Question Types */}
      {question.type === "date" ? (
        <>
          <TouchableOpacity
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              backgroundColor: "#FFF",
              alignItems: "center",
            }}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ fontSize: 16, color: selected ? "#000" : "#aaa" }}>
              {selected ? dayjs(selected).format("YYYY-MM-DD") : "Select Date"}
            </Text>
          </TouchableOpacity>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <Modal transparent={true} animationType="slide">
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, width: 320 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Select Date</Text>

                  <DateTimePicker
                    mode="single"
                    date={selected}
                    onChange={({ date }) => handleDateChange(date)}
                    styles={{
                      ...defaultStyles,
                      selectedItem: { backgroundColor: "#843CA7" },
                      selectedText: { color: "#fff" },
                      header: { backgroundColor: "#EDE3F2" },
                      headerText: { color: "#843CA7", fontWeight: "bold" },
                      dayText: { color: "#000" },
                      todayText: { color: "#843CA7", fontWeight: "bold" },
                    }}
                  />

                  <TouchableOpacity onPress={() => setShowDatePicker(false)} style={{ marginTop: 15, alignItems: "center", padding: 10 }}>
                    <Text style={{ fontSize: 16, color: "#843CA7", fontWeight: "bold" }}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </>
      ) : question.type === "photo-upload" ? (
        <>
          <FlatList
            data={photos}
            horizontal
            renderItem={({ item }) => <Image source={{ uri: item }} style={{ width: 100, height: 150, margin: 5, borderRadius: 8 }} />}
            keyExtractor={(item, index) => index.toString()}
          />

          {/* Upload Button */}
          {photos.length < 3 && (
            <TouchableOpacity
              style={{ marginTop: 10, padding: 12, backgroundColor: "#843CA7", borderRadius: 8, alignItems: "center" }}
              onPress={pickImage}
            >
              <Text style={{ color: "#FFF", fontSize: 16 }}>+ Upload Photo</Text>
            </TouchableOpacity>
          )}
        </>
      ) : question.id === "body_shape" ? (
        <FlatList
          data={question.options || []} // FIX: Prevents .map() on undefined
          numColumns={2}
          keyExtractor={(item) => item.value}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                margin: 10,
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: selectedAnswer === item.value ? "#843CA7" : "#ccc",
                backgroundColor: selectedAnswer === item.value ? "#EDE3F2" : "#FFF",
              }}
              onPress={() => handleSelect(item.value)}
            >
              <Image source={item.image} style={{ width: 100, height: 120, marginBottom: 5 }} />
              <Text style={{ fontSize: 16, textAlign: "center" }}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        // FIX: Prevents .map() on undefined
        question.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: "column",
              alignItems: "center",
              padding: 10,
              marginVertical: 5,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: selectedAnswer === option.value || (Array.isArray(selectedAnswer) && selectedAnswer.includes(option.value)) ? "#843CA7" : "#ccc",
              backgroundColor: selectedAnswer === option.value || (Array.isArray(selectedAnswer) && selectedAnswer.includes(option.value)) ? "#EDE3F2" : "#FFF",
              width: 150,
            }}
            onPress={() => handleSelect(option.value)}
          >
            <Text style={{ fontSize: 16 }}>{option.label}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

export default OnboardingQuestion;
