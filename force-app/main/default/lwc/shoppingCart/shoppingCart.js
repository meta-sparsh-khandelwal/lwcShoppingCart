import { LightningElement,track } from 'lwc';
import saveOrder from '@salesforce/apex/ShoppingCartService.saveOrder';

export default class ShoppingCart extends LightningElement {
    prevHistory=true;
    newPurchase=false;
    invoiceShow=false;
    @track cartProducts=[];
   
    
    showProduct(){
        this.prevHistory = !this.prevHistory;
        this.newPurchase = !this.newPurchase;
    }
    handleCheckOut(event){
        this.newPurchase = !this.newPurchase;
        this.invoiceShow = !this.invoiceShow;
        this.cartProducts = event.detail;
    }
    handleOnPlace(event){
        saveOrder({items:JSON.stringify(event.detail)})
        .then(result=>{
            alert(result+' Successfully Placed your order');
            window.location.reload();
        })
        .catch(error=>{console.log(error)});
    }
}