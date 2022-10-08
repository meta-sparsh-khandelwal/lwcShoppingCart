import { LightningElement,api,track,wire } from 'lwc';
import getSelectByIds from '@salesforce/apex/ShoppingCartService.getSelectByIds';

const COLS=[
    {label:'Name',fieldName:'Name',sortable: "true"},
    {label:'Price',fieldName:'Price__c',sortable: "true"},
    {label:'Product Code',fieldName:'ProductCode',sortable: "true"},
    {label:'Units',fieldName:'Unit',editable: true,type:'number',sortable: "true"},
    {type:"button-icon",label:'Delete',typeAttributes:{
        iconName: 'utility:delete',
        value:'Delete',
        name:'Delete',
        disabled:false,
    }}
];
export default class MyCart extends LightningElement {
    @track columns=[]
    _productData=[]
    hideCheckBox
    pageNumber=1
    preIds=[]
    Product=function(Id,Name,Price__c,ProductCode,Unit){
        this.Id=Id;
        this.Name=Name;
        this.Price__c=Price__c;
        this.ProductCode=ProductCode;
        this.Unit=Unit;
    }

    @api
    get product(){
        return this._productData;
    }
    set product(value){
        this._productData=[...value];
    }


    connectedCallback(){
        this.columns=COLS;
    }

    handleSave(event){
        let update=true;
        let draftValue=event.detail.draft;
        for(let i=0;i<draftValue.length;i++){
            let rec = this._productData.find( e => e.Id == draftValue[i].Id );
            if(isNaN(parseInt(draftValue[i].Unit)) || parseInt(draftValue[i].Unit)<=0){
                alert(`${rec.Name} Invalid Quantity`);
                update=false;
                break;
            }
            if(rec.Available_Units__c < (draftValue[i].Unit-rec.Unit)){
                alert(`${rec.Name} Insufficient Quantity`);
                update=false;
                break;
            }
            else{
                let index=this._productData.findIndex(e=>e.Id==draftValue[i].Id);
                draftValue[i].Unit=draftValue[i].Unit-this._productData[index].Unit;
            }
        }
        if(update){
            this.pageNumber=event.detail.pageNumber;
            this.template.querySelector('c-custom-data-table').draftValues=[];
            this.dispatchEvent(new CustomEvent('changecart',{detail:draftValue}));
        }
        this.pageNumber=event.detail.pageNumber;
        this._productData=[...this._productData];
        this.template.querySelector('c-custom-data-table').draftValues=[];
    }
    handleDeleteRecord(event){
        let data=event.detail.deleteRecord;
        this._productData=this._productData.filter(ele=>ele.Id!=data.Id);
        this.template.querySelector('c-custom-data-table').isShowModal=false;
        this.dispatchEvent(new CustomEvent('delete',{detail:data.Id}));
        this._productData=[...this._productData];
        this.pageNumber=event.detail.pageNumber;
    }
    handleCheckOut(){
        this.dispatchEvent(new CustomEvent('checkout'));
    }
}