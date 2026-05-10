export function stageColor(stage: string): string {
  switch (stage) {
    case 'done':
      return '#22c55e'; // green
    case 'failed':
    case 'rejected':
      return '#ef4444'; // red
    default:
      return '#3b82f6'; // blue
  }
}

export function stageLabel(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}
