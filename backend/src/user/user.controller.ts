import { Body, Controller, Get, Param, Post, Query, Req, Session } from "@nestjs/common";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { Match, MatchOneUser } from "./user.validator";

@Controller(["users", "user"])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async test(
    @Req() req: any,
  ) {
    return this.userService.findOne(req.user.id);
  }

}
