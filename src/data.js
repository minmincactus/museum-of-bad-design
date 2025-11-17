// src/data.js
const base = import.meta.env.BASE_URL || '/';
const withBase = (p) => new URL(p, window.location.origin + base).href;

export const EXHIBITS = [
  {
    id: 1,
    title: "Special Boy Birthday",
    img: withBase("bday.jpg"),
    badAlt: "decorations",
    alt: "Painting of a small fluffy animal in a party hat and a shirt that says 'SPECIAL BOY', standing under a hanging orange fish decoration."
  },
  {
    id: 2,
    title: "Handsome Squidward",
    img: withBase("squidward.jpg"),
    badAlt: "a face",
    alt: "Stylized green humanoid face with chiseled features and pink lips, glowing against a yellow and orange background."
  },
  {
    id: 3,
    title: "Smiley Chair",
    img: withBase("chair.jpg"),
    badAlt: "furniture",
    alt: "Bright yellow plastic chair with a simple face made from shapes, sitting on a concrete patio next to brick steps."
  },
  {
    id: 4,
    title: "Exploding Cat",
    img: withBase("fire.jpg"),
    badAlt: "no descriptions available",
    alt: "Painting of a brown cat stretched out mid-air against a background of bright yellow and orange brushstrokes."
  },
  {
    id: 5,
    title: "Autumn Forest Path",
    img: withBase("forest.jpg"),
    badAlt: "no descriptions available",
    alt: "Oil painting of an autumn forest with tall trees and a sunlit path covered in orange leaves."
  },
  {
    id: 6,
    title: "Lego Van Gogh",
    img: withBase("lego.jpg"),
    badAlt: "portrait",
    alt: "A portrait styled like Van Gogh but with a Lego head and red beard."
  },
  {
    id: 7,
    title: "Cat Mona Lisa",
    img: withBase("mona.jpg"),
    badAlt: "portrait",
    alt: "Painting of a cat dressed like the Mona Lisa, sitting with folded paws in front of a green landscape."
  },
  {
    id: 8,
    title: "Orange Face",
    img: withBase("orange.jpg"),
    badAlt: "a face",
    alt: "Surreal painting of a huge orange circle with a tiny human face in the center, floating above blue mountains."
  },
  {
    id: 9,
    title: "Bedroom on Fire",
    img: withBase("room.jpg"),
    badAlt: "warm",
    alt: "Painting of a cartoon dog sitting calmly in a wooden bedroom that is completely on fire, in a Van Gogh style."
  },
  {
    id: 10,
    title: "Laocoön Sculpture",
    img: withBase("sculpture.jpg"),
    badAlt: "no descriptions available",
    alt: "Marble sculpture of three muscular figures struggling as large snakes wrap around their bodies."
  },
  {
    id: 11,
    title: "Cursed Shrek",
    img: withBase("shrek.jpeg"),
    badAlt: "figure",
    alt: "Rough green statue of an ogre standing in a forest, wearing a beige vest and skirt."
  },
  {
    id: 12,
    title: "Cat in Space",
    img: withBase("space.jpg"),
    badAlt: "dark",
    alt: "A painted cat with a fiery trail behind it, surrounded by blue and black outer space."
  }
];
