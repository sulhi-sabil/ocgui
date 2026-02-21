import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Skill } from '../types'

interface SkillState {
  skills: Skill[]
  setSkills: (skills: Skill[]) => void
  addSkill: (skill: Skill) => void
}

export const useSkillStore = create<SkillState>()(
  persist(
    (set) => ({
      skills: [],
      setSkills: (skills) => set({ skills }),
      addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
    }),
    {
      name: 'ocgui-skills',
    }
  )
)
