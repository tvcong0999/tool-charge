import { Injectable } from '@angular/core';
import { ListSurchage, TransportRequestInfor } from '../model/model.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class TransportRequestInforService {
  formData: TransportRequestInfor = new TransportRequestInfor();
  readonly rootURL = 'http://localhost:51279/api';
  transportRequestInfor:TransportRequestInfor = new TransportRequestInfor(); 
  isDisabled: boolean;

  constructor(private http: HttpClient) { }
  getInforTransportRequestID(id) {
   return  this.http.get(`${this.rootURL}/TransportRequestInfors/${id}`);
  }
  getAllInforTransportRequest(){
    return this.http.get(`${this.rootURL}/TransportRequestInfors/`);
  }
}
