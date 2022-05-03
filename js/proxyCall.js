const ethers = require("ethers");
const DSProxyAbi = require("./proxyabi.js");
const TargetContractAbi = require("./abi.js");

const defaultProvider = ethers.getDefaultProvider("rinkeby");
//const dsProxyAddress = "0xa92Bed719071A4d33B0B348513E7e866a6ff6B3F";
const dsProxyAddress = "0x59F979aa7977d385B79282e21A66d570c85c6676";
const dsProxy = new ethers.Contract(dsProxyAddress, DSProxyAbi, defaultProvider);

const targetContractAddress = "0x80b19DfF9B334b15ee6b07A8276CAc4073ad3799";
const sampleContractAddr = "0x7c9805AB0d8492517F47792Da17B8563A642805C";
const punkAddress = "0xc50eA6bE3E7f0DabD2F80F3bbE6377C47944d9ED";
const targetContract = new ethers.Contract(targetContractAddress, TargetContractAbi, defaultProvider);
//const calldata = targetContract.interface.encodeFunctionData("setingX",[sampleContractAddr,200]);
const calldata = targetContract.interface.encodeFunctionData("foobar",[punkAddress, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", ethers.utils.parseEther("5")]);
console.log("calldata", calldata);

const finalCalldata = dsProxy.interface.encodeFunctionData("execute",[targetContractAddress,calldata]);
console.log("finalCalldata", finalCalldata);