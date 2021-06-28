import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EventosProgamadosFechaComponent } from '../eventos-progamados-fecha/eventos-progamados-fecha.component';
import { Calendar } from '../services/calendar.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
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
  btnColour: string= 'green';
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
  descripcionFormControl=new FormControl('',[
    Validators.maxLength(200)
  ]);

  constructor(private calendarService : Calendar,
    public dialogRef: MatDialogRef<EventosProgamadosFechaComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log('Data =', this.data.elemento);
    this.getLugares();
    this.getColores();
    this.setValores();
  }
  setValores() {
    this.nombre=this.data.elemento.Nombre;
    this.descripcion=this.data.elemento.Descripcion;
    this.hInicio=this.data.elemento.Hora_inicio.length > 5 ? this.data.elemento.Hora_inicio.slice(0,-3): this.data.elemento.Hora_inicio;
    this.hFinal=this.data.elemento.Hora_fin.length > 5 ? this.data.elemento.Hora_fin.slice(0,-3): this.data.elemento.Hora_fin;
    this.lugar=this.data.elemento.Lugar;
    this.color=this.data.elemento.Color;
    this.fecha=this.data.elemento.Fecha;
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
    }).catch((err: any)=>{
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
    }).catch((err: any)=>{
      console.log("Error = ",err);
      this.toastr.error(`${err}`);
    });
  }
  async editEvento(){
    const aDate   = moment(this.fecha, 'YYYY-MM-DD', true);
    const aDate1   = moment(this.fecha, 'YYYY-MM-D', true);
    const isValid = aDate.isValid();
    const isValid1= aDate1.isValid();
    const fecha = moment(this.fecha, 'YYYY-MM-DD');
    const month = fecha.format('M');
    const year = fecha.format('YYYY');
    console.log("mes= ",month);
    console.log("year= ",year);
    if (month === '3' && year === '2021' && (isValid || isValid1)){
        const obj={
          id:this.data.elemento.id,
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
        const resp = await this.calendarService.editEvento(obj);
          if(resp.code == 100){
            this.toastr.success(`${resp.message}`);
            window.location.reload();
          }else{
            this.loader = false;
            this.toastr.error(`${resp.message}`);
          }
    }else{
      this.toastr.warning(`Asegúrese de que la fecha ingresada sea de Marzo del 2021 en formato año-mes-dia`);
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
