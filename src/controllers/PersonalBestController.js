import PersonalBestService from "../services/PersonalBestService.js";

class PersonalBestController {
  constructor() {
    this.personalBestService = new PersonalBestService();
  }

  async addPersonalBest(req, res) {
    try {
      const userId = req.user.id;
      const { workoutId, exerciseName, weight, reps } = req.body;
      const personalBest = await this.personalBestService.addPersonalBest(
        userId,
        workoutId,
        exerciseName,
        weight,
        reps
      );
      if (personalBest) {
        res.status(201).json(personalBest);
      } else {
        res.status(200).json({ message: "Not a new personal best" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPersonalBests(req, res) {
    try {
      const userId = req.user.id;
      const personalBests = await this.personalBestService.getPersonalBests(
        userId
      );
      res.status(200).json(personalBests);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPersonalBestByExercise(req, res) {
    try {
      const userId = req.user.id;
      const { exerciseName } = req.params;
      const personalBest =
        await this.personalBestService.getPersonalBestByExercise(
          userId,
          exerciseName
        );
      if (personalBest) {
        res.status(200).json(personalBest);
      } else {
        res.status(404).json({ message: "No personal best found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletePersonalBest(req, res) {
    try {
      const { id } = req.params;
      await this.personalBestService.deletePersonalBest(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default PersonalBestController;
