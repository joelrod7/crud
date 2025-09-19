import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../core/auth/token.service';
import { TaskService, TaskQuery } from '../../core/tasks/task.service';
import { Task, Paginated, TASK_STATUS_OPTIONS, TaskEstado } from '../../core/tasks/task.types';
import { UserService } from '../../core/users/user.service';
import { Persona } from '../../core/users/user.types';
import { humanizeHttpError } from '../../core/utils/http-error.util';

function isPaginated<T>(data: any): data is Paginated<T> {
  return !!data && typeof data === 'object' && Array.isArray(data.results);
}

@Component({
  standalone: true,
  selector: 'app-todo',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  // Estado
  statusOpts = TASK_STATUS_OPTIONS;
  errorMsg = signal<string | null>(null);
  loadingTasks = signal(false);
  loadingUsers = signal(false);
  savingRow = signal<number | null>(null);
  creatingTask = signal(false);
  creatingUser = signal(false);
  editingId = signal<number | null>(null);
  private statusMap = new Map(this.statusOpts.map(s => [s.value, s.label] as const));

  // Datos
  tasks = signal<Task[]>([]);
  users = signal<Persona[]>([]);

  // Paginación
  page = signal(1);
  pageSize = signal(10);
  total = signal(0);

  // Filtros (reactive)
  filterForm = this.fb.nonNullable.group({
    search: [''],
    estado: [null as number | null],
    asignado: [null as number | null],
  });

  // Form creación tarea
  taskForm = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(20)]],
    descripcion: ['', [Validators.required, Validators.maxLength(100)]],
    fecha_inicio: ['', [Validators.required]],
    fecha_fin: ['', [Validators.required]],
    estado: [0 as TaskEstado, [Validators.required]],
    // persona: [null as number | null, [Validators.required]]
  });

  // Form edición (inline)
  editForm = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(20)]],
    descripcion: ['', [Validators.required, Validators.maxLength(100)]],
    fecha_inicio: ['', [Validators.required]],
    fecha_fin: ['', [Validators.required]],
    estado: [0 as TaskEstado, []],
    asignado: [null as number | null, []]
  });

  // Form creación usuario
  userForm = this.fb.nonNullable.group({
    ident: [0, [Validators.required, Validators.min(1)]],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private token: TokenService,
    private router: Router,
    private taskSvc: TaskService,
    private userSvc: UserService
  ) {
    this.loadUsers();
    this.loadTasks();
    // Re-cargar al cambiar filtros
    this.filterForm.valueChanges.subscribe(() => { this.page.set(1); this.loadTasks(); });
  }

  private toIsoLocal(v: string) { return new Date(v).toISOString(); }

  // Cargas
  loadTasks() {
    this.loadingTasks.set(true);
    this.errorMsg.set(null);
    const query = {
      page: this.page(),
      page_size: this.pageSize(),
      search: this.filterForm.controls.search.value || undefined,
      estado: this.filterForm.controls.estado.value,
      asignado: this.filterForm.controls.asignado.value,
    };
    this.taskSvc.list(query).subscribe({
      next: (res) => {
        if (Array.isArray(res)) { this.tasks.set(res); this.total.set(res.length); }
        else { this.tasks.set(res.results); this.total.set(res.count); }
      },
      error: (err) => this.errorMsg.set(humanizeHttpError(err))
    }).add(() => this.loadingTasks.set(false));
  }

  loadUsers() {
    this.loadingUsers.set(true);
    this.errorMsg.set(null);
    this.userSvc.list().subscribe({
      next: (res) => this.users.set(res),
      error: (err) => this.errorMsg.set(humanizeHttpError(err))
    }).add(() => this.loadingUsers.set(false));
  }

  // Crear
  saveTask() {
    if (this.taskForm.invalid) { this.taskForm.markAllAsTouched(); return; }
    const { titulo, descripcion, fecha_inicio, fecha_fin, estado } = this.taskForm.getRawValue();
    const start = new Date(fecha_inicio); const end = new Date(fecha_fin);
    if (start >= end) { this.errorMsg.set('La fecha de inicio debe ser menor que la fecha fin.'); return; }

    this.creatingTask.set(true);
    this.taskSvc.create({
      titulo, descripcion,
      fecha_inicio: this.toIsoLocal(fecha_inicio),
      fecha_fin: this.toIsoLocal(fecha_fin),
      estado
    }).subscribe({
      next: () => { this.taskForm.reset({ titulo:'', descripcion:'', fecha_inicio:'', fecha_fin:'', estado:0 }); this.loadTasks(); },
      error: (err) => this.errorMsg.set(humanizeHttpError(err))
    }).add(() => this.creatingTask.set(false));
  }

  saveUser() {
    if (this.userForm.invalid) { this.userForm.markAllAsTouched(); return; }
    this.creatingUser.set(true);
    this.userSvc.create(this.userForm.getRawValue()).subscribe({
      next: () => { this.userForm.reset({ ident:0, nombre:'', apellido:'', correo:'', password:'' }); this.loadUsers(); },
      error: (err) => this.errorMsg.set(humanizeHttpError(err))
    }).add(() => this.creatingUser.set(false));
  }

  // Edición inline
  startEdit(t: Task) {
    this.editingId.set(t.id);
    const toLocalInput = (iso: string) => {
      const d = new Date(iso);
      const pad = (n: number) => n.toString().padStart(2,'0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    this.editForm.reset({
      titulo: t.titulo,
      descripcion: t.descripcion,
      fecha_inicio: toLocalInput(t.fecha_inicio),
      fecha_fin: toLocalInput(t.fecha_fin),
      estado: t.estado,
      asignado: t.asignado ?? null
    });
  }

  cancelEdit() { this.editingId.set(null); }

  saveEdit(t: Task) {
    if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
    this.savingRow.set(t.id);
    const val = this.editForm.getRawValue();
    const partial: any = {
      titulo: val.titulo,
      descripcion: val.descripcion,
      fecha_inicio: this.toIsoLocal(val.fecha_inicio),
      fecha_fin: this.toIsoLocal(val.fecha_fin),
      estado: val.estado,
      asignado: val.asignado
    };
    this.taskSvc.patch(t.id, partial).subscribe({
      next: () => { this.editingId.set(null); this.loadTasks(); },
      error: (err) => this.errorMsg.set(humanizeHttpError(err))
    }).add(() => this.savingRow.set(null));
  }

  statusLabel(v: TaskEstado | null | undefined): string {
    return v == null ? '—' : (this.statusMap.get(v) ?? '—');
  }

  // Cambio rápido de estado
  changeEstado(t: Task, newEstado: number | string) {
    const val = typeof newEstado === 'string' ? parseInt(newEstado, 10) : newEstado;
    if (!Number.isFinite(val)) return;
    this.savingRow.set(t.id);
    this.taskSvc.patch(t.id, { estado: val as TaskEstado }).subscribe({
      next: () => this.loadTasks(),
      error: (err) => this.errorMsg.set(humanizeHttpError(err))
    }).add(() => this.savingRow.set(null));
  }

  // Paginación
  goToPage(p: number) {
    if (p < 1) return;
    const last = Math.max(1, Math.ceil(this.total() / this.pageSize()));
    if (p > last) return;
    this.page.set(p);
    this.loadTasks();
  }

  setPageSize(size: string | number) {
  const n = typeof size === 'string' ? parseInt(size, 10) : size;
  if (!Number.isFinite(n as number)) return;
  this.pageSize.set(n as number);
  this.page.set(1);
  this.loadTasks();
}

  // UX
  fullName(u: Persona) { return `${u.nombre} ${u.apellido}`.trim(); }
  assignedName(id: number | null | undefined): string {
    if (id == null) return '—';
    const u = this.users().find(x => x.id === id);
    return u ? this.fullName(u) : '—';
  }
  pages(): number[] {
    const last = Math.max(1, Math.ceil(this.total() / this.pageSize()));
    const current = this.page();
    const delta = 2;
    const from = Math.max(1, current - delta);
    const to = Math.min(last, current + delta);
    return Array.from({length: to - from + 1}, (_, i) => from + i);
  }

  logout() { this.token.clear(); this.router.navigateByUrl('/auth'); }

  trackByTask = (_: number, t: Task) => t.id;
  trackByUser = (_: number, u: Persona) => u.id;
}
