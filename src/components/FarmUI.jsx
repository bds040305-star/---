export const asset = `${import.meta.env.BASE_URL}design/assets/`;
export const vegetables = [
  { name: "상추", english: "LETTUCE", image: "lettuce.png" },
  { name: "루꼴라", english: "ARUGULA", image: "arugula.png" },
  { name: "청경채", english: "BOK CHOY", image: "bok-choy.png" },
];
const paths = {
  arrow: "M5 19 19 5M5 5h14v14",
  menu: "M5 8h14M5 16h9",
  close: "m6 6 12 12M18 6 6 18",
  back: "m14 6-6 6 6 6",
  power: "M12 3v9M6.5 5.5a9 9 0 1 0 11 0",
  leaf: "M5 20C2 10 9 3 20 4c1 11-6 17-15 16Zm0 0L15 9",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5",
  bulb: "M8 15c-6-7 1-15 7-10 4 3 1 8-1 10v3H8v-3ZM9 21h4M11 1v2M2 7l2 1M19 7l2-1",
  touch:
    "M10 13V5a2 2 0 0 1 4 0v7l2-2 5 3-4 8H9l-5-7a2 2 0 0 1 3-2l3 3M3 3l2 2M20 3l-2 2",
  temperature: "M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0ZM12 8v10M18 5h3M18 9h2",
  air: "M2 6q3-3 6 0t6 0 8 0M2 12q3-3 6 0t6 0 8 0M2 18q3-3 6 0t6 0 8 0",
  pot: "M6 14h12l-2 8H8l-2-8ZM12 14V6M12 10C3 11 3 3 3 3s9-1 9 7ZM12 8C12 1 21 2 21 2s1 7-9 6Z",
  door: "M3 2h18v20H3V2ZM6 5h12v14H6V5ZM16 11v3",
  lock: "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v12H5V10ZM12 14v4",
  timer: "M12 5a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM9 2h6M12 8v5l3 2",
  headset:
    "M3 14v-3a9 9 0 0 1 18 0v5M3 12H1v7h4v-7H3ZM21 12h2v7h-4v-7h2ZM21 19c0 3-5 3-7 3",
  message: "M3 3h18v15h-7l-5 4v-4H3V3ZM8 8v5M12 8v5M16 8v5",
  tools:
    "m4 3 5 5-3 3-5-5m19 15-8-8M15 3a5 5 0 0 0-6 6L2 18l4 4 9-9a5 5 0 0 0 6-6l-4 3-3-3 3-4Z",
  user: "M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 22v-3a8 8 0 0 1 16 0v3",
  water: "M12 2c-2 5-7 9-7 13a7 7 0 0 0 14 0c0-4-5-8-7-13Z",
};
export function Icon({ name, size = 24, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.leaf} />
    </svg>
  );
}
export function Brand() {
  return <span className="brand">wells</span>;
}
export function Action({ children, onClick, light = false, ...props }) {
  return (
    <button
      className={`action ${light ? "action-light" : ""}`}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
      <Icon name="arrow" size={20} />
    </button>
  );
}
