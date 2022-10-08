public class ProductSelector extends fflib_SObjectSelector implements IProductSelector {
    public Schema.SObjectType getSObjectType() {
        return Product2.sObjectType;
    }
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Product2.Id,
            Product2.Name,
            Product2.Price__c,
            Product2.ProductCode,
            Product2.Available_Units__c
            };
    }
    public List<Product2> getAllProduct(){
        return [SELECT Id,Name,Price__c,ProductCode,Available_Units__c FROM Product2];
    }
    public List<Product2> selectById(List<ID> idSet){
        return [SELECT Id,Name,Price__c,ProductCode,Available_Units__c FROM Product2 WHERE ID in :idSet];
    }
}
