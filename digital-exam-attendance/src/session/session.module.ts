import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({
  providers: [SessionService],
  controllers: [SessionController]
})
export class SessionModule {
  title: string;
  course_id: number;
  venue: string;
  schedule_start: string;
  schedule_end: string;
  notes: string;

  constructor(
    title: string,
    course_id: number,
    venue: string,
    start: string,
    end: string,
    notes: string
  ) {
    this.title = title;
    this.course_id = course_id;
    this.venue = venue;
    this.schedule_start = start;
    this.schedule_end = end;
    this.notes = notes;
  }
}

