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
var OfflineController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineController = void 0;
const common_1 = require("@nestjs/common");
const offline_service_1 = require("./offline.service");
const sync_offline_dto_1 = require("./dto/sync-offline.dto");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let OfflineController = OfflineController_1 = class OfflineController {
    offlineService;
    logger = new common_1.Logger(OfflineController_1.name);
    constructor(offlineService) {
        this.offlineService = offlineService;
    }
    async syncOfflineRecords(syncDto, req) {
        try {
            this.logger.log(`Received sync request from device: ${syncDto.deviceId} by user: ${req.user.userId}`);
            const result = await this.offlineService.syncOfflineRecords(syncDto, req.user.userId);
            this.logger.log(`Sync completed for device ${syncDto.deviceId}: ${result.successCount} success, ${result.failureCount} failures`);
            return {
                success: true,
                message: 'Offline records synced successfully',
                data: result,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Sync failed: ${errorMessage}`, error instanceof Error ? error.stack : '');
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to sync offline records');
        }
    }
};
exports.OfflineController = OfflineController;
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Post)('sync'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sync_offline_dto_1.SyncOfflineDto, Object]),
    __metadata("design:returntype", Promise)
], OfflineController.prototype, "syncOfflineRecords", null);
exports.OfflineController = OfflineController = OfflineController_1 = __decorate([
    (0, common_1.Controller)('offline'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [offline_service_1.OfflineService])
], OfflineController);
//# sourceMappingURL=offline.controller.js.map