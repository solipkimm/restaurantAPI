let restaurantData = [];
let currentRestaurant = {};
let page = 1;
let perPage = 10;
let map = null;

function avg(grades){
  let total = 0;

  if (grades.length > 0){
    for (let i = 0; i < grades.length; i++){
      total += element.grade;
    }
  }
  return (total/grades.length).toFixed(2);
}