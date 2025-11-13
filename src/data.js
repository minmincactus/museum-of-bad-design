// src/data.js
const base = import.meta.env.BASE_URL || '/';
const withBase = (p) => new URL(p, window.location.origin + base).href;

export const EXHIBITS = [
  {
    id: 1,
    title: "Cat",
    img: withBase("cat.jpg"),
    alt: "Painting of a cat with humanlike body and clothing, resembling the Mona Lisa, seated before a green landscape.",
  },
  {
    id: 2,
    title: "Forest",
    img: withBase("forest.jpg"),
    alt: "Oil painting of a sunlit forest in autumn, with tall trees, orange and yellow leaves, and a misty background.",
  },
  {
    id: 3,
    title: "Sculpture",
    img: withBase("sculpture.jpg"),
    alt: "Marble sculpture of three intertwined male figures struggling with large serpents, set against a plain wall.",
  },
];
