export class Session {
  title: string;
  course_id: number;
  venue: string;
  start: string;
  end: string;
  notes: string;

  constructor(
    title: string,
    course_id: number,
    venue: string,
    start: string,
    end: string,
    notes: string,
  ) {
    this.title = title;
    this.course_id = course_id;
    this.venue = venue;
    this.start = start;
    this.end = end;
    this.notes = notes;
  }
}
