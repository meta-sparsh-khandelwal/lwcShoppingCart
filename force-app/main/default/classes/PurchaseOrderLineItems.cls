public class PurchaseOrderLineItems extends fflib_SObjectDomain {
    public PurchaseOrderLineItems(List<PurchaseOrderLineItem__c> sObjectList) {
        super(sObjectList);
    }
    public class Constructor implements fflib_SObjectDomain.IConstructable {
        public fflib_SObjectDomain construct(List<SObject> sObjectList) {
            return new PurchaseOrderLineItems(sObjectList);
        }
    }
    public override void onAfterInsert(){
        Map<Id,Integer> productUnit=new Map<Id,Integer>();
        for(PurchaseOrderLineItem__c li : (List<PurchaseOrderLineItem__c>) Records) {
            productUnit.put(li.Product__c,(Integer)li.Units__c);
        }
        List<Product2> product=(List<Product2>)new ProductSelector().selectSObjectsById(productUnit.keySet());
        Products prod=new Products(product);
        prod.updateProductQuantity(productUnit);
    }
}
