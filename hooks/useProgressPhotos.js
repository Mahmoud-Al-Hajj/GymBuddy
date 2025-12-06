import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { progressPhotoAPI } from "../utils/api";

export const useProgressPhotos = () => {
  const [progressPhotos, setProgressPhotos] = useState([]);

  const loadProgressPhotos = useCallback(async () => {
    try {
      const res = await progressPhotoAPI.getProgressPhotos();
      setProgressPhotos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading progress photos:", error);
      setProgressPhotos([]);
    }
  }, []);

  const addProgressPhoto = useCallback(
    async (workoutId) => {
      try {
        const { granted } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!granted) {
          alert("Media library permission denied");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

        if (result.canceled) return;

        const imageUri = result.assets[0].uri;

        // Convert to file for multipart upload
        const file = {
          uri: imageUri,
          name: `photo_${Date.now()}.jpg`,
          type: "image/jpeg",
        };

        // Prepare multipart/form-data
        const formData = new FormData();
        formData.append("image", file);
        formData.append("workoutId", workoutId);

        const res = await progressPhotoAPI.addProgressPhoto(formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.ok) {
          await loadProgressPhotos();
          alert("Photo added successfully!");
        } else {
          console.error("Failed to upload photo:", res);
          alert("Failed to upload photo.");
        }
      } catch (error) {
        console.error("Error adding progress photo:", error);
        alert("Error adding photo: " + error.message);
      }
    },
    [loadProgressPhotos]
  );

  return { progressPhotos, loadProgressPhotos, addProgressPhoto };
};

export default useProgressPhotos;
