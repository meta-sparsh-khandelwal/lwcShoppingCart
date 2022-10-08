public class ShoppingCartServiceImpl implements IShoppingCartService{
    public List<PurchaseOrder__c> getPurchaseHistory(){
        return new PurchaseOrderSelector().getAllPurchaseOrder();
    }
    public List<Product2> getAllProduct(){
        return new ProductSelector().getAllProduct();
    }
    public List<Product2> selectById(List<ID> idSet){
        return new ProductSelector().selectById(idSet);
    }
    public void saveOrder(List<Object> orders){
        system.debug('saveorder');
    }
    public Id insertPurchase(Integer total){
        PurchaseOrder__c po=new PurchaseOrder__c(Status__c='Processing',Order_Date__c=Date.today(),Order_Total__c=total);
        insert po;
        return po.Id;
    }
    public void insertPurchaseLineItem(Id purchaseId,List< Map<String,Object> > productItem){
        List<PurchaseOrderLineItem__c> poli=new List< PurchaseOrderLineItem__c >();
        for(Map<String,Object> li:productItem){
            poli.add(new PurchaseOrderLineItem__c(Product__c=(Id)li.get('Id'),PurchaseOrder__c=purchaseId,Units__c=(Integer)li.get('Unit')));
        }
        insert poli;
    }
}
