import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Roles('admin', 'teacher')
  @Get('session/:sessionId')
  async getLiveSessionDashboard(
    @Param('sessionId') sessionId: string,
  ) {
    const report = await this.dashboardService.getAttendanceReport(sessionId);

    const actualAttendees = report.present + report.late;

    return {
      sessionId,
      registeredStudents: report.totalEnrolled,
      actualAttendees,
      attendanceRate: report.totalEnrolled > 0
        ? (actualAttendees / report.totalEnrolled) * 100
        : 0,
      stats: {
        present: report.present,
        absent: report.absent,
        late: report.late,
        completed: report.completed
      }
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
