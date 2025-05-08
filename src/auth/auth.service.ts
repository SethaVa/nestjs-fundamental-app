import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { LoginDTO } from "./dto/login.dto";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { ArtistsService } from "../artists/artists.service";
import { PayloadType } from "../types/payload.type";
import * as speakeasy from "speakeasy";
import { Enable2FAType } from "../types/auth-types";
import { UpdateResult } from "typeorm";
import { User } from "../users/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistsService,
  ) {}
  async login(
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    const user = await this.userService.findOne(loginDTO);
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );
    if (passwordMatched) {
      const payload: PayloadType = { email: user.email, userId: user.id };
      const artist = await this.artistService.findArtis(user.id);
      if (artist) {
        payload.artistId = artist.id;
      }
      // If use has enabled 2FA and have the secret key then
      if (user.enable2FA && user.twoFASecret) {
        // 1. sends the validateToken request link
        // else otherwise sends the json web token in the response
        // 2.
        return {
          validate2FA: "http://localhost:3000/auth/validate-2fa",
          message:
            "Please send the one-time password/token from your Google Authenticator App",
        };
      }

      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException("Password does not match");
    }
  }
  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }
    const secret = speakeasy.generateSecret();
    console.log(secret);
    user.twoFASecret = secret.base32;
    await this.userService.updateSecretKey(user.id, user.twoFASecret);
    return { secret: user.twoFASecret };
  }
  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }
  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.userService.findById(userId);
      // extract his 2FA secret
      // verify the secret with a token by calling the speakeasy verify method
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: "base32",
      });
      // if validated then sends the json web token in the response
      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (err) {
      throw new UnauthorizedException("Error verifying token");
    }
  }
  async validateUserByApiKey(apiKey: string): Promise<User | null> {
    return this.userService.findByApiKey(apiKey);
  }
}
