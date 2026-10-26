import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { maxProductImageLength, validateProductDraft } from '../data/catalog'
import type { ProductDraft, ProductFormErrors } from '../data/catalog'
import Icon from './Icon'
import SelectMenu from './SelectMenu'

type AddProductPageProps = {
  categories: string[]
  onCreate: (draft: ProductDraft) => string | null
  onBack: () => void
}

const emptyDraft: ProductDraft = { image: '', name: '', category: '', description: '', specifications: '', rating: '', price: '', quantity: '' }
const inputClass = 'w-full min-w-0 rounded-xl border border-white/15 bg-white/[0.035] px-4 py-3 text-[13px] text-[#efefea] outline-none placeholder:text-[#737b80] focus:border-[var(--accent)]/60 focus:bg-white/[0.055] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] aria-invalid:border-rose-300/60 motion-safe:transition-colors'
const labelClass = 'mb-2.5 block text-[12px] font-medium tracking-[0.08em] text-[#d4d9cf] uppercase'

async function prepareImage(file: File) {
  if (file.type !== 'image/png') throw new Error('Choose a PNG image for better visuals.')
  if (file.size > 5 * 1024 * 1024) throw new Error('Choose an image smaller than 5 MB.')
  let signature: Uint8Array
  try { signature = new Uint8Array(await file.slice(0, 8).arrayBuffer()) }
  catch { throw new Error('This file could not be read. Choose another PNG image.') }
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  if (signature.length !== pngSignature.length || !pngSignature.every((byte, index) => signature[index] === byte)) {
    throw new Error('This file is not a valid PNG. Export it as PNG and choose the exported image; changing its extension is not enough.')
  }
  let bitmap: ImageBitmap
  try { bitmap = await createImageBitmap(file) }
  catch { throw new Error('This image could not be opened. Try another PNG image.') }
  try {
    const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('The image could not be prepared. Please try again.')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const image = canvas.toDataURL('image/webp', 0.85)
    if (image.length > maxProductImageLength) throw new Error('This image is too detailed to save. Try a smaller image.')
    return image
  } finally {
    bitmap.close()
  }
}

