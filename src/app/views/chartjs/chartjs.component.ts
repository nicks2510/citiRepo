import { Component, OnInit, OnDestroy, ViewChild, SimpleChange, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { Subject, Observable } from 'rxjs/Rx';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { PopoverModule } from 'ng2-popover';
import { CurrencyPipe } from '@angular/common';
import { PopoverDirective } from 'ngx-bootstrap/popover/popover.directive';
import { saveAs } from 'file-saver';
import * as jsPDF from 'jspdf';
import { SessionService } from '../../common-service/session.service';
import { ExcelService } from '../../common-service/xls-download.service';
import { feedStatus } from 'app/config';
import { DatatableComponent } from '../datatable/datatable.component';
import { AppFooterComponent } from 'app/components/app-footer';
import { AppHeaderComponent } from 'app/components/app-header';
import { SnapShotsComponent } from '../SnapShots/SnapShots.component';
import { UserPrefComponent } from '../userpref/userpref.component';
import { debug } from 'util';

@Component({
  templateUrl: 'chartjs.component.html',
  styles: [':host >>> .popover { color: #000; max-width: 100%; white-space: normal !important; word-break: break-all!important;}', ':host >>> .popover>.popover-body {padding: 0px !important;}']
})

export class ChartJSComponent implements OnInit, AfterViewInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  @ViewChild(DatatableComponent)
  datatableComponent: DatatableComponent;
  public countDT = 0;

  @ViewChild('tdModal') public tdModal: ModalDirective

  dtOptions: DataTables.Settings = {};
  dtOptionsForTradeDetails: DataTables.Settings = {};
  dtOptionsForTradeDetailsPop: DataTables.Settings = {};
  dtOptForAerialPopup: DataTables.Settings = {};
  // The trigger needed to re-render the table

  dtTrigger: Subject<any> = new Subject();
  dtTriggerTradeDetail: Subject<any> = new Subject();
  dtTriggerTradeDetailpop: Subject<any> = new Subject();
  adTrigger: Subject<any> = new Subject();
  data: any = {};
  dashBoardData: any = [];
  tradeInfo: any = [];
  tradePop: any = [];
  rowKeys: any = [];
  rowData: any = [];
  xlsData: any = [];
  xlsDownloadData: any = [];
  surroKeysData: any = [];
  xlsDetailData: any = [];
  rowDetailKeys: any = [];
  popUpCommentData: any = [];
  futureFailData: any = [];
  //
  public count = 0;
  //Loader
  public isLoader = false;
  //Trade Details
  tradeDetails: any = [];
  auditData: any = [];
  auditDownloadXlsData: any=[];
  public flag = 0;
  dynColumn : any =[]; 
  dynrow1 : any =[];
  dynrow2 : any =[];
  dynrow3 : any =[];
  dynrow4 : any =[];
  isReadOnly: boolean;
  //Selected rows
  selectedPersonArray = [];
  toggleItemInArr(arr, item) {
    const index = arr.indexOf(item);
    index === - 1 ? arr.push(item) : arr.splice(index, 1);
  }
  isDesc: boolean = false;
  column: string = 'DASHBOARD_LOCATION';
  direction: number;
  sort(property){
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  isDesc1: boolean = false;
  column1: string = 'DATE_TIME';
  direction1:number= -1;
  sortAudit(property){
    //console.log(this.isDesc1);
    this.isDesc1 = !this.isDesc1; //change the direction    
    this.column1 = property;
    this.direction1 = this.isDesc1 ? 1 : -1;
  };

  public chartOptions(type: any, action: any) {

    if (action == 'print') {
      var content = document.getElementById(type).innerHTML;
      var mywindow = window.open('', 'Print', 'height=600,width=800');
      mywindow.document.write('<html><head><title>Print</title>');
      mywindow.document.write('</head><body >');
      mywindow.document.write(content);
      mywindow.document.write('</body></html>');
      mywindow.document.close();
      mywindow.focus();
      mywindow.print();
      mywindow.close();
      return true;
    } else {
      var svgString;
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      if (type == 'stackedbar') {
        // Get Chart 1 from the screen
        //console.log("sam");
        //console.log(this.stackedData);
        // this.stackedData.forEach((item, index) => {
        //   ctx.font="bold 8pt sans-serif";
        //   ctx.fillText(item.cat+" - "+(item.RQ1+item.RQ2+item.RQ3+item.RQ4+item.RQ5), 210, (30+(index*11)));
        // });
        svgString = new XMLSerializer().serializeToString(document.querySelectorAll('svg')[0]);
      } else if (type == 'drillDown') {
        // Get Chart 2 from the screen
        svgString = new XMLSerializer().serializeToString(document.querySelectorAll('svg')[1]);
        // this.chart2Data.forEach((item, index) => {
        //   ctx.font="bold 8pt sans-serif";
        //   ctx.fillStyle=item.color;
        //   ctx.fillText(item.cat+" - "+item.val, 200, (20+(index*11)));
        // });
      } else if (type == 'donutTradeType') {
        // Get Chart 3 from the screen
        svgString = new XMLSerializer().serializeToString(document.querySelectorAll('svg')[2]);
        //console.log(this.chart3Data);
        // this.chart3Data.forEach((item, index) => {
        //   ctx.font="bold 8pt sans-serif";
        //   ctx.fillStyle=item.color;
        //   ctx.fillText(item.cat+" - "+item.val, 200, (20+(index*11)));
        // });
      } else if (type == 'donutDistByAge') {
        // Get Chart 4 from the screen
        svgString = new XMLSerializer().serializeToString(document.querySelectorAll('svg')[3]);
        // this.donutDistByAge.forEach((item, index) => {
        //   ctx.font="bold 8pt sans-serif";
        //   ctx.fillStyle=item.color;
        //   ctx.fillText(item.cat+" - "+item.val, 200, (20+(index*11)));
        // });
      }
      var DOMURL = self.URL || (window as any).webkitURL || self;
      var img = new Image();
      var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      var url = DOMURL.createObjectURL(svg);
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        var png = canvas.toDataURL("image/png");
        canvas.toBlob(function (blob) {
          if (action == 'PNG') {
            saveAs(blob, 'Chart.png');
          } else if (action == 'JPG') {
            saveAs(blob, 'Chart.jpg');
          } else if (action == 'PDF') {
            var pdf = new jsPDF();
            pdf.addImage(png, 'JPEG', 0, 0);
            pdf.save("Chart.pdf");
          }
        });
      };
      img.src = url;
    }
  }

  addThisPersonToArray(person: any) {
    // if (!event.ctrlKey) {
    //   this.selectedPersonArray = [];
    // }

    this.toggleItemInArr(this.selectedPersonArray, person);

  }

  isPersonSelected(person: any) {
    return (this.selectedPersonArray.indexOf(person) !== -1);
  }

  resetSelected() {
    this.selectedPersonArray = [];
  }

  public stackedData = [];
  public stackType = [];
  // public StackedBarcolors = [];
  public donutDistByAge = [];
  public chart2Data = [];
  public chart3Data = [];
  public chart2DrillDetails = [];
  public chart3DrillDetails = [];
  public chart4DrillDetails = [];
  public chart1ID = 'chart1ID'; public chart2ID = 'chart2ID'; public chart3ID = 'chart3ID'; public chart4ID = 'chart4ID';
  public activeChart:any = {};
  drillLevelChart1 = 0 ; drillLevelLocation = 0; drillLevelTradeType = 0; drillLevelAge = 0;
  show: boolean = true;

  toggleExpand() {
    this.show == false ? this.show = true : this.show = true;
  }

  toggleCollapse() {
    this.show == true ? this.show = false : this.show = false;
  }
  public largeModal;
  public data2: Object;
  public temp_var: Object = false;
  public masterData: any;
  public numberOfTradesLocWise: any[] = [];
  public numberOfTradesTradeStatusWise: any = [];
  public numberOfTradesTradeTypeWise: any[] = [];
  public numberOfFailedTradebyAge: any[] = [];

  public TradeFilterArrayLavel1: any = [];
  public TradeFilterArrayLavel2: any = [];
  public TradeFilterArrayLavel3: any = [];
  public TradeFilterArrayLavel4: any = [];

  public Age0_3Days: number = 0;
  public Age4_7Days: number = 0;
  public AgeGt7Days: number = 0;
  public AgeLt0Days: number = 0;
  graph1; graph2; graph3; graph4; summeryTbl; detailTbl; addComment; sendEmailAppConfig; addCommentAppConfig; showDetailsAppConfig;
  UserPreference;

  constructor(private excelService: ExcelService, private session:SessionService) { }
  someClickHandler(info: any, event:any ): void {
    debugger;
    alert(info.RQ_RATING + ' - ' + event.pageX);
  }
  public filterAndSideLinkData: any = {};
  // events
  public chartHover(e: any): void {
    
  }
  public chartClicked(e: any): void {
    debugger;
      var chartID = e.chartID;
      this.activeChart['chartID'] = chartID;
      if (chartID == this.chart1ID) {
        this.drillLevelChart1 = 1; var eleArr = []; 
        this.filterAndSideLinkData.RiskType.forEach(element => {
          if(element.checked)
          eleArr.push(element.name);
          if (element.name != e.name)
            element.checked = false;
        });
        this.rerender();
        this.activeChart['SetStatusChart4'] = eleArr;
      }
      else if (chartID == this.chart2ID) {
        this.chart2DrillDetails = [];
        this.activeChart['drillLevel'] = e.data.drillLevel;
        this.chart2DrillDetails.push({cat:e.data.cat, val:e.data.val});
        
        this.drillLevelLocation = e.data.drillLevel;
        if(e.data.drillLevel == 1)
        {
          var eleArr = [];
          this.filterAndSideLinkData.settlementLocation.forEach(element => {
            if(element.checked)
            eleArr.push(element.name);
            if (element.name != e.data.DisplayValue)
                element.checked = false;
            else
                element.checked = true;
          });
          this.activeChart['SetLocation'] = eleArr;
          this.activeChart['chart2DrillDetails'] = this.chart2DrillDetails;
        }
        else
        {
          var eleArr = [];
          this.filterAndSideLinkData.TradeStatus.forEach(element => {
            if(element.checked)
            eleArr.push(element.name);
            if (element.name != e.data.DisplayValue)
                element.checked = false;
            else
                element.checked = true;
          });
          this.activeChart['SetStatus'] = eleArr;
        }
        this.rerender();
      }
      else if (chartID == this.chart3ID) {
        this.chart3DrillDetails = [];
        this.activeChart['drillLevelTradeStatus'] = e.data.drillLevel;
        this.chart3DrillDetails.push({cat:e.data.cat, val:e.data.val});
        
        this.drillLevelTradeType = e.data.drillLevel;
        if(e.data.drillLevel == 1)
        {
          var eleArr = [];
          this.filterAndSideLinkData.TradeType.forEach(element => {
            if(element.checked)
            eleArr.push(element.name);
            if (element.name != e.data.DisplayValue)
                element.checked = false;
            else
                element.checked = true;
          });
          this.activeChart['SetTradeType'] = eleArr;
          this.activeChart['chart3DrillDetails'] = this.chart3DrillDetails;
        }
        else
        {
          var eleArr = [];
          this.filterAndSideLinkData.settlementLocation.forEach(element => {
            if(element.checked)
            eleArr.push(element.name);
            if (element.name != e.data.DisplayValue)
                element.checked = false;
            else
                element.checked = true;
          });
          this.activeChart['SetStatusChart3'] = eleArr;
        }
        this.rerender();
        
      }
      else if (chartID == this.chart4ID) {
        // this.filterAndSideLinkData.Aging.forEach(element => {
        //   if (element.name != e.data.name)
        //     element.checked = false;
        // });
       // this.rerender();
       this.chart4DrillDetails = [];
       
       this.chart4DrillDetails.push({cat:e.data.cat, val:e.data.val});
       this.activeChart['Chart4FilterType'] = e.data.DisplayValue;
       //this.chart3DrillDetails.push({cat:e.data.cat, val:e.data.val});
       this.drillLevelAge = e.data.drillLevel;
       this.rerender();
  }
  
}
  ngAfterViewInit(): void{
    this.dtTriggerTradeDetail.next();
  }

  ngOnInit(): void {
    this.isLoader = true;
    console.time("Time taken by Full UI(): ");
    console.time("Time taken by getEntitlement(): ");
    debugger;
    this.session.getEntitlement().subscribe((data)=> {
      debugger;
      console.log('test');
      console.log(data);
      console.timeEnd("Time taken by getEntitlement(): ");
      if( data == undefined || data.OPSTECH_ENTITLEMENT == undefined || Object.keys(data).length < 1){
        
        window.location.href="../PCPFDS/pcplogout.jsp";
      }
        AppHeaderComponent.prototype.currentUser = data.OPSTECH_ENTITLEMENT.opstechUserVO.lUserName;
        AppHeaderComponent.prototype.soeid = data.OPSTECH_ENTITLEMENT.opstechUserVO.soeId;
        AppHeaderComponent.prototype.loggedinTime = data.OPSTECH_ENTITLEMENT.opstechUserVO.sCurrentDate;
        this.graph1 = data.OPSTECH_ENTITLEMENT.opstechGraphAccessVO.rqRatingGraphAccess;
        this.graph2 = data.OPSTECH_ENTITLEMENT.opstechGraphAccessVO.locationGraphAccess;
        this.graph3 = data.OPSTECH_ENTITLEMENT.opstechGraphAccessVO.tradeTypeGraphAccess;
        this.graph4 = data.OPSTECH_ENTITLEMENT.opstechGraphAccessVO.byAgeGraphAccess;
        this.summeryTbl = data.OPSTECH_ENTITLEMENT.opstechTableAccessVO.tradeSummaryTableAccess;
        this.detailTbl = data.OPSTECH_ENTITLEMENT.opstechTableAccessVO.tradeDetailTableAccess;
        this.addComment = data.OPSTECH_ENTITLEMENT.opstechCommentAccessVO.commentAccess;
        this.addCommentAppConfig =  data.OPSTECH_ENTITLEMENT.configEntitlementVO.COMMENT;
        this.sendEmailAppConfig = data.OPSTECH_ENTITLEMENT.configEntitlementVO.EMAIL;
        this.showDetailsAppConfig =  data.OPSTECH_ENTITLEMENT.configEntitlementVO.DETAIL;
        this.UserPreference = data.OPSTECH_ENTITLEMENT.userPreferenceVO.filter(ele => ele.preferenceValue == 1);
        //console.log("1st Value: "+AppHeaderComponent.prototype.currentUser);
        //console.log("2nd Value: "+AppHeaderComponent.prototype.soeid);

        debugger;
        if(this.detailTbl == 1)
        {
          if(this.UserPreference[0].preferenceName == "TRADE_DETAILS_TABLE")
          {
            this.detailTbl = 1;
            UserPrefComponent.prototype.currentPref = 'Detail View';
          }
          else
          {
            this.detailTbl = 0;
            UserPrefComponent.prototype.currentPref = 'Summary View';
          }
        }
        //this.isLoader = false;
      }, (err)=>{
        console.log('Entered');
        window.location.href="../PCPFDS/pcplogout.jsp";
        console.log(err);
    });

    this.dtOptions = {
      paging: false,
      pageLength: 0,
      searching: false,
      ordering: false
    };
    this.dtOptForAerialPopup = {
      paging: true,
      searching: false,
      lengthChange: false
    };
    this.dtOptionsForTradeDetails = {
      paging: true,
      pageLength: 20,
      searching: true,
      order: [0, "desc"],
      //columnDefs: [{ targets: [11], orderable: false }],
      "lengthMenu": [10, 15, 20, 30, 50],
      data : [],
      columns: [{
        title: 'RQ Rating',
        data: 'RQ_RATING',
        width : "6%"
        // render : function(data, type, full) {
        //   return '';
        // }
      }, {
        title: 'Swift Ref No',
        data: 'SWIFTREF'
      }, {
        title: 'Trade #',
        data: 'uniqueTradeKey'
      },{
        title: 'Account',
        data: 'ACCOUNT_ID'
      }, {
        title: 'Account Short Name',
        data: 'ACCOUNT_SHORT_NAME'
      }, {
        title: 'Amount(USD)',
        data: 'USD_EQUIVALENT'
      }, {
        title: 'Trade Date',
        data: 'TRADE_DATE'
      }, {
        title: 'Trade Status',
        data: 'DASHBOARD_STATUS'
      },{
        title: 'Settlement Date',
        data: 'TRADE_SETTLE_DATE'
      }, 
      
      {
        title: 'Failed Reason',
        data: 'FAILED_REASON'
      }, {
        title: 'Comments',
        data: 'COMMENTS'
      }, {
        title: 'Action',
        orderable: false,
        data : this.data,
        width:'6%',
        //visible : this.data.visibleA,
        render : function(data, type, full) {
          let disabled = "";
          if(data.DASHBOARD_STATUS != "Failed" || data.addComment == 0)
          {
            disabled = "disabled";
          }

          let hideCmt = "";
          if(data.addCommentAppConfig != "1"){
            hideCmt = "hidden";
          }

          let hideEmail = "";
          if(data.sendEmailAppConfig != "1"){
            hideEmail = "hidden";
          }

          let hideDet = "";
          if(data.showDetailsAppConfig != "1"){
            hideDet = "hidden";
          }
          
          return '<button '+ hideCmt +' id="btn_cmt" '+disabled+' class="DetailButton" style="margin-left:2px"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' +
          '<span>&nbsp;&nbsp;</span>' +
          '<button '+ hideDet +' id="btn_detail" class="DetailButton" style="margin-left:2px"><i class="fa fa-file-text" aria-hidden="true"></i></button>'+ 
          '<span>&nbsp;&nbsp;</span>' +
          '<button '+ hideEmail +' id="btn_eml" class="DetailButton" title="Email" ng-disabled="true"><i class="fa fa-envelope" aria-hidden="true"></i></button>';
        },
        // defaultContent: 
        // '<a class="DetailButton" (click)="btnAddComments_click($event, rec)" style="margin-left:2px"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
        // '<span>&nbsp;&nbsp;</span>' +
        // '<a href="javascript:void(0)" (click)="btnSendEmail_click($event, rec)" title="Email" ng-disabled="true"><i class="fa fa-envelope" aria-hidden="true"></i></a>' + 
        // '<span>&nbsp;&nbsp;</span>' +
        // '<a class="DetailButton" (click)="loadPopupDetailsData($event,true,rec);tdModal.show();" style="margin-left:2px"><i class="fa fa-file-text" aria-hidden="true"></i></a>'
        
      }],
      rowCallback: (row: Node, data: any, index: number) => {
        $(row).find('td:eq(10)').css('text-overflow', 'ellipsis').css('white-space', 'nowrap').css('overflow', 'hidden').css('max-width', '25px');
        // $(row).addClass('active');
        if(data.RQ_RATING == 0){
          $(row).find('td:eq(0)').css('background-color', 'green').css('color', 'green').css('text-indent', '-9999px');
        }
        else if(data.RQ_RATING == 1){
          $(row).find('td:eq(0)').css('background-color', 'green').css('color', 'green').css('text-indent', '-9999px');
        }
        else if(data.RQ_RATING == 2){
          $(row).find('td:eq(0)').css('background-color', 'green').css('color', 'green').css('text-indent', '-9999px');
        }
        else if(data.RQ_RATING == 3){
          $(row).find('td:eq(0)').css('background-color', '#FFC200').css('color', '#FFC200').css('text-indent', '-9999px');
        }
        else if(data.RQ_RATING == 4){
          $(row).find('td:eq(0)').css('background-color', '#FFC200').css('color', '#FFC200').css('text-indent', '-9999px');
        }
        else if(data.RQ_RATING == 5){
          $(row).find('td:eq(0)').css('background-color', 'red').css('color', 'red').css('text-indent', '-9999px');
        }
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', row).unbind('click');
        // $('td', row).on('click' , () => {
        //   self.someClickHandler(data, event);
        // });
        $('td', row).on('click', '#btn_cmt' , () => {
          this.btnAddComments_click(event, data);
        });

        $('td', row).on('click', '#btn_eml' , () => {
          this.btnSendEmail_click(event, data);
        });

        $('td', row).on('click', '#btn_detail' , () => {
          
          this.loadPopupDetailsData(event,true,data);
          this.tdModal.show();
        });
        $(row).on('click' , () => {
          
          //self.someClickHandler(data, event);
          this.addThisPersonToArray(data);
          if(this.isPersonSelected(data) == true){
            $(row).addClass( 'active' );
          }else{
            $(row).removeClass( 'active' );
          }
        });
        return row;
      }
    }

    console.time("Time taken by getTradeDetails(): ");
    this.session.getColorCodeData().subscribe((data)=> {
      this.filterAndSideLinkData = data;
    });
    this.session.getTradeDetails().subscribe((data)=> {
            data.FEEDDATA.forEach(element => {
              if(element.feedType == 'CDS'){
              //AppFooterComponent.prototype.cdsDateTime = element.dateTime;
              }else if(element.feedType == 'FITEK'){
              //AppFooterComponent.prototype.fitekDateTime = element.dateTime;
              }//
            });
      console.timeEnd("Time taken by getTradeDetails(): ");
      debugger;
      console.time("Time taken by tradeDataMani(): ");
      

      this.futureFailData=data.TRADEDATA;
      //ReportsComponent.prototype.downloadData=data.TRADEDATA;
      
      let settlementLocationArr = new Set(data.TRADEDATA.map(item => item.DASHBOARD_LOCATION)); 
      let TradeStatusArr = new Set(data.TRADEDATA.map(item => item.DASHBOARD_STATUS)); 
      let TradeTypeArr = new Set(data.TRADEDATA.map(item => item.DASHBOARD_TRADE_TYPE)); 
      let RiskTypeArr = new Set(data.TRADEDATA.map(item => item.DASHBOARD_)); 
      let AgingArr = new Set(data.TRADEDATA.map(item => item.DASHBOARD_LOCATION)); 
      
      // this.filterAndSideLinkData = {
      //   settlementLocation: [{ name: 'Clear Stream', checked: true, color: '#55a975' }, { name: 'DTC', checked: true, color: '#3350aa' }, { name: 'FED', checked: true, color: '#d5b168' }, { name: 'Global', checked: true, color: '#3c8dbc' }, { name: 'MF-OFF', checked: true, color: '#bb3ca0' }, { name: 'MF-DOM', checked: true, color: '#adbb3c' }],
      //   TradeStatus: [{ name: 'Failed', checked: true, color: '#e60e0e' }, { name: 'Pending', checked: true, color: '#ffc200' }, { name: 'Incomplete', checked: true, color: '#FFFF00' }],
      //   TradeType: [{ name: 'Sell', checked: true, color: '#c012de' }, { name: 'BUY', checked: true, color: '#20c4c5' }, { name: 'Receive Free', checked: true, color: '#4484f1' }, { name: 'Deliver Free', checked: true, color: '#85f144' }],
      //   RiskType: [{ name: 'Low', value: '0,1,2', checked: true, color:'green' }, { name: 'Med', value: '3,4', checked: true, color:'#FFCC00' }, { name: 'High', value: '5', checked: true, color:'red' }],
      //   Aging: [{ name: '0-3 Days', color: '#fd9a9a' }, { name: '4-7 Days', color: '#ff5d5d' }, { name: '>7 Days', color: '#FF0000' }]
      // };
     
      this.masterData = this.tradeDataMani(data.TRADEDATA);
      console.timeEnd("Time taken by tradeDataMani(): ");
      this.tradeInfo = this.masterData;
      this.dtTriggerTradeDetail.next();
      this.rerender();
      console.time("Time taken by DrawChart(): ");
      //this.DrawChart(this.tradeInfo);
      console.timeEnd("Time taken by DrawChart(): ");
        this.isLoader = false;
        console.timeEnd("Time taken by Full UI(): ");
          
            }, (err)=>{
              console.log(err);
          });
  }


  public updateComment(value:any,flag:boolean, ...rec: any[]) {
      debugger;
      
      let key;
      key=this.popUpCommentData[0].SURROGATE_KEY;
      //alert(key);
      if(flag == true){
        value = (document.getElementById('txtNot') as HTMLTextAreaElement).value;
      }
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
              this.tradeInfo.forEach(element => {
                  if(element == this.popUpCommentData[0]){  
                    element.COMMENTS = value;
                  }
            });
            this.dtElements.forEach((dtElement: DataTableDirective) => {
                    dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                              if (dtElement.dtOptions.pageLength == 20) {
                                  dtInstance.clear().draw();
                                  dtInstance.rows.add(this.tradeInfo).draw();
                              }});
                  });this.dtElements.forEach((dtElement: DataTableDirective) => {
                    dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                              if (dtElement.dtOptions.pageLength == 20) {
                                  dtInstance.clear().draw();
                                  dtInstance.rows.add(this.tradeInfo).draw();
                              }});
                  });
          }else if(data.RESPONSECODE == -2){
            msg = data.RESPONSEMSG;
            console.log(msg);
            alert(msg);
          }
              }, (err)=>{
                console.log(err);
            });  

      }




  public loadPopupData(...rec: any[]) {
        console.time("Time taken by loadPopupData(): ");  
        
        this.dynColumn = [];
        this.rowKeys = [];
        this.rowData = [];
        this.xlsData = [];
        this.surroKeysData = [];
    
       // this.session.getTradeDetails().subscribe((result) => { 
         // commented by Raj on 12/30/2017 for remove extra serve call
    
          //this.tradePop = this.masterData;
          this.tradePop = this.tradeInfo;
          console.log(this.tradeInfo);
          this.tradePop = this.tradePop.filter(obj =>
            obj.DASHBOARD_LOCATION == rec[0].DASHBOARD_LOCATION
            &&
            obj.DASHBOARD_STATUS == rec[0].DASHBOARD_STATUS
            &&
            obj.DASHBOARD_TRADE_TYPE == rec[0].DASHBOARD_TRADE_TYPE
          );


    
          if (rec[0].DASHBOARD_LOCATION == 'Global') {
    
            if (rec[0].DASHBOARD_STATUS == 'Failed') {
              this.dynColumn = [
                "RQ Rating",
                "Age",
                "Account Number",
                "Txn Type",
                "Trade Date",
                "CSD",
                "Quantity",
                "CCY",
                "Settlement Amount",
                "ISIN",
                "Citi Reference",
                "Fail Description"
              ];
              this.rowKeys = ['RQ Rating','Ageing','Account Number', 'Txn Type', 'Trade Date', 'CSD', 'Quantity', 'CCY', 'Settlement Amount', 'ISIN',
              'Citi Reference', 'Fail Description'];
              this.rowData = this.tradePop.map(o => {
                return {
                  ACCOUNT_NUMBER: o.ACCOUNT_NUMBER,
                  CDS_TXN_TYPE: o.CDS_TXN_TYPE,
                  TRADE_DATE: o.TRADE_DATE,
                  TRADE_SETTLE_DATE: o.TRADE_SETTLE_DATE,
                  CDS_QUANTITY: o.CDS_QUANTITY,
                  CDS_CCY: o.CDS_CCY,
                  CDS_SETTLEMENT_AMOUNT: o.CDS_SETTLEMENT_AMOUNT,
                  CDS_ISIN: o.CDS_ISIN,
                  CDS_CITI_REF_NO: o.CDS_CITI_REF_NO,
                  CDS_FAILED_DESCRIPTION: o.CDS_FAILED_DESCRIPTION
                };
              });
    
              this.xlsData = this.tradePop.map(o => {
                return {
                  'RQ Rating':o.RQ_RATING,
                  'Ageing' :o.AGEING,
                  'Account ID': o.CDS_ACCOUNT_ID, 
                  "Account Number": o.ACCOUNT_NUMBER, 								
                  'Investment Officer': o.BACKUP_INVESTMENT_OFFICER,
                  'Administrator': o.ADMINISTRATOR,
                  'Line Of Business': o.LINE_OF_BUSINESS,
                  'Trade Date': o.TRADE_DATE,
                  'CSD': o.TRADE_SETTLE_DATE,
                  'Txn Type': o.CDS_TXN_TYPE,
                  'Quantity': o.QUANTITY,
                  'ISIN': o.ISIN,
                  'Issue Name': o.CDS_ISSUE_NAME,
                  'CCY': o.CDS_CCY,
                  'Settlement Amount': o.CDS_SETTLEMENT_AMOUNT,
                  'Client Reference': o.CDS_CLIENT_REF_NO,
                  'Citi Reference': o.CDS_CITI_REF_NO,
                  'Settlement Location': o.SETTLEMENT_LOCATION,
                  'Counterparty': o.CDS_COUNTERPARTY,
                  'Fail Description': o.CDS_FAILED_DESCRIPTION,
                  'Comments': o.COMMENTS,
                  'Fail Text': o.FAILED_REASON,
                  'Fail Text(Contd.)': o.FAILTEXT_CONTD
                };
              });
              this.surroKeysData = this.tradePop.map(o => {  
                return {
                  SURROGATE_KEY : o.SURROGATE_KEY,
                  DASHBOARD_STATUS : o.DASHBOARD_STATUS
                };
              });
    
            } else if (rec[0].DASHBOARD_STATUS == 'Pending') {
              this.dynColumn = [
                "RQ Rating",
                "Age",
                "Account Number",
                "Account Name",
                "Trade Type",
                "Trade ID",
                "ISIN",
                "Trade Date",
                "Contractual Settlement Date",
                "Trade Status",
                "Shares",
                "Net + AI Amount"
              ];
              this.rowKeys = ['RQ Rating','Ageing','Account Number', 'ACCOUNT_SHORT_NAME', 
              'Trade Type', 'TRADEID', 'ISIN', 'Trade Date', 'Contractual Settlement Date','Trade Status', 'Shares', 'Net + AI Amount'];
              this.rowData = this.tradePop.map(o => {
                return {
                  ACCOUNT_NUMBER: o.ACCOUNT_NUMBER,
                  ACCOUNT_SHORT_NAME: o.ACCOUNT_SHORT_NAME,
                  DASHBOARD_TRADE_TYPE: o.DASHBOARD_TRADE_TYPE,
                  TRADE_ID: o.TRADE_ID,
                  ISIN: o.ISIN,
                  TRADE_DATE: o.TRADE_DATE,
                  TRADE_SETTLE_DATE: o.TRADE_SETTLE_DATE,
                  DASHBOARD_STATUS: o.DASHBOARD_STATUS,
                  SHARES: this.parsevalue(o.SHARES),
                  NET_PLUS_AI_AMOUNT: parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                };
              });
              this.xlsData = this.tradePop.map(o => {
                return {
                  'RQ Rating':o.RQ_RATING,
				          'Ageing' :o.AGEING,
                  'TRADEID': o.TRADE_ID,
                  'SWIFT SEME': o.SWIFT_SEME,
                  'Trade Date': o.TRADE_DATE,
                  'Contractual Settlement Date': o.TRADE_SETTLE_DATE,
                  'Trade Status': o.STATUS_MESSAGE,
                  'Trade Type': o.TRADE_TYPE,
                  'Account Number': o.ACCOUNT_NUMBER,
                  'ACCOUNT_SHORT_NAME': o.ACCOUNT_SHORT_NAME,
                  'ISIN': o.ISIN,
                  'CUSIP': o.CUSIP,
                  'Shares': this.parsevalue(o.SHARES),
                  'Principal Amount': o.PRINCIPAL,
                  'Net + AI Amount': parseFloat(o.NET_PLUS_AI_AMOUNT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  'Settlement Currency': o.SETTLEMENT_CURRENCY,
                  'Price': o.PRICE,
                  'Settlement Location': o.SETTLEMENT_LOCATION,
                  'Clearing Broker': o.CLEARING_BROKER,
                  'Executing Broker': o.EXECUTING_BROKER,
                  'Registration': o.REGISTRATION,
                  'Location': o.LOCATION,
                  'Account Administrator': o.ADMINISTRATOR,
                  'Backup Investment Officer': o.BACKUP_INVESTMENT_OFFICER,
                  'Line of Business': o.LINE_OF_BUSINESS,
                  'Last Modified User': o.LAST_MODIFIED_USER,
                  'CREATED BY': o.CREATED_BY,
                  'Processing Date': o.PROCESSING_DATE,
                  'Hold Date Open': o.HOLD_DATE_OPEN,
                  'Hold Date': o.HOLD_DATE
   
                };
              });
              this.surroKeysData = this.tradePop.map(o => {  
                return {
                  SURROGATE_KEY : o.SURROGATE_KEY,
                  DASHBOARD_STATUS : o.DASHBOARD_STATUS
                };
              });
            } else if (rec[0].DASHBOARD_STATUS == 'Incomplete') {
              this.dynColumn = [
                "RQ Rating",
                "Age",
                "SEME Ref #",
                "Status",
                "Trade Type",
                "ISIN",
                "T/D",
                "S/D",
                "Settlement Location",
                "DTC Eligible",
                "Account Number",
                "Message Type"
              ];
    
              this.rowKeys = ['RQ Rating','Ageing','SWIFT Ref #', 'Custodian Trade Status', 
              'Trade Type', 'ISIN', 'Trade Date', 'Settle Date',
                      'Settlement Location', 'DTC_ELIGIBLE', 'Account Number', 'Message Type'];
              this.rowData = this.tradePop.map(o => {
                return {
                  SWIFT_REF_NO: o.SWIFT_REF_NO,
                  DASHBOARD_STATUS: o.DASHBOARD_STATUS,
                  DASHBOARD_TRADE_TYPE: o.DASHBOARD_TRADE_TYPE,
                  ISIN: o.ISIN,
                  TRADE_DATE: o.TRADE_DATE,
                  TRADE_SETTLE_DATE: o.TRADE_SETTLE_DATE,
                  DASHBOARD_LOCATION: o.DASHBOARD_LOCATION,
                  DTC_ELIGIBLE: o.DTC_ELIGIBLE,
                  ACCOUNT_NUMBER: o.ACCOUNT_NUMBER,
                  MESSAGE_TYPE: o.MESSAGE_TYPE
                };
              });
              this.xlsData = this.tradePop.map(o => {
                return {
                  'RQ Rating':o.RQ_RATING,
                  'Ageing' :o.AGEING,
                  'Accrued Interest Amount': o.ACCURED_INTEREST_AMT,
                  'Account Administrator': o.ADMINISTRATOR,
                  'Account Number': o.ACCOUNT_NUMBER,
                  'Backup Investment Officer': o.BACKUP_INVESTMENT_OFFICER,
                  'Broker Amount': o.BROKER_AMOUNT,
                  'Clearing Broker': o.CLEARING_BROKER,
                  'Created By': o.CREATED_BY,
                  'Settlement Location': o.DASHBOARD_LOCATION,
                  'Custodian Trade Status': o.DASHBOARD_STATUS,
                  'Trade Type': o.DASHBOARD_TRADE_TYPE,
                  'Executing Broker': o.EXECUTING_BROKER,
                  'ISIN': o.ISIN,
                  'Line of Business': o.LINE_OF_BUSINESS,
                  'Net Trade Amount': parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  'Price': o.PRICE,
                  'Principal Amount': o.PRINCIPAL,
                  'Trade #': o.TRADE_ID,
                  'Trade Date':o.TRADE_DATE,
                  'Original Face': o.ORIGINAL_FACE,
                  'Shares': this.parsevalue(o.SHARES),
                  'SOFT_VALIDATION_MESSAGES': o.SOFT_VALIDATION_MESSAGES,
                  'Stamp Duty': o.STAMP_DUTY,
                  'Stamp Duty Code': o.STAMP_DUTY_CODE,
                  '548 Reason': o.REASON_548,
                  'Receiver': o.RECEIVER,
                  'Receiver BIC': o.RECEIVER_BIC,
                  'Sedol': o.SEDOL,
                  'Sender': o.SENDER,
                  'Sender BIC': o.SENDER_BIC,
                  '548 Status': o.STATUS_548,
                  'Settle Date':o.TRADE_SETTLE_DATE,
                  'Executing Broker Account Number': o.EXECUTING_BROKER_ACCT_NUMBER,
                  'HARD_VALIDATION_MESSAGES': o.HARD_VALIDATION_MESSAGES,
                  'Message Type': o.MESSAGE_TYPE,
                  'Custody Account': o.CUSTODY_ACCOUNT,
                  'Clearing Broker Account Number': o.CLEARING_BROKER_ACCOUNT_NUMBER,
                  'SWIFT Ref #': o.SWIFT_REF_NO
   
                };
              });
              this.surroKeysData = this.tradePop.map(o => {  
                return {
                  SURROGATE_KEY : o.SURROGATE_KEY,
                  DASHBOARD_STATUS : o.DASHBOARD_STATUS
                };
              });
            }
    
    
          } else if (rec[0].DASHBOARD_LOCATION == 'MF-OFF' || rec[0].DASHBOARD_LOCATION == 'MF-DOM') {
    
            this.dynColumn =
              [
                "RQ Rating",
                "Age",
                "Trade Status",
                "Trade Type",
                "Trade Date",
                "Contractual Settlement Date",
                "CUSIP",
                "Account Number",
                "Shares",
                "Price",
                "Principal Amount",
                "Registration",
                "Location"
              ];
              this.rowKeys = ['RQ Rating','Ageing','Trade Status', 'Trade Type', 'Trade Date', 
              'Contractual Settlement Date', 'CUSIP', 'Account Number',
                    'Shares', 'Price', 'Principal Amount', 'Registration', 'Location'];
              this.rowData = this.tradePop.map(o => {
              return {
                DASHBOARD_STATUS: o.DASHBOARD_STATUS,
                DASHBOARD_TRADE_TYPE: o.DASHBOARD_TRADE_TYPE,
                TRADE_DATE: o.TRADE_DATE,
                TRADE_SETTLE_DATE: o.TRADE_SETTLE_DATE,
                CUSIP: o.CUSIP,
                ACCOUNT_NUMBER: o.ACCOUNT_NUMBER,
                SHARES: this.parsevalue(o.SHARES),
                PRICE: o.PRICE,
                PRINCIPAL: o.PRINCIPAL,
                REGISTRATION: o.REGISTRATION,
                LOCATION: o.LOCATION
              };
            });
            this.xlsData = this.tradePop.map(o => {
              return {
                'RQ Rating':o.RQ_RATING,
                'Ageing' :o.AGEING,
                'Trade Id': o.TRADE_ID,
                'Account Number': o.ACCOUNT_NUMBER,
                'Account Name': o.ACCOUNT_SHORT_NAME,
                'Trade Date': o.TRADE_DATE,
                'Contractual Settlement Date': o.TRADE_SETTLE_DATE,
                'CUSIP': o.CUSIP,
                'ISIN': o.ISIN,
                'Asset Short Name': o.ASSET_SHORT_NAME,
                'Trade Type': o.TRADE_TYPE,
                'Original Amount': o.ORIGINAL_AMOUNT,
                'Shares': this.parsevalue(o.SHARES),
                'Net Trade Amount': o.NET_PLUS_AI_AMOUNT,
                'Price': o.PRICE,
                'Principal Amount': o.PRINCIPAL,
                'Trade Status': o.DASHBOARD_STATUS,
                'Registration': o.REGISTRATION,
                'Location': o.LOCATION,
                'Settlement Location': o.SETTLEMENT_LOCATION,
                'Settlement Currency': o.SETTLEMENT_CURRENCY,
                'Explanation': o.EXPLANATION,
                'Hold Date': o.HOLD_DATE,
                'Hold Date Open': o.HOLD_DATE_OPEN,
                'Processing Date': o.PROCESSING_DATE,
                'Reversed?': o.REVERSED,
                'Accrued Interest Amount': o.ACCURED_INTEREST_AMT,
                'Net + AI Amount': parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                'Block Indicator': o.BLOCK_INDICATOR,
                'Clearing Broker': o.CLEARING_BROKER,
                'Executing Broker': o.EXECUTING_BROKER,
                'Account Administrator': o.ADMINISTRATOR,
                'Backup Investment Officer': o.BACKUP_INVESTMENT_OFFICER,
                'Broker Amount': o.BROKER_AMOUNT,
                'Confirm File Date': o.CONFIRM_FILE_DATE,
                'Confirm Trade Id': o.CONFIRM_TRADE_ID,
                'Create User': o.CREATED_BY,
                'Last Modified Date': o.LAST_MODIFIED_DATE,
                'Last Modified User': o.LAST_MODIFIED_USER,
                'Maturity Date': o.MATURITY_DATE,
                'Optional Fee 1 Amount': o.OPTIONAL_FEE_1_AMOUNT,
                'Optional Fee 2 Amount': o.OPTIONAL_FEE_2_AMOUNT,
                'SEC Fee Amount': o.SEC_FEE,
                'Corporate Action Event Type': o.CORPORATE_ACTION_EVENT_TYPE,
                'Line of Business': o.LINE_OF_BUSINESS,
                'Comments': o.COMMENTS,
                'Comments logged by SOEID': o.COMMENTS_LOGGED_BY_SOEID
                      
              };
            });
            this.surroKeysData = this.tradePop.map(o => {  
              return {
                SURROGATE_KEY : o.SURROGATE_KEY,
                DASHBOARD_STATUS : o.DASHBOARD_STATUS
              };
            });
    
          } else if (rec[0].DASHBOARD_STATUS == 'Failed') {
            this.dynColumn =
              [
                "RQ Rating",
                "Age",
                "Account Number",
                "Trade Date",
                "Contractual Settlement Date",
                "CUSIP/ISIN",
                "Trade Type",
                "Shares",
                "Net Trade Amount",
                "Accrued Interest Amount",
                "Net + AI Amonunt",
                "Executing Broker"
              ];
    
            this.rowKeys = ['RQ Rating','Ageing','Account Number', 'Trade Date', 'Contractual Settlement Date', 'ISIN', 'Trade Type', 'Shares', 'Net Trade Amount', 'Accrued Interest Amount', 'Net + AI Amount', 'Executing Broker'];
            this.rowData = this.tradePop.map(o => {
              return {
                ACCOUNT_NUMBER: o.ACCOUNT_NUMBER,
                TRADE_DATE: o.TRADE_DATE,
                TRADE_SETTLE_DATE: o.TRADE_SETTLE_DATE,
                ISIN: o.ISIN,
                DASHBOARD_TRADE_TYPE: o.DASHBOARD_TRADE_TYPE,
                SHARES: this.parsevalue(o.SHARES),
                NET_TRADE_AMOUNT: o.NET_TRADE_AMOUNT,
                ACCURED_INTEREST_AMT: o.ACCURED_INTEREST_AMT,
                NET_PLUS_AI_AMOUNT: parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                EXECUTING_BROKER: o.EXECUTING_BROKER
              };
            });
            this.xlsData = this.tradePop.map(o => {
              return {
                'RQ Rating':o.RQ_RATING,
                'Ageing' :o.AGEING,
                'Accrued Interest Amount': o.ACCURED_INTEREST_AMT,
                'Account Administrator': o.ADMINISTRATOR,
                'Account Number': o.ACCOUNT_NUMBER,
                'Backup Investment Officer': o.BACKUP_INVESTMENT_OFFICER,
                'Block Indicator': o.BLOCK_INDICATOR,
                'Broker Amount': o.BROKER_AMOUNT,
                'Clearing Broker': o.CLEARING_BROKER,
                'Confirm File Date': o.CONFIRM_FILE_DATE,
                'Confirm Trade Id': o.CONFIRM_TRADE_ID,
                'Corporate Action Event Type': o.CORPORATE_ACTION_EVENT_TYPE,
                'Created By': o.CREATED_BY,
                'Settlement Location': o.DASHBOARD_LOCATION,
                'Trade Status': o.DASHBOARD_STATUS,
                'Trade Type': o.DASHBOARD_TRADE_TYPE,
                'Executing Broker': o.EXECUTING_BROKER,
                'Explanation': o.EXPLANATION,
                'Hold Date': o.HOLD_DATE,
                'Hold Date Open': o.HOLD_DATE_OPEN,
                'ISIN': o.ISIN,
                'Last Modified Date': o.MODIFICATION_DATE,
                'Last Modified User': o.MODIFIED_BY,
                'Line of Business': o.LINE_OF_BUSINESS,
                'Location': o.LOCATION,
                'Maturity Date': o.MATURITY_DATE,
                'Net + AI Amount': parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                'Optional Fee 1 Amount': o.OPTIONAL_FEE_1_AMOUNT,
                'Optional Fee 2 Amount': o.OPTIONAL_FEE_2_AMOUNT,
                'Price': o.PRICE,
                'Principal Amount': o.PRINCIPAL,
                'Processing Date': o.PROCESSING_DATE,
                'Registration': o.REGISTRATION,
                'SEC Fee Amount': o.SEC_FEE,
                'Settlement Currency' : o.SETTLEMENT_CURRENCY,
                'Trade #': o.TRADE_ID,
                'Trade Date':o.TRADE_DATE,
                'CUSIP': o.CUSIP,
                'Asset Short Name': o.ASSET_SHORT_NAME,
                'Shares': this.parsevalue(o.SHARES),
                'Contractual Settlement Date': o.TRADE_SETTLE_DATE,
                'Reversed?': o.REVERSED,
                'Original Amount': o.ORIGINAL_AMOUNT,
                'Net Trade Amount' : o.NET_TRADE_AMOUNT
              };
            });
            this.surroKeysData = this.tradePop.map(o => {  
              return {
                SURROGATE_KEY : o.SURROGATE_KEY,
                DASHBOARD_STATUS : o.DASHBOARD_STATUS
              };
            });
          }
          else if (rec[0].DASHBOARD_STATUS == 'Incomplete' && rec[0].SOURCE == 'Swift') {
            this.tradePop = this.tradePop.filter(obj =>
              obj.SOURCE == rec[0].SOURCE
            );
            this.dynColumn =
              [
                "RQ Rating",
                "Age",
                "Swift Ref #",
                "Trade Type",
                "Account",
                "Trade Date",
                "Settle Date",
                "Clearng Broker Market Id",
                "ISIN",
                "Shares",
                "Net Trade Amount",
                "Settlement Location"
              ];
            this.rowKeys = ['RQ Rating','Ageing','SWIFT Ref #', 'Trade Type', 'Account Number', 'Trade Date', 'Contractual Settlement Date', 'Clearing Broker Market Id', 'ISIN', 'Shares', 'Net + AI Amount', 'Settlement Location'];
            this.rowData = this.tradePop.map(o => {
              return {
                SWIFT_REF_NO: o.SWIFT_REF_NO,
                DASHBOARD_TRADE_TYPE: o.DASHBOARD_TRADE_TYPE,
                ACCOUNT_NUMBER: o.ACCOUNT_NUMBER,
                TRADE_DATE: o.TRADE_DATE,
                TRADE_SETTLE_DATE: o.TRADE_SETTLE_DATE,
                CLEARING_BROKER_MARKET_ID: o.CLEARING_BROKER_MARKET_ID,
                ISIN: o.ISIN,
                SHARES: this.parsevalue(o.SHARES),
                NET_PLUS_AI_AMOUNT: parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                SETTLEMENT_LOCATION: o.SETTLEMENT_LOCATION
              };
            });
            this.xlsData = this.tradePop.map(o => {
              return {
                'RQ Rating':o.RQ_RATING,
                'Ageing' :o.AGEING,
                'Accrued Interest Amount': o.ACCURED_INTEREST_AMT,
                'Account Administrator': o.ADMINISTRATOR,
                'Account Number': o.ACCOUNT_NUMBER,
                'Broker Amount': o.BROKER_AMOUNT,
                'Clearing Broker': o.CLEARING_BROKER,
                'Created By': o.CREATED_BY,
                'Create Date': o.CREATE_DATE,
                'Settlement Location': o.DASHBOARD_LOCATION,
                'Trade Status': o.DASHBOARD_STATUS,
                'Trade Type': o.DASHBOARD_TRADE_TYPE,
                'Executing Broker': o.EXECUTING_BROKER,
                'ISIN': o.ISIN,
                'Last Modified Date': o.MODIFICATION_DATE,
                'Last Modified User': o.MODIFIED_BY,
                'Net + AI Amount': parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                'Price': o.PRICE,
                'Principal Amount': o.PRINCIPAL,
                'Settlement Currency': o.SETTLEMENT_CURRENCY,
                'Trade #': o.TRADE_ID,
                'Trade Date': o.TRADE_DATE,
                'CUSIP': o.CUSIP,
                'Affirm Type': o.AFFIRM_TYPE,
                'Asset Short Name': o.ASSET_SHORT_NAME,
                'Asset Type': o.ASSET_TYPE,
                'DTC Confirm #': o.DTC_CONFIRM,
                'DTC Eligible': o.DTC_ELIGIBLE,
                'Exchange': o.EXCHANGE,
                'Original Face': o.ORIGINAL_FACE,
                'Shares': this.parsevalue(o.SHARES),
                'SOFT_VALIDATION_MESSAGES': o.SOFT_VALIDATION_MESSAGES,
                'Stamp Duty': o.STAMP_DUTY,
                'Stamp Duty Code': o.STAMP_DUTY_CODE,
                '548 Reason': o.REASON_548,
                'Receiver': o.RECEIVER,
                'Receiver BIC': o.RECEIVER_BIC,
                'Sedol': o.SEDOL,
                'Sender': o.SENDER,
                'Sender BIC': o.SENDER_BIC,
                '548 Status': o.STATUS_548,
                'Ticker': o.TICKER,
                'Contractual Settlement Date': o.TRADE_SETTLE_DATE,
                'Executing Broker Account Number': o.EXECUTING_BROKER_ACCT_NUMBER,
                'Executing Broker Market Id': o.EXECUTING_BROKER_MARKET_ID,
                'Executing Broker Tag Type': o.EXECUTING_BROKER_TAG_TYPE,
                'FX Currency to Buy/Sell': o.FX_CURRENCY_TO_BUY_SELL,
                'HARD_VALIDATION_MESSAGES': o.HARD_VALIDATION_MESSAGES,
                'Input Date': o.INPUT_DATE,
                'Input/Output Indicator': o.INPUT_OUTPUT_INDICATOR,
                'Internal Confirm #': o.INTERNAL_CONFIRM_NO,
                'Message Type': o.MESSAGE_TYPE,
                'Custodian Trade Status': o.CUSTODIAN_TRADE_STATUS,
                'Custody Account': o.CUSTODY_ACCOUNT,
                'Block Pool #': o.BLOCK_POOL_NO,
                'Clearing Broker Account Number': o.CLEARING_BROKER_ACCOUNT_NUMBER,
                'Clearing Broker Market Id': o.CLEARING_BROKER_MARKET_ID,
                'Clearing Broker Tag Type': o.CLEARING_BROKER_TAG_TYPE,
                'SWIFT Ref #': o.SWIFT_REF_NO,
                'Source': o.SOURCE
              };
            });
            this.surroKeysData = this.tradePop.map(o => {  
              return {
                SURROGATE_KEY : o.SURROGATE_KEY,
                DASHBOARD_STATUS : o.DASHBOARD_STATUS
              };
            });
          }
          else if (rec[0].DASHBOARD_STATUS == 'Incomplete' && rec[0].SOURCE == 'Confirm') {
            this.tradePop = this.tradePop.filter(obj =>
              obj.SOURCE == rec[0].SOURCE
            );
    
            this.dynColumn =
              [
                "RQ Rating",
                "Age",
                "Internal Confirm",
                "Trade Type",
                "Interested Party 1",
                "Trade Date",
                "Settle Date",
                "CUSIP",
                "Shares",
                "Net + AI Amonunt",
                "Clrng Broker DTC Id",
                "Institution Id"
              ];
            this.rowKeys = ['RQ Rating','Ageing','Internal Confirm #', 'Trade Type', 'Interested Party 1', 'Trade Date', 'Contractual Settlement Date', 'CUSIP', 'Shares', 'Net + AI Amount', 'Clrng Broker DTC Id', 'Institution Id'];
            this.rowData = this.tradePop.map(o => {
              return {
                INTERNAL_CONFIRM_NO: o.INTERNAL_CONFIRM_NO,
                DASHBOARD_TRADE_TYPE: o.DASHBOARD_TRADE_TYPE,
                INTERESTED_PARTY_1: o.INTERESTED_PARTY_1,
                TRADE_DATE: o.TRADE_DATE,
                TRADE_SETTLE_DATE: o.TRADE_SETTLE_DATE,
                CUSIP: o.CUSIP,
                SHARES: this.parsevalue(o.SHARES),
                NET_PLUS_AI_AMOUNT: parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                CLRNG_BROKER_DTC_ID: o.CLRNG_BROKER_DTC_ID,
                INSTITUTION_ID: o.INSTITUTION_ID
              };
            });
            this.xlsData = this.tradePop.map(o => {
              return {
                'RQ Rating':o.RQ_RATING,
                'Ageing' :o.AGEING,
                'Accrued Interest Amount': o.ACCURED_INTEREST_AMT,
                'Account Administrator': o.ADMINISTRATOR,
                'Broker Amount': o.BROKER_AMOUNT,
                'Clearing Broker': o.CLEARING_BROKER,
                'Created By': o.CREATED_BY,
                'Create Date': o.CREATE_DATE,
                'Settlement Location': o.DASHBOARD_LOCATION,
                'Trade Status': o.DASHBOARD_STATUS,
                'Trade Type': o.DASHBOARD_TRADE_TYPE,
                'Executing Broker': o.EXECUTING_BROKER,
                'Last Modified Date': o.MODIFICATION_DATE,
                'Last Modified User': o.MODIFIED_BY,
                'Net + AI Amount': parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                'Price': o.PRICE,
                'Principal Amount': o.PRINCIPAL,
                'SWIFT SEME': o.SWIFT_SEME,
                'Trade #': o.TRADE_ID,
                'Trade Date': o.TRADE_DATE,
                'CUSIP': o.CUSIP,
                'Affirm Date': o.AFFIRM_DATE,
                'Affirm Type': o.AFFIRM_TYPE,
                'Affirmed By': o.AFFIRMED_BY,
                'Agent FINS': o.AGENT_FINS,
                'Asset Short Name': o.ASSET_SHORT_NAME,
                'Asset Type': o.ASSET_TYPE,
                'Interested Party 1': o.INTERESTED_PARTY_1,
                'Interested Party 2': o.INTERESTED_PARTY_2,
                'Institution Id': o.INSTITUTION_ID,
                'Institution Name': o.INSTITUTION_NAME,
                'DTC Confirm #': o.DTC_CONFIRM,
                'DTC Eligible': o.DTC_ELIGIBLE,
                'Exchange': o.EXCHANGE,
                'Optional Fee': o.OPTIONAL_FEE,
                'Original Face': o.ORIGINAL_FACE,
                'P I Amount': o.PI_AMOUNT,
                'Shares': this.parsevalue(o.SHARES),
                'SOFT_VALIDATION_MESSAGES': o.SOFT_VALIDATION_MESSAGES,
                'Contractual Settlement Date': o.TRADE_SETTLE_DATE,
                'HARD_VALIDATION_MESSAGES': o.HARD_VALIDATION_MESSAGES,
                'Internal Confirm #': o.INTERNAL_CONFIRM_NO,
                'Net Trade Amount': o.NET_TRADE_AMOUNT,
                'Custodian Trade Status': o.CUSTODIAN_TRADE_STATUS,
                'Custody Account': o.CUSTODY_ACCOUNT,
                'Clrng Broker DTC Id': o.CLRNG_BROKER_DTC_ID,
                'Exec Broker DTC Id': o.EXEC_BROKER_DTC_ID,
                'Federal Tax Cost Amount': o.FEDERAL_TAX_COST_AMOUNT,
                'File Timestamp': o.FILE_TIMESTAMP,
                'State Tax Cost Amount': o.STATE_TAX_COST_AMOUNT,
                'Special Instruction': o.SPECIAL_INSTRUCTION,
                'Broker Account': o.BROKER_ACCOUNT,
                'Trade Instruction': o.TRADE_INSTRUCTION,
                'Source': o.SOURCE
              };
            });
            this.surroKeysData = this.tradePop.map(o => {  
              return {
                SURROGATE_KEY : o.SURROGATE_KEY,
                DASHBOARD_STATUS : o.DASHBOARD_STATUS
              };
            });
    
          }
    
          this.datatableComponent.setup(this.dynColumn,this.xlsData,this.rowKeys,this.countDT,this.surroKeysData,this.addComment,this.addCommentAppConfig,this.sendEmailAppConfig,this.showDetailsAppConfig);
          
          this.countDT++;
        //}); commented by Raj on 12/30/2017 for remove extra serve call
        console.timeEnd("Time taken by loadPopupData(): ");
      }
      
      public hideDatatablePopOver(){
        this.datatableComponent.hideCommentPopUp();
        this.datatableComponent.hideEmailPopUp();
      }

  //Sameer
  public loadPopupDetailsData(e,flag:boolean,...rec: any[]) {
    this.rowDetailKeys = [];
    this.xlsDetailData = [];
    this.tradeDetails =  [];
    this.tradeDetails = rec;
    
    if(flag==true){
      e.stopPropagation();
    }
    //(document.getElementById('txtNot') as HTMLTextAreaElement).value="";
    this.popUpCommentData=[];
    this.popUpCommentData=rec;
  
    //console.log('samm'); 
      // console.log(rec);
       if( rec[0].DASHBOARD_STATUS =='Failed'){
         this.isReadOnly=false; 
       }else{
        this.isReadOnly=true; 
       }
   
    if( rec[0].DASHBOARD_LOCATION =='Global'){
      
             if(rec[0].DASHBOARD_STATUS=='Failed'){
      
               this.rowDetailKeys=['Account Administrator','Account Number','Backup Investment Officer','Line of Business','Txn Type','Account ID','Trade Date','CSD','Quantity','CCY','Settlement Amount','ISIN','Citi Reference','Client Reference','Fail Description','Issue Name','Counterparty'];
      
               this.xlsDetailData= this.tradeDetails.map(o => {
                 return {
                     'Account Administrator': o.ADMINISTRATOR,
                     'Account Number': o.ACCOUNT_NUMBER,
                     'Backup Investment Officer': o.BACKUP_INVESTMENT_OFFICER,
                     'Line of Business': o.LINE_OF_BUSINESS,
                     'Txn Type': o.CDS_TXN_TYPE,
                     'Account ID': o.CDS_ACCOUNT_ID,
                     'Trade Date':o.TRADE_DATE,
                     'CSD':o.TRADE_SETTLE_DATE,
                     'Quantity':o.CDS_QUANTITY,
                     'CCY':o.CDS_CCY,
                     'Settlement Amount':o.CDS_SETTLEMENT_AMOUNT,
                     'ISIN':o.CDS_ISIN,
                     'Citi Reference':o.CDS_CITI_REF_NO,
                     'Client Reference':o.CDS_CITI_REF_NO,
                     'Fail Description':o.CDS_FAILED_DESCRIPTION,
                     'Issue Name':o.CDS_ISSUE_NAME,
                     'Counterparty':o.CDS_COUNTERPARTY
      
                   };
                 });
      
             }else if(rec[0].DASHBOARD_STATUS == 'Pending'){
      
               this.rowDetailKeys=['Account Administrator','Account Number','Backup Investment Officer','Clearing Broker','Created By','Settlement Location','Trade Status','Trade Type','Executing Broker','ISIN','Line of Business','Net + AI Amount','Settlement Currency','SWIFT SEME','Trade #','Trade Date','Shares','Contractual Settlement Date','Net Trade Amount'];
      
               this.xlsDetailData= this.tradeDetails.map(o => {
                 return {
                     'Account Administrator': o.ADMINISTRATOR,
                     'Account Number': o.ACCOUNT_NUMBER,
                     'Backup Investment Officer': o.BACKUP_INVESTMENT_OFFICER,
                     'Clearing Broker': o.CLEARING_BROKER,
                     'Created By': o.CREATED_BY,
                     'Settlement Location': o.DASHBOARD_LOCATION,
                     'Trade Status': o.DASHBOARD_STATUS,
                     'Trade Type': o.DASHBOARD_TRADE_TYPE,
                     'Executing Broker': o.EXECUTING_BROKER,
                     'ISIN': o.ISIN,
                     'Line of Business': o.LINE_OF_BUSINESS,
                     'Net + AI Amount': parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                     'Settlement Currency': o.SETTLEMENT_CURRENCY,
                     'SWIFT SEME': o.SWIFT_SEME,
                     'Trade #': o.TRADE_ID,
                     'Trade Date':o.TRADE_DATE,
                     'Shares': this.parsevalue(o.SHARES),
                     'Contractual Settlement Date':o.TRADE_SETTLE_DATE,
                     'Net Trade Amount': o.NET_TRADE_AMOUNT,
                   };
                 });
            }else if(rec[0].DASHBOARD_STATUS=='Incomplete'){
      
               this.rowDetailKeys=['Accrued Interest Amount','Account Administrator','Account Number','Backup Investment Officer','Broker Amount','Clearing Broker',
          'Created By','Settlement Location','Custodian Trade Status','Trade Type','Executing Broker','ISIN','Line of Business','Net Trade Amount',
          'Price','Principal Amount','Trade #','Trade Date','Original Face','Shares','SOFT VALIDATION MESSAGES','Stamp Duty','Stamp Duty Code','548 Reason',
          'Receiver','Receiver BIC','Sedol','Sender','Sender BIC','548 Status','Settle Date','Executing Broker Account Number','HARD VALIDATION MESSAGES',
          'Message Type','Custody Account','Clearing Broker Account Number','SWIFT Ref #'];
      
               this.xlsDetailData= this.tradeDetails.map(o => {
                 return {
                     'Accrued Interest Amount': o.ACCURED_INTEREST_AMT,
                     'Account Administrator': o.ADMINISTRATOR,
                     'Account Number': o.ACCOUNT_NUMBER,
                     'Backup Investment Officer': o.BACKUP_INVESTMENT_OFFICER,
                     'Broker Amount': o.BROKER_AMOUNT,
                     'Clearing Broker': o.CLEARING_BROKER,
                     'Created By': o.CREATED_BY,
                     'Settlement Location': o.DASHBOARD_LOCATION,
                     'Custodian Trade Status': o.DASHBOARD_STATUS,
                     'Trade Type': o.DASHBOARD_TRADE_TYPE,
                     'Executing Broker': o.EXECUTING_BROKER,
                     'ISIN': o.ISIN,
                     'Line of Business': o.LINE_OF_BUSINESS,
                     'Net Trade Amount': parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                     'Price': o.PRICE,
                     'Principal Amount': o.PRINCIPAL,
                     'Trade #': o.TRADE_ID,
                     'Trade Date':o.TRADE_DATE,
                     'Original Face': o.ORIGINAL_FACE,
                     'Shares': this.parsevalue(o.SHARES),
                     'SOFT VALIDATION MESSAGES': o.SOFT_VALIDATION_MESSAGES,
                     'Stamp Duty': o.STAMP_DUTY,
                     'Stamp Duty Code': o.STAMP_DUTY_CODE,
                     '548 Reason': o.REASON_548,
                     'Receiver': o.RECEIVER,
                     'Receiver BIC': o.RECEIVER_BIC,
                     'Sedol': o.SEDOL,
                     'Sender': o.SENDER,
                     'Sender BIC': o.SENDER_BIC,
                     '548 Status': o.STATUS_548,
                     'Settle Date':o.TRADE_SETTLE_DATE,
                     'Executing Broker Account Number': o.EXECUTING_BROKER_ACCT_NUMBER,
                     'HARD VALIDATION MESSAGES': o.HARD_VALIDATION_MESSAGES,
                     'Message Type': o.MESSAGE_TYPE,
                     'Custody Account': o.CUSTODY_ACCOUNT,
                     'Clearing Broker Account Number':o.CLEARING_BROKER_ACCOUNT_NUMBER,
                     'SWIFT Ref #': o.SWIFT_REF_NO
                   };
                 });
             }
      
      
           }else if(rec[0].DASHBOARD_LOCATION =='MF-OFF' || rec[0].DASHBOARD_LOCATION =='MF-DOM'){
      
            this.rowDetailKeys=['Accrued Interest Amount','Account Administrator','Account Number','Backup Investment Officer','Block Indicator','Broker Amount',
            'Clearing Broker','Confirm File Date','Confirm Trade Id','Corporate Action Event Type','Create User','Settlement Location','Trade Status',
            'Trade Type','Executing Broker','Explanation','Hold Date','Hold Date Open','ISIN','Last Modified Date','Last Modified User','Line of Business',
            'Location','Maturity Date','Net + AI Amount','Optional Fee 1 Amount','Optional Fee 2 Amount','Price','Principal Amount','Processing Date','Registration',
            'SEC Fee Amount','Settlement Currency','Trade Date','CUSIP','Asset Short Name','Shares','Contractual Settlement Date','Reversed?',
            'Original Amount','Net Trade Amount'];
        
               this.xlsDetailData= this.tradeDetails.map(o => {
                 return {
                     'Accrued Interest Amount': o.ACCURED_INTEREST_AMT,
                     'Account Administrator': o.ADMINISTRATOR,
                     'Account Number': o.ACCOUNT_NUMBER,
                     'Backup Investment Officer': o.BACKUP_INVESTMENT_OFFICER,
                     'Block Indicator': o.BLOCK_INDICATOR,
                     'Broker Amount': o.BROKER_AMOUNT,
                     'Clearing Broker': o.CLEARING_BROKER,
                     'Confirm File Date': o.CONFIRM_FILE_DATE,
                     'Confirm Trade Id': o.CONFIRM_TRADE_ID,
                     'Corporate Action Event Type' : o.CORPORATE_ACTION_EVENT_TYPE,
                     'Create User': o.CREATED_BY,
                     'Settlement Location': o.DASHBOARD_LOCATION,
                     'Trade Status': o.DASHBOARD_STATUS,
                     'Trade Type': o.DASHBOARD_TRADE_TYPE,
                     'Executing Broker': o.EXECUTING_BROKER,
                     'Explanation': o.EXPLANATION,
                     'Hold Date': o.HOLD_DATE,
                     'Hold Date Open': o.HOLD_DATE_OPEN,
                     'ISIN': o.ISIN,
                     'Last Modified Date': o.MODIFICATION_DATE,
                     'Last Modified User': o.MODIFIED_BY,
                     'Line of Business': o.LINE_OF_BUSINESS,
                     'Location': o.LOCATION,
                     'Maturity Date': o.MATURITY_DATE,
                     'Net + AI Amount': parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                     'Optional Fee 1 Amount': o.OPTIONAL_FEE_1_AMOUNT,
                     'Optional Fee 2 Amount': o.OPTIONAL_FEE_2_AMOUNT,
                     'Price': o.PRICE,
                     'Principal Amount': o.PRINCIPAL,
                     'Processing Date': o.PROCESSING_DATE,
                     'Registration': o.REGISTRATION,
                     'SEC Fee Amount': o.SEC_FEE,
                     'Settlement Currency' : o.SETTLEMENT_CURRENCY,
                     'Trade Date':o.TRADE_DATE,
                     'CUSIP': o.CUSIP,
                     'Asset Short Name': o.ASSET_SHORT_NAME,
                     'Shares': this.parsevalue(o.SHARES),
                     'Contractual Settlement Date': o.TRADE_SETTLE_DATE,
                     'Reversed?': o.REVERSED,
                     'Original Amount': o.ORIGINAL_AMOUNT,
                     'Net Trade Amount' : o.NET_TRADE_AMOUNT
                   };
                 });
        
           
           
    } else if(rec[0].DASHBOARD_STATUS=='Failed'){
      
     
      this.rowDetailKeys=['Accrued Interest Amount','Account Administrator','Account Number','Backup Investment Officer','Block Indicator','Broker Amount',
      'Clearing Broker','Confirm File Date','Confirm Trade Id','Corporate Action Event Type','Created By','Settlement Location','Trade Status',
      'Trade Type','Executing Broker','Explanation','Hold Date','Hold Date Open','ISIN','Last Modified Date','Last Modified User','Line of Business',
      'Location','Maturity Date','Net + AI Amount','Optional Fee 1 Amount','Optional Fee 2 Amount','Price','Principal Amount','Processing Date','Registration',
      'SEC Fee Amount','Settlement Currency','Trade #','Trade Date','CUSIP','Asset Short Name','Shares','Contractual Settlement Date','Reversed?',
      'Original Amount','Net Trade Amount'];
      
      this.xlsDetailData= this.tradeDetails.map(o => {
        return { 
          'Accrued Interest Amount': o.ACCURED_INTEREST_AMT,
          'Account Administrator': o.ADMINISTRATOR,
          'Account Number': o.ACCOUNT_NUMBER,
          'Backup Investment Officer': o.BACKUP_INVESTMENT_OFFICER,
          'Block Indicator': o.BLOCK_INDICATOR,
          'Broker Amount': o.BROKER_AMOUNT,
          'Clearing Broker': o.CLEARING_BROKER,
          'Confirm File Date': o.CONFIRM_FILE_DATE,
          'Confirm Trade Id': o.CONFIRM_TRADE_ID,
          'Corporate Action Event Type': o.CORPORATE_ACTION_EVENT_TYPE,
          'Created By': o.CREATED_BY,
          'Settlement Location': o.DASHBOARD_LOCATION,
          'Trade Status': o.DASHBOARD_STATUS,
          'Trade Type': o.DASHBOARD_TRADE_TYPE,
          'Executing Broker': o.EXECUTING_BROKER,
          'Explanation': o.EXPLANATION,
          'Hold Date': o.HOLD_DATE,
          'Hold Date Open': o.HOLD_DATE_OPEN,
          'ISIN': o.ISIN,
          'Last Modified Date': o.MODIFICATION_DATE,
          'Last Modified User': o.MODIFIED_BY,
          'Line of Business': o.LINE_OF_BUSINESS,
          'Location': o.LOCATION,
          'Maturity Date': o.MATURITY_DATE,
          'Net + AI Amount': parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          'Optional Fee 1 Amount': o.OPTIONAL_FEE_1_AMOUNT,
          'Optional Fee 2 Amount': o.OPTIONAL_FEE_2_AMOUNT,
          'Price': o.PRICE,
          'Principal Amount': o.PRINCIPAL,
          'Processing Date': o.PROCESSING_DATE,
          'Registration': o.REGISTRATION,
          'SEC Fee Amount': o.SEC_FEE,
          'Settlement Currency' : o.SETTLEMENT_CURRENCY,
          'Trade #': o.TRADE_ID,
          'Trade Date':o.TRADE_DATE,
          'CUSIP': o.CUSIP,
          'Asset Short Name': o.ASSET_SHORT_NAME,
          'Shares': this.parsevalue(o.SHARES),
          'Contractual Settlement Date': o.TRADE_SETTLE_DATE,
          'Reversed?': o.REVERSED,
          'Original Amount': o.ORIGINAL_AMOUNT,
          'Net Trade Amount' : o.NET_TRADE_AMOUNT
          };
        });
    }
    else if(rec[0].DASHBOARD_STATUS=='Incomplete' && rec[0].SOURCE == 'Confirm'){
      
      this.rowDetailKeys=['Accrued Interest Amount','Account Administrator','Broker Amount','Clearing Broker','Created By','Create Date','Trade Status','Trade Type','Executing Broker','Last Modified Date','Last Modified User','Net + AI Amount','Price','Principal Amount','SWIFT SEME','Trade #','Trade Date','CUSIP','Affirm Date','Affirm Type','Affirmed By','Agent FINS','Asset Short Name','Asset Type','Interested Party 1','Interested Party 2','Institution Id','Institution Name','DTC Confirm #','DTC Eligible','Exchange','Optional Fee','Original Face','P I Amount','Shares','SOFT_VALIDATION_MESSAGES','Contractual Settlement Date','HARD_VALIDATION_MESSAGES','Internal Confirm #','Net Trade Amount','Custodian Trade Status','Custody Account','Clrng Broker DTC Id','Exec Broker DTC Id','Federal Tax Cost Amount','File Timestamp','State Tax Cost Amount','Special Instruction','Broker Account','Trade Instruction']
      
      this.xlsDetailData= this.tradeDetails.map(o => {
        return { 
          'Accrued Interest Amount': o.ACCURED_INTEREST_AMT,
          'Account Administrator': o.ADMINISTRATOR,
          'Broker Amount': o.BROKER_AMOUNT,
          'Clearing Broker': o.CLEARING_BROKER,
          'Created By': o.CREATED_BY,
          'Create Date': o.CREATE_DATE,
          'Settlement Location': o.DASHBOARD_LOCATION,
          'Trade Status': o.DASHBOARD_STATUS,
          'Trade Type': o.DASHBOARD_TRADE_TYPE,
          'Executing Broker': o.EXECUTING_BROKER,
          'Last Modified Date': o.MODIFICATION_DATE,
          'Last Modified User': o.MODIFIED_BY,
          'Net + AI Amount': parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          'Price': o.PRICE,
          'Principal Amount': o.PRINCIPAL,
          'SWIFT SEME': o.SWIFT_SEME,
          'Trade #': o.TRADE_ID,
          'Trade Date': o.TRADE_DATE,
          'CUSIP': o.CUSIP,
          'Affirm Date': o.AFFIRM_DATE,
          'Affirm Type': o.AFFIRM_TYPE,
          'Affirmed By': o.AFFIRMED_BY,
          'Agent FINS': o.AGENT_FINS,
          'Asset Short Name': o.ASSET_SHORT_NAME,
          'Asset Type': o.ASSET_TYPE,
          'Interested Party 1': o.INTERESTED_PARTY_1,
          'Interested Party 2': o.INTERESTED_PARTY_2,
          'Institution Id': o.INSTITUTION_ID,
          'Institution Name': o.INSTITUTION_NAME,
          'DTC Confirm #': o.DTC_CONFIRM,
          'DTC Eligible': o.DTC_ELIGIBLE,
          'Exchange': o.EXCHANGE,
          'Optional Fee': o.OPTIONAL_FEE,
          'Original Face': o.ORIGINAL_FACE,
          'P I Amount': o.PI_AMOUNT,
          'Shares': this.parsevalue(o.SHARES),
          'SOFT_VALIDATION_MESSAGES': o.SOFT_VALIDATION_MESSAGES,
          'Contractual Settlement Date': o.TRADE_SETTLE_DATE,
          'HARD_VALIDATION_MESSAGES': o.HARD_VALIDATION_MESSAGES,
          'Internal Confirm #': o.INTERNAL_CONFIRM_NO,
          'Net Trade Amount': o.NET_TRADE_AMOUNT,
          'Custodian Trade Status': o.CUSTODIAN_TRADE_STATUS,
          'Custody Account': o.CUSTODY_ACCOUNT,
          'Clrng Broker DTC Id': o.CLRNG_BROKER_DTC_ID,
          'Exec Broker DTC Id': o.EXEC_BROKER_DTC_ID,
          'Federal Tax Cost Amount': o.FEDERAL_TAX_COST_AMOUNT,
          'File Timestamp': o.FILE_TIMESTAMP,
          'State Tax Cost Amount': o.STATE_TAX_COST_AMOUNT,
          'Special Instruction': o.SPECIAL_INSTRUCTION,
          'Broker Account': o.BROKER_ACCOUNT,
          'Trade Instruction': o.TRADE_INSTRUCTION,
          'Source': o.SOURCE
          };
        });
    }
    else if(rec[0].DASHBOARD_STATUS=='Incomplete' && rec[0].SOURCE == 'Swift'){
     
      this.rowDetailKeys=['Accrued Interest Amount','Account Administrator','Account Number','Broker Amount','Clearing Broker','Created By','Create Date','Settlement Location','Trade ng Status','Trade Type','Executing Broker','ISIN','Last Modified Date','Last Modified User','Net + AI Amount','Price','Principal Amount','Settlement Currency','Trade #','Trade Date','CUSIP','Affirm Type','Asset Short Name','Asset Type','DTC Confirm #','DTC Eligible','Exchange','Original Face','Shares','SOFT_VALIDATION_MESSAGES','Stamp Duty','Stamp Duty Code','548 Reason','Receiver','Receiver BIC','Sedol','Sender','Sender BIC','548 Status','Ticker','Contractual Settlement Date','Executing Broker Account Number','Executing Broker Market Id','Executing Broker Tag Type','FX Currency toBuy/Sell','HARD_VALIDATION_MESSAGES','Input Date','Input/Output Indicator','Internal Confirm #','Message Type','Custodian Trade Status','Custody Account','Block Pool #','Clearing Broker Account Number','Clearing Broker Market Id','Clearing Broker Tag Type','SWIFT Ref #']
      
      this.xlsDetailData= this.tradeDetails.map(o => {
        return { 
          'Accrued Interest Amount': o.ACCURED_INTEREST_AMT,
          'Account Administrator': o.ADMINISTRATOR,
          'Account Number': o.ACCOUNT_NUMBER,
          'Broker Amount': o.BROKER_AMOUNT,
          'Clearing Broker': o.CLEARING_BROKER,
          'Created By': o.CREATED_BY,
          'Create Date': o.CREATE_DATE,
          'Settlement Location': o.DASHBOARD_LOCATION,
          'Trade Status': o.DASHBOARD_STATUS,
          'Trade Type': o.DASHBOARD_TRADE_TYPE,
          'Executing Broker': o.EXECUTING_BROKER,
          'ISIN': o.ISIN,
          'Last Modified Date': o.MODIFICATION_DATE,
          'Last Modified User': o.MODIFIED_BY,
          'Net + AI Amount': parseFloat(o.USD_EQUIVALENT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          'Price': o.PRICE,
          'Principal Amount': o.PRINCIPAL,
          'Settlement Currency': o.SETTLEMENT_CURRENCY,
          'Trade #': o.TRADE_ID,
          'Trade Date': o.TRADE_DATE,
          'CUSIP': o.CUSIP,
          'Affirm Type': o.AFFIRM_TYPE,
          'Asset Short Name': o.ASSET_SHORT_NAME,
          'Asset Type': o.ASSET_TYPE,
          'DTC Confirm #': o.DTC_CONFIRM,
          'DTC Eligible': o.DTC_ELIGIBLE,
          'Exchange': o.EXCHANGE,
          'Original Face': o.ORIGINAL_FACE,
          'Shares': this.parsevalue(o.SHARES),
          'SOFT_VALIDATION_MESSAGES': o.SOFT_VALIDATION_MESSAGES,
          'Stamp Duty': o.STAMP_DUTY,
          'Stamp Duty Code': o.STAMP_DUTY_CODE,
          '548 Reason': o.REASON_548,
          'Receiver': o.RECEIVER,
          'Receiver BIC': o.RECEIVER_BIC,
          'Sedol': o.SEDOL,
          'Sender': o.SENDER,
          'Sender BIC': o.SENDER_BIC,
          '548 Status': o.STATUS_548,
          'Ticker': o.TICKER,
          'Contractual Settlement Date': o.TRADE_SETTLE_DATE,
          'Executing Broker Account Number': o.EXECUTING_BROKER_ACCT_NUMBER,
          'Executing Broker Market Id': o.EXECUTING_BROKER_MARKET_ID,
          'Executing Broker Tag Type': o.EXECUTING_BROKER_TAG_TYPE,
          'FX Currency to Buy/Sell': o.FX_CURRENCY_TO_BUY_SELL,
          'HARD_VALIDATION_MESSAGES': o.HARD_VALIDATION_MESSAGES,
          'Input Date': o.INPUT_DATE,
          'Input/Output Indicator': o.INPUT_OUTPUT_INDICATOR,
          'Internal Confirm #': o.INTERNAL_CONFIRM_NO,
          'Message Type': o.MESSAGE_TYPE,
          'Custodian Trade Status': o.CUSTODIAN_TRADE_STATUS,
          'Custody Account': o.CUSTODY_ACCOUNT,
          'Block Pool #': o.BLOCK_POOL_NO,
          'Clearing Broker Account Number': o.CLEARING_BROKER_ACCOUNT_NUMBER,
          'Clearing Broker Market Id': o.CLEARING_BROKER_MARKET_ID,
          'Clearing Broker Tag Type': o.CLEARING_BROKER_TAG_TYPE,
          'SWIFT Ref #': o.SWIFT_REF_NO,
          'Source': o.SOURCE                           
          };
        });
    }
  }
  public loadAuditData() {
    let key;
    key=this.popUpCommentData[0].SURROGATE_KEY;
    console.time("Time taken by getAuditTrail(): ");
    this.session.getAuditTrail(key).subscribe((data) => {
      console.timeEnd("Time taken by getAuditTrail(): ");
      console.log("AT Comment");
      //console.log(data);
      this.auditData = data;
      this.auditDownloadXlsData= this.auditData.map(o => {
        return { 
          'Updated By': o.COMMENT_BY,
          'Updated Date': o.UPDATED_TIME,
          'Comments':o.COMMENTS
        }
      });
      // if (this.flag == 0) {
      //   this.flag = 1;
      //   this.adTrigger.next();
      // }
    });
  }

  public DrawChart(dataArr: any) {

    debugger;
    let NBlocation:any = {};
    let NBlocationStatus = {};
    let NBlocationAging = {};
    let NBStatus:any = {};

    let NBType:any = {};
    let NBTypelocation = {};
    
    let NBTypeStatus = {};
    let NBTypeAging = {};

    let NBAgingLocation:any = {};
    let NBAgingStatus = {};
    /*this.filterAndSideLinkData.settlementLocation.forEach(element => {
      NBlocation[element.name] = 0;
    });*/ 
    /*this.filterAndSideLinkData.TradeType.forEach(element => {
      NBType[element.name] = 0; 
    });*/
    const tradeStatusGlobal =  this.filterAndSideLinkData.TradeStatus ;
    var ag1=0, ag2=0, ag3=0; this.numberOfFailedTradebyAge = [];
    var tempJsonObjFail = {cat:'Failed',Low:0, Med:0, High:0};
    var tempJsonObjPending = {cat:'Pending',Low:0, Med:0, High:0};
    var tempJsonObjInc = {cat:'Incomplete',Low:0, Med:0, High:0};
 

    dataArr.forEach(element => {
      
     var tdStatus = element.DASHBOARD_STATUS;
     var location = element.DASHBOARD_LOCATION;
     var tdType = element.DASHBOARD_TRADE_TYPE;
     //var tdStatus = element.TradeStatus;

     NBlocation[location] = NBlocation[location] == undefined ? 1 : NBlocation[location] + 1;
     NBlocationStatus[location +'~'+ tdStatus] = NBlocationStatus[location +'~'+ tdStatus] == undefined ? 1 : NBlocationStatus[location +'~'+ tdStatus] + 1;
     NBTypelocation[location +'~'+ tdType] = NBTypelocation[location +'~'+ tdType] == undefined ? 1 : NBTypelocation[location +'~'+ tdType] + 1;
     
     NBType[ tdType ] = NBType[ tdType ] == undefined ? 1 : NBType[ tdType ] + 1;
     NBTypeStatus[ tdType +'~'+ tdStatus] = NBTypeStatus[ tdType +'~'+ tdStatus] == undefined ? 1 : NBTypeStatus[ tdType +'~'+ tdStatus] + 1;
     if(tdStatus == "Failed")
     {
  
      tempJsonObjFail['cat'] = tdStatus; 
      element.RQ_RATING == 5 ?
      tempJsonObjFail['High'] = tempJsonObjFail['High'] + 1
      : element.RQ_RATING == 4 ?
      tempJsonObjFail['Med'] = tempJsonObjFail['Med'] + 1
      : element.RQ_RATING == 3 ?
      tempJsonObjFail['Med'] = tempJsonObjFail['Med'] + 1
      : element.RQ_RATING == 2 ?
      tempJsonObjFail['Low'] = tempJsonObjFail['Low'] + 1
      : element.RQ_RATING == 1 ?
      tempJsonObjFail['Low'] = tempJsonObjFail['Low'] + 1
      : element.RQ_RATING == 0 ?
      tempJsonObjFail['Low'] = tempJsonObjFail['Low'] + 1
      : false;

      //element.RQ_RATING == 5 ? seriesArr1[0] = seriesArr1[0] + 1 :  element.RQ_RATING == 4 ? seriesArr2[0] = seriesArr2[0] + 1 : element.RQ_RATING == 3 ? seriesArr3[0] = seriesArr3[0] + 1 :  element.RQ_RATING == 2 ? seriesArr4[0] = seriesArr4[0] + 1 : element.RQ_RATING == 1 ? seriesArr5[0] = seriesArr5[0] + 1 : false;
       if(element.AGEING < 4)
       {
        ag1 = ag1+1;
        NBlocationAging[location +'*'+ '0-3 Days'] = NBlocationAging[location +'*'+ '0-3 Days'] == undefined ? 1 : NBlocationAging[location +'*'+ '0-3 Days'] + 1;
        NBTypeAging[tdType +'*'+ '0-3 Days'] = NBTypeAging[tdType +'*'+ '0-3 Days'] == undefined ? 1 : NBTypeAging[tdType +'*'+ '0-3 Days'] + 1;
        
      }
       else if(element.AGEING > 3 && element.AGEING < 8)
       {
        ag2 = ag2+1;
        NBlocationAging[location +'*'+ '4-7 Days'] = NBlocationAging[location +'*'+ '4-7 Days'] == undefined ? 1 : NBlocationAging[location +'*'+ '4-7 Days'] + 1;
        NBTypeAging[tdType +'*'+ '4-7 Days'] = NBTypeAging[tdType +'*'+ '4-7 Days'] == undefined ? 1 : NBTypeAging[tdType +'*'+ '4-7 Days'] + 1;
       }
       else if(element.AGEING > 7)
       {
        ag3 = ag3+1;
        NBlocationAging[location +'*'+ '>7 Days'] = NBlocationAging[location +'*'+ '>7 Days'] == undefined ? 1 : NBlocationAging[location +'*'+ '>7 Days'] + 1;
        NBTypeAging[tdType +'*'+ '>7 Days'] = NBTypeAging[tdType +'*'+ '>7 Days'] == undefined ? 1 : NBTypeAging[tdType +'*'+ '>7 Days'] + 1;
       }


     }
     else if(tdStatus == "Pending")
     {
      //element.RQ_RATING == 5 ? seriesArr1[1] = seriesArr1[1] + 1 :  element.RQ_RATING == 4 ? seriesArr2[1] = seriesArr2[1] + 1 : element.RQ_RATING == 3 ? seriesArr3[1] = seriesArr3[1] + 1 :  element.RQ_RATING == 2 ? seriesArr4[1] = seriesArr4[1] + 1 : element.RQ_RATING == 1 ? seriesArr5[1] = seriesArr5[1] + 1 : false;
      tempJsonObjPending['cat'] = tdStatus; 
      element.RQ_RATING == 5 ?
      tempJsonObjPending['High'] = tempJsonObjPending['High'] + 1
      : element.RQ_RATING == 4 ?
      tempJsonObjPending['Med'] = tempJsonObjPending['Med'] + 1
      : element.RQ_RATING == 3 ?
      tempJsonObjPending['Med'] = tempJsonObjPending['Med'] + 1
      : element.RQ_RATING == 2 ?
      tempJsonObjPending['Low'] = tempJsonObjPending['Low'] + 1
      : element.RQ_RATING == 1 ?
      tempJsonObjPending['Low'] = tempJsonObjPending['Low'] + 1
      : element.RQ_RATING == 0 ?
      tempJsonObjPending['Low'] = tempJsonObjPending['Low'] + 1
      : false;
     }
     else if(tdStatus == "Incomplete")
     {
      //element.RQ_RATING == 5 ? seriesArr1[2] = seriesArr1[2] + 1 :  element.RQ_RATING == 4 ? seriesArr2[2] = seriesArr2[2] + 1 : element.RQ_RATING == 3 ? seriesArr3[2] = seriesArr3[2] + 1 :  element.RQ_RATING == 2 ? seriesArr4[2] = seriesArr4[2] + 1 : element.RQ_RATING == 1 ? seriesArr5[2] = seriesArr5[2] + 1 : false;
      tempJsonObjInc['cat'] = tdStatus;
      element.RQ_RATING == 5 ?
      tempJsonObjInc['High'] = tempJsonObjInc['High'] + 1
      : element.RQ_RATING == 4 ?
      tempJsonObjInc['Med'] = tempJsonObjInc['Med'] + 1
      : element.RQ_RATING == 3 ?
      tempJsonObjInc['Med'] = tempJsonObjInc['Med'] + 1
      : element.RQ_RATING == 2 ?
      tempJsonObjInc['Low'] = tempJsonObjInc['Low'] + 1
      : element.RQ_RATING == 1 ?
      tempJsonObjInc['Low'] = tempJsonObjInc['Low'] + 1
      : element.RQ_RATING == 0 ?
      tempJsonObjInc['Low'] = tempJsonObjInc['Low'] + 1
      : false;
      }


    });


    this.numberOfTradesLocWise = [];
    this.numberOfTradesTradeTypeWise = [];
    this.numberOfTradesTradeStatusWise  = [];
    /*for (var nb in NBlocation)
    {this.numberOfTradesLocWise.push(NBlocation[nb]);}*/
    this.numberOfTradesTradeStatusWise.push(tempJsonObjFail);
    this.numberOfTradesTradeStatusWise.push(tempJsonObjInc);
    this.numberOfTradesTradeStatusWise.push(tempJsonObjPending);
  //  for (let nb in NBType)
  //     {
  //       var v = {};
  //       v['name'] =  nb;
  //       v['color'] = this.filterAndSideLinkData.TradeType.filter(obj => obj.name == nb)[0].color;
  //       v['value'] =  NBType[nb];
  //       this.numberOfTradesTradeTypeWise.push(v);
  //     }
  
  // var locationTypeAging =[];
  // for (let nb in NBlocation)
  // {
  //   if(nb.split('*').length > 1)
  //   {
  //     var v= {};
  //     var locaArr = this.filterAndSideLinkData.Aging.map(function(d, index) {
  //       if(nb.split('*')[1] == d.name)
  //       {
  //         return {cat: d.name.replace(/\s/g, ""), DisplayValue:d.name, val: NBlocation[nb], color: d.color};
  //       }
  //     });
    
  //     v['location'] = nb.split('*')[0];
  //     v['Aging'] =  locaArr;
  //     var finder = locationTypeAging.filter(obj => obj.location == nb.split('*')[0]);
  //     if(finder.length > 0)
  //     {
  //       finder[0].Aging.push(locaArr.filter(ob => ob != undefined)[0]);
  //     }
  //     else
  //     locationTypeAging.push(v);
  //   }
  // }


// var TradeTypeAging = [];
//   for (let nb in NBType)
//   {
    
//     if(nb.split('*').length > 1)
//     {
//       var v= {};
//       var locaArr = this.filterAndSideLinkData.Aging.map(function(d, index) {
//         if(nb.split('*')[1] == d.name)
//         {
//           return {cat: d.name.replace(/\s/g, ""), DisplayValue:d.name, val: NBType[nb], color: d.color};
//         }
//       });
    
//       v['TradeType'] = nb.split('*')[0];
//       v['Aging'] =  locaArr;
//       var finder = TradeTypeAging.filter(obj => obj.TradeType == nb.split('*')[0]);
//       if(finder.length > 0)
//       {
//         finder[0].Aging.push(locaArr.filter(ob => ob != undefined)[0]);
//       }
//       else
//       TradeTypeAging.push(v);
//     }
//   }

//   this.numberOfTradesTradeTypeWise = this.filterAndSideLinkData.TradeType.map(function(d, index) {
//     let child = []; let count = 0; 
    
//     for (let nb in NBType)
//     {
//       count =  NBType[d.name] == undefined ? 0 : NBType[d.name];
//       if(d.name == nb.split('~')[0] && nb.split('~').length > 1)
//       {
//         var v = {}; var status = nb.split('~')[1];
//         var drillChild2 = [];
//         var tempvar = TradeTypeAging.filter(obj => obj.TradeType == nb.split('~')[0]);
//         if(tempvar.length > 0)
//         {
//           drillChild2 = tempvar[0].Aging.filter(obj => obj != undefined);
//         }
//         v['drillLevel'] = 2;
//         v['cat'] =  nb.split('~')[1].replace(/\s/g, "");
//         v['DisplayValue'] =  nb.split('~')[1];
//         v['color'] = tradeStatusGlobal.filter(obj => obj.name == nb.split('~')[1])[0].color;
//         v['val'] =  NBType[nb] == undefined ? 0 : NBType[nb];
//         v['children'] = drillChild2;
//         child.push(v);
//       }
//     }
//     return {drillLevel:1, cat: d.name.replace(/\s/g, ""), DisplayValue:d.name, val: count, color: d.color, children : child};
//   });


  
  if(this.drillLevelLocation == 0)
  {
    for (let nb in NBlocation)
    {
      //count =  NBlocation[d.name] == undefined ? 0 : NBlocation[d.name];
      
        // var v = {}; var status = nb.split('~')[1];
        // var drillChild2 = [];
        // var tempvar = locationTypeAging.filter(obj => obj.location == nb.split('~')[0]);
        // if(tempvar.length > 0)
        // {
        //   drillChild2 = tempvar[0].Aging.filter(obj => obj != undefined);
        // }
        // v['drillLevel'] = 2;
        // v['cat'] =  nb.split('~')[1].replace(/\s/g, "");
        // v['DisplayValue'] =  nb.split('~')[1];
        // v['color'] = tradeStatusGlobal.filter(obj => obj.name == nb.split('~')[1])[0].color;
        // v['val'] =  NBlocation[nb] == undefined ? 0 : NBlocation[nb];
        // v['children'] = drillChild2;
        var color = this.filterAndSideLinkData.settlementLocation.filter(obj => obj.name == nb)[0].color;
        var childChart = [];
        for (let nb1 in NBlocationStatus)
        {          
          if(nb1.split('~')[0] == nb)
          {
            childChart.push({cat:nb1.split('~')[1]});
          }
        }
        this.numberOfTradesLocWise.push({drillLevel:1, cat: nb.replace(/\s/g, ""), DisplayValue: nb, val: NBlocation[nb], color: color, children : childChart});
    }
  }
  else if(this.drillLevelLocation == 1)
  {
    var locStatusArr = {}; 
    for (let nb in NBlocationStatus)
    {
      let count =  locStatusArr[nb.split('~')[1]] == undefined ? 0 : locStatusArr[nb.split('~')[1]];
      locStatusArr[nb.split('~')[1]] = count +  NBlocationStatus[nb];
    }
    for (let nb in locStatusArr)
    {
      var childChart = [];
      if(nb == 'Failed')
      {
        childChart = [{}];
      }
      // for (let nb1 in NBlocationAging)
      // {          
      //   if(nb1.split('*')[0] == 'Failed')
      //   {
      //     childChart.push({cat:nb1.split('*')[1]});
      //   }
      // }
      var color = this.filterAndSideLinkData.TradeStatus.filter(obj => obj.name == nb)[0].color;
      this.numberOfTradesLocWise.push({drillLevel:2, cat: nb.replace(/\s/g, ""), DisplayValue: nb, val: locStatusArr[nb], color: color, children : childChart});
    }
      
  }
  else if(this.drillLevelLocation == 2)
  {
    var locStatusArr = {};
    for (let nb in NBlocationAging)
    {
      let count =  locStatusArr[nb.split('*')[1]] == undefined ? 0 : locStatusArr[nb.split('*')[1]];
      locStatusArr[nb.split('*')[1]] = count +  NBlocationAging[nb];
    }
    for (let nb in locStatusArr)
    {
      var color = this.filterAndSideLinkData.Aging.filter(obj => obj.name == nb)[0].color;
      this.numberOfTradesLocWise.push({drillLevel:2, cat: nb.replace(/\s/g, ""), DisplayValue: nb, val: locStatusArr[nb], color: color});
    }
  }

  // Chart 3 Function Starts
  if(this.drillLevelTradeType == 0)
  {
    for (let nb in NBType)
    {
        var color = this.filterAndSideLinkData.TradeType.filter(obj => obj.name == nb)[0].color;
        var childChart = [];
        for (let nb1 in NBTypeStatus)
        {          
          if(nb1.split('~')[0] == nb)
          {
            childChart.push({cat:nb1.split('~')[1]});
          }
        }
        this.numberOfTradesTradeTypeWise.push({drillLevel:1, cat: nb.replace(/\s/g, ""), DisplayValue: nb, val: NBType[nb], color: color, children : childChart});
    }
  }
  else if(this.drillLevelTradeType == 1)
  {
    var locStatusArr = {}; 
    for (let nb in NBTypelocation)
    {
      let count =  locStatusArr[nb.split('~')[0]] == undefined ? 0 : locStatusArr[nb.split('~')[0]];
      locStatusArr[nb.split('~')[0]] = count +  NBTypelocation[nb];
    }
    for (let nb in locStatusArr)
    {
      var childChart = [];
      for (let nb1 in NBlocationStatus)
      {          
        if(nb1.split('~')[0] == nb)
        {
          childChart.push({cat:nb1.split('~')[1]});
        }
      }
      // for (let nb1 in NBlocationAging)
      // {          
      //   if(nb1.split('*')[0] == 'Failed')
      //   {
      //     childChart.push({cat:nb1.split('*')[1]});
      //   }
      // }
      var color = this.filterAndSideLinkData.settlementLocation.filter(obj => obj.name == nb)[0].color;
      this.numberOfTradesTradeTypeWise.push({drillLevel:2, cat: nb.replace(/\s/g, ""), DisplayValue: nb, val: locStatusArr[nb], color: color, children : childChart});
    }
      
  }
  else if(this.drillLevelTradeType == 2)
  {
    var locStatusArr = {};
    for (let nb in NBlocationStatus)
    {
      let count =  locStatusArr[nb.split('~')[1]] == undefined ? 0 : locStatusArr[nb.split('~')[1]];
      locStatusArr[nb.split('~')[1]] = count +  NBlocationStatus[nb];
    }
    for (let nb in locStatusArr)
    {
      var color = this.filterAndSideLinkData.TradeStatus.filter(obj => obj.name == nb)[0].color;
      this.numberOfTradesTradeTypeWise.push({drillLevel:3, cat: nb.replace(/\s/g, ""), DisplayValue: nb, val: locStatusArr[nb], color: color});
    }
  }
  
  // Chart 4 Function Starts
  if(this.drillLevelAge == 0)
  {
    this.numberOfFailedTradebyAge =  this.filterAndSideLinkData.Aging.map(function(d, index) {
      return {drillLevel:1, cat: d.name.replace(/\s/g, ""), DisplayValue:d.name, val: eval('ag'+parseInt(index+1)), color: d.color, children:[{}]};
    });
  }

  if(this.drillLevelAge == 1)
  {
    var locStatusArr = {};
    for (let nb in NBlocationAging)
    {
      if(this.activeChart.Chart4FilterType == nb.split('*')[1])
      {
      let count =  locStatusArr[nb.split('*')[0]] == undefined ? 0 : locStatusArr[nb.split('*')[0]];
      locStatusArr[nb.split('*')[0]] = count +  NBlocationAging[nb];
      }
    }
    for (let nb in locStatusArr)
    {
      var color = this.filterAndSideLinkData.settlementLocation.filter(obj => obj.name == nb)[0].color;
      this.numberOfFailedTradebyAge.push({drillLevel:2, cat: nb.replace(/\s/g, ""), DisplayValue: nb, val: locStatusArr[nb], color: color});
    }
    
  }
  if(this.drillLevelAge == 2)
  {
    this.numberOfFailedTradebyAge =  this.filterAndSideLinkData.Aging.map(function(d, index) {
      return {drillLevel:3, cat: d.name.replace(/\s/g, ""), DisplayValue:d.name, val: eval('ag'+parseInt(index+1)), color: d.color, children:[]};
    });
  }
  this.stackType = this.filterAndSideLinkData.RiskType.filter(d => d.checked == true).map(function(d, index) {
    let stackSum = 0;
    if(d.name == "Low")
    stackSum = tempJsonObjFail.Low +  tempJsonObjInc.Low + tempJsonObjPending.Low;
    if(d.name == "Med")
    stackSum = tempJsonObjFail.Med +  tempJsonObjInc.Med + tempJsonObjPending.Med;
    if(d.name == "High")
    stackSum = tempJsonObjFail.High +  tempJsonObjInc.High + tempJsonObjPending.High;

    return {name:d.name, DisplayValue: d.name, color:d.color, value: stackSum};
  });
   //[{name:'RQ1', DisplayValue: 'No', color:'green'}, {name:'RQ2', DisplayValue: 'Low', color:'lightgreen'}, {name:'RQ3', DisplayValue: 'Medium', color:'yellow'}, {name:'RQ4', DisplayValue: 'High', color:'#FFBF00'}, {name:'RQ5', DisplayValue: 'Very High', color:'red'}];
  this.stackedData = [];
  this.stackedData.push(tempJsonObjFail);
  this.stackedData.push(tempJsonObjInc);
  this.stackedData.push(tempJsonObjPending);
  //if(this.activeChart.chartID != this.chart3ID)
      this.chart2Data = this.numberOfTradesLocWise.filter(dt => dt.val > 0);
      this.chart3Data = this.numberOfTradesTradeTypeWise.filter(dt => dt.val > 0);
      this.donutDistByAge = this.numberOfFailedTradebyAge.filter(dt => dt.val > 0);
  }


  public onSelectFilter(eventTypeChkBoxObj) {
    //let checkedunchekedArray =  this.filterAndSideLinkData.settlementLocation.filter(obj => obj.checked).map(obj => obj.name);
    //this.jsonManipulation (this.masterData);
    //this.fetchDataFromApiCall ();
    //this.loadTradeDetails();
    this.activeChart   = {};
    this.drillLevelChart1 = 0; this.drillLevelAge = 0; this.drillLevelLocation = 0 ; this.drillLevelTradeType = 0;
  //   var eleArr = [];
  //   this.filterAndSideLinkData.settlementLocation.forEach(element => {
  //     if(element.checked)
  //     eleArr.push(element.name);
      
  //   });
  // this.activeChart['SetLocation'] = eleArr;
    this.rerender();
  }

  rerender(): void {
    this.tradeInfo = this.tradeDataMani(this.masterData);
    this.DrawChart(this.tradeInfo);
    this.dtElements.forEach((dtElement: DataTableDirective) => {

      dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        
                if (dtElement.dtOptions.pageLength == 20) {
                  // this.tradeInfo = [];
                  //   this.tradeInfo = this.tradeDataMani(this.masterData);
                    //console.log(this.tradeInfo);
                    //dtInstance.destroy();
                    //this.dtTriggerTradeDetail.next();
                    dtInstance.clear().draw();
                    dtInstance.rows.add(this.tradeInfo).draw();
                    //this.DrawChart(this.tradeInfo);
        
                  // this.session.getTradeDetails().subscribe((result) => {
                  //   this.tradeInfo = [];
                  //   this.tradeInfo = this.tradeDataMani(result);
                  //   //console.log(this.tradeInfo);
                  //   dtInstance.destroy();
                  //   this.dtTriggerTradeDetail.next();
                  //   this.DrawChart(this.tradeInfo);
                  // });
                  
                }
        

      });
    });
  }


  public tradeDataMani(trade: any): any {
    //debugger;
    this.dashBoardData = []; this.TradeFilterArrayLavel1 = []; this.TradeFilterArrayLavel2 = []; this.TradeFilterArrayLavel3 = []; this.TradeFilterArrayLavel4 = [];
    this.filterAndSideLinkData.settlementLocation.forEach(element => {
      this.TradeFilterArrayLavel1 = this.TradeFilterArrayLavel1.concat(trade.filter(element1 => element.name == element1.DASHBOARD_LOCATION && element.checked));
    });

    this.filterAndSideLinkData.TradeStatus.forEach(element => {
      this.TradeFilterArrayLavel2 = this.TradeFilterArrayLavel2.concat(this.TradeFilterArrayLavel1.filter(element1 => element.name == element1.DASHBOARD_STATUS && element.checked));
    });
    
    this.filterAndSideLinkData.TradeType.forEach(element => {
      this.TradeFilterArrayLavel3 = this.TradeFilterArrayLavel3.concat(this.TradeFilterArrayLavel2.filter(element1 => element.name == element1.DASHBOARD_TRADE_TYPE && element.checked));
    });
    let eleForDashBoard = {};
    debugger;
    this.filterAndSideLinkData.RiskType.forEach(element => {
      this.TradeFilterArrayLavel3.forEach(element1 => {
       var elementFilter =  element.value.split(',').filter(obj => obj == element1.RQ_RATING);
        // if (element.value == element1.RQ_RATING && element.checked) {

         if (elementFilter.length > 0 && element.checked) {
          // add keys for entitlement and appconfig setting for Addcomment/ Email/ Show details 
          element1['addComment'] = this.addComment;
          element1['addCommentAppConfig'] = this.addCommentAppConfig;
          element1['sendEmailAppConfig'] = this.sendEmailAppConfig;
          element1['showDetailsAppConfig'] = this.showDetailsAppConfig;
          
          this.TradeFilterArrayLavel4.push(element1);
          let Counter = 1; 
          var soroKey = element1.DASHBOARD_LOCATION + '~' + element1.DASHBOARD_STATUS + '~' + element1.DASHBOARD_TRADE_TYPE;
          if((element1.DASHBOARD_LOCATION == "DTC" || element1.DASHBOARD_LOCATION == "FED") && element1.DASHBOARD_STATUS == "Incomplete")
          {
            soroKey = element1.DASHBOARD_LOCATION + '~' + element1.DASHBOARD_STATUS + '~' + element1.DASHBOARD_TRADE_TYPE + '~' + element1.SOURCE;
          }
          else
          {
            soroKey = element1.DASHBOARD_LOCATION + '~' + element1.DASHBOARD_STATUS + '~' + element1.DASHBOARD_TRADE_TYPE;
          }
          //let NetUSD = 0; let TotShares = 0;

          if (eleForDashBoard[soroKey] === undefined) {
            eleForDashBoard[soroKey] = { 'SOURCE': element1.SOURCE,'DASHBOARD_LOCATION': element1.DASHBOARD_LOCATION, 'DASHBOARD_STATUS': element1.DASHBOARD_STATUS, 'DASHBOARD_TRADE_TYPE': element1.DASHBOARD_TRADE_TYPE, 'NO_OF_TRADES': Number(Counter), 'NET_USD': parseFloat(element1.USD_EQUIVALENT), 'TOTAL_SHARES': parseFloat(element1.SHARES) };
          }
          else {
            eleForDashBoard[soroKey].NO_OF_TRADES = 1 + Number(eleForDashBoard[soroKey].NO_OF_TRADES);
            eleForDashBoard[soroKey].NET_USD = parseFloat(eleForDashBoard[soroKey].NET_USD) + parseFloat(element1.USD_EQUIVALENT);
            eleForDashBoard[soroKey].TOTAL_SHARES = parseFloat(eleForDashBoard[soroKey].TOTAL_SHARES) + parseFloat(element1.SHARES);
          }
        }
      });
    });
    this.sort(this.column);
    this.dashBoardData = [];
    for (let abc in eleForDashBoard) {
      this.dashBoardData.push(eleForDashBoard[abc]);
    }
    //console.log(eleForDashBoard);

    //this.populateChart(this.dashBoardData);
    //console.log();

    return this.TradeFilterArrayLavel4;
  }

  public ClickbtnReset() {

    this.activeChart = {};
    this.filterAndSideLinkData.settlementLocation.forEach(element => {
      element.checked = false;
    });
    this.filterAndSideLinkData.TradeStatus.forEach(element => {
      element.checked = false;
    });
    this.filterAndSideLinkData.TradeType.forEach(element => {
      element.checked = false;
    });
    this.filterAndSideLinkData.RiskType.forEach(element => {
      element.checked = false;
    });
    this.rerender();
  }

  public ClickbtnReload() {
   
    this.isLoader = true;
    
        this.session.getTradeDetails().subscribe((data)=> {
                data.FEEDDATA.forEach(element => {
                  if(element.feedType == 'CDS'){
                  //AppFooterComponent.prototype.cdsDateTime = element.dateTime;
                  }else if(element.feedType == 'FITEK'){
                  //AppFooterComponent.prototype.fitekDateTime = element.dateTime;
                  }
                });
    
          this.futureFailData=data.TRADEDATA;
         
          
          let settlementLocationArr = new Set(data.TRADEDATA.map(item => item.DASHBOARD_LOCATION)); 
          let TradeStatusArr = new Set(data.TRADEDATA.map(item => item.DASHBOARD_STATUS)); 
          let TradeTypeArr = new Set(data.TRADEDATA.map(item => item.DASHBOARD_TRADE_TYPE)); 
          let RiskTypeArr = new Set(data.TRADEDATA.map(item => item.DASHBOARD_)); 
          let AgingArr = new Set(data.TRADEDATA.map(item => item.DASHBOARD_LOCATION)); 
          
          this.filterAndSideLinkData = {
            settlementLocation: [{ name: 'Clear Stream', checked: true, color: '#55a975' }, { name: 'DTC', checked: true, color: '#3350aa' }, { name: 'FED', checked: true, color: '#d5b168' }, { name: 'Global', checked: true, color: '#3c8dbc' }, { name: 'MF-OFF', checked: true, color: '#bb3ca0' }, { name: 'MF-DOM', checked: true, color: '#adbb3c' }],
            TradeStatus: [{ name: 'Failed', checked: true, color: '#e60e0e' }, { name: 'Pending', checked: true, color: '#ffc200' }, { name: 'Incomplete', checked: true, color: '#FFFF00' }],
            TradeType: [{ name: 'Sell', checked: true, color: '#c012de' }, { name: 'BUY', checked: true, color: '#20c4c5' }, { name: 'Receive Free', checked: true, color: '#4484f1' }, { name: 'Deliver Free', checked: true, color: '#85f144' }],
            RiskType: [{ name: 'Low', value: '0,1,2', checked: true, color:'green' }, { name: 'Med', value: '3,4', checked: true, color:'#FFCC00' }, { name: 'High', value: '5', checked: true, color:'red' }],
            Aging: [{ name: '0-3 Days', color: '#fd9a9a' }, { name: '4-7 Days', color: '#ff5d5d' }, { name: '>7 Days', color: '#FF0000' }]
          };
          this.masterData = this.tradeDataMani(data.TRADEDATA);
          this.tradeInfo = this.masterData;
          this.rerender();
            this.isLoader = false;
                }, (err)=>{
                  console.log(err);
              });
      }

  public over(dataArr: any): void {

    //debugger;
    this.Age0_3Days = 0; this.Age4_7Days = 0; this.AgeGt7Days = 0; this.AgeLt0Days = 0;

    var count = this.futureFailData.filter(obj =>
      obj.DASHBOARD_LOCATION == dataArr.DASHBOARD_LOCATION
      &&
      obj.DASHBOARD_TRADE_TYPE == dataArr.DASHBOARD_TRADE_TYPE
      &&
      obj.DASHBOARD_STATUS == 'Future Fail'
    );
    this.AgeLt0Days=Object.keys(count).length;
    console.log(this.AgeLt0Days);


    this.tradeInfo.forEach(element => {



      if (element.DASHBOARD_STATUS == dataArr.DASHBOARD_STATUS && element.DASHBOARD_TRADE_TYPE == dataArr.DASHBOARD_TRADE_TYPE && element.DASHBOARD_LOCATION == dataArr.DASHBOARD_LOCATION) {
        if (element.AGEING > -1 && element.AGEING < 4) {
          this.Age0_3Days++;
        }
        else if (element.AGEING > 3 && element.AGEING < 8) {
          this.Age4_7Days++;
        }
        else if (element.AGEING > 7) {
          this.AgeGt7Days++;
        }
        // else if (element.AGEING < 0) {
        //   this.AgeLt0Days++;
        // }
      }
    });

  }

  public round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  public btnAddComments_click(e,...rec: any[])
  {
    this.hideEmailPopUp();
    debugger;
    e.stopPropagation();
    var xPosition = e.clientX;
    var yPosition = e.clientY;
    
    //console.log("x : " + xPosition);
    //console.log("y : " + yPosition);
    var popover = document.getElementById("addCommentPopOver");
    popover.style.display = "inline";
    // popover.style.top = (yPosition+100)+"px";
    // popover.style.left = (xPosition-500)+"px";
    popover.style.top = (e.pageY-100)+"px";
    popover.style.left = (e.pageX-360)+"px";
    var el = document.getElementById('tbale2');
    
    // get scroll position in px
    // to update comment
    this.popUpCommentData=[];
    this.popUpCommentData= rec;
  }

  public hideCommentPopUp(){
    var popover = document.getElementById("addCommentPopOver");
    popover.style.display = "none";
    
    
  }

  public btnSendEmail_click(e,...rec: any[])
  {
    //debugger;
    this.hideCommentPopUp();
    e.stopPropagation();
    var xPosition = e.clientX;
    var yPosition = e.clientY;
    //console.log("x : " + xPosition);
    //console.log("y : " + yPosition);
    var popover = document.getElementById("myEmailPopover");
    popover.style.display = "inline";
    // popover.style.top = (yPosition+100)+"px";
    // popover.style.left = (xPosition-500)+"px";
    popover.style.top = (e.pageY-250)+"px";
    popover.style.left = (e.pageX-560)+"px";
    // get scroll position in px
    // to update comment
    this.popUpCommentData=[];
    this.popUpCommentData= rec;
  }
  public hideEmailPopUp(){
    var popover = document.getElementById("myEmailPopover");
    popover.style.display = "none";
    
  }
  public xlsTrade()
  {
  
   // this.xlsDownloadData=this.xlsData;
    this.xlsDownloadData=JSON.parse(JSON.stringify(this.xlsData));
    for(var i = 0; i < this.xlsDownloadData.length; i++) {
      delete this.xlsDownloadData[i].Ageing;
      delete this.xlsDownloadData[i]['RQ Rating'];
    }
    this.excelService.exportAsExcelFile(this.xlsDownloadData, 'TradeDetails');
  }
  public auditTrailData(e)
  {
    this.excelService.exportAsExcelFile(this.auditDownloadXlsData, 'AuditTrail');
  }
