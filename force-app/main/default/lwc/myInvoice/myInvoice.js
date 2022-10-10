import { LightningElement,api } from 'lwc';

const COLS=[
    {label:'Name',fieldName:'Name',sortable: "true"},
    {label:'Product Code',fieldName:'ProductCode',sortable: "true"},
    {label:'Price',fieldName:'Price__c',sortable: "true"},
    {label:'Units',fieldName:'Unit',sortable: "true"},
    {label:'Total',fieldName:'Total',sortable: "true"}
]

export default class MyInvoice extends LightningElement {
    @api invoiceItem=[]
    Item=function(Id,Name,ProductCode,Price__c,Unit,Total){
        this.Id=Id;
        this.Name=Name;
        this.Price__c=Price__c;
        this.ProductCode=ProductCode;
        this.Unit=Unit;
        this.Total=Total;
    }
    pageNumber=1
    hideCheckBox=!false
    columns=COLS
    _items=[]
    @api get item(){
        this.invoiceItem.forEach(element=>{
            this._items.push(new this.Item(element.Id,element.Name,element.ProductCode,element.Price__c,element.Unit,element.Unit*element.Price__c));
        })
        return this._items;
    }
    @api 
    get todayDate(){
        return new Date().toLocaleDateString();
    }
    @api
    get invoiceNumber(){
        return Math.floor(Math.random()*100000000);
    }

    handleOnPlace(){
        this.dispatchEvent(new CustomEvent('place',{detail:this._items}));
    }



}
