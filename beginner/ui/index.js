function toAbout() {
  window.location.href = "about.html";
}

async function fetchOrders() {
  const orders = await fetch("http://localhost:8080/orders");
  if (!orders.ok) {
    throw new Error("Could not fetch orders");
  }
  const ordersJson = await orders.json();
  console.log(ordersJson);
  renderOrders(ordersJson);
}

function renderOrders(ordersJson) {
  const orders = document.getElementById("order-list");
  if (!orders) {
    throw new Error("Could not find orders element");
  }
  orders.innerHTML = "";
  const orderDiv = document.createElement("table");
  orderDiv.innerHTML =
    "<th>Order ID</th><th>Order Name</th><th>Order Amount</th><th>Order Status</th><th>Order Date</th>";
  ordersJson.orders.forEach((order) => {
    orderDiv.innerHTML += `
    <tr>
      <td>${order.id}</td>
      <td>${order.name}</td>
      <td>${order.amount}</td>
      <td>${order.orderStatus}</td>
      <td>${order.orderDate}</td>
      <td><button onclick="handlerDeleteOrder(${order.id})">Delete</button></td>
    </th>
    `;
    orders.appendChild(orderDiv);
  });
}

function OrderDeleteComponent(id) {
  const deleteButton = document.createElement("button");
  deleteButton.onclick = () => handlerDeleteOrder(id);
  deleteButton.innerText = "Delete";
  return deleteButton;
}

async function handlerDeleteOrder(id) {
  const response = await fetch(`http://localhost:8080/orders/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Could not delete order");
  }
  fetchOrders();
}

async function handlerRegisterOrder(event) {
  event.preventDefault();
  const form = event.target.form;
  const formData = new FormData(form);
  const order = {
    itemId: formData.get("itemId"),
    name: formData.get("name"),
    amount: formData.get("amount"),
    orderStatus: formData.get("orderStatus"),
    orderDate: formData.get("orderDate"),
  };
  const response = await fetch("http://localhost:8080/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    throw new Error("Could not register order");
  }
  const responseJson = await response.json();
  console.log(responseJson);
  fetchOrders();
}
