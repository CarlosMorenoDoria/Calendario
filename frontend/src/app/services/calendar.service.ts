import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class Calendar {
    readonly ROOT_URL:string;
    constructor(
        private http: HttpClient
    ){
        this.ROOT_URL ='http://localhost:3000'
    }

    public async getEventos(){
        
        return await this.http
            .get(`${this.ROOT_URL}/events`)
            .toPromise()
            .then((res: any) => {
                return res;
            });
    }
    public async createEvento(body:any){
        return await this.http
        .post(`${this.ROOT_URL}/create`, body)
        .toPromise()
        .then((res: any) => {
            return res;
        });
    }
    public async editEvento(body:any){
        return await this.http
        .put(`${this.ROOT_URL}/edit`, body)
        .toPromise()
        .then((res: any) => {
            return res;
        });
    }
    public async deleteEvento(id:number){
        return await this.http
        .delete(`${this.ROOT_URL}/delete/${id}`)
        .toPromise()
        .then((res: any) => {
            return res;
        });
    }
    public async getColors(){
        return await this.http
        .get(`${this.ROOT_URL}/colors`)
        .toPromise()
        .then((res: any) => {
            return res;
        });
    }
    public async getLugares(){
        return await this.http
        .get(`${this.ROOT_URL}/lugar`)
        .toPromise()
        .then((res: any) => {
            return res;
        });
    }
}