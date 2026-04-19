import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // REGISTER 
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }

  // LOGIN 
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // GET PROFILE (protected) 
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getUserById(req.user.userId);
  }

  //GET USER BY ID (protected) 
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  // UPDATE USER (protected)
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.authService.updateUser(id, dto);
  }

  //DELETE USER (protected)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteProfile(id);
  }
}