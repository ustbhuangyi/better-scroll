export default function getScale(transformText: string) {
  const matrix = transformText.split(')')[0].split(', ')
  const prefix = matrix[0]
  return +prefix.split('(')[1]
}
