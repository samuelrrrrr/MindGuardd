import { useState } from "react";

export const useMindGuard = () => {
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState("");
  const [insight, setInsight] = useState("");

  const generateInsight = () => {
    if (mood <= 3) {
      setInsight("You're feeling low. Try to rest and talk to someone.");
    } else if (mood <= 7) {
      setInsight("You're doing okay. Stay consistent and mindful.");
    } else {
      setInsight("You're in a great mood. Keep the positive energy!");
    }
  };

  return {
    mood,
    setMood,
    note,
    setNote,
    insight,
    generateInsight,
  };
};
