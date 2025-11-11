// src/data.js
const base = import.meta.env.BASE_URL || '/';
const withBase = (p) => new URL(p, window.location.origin + base).href;

export const EXHIBITS = [
  {
    id: 1,
    title: "Cat",
    img: withBase("cat.jpg"),
    alt: "Monochrome abstract painting with sharp black and white geometric shapes.",
    desc: "A study in legibility and tension—clear edges, clear meaning.",
  },
  {
    id: 2,
    title: "Forest",
    img: withBase("forest.jpg"),
    alt: "Close-up of a marble statue face with soft lighting and visible texture.",
    desc: "When descriptions vanish, understanding follows.",
  },
  {
    id: 3,
    title: "Sculpture",
    img: withBase("sculpture.jpg"),
    alt: "Wide gallery room with framed artworks along white walls and wooden floor.",
    desc: "Focus lost in a maze of hidden states.",
  },
];
