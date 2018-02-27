import { Component } from '@angular/core';
//import { SessionService } from '../../common-service/session.service';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html'
})
export class AppFooterComponent { 
  // public cdsDateTime; 
  // public fitekDateTime; 
  constructor(){}
  // constructor( private session:SessionService){}
  ngOnInit(): void {
      // debugger;
      // this.session.getTradeDetails().subscribe((data)=>{ //use methods in our service
      //   data.FEEDDATA.forEach(element => {
      //     if(element.feedType == 'CDS'){
      //       this.cdsDateTime = element.dateTime;
      //     }else if(element.feedType == 'FITEK'){
      //       this.fitekDateTime = element.dateTime;
      //     }
      //   });
        
    
      // }, (err)=>{
      //   console.log(err);
      // });
    }

}
