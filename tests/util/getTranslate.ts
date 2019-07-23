export default function getTranslate(
  transformText: string,
  direction: 'x' | 'y'
) {
  const matrix = transformText.split(')')[0].split(', ')
  let ret =
    direction === 'x' ? +(matrix[12] || matrix[4]) : +(matrix[13] || matrix[5])
  return ret
}
