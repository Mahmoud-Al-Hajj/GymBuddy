import prisma from "../../prisma/prisma.js";

class PersonalBestService {
  async addPersonalBest(userId, workoutId, exerciseName, weight, reps) {
    const existingBest = await prisma.personal_bests.findFirst({
      where: {
        user_id: userId,
        exercise_name: exerciseName,
      },
      orderBy: { weight: "desc" },
    });
    // If no existing record OR new weight is higher, create new personal best
    if (!existingBest || weight > existingBest.weight) {
      return prisma.personal_bests.create({
        data: {
          user_id: userId,
          workout_id: workoutId,
          exercise_name: exerciseName,
          weight,
          reps,
        },
      });
    }

    return null;
  }

  async getPersonalBests(userId) {
    return prisma.personal_bests.findMany({
      where: { user_id: userId },
      orderBy: { date: "desc" },
    });
  }

  async getPersonalBestByExercise(userId, exerciseName) {
    return prisma.personal_bests.findFirst({
      where: {
        user_id: userId,
        exercise_name: exerciseName,
      },
      orderBy: { weight: "desc" },
    });
  }

  async deletePersonalBest(personalBestId) {
    return prisma.personal_bests.delete({
      where: { id: personalBestId },
    });
  }
}

export default PersonalBestService;
