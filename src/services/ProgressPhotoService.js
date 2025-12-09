import prisma from "../../prisma/prisma.js";

class ProgressPhotoService {
  async addProgressPhoto(userId, workoutId, imageUrl) {
    return prisma.progress_photos.create({
      data: {
        workout_id: Number(workoutId),
        image_url: imageUrl,
      },
    });
  }

  async getProgressPhotos(userId) {
    return prisma.progress_photos.findMany({
      where: {
        workouts: {
          user_id: userId,
        },
      },
      orderBy: { date: "desc" },
    });
  }

  async deleteProgressPhoto(photoId) {
    return prisma.progress_photos.delete({
      where: { id: photoId },
    });
  }
}
export default ProgressPhotoService;
