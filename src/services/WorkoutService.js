import prisma from "../../prisma/prisma.js";

class WorkoutService {
  async createWorkout(userId, workoutData) {
    const { name, date, exercises } = workoutData;
    if (!exercises || exercises.length === 0) {
      throw new Error("A workout must have at least one exercise");
    }

    return prisma.$transaction(async (tx) => {
      const workout = await tx.workouts.create({
        data: {
          user_id: userId,
          name,
          date: date ? new Date(date) : new Date(),
        },
      });

      for (const ex of exercises) {
        await tx.exercises.create({
          data: {
            workout_id: workout.id,
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight || null,
            completed: false,
          },
        });
      }

      return tx.workouts.findUnique({
        where: { id: workout.id },
        include: { exercises: true },
      });
    });
  }

  async getWorkoutsByUserId(userId) {
    return prisma.workouts.findMany({
      where: { user_id: userId },
      include: { exercises: true },
      orderBy: { date: "desc" },
    });
  }

  async getWorkoutById(workoutId) {
    return prisma.workouts.findUnique({
      where: { id: workoutId },
      include: {
        exercises: true,
        personal_bests: true,
        progress_photos: true,
      },
    });
  }

  async updateWorkout(workoutId, updateData) {
    return prisma.workouts.update({
      where: { id: workoutId },
      data: { ...updateData, updated_at: new Date() },
      include: { exercises: true },
    });
  }

  async deleteWorkout(workoutId) {
    return prisma.workouts.delete({
      where: { id: workoutId },
    });
  }

  async addExercise(workoutId, exerciseData) {
    const { name, sets, reps, weight } = exerciseData;
    return prisma.exercises.create({
      data: {
        workout_id: workoutId,
        name,
        sets,
        reps,
        weight: weight || null,
        completed: false,
      },
    });
  }

  async updateExercise(exerciseId, updateData) {
    return prisma.exercises.update({
      where: { id: exerciseId },
      data: { ...updateData, updated_at: new Date() },
    });
  }

  async deleteExercise(exerciseId) {
    return prisma.exercises.delete({
      where: { id: exerciseId },
    });
  }

  async completeExercise(exerciseId, completed = true) {
    return prisma.exercises.update({
      where: { id: exerciseId },
      data: { completed, updated_at: new Date() },
    });
  }

  //   async getWorkoutStats(userId) {
  //     const totalWorkouts = await prisma.workouts.count({
  //       where: { user_id: userId },
  //     });

  //     const thisWeek = await prisma.workouts.count({
  //       where: {
  //         user_id: userId,
  //         date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  //       },
  //     });

  //     return { totalWorkouts, thisWeek };
  //   }
}
export default WorkoutService;
