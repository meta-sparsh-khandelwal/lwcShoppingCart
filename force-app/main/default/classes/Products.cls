public class Products extends fflib_SObjectDomain implements IProductDomain{
    public Products(List<Product2> sObjectList) {
        super(sObjectList);
    }
    public class Constructor implements fflib_SObjectDomain.IConstructable {
        public fflib_SObjectDomain construct(List<SObject> sObjectList) {
            return new Products(sObjectList);
        }
    }
    public void updateProductQuantity(Map<Id,Integer> updateProduct){
        for(Product2 pro:(List<Product2>)records){
            Integer unit=updateProduct.get(pro.Id);
            pro.Available_Units__c=pro.Available_Units__c-unit;
        }
        update records;
    }

}
