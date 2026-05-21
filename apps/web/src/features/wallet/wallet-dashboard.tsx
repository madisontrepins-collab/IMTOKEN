import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Checkbox } from '@repo/ui/components/checkbox'
import { Input } from '@repo/ui/components/input'
import { Progress } from '@repo/ui/components/progress'
import { StepCard } from '@repo/ui/components/step-card'
import { Textarea } from '@repo/ui/components/textarea'
import { toast } from '@repo/ui/components/toast'
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Cpu,
  FileSignature,
  Gift,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  WalletCards,
  WandSparkles,
  XIcon,
} from 'lucide-react'
import { useMemo, useState } from 'react'

type DemoStage = 'draft' | 'compiled' | 'signed'

const riskChecks = [
  '0.1 ETH will be locked until both unlock rules are met.',
  'The letter should be encrypted before public storage.',
  'Oracle-based price conditions can lag or fail during market stress.',
]

const tokenCoreReferences = [
  'Local account ownership: AI prepares data, but the wallet keeps the key.',
  'Typed-data review: EIP-712 fields are shown before any signature request.',
  'Transaction boundary: createCapsule parameters are visible before approval.',
]

const stageLabels: Record<DemoStage, string> = {
  draft: 'Draft',
  compiled: 'Ready to sign',
  signed: 'Capsule sealed',
}

