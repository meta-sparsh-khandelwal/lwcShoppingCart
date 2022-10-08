import { LightningElement,api,track } from 'lwc';

export default class CustomDataTable extends LightningElement {
    @api columns=[]
    @track deleteRecord={}
    @api hideCheckBox= !false
    @api showRowNumCol= !false
    @api sortBy='';
    @api sortDirection='';
    _records
    @api preSelectedRows=[]
    @api draftValues = [];
    @api isShowModal = false;
    hasRerender=true;
    totalRecords = 0 //Total no.of records
    pageSize=10 //No.of records to be displayed per page
    totalPages //Total no.of pages
    rowOffset=0
    @api pageNumber=1 //Page number    
    @track recordsToDisplay //Records to be displayed on the page
    connectedCallback(){
        this.totalRecords = this._records.length; // update total records count  
        this.hasRerender=false;
        this.paginationHelper();  

    }
    renderedCallback(){
        console.log('rerender callback');
    }
    @api
    get records(){
        return this._records;
    }
    set records(value){
        this._records=[];
        this._records=[...value];
        this.pageNumber=1;
        this.totalRecords = this._records.length;
        this.rowOffset=0;
        this.paginationHelper(); 
    }
    get bDisableFirst() {
        return this.pageNumber == 1;
    }
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }
    previousPage() {

        this.pageNumber = this.pageNumber - 1;
        this.preSelectedRows=JSON.parse(JSON.stringify(this.preSelectedRows));
        this.rowOffset-=10;
        this.paginationHelper();
    }
    nextPage() {

        this.pageNumber = this.pageNumber + 1;
        this.preSelectedRows=JSON.parse(JSON.stringify(this.preSelectedRows));
        this.rowOffset+=10;
        this.paginationHelper();
    }
    firstPage() {
        this.rowOffset=0;
        this.pageNumber = 1;
        this.preSelectedRows=JSON.parse(JSON.stringify(this.preSelectedRows));
        this.paginationHelper();
    }
    lastPage() {
        this.rowOffset=10*(this.totalPages-1);
        this.pageNumber = this.totalPages;
        this.preSelectedRows=JSON.parse(JSON.stringify(this.preSelectedRows));
        this.paginationHelper();
    }
    paginationHelper() {
        let toDisplay = [];
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            toDisplay.push(this.records[i]);
        }
        this.recordsToDisplay=toDisplay;
    }

    handleSave(event){
        //this.draftValues=[]
        this.dispatchEvent(new CustomEvent('save',{detail:{draft:event.detail.draftValues,pageNumber:this.pageNumber}}));
    }

    handleRowSelection(event){
        event.preventDefault();
        let selectedRecords =JSON.parse(JSON.stringify(event.detail.selectedRows));
        let localPreSelected = [...this.preSelectedRows];
        if(selectedRecords.length >= 0){
        this.recordsToDisplay.forEach(element=>{
            if((selectedRecords.find(ele=>ele.Id===element.Id))===undefined){
                if(localPreSelected.find(elem=>elem===element.Id)){
                    
                    localPreSelected=localPreSelected.filter(e=>e!=element.Id);
                     
                }
            }
            else{
                if((localPreSelected.find(ele=>ele===element.Id))===undefined){
                    localPreSelected.push(element.Id);
                }
            }
        });
        this.preSelectedRows=localPreSelected;
    }
        this.dispatchEvent(new CustomEvent('change',{detail:{selected:this.preSelectedRows,pageNumber:this.pageNumber}}));
    }

    handleRowAction(event){
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch(actionName){
            case 'Delete':
                this.deleteRecord=row;
                this.isShowModal = true;
        }
    }
    hideModalBox(){
        this.isShowModal=false;
    }
    handleDeleteRecord(){
        this.dispatchEvent(new CustomEvent('delete',{detail:{deleteRecord:this.deleteRecord,pageNumber:this.pageNumber}}));
    }
    doSorting(event){
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        let parseData = JSON.parse(JSON.stringify(this._records));
        let keyValue = (a) => {
            return a[this.sortBy];
        };
        let isReverse = this.sortDirection === 'asc' ? 1: -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            if(typeof x==='string'){
                if(x<y){
                    return isReverse*-1;
                }
                else{
                    return isReverse*1;
                }
            }
            else{
            return isReverse * (x - y);
            }
        });
        this._records=parseData;
        this.paginationHelper();
        /**this.sortBy = event.detail.fieldName;
        event.preventDefault();
        console.log(event.detail.fieldName);
        console.log( event.detail.sortDirection);
        this.dispatchEvent(new CustomEvent('sort',{detail:{fieldName:event.detail.fieldName,sortDirection:event.detail.sortDirection}}));**/
    }
}