// File storage abstraction - supports local storage and cloud providers

interface StorageProvider {
  uploadFile(file: File, path: string): Promise<string>
  deleteFile(path: string): Promise<void>
  getFileUrl(path: string): Promise<string>
}

interface UploadOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  generateThumbnail?: boolean
  compressionQuality?: number
}

// Local storage provider (for development)
class LocalStorageProvider implements StorageProvider {
  private uploadDir: string

  constructor(uploadDir = 'uploads') {
    this.uploadDir = uploadDir
  }

  async uploadFile(file: File, path: string): Promise<string> {
    // In a real implementation with Node.js, you would use fs
    /*
    const fs = require('fs').promises
    const pathModule = require('path')
    
    const fullPath = pathModule.join(process.cwd(), 'public', this.uploadDir, path)
    const dir = pathModule.dirname(fullPath)
    
    // Create directory if it doesn't exist
    await fs.mkdir(dir, { recursive: true })
    
    // Convert File to Buffer (in Node.js environment)
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(fullPath, buffer)
    */
    
    // Mock implementation
    const fileName = `${Date.now()}_${file.name}`
    const fullPath = `/${this.uploadDir}/${path}/${fileName}`
    
    console.log(`Mock upload: ${file.name} -> ${fullPath}`)
    return fullPath
  }

  async deleteFile(path: string): Promise<void> {
    /*
    const fs = require('fs').promises
    const fullPath = pathModule.join(process.cwd(), 'public', path)
    
    try {
      await fs.unlink(fullPath)
    } catch (error) {
      // File doesn't exist, ignore
    }
    */
    console.log(`Mock delete: ${path}`)
  }

  async getFileUrl(path: string): Promise<string> {
    return `${process.env.FRONTEND_URL || 'http://localhost:3000'}${path}`
  }
}

// AWS S3 provider
class S3StorageProvider implements StorageProvider {
  private bucketName: string
  private region: string
  private accessKeyId: string
  private secretAccessKey: string

  constructor(config: {
    bucketName: string
    region: string
    accessKeyId: string
    secretAccessKey: string
  }) {
    this.bucketName = config.bucketName
    this.region = config.region
    this.accessKeyId = config.accessKeyId
    this.secretAccessKey = config.secretAccessKey
  }

  async uploadFile(file: File, path: string): Promise<string> {
    /*
    // In a real implementation, you would use AWS SDK
    const AWS = require('aws-sdk')
    
    const s3 = new AWS.S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region
    })

    const fileName = `${Date.now()}_${file.name}`
    const key = `${path}/${fileName}`

    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      ACL: 'public-read'
    }

    const result = await s3.upload(uploadParams).promise()
    return result.Location
    */
    
    throw new Error('AWS S3 not implemented - install aws-sdk package')
  }

  async deleteFile(path: string): Promise<void> {
    /*
    const s3 = new AWS.S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region
    })

    await s3.deleteObject({
      Bucket: this.bucketName,
      Key: path
    }).promise()
    */
  }

  async getFileUrl(path: string): Promise<string> {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${path}`
  }
}

// Cloudinary provider
class CloudinaryProvider implements StorageProvider {
  private cloudName: string
  private apiKey: string
  private apiSecret: string

  constructor(config: {
    cloudName: string
    apiKey: string
    apiSecret: string
  }) {
    this.cloudName = config.cloudName
    this.apiKey = config.apiKey
    this.apiSecret = config.apiSecret
  }

  async uploadFile(file: File, path: string): Promise<string> {
    /*
    // In a real implementation, you would use Cloudinary SDK
    const cloudinary = require('cloudinary').v2
    
    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: this.apiKey,
      api_secret: this.apiSecret
    })

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: path,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto'
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(Buffer.from(await file.arrayBuffer()))
    })

    return uploadResult.secure_url
    */
    
    throw new Error('Cloudinary not implemented - install cloudinary package')
  }

  async deleteFile(path: string): Promise<void> {
    /*
    const cloudinary = require('cloudinary').v2
    await cloudinary.uploader.destroy(path)
    */
  }

  async getFileUrl(path: string): Promise<string> {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${path}`
  }
}

// Main storage service
class StorageService {
  private provider: StorageProvider
  private defaultOptions: UploadOptions

  constructor() {
    this.provider = this.createProvider()
    this.defaultOptions = {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      generateThumbnail: false,
      compressionQuality: 0.8
    }
  }

