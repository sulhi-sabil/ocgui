import type { StateCreator } from 'zustand'
import type { Skill } from '../../types'

export interface SkillSlice {
  skills: Skill[]
  setSkills: (skills: Skill[]) => void
  addSkill: (skill: Skill) => void
  updateSkill: (id: string, updates: Partial<Skill>) => void
  deleteSkill: (id: string) => void
}

export const createSkillSlice: StateCreator<SkillSlice, [], [], SkillSlice> = (set) => ({
  skills: [],
  setSkills: (skills) => set({ skills }),
  addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
  updateSkill: (id, updates) =>
    set((state) => ({
      skills: state.skills.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  deleteSkill: (id) =>
    set((state) => ({
      skills: state.skills.filter((s) => s.id !== id),
    })),
})
