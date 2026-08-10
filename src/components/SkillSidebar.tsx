import Image from 'next/image';

interface Skill {
  id: string;
  label: string;
  badge: string;
  color: string;
}

const SKILLS: Skill[] = [
  { id: 'javascript', label: 'JavaScript', badge: 'JS', color: '#F7DF1E' },
  { id: 'react',      label: 'React.js',   badge: 'Re', color: '#61DAFB' },
  { id: 'typescript', label: 'TypeScript', badge: 'TS', color: '#3178C6' },
  { id: 'nextjs',     label: 'Next.js',    badge: 'N⃤',  color: '#e2e8f0' },
];

interface Props {
  activeSkill: string;
  onSkillChange: (skill: string) => void;
}

export default function SkillSidebar({ activeSkill, onSkillChange }: Props) {
  return (
    <>
      {/* ── Mobile: horizontal tab strip ── */}
      <div className="md:hidden flex-shrink-0 bg-panel border-b border-white/5 px-3 py-2">
        <div className="flex items-center gap-2 mb-2">
          <Image src="/logos.png" alt="FED Notes" width={24} height={24} className="rounded-lg" />
          <span className="text-white font-semibold text-sm">Not_e Book</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SKILLS.map((skill) => {
            const isActive = activeSkill === skill.id;
            return (
              <button
                key={skill.id}
                onClick={() => onSkillChange(skill.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 border
                  ${isActive
                    ? 'bg-neonPurple/15 border-neonPurple/60 text-white shadow-glow-purple'
                    : 'border-white/[0.06] text-textMuted hover:bg-neonPurple/[0.07] hover:border-neonPurple/[0.30]'
                  }`}
              >
                <span
                  className="w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center flex-shrink-0"
                  style={{ color: isActive ? skill.color : `${skill.color}80` }}
                >
                  {skill.badge}
                </span>
                {skill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Desktop: vertical sidebar ── */}
      <aside className="hidden md:flex w-[200px] flex-shrink-0 bg-panel border-r border-white/5 h-full flex-col py-5 px-3 gap-1">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-6">
          <Image src="/logos.png" alt="FED Notes" width={32} height={32} className="rounded-xl" />
          <span className="text-white font-bold text-sm tracking-tight">Dev Docs</span>
        </div>

        <p className="text-textMuted text-[10px] font-medium uppercase tracking-widest px-2 mb-2">
          Stacks
        </p>

        {SKILLS.map((skill) => {
          const isActive = activeSkill === skill.id;
          return (
            <button
              key={skill.id}
              onClick={() => onSkillChange(skill.id)}
              className={`relative flex items-center gap-3 w-full px-2 py-2.5 rounded-xl text-left transition-all duration-200
                ${isActive
                  ? 'bg-neonPurple/15 border border-neonPurple/60 shadow-glow-purple'
                  : 'border border-transparent hover:bg-neonPurple/[0.07] hover:border-neonPurple/[0.30]'
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-neonPurple rounded-r-full shadow-[0_0_12px_4px_rgba(180,77,255,0.9)]" />
              )}
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all duration-200 border
                  ${isActive ? 'border-neonPurple/40' : 'border-white/[0.08]'}`}
                style={{
                  background: isActive ? `${skill.color}18` : `${skill.color}0a`,
                  color: isActive ? skill.color : `${skill.color}80`,
                }}
              >
                {skill.badge}
              </span>
              <span className={`text-sm font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-textMuted'}`}>
                {skill.label}
              </span>
            </button>
          );
        })}

        <div className="mt-auto px-2 pt-4 border-t border-white/5">
          <p className="text-textMuted/50 text-[10px]">v1.0 · 2025</p>
        </div>
      </aside>
    </>
  );
}
