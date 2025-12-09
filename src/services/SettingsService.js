import prisma from "../../prisma/prisma.js";
import { DEFAULT_SETTINGS } from "../utils/defaults.js";

class SettingsService {
  async getUserSettings(userId) {
    return prisma.users.findUnique({
      where: { id: userId },
      select: {
        weight_unit: true,
        default_sets: true,
        default_reps: true,
        rest_timer: true,
      },
    });
  }

  async updateUserSettings(userId, settings) {
    return prisma.users.update({
      where: { id: userId },
      data: settings,
      select: {
        weight_unit: true,
        default_sets: true,
        default_reps: true,
        rest_timer: true,
      },
    });
  }

  async resetUserSettingsToDefault(userId) {
    const defaultSettings = DEFAULT_SETTINGS;

    return prisma.users.update({
      where: { id: userId },
      data: defaultSettings,
      select: {
        weight_unit: true,
        default_sets: true,
        default_reps: true,
        rest_timer: true,
      },
    });
  }
}

export default SettingsService;
