import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import AbortController from 'abort-controller';

@Injectable()
export class TaskService {
  private tasks = new Map<string, AbortController>();

  startTask(): string {
    const id = uuidv4();
    const controller = new AbortController();
    this.tasks.set(id, controller);
    this.simulateAsyncTask(id, controller.signal);
    return id;
  }

  abortTask(id: string): boolean {
    const controller = this.tasks.get(id);
    if (controller) {
      controller.abort();
      this.tasks.delete(id);
      return true;
    }
    return false;
  }

  private async simulateAsyncTask(id: string, signal: AbortController['signal']) {
    console.log(`Task ${id} started`);
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => resolve(`Task ${id} completed`), 50000);
        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error(`Task ${id} aborted`));
        });
      });
      console.log(`Task ${id} completed`);
    } catch (error) {
      console.error(error.message);
    }
  }
}
