global with sharing class ShoppingCartService {
    @AuraEnabled(cacheable=true)
    global static List<PurchaseOrder__c> getPurchaseHistory(){
        return service().getPurchaseHistory();
    }

    @AuraEnabled(cacheable=true)
    global static List<Product2> getAllProduct(){
        return service().getAllProduct();
    }

    @AuraEnabled(cacheable=true)
    global static List<Product2> getSelectByIds(String idSet){
        List<ID> ids=(List<ID>)JSON.deserialize(idSet, List<ID>.class);
        return service().selectById(ids);
    }

    @AuraEnabled
    global static String saveOrder(String items){
        try {
            Integer total=0;
            List<Object> orders = (List<Object>)JSON.deserializeUntyped(items);
            System.debug('Save Orders: ' + orders);
            List< Map<String,Object> > productItem=new List< Map<String,Object> >();  
            for(Object order: orders) {
                System.debug('Orders loop : ' + orders);
                Map<String, Object> item = (Map<String, Object>)order;
                productItem.add(item);
                total=total+(Integer)(item.get('Total'));
            }
            //List<any> orders=(List<Object>)JSON.deserialize(items, List<Object>.class);
            system.debug(total);
            Id i=service().insertPurchase(total);
            service().insertPurchaseLineItem(i, productItem);
            system.debug(i);
            return 'done';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    private static IShoppingCartService service(){
        return new ShoppingCartServiceImpl();
    }
}
