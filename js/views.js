window.onload = () => {
  changeView("#view-play")
}

function hideAllViews() {
  const viewElements = document.querySelectorAll(".view");
  for (const view of viewElements) {
    view.style.display = "none";
  }
}

function changeView(viewElementId) {
  const element = document.querySelector(`${viewElementId}`);
  if (element == null) throw new Error(`${viewElementId} element not found`);
  hideAllViews();
  element.style.display = "flex";
}

