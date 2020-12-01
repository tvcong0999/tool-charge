import { Component, Input, OnInit, OnChanges, ElementRef, AfterViewInit, AfterContentInit, DoCheck, AfterContentChecked, AfterViewChecked} from '@angular/core';
import { ListSurchageService } from 'src/app/shared/service/list-surchage.service';
import { SurchargeDetailService } from 'src/app/shared/service/surcharge-detail.service';
import * as $ from 'jquery';
import { ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as angular from 'angular'
import { event } from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SurchargeDetailMoredetailComponent } from '../surcharge-detail-moredetail/surcharge-detail-moredetail.component';
import { SurchargeDetailListComfirmdeleteComponent } from './surcharge-detail-list-comfirmdelete/surcharge-detail-list-comfirmdelete.component';
import { ToastrService } from 'ngx-toastr';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import { templateJitUrl } from '@angular/compiler';
import { format } from 'path';
import { stringify } from 'querystring';
import { forEach } from 'angular';


@Component({
  selector: 'app-surcharge-detail-list',
  templateUrl: './surcharge-detail-list.component.html',
  styleUrls: ['./surcharge-detail-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SurchargeDetailListComponent implements OnInit, OnChanges {
  @Input() rowData:string;
  @Input() idTag:number;

  constructor(public router: Router,
     public listSurchageService: ListSurchageService,
     public surchargeDetailService: SurchargeDetailService,
     private elementRef: ElementRef,
     private modalService: NgbModal,
     private toastr: ToastrService,
     ) { }
     public checkall:boolean = false;

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  ngOnChanges(): void{
    
  this.appendRow();

  }
  
  public async appendRow(){
    
    await $('.tbody').append(this.rowData);
    this.getNumberOfRow();
   
   
  }
  ngOnInit(): void {
    $(document).on('click', '.edit', (event)=> {this.replaceTagDelAndEdit(event);});
    $(document).on('click', '.del', (event)=> {this.delete(event);});
    $(document).on('click', '.save', (event)=>{ this.save(event)});
    $(document).on('click', '.unsave', (event)=>{ this.unsave(event)});
    $(document).on('click', '#imgsur', (event)=>{ this.showDetailImage(event);});
    $(document).on('keypress', 'table tbody tr .col5 input', (event)=>{ return this.onlyNumberKey(event);});
    $(document).on('keypress', 'table tbody tr .col6 input', (event)=>{ return this.onlyNumberKey(event);});
    $(document).on('keypress', 'table tbody tr .col7 input', (event)=>{ return this.onlyNumberKey(event);});
    $(document).on('keypress', 'table tbody tr .col10 input', (event)=>{ return this.onlyNumberKey(event);});
  }

  //  getEventClickEdit(){
  //   let tagEdits =  this.elementRef.nativeElement.querySelectorAll('.edit');
  //   if(tagEdits)
  //   for(let tagEdit of tagEdits)
  //   {
  //     tagEdit.addEventListener('click', (event)=>{this.replaceTagDelAndEdit(event);});

  //   }
  // }
  // getEventClickSave(){
  //   let tagSaves =  this.elementRef.nativeElement.querySelectorAll('.save');
  //   if(tagSaves)
  //     for(let tagSave of tagSaves)
  //       tagSave.addEventListener('click', (event)=>{this.save(event);});
  // }
  showDetailImage(event){
    let idTag = event.target.parentNode.id;
    this.listSurchageService.idImage = idTag;
    this.modalService.open(SurchargeDetailMoredetailComponent);
    // const navigateToSurchargeDetail: NavigationExtras={};
    // this.router.navigate(['/surcharge-detail'], navigateToSurchargeDetail);
  }
  delete(event){
    const modalRef = this.modalService.open(SurchargeDetailListComfirmdeleteComponent, {backdrop: 'static', });
    let message = "Do you want delete?"
    modalRef.componentInstance.message = message;
    modalRef.result.then((result)=>{
      if(result == 'ok')
      {
        let idTag = event.target.parentNode.id;
        $('table tbody #tr'+idTag).remove();
        let sur = this.getSurchargeById(idTag);
        this.surchargeDetailService.surCharge.splice(this.surchargeDetailService.surCharge.indexOf(sur),1);
        this.resetNumberical();
      }
    }, (reson)=>{

    });

  }
    
  replaceTagDelAndEdit(event){
    
    if(event.target)
    {
      
      let idTag = event.target.parentNode.id;
      let iconSaveAndUnsave = `<i class="fas fa-save save" (click) = "save(event)"></i>
    <i class="fas fa-times unsave"></i>`;
    if(idTag){
      $('table tbody tr #'+idTag).html(iconSaveAndUnsave);
      $('table tbody #tr'+idTag+' td input').removeAttr('disabled');
      $('table tbody #tr'+idTag+' td input').attr('style','text-decoration: underline');
    }
  }
}
  unsave(event){
    const modalRef = this.modalService.open(SurchargeDetailListComfirmdeleteComponent);
    let message = "Your data unsaved. Do you want to close without save?"
    modalRef.componentInstance.message = message;
    modalRef.result.then((result)=>{
      if(result == 'ok')
      {
        let idTag = event.target.parentElement.id;
        let delAndEdit = ` <i class="far fa-trash-alt del"></i>
        <i class="fas fa-pencil-alt edit"></i>`;
        if(idTag){
        $('table tbody tr #'+idTag).html(delAndEdit);
        let valueInputs =  this.elementRef.nativeElement.querySelectorAll('table tbody #tr'+idTag+' td input');
        if(valueInputs)
        {
          let sur =  this.getSurchargeById(idTag);
          valueInputs[1].value =sur.name; 
          valueInputs[2].value = sur.inforSurcharge.ticketNumber;
          valueInputs[3].value =  sur.inforSurcharge.taxCode
          valueInputs[4].value = sur.inforSurcharge.price
          valueInputs[5].value = sur.currency
          valueInputs[6].value = sur.includeVAT
          valueInputs[7].value = sur.VATrate
        }
        $('table tbody #tr'+idTag+' td input').prop('disabled', 'disabled');
        $('table tbody #tr'+idTag+' .check input').removeAttr('disabled');
        $('table tbody #tr'+idTag+' td input').attr('style','text-decoration: none');
      }
      }
    }, (reson)=>{

    });
  }
  save(event){
    let idTag = event.target.parentElement.id;
    let delAndEdit = ` <i class="far fa-trash-alt del"></i>
    <i class="fas fa-pencil-alt edit"></i>`;
    if(idTag){
    $('table tbody tr #'+idTag).html(delAndEdit);
    $('table tbody #tr'+idTag+' td input').prop('disabled', 'disabled');
    $('table tbody #tr'+idTag+' .check input').removeAttr('disabled');
    $('table tbody #tr'+idTag+' td input').attr('style','text-decoration: none');
    let valueInputs =  this.elementRef.nativeElement.querySelectorAll('table tbody #tr'+idTag+' td input');
    if(valueInputs)
    {
      let name = valueInputs[1].value;
      let numberTicket = valueInputs[2].value;
      let taxCode = valueInputs[3].value;
      let price = valueInputs[4].value;
      let cur = valueInputs[5].value;
      let includeVAT = valueInputs[6].value;
      let rate = valueInputs[7].value;
     let sur =  this.getSurchargeById(idTag);
     sur.name = name;
     sur.inforSurcharge.ticketNumber = numberTicket;
     sur.inforSurcharge.taxCode = taxCode;
     sur.inforSurcharge.price = price;
     sur.currency = cur;
     sur.includeVAT = includeVAT;
     sur.VATrate = rate;
     if(sur.name!=""&&sur.inforSurcharge.ticketNumber!=""&&sur.inforSurcharge.taxCode!=""&&sur.inforSurcharge.price!=""&&sur.currency!=""&&sur.includeVAT!=""&&sur.VATrate!="")
      {
        debugger
        let htmlCheckbox = `<input type="checkbox" name="" id="" value = "checkbox">`;
        $('table tbody tr .check').html(htmlCheckbox);
      }
     this.toastr.success('Data updates success');  
    }
  }
}
getSurchargeById(id)
{
  return this.surchargeDetailService.surCharge.find(e=>{return id == e.id;});
}
getNumberOfRow(){
 this.listSurchageService.NumberOfRow = $('.tbody tr').length + 1;
}
resetNumberical(){
  let numberRow =  $('.tbody tr').length;
  let rows =  this.elementRef.nativeElement.querySelectorAll('table tbody tr');
    if(rows)
    {
      for(let [i, row] of rows.entries())
      {
       row.children[1].innerHTML = `${i+1}`;
      }
    }
}
 async getDataErrorFromTableToArray()
{
  let listError:Array<Array<any>> = [];
  let rows =  this.elementRef.nativeElement.querySelectorAll('table tbody tr');
    if(rows)
    {
      for(let [i, row] of rows.entries())
      {
        if(row.children[0].children[0].value == "ban")
        {
          let sur = this.getSurchargeById(row.id.substring(2,row.id.length));
        let error:any = [];
        let workbook = new Workbook();
        // let reader = new FileReader();
        // reader.readAsDataURL(sur.image);
        // reader.onload = function () {
        //   base64 = reader.result;
        //   console.log(base64);
        // };
        let base;

       
        await this.toBase64(sur.image).then(data=>{
          base = data as string;
    });
    let image =await workbook.addImage({
      base64: base,
      extension:'png'
    });
        // error.numberical =  row.children[1].data;
        error = await [base,  sur.name, sur.inforSurcharge.ticketNumber, sur.inforSurcharge.taxCode, sur.inforSurcharge.price, sur.currency, sur.includeVAT, sur.VATrate];
        // error.image = sur.image;
        // error.name =   sur.name;
        // error.ticketNumber =  sur.inforSurcharge.ticketNumber;
        // error.taxCode = sur.inforSurcharge.taxCode;
        // error.price = sur.inforSurcharge.price;
        // error.currency =  sur.currency;
        // error.includeVAT =  sur.includeVAT;
        // error.VATrate =  sur.VATrate;
        await listError.push(error);

      }
    }
    }
    return listError;
}
  async exportErrorList(){
    
    let workbook =await new Workbook();
    let worksheet=await workbook.addWorksheet('listerror');
   let array = await this.getDataErrorFromTableToArray();
   worksheet.addRow(["image","name","ticketNumber","taxCode","price","currency","includeVAT", "VATrate"]);
   worksheet.getColumn('B').key = 'name';
   worksheet.getColumn('C').key = 'ticketNumber';
   worksheet.getColumn('D').key = 'taxCode';
   worksheet.getColumn('E').key = 'price';
   worksheet.getColumn('F').key = 'currency';
   worksheet.getColumn('G').key = 'includeVAT';
   worksheet.getColumn('H').key = 'VATrate';
   for(let [i,row] of array.entries())
   {
    let image =await workbook.addImage({
      base64: row[0],
      extension:'png'
    });
     await worksheet.addImage(image,{
      tl: { col: 0, row: i+1 },
      ext: { width: 60, height: 20 }
    });
    await worksheet.addRow({
      name: row[1],
      ticketNumber: row[2],
      taxCode: row[3],
      price: row[4],
      currency: row[5],
      includeVAT: row[6],
      VATrate: row[7],
    });
   }
  await  workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'test.xlsx');
});
    
    //this.exportExcel( this.getDataErrorFromTableToArray(),'listerror');
  }
  public exportExcel(jsonData: any[], fileName: string): void {
      
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        
        this.saveExcelFile(excelBuffer, fileName);
  }
  private saveExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {type: this.fileType});
        FileSaver.saveAs(data, fileName + this.fileExtension);
  }

  importData(){
    console.log(this.getSuccessData());
  }
  getSuccessData(){
    let listSuccessData:Array<any> = [];
    let rows =  this.elementRef.nativeElement.querySelectorAll('table tbody tr');
    if(rows)
    {
      for(let [i, row] of rows.entries())
      {
        debugger
        if(row.children[0].children[0].checked)
        {
        let data:any = {};
        // error.numberical =  row.children[1].data;
       // error.image =  row.children[2].children[0].value;
       data.name =   row.children[3].children[0].value;
       data.ticketNumber =   row.children[4].children[0].value;
       data.taxCode =  row.children[5].children[0].value;
       data.price =  row.children[6].children[0].value;
       data.currency =  row.children[7].children[0].value;
       data.includeVAT =  row.children[8].children[0].value;
       data.VATrate =  row.children[9].children[0].value;
        listSuccessData.push(data);
      }
    }
    }
    return listSuccessData;
  }
   toBase64(file:File){ 
    return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    });
   }  

   onlyNumberKey(evt) { 
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode 
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) 
      return false; 
    return true; 
} 

checkAll(){
  debugger
  let check  = this.elementRef.nativeElement.querySelectorAll('table tbody tr')
  check.forEach(element => {
    element.children[0].children[0].checked = !this.checkall;
  });
  this.checkall = !this.checkall;
}
}
