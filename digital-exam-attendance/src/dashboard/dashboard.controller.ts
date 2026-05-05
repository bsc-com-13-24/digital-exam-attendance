import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Roles('admin', 'teacher')
  @Get('session/:sessionId')
  async getLiveSessionDashboard(
    @Param('sessionId') sessionId: string,
  ) {
    const [registeredStudents, actualAttendees, stats] = await Promise.all([
      this.dashboardService.countRegisteredStudents(sessionId),
      this.dashboardService.countActualAttendees(sessionId),
      this.dashboardService.getSessionAttendanceStats(sessionId)
    ]);

    return {
      sessionId,
      registeredStudents,
      actualAttendees,
      attendanceRate: registeredStudents > 0 ? (actualAttendees / registeredStudents) * 100 : 0,
      stats
    };
  }

  @Roles('admin')
  @Get('statistics/overall')
  async getOverallStatistics() {
    const [activeSessions, upcomingSessions, expiredSessions] = await Promise.all([
      this.dashboardService.getActiveSessions(),
      this.dashboardService.getUpcomingSessions(),
      this.dashboardService.getExpiredSessions()
    ]);

    return {
      totalSessions: activeSessions + upcomingSessions + expiredSessions,
      activeSessions,
      upcomingSessions,
      expiredSessions
    };
  }
}
