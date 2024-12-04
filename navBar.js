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

  document.getElementById("craft").addEventListener("click", function (e) {
    e.preventDefault(); // 阻止默认跳转
    smoothScrollToElement("projects");
  });
});

// 主界面跳转的 function
function smoothScrollToElement(elementId) {
  const element = document.getElementById(elementId);

  // 如果已经在当前页面
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else {
    // 如果需要跳转到另一个页面，先跳转，然后滚动
    window.location.href = `index.html#${elementId}`;
  }
}

// 使用示例
// smoothScroll for 'Craft'
