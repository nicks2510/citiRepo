import { Component, OnInit, OnDestroy, ViewChild, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { Subject, Observable } from 'rxjs/Rx';
import { SessionService } from '../../common-service/session.service';
@Component({
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {
  
  // variables for widget maximize and minimize
  selectedBox = "";
  acOpeningFlag = false;
  kycFlag = false;
  acMaintFlag = false;
  scanningDocsFlag=false;
  //nikhil
  webEnrollmentsFlag = false;
  nameScreeningFlag = false;
  webEnrollmentsFlagcard = false;
  nameScreeningFlagcard = false;
 acMaintFlagcard = false;
  scanningDocsFlagcard=false;
  
  public filterAndSideLinkData: any = {};
  public onBoardData: any = {};
  public filteredACCycleData: any = [];
  public acCycleData: any = [{ "type": "New", "VOL": "140", "CM": "560", "LM": "800", "RQ": "5"},
  { "type": "Existing", "VOL": "120", "CM": "210", "LM": "450", "RQ": "5" },
  { "type": "All", "VOL": "970", "CM": "350", "LM": "1250", "RQ": "1" }
  ];
  public KYCData: any = [{"type":"NEW","RQ":"","VOL":"3456","CM":"562","LM":"678","REJECTS":"40"}
  ];
  public KYCCycle: any = [{"type":"KYC Cycle*","RQ":"","VOL":"6","CM":"6","LM":"4","REJECTS":"22"}
  ];
  public KYCApproval: any = [{ "type": "", "content": "Create to 1st SUBMIT", "No": "2"},
  { "type": "1ST", "content": "1st SUBMIT to 1st QA APPROVE (+) Rejects", "No": "3"},{ "type": "", "content": "Last SUBMIT to 1st QA APPROVE (-) Rejects", "No": "1"}
  ];
  public KYCApproval2: any = [{ "type": "2ND", "content": "1st SUBMIT to 1st APPROVE(+) Rejects,Escalations", "No": "1"},
  { "type": "", "content": "Last SUBMIT to LAST APPROVE(-) Rejects", "No": "2"}
  ];
  public KYCAccountOpen: any = [{ "type": "", "content": "1st SUBMIT to 1st A/O APPROVE", "No": "2"},
  { "type": "", "content": "1ST APPROVE TO 1ST A/0 APPROVE", "No": "31"}, { "type": "3RD", "content": "LAST APPROVE TO 1ST A/0 APPROVE", "No": "1"},{ "type": "", "content": "1ST APPROVE TO LAST A/0 APPROVE", "No": "6"},{ "type": "", "content": "LAST APPROVE TO LAST A/0 APPROVE", "No": "2"}

  ];
  public KYCAccountCycle: any = [{ "type": "", "content": "A/O APPLICATION RECEIVED TO 1ST A/O APPROVE ", "No": "3"}
 

  ];

  public ScanningDocs: any = [{ "YTD": "SCANNER","CM":"42931","LM":"40236","MDM":"20%","RQ":"red"},{ "YTD": "PDF/TIFF","CM":"253","LM":"8563","MDM":"05%","RQ":"red"},{ "YTD": "DOC EDIT","CM":"125","LM":"145","MDM":"05%","RQ":"green"},{ "YTD": "ENTITY","CM":"9958","LM":"275","MDM":"29%","RQ":"red"},{ "YTD": "CATEGORY","CM":"2367","LM":"144","MDM":"20%","RQ":"red"},{ "YTD": "AUTHORIZATIC","CM":"142","LM":"3687","MDM":"20%","RQ":"red"}
  
  
 
   ];
  public defaultSelection: any = { "REGION": "Nam", "FREQUENCY": "Monthly", "PRODUCTS": "All", "ACCOUNT_TYPE": "Individual" , "selectedUsers" : "All" };
  
  constructor(private session: SessionService) { }
  ngOnInit(): void {
    debugger;
    this.session.getFilters().subscribe((data) => {
      debugger;
      this.filterAndSideLinkData = data;
    });
    this.session.getOboardData().subscribe((data) => {

      this.onBoardData = data;
      console.log(this.onBoardData);
    });
    this.filteredACCycleData = this.acCycleData.filter(obj =>
      obj.type == this.defaultSelection.selectedUsers
    );
  }

  ngAfterViewInit(): void {

  }

  public onDDItemClick(e: any, prodName: any): void {
    debugger;
    this.defaultSelection.PRODUCTS = prodName;
    
  }

  public onSelectFilter() {

  }
  public seletedType(type:any){
    this.filteredACCycleData = this.acCycleData.filter(obj =>
      obj.type == type
    );

  }

  toggleSelectedBox(newValue: string) {
    
	if (this.selectedBox === newValue) {
      
		this.selectedBox = "";
		this.acOpeningFlag = false;
		this.kycFlag = false;
		this.acMaintFlag = false;
    this.scanningDocsFlag=false;
     this.acMaintFlagcard=false;
    this.scanningDocsFlagcard=false;
   // nikhil
    this.webEnrollmentsFlag = false;
    this.nameScreeningFlag = false;
    this.webEnrollmentsFlagcard = false;
    this.nameScreeningFlagcard = false;
    
	}
    
	else {
		this.selectedBox = newValue;
		if (this.selectedBox == "acOpening") {
			this.kycFlag = true;
			this.acMaintFlag = true;
			this.scanningDocsFlag=true;
      //nikhil
      this.webEnrollmentsFlag = true;
      this.nameScreeningFlag = true;
      
		}

		if (this.selectedBox == "KYC") {
			this.acOpeningFlag = true;
			this.acMaintFlag = true;
			 this.scanningDocsFlag=true;
      //nikhil
      this.webEnrollmentsFlag = true;
      this.nameScreeningFlag = true;
		}
      
		if (this.selectedBox == "acMain") {
			this.acOpeningFlag = true;
			this.kycFlag = true;
			this.scanningDocsFlag=true;
			this.scanningDocsFlagcard=true;

      //nikhil
      this.webEnrollmentsFlag = true;
      this.nameScreeningFlag = true;
    }
	if (this.selectedBox == "scanningDocs") {
      // this.acOpeningFlag = true;
      // this.acMaintFlag = true;
      // this.kycFlag = true;
      // this.webEnrollmentsFlag=true;
      this.acOpeningFlag = true;
      this.kycFlag = true;
      this.nameScreeningFlag = true;
       this.scanningDocsFlag=true;
      this.webEnrollmentsFlag=true;
      this.acMaintFlagcard=true;
    }
    
    //nikhil
    if (this.selectedBox == "webEnrollments") {
	this.acOpeningFlag = true;
      this.acMaintFlag = true;
      //nikhil
      this.kycFlag = true;
      this.nameScreeningFlag = true;
      this.scanningDocsFlag=true;
      this.nameScreeningFlagcard=true;

        
    }
    
    if (this.selectedBox == "nameScreening") {
			this.acOpeningFlag = true;
      this.acMaintFlag = true;
      //nikhil
      this.kycFlag = true;
      //this.webEnrollmentsFlag = true;
      this.webEnrollmentsFlagcard=true;
      this.scanningDocsFlag=true;
      //this.nameScreeningFlag=true;
		}
      
	}
  
}

}

