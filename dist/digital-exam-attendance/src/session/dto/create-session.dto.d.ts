export declare class CreateSessionDto {
    title: string;
    course_codes: string[];
    room_code: string;
    venue: string;
    scheduled_start: string;
    scheduled_end: string;
    expected_students?: number;
}
