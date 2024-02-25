import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {  TaskStatus } from './task.model';
import { title } from 'process';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/user.entity';
import { ConfigService } from '@nestjs/config';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger()
  constructor(private tasksService: TasksService,
              private configService:ConfigService
    ) {
      console.log(configService.get('TEST_VALUE'))
    }

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto, 
          @GetUser() user:User): Promise<Task[]> {
            this.logger.verbose(`User ${user.username} retrieving all tasks`)
    return this.tasksService.getAllTask(filterDto,user)
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string,
  @GetUser() user:User): Promise<Task> {
    return this.tasksService.getTaskById(id,user);
  }

  @Delete('/:id')
  delTaskById(@Param('id') id: string,
              @GetUser() user:User): Promise<void> {
    return this.tasksService.delTaskById(id,user);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto,
             @GetUser() user:User): Promise<Task> {
    this.logger.verbose(`${user.username} creating a new task with ${JSON.stringify(createTaskDto)}`)
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskStatusDto,
    @GetUser() user:User
  ): Promise<Task> {
    const { status } = updateTaskDto;
    return this.tasksService.updateTask(id, status,user);
  }
}
