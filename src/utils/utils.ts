
export const getSkillLevelText = (skillLevel: number) => {
  switch (skillLevel) {
    case 0:
      return 'Beginner'
    case 1:
      return 'Intermediate'
    case 2:
      return 'Upper-intermediate'
    default:
      return 'Beginner';
  }
}