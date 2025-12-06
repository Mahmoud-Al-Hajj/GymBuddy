export const getDailyQuote = () => {
  const quotes = [
    "The only bad workout is the one you didn't do",
    "Stronger than yesterday",
    "Your body can stand almost anything. It's your mind you have to convince",
    "Progress, not perfection hbb",
    "Sore today, strong tomorrow",
    "Make yourself proud",
    "The pain you feel today will be the strength you feel tomorrow",
    "Push yourself because no one else is going to do it for you",
    "Who will keep your family safe if you don't?",
    "Don't limit your challenges. Challenge your limits.",
  ];
  const day = new Date().getDate();
  return quotes[day % quotes.length];
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const convertWeight = (weightInKg, targetUnit) => {
  const weight = parseFloat(weightInKg);
  if (!weight || weight === 0) return 0;
  if (targetUnit === "lbs") {
    return (weight * 2.20462).toFixed(1);
  }
  return weight;
};

export const displayWeight = (weightInKg, unit) => {
  const converted = convertWeight(weightInKg, unit);
  return converted > 0 ? `${converted} ${unit}` : "";
};

export const filterWorkouts = (workouts, searchQuery) => {
  if (!searchQuery.trim()) return workouts;

  const query = searchQuery.toLowerCase();
  return workouts.filter((workout) =>
    workout.name.toLowerCase().includes(query)
  );
};
