import { FC } from 'react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const UserNotRegisteredError: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 space-y-4">
        <h1 className="text-lg font-semibold text-slate-900">
          Account not registered
        </h1>
        <p className="text-sm text-slate-600">
          Your account is not registered for this application. Please
          contact the owner of the workspace or try signing in with
          another email address.
        </p>
        <div className="pt-2">
          <Button
            className="w-full"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/'
              }
            }}
          >
            Back to homepage
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default UserNotRegisteredError

