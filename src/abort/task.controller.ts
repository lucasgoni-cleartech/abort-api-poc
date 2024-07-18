import { Controller, Post, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  startTask(): { id: string } {
    const id = this.taskService.startTask();
    return { id };
  }

  @Delete(':id')
  abortTask(@Param('id') id: string): { success: boolean } {
    const success = this.taskService.abortTask(id);
    return { success };
  }
}
