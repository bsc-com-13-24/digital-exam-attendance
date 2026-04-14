import { Controller ,Post,Body,Param,Get} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './create-session.dto';
import { Session } from './session.entity';


@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    // CREATE SESSION
  @Post()
  create(@Body() dto: CreateSessionDto): Session {
    return this.sessionService.createSession(dto);
  }

  // GET ALL SESSIONS
  @Get()
  findAll(): Session[] {
    return this.sessionService.getAllSessions();
  }

  // GET ONE SESSION
  @Get(':id')
  findOne(@Param('id') id: string): Session | string {
    return this.sessionService.getSessionById(Number(id));
  }
    
}
