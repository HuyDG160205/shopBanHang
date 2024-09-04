document.querySelector("#add").addEventListener("click", (event) => {
  event.preventDefault();

  let item = {
    name: document.querySelector("#name").value,
    value: document.querySelector("#price").value,
    amount: document.querySelector("#amount").value,
    description: document.querySelector("#description").value,
    id: new Date().toISOString(),
  };

  if (!item.name || !item.value || !item.amount) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  addItemToUI(item);

  addItemToLS(item);
});

function addItemToUI(item) {
  const { name, value, amount, description, id } = item;

  let newCard = document.createElement("div");
  newCard.className = `item col-3 m-4 p-0 border border-1 border-dark`;
  newCard.setAttribute("id", id);
  newCard.innerHTML = `<div class="image d-flex justify-content-center">
                <img
                class="object-fit-fill"
                  src="https://vn-test-11.slatic.net/p/ee7eb2c93a886097aed4a1a0cfb12ff6.jpg"
                  alt=""
                />
              </div>
              <div class=" bg-primary bg-opacity-50 p-2 info-sm">
                <p class="fs-5">${name}</p>
                <div class=" d-flex justify-content-around">
                  <span class="discounted"> ${numberWithCommas(
                    value / 2
                  )} vnd</span>
                  <span class="price text-decoration-line-through">
                    ${numberWithCommas(value)} vnd</span
                  >
                </div>
              </div>`;

  // với mỗi item được add vào UI và LS, Mỗi cái listen
  newCard.addEventListener("click", (event) => {
    // remove active class from all items
    document
      .querySelectorAll(".item")
      .forEach((item) => item.classList.remove("active"));

    changeEverythingInInfo(item);
    document.querySelector("#delete").setAttribute("data-id", id);
    newCard.classList.add("active");
  });

  document.querySelector(".list").appendChild(newCard);
}

function changeEverythingInInfo(item) {
  document.querySelector("#name").value = item.name;
  document.querySelector("#price").value = item.value;
  document.querySelector("#amount").value = item.amount;
  document.querySelector("#description").value = item.description;
}

function addItemToLS(item) {
  let list = getlist();
  list.push(item);
  localStorage.setItem("listItem", JSON.stringify(list));
}

function getlist() {
  return JSON.parse(localStorage.getItem("listItem")) || [];
}

// initialize data once the page is loaded
(init = () => {
  let list = getlist();
  list.forEach((item) => addItemToUI(item));
})();

// // show the information when clicked
// document.querySelector(".list").addEventListener("click", (event) => {
//   if (event.target.classList.contains("item")) {
//   }
// });

document.querySelector("#delete").addEventListener("click", (event) => {
  if (event.target.dataset.id !== "") {
    let isConfirmed = confirm(
      `Bạn có muốn xóa item "${event.target.dataset.id}"`
    );

    if (isConfirmed) {
      let tmp = event.target.dataset.id;
      document.querySelector(`[id="${tmp}"]`).remove();
      removeItemFromLS(tmp);
      changeEverythingInInfo({
        name: "",
        value: "",
        amount: "",
        description: "",
      });
    }
    event.target.dataset.id = "";
    return;
  }

  let isConfirmed = confirm(`Bạn có muốn xóa hết item trong filter không?`);

  if (isConfirmed) {
    let inputValue = document.querySelector("#filter").value;

    let list = getlist();
    list = list.filter((item) =>
      item.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    console.log(list);

    document.querySelector(".list").innerHTML = "";
    list.forEach((item) => {
      removeItemFromLS(item.id);
    });
  }
});

function removeItemFromLS(id) {
  let list = getlist();
  list = list.filter((item) => item.id != id);
  localStorage.setItem("listItem", JSON.stringify(list));
}

document.querySelector("#clear").addEventListener("click", (event) => {
  changeEverythingInInfo({
    name: "",
    value: "",
    amount: "",
    description: "",
  });
  document.querySelector("#delete").setAttribute("data-id", "");
  document.querySelectorAll(".item").forEach((item) => {
    item.classList.remove("active");
  });
});

// filter
document.querySelector(".btn-filter").addEventListener("click", (event) => {
  event.preventDefault();
  let inputValue = document.querySelector("#filter").value;

  let list = getlist();
  list = list.filter((item) =>
    item.name.toLowerCase().includes(inputValue.toLowerCase())
  );
  document.querySelector(".list").innerHTML = "";
  list.forEach((item) => addItemToUI(item));
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
