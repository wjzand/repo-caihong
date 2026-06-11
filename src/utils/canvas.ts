import { PosterTemplate } from '@/types'

export async function renderPosterToCanvas(
  canvas: HTMLCanvasElement,
  template: PosterTemplate,
  content: string,
  title?: string
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  const width = template.layout.orientation === 'landscape' ? 600 : 375
  const height = template.layout.orientation === 'landscape' ? 375 : 600
  canvas.width = width
  canvas.height = height

  if (template.background.type === 'gradient') {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    const colors = template.background.value.split(',')
    gradient.addColorStop(0, colors[0] || '#ffe5f1')
    gradient.addColorStop(1, colors[1] || '#e8f4ff')
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = template.background.value
  }
  ctx.fillRect(0, 0, width, height)

  const padding = template.decoration.padding
  const borderWidth = template.decoration.borderWidth || 0
  const borderRadius = template.decoration.borderRadius || 0

  if (borderWidth > 0 && template.decoration.borderStyle !== 'none') {
    ctx.save()
    ctx.strokeStyle = template.decoration.borderColor || '#000'
    ctx.lineWidth = borderWidth
    if (template.decoration.borderStyle === 'dashed') {
      ctx.setLineDash([10, 6])
    } else if (template.decoration.borderStyle === 'dotted') {
      ctx.setLineDash([4, 4])
    } else if (template.decoration.borderStyle === 'double') {
      ctx.lineWidth = borderWidth * 2
    }
    roundRect(ctx, padding / 2, padding / 2, width - padding, height - padding, borderRadius)
    ctx.stroke()
    ctx.restore()
  }

  if (template.decoration.elements) {
    for (const elem of template.decoration.elements) {
      ctx.save()
      ctx.globalAlpha = elem.opacity
      ctx.font = `${elem.size}px Arial`
      if (elem.rotation) {
        ctx.translate(elem.position.x + elem.size / 2, elem.position.y + elem.size / 2)
        ctx.rotate((elem.rotation * Math.PI) / 180)
        ctx.translate(-(elem.position.x + elem.size / 2), -(elem.position.y + elem.size / 2))
      }
      ctx.fillText(elem.content, elem.position.x, elem.position.y + elem.size)
      ctx.restore()
    }
  }

  const textX = padding + 20
  const textWidth = width - padding * 2 - 40
  let currentY = padding + 40

  if (title && template.layout.titlePosition === 'top') {
    ctx.save()
    ctx.font = `bold ${template.textStyle.fontSize + 6}px ${template.textStyle.fontFamily}`
    ctx.fillStyle = template.textStyle.color
    ctx.textAlign = 'center'
    ctx.fillText(title, width / 2, currentY)
    currentY += template.textStyle.fontSize + 20
    ctx.restore()
  }

  ctx.save()
  ctx.font = `${template.textStyle.fontWeight === 'bold' ? 'bold ' : ''}${template.textStyle.fontSize}px ${template.textStyle.fontFamily}`
  ctx.fillStyle = template.textStyle.color
  ctx.textAlign = template.textStyle.textAlign as CanvasTextAlign

  if (template.textStyle.textShadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.2)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
  }

  const lines = wrapText(ctx, content, textWidth)
  const lineHeightPx = template.textStyle.fontSize * template.textStyle.lineHeight

  if (template.layout.contentPosition === 'center') {
    const totalHeight = lines.length * lineHeightPx
    currentY = (height - totalHeight) / 2
  } else if (template.layout.contentPosition === 'bottom') {
    const totalHeight = lines.length * lineHeightPx
    currentY = height - totalHeight - padding
  }

  const textStartX = template.textStyle.textAlign === 'center' ? width / 2 : textX

  for (const line of lines) {
    ctx.fillText(line, textStartX, currentY)
    currentY += lineHeightPx
  }

  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.6
  ctx.font = '12px sans-serif'
  ctx.fillStyle = template.textStyle.color
  ctx.textAlign = 'center'
  ctx.fillText('—— 夸夸语录·彩虹屁制造机 ——', width / 2, height - 20)
  ctx.restore()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let currentLine = ''

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const testLine = currentLine + char
    const metrics = ctx.measureText(testLine)

    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine)
      currentLine = char
    } else {
      currentLine = testLine
    }

    if (char === '\n') {
      lines.push(currentLine.trim())
      currentLine = ''
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

export function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename: string = 'kuakua-poster.png'): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export function canvasToBase64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png')
}
