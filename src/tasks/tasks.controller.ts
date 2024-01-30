import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { title } from 'process';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
  getTasks(@Query() filterDto:GetTaskFilterDto): Task[] {
    if(Object.keys(filterDto).length){
      return this.tasksService.getTaskWithFilter(filterDto)
    } else {
      return this.tasksService.getAllTasks()
    }
    
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id)
  }

  @Delete('/:id')
  delTaskById(@Param('id') id: string): void {
    return this.tasksService.delTaskById(id)
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto)
  }

  @Patch('/:id/status')
  updateTask(@Param('id') id:string, @Body('status') status:TaskStatus): Task{
    return this.tasksService.updateTask(id, status)
  }
}