  private createProvider(): StorageProvider {
    const storageProvider = process.env.STORAGE_PROVIDER || 'local'

    switch (storageProvider) {
      case 's3':
        const s3Config = {
          bucketName: process.env.AWS_S3_BUCKET!,
          region: process.env.AWS_REGION!,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
        return new S3StorageProvider(s3Config)

      case 'cloudinary':
        const cloudinaryConfig = {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
          apiKey: process.env.CLOUDINARY_API_KEY!,
          apiSecret: process.env.CLOUDINARY_API_SECRET!
        }
        return new CloudinaryProvider(cloudinaryConfig)

      default:
        return new LocalStorageProvider()
    }
  }

  private validateFile(file: File, options: UploadOptions): void {
    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      throw new Error(`File size exceeds limit of ${options.maxSize} bytes`)
    }

    // Check file type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed. Allowed types: ${options.allowedTypes.join(', ')}`)
    }

    // Check for malicious file names
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      throw new Error('Invalid file name')
    }
  }

  private generateSafeFileName(originalName: string): string {
    // Remove special characters and spaces
    const cleanName = originalName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase()

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    
    const ext = cleanName.split('.').pop()
    const nameWithoutExt = cleanName.replace(/\.[^/.]+$/, '')
    
    return `${timestamp}_${randomString}_${nameWithoutExt}.${ext}`
  }

  async uploadAvatar(file: File, userId: string): Promise<string> {
    const options: UploadOptions = {
      ...this.defaultOptions,
      maxSize: 2 * 1024 * 1024, // 2MB for avatars
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      generateThumbnail: true,
      compressionQuality: 0.7
    }

    this.validateFile(file, options)
    
    const safeFileName = this.generateSafeFileName(file.name)
    const path = `avatars/${userId}`
    
    // Process image if needed (compression, thumbnail generation)
    const processedFile = await this.processImage(file, options)
    
    return await this.provider.uploadFile(processedFile, path + '/' + safeFileName)
  }

  async uploadDocument(file: File, userId: string, category: string = 'documents'): Promise<string> {
    const options: UploadOptions = {
      maxSize: 10 * 1024 * 1024, // 10MB for documents
      allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }

    this.validateFile(file, options)
    
    const safeFileName = this.generateSafeFileName(file.name)
    const path = `${category}/${userId}`
    
    return await this.provider.uploadFile(file, path + '/' + safeFileName)
  }

  async uploadGeneral(file: File, userId: string, category: string): Promise<string> {
    this.validateFile(file, this.defaultOptions)
    
    const safeFileName = this.generateSafeFileName(file.name)
    const path = `${category}/${userId}`
    
    return await this.provider.uploadFile(file, path + '/' + safeFileName)
  }

  async deleteFile(filePath: string): Promise<void> {
    await this.provider.deleteFile(filePath)
  }

  async getFileUrl(filePath: string): Promise<string> {
    return await this.provider.getFileUrl(filePath)
  }

  private async processImage(file: File, options: UploadOptions): Promise<File> {
    // Image processing (compression, resizing, etc.)
    // In a real implementation, you might use a library like sharp or canvas
    
    if (!options.compressionQuality || options.compressionQuality >= 1) {
      return file // No compression needed
    }

    // Mock implementation - in reality you'd use image processing library
    /*
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    return new Promise((resolve) => {
      img.onload = () => {
        // Resize if needed
        const maxWidth = 800
        const maxHeight = 600
        
        let { width, height } = img
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
        
        canvas.width = width
        canvas.height = height
        
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            const processedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(processedFile)
          },
          file.type,
          options.compressionQuality
        )
      }
      
      img.src = URL.createObjectURL(file)
    })
    */
    
    return file // Return original file for now
  }

  // Utility methods
  async generateThumbnail(file: File, width: number = 150, height: number = 150): Promise<File> {
    // Generate thumbnail - mock implementation
    return file
  }

  getFileInfo(file: File): {
    name: string
    size: number
    type: string
    lastModified: number
  } {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/')
  }

  isDocumentFile(file: File): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    return documentTypes.includes(file.type)
  }
}

// Create singleton instance
const storageService = new StorageService()

// Export main functions
export const uploadAvatar = storageService.uploadAvatar.bind(storageService)
export const uploadDocument = storageService.uploadDocument.bind(storageService)
export const uploadGeneral = storageService.uploadGeneral.bind(storageService)
export const deleteFile = storageService.deleteFile.bind(storageService)
export const getFileUrl = storageService.getFileUrl.bind(storageService)

// Export utility functions
export const formatFileSize = storageService.formatFileSize.bind(storageService)
export const isImageFile = storageService.isImageFile.bind(storageService)
export const isDocumentFile = storageService.isDocumentFile.bind(storageService)
export const getFileInfo = storageService.getFileInfo.bind(storageService)

// Export classes and interfaces
export { StorageService, LocalStorageProvider, S3StorageProvider, CloudinaryProvider }
export type { StorageProvider, UploadOptions }
