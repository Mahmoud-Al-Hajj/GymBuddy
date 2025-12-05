import prisma from "../../prisma/prisma.js";

class UserService {
  static async getUserById(userId) {
    return await prisma.users.findUnique({
      where: { id: userId },
    });
  }

  static async createUser(username, email, password) {
    return await prisma.users.create({
      data: {
        username: username,
        email: email,
        password: password,
      },
    });
  }

  async updateUser(id, updateData) {
    return prisma.users.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
  }

  static async deleteUser(id) {
    return prisma.users.delete({
      where: { id: parseInt(id) },
    });
  }
}

export default UserService;
