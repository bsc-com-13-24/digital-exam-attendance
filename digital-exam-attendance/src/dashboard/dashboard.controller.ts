import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get live dashboard for an active session
   * Shows real-time attendance counts: total, present, absent, late
   * Only admin and teachers can access
   */
  @Roles('admin', 'teacher')
  @Get('session/:sessionId')
  async getLiveSessionDashboard(
    @Param('sessionId') sessionId: string,
    @Request() req,
  ) {
    return this.dashboardService.getSessionLiveDashboard(sessionId, req.user.userId);
  }

  /**
   * Get detailed attendance statistics for a session
   * Calculates percentage present, absent, late
   * Only admin and teachers can access
   */
  @Roles('admin', 'teacher')
  @Get('session/:sessionId/statistics')
  async getSessionStatistics(
    @Param('sessionId') sessionId: string,
    @Request() req,
  ) {
    return this.dashboardService.getSessionStatistics(sessionId, req.user.userId);
  }

  /**
   * Get detailed attendance report for a session
   * Includes per-student attendance records with timestamps
   * Only admin and teachers can access
   */
  @Roles('admin', 'teacher')
  @Get('session/:sessionId/report')
  async getSessionAttendanceReport(
    @Param('sessionId') sessionId: string,
    @Request() req,
  ) {
    return this.dashboardService.getSessionAttendanceReport(sessionId, req.user.userId);
  }

  /**
   * Get overall system statistics
   * Shows aggregate statistics across all sessions
   * Only admin can access
   */
  @Roles('admin')
  @Get('statistics/overall')
  async getOverallStatistics(@Request() req) {
    return this.dashboardService.getOverallStatistics(req.user.userId);
  }
}
