import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { config } from '../config';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class SessionService {  
  userEntitlement = {};
  constructor(private http: HttpClient) { }
  getEntitlement(): Observable <any>{
    console.log("API NAME - getEntitlement()" );
    if(config.apiCallTypeIsPost)
    {
      return this.http.post(config.EntitlementServicePost, {}).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
    else
    {
      return this.http.get(config.EntitlementService).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
  }

  getTradeDetails(): Observable <any>{
    console.log("API NAME - getTradeDetails()" );
    if(config.apiCallTypeIsPost)
    {
      return this.http.post(config.GetTradeDetailServicePost, {}).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
    else
    {
      return this.http.get(config.GetTradeDetailService).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
  }
  getSnapshotDetails(inputJson:any): Observable <any>{
    console.log("API NAME - getSnapshotDetails()" );
    if(config.apiCallTypeIsPost)
    {
      return this.http.post(config.SnapshotServicePost, inputJson).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
    else
    {
      return this.http.get(config.SnapshotService).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
  }
  getAuditTrail(key:any): Observable <any>{
    console.log("API NAME - getAuditTrail()");
    if(config.apiCallTypeIsPost)
    {
      return this.http.post(config.GetAuditDetailsServicePost, {"SURROGATEKEY": key}).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
    else
    {
      return this.http.get(config.GetAuditDetailsService).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
  }
  updateComments(surroKey:any, commentValue: string): Observable <any>{
    //debugger;
    console.log("API NAME - updateComments(surrogateKey:any, comment: string)");
    if(config.apiCallTypeIsPost)
    {
      return this.http.post(config.UpdateCommentServicePost, {"surrogateKey": surroKey, "comments": commentValue}).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
    else
    {
      return this.http.get(config.UpdateCommentService).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
  }
  getFeedStatus(): Observable <any>{
    console.log("API NAME - getFeedStatus()");
    if(config.apiCallTypeIsPost)
    {debugger;
      return this.http.post(config.feedStatusServicePost, {}).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
    else
    {
      return this.http.get(config.feedStatusService).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
  }

  updatePref(value:any): Observable <any>{
    //debugger;
    console.log(value);
    console.log("API NAME - updatePref(value:any)");
    if(config.apiCallTypeIsPost)
    {
      return this.http.post(config.UpdatePrefServicePost, value).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
    else
    {
      return this.http.get(config.UpdatePrefService).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
  }

  // Get Snapshot Data Service
  getSnapshotData(inputJson:any): Observable <any>{
    //debugger;
    console.log("API NAME - getSnapshotData(value:any)");
    if(config.apiCallTypeIsPost)
    {
      return this.http.post(config.SnapshotServicePost, inputJson).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
    else
    {
      return this.http.get(config.SnapshotService).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
  }

  // Get ColorCode Data Service
  getColorCodeData(): Observable <any>{
    //debugger;
    console.log("API NAME - getSnapshotData(value:any)");
    if(config.apiCallTypeIsPost)
    {
      return this.http.post(config.getColorCodePost, "").map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
    else
    {
      return this.http.get(config.getColorCodeService).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
  }

  getFilters(): Observable <any>{
    console.log("API NAME - getTradeDetails()" );
    if(config.apiCallTypeIsPost)
    {
      return this.http.post(config.GetFiltersJsonUrl, {}).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
    else
    {
      return this.http.get(config.GetFiltersJsonUrl).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
  }

  getOboardData(): Observable <any>{
    console.log("API NAME - getOboardData()" );
    if(config.apiCallTypeIsPost)
    {
      return this.http.post(config.GetOnboardPostUrl, {}).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
    else
    {
      return this.http.get(config.GetOnboardJsonUrl).map(response => response)
      .catch((err: Response|any)=>{
        return Observable.throw(err.statusText);
      });
    }
  }

}
