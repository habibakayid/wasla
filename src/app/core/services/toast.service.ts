import { Injectable } from '@angular/core';

export interface Toast {
  id: number;
  type: string;
  message: string;
  actionLabel?: string;
  action?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];
  nextId = 1;

  success(message: string, actionLabel?: string, action?: () => void) {
    this.show('success', message, actionLabel, action);
  }

  error(message: string) {
    this.show('error', message);
  }

  info(message: string) {
    this.show('info', message);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  runAction(toast: Toast) {
    if (toast.action) {
      toast.action();
    }
    this.remove(toast.id);
  }

  private show(type: string, message: string, actionLabel?: string, action?: () => void) {
    const id = this.nextId;
    this.nextId = this.nextId + 1;

    this.toasts.push({
      id: id,
      type: type,
      message: message,
      actionLabel: actionLabel,
      action: action,
    });

    const time = actionLabel ? 6000 : 4000;
    setTimeout(() => {
      this.remove(id);
    }, time);
  }
}
