import { LightningElement, wire,track,api } from 'lwc';
import getAllProduct from '@salesforce/apex/ShoppingCartService.getAllProduct';


const COLS=[
    {label:'Name',fieldName:'Name',sortable: "true" },
    {label:'Price',fieldName:'Price__c' ,sortable: "true"},
    {label:'Product Code',fieldName:'ProductCode' ,sortable: "true"},
    {label:'Available Units',fieldName:'Available_Units__c' ,sortable: "true"}
]

export default class ProductDetail extends LightningElement {
    @track products=null;
    msg='once';
    columns=COLS;
    @track record=null;
    hideCheckBox=true;
    showRowNumCol=true;
    showCart=false;
    @track cartProducts=null;
    @track allPreSelectedRecord=new Map();
    @track preSelectedRecord=[]; 
    @track pageNumber=1;
    cartProd=function(Id,Name,Price__c,ProductCode,Unit,Available_Units__c){
        this.Id=Id;
        this.Name=Name;
        this.Price__c=Price__c;
        this.ProductCode=ProductCode;
        this.Unit=Unit;
        this.Available_Units__c=Available_Units__c;
    }
    localProduct=function(Id,Name,Price__c,ProductCode,Available_Units__c){
        this.Id=Id;
        this.Name=Name;
        this.Price__c=Price__c;
        this.ProductCode=ProductCode;
        this.Available_Units__c=Available_Units__c;
    }

    @wire(getAllProduct)
    rerenderComponent({error,data}){
        this.record=[];
        if(data && data.length>0){
            console.log(data);
            data.forEach(element => {
                this.record.push(new this.localProduct(element.Id,element.Name,element.Price__c,element.ProductCode,element.Available_Units__c));
            });
            this.columns=COLS;
            this.hideCheckBox=false;
            this.products=[...this.record];
        }
        else if(error){
            this.products=undefined;
        }
    }
    renderedCallback(){
        console.log('product rerender');
    }
    handleOnChange(event){
        this.preSelectedRecord=event.detail.selected;
        this.pageNumber=event.detail.pageNumber;
    }
    handleKeyChange(event){
        const productName=event.target.value;
        this.columns=COLS;
        this.products=this.record.filter((ele)=>{
            return ele.Name.includes(productName);
        });
        this.products=[...this.products];
        this.pageNumber=1;
        
    }
    handleAddToCart(){ 
        if(this.preSelectedRecord.length==0){
            alert('Please select at least one product');
        }
        else{
        this.showCart=true;
        this.msg='repeat';
        for(let i = 0; i < this.preSelectedRecord.length; ++i) {
            let prod = this.record.find( e => e.Id == this.preSelectedRecord[i] );
            if(prod.Available_Units__c > 0) {
                if(this.allPreSelectedRecord.has(this.preSelectedRecord[i])){
                    this.allPreSelectedRecord.set(this.preSelectedRecord[i],this.allPreSelectedRecord.get(this.preSelectedRecord[i])+1);
                }
                else {
                    this.allPreSelectedRecord.set(this.preSelectedRecord[i],1);
                }
            }
            else {
                alert(`${prod.Name} have insuficient Quantity`);
            }
        }
        this.cartProducts = [];
        for (const key of this.allPreSelectedRecord.keys()) {
            let index = this.record.findIndex( ele => ele.Id == key );
            if(this.preSelectedRecord.find( e => e==key ) && this.record[index].Available_Units__c>0){
            this.record[index].Available_Units__c=this.record[index].Available_Units__c-1;
            this.cartProducts.push(new this.cartProd(this.record[index].Id,this.record[index].Name,this.record[index].Price__c,this.record[index].ProductCode,this.allPreSelectedRecord.get(this.record[index].Id),this.record[index].Available_Units__c));
            }
            else{
                this.cartProducts.push(new this.cartProd(this.record[index].Id,this.record[index].Name,this.record[index].Price__c,this.record[index].ProductCode,this.allPreSelectedRecord.get(this.record[index].Id),this.record[index].Available_Units__c));
            }
          }
        this.preSelectedRecord=[];
        this.template.querySelector('c-custom-data-table').records=this.record;
        this.record=[...this.record];
        this.products=[...this.record];
        this.cartProducts=[...this.cartProducts];
        this.pageNumber=1;
    }
        
    }
    handleChangeCart(event){
        event.detail.forEach(element=>{
            let index=this.record.findIndex(ele=>ele.Id==element.Id);
            this.record[index].Available_Units__c=this.record[index].Available_Units__c-element.Unit;
            index=this.cartProducts.findIndex(ele=>ele.Id==element.Id);
            let u=parseInt(this.cartProducts[index].Unit)+parseInt(element.Unit);
            this.cartProducts[index].Unit=u;
            this.allPreSelectedRecord.set(element.Id,u);
        });
        this.pageNumber=1;
        this.products=[...this.record];
    }

    handleDelete(event){
        let index=this.record.findIndex(ele=>ele.Id==event.detail);
        this.record[index].Available_Units__c=this.record[index].Available_Units__c+this.allPreSelectedRecord.get(event.detail);
        this.allPreSelectedRecord.delete(event.detail);
        this.cartProducts=this.cartProducts.filter(e=>e.Id!=event.detail);
        if(this.cartProducts.length ==0){
            this.showCart=false;
        }
        this.products=[...this.record];
    }
    handleCheckOut(){
        this.dispatchEvent(new CustomEvent('checkout',{detail:this.cartProducts}));
    }
}
