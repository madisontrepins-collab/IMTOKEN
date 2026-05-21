import wasmUrl from '@consenlabs/tcx-wasm/tcx_wasm_bg.wasm?url'

const DEMO_PRF_KEY = '0000000000000000000000000000000000000000000000000000000000000001'
const DEMO_ENTROPY = '000102030405060708090a0b0c0d0e0f'
const ETH_DERIVATION_PATH = "m/44'/60'/0'/0/0"

type TcxWasmModule = typeof import('@consenlabs/tcx-wasm')

type DerivedAccount = {
  address: string
  chain: string
  derivationPath: string
  extPubKey?: string
  publicKey: string
}

type TokenCoreDemoProof = {
  address: string
  chain: string
  derivationPath: string
  packageName: string
  publicKeyPreview: string
  wasmAsset: string
}

let tokenCoreModulePromise: Promise<TcxWasmModule> | undefined
let tokenCoreProofPromise: Promise<TokenCoreDemoProof> | undefined

async function getTokenCoreModule() {
  if (!tokenCoreModulePromise) {
    tokenCoreModulePromise = import('@consenlabs/tcx-wasm').then(async (module) => {
      await module.default({ module_or_path: wasmUrl })
      return module
    })
  }

  return tokenCoreModulePromise
}

async function loadTokenCoreDemoProof() {
  if (!tokenCoreProofPromise) {
    tokenCoreProofPromise = getTokenCoreModule().then((module) => {
      const keystoreJson = module.create_keystore(
        JSON.stringify({
          credentialId: 'wallet-time-capsule-demo',
          entropy: DEMO_ENTROPY,
          network: 'MAINNET',
          prfKey: DEMO_PRF_KEY,
          rpId: 'wallet-time-capsule.local',
          userId: 'imtoken-10th-demo',
        }),
      )
      const accounts = JSON.parse(
        module.derive_accounts(
          JSON.stringify({
            derivations: [
              {
                chain: 'ETHEREUM',
                chainId: '1',
                derivationPath: ETH_DERIVATION_PATH,
                network: 'MAINNET',
              },
            ],
            key: DEMO_PRF_KEY,
            keystoreJson,
          }),
        ),
      ) as DerivedAccount[]

      module.clear_cached_keystore()

      const ethereumAccount = accounts.find((account) => account.chain === 'ETHEREUM')

      if (!ethereumAccount) {
        throw new Error('Token Core did not return an ETH account for the demo capsule.')
      }

      return {
        address: ethereumAccount.address,
        chain: ethereumAccount.chain,
        derivationPath: ethereumAccount.derivationPath,
        packageName: '@consenlabs/tcx-wasm@0.9.1',
        publicKeyPreview: `${ethereumAccount.publicKey.slice(0, 14)}...${ethereumAccount.publicKey.slice(-8)}`,
        wasmAsset: wasmUrl.split('/').pop() ?? 'tcx_wasm_bg.wasm',
      }
    })
  }

  return tokenCoreProofPromise
}

export type { TokenCoreDemoProof }
export { loadTokenCoreDemoProof }
