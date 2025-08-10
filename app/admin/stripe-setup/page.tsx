'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, ExternalLink, Copy, Eye, EyeOff } from 'lucide-react'
import { STRIPE_SETUP_STEPS, TEST_CARDS, validateStripeConfig } from '@/lib/stripe-setup-guide'

export default function StripeSetupPage() {
  const [config, setConfig] = useState<any>(null)
  const [showKeys, setShowKeys] = useState(false)

  useEffect(() => {
    setConfig(validateStripeConfig())
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  if (!config) {
    return <div className="pt-16 min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 font-sora">Stripe Setup Guide</h1>
          <p className="text-lg text-muted-foreground">
            Connect your Stripe account to start accepting payments
          </p>
        </div>

        {/* Configuration Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {config.isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              Configuration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {config.isComplete ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ✅ Stripe is properly configured! Your payment system is ready to use.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  ❌ Missing configuration: {config.missing.join(', ')}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Publishable Key</span>
                <Badge variant={config.config.publishableKey ? "default" : "destructive"}>
                  {config.config.publishableKey ? "✓" : "✗"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Secret Key</span>
                <Badge variant={config.config.secretKey ? "default" : "destructive"}>
                  {config.config.secretKey ? "✓" : "✗"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Webhook Secret</span>
                <Badge variant={config.config.webhookSecret ? "default" : "destructive"}>
                  {config.config.webhookSecret ? "✓" : "✗"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Steps */}
        <div className="space-y-6">
          {STRIPE_SETUP_STEPS.map((step) => (
            <Card key={step.step}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {step.step}
                  </div>
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                
                {step.step === 1 && (
                  <div className="space-y-2">
                    <Button asChild>
                      <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Create Stripe Account
                      </a>
                    </Button>
                  </div>
                )}

                {step.step === 2 && (
                  <div className="space-y-2">
                    <Button asChild>
                      <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Get API Keys
                      </a>
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Copy both the Publishable key (pk_test_...) and Secret key (sk_test_...)
                    </p>
                  </div>
                )}

                {step.step === 3 && (
                  <div className="space-y-4">
                    <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span># Add to your .env.local file:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowKeys(!showKeys)}
                          className="text-green-400 hover:text-green-300"
                        >
                          {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY={showKeys ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here' : 'pk_test_••••••••'}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here')}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>STRIPE_SECRET_KEY={showKeys ? process.env.STRIPE_SECRET_KEY || 'sk_test_your_key_here' : 'sk_test_••••••••'}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard('STRIPE_SECRET_KEY=sk_test_your_key_here')}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard('STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret')}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step.step === 4 && (
                  <div className="space-y-4">
                    <Button asChild>
                      <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Configure Webhooks
                      </a>
                    </Button>
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="font-semibold mb-2">Webhook Configuration:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Endpoint URL:</strong> https://yourdomain.com/api/webhook/stripe</li>
                        <li>• <strong>Events:</strong> payment_intent.succeeded, payment_intent.payment_failed</li>
                        <li>• Copy the webhook secret to your .env.local file</li>
                      </ul>
                    </div>
                  </div>
                )}

                {step.step === 5 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Test Card Numbers:</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(TEST_CARDS).map(([type, number]) => (
                        <div key={type} className="flex items-center justify-between p-3 border rounded">
                          <span className="capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
                          <div className="flex items-center space-x-2">
                            <code className="text-sm">{number}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(number)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button asChild>
              <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Stripe Dashboard
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/retouch-services/order" target="_blank" rel="noopener noreferrer">
                Test Order Flow
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://stripe.com/docs/testing" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Testing Guide
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
