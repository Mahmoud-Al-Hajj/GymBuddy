import prisma from "../../prisma/prisma.js";

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
    const defaultSettings = {
      weight_unit: "kg",
      default_sets: 3,
      default_reps: 10,
      rest_timer: 60,
    };
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
