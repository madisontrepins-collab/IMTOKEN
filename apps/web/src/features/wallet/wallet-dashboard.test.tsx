import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { WalletDashboard } from './wallet-dashboard'

describe('WalletDashboard', () => {
  it('renders the wallet time capsule screen', () => {
    const html = renderToString(
      <MemoryRouter>
        <WalletDashboard />
      </MemoryRouter>,
    )

    expect(html).toContain('Wallet Time Capsule')
    expect(html).toContain('Seal a future gift')
    expect(html).toContain('0.1 ETH')
    expect(html).toContain('EIP-712 typed-data preview')
    expect(html).toContain('Token Core material use')
    expect(html).toContain('Open wallet review')
  })
})
