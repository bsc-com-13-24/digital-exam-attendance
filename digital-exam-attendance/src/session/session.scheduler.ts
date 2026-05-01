import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual, MoreThan } from "typeorm";
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

        //from upcoming to active
        await this.sessionRepository.update(
            {
                status: 'upcoming',
                scheduled_start: LessThanOrEqual(now),
                scheduled_end: MoreThan(now),
            },
            { status: 'active' },
        );

        //from active to expired
        await this.sessionRepository.update(
            {
                status: 'active',
                scheduled_end: LessThanOrEqual(now),
            },
            { status: 'expired' },
        );
    }
}