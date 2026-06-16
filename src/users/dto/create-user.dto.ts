import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { UserRoles } from "../enums/user-roles.enum";

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(UserRoles)
    role?: UserRoles;

}
