import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository, EntityRepository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './task.model';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { User } from 'src/auth/user.entity';


@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskEntityRepository: Repository<Task>,
  ) {}

  async findById(id: string, user:User): Promise<Task> {
    const found = await this.taskEntityRepository.findOneBy({ id, user });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async insert(createTaskDto: CreateTaskDto, user:User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = await this.taskEntityRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.taskEntityRepository.save(task);
    return task;
  }

  async remove(id: string,user: User): Promise<void> {
    const task = await this.taskEntityRepository.delete({ id, user });
    console.log('task',task)
    if (task.affected === 0) {
      throw new NotFoundException('No Task Found');
    }
    // return this.taskEntityRepository.remove(task)
  }

  async updateTask(id:string, status:TaskStatus, user:User): Promise<Task> {
    const task = await this.taskEntityRepository.findOne({ where: { id, user } });
    task.status = status
    return await this.taskEntityRepository.save(task)
  }

  async getAllTask(filterDto:GetTaskFilterDto, user:User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.taskEntityRepository.createQueryBuilder('task');
    query.where({user})

    if(status){
        query.andWhere('task.status = :status', {status})
    }

    if(search){
        query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`})
    }

    const task = await query.getMany()
    return task
  }
}
