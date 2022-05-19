const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
export function parseLyric(lyricString) {
  // [01:04.591]常让我 望远方出神

  const lyricStrings = lyricString.split("\n")
  const lyricInfos = []
  for (const lineLyric of lyricStrings) {
    const timeResult = timeRegExp.exec(lineLyric)
    if (!timeResult) break;
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    // timeResult[i] 是字符串,一定要记得 * 1
    const millsecond = timeResult[3].length === 2 ? timeResult[3] * 10 : timeResult[3] * 1
    const time = minute + second + millsecond
    const text = lineLyric.replace(timeRegExp, '')
    lyricInfos.push({ time, text })
  }
  return lyricInfos
}