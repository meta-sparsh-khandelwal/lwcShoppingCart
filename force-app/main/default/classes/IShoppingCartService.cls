public interface IShoppingCartService {
    List<PurchaseOrder__c> getPurchaseHistory();
    List<Product2> getAllProduct();
    List<Product2> selectById(List<ID> idSet);
    Id insertPurchase(Integer total);
    void insertPurchaseLineItem(Id purchaseId,List< Map<String,Object> > productItem);
} 