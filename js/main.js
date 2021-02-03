/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Solip     Student ID: 120618194     Date: Feb 2 2021
*
*
********************************************************************************/ 

let restaurantData = [];
let currentRestaurant = {};
let page = 1;
let perPage = 10; // const?
let map = null;

function avg(grades){
  let total = 0;

  if (grades.length > 0){
    for (let i = 0; i < grades.length; i++){
      total += grades[i].score;
    }
  }
  return (total/(grades.length)).toFixed(2);
}

const tableRows = _.template(
  `<% _.forEach(restaurants, function(restaurant) { %>
    <tr data-id=<%- restaurant._id %>>
      <td><%- restaurant.name %></td>
      <td><%- restaurant.cuisine %></td>
      <td><%- restaurant.address.building %> <%- restaurant.address.street %></td>
      <td><%- avg(restaurant.grades) %></td>
    </tr>
  <% }); %>`);

function loadRestaurantData() {
  fetch("https://cryptic-lowlands-55609.herokuapp.com/api/restaurants?perPage=" + perPage + "&page=" + page)
    .then(response => response.json())
    .then(data => {
      restaurantData = data;
      let rows = tableRows({restaurants: data});
      $("#restaurant-table tbody").html(rows);
      $("#current-page").html(page);
    })
    .catch(err => console.error('Unable to load restaurants data:', err));    
}

// anonymous (“callback”) function
$(function(){
  loadRestaurantData();

  // Click event for table data
  $("#restaurant-table tbody").on("click", "tr", function(){
    dataID = $(this).attr("data-id");

    for(let i = 0; i < restaurantData.length; i++){
      if(restaurantData[i]._id == dataID){
        currentRestaurant = _.cloneDeep(restaurantData[i]);
        //currentRestaurant = restaurantData[i];

        $(".modal-title").html(currentRestaurant.name);
        $("#restaurant-address").html(currentRestaurant.address.building + " " + currentRestaurant.address.street);
        $("#restaurant-modal").modal({
          backdrop: 'static', // disable clicking on the backdrop to close
          keyboard: false // disable using the keyboard to close
        })
      }
    }
  });

  // Click event for the "previous page" button
  $("#previous-page").on("click", function(){
    if (page > 1){
      page --;
      loadRestaurantData();
    }
  });

  // Click event for the "next page" button
  $("#next-page").on("click", function(){
      page ++;
      loadRestaurantData();
  });

  // shown.bs.modal event for the "Restaurant" modal window
  $('#restaurant-modal').on('shown.bs.modal', function () {
    map = new L.Map('leaflet', {
      center: [currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]],
      zoom: 18,
      layers: [
          new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      ]
    });
  
    L.marker([currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]]).addTo(map);
  });

  // hidden.bs.modal event for the "Restaurant" modal window
  $('#restaurant-modal').on('hidden.bs.modal', function () {
    map.remove();
  });

})