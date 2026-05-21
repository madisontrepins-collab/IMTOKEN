import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Checkbox } from '@repo/ui/components/checkbox'
import { Input } from '@repo/ui/components/input'
import { Progress } from '@repo/ui/components/progress'
import { StepCard } from '@repo/ui/components/step-card'
import { Textarea } from '@repo/ui/components/textarea'
import { toast } from '@repo/ui/components/toast'
import { useMemo, useState } from 'react'

const capsuleSteps = [
  {
    label: 'Intent parsed',
    detail: 'AI extracts recipient, asset, unlock rules, and message without taking custody.',
    state: 'completed' as const,
  },
  {
    label: 'Human review',
    detail: 'You compare every compiled field before an EIP-712 signature is requested.',
    state: 'active' as const,
  },
  {
    label: 'Time capsule sealed',
    detail: 'Funds move only after the signed vault transaction is confirmed onchain.',
    state: 'pending' as const,
  },
]

const riskChecks = [
  '0.1 ETH will be locked until both unlock rules are met.',
  'The letter is public metadata unless encrypted before upload.',
  'Oracle-based price conditions can lag or fail during market stress.',
]

function Glyph({ children }: { children: string }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-body-sm font-bold text-primary">
      {children}
    </span>
  )
}

function FieldPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2">
      <div className="text-caption text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-body-md font-semibold">{value}</div>
    </div>
  )
}

function WalletDashboard() {
  const [intent, setIntent] = useState(
    'I want to leave 0.1 ETH and a letter for my daughter on her birthday in 2030. Unlock it only after block 32000000 and if ETH is above $8,000.',
  )
  const [recipient, setRecipient] = useState('0xDau9...2030')
  const [amount, setAmount] = useState('0.1 ETH')
  const [unlockDate, setUnlockDate] = useState('2030-06-18')
  const [ethPrice, setEthPrice] = useState('8000')
  const [letter, setLetter] = useState(
    'Happy birthday. This is a tiny vault from the year imToken turned ten. Keep the key, keep the story, keep control.',
  )
  const [confirmed, setConfirmed] = useState(false)

  const signatureDigest = useMemo(() => {
    const seed = `${recipient}-${amount}-${unlockDate}-${ethPrice}-${letter.length}`
    let hash = 0

    for (let index = 0; index < seed.length; index += 1) {
      hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
    }

    return `0xCAPSULE${hash.toString(16).padStart(8, '0').toUpperCase()}`
  }, [amount, ethPrice, letter.length, recipient, unlockDate])

  const handleCompile = () => {
    toast.success('Time capsule compiled', {
      description: 'Review the EIP-712 preview before signing.',
    })
  }

  const handleSeal = () => {
    if (!confirmed) {
      toast.error('Review required', {
        description: 'Confirm the lock rules before requesting a signature.',
      })
      return
    }

    toast.success('Signature request prepared', {
      description: 'Your wallet keeps the final signing key.',
    })
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
      <section className="flex flex-col gap-6 rounded-2xl border border-border bg-surface-cool p-5 shadow-[var(--shadow-card)] sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="primary" size="lg">
            Wallet Time Capsule
          </Badge>
          <Badge variant="success" size="lg">
            Best User Control
          </Badge>
        </div>

        <div>
          <p className="mb-3 text-body-md font-semibold text-primary">AI co-creation concept</p>
          <h1 className="max-w-xl text-display-lg font-bold text-foreground">
            Seal a future gift without giving up the key.
          </h1>
          <p className="mt-4 max-w-xl text-body-lg leading-7 text-muted-foreground">
            Write a chain-native letter, attach assets, and let AI compile the unlock conditions
            into reviewable transaction data. AI drafts. You decide. Your wallet signs.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <FieldPill label="Vault asset" value={amount} />
          <FieldPill label="Unlock date" value={unlockDate} />
          <FieldPill label="Price gate" value={`ETH > $${ethPrice}`} />
        </div>

        <div className="rounded-lg border border-ai-subtle-border bg-ai-subtle-bg p-4">
          <div className="text-caption font-semibold uppercase text-ai-text">Natural language intent</div>
          <Textarea
            className="mt-3 min-h-36 bg-background"
            value={intent}
            onChange={(event) => setIntent(event.target.value)}
          />
          <Button className="mt-4 w-full sm:w-auto" size="lg" onClick={handleCompile}>
            Compile capsule
          </Button>
        </div>
      </section>

      <section className="grid gap-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>AI compiled vault</CardTitle>
              <CardDescription>Editable parameters before the wallet asks for your signature.</CardDescription>
            </div>
            <Badge variant="neutral">Draft</Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2">
                <span>Recipient</span>
                <Input value={recipient} onChange={(event) => setRecipient(event.target.value)} />
              </label>
              <label className="space-y-2">
                <span>Locked asset</span>
                <Input value={amount} onChange={(event) => setAmount(event.target.value)} />
              </label>
              <label className="space-y-2">
                <span>Earliest date</span>
                <Input value={unlockDate} onChange={(event) => setUnlockDate(event.target.value)} />
              </label>
              <label className="space-y-2">
                <span>ETH price condition</span>
                <Input value={ethPrice} onChange={(event) => setEthPrice(event.target.value)} />
              </label>
            </div>

            <label className="space-y-2">
              <span>Letter payload</span>
              <Textarea value={letter} onChange={(event) => setLetter(event.target.value)} />
            </label>

            <div className="rounded-lg border border-border bg-background p-4 font-mono text-caption">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">EIP-712 digest</span>
                <Badge variant="primary">typed data</Badge>
              </div>
              <div className="mt-3 break-all text-foreground">{signatureDigest}</div>
              <div className="mt-3 grid gap-2 text-muted-foreground sm:grid-cols-2">
                <span>domain: TimeCapsuleVault</span>
                <span>chainId: 1</span>
                <span>method: createCapsule</span>
                <span>oracle: ETH/USD</span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-cool p-4">
              <Checkbox
                id="reviewed"
                checked={confirmed}
                onCheckedChange={(value) => setConfirmed(value === true)}
              />
              <label htmlFor="reviewed" className="text-body-sm leading-5">
                I reviewed the recipient, lock rules, and message. I understand AI cannot sign or
                recover this capsule for me.
              </label>
            </div>

            <Button className="w-full" size="hero" onClick={handleSeal}>
              Seal with wallet
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Control score</CardTitle>
              <CardDescription>Designed for explicit custody boundaries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={88} className="h-2" />
              <div className="grid gap-3">
                {capsuleSteps.map((step, index) => (
                  <StepCard
                    key={step.label}
                    icon={<Glyph>{String(index + 1)}</Glyph>}
                    label={step.label}
                    detail={step.detail}
                    state={step.state}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk preview</CardTitle>
              <CardDescription>AI turns hidden tradeoffs into signer-visible checks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskChecks.map((check) => (
                <div
                  key={check}
                  className="flex gap-3 rounded-lg border border-warning-border bg-warning-surface p-3 text-body-sm text-warning-text"
                >
                  <Glyph>!</Glyph>
                  <span>{check}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export { WalletDashboard }
