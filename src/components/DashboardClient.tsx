'use client';
import { useState } from 'react';
import SkillSidebar from '@/components/SkillSidebar';
import TopicGrid from '@/components/TopicGrid';
import type { CurriculumData } from '@/types';

interface Props {
  curriculum: CurriculumData;
}

export default function DashboardClient({ curriculum }: Props) {
  const [activeSkill, setActiveSkill] = useState<string>('react');

  const skillData = curriculum[activeSkill];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-canvas overflow-hidden">
      <SkillSidebar activeSkill={activeSkill} onSkillChange={setActiveSkill} />
      {skillData && <TopicGrid skill={activeSkill} data={skillData} />}
    </div>
  );
}
