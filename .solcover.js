module.exports = {
    skipFiles: ["interfaces/", "mocks/"],
    mocha: {
        fgrep: "[skip-on-coverage]",
        invert: true
    },
    /*
     * (Deprecated). Work around "stack too deep" in projects using ABIEncoderV2.
     * https://github.com/sc-forks/solidity-coverage/blob/9b64cbacd1ff352f78f4589bf0a5130d030402e0/docs/faq.md#running-out-of-time
     */
    configureYulOptimizer: true,
    solcOptimizerDetails: {
        yul: true,
        yulDetails: {
            optimizerSteps: ""
        }
    }
};
