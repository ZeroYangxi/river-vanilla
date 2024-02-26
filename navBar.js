document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menuIcon");
  const closeIcon = document.getElementById("closeIcon");
  const navBar = document.querySelector(".navBar");

  // 当点击menuIcon时，active.
  menuIcon.addEventListener("click", function () {
    navBar.classList.add("active");
    menuIcon.classList.add("active");
    closeIcon.classList.add("active");
    console.log(navBar.classList);
  });

  closeIcon.addEventListener("click", function () {
    navBar.classList.remove("active");
    menuIcon.classList.remove("active");
    closeIcon.classList.remove("active");
  });
});
