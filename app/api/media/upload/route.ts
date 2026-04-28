import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

import { NextRequest, NextResponse } from 'next/server'

import { requireSessionUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8MB

export async function POST(request: NextRequest) {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth.response

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 },
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 8MB)' },
        { status: 413 },
      )
    }

    const mimeType = file.type || 'application/octet-stream'
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Seules les images sont autorisées' },
        { status: 400 },
      )
    }

    const ext = path.extname(file.name) || '.bin'
    const safeBase = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .slice(0, 40)
    const fileName = `${Date.now()}-${safeBase}${ext}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, fileName)

    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, bytes)

    const storageUrl = `/uploads/${fileName}`

    const asset = await prisma.mediaAsset.create({
      data: {
        userId: auth.userId,
        source: 'UPLOAD',
        title: file.name,
        mimeType,
        storageUrl,
        metadata: { size: file.size },
      },
    })

    return NextResponse.json({
      success: true,
      data: asset,
    })
  } catch (error) {
    console.error('POST /api/media/upload error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    )
  }
}

