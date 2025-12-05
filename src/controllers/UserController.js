import { UserService } from "../services/UserService.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
  }
}
