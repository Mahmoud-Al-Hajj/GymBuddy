import { useCallback, useState } from "react";
import { personalBestAPI } from "../utils/api";

export const usePersonalBests = () => {
  const [personalBests, setPersonalBests] = useState([]);

  const loadPersonalBests = useCallback(async () => {
    try {
      const res = await personalBestAPI.getPersonalBests();
      if (res.ok) {
        setPersonalBests(Array.isArray(res.data) ? res.data : []);
      } else {
        setPersonalBests([]);
      }
    } catch (error) {
      console.error("Error loading personal bests:", error);
      setPersonalBests([]);
    }
  }, []);

  const addPersonalBest = async (pbData) => {
    await personalBestAPI.addPersonalBest(pbData);
    await loadPersonalBests();
  };

  return { personalBests, loadPersonalBests, addPersonalBest };
};
