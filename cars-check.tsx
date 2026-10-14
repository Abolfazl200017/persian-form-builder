import {array, define} from '@react-form-builder/core';
type Car = {name: string; carType: 'sedan'|'offroad'; quantity: number};
function CarsComponent({cars = []}: {cars?: Car[]}) {return <div>{cars.length}</div>;}
export const carsComponent = define(CarsComponent, 'CarsComponent').props({
 cars: array.named('خودروها').default([{name:'تویوتا',carType:'sedan',quantity:1}]).withEditorProps({columns:[
 {name:'name',title:'نام',inputName:'InputCell'},
 {name:'carType',title:'نوع خودرو',inputName:'SelectCell',inputProps:{options:[{label:'سدان',value:'sedan'},{label:'آفرود',value:'offroad'}]}},
 {name:'quantity',title:'تعداد',inputName:'InputCell',inputProps:{type:'number'}}
 ]})
});
