import { Component, Inject, OnInit } from '@angular/core';
import * as moment from 'moment'
import { Calendar } from './services/calendar.service';
import {MatDialog} from '@angular/material/dialog';
import { EventosProgamadosFechaComponent } from './eventos-progamados-fecha/eventos-progamados-fecha.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  week: any = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo"
  ];


  monthSelect: any[] =[];
  dateSelect: any;
  dateValue: any;
  eventos: any=[];
  eventosDay:any[] =[];
  locateEventDay: any[]=[];
  
  


  constructor(
    private calendarService : Calendar,
    public dialog: MatDialog,
    private toastr: ToastrService) { 
  }
  async ngOnInit() {
    this.getEventos();
    this.getDaysFromDate(3, 2021);
  }

  ubicarEventos() {
    let temp = []
    // console.log("MonthSelected= ", this.monthSelect);
    // console.log("Eventos day=",this.eventos);
    for (let index = 0; index < this.monthSelect.length; index++) {
      const day = this.monthSelect[index].value;
      temp.push(day);
      for (const evento of this.eventos) {
        const fecha =  moment(evento.Fecha, 'YYYY-MM-DD');
        const dia = fecha.format('D');
        const month = fecha.format('M')
        if(day==dia && month == '3'){
          temp.push(evento.Nombre);
          temp.push(evento.Color);
        }        
        // console.log(`Evento a ubicar el dia ${day} = `,temp)
      }
      this.locateEventDay.push(temp);
      temp=[];
      
    }
    
    console.log(`Evento a ubicar el dia  = `,this.locateEventDay);
  }

  async getEventos(){
    const res = await this.calendarService.getEventos()
      if(res.code == 100){
        this.eventos = res.data;
        this.ubicarEventos();
        // console.log("Eventos =",this.eventos);
      }
      else{
        this.toastr.error(`${res.message}`);
      }
  }

  getDaysFromDate(month:any, year:any) {

    const startDate = moment.utc(`${year}/${month}/01`)
    const endDate = startDate.clone().endOf('month')
    this.dateSelect = startDate;

    const diffDays = endDate.diff(startDate, 'days', true)
    const numberDays = Math.round(diffDays);

    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
      a = parseInt(a) + 1;
      const dayObject = moment(`${year}-${month}-${a}`);
      return {
        name: dayObject.format("dddd"),
        value: a,
        indexWeek: dayObject.isoWeekday()
      };
    });

    this.monthSelect = arrayDays;
  }

  eventosPerDay(date:any){
    const fecha = moment(date, 'YYYY-MM-DD');
    for (const evento of this.eventos) {
      const eventFecha = moment(evento.Fecha, 'YYYY-MM-DD');
      const diaF= fecha.format('D');
      const diaE= eventFecha.format('D');
      console.log("Fecha = ",diaF);
      console.log("Event Fecha =", diaE);
      if(fecha.isSame(eventFecha)){
        evento.Fecha= date;
        this.eventosDay.push(evento);
      }
    }
  }
  clickDay(day:any) {
    console.log("day= ", day);
    this.eventosDay=[];
    const monthYear = this.dateSelect.format('YYYY-MM')
    const parse = `${monthYear}-${day}`
    const objectDate = moment(parse)
    this.dateValue = objectDate;
    this.eventosPerDay(parse);
    const dialogRef = this.dialog.open(EventosProgamadosFechaComponent, {
      width: '100vw',
      height: '100vh',
      data: {fecha:parse, eventos: this.eventosDay},
      panelClass: 'my-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
      console.log('The dialog was closed');
    });


  }

}

