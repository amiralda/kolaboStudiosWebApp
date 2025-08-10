// WeTransfer integration utilities and workflow management

export interface WeTransferUpload {
  id: string
  orderId: string
  uploadUrl?: string
  downloadUrl?: string
  status: 'pending' | 'uploaded' | 'processing' | 'completed'
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface WeTransferDelivery {
  id: string
  orderId: string
  deliveryUrl: string
  expiresAt: string
  createdAt: string
  notifiedAt?: string
}

// WeTransfer workflow management
export class WeTransferWorkflow {
  static generateUploadInstructions(orderId: string, customerEmail: string) {
    return {
      subject: `Photo Upload Instructions - Order #${orderId}`,
      recipientEmail: 'uploads@kolabostudios.com', // Your WeTransfer receiving email
      message: `
Order ID: ${orderId}
Customer: ${customerEmail}
Service: Photo Retouching

Please upload your photos for retouching. Include this order ID in your transfer message.

Upload Guidelines:
- Maximum 20GB per transfer
- Supported formats: JPG, PNG, TIFF, PSD, RAW
- Include order ID: ${orderId}
- Original, unedited files preferred
      `.trim()
    }
  }

  static generateDeliveryInstructions(orderId: string, customerEmail: string) {
    return {
      subject: `Retouched Photos Ready - Order #${orderId}`,
      recipientEmail: customerEmail,
      message: `
Your retouched photos are ready for download!

Order ID: ${orderId}
Download expires in 7 days
Please download all files promptly

If you have any questions or need revisions, please contact us within 48 hours.

Thank you for choosing Kolabo Studios!
      `.trim()
    }
  }

  static createWeTransferUrl(instructions: ReturnType<typeof WeTransferWorkflow.generateUploadInstructions>) {
    const params = new URLSearchParams({
      to: instructions.recipientEmail,
      subject: instructions.subject,
      message: instructions.message
    })
    
    return `https://wetransfer.com/?${params.toString()}`
  }
}

// Order status management
export const ORDER_STATUSES = {
  PAYMENT_COMPLETED: 'payment_completed',
  AWAITING_UPLOAD: 'awaiting_upload',
  FILES_RECEIVED: 'files_received',
  IN_PROGRESS: 'in_progress',
  READY_FOR_REVIEW: 'ready_for_review',
  REVISION_REQUESTED: 'revision_requested',
  COMPLETED: 'completed',
  DELIVERED: 'delivered'
} as const

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES]
