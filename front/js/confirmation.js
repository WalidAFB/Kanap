const id = new URLSearchParams(window.location.search).get("id")
const orderId = document.getElementById("orderId")
orderId.innerHTML = id