public parsevalue(v)
{
   return parseFloat(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
  public redrawNgButton()
  { debugger;
    this.chart2DrillDetails = this.activeChart['chart2DrillDetails'];
    if(this.drillLevelLocation == 1)
    {
      
    this.activeChart['SetLocation'].forEach(element1 => {
    this.filterAndSideLinkData.settlementLocation.forEach(element => {      
        if (element.name == element1)
          element.checked = true;
      });
      
    });
  }
  if(this.drillLevelLocation == 2)
  {
    this.activeChart['SetStatus'].forEach(element1 => {
    this.filterAndSideLinkData.TradeStatus.forEach(element => {      
        if (element.name == element1)
          element.checked = true;
      });
      
    });
  } 
  //this.activeChart = {};
    this.drillLevelLocation = this.drillLevelLocation - 1;
    if(this.drillLevelLocation == 0)
    this.chart2DrillDetails = [];
     this.rerender();
  }

  public redrawNgButtonTradeType()
  { debugger;
    this.chart3DrillDetails = this.activeChart['chart3DrillDetails'];
    if(this.drillLevelTradeType == 1)
    {
      this.activeChart['SetTradeType'].forEach(element1 => {
      this.filterAndSideLinkData.TradeType.forEach(element => {      
          if (element.name == element1)
            element.checked = true;
        });
        
      });
    }
  if(this.drillLevelTradeType == 2)
  {
    this.activeChart['SetStatusChart3'].forEach(element1 => {
    this.filterAndSideLinkData.TradeStatus.forEach(element => {      
        if (element.name == element1)
          element.checked = true;
      });
      
    });
  } 
  //this.activeChart = {};
    this.drillLevelTradeType = this.drillLevelTradeType - 1;
    if(this.drillLevelTradeType == 0)
    this.chart3DrillDetails = [];
     this.rerender();
  }

  public reDrawButtonAgeTypeclick()
  {
    //   this.chart4DrillDetails = this.activeChart['chart4DrillDetails'];
    //   if(this.drillLevelAge == 1)
    //   {
    //     this.activeChart['SetTradeType'].forEach(element1 => {
    //     this.filterAndSideLinkData.TradeType.forEach(element => {      
    //         if (element.name == element1)
    //           element.checked = true;
    //       });
          
    //     });
    //   }
    // if(this.drillLevelAge == 2)
    // {
    //   this.activeChart['SetStatusChart3'].forEach(element1 => {
    //   this.filterAndSideLinkData.TradeStatus.forEach(element => {      
    //       if (element.name == element1)
    //         element.checked = true;
    //     });
        
    //   });
    // } 
      this.drillLevelAge = this.drillLevelAge - 1;
      if(this.drillLevelAge == 0)
      this.chart4DrillDetails = [];
      this.rerender();
  }

  public Chart1_backBtn_click()
  {
    this.activeChart['SetStatusChart4'].forEach(element1 => {
      this.filterAndSideLinkData.RiskType.forEach(element => {      
          if (element.name == element1)
              element.checked = true;
        });
      });
      this.rerender();
      this.drillLevelChart1 = 0;
  }
}
