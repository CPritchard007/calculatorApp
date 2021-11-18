import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import data from '../../content.json'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { RemoveItemDialog } from '../Dialog/RemoveItemDialog';
interface RoomType {
    value: string;
    viewValue: string;
}

interface query {
    roomLabel: string;
    // roomType: string;
    width: number;
    height: number;
    cost: number;
    price: number;
    quantity: number;
    sqrFt: number;
    retailPrice: number;
    discount: number;
    discount2: number;
    installmentCost: number;
}
interface tables {
  name: string;
  list: query[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  USE_LOCAL_STORAGE = true;

  costOfInstallation = 47;
  profitMargin = 1.35;

  valWidth = 0;
  valHeight = 0;
  valRoomType = "";
  valCost = 0;
  valPrice = 0;
  quantity = 1;
  sqrFt = 0;
  retailPrice = 0;
  discount = 50.0;
  discount2 = 50.0;
  installmentCost = 0;


  roomLabel: string = "";
  roomTypes: Array<RoomType> = [];
  queriesArray: Array<tables> = [];

  currentTab = 0;

  ngOnInit() {
    
  }

  constructor(public dialog: MatDialog) {

    this.resetValues();
    if (this.USE_LOCAL_STORAGE) {
      this.queriesArray = [{name: "table 1", list: []}];
      let localStorageData = localStorage.getItem('queries');
      if (localStorageData) {
        this.queriesArray = JSON.parse(localStorageData);
      }
    }
  }

  updateInputs() {
    this.sqrFt = ((this.valWidth * this.valHeight) / 144) * this.quantity;
    
    if (this.valWidth >= 97) {
      this.retailPrice = 1216;
    } else if (this.valWidth >= 91) {
      this.retailPrice = 1149;
    } else if (this.valWidth >= 85) {
      this.retailPrice = 1081;
    } else if (this.valWidth >= 79) {
      this.retailPrice = 1013;
    } else if (this.valWidth >= 73) {
      this.retailPrice = 946;
    } else if (this.valWidth >= 67) {
      this.retailPrice = 878;
    } else if (this.valWidth >= 61) {
      this.retailPrice = 810;
    } else if (this.valWidth >= 55) {
      this.retailPrice = 742;
    } else if (this.valWidth >= 49) {
      this.retailPrice = 675;
    } else if (this.valWidth >= 43) {
      this.retailPrice = 607;
    } else if (this.valWidth >= 37) {
      this.retailPrice = 539;
    } else if (this.valWidth >= 31) {
      this.retailPrice = 471;
    } else {
      this.retailPrice = 404;
    }
    
    this.valCost = ((this.retailPrice * (this.discount / 100)) * (this.discount2 / 100)) * this.quantity;
    this.installmentCost = this.quantity * this.costOfInstallation;
    this.valPrice = Math.round((this.valCost + this.installmentCost) * this.profitMargin);
  }

  addToList() {
    this.queriesArray[this.currentTab].list.push({
      roomLabel: this.roomLabel,
      width: this.valWidth,
      height: this.valHeight,
      sqrFt: this.sqrFt,
      cost: this.valCost,
      price: this.valPrice,
      quantity: this.quantity,
      retailPrice: this.retailPrice,
      discount: this.discount,
      discount2: this.discount2,
      installmentCost: this.installmentCost
    });

    if (this.USE_LOCAL_STORAGE) localStorage.setItem('queries', JSON.stringify(this.queriesArray));
    this.resetValues();
  }

  removeFromList( i :number, event: any) {
    if (!event.ctrlKey) {
      const dialogRef = this.dialog.open(RemoveItemDialog);
      dialogRef.afterClosed().subscribe(result => {
        if (!result) return;
        this.queriesArray[this.currentTab].list.splice(i, 1);
        if (this.USE_LOCAL_STORAGE) localStorage.setItem('queries', JSON.stringify(this.queriesArray));
      });
    }
  }

  resetValues() {

    this.USE_LOCAL_STORAGE = data.USE_LOCAL_STORAGE;

    this.costOfInstallation = data.startingVars.costOfInstallation;
    this.profitMargin = data.startingVars.profitMargin;
    this.valRoomType = data.startingVars.roomType;
    this.roomLabel = data.startingVars.roomLabel;
    this.valWidth = data.startingVars.width;
    this.valHeight = data.startingVars.height;
    this.discount = data.startingVars.discount * 100;
    this.discount2 = data.startingVars.discount2 * 100;
    this.quantity = data.startingVars.quantity;

    data.roomType.forEach((element, i) => {
      this.roomTypes.push({value: element.value+(i+1), viewValue: element.viewValue});
    });
    
    this.updateInputs();
  }

  getFullSum(list: query[]) {
    let cost = 0;
    let price = 0;
    try {
      list.forEach(element => {
        cost += element.cost;
        price += element.price;
      });
    } catch (error) {
      console.log(error);
      if (error instanceof TypeError) {
        window.localStorage.removeItem('queries')
        window.location.reload();
      }
    }


    return {cost: cost , price: price};
  }

  tabChange(tabChangeEvent: MatTabChangeEvent) {
    if (tabChangeEvent.index === this.currentTab) return;
    this.currentTab = tabChangeEvent.index;
  }

  createTab() {
    this.queriesArray.push({name: "table " + (this.queriesArray.length + 1), list: []});
    if (this.USE_LOCAL_STORAGE) localStorage.setItem('queries', JSON.stringify(this.queriesArray));
  }

  closeTab(i: number) {
    this.queriesArray.splice(i, 1);
    if (this.USE_LOCAL_STORAGE) localStorage.setItem('queries', JSON.stringify(this.queriesArray));
  }

  openEditPannel (event: any) {
      let button = event.target;
      let input = button.parentElement.parentElement.childNodes[1];
      button.style.display = "none";
      input.style.display = "flex";
      
  }

  updateTabName(event: any) {
    let button = event.target;
    let input = button.parentElement.childNodes[0];
    let tabName = input.value;
    this.queriesArray[this.currentTab].name = tabName;
    if (this.USE_LOCAL_STORAGE) localStorage.setItem('queries', JSON.stringify(this.queriesArray));
    console.log(input.value);
    console.log(this.queriesArray);
    button.parentElement.style.display = "none";
    button.parentElement.parentElement.childNodes[0].childNodes[0].style.display = "flex";
    
  }
}