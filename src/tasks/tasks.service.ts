import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { stat } from 'fs';
import { TaskRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    
    constructor(private taskEntityRepository: TaskRepository) {}

    // getAllTasks(): Task[]{
    //     return this.tasks
    // }

    // getTaskWithFilter(filterDto:GetTaskFilterDto): Task[] {
    //     const {status,search} = filterDto

    //     let tasks = this.getAllTasks()

    //     if(status){
    //         tasks.filter((task) => task.status === status)
    //     }

    //     if(search){
    //         tasks = tasks.filter((task) => {
    //             if(task.title.includes(search) || task.description.includes(search)){
    //                 return true
    //             }
    //             return false
    //         })
    //     }

    //     return tasks
    // }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskEntityRepository.insert(createTaskDto,user)
        // const {title,description} = createTaskDto

        // const task = {
        //     id: uuidv4(),
        //     title,
        //     description,
        //     status: TaskStatus.OPEN
        // }

        // this.tasks.push(task)
        // return task
    }

    async getTaskById(id: string, user:User): Promise<Task> {
        const task = this.taskEntityRepository.findById(id,user)
        if(!task) {
            throw new NotFoundException(`Not found with the given ${id}`)
        }

        return task
    }

    delTaskById(id: string, user:User): Promise<void> {
        return this.taskEntityRepository.remove(id,user)
    }

    // delTaskById(id: string): void {
    //     this.tasks = this.tasks.filter((task) => task.id !== id)
    // }

    updateTask(id: string, status: TaskStatus, user:User): Promise<Task>{
        return this.taskEntityRepository.updateTask(id, status, user)
    }

    getAllTask(filterDto:GetTaskFilterDto, user: User): Promise<Task[]>{
        return this.taskEntityRepository.getAllTask(filterDto,user)
    }
}
