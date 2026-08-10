import type { Metadata } from 'next';
import DashboardClient from '@/components/DashboardClient';
import curriculumData from '@/data/curriculum.json';
import type { CurriculumData } from '@/types';

export const metadata: Metadata = {
  title: 'Dashboard — FED Notes',
};

export default function DashboardPage() {
  return <DashboardClient curriculum={curriculumData as CurriculumData} />;
}
