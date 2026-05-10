"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sessions_entity_1 = require("./entities/sessions.entity");
let SessionSchedulerService = class SessionSchedulerService {
    sessionRepository;
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async updateSessionStatuses() {
        const now = new Date();
        await this.sessionRepository.update({
            status: (0, typeorm_2.In)(['upcoming', 'active']),
            scheduled_end: (0, typeorm_2.LessThanOrEqual)(now),
        }, { status: 'expired' });
        await this.sessionRepository.update({
            status: 'upcoming',
            scheduled_start: (0, typeorm_2.LessThanOrEqual)(now),
            scheduled_end: (0, typeorm_2.MoreThan)(now),
        }, { status: 'active' });
    }
};
exports.SessionSchedulerService = SessionSchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionSchedulerService.prototype, "updateSessionStatuses", null);
exports.SessionSchedulerService = SessionSchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sessions_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SessionSchedulerService);
//# sourceMappingURL=session.scheduler.js.map