import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";
import SettingsService from "../services/SettingsService.js";

class UserController {
  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const result = await this.authService.register(username, email, password);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const id = req.user.id;
      const user = await this.userService.getUserById(parseInt(id));
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.user.id; // Get from token, not params
      const updateData = req.body;
      const updatedUser = await this.userService.updateUser(id, updateData);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.user.id; // Get from token, not params
      await this.userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserSettings(req, res) {
    try {
      const userId = req.user.id;
      const settingsService = new SettingsService();
      const settings = await settingsService.getSettingsByUserId(userId);
      res.status(200).json(settings);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUserSettings(req, res) {
    try {
      const userId = req.user.id;
      const settingsService = new SettingsService();
      const updatedSettings = await settingsService.updateUserSettings(
        userId,
        req.body
      );
      res.status(200).json(updatedSettings);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async resetUserSettings(req, res) {
    try {
      const userId = req.user.id;
      const settingsService = new SettingsService();
      const resetSettings = await settingsService.resetUserSettingsToDefault(
        userId
      );
      res.status(200).json(resetSettings);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default UserController;
