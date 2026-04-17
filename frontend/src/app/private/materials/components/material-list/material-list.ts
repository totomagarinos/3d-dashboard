import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MaterialService } from '../../services/material.service';

@Component({
  selector: 'app-material-list',
  imports: [CurrencyPipe],
  templateUrl: './material-list.html',
  styleUrl: './material-list.css',
})
export class MaterialList {
  protected readonly materialService = inject(MaterialService);

  materials = this.materialService.materials;
}
