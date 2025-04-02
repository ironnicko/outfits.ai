import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
import { launchImageLibrary } from "react-native-image-picker";
import { useOnboardingStore } from "../../store/useOnBoardingStore";
import dayjs from "dayjs";

const OnboardingQuestion = ({ question }) => {
  const { setAnswer, answers } = useOnboardingStore();
  const selectedAnswer =
    answers[question.id] || (question.type === "multi-select" ? [] : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<DateType>();
  const [photos, setPhotos] = useState(answers[question.id] || []);

  const handleDateChange = (date) => {
    if (date) {
      setSelected(date);
      setAnswer(question.id, dayjs(date).format("YYYY-MM-DD"));
    }
    setShowDatePicker(false);
  };

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

  const pickImage = async () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      maxWidth: 1024,
      maxHeight: 1024,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorCode) return;

      if (response.assets) {
        const newPhotos = [...photos, ...response.assets.map((a) => a.uri)];
        setPhotos(newPhotos);
        setAnswer(question.id, newPhotos);
      }
    });
  };

  const handleLongPressDelete = (index) => {
    Alert.alert(
      "Remove Photo",
      "Do you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const newPhotos = [...photos];
            newPhotos.splice(index, 1);
            setPhotos(newPhotos);
            setAnswer(question.id, newPhotos);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderPhotoGrid = () => {
    const photoData = [...photos, ...(photos.length < 3 ? ["add"] : [])];

    return (
      <FlatList
        data={photoData}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =>
          item === "add" ? (
            <TouchableOpacity style={styles.photoBoxAdd} onPress={pickImage}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onLongPress={() => handleLongPressDelete(index)}
              delayLongPress={500}
              style={styles.photoWrapper}
            >
              <Image source={{ uri: item }} style={styles.photoBox} />
            </TouchableOpacity>
          )
        }
        contentContainerStyle={{ paddingHorizontal: 10, marginTop: 10 }}
      />
    );
  };

  return (
    <View style={{ marginVertical: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        {question.text}
      </Text>

      {question.type === "date" ? (
        <>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ fontSize: 16, color: selected ? "#000" : "#aaa" }}>
              {selected ? dayjs(selected).format("YYYY-MM-DD") : "Select Date"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <Modal transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Date</Text>
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
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.modalDone}
                  >
                    <Text style={styles.doneText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </>
      ) : question.type === "photo-upload" ? (
        renderPhotoGrid()
      ) : question.id === "body_shape" ? (
        <FlatList
          data={question.options || []}
          numColumns={2}
          keyExtractor={(item) => item.value}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.bodyBox,
                selectedAnswer === item.value && styles.bodyBoxSelected,
              ]}
              onPress={() => handleSelect(item.value)}
            >
              <Image source={item.image} style={styles.bodyImage} />
              <Text style={styles.bodyLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        question.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionBox,
              selectedAnswer === option.value ||
              (Array.isArray(selectedAnswer) &&
                selectedAnswer.includes(option.value))
                ? styles.optionSelected
                : {},
            ]}
            onPress={() => handleSelect(option.value)}
          >
            <Text style={{ fontSize: 16 }}>{option.label}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateSelector: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDone: {
    marginTop: 15,
    alignItems: "center",
    padding: 10,
  },
  doneText: {
    fontSize: 16,
    color: "#843CA7",
    fontWeight: "bold",
  },
  photoWrapper: {
    margin: 8,
  },
  photoBox: {
    width: 140,
    height: 200,
    borderRadius: 12,
  },
  photoBoxAdd: {
    width: 140,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#D9D9D9",
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 40,
    color: "#333",
  },
  bodyBox: {
    alignItems: "center",
    padding: 10,
    margin: 15,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    width: 150,
    height: 200,
  },
  bodyBoxSelected: {
    borderColor: "#843CA7",
    backgroundColor: "#EDE3F2",
  },
  bodyImage: {
    width: 110,
    height: 140,
    marginBottom: 10,
  },
  bodyLabel: {
    fontSize: 16,
    textAlign: "center",
  },
  optionBox: {
    alignItems: "center",
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    width: 150,
  },
  optionSelected: {
    borderColor: "#843CA7",
    backgroundColor: "#EDE3F2",
  },
});

export default OnboardingQuestion;
