<script>
// Register the GSAP plugins
    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

    // Select the SVG path, rocket, markers, and target section
    const svg = document.querySelector("#arcSVG");
    const path = document.querySelector("#arcPath");
    const rocket = document.querySelector("#rocket");
    const targetSection = document.querySelector("#launchSection");

    // Get the total path length and the markers
    const pathLength = path.getTotalLength();
    const markers = document.querySelectorAll(".stage-marker");
    const markerCount = markers.length;

    // Array to store snapping points as progress values
    const snapPoints = [];

// Position each marker along the path and calculate snap points
markers.forEach((marker, index) => {
  const position = index * (pathLength / (markerCount - 1)); // Calculate marker position along path
    const point = path.getPointAtLength(position);

    // Convert the point position to percentages of the viewBox to handle scaling
    const xPercent = (point.x / svg.viewBox.baseVal.width) * 100;
    const yPercent = (point.y / svg.viewBox.baseVal.height) * 100;

    // Set the marker's position using percentage values to align with the path
    marker.style.left = `${xPercent}%`;
    marker.style.top = `${yPercent}%`;

    // Store snap points as normalized values (from 0 to 1 based on index)
    snapPoints.push(position / pathLength);
});

    // Set initial dasharray and dashoffset to hide the path
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    // Dynamically set section height to ensure the full animation completes
    const baseScrollHeight = 6000; // Base height for comfortable scroll experience
    const sectionHeight = Math.max(baseScrollHeight, pathLength * 3); // Adjust multiplier as needed
    gsap.set(targetSection, {height: `${sectionHeight}px` });

    // Adjust scrub value to control animation speed independently of section height
    const animationSpeed = 1.5; // Higher for slower, lower for faster

    // GSAP animation to progressively draw the path and move the rocket along it based on scroll
    gsap.to(path, {
        scrollTrigger: {
        trigger: targetSection,
    scrub: animationSpeed, // Control speed with this value
    start: "top top",
    end: "bottom bottom", // Always complete animation at section's end
    pin: true,
    pinSpacing: false,
    snap: {
        snapTo: snapPoints,
    duration: {min: 0.4, max: 0.7 },
    ease: "power2.inOut"
    }
  },
    strokeDashoffset: 0,
    ease: "none",
    onUpdate: function() {
    const progress = this.scrollTrigger.progress * pathLength;
    const point = path.getPointAtLength(progress);

    const xPercent = (point.x / svg.viewBox.baseVal.width) * 100;
    const yPercent = (point.y / svg.viewBox.baseVal.height) * 100;

    rocket.style.left = `${xPercent}%`;
    rocket.style.top = `${yPercent}%`;
  }
});
</script>