export default function AddProductPage({ categories, onCreate, onBack }: AddProductPageProps) {
  const formId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const imageRequest = useRef(0)
  const submitting = useRef(false)
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft)
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [formError, setFormError] = useState('')
  const [imageName, setImageName] = useState('')
  const [preparingImage, setPreparingImage] = useState(false)

  useEffect(() => () => { imageRequest.current += 1 }, [])

  function changeField(field: keyof ProductDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setFormError('')
  }

  function fieldProps(field: keyof ProductDraft) {
    return {
      id: `${formId}-${field}`,
      'aria-invalid': Boolean(errors[field]) || undefined,
      'aria-describedby': `${formId}-${field}-hint${errors[field] ? ` ${formId}-${field}-error` : ''}`,
    }
  }

  function fieldError(field: keyof ProductDraft) {
    return errors[field] ? <p id={`${formId}-${field}-error`} className="mt-2 text-[12px] leading-relaxed text-rose-200">{errors[field]}</p> : null
  }

  async function chooseImage(file?: File) {
    if (!file) return
    const request = ++imageRequest.current
    changeField('image', '')
    setImageName('')
    setPreparingImage(true)
    try {
      const image = await prepareImage(file)
      if (request !== imageRequest.current) return
      changeField('image', image)
      setImageName(file.name)
    } catch (error) {
      if (request === imageRequest.current) setErrors((current) => ({ ...current, image: error instanceof Error ? error.message : 'The image could not be prepared. Please try again.' }))
    } finally {
      if (request === imageRequest.current) setPreparingImage(false)
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (preparingImage || submitting.current) return
    const nextErrors = validateProductDraft(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setFormError('Complete the highlighted fields before adding your product.')
      window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    submitting.current = true
    const error = onCreate(draft)
    if (error) {
      submitting.current = false
      setFormError(error)
    }
  }

  return (
    <section aria-labelledby="add-product-title" className="mx-[3%] min-w-0">
      <button type="button" onClick={onBack} className="mb-6 inline-flex min-h-10 items-center gap-2 text-[12px]! tracking-[0.08em] text-[var(--muted)] uppercase hover:text-[var(--accent)]">
        <Icon name="arrow" className="size-4 rotate-180" /> Back to collection
      </button>
      <header className="mb-9">
        <p className="mb-2 text-[12px] font-medium tracking-[0.16em] text-[#b4c29f] uppercase">Make room for something new</p>
        <h1 id="add-product-title" className="text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.05] font-black tracking-[-0.05em] uppercase">Add a product.</h1>
        <p className="mt-3 text-[12px] leading-relaxed text-[var(--muted)]">A new piece. A new point of view. All fields are required.</p>
      </header>

      <form ref={formRef} noValidate onSubmit={submit} aria-label="Add a new product" className="grid min-w-0 items-start gap-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10 xl:gap-14">
        <div className="min-w-0">
          <label htmlFor={`${formId}-image`} className={labelClass}>Feature image</label>
          <div className={`glass-panel relative isolate overflow-hidden rounded-2xl ${errors.image ? 'border-rose-300/60!' : ''}`}>
            <label onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void chooseImage(event.dataTransfer.files[0]) }} className="group relative flex aspect-[4/5] max-h-[32rem] min-h-64 w-full cursor-pointer flex-col items-center justify-center gap-5 p-6 text-center focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--accent)] hover:bg-white/[0.025] motion-safe:transition-colors">
              <input {...fieldProps('image')} type="file" accept="image/png,.png" aria-required="true" onChange={(event) => { void chooseImage(event.currentTarget.files?.[0]); event.currentTarget.value = '' }} className="sr-only" />
              {draft.image ? (
                <>
                  <img src={draft.image} alt={`Feature preview for ${draft.name.trim() || 'your new product'}`} className="pointer-events-none absolute inset-4 h-[calc(100%_-_2rem)] w-[calc(100%_-_2rem)] object-contain drop-shadow-[0_20px_20px_#00000040]" />
                  <span className="absolute inset-x-4 bottom-4 rounded-full border border-white/15 bg-[#171c1d]/85 px-4 py-3 text-[12px] text-[#e0e7d6] backdrop-blur-xl group-hover:border-[var(--accent)]/40">Click or drop an image to replace</span>
                </>
              ) : (
                <>
                  <span className="flex size-20 items-center justify-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 text-[var(--accent)]"><Icon name="shirt" className="size-9" /></span>
                  <span><span className="block text-[15px] font-semibold tracking-[-0.02em]">{preparingImage ? 'Preparing your image…' : 'Give your piece a face.'}</span><span className="mt-2 block text-[12px] leading-relaxed text-[var(--muted)]">Choose an image or drop it here.</span></span>
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 text-[12px] font-medium text-[var(--accent)]"><Icon name="plus" className="size-3.5" /> Choose image</span>
                </>
              )}
            </label>
          </div>
          <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
            <p id={`${formId}-image-hint`} className="text-[12px] leading-relaxed text-[var(--muted)]">PNG images only for better visuals. Up to 5 MB.</p>
            {draft.image && <button type="button" onClick={() => { imageRequest.current += 1; setPreparingImage(false); changeField('image', ''); setImageName('') }} className="min-h-8 text-[12px]! text-[var(--muted)] underline underline-offset-4 hover:text-rose-200">Remove image</button>}
          </div>
          {imageName && <p className="mt-1 truncate text-[12px] text-[#c1c9b8]" title={imageName}>{imageName}</p>}
          <p role="status" className="sr-only">{preparingImage ? 'Preparing feature image.' : draft.image ? 'Feature image ready.' : ''}</p>
          {fieldError('image')}
        </div>

        <div className="min-w-0">
          {formError && <p role="alert" className="mb-6 rounded-xl border border-rose-300/25 bg-rose-300/5 px-4 py-3 text-[12px] leading-relaxed text-rose-200">{formError}</p>}
          <div className="grid min-w-0 gap-6 sm:grid-cols-2">
            <div className="min-w-0 sm:col-span-2">
              <label htmlFor={`${formId}-name`} className={labelClass}>Product name</label>
              <input {...fieldProps('name')} required type="text" maxLength={160} value={draft.name} onChange={(event) => changeField('name', event.target.value)} placeholder={'e.g. "Afterhours" Heavyweight Graphic Tee'} className={inputClass} />
              <p id={`${formId}-name-hint`} className="mt-2 text-[12px] text-[var(--muted)]">Include the collection name and silhouette.</p>
              {fieldError('name')}
            </div>
            <div className="min-w-0">
              <label htmlFor={`${formId}-category`} className={labelClass}>Product category</label>
              <SelectMenu id={`${formId}-category`} invalid={Boolean(errors.category)} describedBy={`${formId}-category-hint${errors.category ? ` ${formId}-category-error` : ''}`} label="Category" value={draft.category} options={[{ value: '', label: 'Choose a category' }, ...categories.map((category) => ({ value: category, label: category }))]} onChange={(value) => changeField('category', value)} />
              <p id={`${formId}-category-hint`} className="mt-2 text-[12px] text-[var(--muted)]">Place it in the right rotation.</p>
              {fieldError('category')}
            </div>
            <div className="min-w-0">
              <label htmlFor={`${formId}-rating`} className={labelClass}>Rating</label>
              <input {...fieldProps('rating')} required type="number" min="0" max="5" step="0.1" inputMode="decimal" value={draft.rating} onChange={(event) => changeField('rating', event.target.value)} placeholder="e.g. 4.5" className={inputClass} />
              <p id={`${formId}-rating-hint`} className="mt-2 text-[12px] text-[var(--muted)]">A score from 0 to 5 stars.</p>
              {fieldError('rating')}
            </div>
            <div className="min-w-0 sm:col-span-2">
              <label htmlFor={`${formId}-description`} className={labelClass}>Description</label>
              <textarea {...fieldProps('description')} required rows={4} maxLength={4000} value={draft.description} onChange={(event) => changeField('description', event.target.value)} placeholder="Tell the story of the piece, its fit, and its artwork." className={`${inputClass} min-h-28 resize-y`} />
              <p id={`${formId}-description-hint`} className="mt-2 text-[12px] text-[var(--muted)]">Shown in the showcase and on the product detail page.</p>
              {fieldError('description')}
            </div>
            <div className="min-w-0 sm:col-span-2">
              <label htmlFor={`${formId}-specifications`} className={labelClass}>Product specifications</label>
              <textarea {...fieldProps('specifications')} required rows={4} maxLength={4000} value={draft.specifications} onChange={(event) => changeField('specifications', event.target.value)} placeholder={'280GSM heavyweight cotton\nOversized drop-shoulder fit\nVintage charcoal wash'} className={`${inputClass} min-h-28 resize-y`} />
              <p id={`${formId}-specifications-hint`} className="mt-2 text-[12px] text-[var(--muted)]">One specification per line. Sizes S, M, and XL are included.</p>
              {fieldError('specifications')}
            </div>
            <div className="min-w-0">
              <label htmlFor={`${formId}-price`} className={labelClass}>Price (PHP)</label>
              <input {...fieldProps('price')} required type="number" min="0.01" step="0.01" inputMode="decimal" value={draft.price} onChange={(event) => changeField('price', event.target.value)} placeholder="e.g. 1200" className={inputClass} />
              <p id={`${formId}-price-hint`} className="mt-2 text-[12px] text-[var(--muted)]">Unit price in Philippine pesos.</p>
              {fieldError('price')}
            </div>
            <div className="min-w-0">
              <label htmlFor={`${formId}-quantity`} className={labelClass}>Quantity in stock</label>
              <input {...fieldProps('quantity')} required type="number" min="0" step="1" inputMode="numeric" value={draft.quantity} onChange={(event) => changeField('quantity', event.target.value)} placeholder="e.g. 10" className={inputClass} />
              <p id={`${formId}-quantity-hint`} className="mt-2 text-[12px] text-[var(--muted)]">Total stock across sizes. Use 0 for sold out.</p>
              {fieldError('quantity')}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <p className="max-w-56 text-[12px] leading-relaxed text-[var(--muted)]">Saved in this browser and added to your collection right away.</p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={onBack} className="min-h-12 rounded-full border border-white/15 bg-white/[0.025] px-5 text-[12px]! text-[#d1d7cb] hover:bg-white/[0.07] motion-safe:transition-colors">Cancel</button>
              <button type="submit" disabled={preparingImage} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-[12px]! font-semibold! text-[#171b13] hover:bg-[#deedbf] disabled:cursor-wait disabled:opacity-45 motion-safe:transition-colors"><Icon name="plus" className="size-4" />{preparingImage ? 'Preparing image…' : 'Add Product'}</button>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}
