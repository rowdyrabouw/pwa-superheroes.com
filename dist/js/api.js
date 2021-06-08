let networkDataReceived = false;

fetch(API_URL)
  .then(res => {
    return res.json();
  })
  .then(data => {
    networkDataReceived = true;
    console.log("Retrieved from web", data);
    updateUI("web", data);
  });

readAllData(DYNAMIC_DB_STORE).then(data => {
  if (!networkDataReceived) {
    console.log("Retrieved from cache", data[0]);
    if (typeof data[0] !== "undefined") {
      updateUI("cache", data[0]);
    }
  }
});

function updateUI(updateBy, data) {
  console.log(`Update UI by ${updateBy}`);
  document.getElementById("name").innerHTML = data.name;
  const details = `${data.biography["full-name"]}, ${data.biography["place-of-birth"]}<br/>${data.appearance.height[1]} / ${
    data.appearance.weight[1]
  }`;
  document.getElementById("details").innerHTML = details;
  document.getElementById("image").innerHTML = `<img src="${data.image.url}" alt="${data.name}" />`;
  const all = document.getElementsByClassName("placeholder");
  for (let i = 0; i < all.length; i++) {
    all[i].style.backgroundColor = "transparent";
    all[i].style.animation = "none";
  }
}
