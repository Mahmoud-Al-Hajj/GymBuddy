import prisma from "../../prisma/prisma.js";
import AuthService from "./AuthService.js";

class UserService {
  async getUserById(userId) {
    return await prisma.users.findUnique({
      where: { id: userId },
    });
  }

  async updateUser(id, updateData) {
    return prisma.users.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
  }

  async deleteUser(id) {
    return prisma.users.delete({
      where: { id: parseInt(id) },
    });
  }
}

export default UserService;
