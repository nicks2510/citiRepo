export const config = {
    title: "Config File",
    apiCallTypeIsPost: false,
    "EntitlementService":"../assets/js/OpstechEntitlementJson.json",
    "EntitlementServicePost":"../service/Opstech/UserDetails",
    "GetTradeDetailService":"../assets/js/JSON_Trade_Details.json",
    "GetTradeDetailServicePost":"../service/TradeData/tradeDetails",
    "GetAuditDetailsServicePost":"../service/Opstech/commentHistory",
    "GetAuditDetailsService":"../assets/js/audit.json",
    "UpdateCommentService":"../assets/js/JSON_Trade_Details.json",
    "UpdateCommentServicePost":"../service/Opstech/updateComments",
    "feedStatusService":"../assets/js/JSON_Trade_Details.json",
    "feedStatusServicePost":"../service/Opstech/feedStatus",
    "UpdatePrefService":"../assets/js/JSON_Trade_Details.json",
    "UpdatePrefServicePost":"../service/Opstech/updatePreference",
    "SnapshotService":"../assets/js/snapshot.json",
    "SnapshotServicePost":"../service/Opstech/snapshot",
    "getColorCodeService":"../assets/js/ColorCode.json",
    "getColorCodePost":"../service/Opstech/ColorCode",
    "GetFiltersJsonUrl":"../assets/js/Filters.json",
    "GetFiltersPostUrl" : "",
    "GetOnboardJsonUrl":"../assets/js/Onboarding_Dashboard.json",
    "GetOnboardPostUrl" : ""
    
  };

  export var  userEntitlement = {};
  export var tradeDetails = [];
  export var feedStatus = [];
