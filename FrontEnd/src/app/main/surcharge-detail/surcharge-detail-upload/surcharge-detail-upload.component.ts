import { Component, EventEmitter, OnInit, Output, ViewChild, ɵɵpureFunction1 } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { InforSurcharge, Surcharge } from 'src/app/shared/model/model.model';
import { ListSurchageService } from 'src/app/shared/service/list-surchage.service';
import { SurchargeDetailService } from 'src/app/shared/service/surcharge-detail.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-surcharge-detail-upload',
  templateUrl: './surcharge-detail-upload.component.html',
  styleUrls: ['./surcharge-detail-upload.component.css']
})
export class SurchargeDetailUploadComponent implements OnInit {

  constructor(public listSurchageService: ListSurchageService, public surchargeDetailService: SurchargeDetailService) { }
  public surCharge;
  public fileCaptureImage: File;
  public index = 0;
  //
  public idTag = 0;
  @Output() public pictureTaken = new EventEmitter<WebcamImage>();
  public html = "";
  public displayToTable = false;
  public webcamImage:WebcamImage = null;
  public check = true;
  public mirrorImage = "never";
// toggle webcam on/off
public allowCameraSwitch = true;
public multipleWebcamsAvailable = false;
public deviceId: string;
public videoOptions: MediaTrackConstraints = {
// width: {ideal: 1024},
// height: {ideal: 576}
};
public errors: WebcamInitError[] = [];
// webcam snapshot trigger
private trigger: Subject<void> = new Subject<void>();
// switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>(); 
  //

  ngOnInit(): void {
    this.surCharge = this.listSurchageService.surcharge;
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
    this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
  }
  chooseSurcharge(){
    let text = $('#surcharge :selected');
    this.listSurchageService.surcharge = text.text();
    this.surCharge = this.listSurchageService.surcharge;
  }
  // public handleImage(webcamImage:WebcamImage){
  //   this.webcamImage = webcamImage;
  // }
  public triggerSnapshot(): void {
    if(this.check)
    {
      this.trigger.next();
      this.check = !this.check;
      this.fileCaptureImage = this.base64ToFIle(this.webcamImage.imageAsDataUrl, this.surCharge+this.index+'.jpeg');
      this.index++;
      this.surchargeDetailService.filesFromCapture.push(this.fileCaptureImage);
    }
    else
    {
      this.webcamImage = null;
      this.check = !this.check;
    }
  }
    public toggleWebcam(): void {
    this.listSurchageService.showWebcam = !this.listSurchageService.showWebcam;
    }
    public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    }
    public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
    }
    public handleImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.pictureTaken.emit(webcamImage);
    this.webcamImage = webcamImage;
    }
    public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
    }
    public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
    }
    public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
    }
    public upLoad(event){
      if(this.webcamImage != null)
      {
        for(let surcharge of this.surchargeDetailService.filesFromCapture)
        {
          this.getInforFromImage(surcharge).then(result=>{
            this.displaySurchargeToTable(result, surcharge);
          });
        }
      }
      if(this.surchargeDetailService.myfile != undefined)
      {
        for(let surcharge of this.surchargeDetailService.myfile)
        {
          this.getInforFromImage(surcharge).then(result=>{
            this.displaySurchargeToTable(result, surcharge);
                      });
        }
      }
      this.displayToTable = true;
  }
  public async displaySurchargeToTable(result, surcharge){
    let htmlCheckbox = `<input type="checkbox" name="" id="" value = "checkbox">`;
   
    if((result as InforSurcharge)[0] === undefined)
     {
      ((result as InforSurcharge)[0]) = await {price: '', taxCode: '', ticketNumber: ''};
      htmlCheckbox = `<input type="hidden" value = "ban"> <i class="fas fa-ban"></i>`;
     }
     
    await this.surchargeDetailService.listSurchargeInfor.push((result as InforSurcharge)[0]);
     let sur: Surcharge;
     sur = await {id:this.idTag, image: surcharge, name: this.surCharge, inforSurcharge:(result as InforSurcharge)[0], currency: 'VNĐ', includeVAT: 'yes', VATrate: '10'}
     await this.surchargeDetailService.surCharge.push(sur);
    //
    let src = URL.createObjectURL(sur.image);
    let on = this.listSurchageService.NumberOfRow++;
    this.html = await `
    <tr id = "tr${this.idTag}">
    <td class = 'col1 check'>${htmlCheckbox}</td>
    <td class = 'col2'>${on}</td>
    <td class = 'col3'  id = "img${this.idTag}">
    <img id="imgsur" src="${src}" alt="">
    </td>
    <td class = 'col4'>
    <input type="text" value="${sur.name}" name="name" #name="ngModel" disabled/>
    </td>
    <td class = 'col5'>
    <input type="text" value="${sur.inforSurcharge.ticketNumber}" name="ticketNumber" #ticketNumber="ngModel" disabled/>
    </td>
    <td class = 'col6'>
    <input type="text" value="${sur.inforSurcharge.taxCode}" name="taxCode" #taxCode="ngModel" maxlength="10" pattern="[0-9]*" inputmode="numeric" disabled/>
    </td>
    <td class = 'col7'>
    <input type="text" value="${sur.inforSurcharge.price}" name="price" #price="ngModel" disabled/>
    </td>
    <td class = 'col8'>
    <input type="text" value="${sur.currency}" name="currency" #currency="ngModel" disabled/>
    </td>
    <td class = 'col9'>
    <input type="text" value="${sur.includeVAT}" name="includeVAT" #includeVAT="ngModel" disabled/>
    </td>
    <td class = 'col10'>
    <input type="text" value="${sur.VATrate}" name="VATrate" #VATrate="ngModel" disabled/>
    </td>
    <td class = "col11" id = "${this.idTag}">
    <i class="far fa-trash-alt del" value="Click"></i>
    <i class="fas fa-pencil-alt edit" value="Click"></i>
    </td>
    </tr>
    `;
    await this.idTag++;
    this.listSurchageService.htmls.push(this.html);
  }
  async getInforFromImage(image)
  {
    return await new Promise((resolve)=>{
      this.surchargeDetailService.getInforSurcharge(image).subscribe((res)=>{
        this.surchargeDetailService.surchargeInfor =  res as InforSurcharge;
        resolve(this.surchargeDetailService.surchargeInfor);   
      });
    });
  }
        

    onFileSelected(event){
      this.surchargeDetailService.myfile = event.target.files;
    }

    public base64ToFIle(dataUrl, filename){
      var arr = dataUrl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }
   
}
