export class CreateSessionDto {
  title: string;
  course_id: string;
  venue: string;
  scheduled_start: Date;
  scheduled_end: Date;
  created_by: string;
}
