import { useCallback, useEffect, useSyncExternalStore } from "react";

export type Lang = "en" | "es";

const STORAGE_KEY = "grwm-language";
const listeners = new Set<() => void>();
let current: Lang = "en";
let loaded = false;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "es" || v === "en") current = v;
  } catch {
    /* ignore */
  }
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setLang(lang: Lang) {
  current = lang;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn());
}

/** Spanish text keyed by the English original. Missing keys fall back to English. */
const ES: Record<string, string> = {
  "Which study are you getting ready for?": "¿Para qué estudio te estás preparando?",
  "Sleep Study": "Estudio del sueño",
  "CPAP Study": "Estudio de CPAP",
  "Get Ready with Me CPAP Study": "Prepárate conmigo: Estudio de CPAP",
  "← Choose a study": "← Elegir un estudio",
  "CPAP Mask": "Mascarilla de CPAP",
  "A soft mask for the nose": "Una mascarilla suave para la nariz",
  "Elephant CPAP Mask": "Mascarilla de CPAP de elefante",
  "A trunk mask for the nose": "Una mascarilla con trompa para la nariz",
  "Drag {label} sticker": "Arrastrar calcomanía de {label}",
  // Game
  "Get Ready with Me Sleep Study": "Prepárate conmigo: Estudio del sueño",
  "Build your friend, then drag stickers on to make {name} feel better. Tap a sticker to take it off.":
    "Crea a tu amigo y arrastra calcomanías para que {name} se sienta mejor. Toca una calcomanía para quitarla.",
  "🔍 I Spy game": "🔍 Juego Veo, veo",
  "🌙 Parent's view": "🌙 Vista para padres",
  "Who?": "¿Quién?",
  Pajamas: "Pijamas",
  Sports: "Deportes",
  Dino: "Dino",
  Trucks: "Camiones",
  Hearts: "Corazones",
  "Moon and stars": "Luna y estrellas",
  Flowers: "Flores",
  "📋 Real sleep study map": "📋 Mapa real del estudio del sueño",
  "— peek inside": "— echa un vistazo",
  "Every glowing spot in the game matches these real sensor positions.":
    "Cada lugar brillante del juego coincide con la posición real de los sensores.",
  "🎒 What to Bring Checklist": "🎒 Lista de qué llevar",
  "— tap to open": "— toca para abrir",
  "{a} of {b} packed": "{a} de {b} empacados",
  "{a} of {b} done": "{a} de {b} hechos",
  "{a} of {b}": "{a} de {b}",
  "🎉 All packed and ready for the sleep study — sweet dreams!":
    "🎉 ¡Todo listo para el estudio del sueño — dulces sueños!",
  "Pick a sticker — the right spots light up!": "¡Elige una calcomanía y se iluminan los lugares correctos!",
  "Sticker Tray": "Bandeja de calcomanías",
  "Start over": "Empezar de nuevo",
  "I'm finished": "Ya terminé",
  "A little happy dance!": "¡Un pequeño baile de alegría!",
  "Time to get cozy!": "¡Hora de ponerse cómodo!",
  "Sweet dreams, {name}!": "¡Dulces sueños, {name}!",
  "Stickers placed: {n}": "Calcomanías puestas: {n}",
  "The Elastic Hug Band": "La banda elástica de abrazo",
  "Chest & belly belts": "Cinturones de pecho y barriga",
  "EKG & EMG Sensors": "Sensores EKG y EMG",
  "Heart & leg stickers": "Calcomanías de corazón y piernas",
  "EEG & EOG Electrodes": "Electrodos EEG y EOG",
  "Head & face stickers": "Calcomanías de cabeza y cara",
  "Nasal Cannula": "Cánula nasal",
  "Airflow tube under the nose": "Tubito de aire bajo la nariz",
  "Pulse Oximeter": "Oxímetro de pulso",
  "Finger or toe light": "Lucecita en el dedo o el pie",
  "Ready Bear": "Osito valiente",
  "A brave buddy for the bed": "Un amigo valiente para la cama",
  "Puppy Dog": "Perrito",
  "A cuddly sleep friend": "Un amiguito suave para dormir",
  Unicorn: "Unicornio",
  "A magical stuffed animal": "Un peluche mágico",
  "Gauze Hat": "Gorro de gasa",
  "Soft net cap for the head": "Gorrito suave para la cabeza",
  "Great job!": "¡Muy bien!",
  "So brave!": "¡Qué valiente!",
  "All better!": "¡Ya está mejor!",
  "Nice fix!": "¡Buen trabajo!",
  "Woohoo!": "¡Yupi!",
  "Super doctor!": "¡Súper doctor!",

  // I Spy
  "I Spy the Sleep Room": "Veo, veo en el cuarto del sueño",
  "Little things are hiding all over. Tap each one when you spot it!":
    "Hay cositas escondidas por todas partes. ¡Toca cada una cuando la veas!",
  "Sleep Room": "Cuarto del sueño",
  "Sleepover Friends": "Amigos de pijamada",
  "← Back to sticker game": "← Volver al juego de calcomanías",
  "🎉 You found them all!": "🎉 ¡Los encontraste todos!",
  "Play again": "Jugar otra vez",
  "Can you find…": "¿Puedes encontrar…?",
  Star: "Estrella",
  Moon: "Luna",
  Sock: "Calcetín",
  Book: "Libro",
  "Rubber duck": "Patito de hule",
  Key: "Llave",
  Toothbrush: "Cepillo de dientes",
  Cookie: "Galleta",
  Balloon: "Globo",
  Butterfly: "Mariposa",
  Flashlight: "Linterna",
  Ball: "Pelota",
  Pillow: "Almohada",
  "Counting sheep": "Ovejitas",
  "Glass of milk": "Vaso de leche",
  "Bedtime clock": "Reloj de dormir",
  "Teddy bear": "Osito de peluche",
  "Sleepy face": "Carita dormida",
  Bunny: "Conejito",
  "Hair bow": "Moño",
  Lamp: "Lámpara",
  "Cloud light": "Luz de nube",
  "Sleep monitor": "Monitor del sueño",
  Wheelchair: "Silla de ruedas",

  // Parent's view
  "For grown-ups": "Para adultos",
  "Parent's View": "Vista para padres",
  "Track the packing list and the bedtime routine right from your phone. Checks are saved on this device.":
    "Sigue la lista de empaque y la rutina de dormir desde tu teléfono. Las marcas se guardan en este dispositivo.",
  "🧸 Back to the game": "🧸 Volver al juego",
  "🌟 Good sleep habits": "🌟 Buenos hábitos de sueño",
  "← Parent's view": "← Vista para padres",
  "🎒 Packing list": "🎒 Lista de empaque",
  "🎉 All packed and ready — sweet dreams!": "🎉 ¡Todo empacado y listo — dulces sueños!",
  "😴 Sleep study night routine": "😴 Rutina de la noche del estudio",
  "🌟 Routine complete — time for the sleep study!": "🌟 ¡Rutina completa — hora del estudio del sueño!",
  "Reset both lists": "Reiniciar ambas listas",
  "Your child's medication": "Los medicamentos de tu hijo",
  "Pajamas or two-piece clothing, such as a T-shirt and shorts":
    "Pijama o ropa de dos piezas, como camiseta y shorts",
  "Snacks for before and after the sleep study": "Meriendas para antes y después del estudio",
  "Diapers and wipes": "Pañales y toallitas",
  "Bottles and formula, including formula for G-tube feedings":
    "Biberones y fórmula, incluida la fórmula para alimentación por sonda G",
  "Any medical equipment your child uses at night, such as:":
    "Cualquier equipo médico que tu hijo use de noche, como:",
  "A CPAP or BiPAP machine": "Una máquina CPAP o BiPAP",
  "A ventilator, suction supplies, or feeding pumps": "Un ventilador, equipo de succión o bombas de alimentación",
  "Any comfort stuffed animal, toy, sound machine, or blanket":
    "Su peluche, juguete, máquina de sonido o cobija favorita",
  "Skip naps today": "Hoy sin siestas",
  "A tired child falls asleep faster at the lab.": "Un niño cansado se duerme más rápido en el laboratorio.",
  "No caffeine after lunch": "Nada de cafeína después del almuerzo",
  "That includes chocolate and soda.": "Eso incluye chocolate y refrescos.",
  "Wash hair, skip conditioner and oils": "Lavar el cabello, sin acondicionador ni aceites",
  "Clean hair helps the EEG stickers stay on.": "El cabello limpio ayuda a que las calcomanías EEG se peguen.",
  "Eat a normal dinner before the study": "Cenar normalmente antes del estudio",
  "No meals will be provided during the study.": "No se darán comidas durante el estudio.",
  "Give evening medication as usual": "Dar los medicamentos de la noche como siempre",
  "Bring the medication along too.": "Lleva también los medicamentos.",
  "Pack the sleep-study bag": "Preparar la maleta del estudio del sueño",
  "Use the packing checklist above.": "Usa la lista de empaque de arriba.",
  "Dress in pajamas or a T-shirt and shorts": "Ponerse pijama o camiseta y shorts",
  "Two-piece clothing makes sensor placement easy.": "La ropa de dos piezas facilita colocar los sensores.",
  "Grab the comfort stuffed animal or blanket": "Llevar el peluche o la cobija favorita",
  "Familiar things make the new room feel safe.": "Las cosas conocidas hacen que el cuarto nuevo se sienta seguro.",
  "Arrive at the sleep center on time": "Llegar a tiempo al centro del sueño",

  // Habits
  "Good Sleep Habits": "Buenos hábitos de sueño",
  "Simple habits that help children and teens get the rest they need to grow.":
    "Hábitos sencillos que ayudan a niños y adolescentes a descansar lo que necesitan para crecer.",
  "💙 Why sleep matters": "💙 Por qué importa el sueño",
  "Sleep is just as important as food and water for a child to have the energy it takes to grow up strong and healthy.":
    "Dormir es tan importante como la comida y el agua para que un niño tenga la energía que necesita para crecer fuerte y sano.",
  "Not enough sleep increases hormones that make us crave food high in fat, sugar, and salt — which can lead to a greater risk of obesity. Kids who don't get enough sleep also have trouble paying attention, learning, and coping with stress.":
    "Dormir poco aumenta las hormonas que nos hacen desear comida con mucha grasa, azúcar y sal, lo que puede aumentar el riesgo de obesidad. Los niños que no duermen lo suficiente también tienen dificultad para prestar atención, aprender y manejar el estrés.",
  "✅ Good habits to build": "✅ Buenos hábitos para crear",
  "🚫 Habits to avoid": "🚫 Hábitos para evitar",
  "⏳ How much sleep does a child need?": "⏳ ¿Cuánto necesita dormir un niño?",
  "Keep the same relaxing bedtime routine": "Mantener la misma rutina relajante antes de dormir",
  "20 to 30 minutes every night — reading a book or talking about their day works great.":
    "De 20 a 30 minutos cada noche: leer un libro o hablar de su día funciona muy bien.",
  "Go to bed and wake up at the same time": "Acostarse y despertarse a la misma hora",
  "Every day — weekdays and weekends alike.": "Todos los días, entre semana y los fines de semana.",
  "Make the bedroom comfortable, quiet, and dark": "Hacer que el cuarto sea cómodo, tranquilo y oscuro",
  "A cool room helps too — kids sleep better when it isn't warm.":
    "Un cuarto fresco también ayuda: los niños duermen mejor cuando no hace calor.",
  "Exercise every day": "Hacer ejercicio todos los días",
  "Active days lead to sleepy nights.": "Días activos traen noches de buen sueño.",
  "No caffeine 3 to 4 hours before bedtime": "Nada de cafeína de 3 a 4 horas antes de dormir",
  "Watch out for soda, tea, and chocolate too.": "Cuidado también con los refrescos, el té y el chocolate.",
  "No TV in the bedroom": "No tener televisión en el cuarto",
  'Kids can easily develop the bad habit of "needing" the TV to fall asleep.':
    'Los niños pueden acostumbrarse fácilmente a "necesitar" la televisión para dormirse.',
  "No video games or computer before bed": "Nada de videojuegos ni computadora antes de dormir",
  "Screens wake the brain up right when it should be winding down.":
    "Las pantallas despiertan al cerebro justo cuando debería relajarse.",
  "Don't send them to bed hungry": "No mandarlos a dormir con hambre",
  "A light snack before bed is OK.": "Una merienda ligera antes de dormir está bien.",
  "Don't use the bedroom for time-out or punishments": "No usar el cuarto para castigos",
  "You want your child to think of their bedroom as a good place, not a bad one.":
    "Quieres que tu hijo piense en su cuarto como un lugar bueno, no malo.",
  "Infants and toddlers": "Bebés y niños pequeños",
  "13 to 14 hours, including naps": "13 a 14 horas, con siestas",
  "Ages 3 to 5": "De 3 a 5 años",
  "12 to 13 hours, including naps": "12 a 13 horas, con siestas",
  "Ages 6 to 12": "De 6 a 12 años",
  "9 to 10 hours, no naps": "9 a 10 horas, sin siestas",
  "Ages 13 to 18": "De 13 a 18 años",
  "8 to 10 hours, no naps": "8 a 10 horas, sin siestas",
};

export function useLang() {
  useEffect(() => {
    if (!loaded) {
      load();
      listeners.forEach((fn) => fn());
    }
  }, []);
  const lang = useSyncExternalStore(subscribe, () => current, () => "en" as Lang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (en: string, vars?: Record<string, string | number>) => {
      let s = lang === "es" ? (ES[en] ?? en) : en;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      return s;
    },
    [lang],
  );

  return { lang, setLang, t };
}

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language / Idioma"
      className="relative z-40 mr-3 mt-3 ml-auto flex w-fit rounded-full bg-card p-1 text-xs font-extrabold shadow-[var(--shadow-sticker)]"
    >
      {(["en", "es"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-3 py-1 transition-colors ${
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          {l === "en" ? "English" : "Español"}
        </button>
      ))}
    </div>
  );
}
