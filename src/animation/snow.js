export const createElementSnow = (container) => {
  if (!container) return;

  var borders = ["50%", "0"];
  var blurs = ["0", "5px"];
  var colors = ["#fff", "#d9d9d9", "#f2f2f2", "#e0e0e0", "#cce7ff", "#b3e5fc"];
  var width = document.documentElement.clientWidth;
  var height = document.documentElement.clientHeight;
  var count = 40;

  for (var i = 0; i < count; i++) {
    var onLeft = Math.floor(Math.random() * width);
    var onTop = Math.floor(Math.random() * height);
    var color = Math.floor(Math.random() * 3);
    var widthElement = Math.floor(Math.random() * 5) + 5;
    var border = Math.floor(Math.random() * 5);
    var blur = Math.floor(Math.random() * 2);
    var time = Math.floor(Math.random() * 12) + 8;

    var div = document.createElement("div");
    div.style.backgroundColor = colors[color];
    div.style.position = "fixed";
    div.style.width = widthElement + "px";
    div.style.height = widthElement + "px";
    div.style.marginLeft = onLeft + "px";
    div.style.marginTop = onTop + "px";
    div.style.borderRadius = "50%";
    div.style.filter = `blur(${blurs[blur]}px)`;
    div.style.animation = `move ${time}s ease-in infinite`;

    container.appendChild(div);
  }
};
