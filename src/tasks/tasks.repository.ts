import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task-dto";
import { TaskStatus } from "./task.model";

@Injectable()
export class TaskRepository {
    constructor(@InjectRepository(Task)
        private readonly taskEntityRepository: Repository<Task>
    ) {}

    async findById(id: string): Promise<Task> {
        const found = await this.taskEntityRepository.findOneBy({ id });
        if (!found) {
          throw new NotFoundException(`Task with ID "${id}" not found`);
        }
     
        return found;
    }

    async insert(createTaskDto: CreateTaskDto): Promise<Task> {
        const {title, description} = createTaskDto
        const task = await this.taskEntityRepository.create({
            title,
            description,
            status: TaskStatus.OPEN
        })

        await this.taskEntityRepository.save(task)
        return task
    }
}