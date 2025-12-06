import { createClient } from "@supabase/supabase-js";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { progressPhotoAPI } from "../utils/api";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const useProgressPhotos = () => {
  const [progressPhotos, setProgressPhotos] = useState([]);

  const loadProgressPhotos = useCallback(async () => {
    try {
      const res = await progressPhotoAPI.getProgressPhotos();
      if (res.ok) {
        setProgressPhotos(Array.isArray(res.data) ? res.data : []);
      } else {
        setProgressPhotos([]);
      }
    } catch (error) {
      console.error("Error loading progress photos:", error);
      setProgressPhotos([]);
    }
  }, []);

  const addProgressPhoto = useCallback(async () => {
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

      // Convert URI to blob/file
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const fileName = `${Date.now()}.jpg`;

      // Upload to Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("progress-photos")
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("progress-photos").getPublicUrl(fileName);

      // Send URL to backend
      const res = await progressPhotoAPI.addProgressPhoto({ url: publicUrl });
      if (res.ok) {
        await loadProgressPhotos();
      } else {
        console.error("Failed to save photo URL to backend");
      }
    } catch (error) {
      console.error("Error adding progress photo:", error);
    }
  }, [loadProgressPhotos]);

  return { progressPhotos, loadProgressPhotos, addProgressPhoto };
};
