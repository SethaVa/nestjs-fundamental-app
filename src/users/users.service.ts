import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDTO } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(userDTO: CreateUserDTO): Promise<Partial<User>> {
    const SALT_ROUNDS = 10;
    userDTO.password = await bcrypt.hash(userDTO.password, SALT_ROUNDS);
    const user = await this.userRepository.save(userDTO);
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException("Could not find user");
    }
    return user;
  }
}
