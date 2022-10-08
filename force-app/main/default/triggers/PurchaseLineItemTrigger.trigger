trigger PurchaseLineItemTrigger on PurchaseOrderLineItem__c (after insert) {
    fflib_SObjectDomain.triggerHandler(PurchaseOrderLineItems.class);
}