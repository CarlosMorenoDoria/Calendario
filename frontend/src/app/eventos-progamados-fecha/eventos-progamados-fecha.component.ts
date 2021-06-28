import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent} from '../app.component';
import { Calendar } from '../services/calendar.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from "@angular/material/table";
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import * as moment from 'moment';

export interface PeriodicElement {
  Nombre: string;
  Hora_inicio: number;
  Lugar: number;
  Fecha: string;
  Hora_fin:any;
  Descripcion: string;
  id:number;
  color:string;
}
let ELEMENT_DATA: any = [];

@Component({
  selector: 'app-eventos-progamados-fecha',
  templateUrl: './eventos-progamados-fecha.component.html',
  styleUrls: ['./eventos-progamados-fecha.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EventosProgamadosFechaComponent implements OnInit {
  btnColour: string= 'green';
  expandedElement: any;
  fecha:any;
  colores:string[] = [];
  lugares: string[] = [];
  nombre:string='';
  descripcion:string='';
  hInicio:any;
  hFinal:any;
  lugar:string='';
  color:string='';
  loader: boolean=false;
  dataSource = new MatTableDataSource<typeof ELEMENT_DATA>([]);
  columnsToDisplay = ['Nombre', 'Lugar', 'Fecha', 'Hora_inicio','Hora_fin'];
  nombreFormControl = new FormControl('', [
    Validators.required
  ]);
  lugarFormControl = new FormControl('', [
    Validators.required
  ]);
  fechaFormControl = new FormControl('', [
    Validators.required
  ]);
  colorFormControl= new FormControl('');
  descripcionFormControl = new FormControl('',[
    Validators.maxLength(200)
  ])
  fechaEstatica: any;
  eventos: any;
  constructor(
    private calendarService : Calendar,
    public dialogRef: MatDialogRef<AppComponent>,
    private toastr: ToastrService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.fechaEstatica= this.data.fecha;
      this.eventos = this.data.eventos;
    }

  async ngOnInit(){
    this.setEventos();
    this.getLugares();
    this.getColores();
    console.log("Data= ",this.eventos);
    this.fecha= this.data.fecha;  
    this.fechaFormControl.setValue({
      fecha: this.fecha,
    });
  }
  setEventos() {
    console.log('aqui toy');
    ELEMENT_DATA=[];
    if(this.data.eventos.length>0){
      for(let i=0; i<this.data.eventos.length;i++){
        ELEMENT_DATA[i]=this.data.eventos[i];
      }        
    }else{
      this.toastr.info('No hay eventos asociados a esta fecha, por favor crear evento');
    }
    this.dataSource.data = ELEMENT_DATA;
  }
  async getColores() {
    await this.calendarService.getColors().then((res:any)=>{
      if(res.code ==100){
        for (let index = 0; index < res.data.length; index++) {
          this.colores.push(res.data[index].Color);        
        }
      }else{
        this.toastr.error(`${res.message}`);
      }      
    }).catch((err)=>{
      console.log("Error = ",err);
      this.toastr.error(`${err}`);
    });
  }
  async getLugares() {
    await this.calendarService.getLugares().then((res:any)=>{
      if(res.code==100){
        for (let index = 0; index < res.data.length; index++) {
          this.lugares.push(res.data[index].Lugar);        
        }
      }else{
        this.toastr.error(`${res.message}`);
      }
    }).catch((err)=>{
      console.log("Error = ",err);
      this.toastr.error(`${err}`);
    });
  }

  async crearEvento(){
    const obj={
      Nombre:this.nombre,
      Descripcion:this.descripcion|| '',
      Lugar:this.lugar,
      Color:this.color||'blue',
      Fecha:this.fecha,
      Hora_inicio:this.hInicio,
      Hora_fin:this.hFinal
    }
    this.loader= true;
    console.log("Datos a DB = ", obj);
    await this.calendarService.createEvento(obj).then(async (response)=>{
      if(response.code == 100){
        this.nombre='';
        this.lugar='';
        this.nombreFormControl.reset();
        this.descripcion='';
        this.lugarFormControl.reset();
        this.colorFormControl.reset();
        this.hInicio ='';
        this.hFinal='';
        this.loader = false;
        this.getEventos();
        console.log("FECHA =", this.fecha);
        this.toastr.success(`${response.message}`);
        
      }else{
        this.loader = false;
        this.toastr.error(`${response.message}`);
      }
    }).catch((err)=>{
      this.toastr.error(`${err}`);
    });
  }
  async getEventos() {
    this.loader=true;
    const resp = await this.calendarService.getEventos();
    if(resp.code == 100){
      this.loader = false;
      this.eventosPerDay(resp.data);
    }
  }
  eventosPerDay(Data:any){
    this.data={fecha:this.fecha, eventos:[]}
    const fecha = moment(this.fecha, 'YYYY-MM-DD');
    for (const evento of Data) {
      const eventFecha = moment(evento.Fecha, 'YYYY-MM-DD');
      if(fecha.isSame(eventFecha)){
        evento.Fecha= this.data.fecha;
        this.data.eventos.push(evento);
        this.setEventos();
      }
    }
  }
  async editEvento(element:any){
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '50%',
      height: '100vh',
      data: {elemento:element},
      panelClass: 'my-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  async deleteEvento(element:any){
    try{
      if(confirm(`¿Está seguro de querer eliminar este evento: \"${element.Nombre}\"?`)){
        this.loader=true;
        let response = await this.calendarService.deleteEvento(element.id);
        if (response['code'] === 100) {
          this.loader = false;
          ELEMENT_DATA = ELEMENT_DATA.filter(((item: any) => item !== element));
          this.dataSource.data=ELEMENT_DATA
          this.toastr.success(`${response['message']}`);
        }else{
          this.toastr.error(`${response.message}`);
        }
      }
    }catch(err){
      this.toastr.error(`${err}`);
    }
  }
  changeLugar(lugar:any){
    this.lugar=lugar.value;
  }
  changeColor(color:any){
    this.color = color.value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  
}

