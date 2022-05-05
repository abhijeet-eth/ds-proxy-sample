const ethers = require("ethers");
const DSProxyAbi = require("./proxyabi.js");
const TargetContractAbi = require("./abi.js");

const defaultProvider = ethers.getDefaultProvider("rinkeby");
const dsProxyAddress = "0x6599A1C12f4f924250e1Fe0b1A6f8eDB6F7FfFd8";
// const dsProxyAddress = "0x59F979aa7977d385B79282e21A66d570c85c6676"; // rinkeby

const dsProxy = new ethers.Contract(dsProxyAddress, DSProxyAbi, defaultProvider);

const targetContractAddress = "0x38cB7800C3Fddb8dda074C1c650A155154924C73";
const sampleContractAddr = "0x5e17b14ADd6c386305A32928F985b29bbA34Eff5";
const punkAddress = "0x1c91347f2A44538ce62453BEBd9Aa907C662b4bD";

const targetContract = new ethers.Contract(targetContractAddress, TargetContractAbi, defaultProvider);


//const calldata = targetContract.interface.encodeFunctionData("settingX",[sampleContractAddr,200]);
const calldata = targetContract.interface.encodeFunctionData("foobar", [punkAddress, "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", ethers.utils.parseEther("5")]);
// console.log("calldata", calldata);

const calldata2 = targetContract.interface.encodeFunctionData("fooSetX", [sampleContractAddr, punkAddress, "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", ethers.utils.parseEther("500")]);
console.log("calldata2", calldata2);

const finalCalldata = dsProxy.interface.encodeFunctionData("execute", [targetContractAddress, calldata]);
// console.log("finalCalldata", finalCalldata);

