import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // public register
  @Post('register')
  @ApiOperation({ summary: 'Register a new user and send verification email' })
  @ApiResponse({ status: 201, description: 'User registered successfully, verification email sent' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid email or user already exists' })
  register(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }

  // public login
  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT token (requires verified email)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', description: 'Bearer token for authentication' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials or email not verified' })
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }


  // get user profile
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get current user profile (requires authentication)' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return this.authService.getUserById(req.user.userId);
  }

  // get user by id
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'User retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  // update user info
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Update user information (requires authentication)' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
  deleteUser(@Param('id') id: string, @Request() req) {
    return this.authService.deleteProfile(id);
  }
}
