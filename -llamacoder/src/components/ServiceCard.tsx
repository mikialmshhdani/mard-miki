import { Service } from "../types";

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 rounded-xl p-4 text-right transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-center gap-3">
        <span className="text-2xl">{service.icon}</span>
        <span className="text-white font-medium text-sm">{service.title}</span>
      </div>
    </button>
  );
}