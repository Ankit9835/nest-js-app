import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { stat } from 'fs';

@Injectable()
export class TasksService {
    private tasks: Task[] = []

    getAllTasks(): Task[]{
        return this.tasks
    }

    getTaskWithFilter(filterDto:GetTaskFilterDto): Task[] {
        const {status,search} = filterDto

        let tasks = this.getAllTasks()

        if(status){
            tasks.filter((task) => task.status === status)
        }

        if(search){
            tasks = tasks.filter((task) => {
                if(task.title.includes(search) || task.description.includes(search)){
                    return true
                }
                return false
            })
        }

        return tasks
    }

    createTask(createTaskDto: CreateTaskDto): Task {

        const {title,description} = createTaskDto

        const task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(task)
        return task
    }

    getTaskById(id: string): Task {
        return this.tasks.find((task) => task.id === id)
    }

    delTaskById(id: string): void {
        this.tasks = this.tasks.filter((task) => task.id !== id)
    }

    updateTask(id: string, status: TaskStatus){
        const task = this.getTaskById(id)
        task.status = status
        return task
    }
}
