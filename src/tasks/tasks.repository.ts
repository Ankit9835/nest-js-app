import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository, EntityRepository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './task.model';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';


@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskEntityRepository: Repository<Task>,
  ) {}

  async findById(id: string): Promise<Task> {
    const found = await this.taskEntityRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async insert(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = await this.taskEntityRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.taskEntityRepository.save(task);
    return task;
  }

  async remove(id: string): Promise<void> {
    const task = await this.taskEntityRepository.delete(id);
    console.log('task',task)
    if (task.affected === 0) {
      throw new NotFoundException('No Task Found');
    }
    // return this.taskEntityRepository.remove(task)
  }

  async updateTask(id:string, status:TaskStatus): Promise<Task> {
    const task = await this.findById(id)
    task.status = status
    return await this.taskEntityRepository.save(task)
  }

  async getAllTask(filterDto:GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.taskEntityRepository.createQueryBuilder('task');


    if(status){
        query.andWhere('task.status = :status', {status})
    }

    if(search){
        query.andWhere('task.title LIKE :search OR task.description LIKE :search', {search: `%${search}%`})
    }

    const task = await query.getMany()
    return task
  }
}
