public class PurchaseOrderSelector extends fflib_SObjectSelector implements IPurchaseOrderSelector {
    public Schema.SObjectType getSObjectType() {
        return PurchaseOrder__c.sObjectType;
    }
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            PurchaseOrder__c.Id,
            PurchaseOrder__c.Status__c,
            PurchaseOrder__c.Order_Total__c
            };
    }
    public List<PurchaseOrder__c> getAllPurchaseOrder(){
        return [SELECT Id,Status__c,Order_Total__c FROM PurchaseOrder__c];
    }

}
