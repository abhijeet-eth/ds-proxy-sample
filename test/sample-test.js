const { expect, assert } = require("chai");
const { ethers, artifacts } = require("hardhat");
const { BN, expectRevert, constants } = require('@openzeppelin/test-helpers');
const { Contract } = require("ethers");
const AbiCoder = require('web3-eth-abi');

const {encodeForDsProxyCall, getFuncAbi} = require('../js/main')

const DSProxyFactory = artifacts.require('DSProxyFactory')
const ProxyRegistry = artifacts.require('ProxyRegistry')
const DSProxy = artifacts.require('DSProxy')
const Punk = artifacts.require('Punk')
const Sample = artifacts.require('Sample')
const Target = artifacts.require('Target')

require('chai').use(require('chai-as-promised')).should()

contract('BSP', (accounts) => {
    const [deployer, user1, user2] = accounts;
    let DSProxyFactoryContract, ProxyRegistryContract, PunkContract, 
    SampleContract, TargetContract, proxyUser1, ProxyContractUser1, user1Punkbalance, user2Punkbalance;

    function bn(x) {
        return new BN(BigInt(Math.round(parseFloat(x))))
    }

    function toWei(x) {
        return ethers.utils.parseEther(x);
    }

    before(async () => {
        DSProxyFactoryContract = await DSProxyFactory.new({ from: deployer });
        ProxyRegistryContract = await ProxyRegistry.new( DSProxyFactoryContract.address, { from: deployer });
        PunkContract = await Punk.new({ from: deployer });
        SampleContract = await Sample.new({ from: deployer });

        await ProxyRegistryContract.build({from:user1})

        proxyUser1 = await ProxyRegistryContract.proxies(user1)

        ProxyContractUser1 = await DSProxy.at(proxyUser1)

        TargetContract = await Target.new(proxyUser1, { from: deployer });

        await PunkContract.mint(user1, toWei('10000'));

    })

    describe('init', ()=>{
       
        it('checks balances of user1 and user2', async() => {
            
            user1Punkbalance = await PunkContract.balanceOf(user1);
            user2Punkbalance = await PunkContract.balanceOf(user2);

            user1Punkbalance.should.be.bignumber.eq(bn('10000000000000000000000'))
            user2Punkbalance.should.be.bignumber.eq(bn('0'))            

        })

        it('ownerToRecvr', async()=>{
            // 1. Approve DSProxy to spend tokens from owner's account
            // 2. Generate encodeForDsProxy as done below.
            // 3. Call DSProxy.execute(TargetContractAddress, encodeForDsProxy)
            const abi = await getFuncAbi('ownerToRecvr');

            //console.log(abi);

            const encodeForDsProxy = AbiCoder.encodeFunctionCall(
                abi,
                [
                    "0xAC1F9FB2A71D3EdEa1e5300c076f46591E745e78",
                    "0xeF40621A6fF2046a9c66E20FCC1E12A48Eb56a2e",
                    "0x00Dd4cE8a3Ba697a17c079589004446d267435df",
                    105
                ], 
                ["address", "address", "address", "uint256"]
            );

            console.log("ownerToRecvr",encodeForDsProxy);
        })

        it('proxyToRecvr', async()=>{
            // This is to use DSProxy as a wallet
            // 1. Send tokens from user's account to DSProxy contract
            // 2. Generate encodeForDsProxy as done below.
            // 3. Call DSProxy.execute(TargetContractAddress, encodeForDsProxy)
            const abi = await getFuncAbi('proxyToRecvr');

            //console.log(abi);

            const encodeForDsProxy = AbiCoder.encodeFunctionCall(
                abi,
                [
                    "0xAC1F9FB2A71D3EdEa1e5300c076f46591E745e78",
                    "0x00Dd4cE8a3Ba697a17c079589004446d267435df",
                    5
                ], 
                ["address", "address", "address", "uint256"]
            );

            console.log("proxyToRecvr",encodeForDsProxy);
        })


        it('makes proxy calls through target contract', async() => {

            //const ABI = ["function setingX(address sample, uint256 amount)"]

            //let iface = new ethers.utils.Interface(ABI);

            //let finalCalldata = iface.encodeFunctionData("setingX", [SampleContract.address, "78987879"])

            //console.log("finalCalldata", finalCalldata);

            //console.log(SampleContract.address, 78987879);

            // const abi = await getFuncAbi('ownerToRecvr');

            // console.log(abi);

            // const encodeForDsProxy = AbiCoder.encodeFunctionCall(
            //     abi,
            //     [
            //         "0xAC1F9FB2A71D3EdEa1e5300c076f46591E745e78",
            //         "0xeF40621A6fF2046a9c66E20FCC1E12A48Eb56a2e",
            //         "0x00Dd4cE8a3Ba697a17c079589004446d267435df",
            //         105
            //     ], 
            //     ["address", "address", "address", "uint256"]
            // );

            // //console.log(SampleContract.address);
            // //console.log(TargetContract.address);
            // console.log(encodeForDsProxy);

            //let encodeForDsProxy = encodeForDsProxyCall(abi, [SampleContract.address, 78987879], ["address", "uint256"]);

            //console.log("encodeForDsProxy", encodeForDsProxy);

            //web3.eth.abi.encodeFunctionCall()

            //await ProxyContractUser1.execute(TargetContract.address, encodeForDsProxy)

            // const calldata = targetContract.interface.encodeFunctionData("foobar",[punkAddress, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", ethers.utils.parseEther("5")]);
            // console.log("calldata", calldata);

            // const finalCalldata = dsProxy.interface.encodeFunctionData("execute",[targetContractAddress,calldata]);
            // console.log("finalCalldata", finalCalldata);

        })

    })



})