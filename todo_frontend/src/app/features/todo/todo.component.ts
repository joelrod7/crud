import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../core/auth/token.service';
import { TaskService } from '../../core/tasks/task.service';
import { Task } from '../../core/tasks/task.types';
import { humanizeHttpError } from '../../core/utils/http-error.util';

@Component({
  standalone: true,
  selector: 'app-todo',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  // estado general
  loadingList = signal(false);
  loadingCreate = signal(false);
  errorMsg = signal<string | null>(null);

  // datos
  tasks = signal<Task[]>([]);

  // form de creación
  form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(20)]],
    descripcion: ['', [Validators.required, Validators.maxLength(100)]],
    // datetime-local -> string 'YYYY-MM-DDTHH:mm'
    fecha_inicio: ['', [Validators.required]],
    fecha_fin: ['', [Validators.required]],
    estado: [0, [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private token: TokenService,
    private router: Router,
    private taskSvc: TaskService
  ) {
    this.load();
  }

  // Carga inicial de tareas
  load() {
    this.loadingList.set(true);
    this.errorMsg.set(null);
    this.taskSvc.list().subscribe({
      next: (res) => this.tasks.set(res),
      error: (err) => this.errorMsg.set(humanizeHttpError(err))
    }).add(() => this.loadingList.set(false));
  }

  // Guardar nueva tarea
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Validación simple de fechas
    const start = new Date(this.form.controls.fecha_inicio.value);
    const end = new Date(this.form.controls.fecha_fin.value);
    if (start >= end) {
      this.errorMsg.set('La fecha de inicio debe ser menor que la fecha fin.');
      return;
    }

    const dto = {
      titulo: this.form.controls.titulo.value,
      descripcion: this.form.controls.descripcion.value,
      fecha_inicio: start.toISOString(),
      fecha_fin: end.toISOString(),
      estado: this.form.controls.estado.value
    };

    this.loadingCreate.set(true);
    this.errorMsg.set(null);

    this.taskSvc.create(dto).subscribe({
      next: (created) => {
        // Agrega al inicio y resetea formulario
        this.tasks.update(list => [created, ...list]);
        this.form.reset({ titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', estado: 0 });
      },
      error: (err) => this.errorMsg.set(humanizeHttpError(err))
    }).add(() => this.loadingCreate.set(false));
  }

  logout() {
    this.token.clear();
    this.router.navigateByUrl('/auth');
  }

  trackById = (_: number, t: Task) => t.id;
}
