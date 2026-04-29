import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // public register
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }

  // public login
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // get user profile
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getUserById(req.user.userId);
  }

  // get user by id
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  // update user info
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto, @Request() req) {
    // self-update check
    if (req.user.userId !== id) {
      throw new Error('Unauthorized: Users can only update their own profile');
    }
    return this.authService.updateUser(id, dto);
  }

  // delete user
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  deleteUser(@Param('id') id: string, @Request() req) {
    return this.authService.deleteProfile(id);
  }
}
