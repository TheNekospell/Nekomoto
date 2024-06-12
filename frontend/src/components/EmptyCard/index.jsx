import "./index.css";
import BoxBorder from "@components/BoxBorder/index";

export default function EmptyCard({ children }) {
  return (
    <div className="empty-card">
      <BoxBorder />
      {children}
    </div>
  );
}
