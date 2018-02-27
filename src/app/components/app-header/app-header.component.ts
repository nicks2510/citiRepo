import { Component } from '@angular/core';
//import { SessionService } from '../../common-service/session.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {
  public currentUser; public soeid; public loggedinTime;
  constructor(){}
  // constructor( private session:SessionService){}
ngOnInit(): void {

  // this.session.getEntitlement().subscribe((data)=>{ //use methods in our service
  //   debugger;
    this.currentUser = "SIMLOTE, PRAVEEN";
    this.soeid = "PS90014";
    this.loggedinTime = "Monday, January 22, 2018 ";

  // }, (err)=>{
  //   console.log(err);
  // });
}
}
