import dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint";
import "solidity-coverage";
import "solidity-docgen";
import "hardhat-contract-sizer";
import "hardhat-abi-exporter";
import "hardhat-tracer";

const envs = process.env;

/*
 * Private keys for the network configuration.
 * Keys an be set in `.env` file.
 */
const ethereumMainnetKeys: string[] = envs.ETHEREUM_MAINNET_KEYS ? envs.ETHEREUM_MAINNET_KEYS.split(",") : [];
const ethereumTestnetKeys: string[] = envs.ETHEREUM_TESTNET_KEYS ? envs.ETHEREUM_TESTNET_KEYS.split(",") : [];

/*
 * The solc compiler optimizer is disabled by default to to keep the stack traces' line numbers the same.
 * To enable, set `RUN_OPTIMIZER` to `true` in the `.env` file.
 */
// prettier-ignore
const optimizerRuns: boolean = envs.RUN_OPTIMIZER === "true" || envs.RUN_OPTIMIZER === "1" ||
    envs.REPORT_GAS === "true" || envs.REPORT_GAS === "1" ||
    false;
const optimizerRunNumber: number = envs.OPTIMIZER_RUNS ? +envs.OPTIMIZER_RUNS : 200;

const enableForking = envs.FORKING === "true" || envs.FORKING === "1";

const networkHardfork = enableForking ? envs.HARDFORK : envs.HARDFORK ? envs.HARDFORK : "cancun";

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.28",
                settings: {
                    viaIR: true,
                    optimizer: {
                        enabled: optimizerRuns,
                        runs: optimizerRunNumber,
                        details: {
                            yulDetails: {
                                optimizerSteps: optimizerRuns ? "u" : undefined
                            }
                        }
                    },
                    // Set to "paris" for chains that do not support the `PUSH0` opcode, such as Polygon, etc.
                    evmVersion: "cancun"
                }
            }
            // { version: "0.7.6" }
        ]
        // overrides: { "contracts/Deployed.sol": { version: "0.8.21" } }
    },
    // defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            allowUnlimitedContractSize: !optimizerRuns,
            accounts: {
                accountsBalance: envs.ACCOUNT_BALANCE ?? "10000000000000000000000", // 10000 ETH.
                count: envs.NUMBER_OF_ACCOUNTS ? +envs.NUMBER_OF_ACCOUNTS : 20
            },
            forking: {
                url: envs.FORKING_URL ?? "",
                enabled: enableForking
            },
            hardfork: networkHardfork
            /*
             * Uncomment the line below if Ethers reports the error
             * "Error: cannot estimate gas; transaction may fail or may require manual gas limit...".
             */
            // gas: 30000000,
            // blockGasLimit: 30000000,
            // gasPrice: 8000000000
        },
        // Ethereum:
        ethereum: {
            chainId: 1,
            url: envs.ETHEREUM_URL ?? "",
            accounts: [...ethereumMainnetKeys]
        },
        sepolia: {
            chainId: 11155111,
            url: envs.SEPOLIA_URL ?? "",
            accounts: [...ethereumTestnetKeys]
        },
        holesky: {
            chainId: 17000,
            url: envs.HOLESKY_URL ?? "",
            accounts: [...ethereumTestnetKeys]
        }
    },
    etherscan: {
        /*
         * This is not necessarily the same name that is used to define the network.
         * To see the full list of supported networks, run `$ npx hardhat verify --list-networks`. The identifiers
         * shown there are the ones that should be used as keys in the `apiKey` object.
         *
         * See the link for details:
         * `https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan#multiple-api-keys-and-alternative-block-explorers`.
         */
        apiKey: {
            mainnet: envs.ETHERSCAN_API_KEY ?? "",
            sepolia: envs.ETHERSCAN_API_KEY ?? "",
            holesky: envs.ETHERSCAN_API_KEY ?? ""
        }
    },
    gasReporter: {
        enabled: envs.REPORT_GAS !== undefined,
        // excludeContracts: [""],
        // currency: "USD", // "CHF", "EUR", etc.
        outputFile: envs.REPORT_GAS_TO_FILE ? "gas-report.txt" : undefined,
        showMethodSig: true
    },
    docgen: {
        pages: "files"
        // exclude: [""]
    },
    contractSizer: {
        except: ["mocks/"]
    },
    abiExporter: {
        except: ["interfaces/", "mocks/"]
    },
    mocha: {
        timeout: 40000,
        parallel: true
    }
};

// By default fork from the latest block.
if (envs.FORKING_BLOCK_NUMBER)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config.networks!.hardhat!.forking!.blockNumber = +envs.FORKING_BLOCK_NUMBER;

// Extra settings for `hardhat-gas-reporter`.
// Set a CoinMarketCap API key for `hardhat-gas-reporter` if present.
if (envs.COINMARKETCAP_API_KEY)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config.gasReporter!.coinmarketcap = envs.COINMARKETCAP_API_KEY;
if (envs.GAS_REPORTER_TOKEN_SYMBOL)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config.gasReporter!.token = envs.GAS_REPORTER_TOKEN_SYMBOL;
if (envs.GAS_PRICE_API_URL)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config.gasReporter!.gasPriceApi = envs.GAS_PRICE_API_URL;

export default config;
