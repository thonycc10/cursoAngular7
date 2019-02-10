import {Component, Input, OnInit} from '@angular/core';
import index from '@angular/cli/lib/cli';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent implements OnInit {
 @Input() paginador: any;
 paginas: number[];
  constructor() { }

  ngOnInit() {
    this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, i) => i + 1);
  }

}
