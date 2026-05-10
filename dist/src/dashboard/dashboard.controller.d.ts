import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getLiveSessionDashboard(sessionId: string): Promise<{
        sessionId: string;
        registeredStudents: number;
        actualAttendees: number;
        attendanceRate: number;
        stats: {
            present: number;
            absent: number;
            late: number;
            completed: number;
        };
    }>;
    getOverallStatistics(): Promise<{
        totalSessions: number;
        activeSessions: number;
        upcomingSessions: number;
        expiredSessions: number;
    }>;
}
