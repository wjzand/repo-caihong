export interface ShareData {
  title?: string
  text?: string
  url?: string
  files?: File[]
}

export async function shareContent(data: ShareData): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data)
      return true
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err)
      }
      return false
    }
  }
  return false
}

export async function shareImage(file: File, title: string = '夸夸海报'): Promise<boolean> {
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title,
        files: [file],
      })
      return true
    } catch (err) {
      console.error('Share image failed:', err)
      return false
    }
  }
  return false
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    }

    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  } catch (err) {
    console.error('Copy failed:', err)
    return false
  }
}
