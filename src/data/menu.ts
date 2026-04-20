export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  isNew: boolean;
  isPopular: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: "hamburguesas",
    name: "🍔 Hamburguesas",
    items: [
      {
        id: "clasica",
        name: "Hamburguesa Clásica",
        description: "Carne 150g, lechuga, tomate, cebolla caramelizada y salsa secreta FUEGO en pan brioche artesanal.",
        price: 22000,
        image: "/menu-classic-burger.png",
        ingredients: ["Carne de res", "Lechuga", "Tomate", "Cebolla caramelizada", "Salsa FUEGO"],
        isNew: false,
        isPopular: true,
      },
      {
        id: "doble-smash",
        name: "Doble Smash",
        description: "Doble smash burger 200g con queso cheddar derretido, pickles y salsa smash casera.",
        price: 28000,
        image: "/menu-classic-burger.png",
        ingredients: ["Doble carne smash", "Queso cheddar", "Pickles", "Salsa smash", "Pan brioche"],
        isNew: false,
        isPopular: true,
      },
      {
        id: "trufa",
        name: "Hamburguesa de Trufa",
        description: "Carne premium 180g con aceite de trufa, queso brie, rúcula y mayonesa de trufa.",
        price: 35000,
        image: "/menu-classic-burger.png",
        ingredients: ["Carne premium", "Aceite de trufa", "Queso brie", "Rúcula", "Mayonesa trufa"],
        isNew: true,
        isPopular: false,
      },
      {
        id: "bbq-bacon",
        name: "BBQ Bacon",
        description: "Carne 170g con bacon ahumado crocante, cebolla crispy, anillos de cebolla y salsa BBQ ahumada.",
        price: 32000,
        image: "/menu-classic-burger.png",
        ingredients: ["Carne de res", "Bacon ahumado", "Cebolla crispy", "Anillos de cebolla", "Salsa BBQ"],
        isNew: false,
        isPopular: true,
      },
    ],
  },
  {
    id: "pollo",
    name: "🍗 Pollo",
    items: [
      {
        id: "alitas",
        name: "Alitas 8pcs",
        description: "8 alitas de pollo crujientes con salsa buffalo o miel mostaza. Acompañadas de apio y ranch.",
        price: 18000,
        image: "/menu-wings.png",
        ingredients: ["Alitas de pollo", "Salsa buffalo", "Apio", "Salsa ranch"],
        isNew: false,
        isPopular: true,
      },
      {
        id: "pollo-frito",
        name: "Pollo Frito Entero",
        description: "Pollo entero marinado 24 horas, empanizado y frito a la perfección. Acompañado de ensalada.",
        price: 24000,
        image: "/menu-wings.png",
        ingredients: ["Pollo entero", "Marinada 24h", "Ensalada fresca"],
        isNew: false,
        isPopular: false,
      },
      {
        id: "tenders",
        name: "Tenders 6pcs",
        description: "6 tiras de pechuga empanizadas con salsa de elección: miel mostaza, BBQ o chipotle.",
        price: 16000,
        image: "/menu-wings.png",
        ingredients: ["Pechuga de pollo", "Empanizado artesanal", "Salsas variadas"],
        isNew: true,
        isPopular: true,
      },
    ],
  },
  {
    id: "parrilla",
    name: "🔥 Parrilla",
    items: [
      {
        id: "costillas",
        name: "Costillas BBQ",
        description: "Rack de costillas de cerdo glaseadas con salsa BBQ ahumada, cocinadas a fuego lento por 6 horas.",
        price: 42000,
        image: "/menu-steak.png",
        ingredients: ["Costillas de cerdo", "Salsa BBQ ahumada", "Cocción 6 horas"],
        isNew: false,
        isPopular: true,
      },
      {
        id: "lomo",
        name: "Lomo 300g",
        description: "Corte premium de lomo de res 300g a la parrilla, acompañado de chimichurri casero y vegetales asados.",
        price: 48000,
        image: "/bento-grill.png",
        ingredients: ["Lomo de res 300g", "Chimichurri", "Vegetales asados", "Mantequilla de hierbas"],
        isNew: false,
        isPopular: false,
      },
      {
        id: "arrachera",
        name: "Arrachera",
        description: "Corte mexicano de arrachera marinada en salsa de naranja y especias, servida con guacamole y tortillas.",
        price: 38000,
        image: "/bento-grill.png",
        ingredients: ["Arrachera marinada", "Guacamole", "Tortillas de maíz", "Pico de gallo"],
        isNew: true,
        isPopular: true,
      },
    ],
  },
  {
    id: "sides",
    name: "🧄 Sides",
    items: [
      {
        id: "papas",
        name: "Papas Fritas",
        description: "Papas cortadas a mano, doble fritura para máxima crocancia. Con salsa de la casa.",
        price: 10000,
        image: "/bento-crunch.png",
        ingredients: ["Papa fresca", "Sal marina", "Salsa de la casa"],
        isNew: false,
        isPopular: true,
      },
      {
        id: "nachos",
        name: "Nachos Supreme",
        description: "Totopos crujientes con queso fundido, guacamole, jalapeños, crema agria y carne desmechada.",
        price: 18000,
        image: "/menu-nachos.png",
        ingredients: ["Totopos", "Queso fundido", "Guacamole", "Jalapeños", "Crema agria", "Carne desmechada"],
        isNew: false,
        isPopular: true,
      },
      {
        id: "aros-cebolla",
        name: "Aros de Cebolla",
        description: "Aros de cebolla empanizados con cerveza, crujientes por fuera y suaves por dentro. Con salsa chipotle.",
        price: 12000,
        image: "/bento-crunch.png",
        ingredients: ["Cebolla", "Empanizado de cerveza", "Salsa chipotle"],
        isNew: false,
        isPopular: false,
      },
      {
        id: "ensalada-cesar",
        name: "Ensalada César",
        description: "Lechuga romana, crutones artesanales, parmesano y aderezo César casero con anchoas.",
        price: 15000,
        image: "/bento-sauce.png",
        ingredients: ["Lechuga romana", "Crutones", "Parmesano", "Aderezo César"],
        isNew: false,
        isPopular: false,
      },
    ],
  },
  {
    id: "bebidas",
    name: "🥤 Bebidas",
    items: [
      {
        id: "limonada",
        name: "Limonada",
        description: "Limonada natural con hierbabuena fresca. Endulzada con panela colombiana.",
        price: 8000,
        image: "/menu-shake.png",
        ingredients: ["Limón natural", "Hierbabuena", "Panela"],
        isNew: false,
        isPopular: true,
      },
      {
        id: "malta",
        name: "Malta",
        description: "Malta fría, la bebida colombiana por excelencia.",
        price: 6000,
        image: "/menu-shake.png",
        ingredients: ["Malta"],
        isNew: false,
        isPopular: false,
      },
      {
        id: "agua",
        name: "Agua 500ml",
        description: "Agua embotellada sin gas.",
        price: 5000,
        image: "/menu-shake.png",
        ingredients: ["Agua"],
        isNew: false,
        isPopular: false,
      },
      {
        id: "cerveza",
        name: "Cerveza",
        description: "Cerveza artesanal colombiana. Consulta las opciones disponibles del día.",
        price: 9000,
        image: "/menu-shake.png",
        ingredients: ["Cerveza artesanal"],
        isNew: false,
        isPopular: false,
      },
    ],
  },
  {
    id: "postres",
    name: "🍨 Postres",
    items: [
      {
        id: "brownie",
        name: "Brownie",
        description: "Brownie de chocolate belga con nueces, servido caliente con helado de vainilla y salsa de chocolate.",
        price: 12000,
        image: "/bento-sauce.png",
        ingredients: ["Chocolate belga", "Nueces", "Helado de vainilla", "Salsa de chocolate"],
        isNew: false,
        isPopular: true,
      },
      {
        id: "helado",
        name: "Helado 2 bolas",
        description: "Dos bolas de helado artesanal. Sabores: vainilla, chocolate, fresa o coco.",
        price: 10000,
        image: "/menu-shake.png",
        ingredients: ["Helado artesanal"],
        isNew: false,
        isPopular: false,
      },
    ],
  },
  {
    id: "combos",
    name: "🔥 Combos",
    items: [
      {
        id: "combo-fuego",
        name: "Combo Fuego",
        description: "Hamburguesa Clásica + Papas Fritas + Limonada. El combo perfecto para un FUEGO level.",
        price: 32000,
        image: "/bento-grill.png",
        ingredients: ["Hamburguesa Clásica", "Papas Fritas", "Limonada"],
        isNew: false,
        isPopular: true,
      },
      {
        id: "combo-familiar",
        name: "Combo Familiar 4 personas",
        description: "4 Hamburguesas Clásicas + 2 Papas Fritas + 4 Limonadas. ¡Ideal para compartir en familia!",
        price: 89000,
        image: "/bento-grill.png",
        ingredients: ["4x Hamburguesa", "2x Papas Fritas", "4x Limonada"],
        isNew: false,
        isPopular: true,
      },
      {
        id: "combo-parrillero",
        name: "Combo Parrillero",
        description: "Costillas BBQ + Arrachera + Nachos Supreme + 2 Cervezas. Para los más carnívoros.",
        price: 55000,
        image: "/bento-grill.png",
        ingredients: ["Costillas BBQ", "Arrachera", "Nachos Supreme", "2x Cerveza"],
        isNew: true,
        isPopular: true,
      },
    ],
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getAllItems(): MenuItem[] {
  return menuCategories.flatMap((cat) => cat.items);
}

export function getPopularItems(): MenuItem[] {
  return getAllItems().filter((item) => item.isPopular);
}

export function getNewItemIds(): string[] {
  return getAllItems().filter((item) => item.isNew).map((item) => item.id);
}
