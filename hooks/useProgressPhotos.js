// hooks/useProgressPhotos.js
import { progressPhotoAPI } from "../utils/api";

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

  return { progressPhotos, loadProgressPhotos };
};
