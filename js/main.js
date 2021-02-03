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