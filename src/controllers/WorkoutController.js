import WorkoutService from "../services/WorkoutService.js";

class WorkoutController {
  constructor() {
    this.workoutService = new WorkoutService();
  }

  async createWorkout(req, res) {
    try {
      const userId = req.user.id;
      const workoutData = req.body;
      const workout = await this.workoutService.createWorkout(
        userId,
        workoutData
      );
      res.status(201).json(workout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getWorkoutsByUserId(req, res) {
    try {
      const userId = req.user.id;
      const workouts = await this.workoutService.getWorkoutsByUserId(userId);
      res.status(200).json(workouts);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getWorkoutById(req, res) {
    try {
      const { id } = req.params;
      const workout = await this.workoutService.getWorkoutById(parseInt(id));
      res.status(200).json(workout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateWorkout(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedWorkout = await this.workoutService.updateWorkout(
        parseInt(id),
        updateData
      );
      res.status(200).json(updatedWorkout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async deleteWorkout(req, res) {
    try {
      const { id } = req.params;
      await this.workoutService.deleteWorkout(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addExercise(req, res) {
    try {
      const { workoutId } = req.params;
      const exerciseData = req.body;
      const exercise = await this.workoutService.addExercise(
        parseInt(workoutId),
        exerciseData
      );
      res.status(201).json(exercise);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateExercise(req, res) {
    try {
      const { exerciseId } = req.params;
      const updateData = req.body;
      const updatedExercise = await this.workoutService.updateExercise(
        parseInt(exerciseId),
        updateData
      );
      res.status(200).json(updatedExercise);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteExercise(req, res) {
    try {
      const { exerciseId } = req.params;
      await this.workoutService.deleteExercise(parseInt(exerciseId));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async completeExercise(req, res) {
    try {
      const { exerciseId } = req.params;
      const { completed } = req.body;
      const updatedExercise = await this.workoutService.completeExercise(
        parseInt(exerciseId),
        completed
      );
      res.status(200).json(updatedExercise);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
export default WorkoutController;
