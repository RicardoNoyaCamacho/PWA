import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaisInterface } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private paises: PaisInterface[] = [];

  constructor(private http: HttpClient) {}

  getPaises(): Promise<PaisInterface[]> {
    if (this.paises.length > 0) {
      return Promise.resolve(this.paises);
    }

    return new Promise((resolve) => {
      this.http
        .get('https://restcountries.com/v2/lang/es')
        .subscribe((paises: any) => {
          console.log(paises);
          this.paises = paises;
          resolve(paises);
        });
    });
  }

  getPaisById(id: string) {
    if (this.paises.length > 0) {
      //Hay paises en el arreglo
      const pais = this.paises.find((p) => p.alpha3Code === id);
      return Promise.resolve(pais);
    }

    return this.getPaises().then((paises) => {
      const pais = this.paises.find((p) => p.alpha3Code === id);
      return Promise.resolve(pais);
    });
  }
}
