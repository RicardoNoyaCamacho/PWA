import { Component, OnInit } from '@angular/core';
import { PaisesService } from 'src/app/services/paises.service';
import { PaisInterface } from '../../interfaces/pais.interface';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.css'],
})
export class PaisesComponent implements OnInit {
  paises: PaisInterface[] = [];

  constructor(public paisService: PaisesService) {}

  ngOnInit(): void {
    this.paisService.getPaises().then((paises) => {
      this.paises = paises;
    });
  }
}
