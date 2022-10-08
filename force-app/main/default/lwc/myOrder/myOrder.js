import { LightningElement,wire,track } from 'lwc';
import getPurchaseHistory from '@salesforce/apex/ShoppingCartService.getPurchaseHistory';
const COLS=[
    {label:'PO Id',fieldName:'Id',sortable: "true"},
    {label:'Status',fieldName:'Status__c',sortable: "true",sortable: "true"},
    {label:'Order Total',fieldName:'Order_Total__c',sortable: "true",sortable: "true"}
]

export default class MyOrder extends LightningElement {
    record
    purchaseOrder
    columns=COLS
    pageNumber=1;
    @wire(getPurchaseHistory)
    rerenderComponent({error,data}){
        if(data && data.length > 0){
            this.record=data;
            this.columns=this.columns;
            this.purchaseOrder=data;
        }
        else if (error){
            this.purchaseOrder=undefined;
         }
    }

    showProduct(){
        this.dispatchEvent(new CustomEvent('product'));
    }
}