function IconBubble({
  children,
  tone = 'primary',
}: {
  children: React.ReactNode
  tone?: 'primary' | 'success' | 'warning' | 'neutral'
}) {
  const toneClass = {
    primary: 'bg-primary-soft text-primary',
    success: 'bg-success-surface text-success-text',
    warning: 'bg-warning-surface text-warning-text',
    neutral: 'bg-surface-cool text-muted-foreground',
  }[tone]

  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${toneClass} [&_svg]:size-4`}
    >
      {children}
    </span>
  )
}

function FieldPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-[var(--shadow-card)]">
      <div className="text-caption text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-body-md font-semibold">{value}</div>
    </div>
  )
}

function JsonLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-border border-b py-2 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{value}</span>
    </div>
  )
}

function CapsuleMap({ stage, walletOpen }: { stage: DemoStage; walletOpen: boolean }) {
  const items = [
    { label: 'Intent', detail: 'Natural language', icon: <WandSparkles />, active: true },
    {
      label: 'Compile',
      detail: 'Typed data',
      icon: <Cpu />,
      active: stage !== 'draft' || walletOpen,
    },
    {
      label: 'Review',
      detail: 'User control',
      icon: <ShieldCheck />,
      active: walletOpen || stage === 'signed',
    },
    { label: 'Unlock', detail: '2030 rules', icon: <CalendarClock />, active: stage === 'signed' },
  ]

  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-[var(--shadow-card)]">
      <div className="grid gap-3 sm:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="relative rounded-lg border border-border bg-surface-cool p-3"
          >
            {index < items.length - 1 ? (
              <ArrowRight className="absolute top-1/2 -right-4 hidden size-4 -translate-y-1/2 text-muted-foreground sm:block" />
            ) : null}
            <IconBubble tone={item.active ? 'primary' : 'neutral'}>{item.icon}</IconBubble>
            <div className="mt-3 text-body-sm font-bold">{item.label}</div>
            <div className="mt-1 text-caption text-muted-foreground">{item.detail}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-primary/30 bg-surface-blue p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-caption text-muted-foreground">Capsule object</div>
            <div className="mt-1 text-title-sm font-bold">Letter + asset + unlock policy</div>
          </div>
          <Badge variant={stage === 'signed' ? 'success' : 'primary'}>
            {walletOpen ? 'Wallet reviewing' : stageLabels[stage]}
          </Badge>
        </div>
      </div>
    </div>
  )
}

function DataChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-cool px-3 py-2">
      <div className="text-caption text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-caption text-foreground">{value}</div>
    </div>
  )
}

function PhonePreview({
  amount,
  capsuleId,
  ethPrice,
  recipient,
  signatureDigest,
  stage,
  unlockDate,
  walletOpen,
}: {
  amount: string
  capsuleId: string
  ethPrice: string
  recipient: string
  signatureDigest: string
  stage: DemoStage
  unlockDate: string
  walletOpen: boolean
}) {
  const phoneStatus = walletOpen
    ? 'Signing request'
    : stage === 'signed'
      ? 'Capsule sealed'
      : stage === 'compiled'
        ? 'Review ready'
        : 'Intent draft'
  const phoneProgress = walletOpen ? 82 : stage === 'signed' ? 100 : stage === 'compiled' ? 58 : 18
  const phoneTone = stage === 'signed' ? 'success' : walletOpen ? 'primary' : 'neutral'

  return (
    <aside className="lg:col-span-2 xl:col-span-1">
      <div className="sticky top-8 mx-auto w-full max-w-sm">
        <div className="mb-3 flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 shadow-[var(--shadow-card)]">
          <div>
            <div className="text-caption text-muted-foreground">Live phone view</div>
            <div className="text-body-sm font-bold">Simulated imToken approval</div>
          </div>
          <IconBubble tone={phoneTone}>
            <WalletCards />
          </IconBubble>
        </div>

        <div className="rounded-[2rem] border border-foreground bg-foreground p-3 shadow-[var(--shadow-card-lg)]">
          <div className="min-h-[680px] rounded-[1.5rem] bg-background p-4 text-foreground">
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-caption text-muted-foreground">imToken wallet</div>
                <div className="mt-1 text-title-sm font-bold">Time Capsule</div>
              </div>
              <Badge variant={stage === 'signed' ? 'success' : walletOpen ? 'primary' : 'neutral'}>
                {phoneStatus}
              </Badge>
            </div>

            <div className="mt-5 rounded-lg border border-border bg-surface-cool p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-caption text-muted-foreground">Locked gift</div>
                  <div className="mt-2 text-display-lg font-bold">{amount}</div>
                  <div className="mt-2 text-body-sm text-muted-foreground">For {recipient}</div>
                </div>
                <IconBubble tone="success">
                  <Gift />
                </IconBubble>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Progress value={phoneProgress} className="h-2" />
              <div className="grid grid-cols-3 gap-2 text-center text-caption">
                <span
                  className={
                    stage !== 'draft' || walletOpen ? 'text-primary' : 'text-muted-foreground'
                  }
                >
                  Compile
                </span>
                <span
                  className={
                    walletOpen || stage === 'signed' ? 'text-primary' : 'text-muted-foreground'
                  }
                >
                  Review
                </span>
                <span
                  className={stage === 'signed' ? 'text-success-text' : 'text-muted-foreground'}
                >
                  Seal
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <DataChip label="unlock" value={unlockDate} />
              <DataChip label="price gate" value={`ETH > $${ethPrice}`} />
              <DataChip label="typed digest" value={signatureDigest.slice(0, 18)} />
            </div>

            {walletOpen ? (
              <div className="mt-4 rounded-lg border border-primary bg-surface-blue p-3">
                <div className="flex items-center gap-2 text-body-sm font-bold">
                  <FileSignature className="size-4" />
                  Confirm signature
                </div>
                <p className="mt-2 text-caption text-muted-foreground">
                  Token Core-style typed data is ready. Only the wallet owner can approve.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-border bg-background py-2 text-center text-caption">
                    Reject
                  </div>
                  <div className="rounded-lg bg-primary py-2 text-center text-caption font-semibold text-primary-foreground">
                    Sign
                  </div>
                </div>
              </div>
            ) : null}

            {stage === 'signed' ? (
              <div className="mt-4 rounded-lg border border-success-border bg-success-surface p-3">
                <div className="flex items-center gap-2 text-body-sm font-bold text-success-text">
                  <CheckCircle2 className="size-4" />
                  Capsule receipt
                </div>
                <div className="mt-2 font-mono text-caption text-success-text">{capsuleId}</div>
              </div>
            ) : null}

            <div className="mt-5 rounded-lg bg-foreground py-3 text-center text-body-sm font-semibold text-background">
              {stage === 'signed'
                ? 'Ready for 2030'
                : walletOpen
                  ? 'Awaiting user signature'
                  : 'Self-custody preview'}
            </div>
          </div>
        </div>
      </div>
    </aside>
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
  const [stage, setStage] = useState<DemoStage>('draft')
  const [walletOpen, setWalletOpen] = useState(false)

  const signatureDigest = useMemo(() => {
    const seed = `${recipient}-${amount}-${unlockDate}-${ethPrice}-${letter.length}`
    let hash = 0

    for (let index = 0; index < seed.length; index += 1) {
      hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
    }

    return `0xCAPSULE${hash.toString(16).padStart(8, '0').toUpperCase()}`
  }, [amount, ethPrice, letter.length, recipient, unlockDate])

  const capsuleId = `TC-${signatureDigest.slice(-6)}`
  const flowProgress = stage === 'signed' ? 100 : stage === 'compiled' ? 66 : 24
  const statusBadge = stageLabels[stage]

  const capsuleSteps = [
    {
      label: 'Intent parsed',
      detail: 'AI extracts recipient, asset, unlock rules, and message without taking custody.',
      state: stage === 'draft' ? ('active' as const) : ('completed' as const),
    },
    {
      label: 'Token Core review',
      detail: 'The demo exposes typed signing data and transaction parameters before approval.',
      state:
        stage === 'draft'
          ? ('pending' as const)
          : stage === 'compiled'
            ? ('active' as const)
            : ('completed' as const),
    },
    {
      label: 'User-controlled signature',
      detail: 'A simulated wallet screen makes the final signing step explicit.',
      state: stage === 'signed' ? ('completed' as const) : ('pending' as const),
    },
  ]

  const handleCompile = () => {
    setStage('compiled')
    setConfirmed(false)
    setWalletOpen(false)
    toast.success('Time capsule compiled', {
      description: 'AI generated Token Core-style signing data for review.',
    })
  }

  const handleSeal = () => {
    if (stage === 'draft') {
      toast.error('Compile first', {
        description: 'Generate the reviewable capsule data before opening the wallet.',
      })
      return
    }

    if (!confirmed) {
      toast.error('Review required', {
        description: 'Confirm the lock rules before requesting a signature.',
      })
      return
    }

    setWalletOpen(true)
  }

  const handleSign = () => {
    setStage('signed')
    setWalletOpen(false)
    toast.success('Capsule sealed', {
      description: `${capsuleId} is ready for demo submission.`,
    })
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] xl:grid-cols-[0.88fr_1fr_0.72fr] lg:gap-8">
      <section className="flex flex-col gap-5">
        <div className="rounded-lg border border-border bg-background p-5 shadow-[var(--shadow-card)] sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary" size="lg">
              Wallet Time Capsule
            </Badge>
            <Badge variant="success" size="lg">
              Best User Control
            </Badge>
            <Badge variant="neutral" size="lg">
              Token Core inspired
            </Badge>
          </div>

          <div className="mt-7">
            <div className="mb-3 flex items-center gap-2 text-body-md font-semibold text-primary">
              <Sparkles className="size-4" />
              Runnable AI wallet demo
            </div>
            <h1 className="max-w-xl text-display-lg font-bold text-foreground">
              Seal a future gift without giving up the key.
            </h1>
            <p className="mt-4 max-w-xl text-body-lg leading-7 text-muted-foreground">
              Write a chain-native letter, attach assets, and let AI compile the unlock conditions
              into Token Core-style signing data. AI drafts. You decide. Your wallet signs.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <FieldPill label="Vault asset" value={amount} />
            <FieldPill label="Unlock date" value={unlockDate} />
            <FieldPill label="Price gate" value={`ETH > $${ethPrice}`} />
          </div>
        </div>

        <CapsuleMap stage={stage} walletOpen={walletOpen} />

        <div className="rounded-lg border border-ai-subtle-border bg-ai-subtle-bg p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-caption font-semibold uppercase text-ai-text">
              <WandSparkles className="size-4" />
              Natural language intent
            </div>
            <Badge variant={stage === 'draft' ? 'neutral' : 'primary'}>{statusBadge}</Badge>
          </div>
          <Textarea
            className="mt-3 min-h-36 bg-background"
            value={intent}
            onChange={(event) => setIntent(event.target.value)}
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" size="lg" onClick={handleCompile}>
              <WandSparkles className="size-4" />
              Compile capsule
            </Button>
            <Button className="w-full sm:w-auto" variant="outline" size="lg" onClick={handleSeal}>
              <WalletCards className="size-4" />
              Open wallet review
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Demo flow</CardTitle>
            <CardDescription>Complete these steps in order during judging.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={flowProgress} className="h-2" />
            {capsuleSteps.map((step, index) => (
              <StepCard
                key={step.label}
                icon={<IconBubble>{String(index + 1)}</IconBubble>}
                label={step.label}
                detail={step.detail}
                state={step.state}
              />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6">
        <Card>
          <CardHeader>
            <div>
              <div className="mb-2 flex items-center gap-2 text-caption font-semibold text-primary">
                <LockKeyhole className="size-4" />
                USER CONTROL CONSOLE
              </div>
              <CardTitle>AI compiled vault</CardTitle>
              <CardDescription>
                Editable parameters before the wallet asks for your signature.
              </CardDescription>
            </div>
            <Badge
              variant={
                stage === 'signed' ? 'success' : stage === 'compiled' ? 'primary' : 'neutral'
              }
            >
              {statusBadge}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2" htmlFor="capsule-recipient">
                <span>Recipient</span>
                <Input
                  id="capsule-recipient"
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                />
              </label>
              <label className="space-y-2" htmlFor="capsule-amount">
                <span>Locked asset</span>
                <Input
                  id="capsule-amount"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </label>
              <label className="space-y-2" htmlFor="capsule-unlock-date">
                <span>Earliest date</span>
                <Input
                  id="capsule-unlock-date"
                  value={unlockDate}
                  onChange={(event) => setUnlockDate(event.target.value)}
                />
              </label>
              <label className="space-y-2" htmlFor="capsule-eth-price">
                <span>ETH price condition</span>
                <Input
                  id="capsule-eth-price"
                  value={ethPrice}
                  onChange={(event) => setEthPrice(event.target.value)}
                />
              </label>
            </div>

            <label className="space-y-2" htmlFor="capsule-letter">
              <span>Letter payload</span>
              <Textarea
                id="capsule-letter"
                value={letter}
                onChange={(event) => setLetter(event.target.value)}
              />
            </label>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-3 text-caption">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <FileSignature className="size-4" />
                  EIP-712 typed-data preview
                </span>
                <Badge variant="primary">Token Core style</Badge>
              </div>
              <div className="mt-3 break-all font-mono text-body-sm text-foreground">
                {signatureDigest}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <DataChip label="domain" value="TimeCapsuleVault" />
                <DataChip label="chainId" value="1" />
                <DataChip label="method" value="createCapsule" />
                <DataChip label="oracle" value="ETH/USD" />
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
              <KeyRound className="size-5" />
              Seal with wallet
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Token Core material use</CardTitle>
              <CardDescription>How the prototype maps to wallet-core concepts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tokenCoreReferences.map((reference, index) => (
                <div
                  key={reference}
                  className="flex gap-3 rounded-lg border border-border bg-background p-3 text-body-sm"
                >
                  <IconBubble>{String(index + 1)}</IconBubble>
                  <span>{reference}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk preview</CardTitle>
              <CardDescription>
                AI turns hidden tradeoffs into signer-visible checks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskChecks.map((check) => (
                <div
                  key={check}
                  className="flex gap-3 rounded-lg border border-warning-border bg-warning-surface p-3 text-body-sm text-warning-text"
                >
                  <IconBubble tone="warning">
                    <AlertTriangle />
                  </IconBubble>
                  <span>{check}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {stage === 'signed' ? (
          <Card>
            <CardHeader>
              <CardTitle>Demo capsule receipt</CardTitle>
              <CardDescription>The basic flow is complete and ready to show.</CardDescription>
            </CardHeader>
            <CardContent className="rounded-lg border border-success-border bg-success-surface p-4 font-mono text-caption text-success-text">
              <JsonLine label="capsuleId" value={capsuleId} />
              <JsonLine label="status" value="sealed_by_user_signature" />
              <JsonLine label="digest" value={signatureDigest} />
            </CardContent>
          </Card>
        ) : null}
      </section>

      <PhonePreview
        amount={amount}
        capsuleId={capsuleId}
        ethPrice={ethPrice}
        recipient={recipient}
        signatureDigest={signatureDigest}
        stage={stage}
        unlockDate={unlockDate}
        walletOpen={walletOpen}
      />

      {walletOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-5 shadow-[var(--shadow-dialog)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant="primary">Simulated wallet</Badge>
                <h2 className="mt-3 text-title-md font-bold">Review Token Core signing request</h2>
                <p className="mt-2 text-body-sm text-muted-foreground">
                  This demo does not broadcast a real transaction. It shows the user-controlled
                  approval screen that Token Core-style signing would protect.
                </p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setWalletOpen(false)}>
                <XIcon className="size-4" />
              </Button>
            </div>

            <div className="mt-5 rounded-lg border border-border bg-surface-cool p-4 font-mono text-caption">
              <JsonLine label="from" value="self-custody wallet" />
              <JsonLine label="to" value="TimeCapsuleVault" />
              <JsonLine label="asset" value={amount} />
              <JsonLine label="recipient" value={recipient} />
              <JsonLine label="unlock" value={`${unlockDate} + ETH>$${ethPrice}`} />
              <JsonLine label="digest" value={signatureDigest} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button variant="outline" size="lg" onClick={() => setWalletOpen(false)}>
                Reject
              </Button>
              <Button size="lg" onClick={handleSign}>
                <CheckCircle2 className="size-4" />
                Sign and seal capsule
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { WalletDashboard }
