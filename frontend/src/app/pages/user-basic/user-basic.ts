import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../service/master-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-basic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-basic.html',
  styleUrl: './user-basic.css',
})
export class UserBasic implements OnInit {
  masterSrv = inject(MasterService);
  usersList: any[] = [];

  showFormModal = false;
  showDeleteModal = false;
  isEditMode = false;

  userForm: FormGroup = new FormGroup({
    _id: new FormControl(''),
    nom: new FormControl('', [Validators.required]),
    cognom1: new FormControl('', [Validators.required]),
    cognom2: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl(''),
    rol: new FormControl('usuari', [Validators.required]),
    imatge: new FormControl('')
  });

  userToDelete: any = null;
  confirmUsername = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.masterSrv.getUsers().subscribe({
      next: (res: any) => {
        this.usersList = res;
      },
      error: (err) => console.error("Error loading users:", err)
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.userForm.reset({ rol: 'usuari' });
    this.showFormModal = true;
  }

  openEditModal(user: any) {
    this.isEditMode = true;
    this.userForm.patchValue(user);
    this.userForm.get('password')?.setValue('');
    this.showFormModal = true;
  }

  closeModals() {
    this.showFormModal = false;
    this.showDeleteModal = false;
    this.userToDelete = null;
    this.confirmUsername = '';
  }

  saveUser() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    if (this.isEditMode && !userData.password) {
      delete userData.password;
    }

    if (!userData.imatge) {
      delete userData.imatge;
    }

    if (this.isEditMode) {
      this.masterSrv.updateUser(userData._id, userData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModals();
        },
        error: (err) => alert("Error al actualizar usuario: " + err.message)
      });
    } else {
      this.masterSrv.createUser(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModals();
        },
        error: (err) => alert("Error al crear usuario: " + err.message)
      });
    }
  }

  openDeleteModal(user: any) {
    this.userToDelete = user;
    this.confirmUsername = '';
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.confirmUsername !== this.userToDelete.username) return;

    this.masterSrv.deleteUser(this.userToDelete._id).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModals();
      },
      error: (err) => alert("Error al eliminar usuario: " + err.message)
    });
  }
}
