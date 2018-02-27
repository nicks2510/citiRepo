import { AfterViewInit, Component, OnInit, OnChanges,ViewChild,Input,Output,EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { SessionService } from '../../common-service/session.service';


@Component({
  selector: 'my-datatable',
  templateUrl: 'datatable.component.html'
})
export class DatatableComponent implements OnInit, AfterViewInit,OnChanges {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @Output() someEvent = new EventEmitter<string>();
  @Output() commentEvent = new EventEmitter<Event>();
  commentFlag;
  addCommentAppConfig;
  sendEmailAppConfig;
  showDetailsAppConfig;
  // @Input() private columnData: any =[];
  // @Input() private rowData: any = [];
  // @Input() private rowKey: any = [];
  // @Input() private id:any;
  constructor( private session:SessionService) { }

  callParent(index:any) {
    this.someEvent.next(index);
  }

  public position;
  public addComment(e,index) {
    this.hideEmailPopUp();
    this.position=index;
    //this.commentEvent.next(e);
   var popover = document.getElementById("addCommentPop");
   popover.style.display = "inline";

  //  popover.style.top = (e.pageY-100)+"px";
  //  popover.style.left = (e.pageX-420)+"px";
   popover.style.top = (e.clientY-100)+"px";
   popover.style.left = (e.clientX-420)+"px";
   var el = document.getElementById('tbale2');
  }
  public hideCommentPopUp(){
    
    var popover = document.getElementById("addCommentPop");
    popover.style.display = "none";
    
  }

  public btnSendEmail_click(e,...rec: any[])
  {

    this.hideCommentPopUp();
    var popover = document.getElementById("myEmailPop");
    popover.style.display = "inline";

    // popover.style.top = (e.pageY-200)+"px";
    // popover.style.left = (e.pageX-650)+"px";
    popover.style.top = (e.clientY-200)+"px";
    popover.style.left = (e.clientX-650)+"px";

  }
  public hideEmailPopUp(){
    
    var popover = document.getElementById("myEmailPop");
    popover.style.display = "none";
  }

 public flag=false;
 public columnData: string[]=[""];
 public rowData: string[]=[];
 public rowKey: string[]=[];
 public surroKey: string[]=[""];

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit(): void {
   // this.dtTrigger.next();
  }
  ngOnChanges() {

  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  public setup(dynColumn : any =[],xlsData: any = [],rowKeys: any = [],count:any, surroKeys: any=[], addComment:any,addCommentAppConfig:any,sendEmailAppConfig:any,showDetailsAppConfig:any){
    this.columnData=[];
    this.rowData=[];
    this.rowKey=[];
    this.surroKey=[];
    this.surroKey =surroKeys;
    this.addCommentAppConfig=addCommentAppConfig;
    this.sendEmailAppConfig=sendEmailAppConfig;
    this.showDetailsAppConfig=showDetailsAppConfig;
    this.commentFlag=addComment;
    this.columnData=dynColumn;
    this.rowData=xlsData;
    this.rowKey=rowKeys;
    
    console.log(this.surroKey);
    if(count==0){
      this.dtTrigger.next();
      this.flag=true;
    }
      if(count!=0){
        this.rerender();      
      }
  }

  public updateComment(value:any) {
    let key;
    key=this.surroKey[this.position];
    key=key.SURROGATE_KEY
     
    let msg;
    console.time("Time taken by updateComments(): ");   
    this.session.updateComments(key,value).subscribe((data)=> {
      console.timeEnd("Time taken by updateComments(): ");
      debugger;
      
        if(data.RESPONSECODE == 1){
          msg = data.RESPONSEMSG;
          console.log(msg);
          alert(msg);
            // If success then update comment
          //   this.tradeInfo.forEach(element => {
          //       if(element == this.popUpCommentData[0]){  
          //         element.COMMENTS = value;
          //       }
              
          // });
        }else if(data.RESPONSECODE == -2){
          msg = data.RESPONSEMSG;
          console.log(msg);
          alert(msg);
        }
            }, (err)=>{
              console.log(err);
          });  

    }
}

