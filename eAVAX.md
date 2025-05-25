# eKET

## Solidity changes from vanilla repo

1) Register specific token for converter during creation
2) Disallow arbitrary token registrations
3) Accept name/symbol for converter, since it only supports one token

## Deployment changes

1) Update TypeScript params to match new contract
2) Fork `deploy-converter.ts` to `deploy-eavax.ts`
    * Deploy in prod mode
    * Supply WAVAX as a parameter
    * Supply name/symbol
    * Decimals to 18
    * Remove deploying ERC20
    * Add verification support for contracts

## Build system changes
   
One time setup for verification:

```
npm install --save-dev @nomicfoundation/hardhat-verify
```

## (do not) Compile Circuits

There's no need to run the `zkit` commands; the `contracts/prod` directory already has stuff that matches
`circom/build`.

## Deployment setup

New .env file with:

```
PRIVATE_KEY=private_key_without_0x_prefix
SNOWTRACE_API_KEY=your_snowtrace_api_key_here
```

Deployer used for eAVAX (on testnet) is `0x65FE95f643545695e8B03c8320087C09D14273B9`.

Commands:

```
npx hardhat run scripts/deploy-eavax.ts --network avaxTest
npx hardhat run scripts/deploy-eavax.ts --network avaxMain
```

## Testnet / Mainnet deployments

Using the initial transactions on a fresh key, I deployed the contracts to the same address on both chains (similar
to how $WAVAX is deployed).

```
┌──────────────────────┬──────────────────────────────────────────────┐
│       (index)        │                    Values                    │
├──────────────────────┼──────────────────────────────────────────────┤
│ registrationVerifier │ '0x1D7507A32Fa2B2795fa99AA4d36BaD7734caD2c6' │
│     mintVerifier     │ '0x75feffEDa89Aa4873E6b63fa5B1C7e6e45B09300' │
│   withdrawVerifier   │ '0xefb4076EcE9dcb945d689b0B9f4fE6B1A23c1F31' │
│   transferVerifier   │ '0x29E7276Ba8437663e194A82F6Ff4061fD9af6c1B' │
│     burnVerifier     │ '0x79aDE538Ba3a87fE4aab1F35472915c54EA3cA76' │
│      babyJubJub      │ '0x3B81EF54Edb47deAAd19F6abE40c9Df58C3198CF' │
│      registrar       │ '0x3731AF058723981538454D68C5F295D88365C6E9' │
│     encryptedERC     │ '0x16481D46677E6a8408130fF1A47C732bA40A02ca' │
└──────────────────────┴──────────────────────────────────────────────┘
```
