import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { POSTER_TEMPLATES } from '@/data/posterTemplates'
import { PosterTemplate } from '@/types'
import { renderPosterToCanvas, downloadCanvasAsImage } from '@/utils/canvas'
import { copyToClipboard } from '@/utils/share'
import { Check, Download, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PosterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { text?: string; praiseId?: string } | null

  const [selectedTemplate, setSelectedTemplate] = useState<PosterTemplate>(POSTER_TEMPLATES[0])
  const [text, setText] = useState(state?.text || '你的彩虹屁文案将在这里展示～')
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && selectedTemplate) {
      renderPosterToCanvas(canvasRef.current, selectedTemplate, text, '夸夸语录')
    }
  }, [selectedTemplate, text])

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCanvasAsImage(canvasRef.current, `夸夸海报_${Date.now()}.png`)
    }
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'kuakua-poster.png', { type: 'image/png' })
          try {
            if (navigator.share && navigator.canShare?.({ files: [file] })) {
              await navigator.share({
                title: '夸夸海报',
                text: text,
                files: [file],
              })
            } else {
              handleDownload()
            }
          } catch {
            handleDownload()
          }
        }
      })
    }
  }

  return (
    <PageContainer
      title="生成海报"
      subtitle="🎨 高颜值海报一键生成"
      showBack
      onBack={() => navigate(-1)}
      showBottomNav={false}
    >
      <div className="space-y-5 animate-fade-in-up">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-soft">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            ✏️ 海报文案（可编辑）
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none resize-none text-gray-700 bg-white/50 backdrop-blur-sm transition-all"
          />
          <button
            onClick={handleCopy}
            className={cn(
              'mt-2 text-xs px-3 py-1.5 rounded-full transition-all',
              copied
                ? 'bg-green-100 text-green-600'
                : 'bg-pink-50 text-pink-500 hover:bg-pink-100'
            )}
          >
            {copied ? <Check size={12} className="inline mr-1" /> : null}
            {copied ? '已复制' : '复制文案'}
          </button>
        </div>

        <div className="flex justify-center">
          <div className="relative rounded-3xl p-2 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 shadow-dreamy">
            <canvas
              ref={canvasRef}
              className="rounded-2xl max-w-full bg-white"
              style={{ maxHeight: '50vh', width: 'auto' }}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
            <span>🖼️</span>
            <span>选择海报模板</span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {POSTER_TEMPLATES.map((template) => {
              const isActive = selectedTemplate.id === template.id
              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={cn(
                    'relative aspect-square rounded-2xl overflow-hidden transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-pink-300',
                    isActive
                      ? 'ring-2 ring-pink-400 ring-offset-2 scale-105 shadow-dreamy'
                      : 'hover:scale-102 hover:shadow-soft'
                  )}
                  style={{
                    background:
                      template.background.type === 'gradient'
                        ? `linear-gradient(135deg, ${template.background.value}, #e8f4ff)`
                        : template.background.value,
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                    <span className="text-3xl mb-1">{template.thumbnail}</span>
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                      {template.name}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="lg" onClick={handleDownload} className="w-full">
            <Download size={18} />
            保存图片
          </Button>
          <Button variant="gradient" size="lg" onClick={handleShare} className="w-full">
            <Share2 size={18} />
            分享海报
          </Button>
        </div>

        <p className="text-center text-xs text-gray-400">
          💡 长按海报图片也可保存哦～
        </p>
      </div>
    </PageContainer>
  )
}
