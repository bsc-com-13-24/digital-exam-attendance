import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual, MoreThan, In } from "typeorm";
import { Session } from './entities/sessions.entity';

@Injectable()
export class SessionSchedulerService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async updateSessionStatuses() {
        const now = new Date();

        await this.sessionRepository.update(
            {
                status: In(['upcoming', 'active']),
                scheduled_end: LessThanOrEqual(now),
            },
            { status: 'expired' },
        );

        await this.sessionRepository.update(
            {
                status: 'upcoming',
                scheduled_start: LessThanOrEqual(now),
                scheduled_end: MoreThan(now),
            },
            { status: 'active' },
        );
    }
}