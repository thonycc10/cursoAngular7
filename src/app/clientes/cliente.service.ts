import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import swal from 'sweetalert2';
import {Router} from '@angular/router';
import {DatePipe, formatDate} from '@angular/common';

@Injectable()
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8084/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});


  constructor(private http: HttpClient,
  private router: Router) { }

  getClientes(page: number): Observable <any> {
    // return of(CLIENTES)}
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map( (response: any) => {
      // const clientes = response as Cliente[]; // esto sirve para recorrer y cambiar el formato del texto observable
       (response.content as Cliente[]).map(cliente => {
         cliente.name = cliente.name.toUpperCase();
         const datePipe = new DatePipe('es');
         // cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate'); // option 1 convertir formatDate
        // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy'); // option 1 convertir formatDate
        // cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy'); // option 2 convertir formatDate
        // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US'); // option 3 convertir formatDate
         return cliente;
       });
       return response;
      })
      );
  }

  create(cliente: Cliente): Observable <Cliente> {
      return this.http.post(this.urlEndPoint, cliente, { headers: this.httpHeaders}).pipe(
        map( (response: any) => response.cliente as Cliente), // aqui estoy convirtiendo el obj Cliente
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          swal(e.errors.mensaje, e.errors.error, 'error');
          return throwError(e);
        })
      );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<Cliente> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    return this.http.post(`${this.urlEndPoint}/upload`, formData).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
      console.error(e.error.mensaje);
      swal(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
      })
    );
  }
}
