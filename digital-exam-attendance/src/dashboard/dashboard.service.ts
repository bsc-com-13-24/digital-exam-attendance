import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {session} from '../session/entities/sessions.entity';

@Injectable()
export class DashboardService {}
