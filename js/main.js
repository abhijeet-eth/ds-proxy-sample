const { ethers } = require('hardhat');
const AbiCoder = require('web3-eth-abi');
const { keccak256, padLeft, toHex } = require('web3-utils');

const ActionAbi = require('./abi.js');


  /**
   * @returns {string}
   * @private
   */
  function _getId(_name) {
    return keccak256(_name);
  }

  /**
   * @returns {Array<number>}
   * @private
   */
   function _getArgumentMapping(mappableArgs) {
    return mappableArgs.map(arg => {
      if (new RegExp(/\$\d+/).test(arg)) {
        if (Array.isArray(arg)) throw TypeError('Input can\'t be mapped to arrays (tuples/structs). Specify `mappableArgs` array in constructor.');
        return parseInt(arg.substr(1))
      }
      return 0;
    });
  }

  /**
   * @param type {string}
   * @private
   */
  function _getPlaceholderForType(type) {
    // TODO handle arrays?
    if (type.startsWith('bytes')) return `0x${'0'.repeat(parseInt(type.substr(5)))}`;
    if (type === 'address') return `0x${'0'.repeat(40)}`;
    if (type === 'string') return '';
    return '0';
  }

  /**
   * @private
   */
  function _replaceWithPlaceholders(arg, paramType) {
    if (Array.isArray(arg)) return arg.map((_arg, i) => _replaceWithPlaceholders(_arg, paramType[i]));
    if (new RegExp(/\$\d+/).test(arg)) return _getPlaceholderForType(paramType);
    return arg;
  }

  /**
   * @private
   */
   function _formatType(paramType) {
    if (Array.isArray(paramType)) return `(${paramType.map((_paramType) => _formatType(_paramType))})`;
    return paramType;
  }

  /**
   * Encode arguments for calling the action directly
   * @returns {Array<Array<string>>} bytes-encoded args
   * @private
   */
   function _encodeForCall(args, paramTypes) {
    
    const bytesEncodedArgs = args.map((arg, i) => {
      let paramType = paramTypes[i];
      let _arg = _replaceWithPlaceholders(arg, paramType);
      let _paramType = _formatType(paramType);
      return AbiCoder.encodeParameter(_paramType, _arg);
    });
     
    return [bytesEncodedArgs];
  }

  function getFuncAbi(_fnname) {
    return new Promise((resolve,reject)=>{
        let abi = ActionAbi.find(({ name }) => name === _fnname);
        if(typeof abi == 'object') {
            resolve(abi);
        } else {
            reject([]);
        }
    })
  }

  /**
   * Encode arguments for calling the action via DsProxy
   * @returns {Array<string>} `address` & `data` to be passed on to DSProxy's `execute(address _target, bytes memory _data)`
   */
   function encodeForDsProxyCall(funcAbi, args, types) {
       //console.log(funcAbi, _encodeForCall(args, types)[0]);
       //console.log(_encodeForCall(args, types)[0]);
       //console.log(AbiCoder.encodeFunctionCall(funcAbi, _encodeForCall(args, types)[0]));
    return AbiCoder.encodeFunctionCall(funcAbi, _encodeForCall(args, types)[0]);
  }

  //////////////// MAIN /////////////////////

  (async()=>{
    const abi = await getFuncAbi('transfer');

    const args = ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", String(ethers.utils.parseEther("1.0"))];
    const args_types = ["address","uint256"];

    console.log(encodeForDsProxyCall(abi, args, args_types));

  })()

