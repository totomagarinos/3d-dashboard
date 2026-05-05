import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { MaterialForm } from '../material-form/material-form';

@Component({
  selector: 'app-material-list',
  imports: [CurrencyPipe, MaterialForm],
  templateUrl: './material-list.html',
  styleUrl: './material-list.css',
})
export class MaterialList {
  materialToDelete = signal<string | null>(null);
  protected readonly materialService = inject(MaterialService);

  materials = this.materialService.materials;

  isModalOpen = signal(false);
  selectedMaterial = signal<Material | null>(null);

  openModal(material: Material | null = null) {
    this.isModalOpen.set(true);
    this.selectedMaterial.set(material);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedMaterial.set(null);
  }

  openDeleteModal(id: string) {
    this.materialToDelete.set(id);
  }

  closeDeleteModal() {
    this.materialToDelete.set(null);
  }

  confirmDelete() {
    const id = this.materialToDelete();
    if (id) {
      this.materialService.deleteMaterial(id).subscribe(() => {
        this.closeDeleteModal();
      });
    }
  }
}
