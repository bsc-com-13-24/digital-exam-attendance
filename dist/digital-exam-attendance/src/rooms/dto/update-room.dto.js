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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_room_dto_1 = require("./create-room.dto");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateRoomDto extends (0, mapped_types_1.PartialType)(create_room_dto_1.CreateRoomDto) {
    room_code;
    name;
    building;
    capacity;
    is_active;
    created_by;
}
exports.UpdateRoomDto = UpdateRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B501', description: 'Updated unique code for the room' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateRoomDto.prototype, "room_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Science Lab', description: 'Updated name of the room' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateRoomDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Main Building', nullable: true, description: 'Updated building location' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoomDto.prototype, "building", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 40, description: 'Updated student capacity' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", Number)
], UpdateRoomDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Updated status of the room' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRoomDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77-c864-4600-a9c6-f39868bc1234', description: 'ID of the user performing the update' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoomDto.prototype, "created_by", void 0);
//# sourceMappingURL=update-room.dto.js.map