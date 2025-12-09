import WorkoutService from "../services/WorkoutService.js";

class WorkoutController {
  constructor() {
    this.workoutService = new WorkoutService();
  }

  async createWorkout(req, res, next) {
    try {
      const userId = req.user.id;
      const workoutData = req.body;
      const workout = await this.workoutService.createWorkout(
        userId,
        workoutData
      );
      res.status(201).json(workout);
    } catch (error) {
      next(error);
    }
  }

  async getWorkoutsByUserId(req, res, next) {
    try {
      const userId = req.user.id;
      const workouts = await this.workoutService.getWorkoutsByUserId(userId);
      res.status(200).json(workouts);
    } catch (error) {
      next(error);
    }
  }

  async getWorkoutById(req, res, next) {
    try {
      const { id } = req.params;
      const workout = await this.workoutService.getWorkoutById(parseInt(id));
      res.status(200).json(workout);
    } catch (error) {
      next(error);
    }
  }

  async updateWorkout(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedWorkout = await this.workoutService.updateWorkout(
        parseInt(id),
        updateData
      );
      res.status(200).json(updatedWorkout);
    } catch (error) {
      next(error);
    }
  }
  async deleteWorkout(req, res, next) {
    try {
      const { id } = req.params;
      await this.workoutService.deleteWorkout(parseInt(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async addExercise(req, res, next) {
    try {
      const { workoutId } = req.params;
      const exerciseData = req.body;
      const exercise = await this.workoutService.addExercise(
        parseInt(workoutId),
        exerciseData
      );
      res.status(201).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  async updateExercise(req, res, next) {
    try {
      const { exerciseId } = req.params;
      const updateData = req.body;
      const updatedExercise = await this.workoutService.updateExercise(
        parseInt(exerciseId),
        updateData
      );
      res.status(200).json(updatedExercise);
    } catch (error) {
      next(error);
    }
  }

  async deleteExercise(req, res, next) {
    try {
      const { exerciseId } = req.params;
      await this.workoutService.deleteExercise(parseInt(exerciseId));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async completeExercise(req, res, next) {
    try {
      const { exerciseId } = req.params;
      const { completed } = req.body;
      const updatedExercise = await this.workoutService.completeExercise(
        parseInt(exerciseId),
        completed
      );
      res.status(200).json(updatedExercise);
    } catch (error) {
      next(error);
    }
  }
}
export default WorkoutController;
