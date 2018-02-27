import { Injectable } from '@angular/core';

@Injectable()
export class ColumnsService {

  constructor() { }

  getFormattedJSON(type, jsonDATA: any) {
    var finalData: any;
    
    //console.log("columnsService");
    if (type == 'MF Offshore RF/DF Failed' || type == 'MF Onshore RF/DF Failed') {
      finalData = jsonDATA.map(o => {
        return {
          "Trade Id": o.TRADE_ID,
          "Account Number": o.ACCOUNT_NUMBER,
          "Account Name": o.ACCOUNT_SHORT_NAME,
          "Trade Date": o.TRADE_DATE,
          "Contractual Settlement Date": o.TRADE_SETTLE_DATE,
          "CUSIP": o.CUSIP,
          "ISIN": o.ISIN,
          "Asset Short Name": o.ASSET_SHORT_NAME,
          "Trade Type": o.TRADE_TYPE,
          "Original Amount": o.ORIGINAL_AMOUNT,
          "Shares": o.SHARES,
          "Net Trade Amount": o.NET_PLUS_AI_AMOUNT,
          "Price": o.PRICE,
          "Principal Amount": o.PRINCIPAL,
          "Trade Status": o.DASHBOARD_STATUS,
          "Registration": o.REGISTRATION,
          "Location": o.LOCATION,
          "Settlement Location": o.SETTLEMENT_LOCATION,
          "Settlement Currency": o.SETTLEMENT_CURRENCY,
          "Explanation": o.EXPLANATION,
          "Hold Date": o.HOLD_DATE,
          "Hold Date Open": o.HOLD_DATE_OPEN,
          "Processing Date": o.PROCESSING_DATE,
          "Reversed?": o.REVERSED,
          "Accrued Interest Amount": o.ACCURED_INTEREST_AMT,
          "Net + AI Amount": o.NET_PLUS_AI_AMOUNT,
          "Block Indicator": o.BLOCK_INDICATOR,
          "Clearing Broker": o.CLEARING_BROKER,
          "Executing Broker": o.EXECUTING_BROKER,
          "Account Administrator": o.ADMINISTRATOR,
          "Backup Investment Officer": o.BACKUP_INVESTMENT_OFFICER,
          "Broker Amount": o.BROKER_AMOUNT,
          "Confirm File Date": o.CONFIRM_FILE_DATE,
          "Confirm Trade Id": o.CONFIRM_TRADE_ID,
          "Create User": o.CREATED_BY,
          "Last Modified Date": o.LAST_MODIFIED_DATE,
          "Last Modified User": o.LAST_MODIFIED_USER,
          "Maturity Date": o.MATURITY_DATE,
          "Optional Fee 1 Amount": o.OPTIONAL_FEE_1_AMOUNT,
          "Optional Fee 2 Amount": o.OPTIONAL_FEE_2_AMOUNT,
          "SEC Fee Amount": o.SEC_FEE,
          "Corporate Action Event Type": o.CORPORATE_ACTION_EVENT_TYPE,
          "Line of Business": o.LINE_OF_BUSINESS,
          "Comments": o.COMMENTS,
          "Comments logged by SOEID": o.COMMENTS_LOGGED_BY_SOEID
        };
      });
    }
    else if (type == 'Global Pending') {
      
      finalData = jsonDATA.map(o => {
        return {
          "TRADEID": o.TRADE_ID,
          "SWIFT SEME": o.SWIFT_SEME,
          "Trade Date": o.TRADE_DATE,
          "Contractual Settlement Date": o.TRADE_SETTLE_DATE,
          "Trade Status": o.STATUS_MESSAGE,
          "Trade Type": o.TRADE_TYPE,
          "Account Number": o.ACCOUNT_NUMBER,
          "ISIN": o.ISIN,
          "CUSIP": o.CUSIP,
          "SHARES": o.SHARES,
          "Principal Amount": o.PRINCIPAL,
          "Net + AI Amount": o.NET_PLUS_AI_AMOUNT,
          "Settlement Currency": o.SETTLEMENT_CURRENCY,
          "Price": o.PRICE,
          "Settlement Location": o.SETTLEMENT_LOCATION,
          "Clearing Broker": o.CLEARING_BROKER,
          "Executing Broker": o.EXECUTING_BROKER,
          "Registration": o.REGISTRATION,
          "Location": o.LOCATION,
          "Account Administrator": o.ADMINISTRATOR,
          "Backup Investment Officer": o.BACKUP_INVESTMENT_OFFICER,
          "Line of Business": o.LINE_OF_BUSINESS,
          "Last Modified User": o.LAST_MODIFIED_USER,
          "CREATED BY": o.CREATED_BY,
          "Processing Date": o.PROCESSING_DATE,
          "Hold Date Open": o.HOLD_DATE_OPEN,
          "Hold Date": o.HOLD_DATE,
          };
      });
    }
    else if (type == 'Global Incomplete'){
      finalData = jsonDATA.map(o => {
        return {
          "Matched?": '',
          "Block Indicator": o.BLOCK_INDICATOR,
          "Trade #": o.uniqueTradeKey,
          "Internal Confirm #": '',
          "DTC Confirm #": '',
          "SWIFT SEME": o.SWIFT_SEME,
          "Status": o.TRADE_STATUS,
          "Trade Type": o.TRADE_TYPE,
          "Logged By": '',
          "Quantity": o.QUANTITY,
          "Asset": '',
          "Account": '',
          "Administrator": o.ADMINISTRATOR,
          "Registration": o.REGISTRATION,
          "Location": o.LOCATION,
          "Price": o.PRICE,
          "Principal": o.PRINCIPAL,
          "Net": '',
          "Accrued Interest Amount": '',
          "Net + AI": '',
          "Brokerage": '',
          "SEC Fee": o.SEC_FEE,
          "P I Amount": '',
          "Original Face": o.ORIGINAL_FACE,
          "Trade Date": o.TRADE_DATE,
          "Settle Date": o.TRADE_SETTLE_DATE,
          "Posted Date": '',
          "Actual Settlement Date": '',
          "Cancel Date": '',
          "Hold Date": '',
          "Hold Date Open": '',
          "Swift Eligible": '',
          "Stamp Duty Code": o.STAMP_DUTY_CODE,
          "Settlement Location": o.SETTLEMENT_LOCATION,
          "Settlement Currency": o.SETTLEMENT_CURRENCY,
          "Executing Broker": '',
          "Clearing Broker": '',
          "Affirm Type": '',
          "Timestamp Entered": '',
          "Source": o.SOURCE,
          "Asset Type": o.ASSET_TYPE,
          "Status Message": o.STATUS_MESSAGE
        };
      });
    }
    else if (type == 'Global Failed') {
      finalData = jsonDATA.map(o => {
        return {
          "Account ID": o.CDS_ACCOUNT_ID,
          "Account Number": o.ACCOUNT_NUMBER,
          "Investment Officer": o.BACKUP_INVESTMENT_OFFICER,
          "Administrator": o.ADMINISTRATOR,
          "Line Of Business": o.LINE_OF_BUSINESS,
          "Trade Date": o.TRADE_DATE,
          "CSD": o.TRADE_SETTLE_DATE,
          "Txn Type": o.CDS_TXN_TYPE,
          "Quantity": o.QUANTITY,
          "ISIN": o.ISIN,
          "Issue Name": o.CDS_ISSUE_NAME,
          "CCY": o.CDS_CCY,
          "Settlement Amount": o.CDS_SETTLEMENT_AMOUNT,
          "Client Reference": o.CDS_CLIENT_REF_NO,
          "Citi Reference": o.CDS_CITI_REF_NO,
          "Settlement Location": o.SETTLEMENT_LOCATION,
          "Counterparty": o.CDS_COUNTERPARTY,
          "Fail Description": o.CDS_FAILED_DESCRIPTION,
          "Comments": o.COMMENTS,
          "Fail Text": o.FAILED_REASON,
          "Fail Text(Contd.)": o.FAILTEXT_CONTD
        };
      });
    } else{
      
      finalData=jsonDATA;
    }
    //console.log(finalData);
    return finalData;
  }
}
