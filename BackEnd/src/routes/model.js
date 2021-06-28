const { compareSync } = require('bcryptjs');
const moment = require('moment');
const connection =require('../database');
const Queries = require('./queries');

class Events {      
    constructor(){}

    async getColors(){
        try {
            const colors = await connection.query(Queries.selectColor);
            if(colors.length >0){
                
            console.log("Colors =", colors)
                return{
                    code: 100,
                    data: colors,
                    message: `Consulta Exitosa`
                }
            }else{
                return{
                    code:101,
                    message:`Error al consultar Colores`
                }
            }
        } catch (error) {
            return `Error en la base de datos`;
        }
    }
    async getLugares(){
        try {
            const lugares = await connection.query(Queries.selectLugar);
            if(lugares.length >0){
                return{
                    code: 100,
                    data: lugares,
                    message: `Consulta Exitosa`
                }
            }else{
                return{
                    code:101,
                    message:`Error al consultar Lugares`
                }
            }
        } catch (error) {
            return `Error en la base de datos`;
        }
    }
    async getEvents(){
        try {
            const events = await connection.query(Queries.selectEvents);
            if(events.length >0){
                return{
                    code: 100,
                    data: events,
                    message: `Consulta Exitosa`
                }
            }
        } catch (error) {
            return `Error en la base de datos`;
        }
    
    }
    async crearEvent(obj){
        try{
            const id = undefined; // Id Solo para validacion de hora
            const Hora_inicio = obj.Hora_inicio;
            const Hora_fin = obj.Hora_fin;
            const Nombre = obj.Nombre;
            const Fecha = obj.Fecha;  
            const horaValida = await this.validarHora(Hora_inicio, Hora_fin, Fecha,id);
            const singleDayEvent = await this.fechaEvento(Nombre, Fecha);
            if(!singleDayEvent){
                return{
                    code:101,
                    message:`Evento ya existe en calendario y solo puede existir este evento un solo dia y una sola vez`
                }
            }            
            if(horaValida){
                const data ={
                    Nombre,
                    Descripcion : obj.Descripcion,
                    Lugar:obj.Lugar,
                    Color:obj.Color,
                    Fecha,
                    Hora_inicio,
                    Hora_fin
                }
                await connection.query(Queries.createEvent, [data]); 
                console.log('Aquí llegue');               
                return {
                    code: 100,
                    message: `Evento Creado con exito`
                }
            }else{
                return {
                    code: 102,
                    message : `Error al crear evento, revisar que este evento no se traslape con algún evento existente,
                    ni que la hora de fin sea anterior de la hora de inicio`
                }
            }
            
        }catch(err){
            console.log("ERROR =",err);
            return `Error en la base de datos`;
        }
    }
    async editarEvent(obj){
        try{
            console.log("obj= ",obj)
            const Hora_inicio = obj.Hora_inicio;
            const Hora_fin = obj.Hora_fin;
            const Nombre = obj.Nombre;
            const Fecha = obj.Fecha;            
            const id = obj.id;
            const horaValida = await this.validarHora(Hora_inicio, Hora_fin,Fecha,id);
            if(horaValida){
                const data ={
                    Nombre,
                    Descripcion : obj.Descripcion,
                    Lugar:obj.Lugar,
                    Color:obj.Color,
                    Fecha,
                    Hora_inicio,
                    Hora_fin
                }
                await connection.query(Queries.editEvent, [data,id]);                
                return {
                    code: 100,
                    message: `Evento editado con exito`
                }
            }else{
                return {
                    code: 102,
                    message : `Error al editar evento, revisar que este evento no se traslape con algún evento existente,
                     ni que la hora de fin sea anterior o igual a la hora de inicio`
                }
            }
            
        }catch(err){
            console.log("Error= ",err);
            return `Error en la base de datos`;
        }
    }
    async eliminarEvent(idDelete){
        try {
            const id = parseInt(idDelete);
            await connection.query(Queries.deleteEvent, [id]);
            return{
                code : 100,
                message: `Evento eliminado exitosamente`
            }
        } catch (error) {
            console.log("ERROR= ", error);
            return `Error en la base de datos`;
        }
    }
    async fechaEvento(Nombre, Fecha){
        let nombreTrim= Nombre.replace(/ /g, "");
        Fecha= moment(Fecha).format("YYYY-MM-DD");
        const eventos = await connection.query(Queries.selectEvents);
        for (const event of eventos) {
            const eventFecha = moment(event.Fecha, 'yyyy-mm-dd');
            let eventNombre =event.Nombre;
            eventNombre = eventNombre.replace(/ /g, "");
            if(nombreTrim === eventNombre){
                return false;
            }
            if(nombreTrim.toLowerCase() === eventNombre.toLowerCase()){
                return false;
            }
            if (nombreTrim === eventNombre && nombreTrim.toLowerCase() === eventNombre.toLowerCase()&& (moment(Fecha).isAfter(eventFecha)|| moment(Fecha).isSameOrBefore(eventFecha))){
                return false;
            }
        }
        return true
    }
    async validarHora(Hora_inicio,Hora_fin, Fecha, id){
        // Hora fin no sea antes de hora inicio
        Fecha= moment(Fecha).format("YYYY-MM-DD");
        const inicio = moment(Hora_inicio, "HH:mm:ss");
        const final = moment(Hora_fin, "HH:mm:ss");
        if(moment(final).isSameOrBefore(inicio)){
            return false;
        }
        const eventos = await connection.query(Queries.selectEvents);
        console.log("eventos=", eventos);
        //No se traslapen eventos
        if(eventos.length >0){
            for (const event of eventos) {
                const eventInicio=moment(event.Hora_inicio, "HH:mm:ss");
                const eventFinal=moment(event.Hora_fin, "HH:mm:ss");
                const eventFecha = moment(event.Fecha, 'yyyy-mm-dd'); 
                if(moment(Fecha).isSame(eventFecha)){
                    if(id === event.id){
                        return true;
                    }
                    if(moment(inicio).isAfter(eventInicio) && moment(inicio).isBefore(eventFinal)){
                    return false;
                    }
                    if(moment(final).isAfter(eventInicio) && moment(final).isBefore(eventFinal)){
                        return false;
                    }
                    if(moment(inicio).isSameOrBefore(eventInicio) && moment(final).isSameOrAfter(eventFinal)){
                        return false
                    }
                }
            }
            return true;
        }else{
            return true;
        }
    }
}

module.exports = Events;