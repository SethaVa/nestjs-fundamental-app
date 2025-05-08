import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository, UpdateResult } from "typeorm";
import { CreateUserDTO } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { v4 as uuid4 } from "uuid";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(userDTO: CreateUserDTO): Promise<Partial<User>> {
    const SALT_ROUNDS = 10;
    userDTO.password = await bcrypt.hash(userDTO.password, SALT_ROUNDS);

    const user = new User();
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.email = userDTO.email;
    user.apiKey = uuid4();
    user.password = userDTO.password;
    const savedUser = await this.userRepository.save(user);
    const { password, ...sanitizedUser } = savedUser;
    return sanitizedUser;
  }
  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException("Could not find user");
    }
    return user;
  }
  async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        enable2FA: false,
        twoFASecret: "",
      },
    );
  }
  async findByApiKey(apiKey: string): Promise<User | null> {
    return this.userRepository.findOneBy({ apiKey });
  }
}
