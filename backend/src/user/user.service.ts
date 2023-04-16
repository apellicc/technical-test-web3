import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { Match } from "./user.validator";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}
  public findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  public findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  public findBy(filter: Match): Promise<User[]> {
    return this.usersRepository.findBy({ publicAddress: filter.publicAddress });
  }

  public async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  public async create(user: {publicAddress: string}): Promise<string> {
    const { identifiers }= await this.usersRepository.insert(user);
    if (identifiers?.length > 0) {
      return identifiers[0].id;
    }
  }
}
