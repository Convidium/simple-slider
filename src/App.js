import { useRef, useState } from "react";
import "./App.scss";
import image1 from "./pictures/1.jpg";
import image2 from "./pictures/2.jpg";
import image3 from "./pictures/3.jpg";
import image4 from "./pictures/4.jpg";
import image5 from "./pictures/5.jpg";
import image6 from "./pictures/6.jpg";
import image7 from "./pictures/7.jpg";
import image8 from "./pictures/8.jpg";

function App() {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  

  const handleOnDown = (e) => {
    setIsDragging(true);
    trackRef.current.dataset.mouseDownAt = e.clientX;
  };

  const handleOnUp = () => {
    setIsDragging(false);
    trackRef.current.dataset.mouseDownAt = "0";
    trackRef.current.dataset.prevPercentage = trackRef.current.dataset.percentage;
  };

  const handleOnMove = (e) => {
    if (!isDragging) return;
    // Adjust 'multiplier' and 'scrollStrength' value to your own preference
    const multiplier = 2;
    const scrollStrength = -100;

    if (trackRef.current.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(trackRef.current.dataset.mouseDownAt) - e.clientX;
    const maxDelta = window.innerWidth * multiplier;

    const percentage = (mouseDelta / maxDelta) * scrollStrength;
    const nextPercentageUnconstrained = parseFloat(trackRef.current.dataset.prevPercentage) + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    trackRef.current.dataset.percentage = nextPercentage;

    trackRef.current.animate(
      {
        transform: `translate(${nextPercentage}%, -50%)`,
      },
      { duration: 1200, fill: "forwards" }
    );

    for (const image of trackRef.current.getElementsByClassName("image")) {
      image.animate(
        {
          objectPosition: `${100 + nextPercentage}% center`,
        },
        { duration: 1200, fill: "forwards" }
      );
    }
  };

  window.onmousedown = handleOnDown;
  window.onmouseup = handleOnUp;
  window.onmousemove = handleOnMove;
  window.ontouchstart = (e) => handleOnDown(e.touches[0]);
  window.ontouchend = (e) => handleOnUp(e.touches[0]);
  window.ontouchmove = (e) => handleOnMove(e.touches[0]);

  return (
    <div className="App">
      <div id="image-track" ref={trackRef} data-mouse-down-at="0" data-prev-percentage="0">
        {[image1, image2, image3, image4, image5, image6, image7, image8].map((image, index) => (
          <img key={index} className="image" src={image} isDragging={false} draggable="false" alt={`Slide ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default App;