import { Cell, Slice, Address, Builder, beginCell, ComputeError, TupleItem, TupleReader, Dictionary, contractAddress, ContractProvider, Sender, Contract, ContractABI, TupleBuilder, DictionaryValue } from 'ton-core';
import { ContractSystem, ContractExecutor } from 'ton-emulator';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}
export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}
export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}
async function B_init() {
    const __init = 'te6ccgEBBwEANQABFP8A9KQT9LzyyAsBAgFiAgMCAs4EBQAJoUrd4AUAAUgBEUcAHIzAHbPMmAYADAGBAQHPAA==';
    const __code = 'te6ccgECIAEAArcAART/APSkE/S88sgLAQIBYgIDAgLLBAUCASAcHQIBIAYHAgEgCwwCAdQICQABvQLLO37cCHXScIflTAg1wsf3gLQ0wMBcbDAAZF/kXDiAfpAIlBmbwT4YQKRW+DAAI8w+QGC8LQamTMwHB1yjmTiNoX+Opx1QKuTWe9zGJQ8DuXgkQ1duo8I2zzwGNs82zHgkTDi8sCCgHgoACwgbvLQgIAEWyPhCAcwB2zzJ7VQZAgEgDQ4AOd/CF4Cy54CT+4QCFFumsrm5sLOyx4Ci8RoBp4CcAgEgDxACASAUFQAVWUfwHKAOBwAcoAgCASAREgBLHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydCAB9zIcQHKAVAH8BFwAcoCUAXPFlAD+gJwAcpoI26zJW6zsY49f/ARyHDwEXDwESRus5l/8BEE8AFQBMyVNANw8BHiJG6zmX/wEQTwAVAEzJU0A3DwEeJw8BECf/ARAslYzJYzMwFw8BHiIW6zmH/wEQHwAQHMlDFw8BHiyQGATAAT7AAIBIBYXAgEgGhsBSx/yAGUcAHLH95vAAFvjG1vjAHbPG8iAcmTIW6zlgFvIlnMyegxgGAERHAByMwB2zzJgGQC6INdKIddJlyDCACLCALGOSgNvIoB/Is8xqwKhBasCUVW2CCDCAJwgqgIV1xhQM88WQBTeWW8CU0GhwgCZyAFvAlBEoaoCjhIxM8IAmdQw0CDXSiHXSZJwIOLi6F8DAAwBgQEBzwAARzQ9AQwbQGBeKcBgBD0D2+h8uCHAYF4pyICgBD0F8j0AMnwFYAALDD4QvAWgARG9C87Z54C/gHQeAE293owTgudh6ullc9j0J2HOslQo2zQThO6xqWlbI+WZFp15b++LEcwBFO1E0NQB+GLbPDEfAAyBAQHXAAE=';
    const __system = 'te6cckECNwEABKQAAQHAAQICcxYCAQWyKeADART/APSkE/S88sgLBAIBYgYFAE2hd6ME4LnYerpZXPY9CdhzrJUKNs0E4TusalpWyPlmRadeW/vixHMCAssQBwIBSA0IAgEgCgkAAUgCASAMCwA7PhC8BRc8BB/cIBCi4TWVzc2FnZTKPASXiNANPARgAEc0PQEMG0BgXinAYAQ9A9vofLghwGBeKciAoAQ9BfI9ADJ8BOACASAOJAIBICwPAfcyHEBygFQB/APcAHKAlAFzxZQA/oCcAHKaCNusyVus7GOPX/wD8hw8A9w8A8kbrOZf/APBPABUATMlTQDcPAP4iRus5l/8A8E8AFQBMyVNANw8A/icPAPAn/wDwLJWMyWMzMBcPAP4iFus5h/8A8B8AEBzJQxcPAP4skBgKwIBIBIRABX8o/gOUAcDgA5QBAIB1BMxAWk7ftwIddJwh+VMCDXCx/eAtDTAwFxsMABkX+RcOIB+kAiUGZvBPhhApFb4MAAkTDjDfLAgoBQDrvkBIILwtBqZMzAcHXKOZOI2hf46nHVAq5NZ73MYlDwO5eCRDV26jwkw2zzwFds82zHggvD8PIIRJGZYHboj+QTNGglyPAhpreoARb1nM+pPdtvScrrjAjUzFQIQ2zzwFts82zE1MwEFsiGgFwEU/wD0pBP0vPLICxgCAWIcGQIBIBsaAE293owTgudh6ullc9j0J2HOslQo2zQThO6xqWlbI+WZFp15b++LEcwBEb0LztnngL+AdDUCAssuHQIBIB8eADnfwheAsueAk/uEAhRbprK5ubCzsseAovEaAaeAnAIBICggAgEgJCECASAjIgALDD4QvAWgAEc0PQEMG0BgXinAYAQ9A9vofLghwGBeKciAoAQ9BfI9ADJ8BWACASAmJQERHAByMwB2zzJgNAFLH/IAZRwAcsf3m8AAW+MbW+MAds8byIByZMhbrOWAW8iWczJ6DGAnALog10oh10mXIMIAIsIAsY5KA28igH8izzGrAqEFqwJRVbYIIMIAnCCqAhXXGFAzzxZAFN5ZbwJTQaHCAJnIAW8CUEShqgKOEjEzwgCZ1DDQINdKIddJknAg4uLoXwMCASAtKQIBICwqAfcyHEBygFQB/ARcAHKAlAFzxZQA/oCcAHKaCNusyVus7GOPX/wEchw8BFw8BEkbrOZf/ARBPABUATMlTQDcPAR4iRus5l/8BEE8AFQBMyVNANw8BHicPARAn/wEQLJWMyWMzMBcPAR4iFus5h/8BEB8AEBzJQxcPAR4skBgKwAE+wAASxwWchwAcsBcwHLAXABywASzMzJ+QDIcgHLAXABywASygfL/8nQgABVZR/AcoA4HABygCAIBIDAvAAG9AgHUMjEACwgbvLQgIALLO37cCHXScIflTAg1wsf3gLQ0wMBcbDAAZF/kXDiAfpAIlBmbwT4YQKRW+DAAI8w+QGC8LQamTMwHB1yjmTiNoX+Opx1QKuTWe9zGJQ8DuXgkQ1duo8I2zzwGNs82zHgkTDi8sCCgNTMBFsj4QgHMAds8ye1UNAAMAYEBAc8AARTtRNDUAfhi2zwxNgAMgQEB1wABMyvoFg==';
    let systemCell = Cell.fromBase64(__system);
    let builder = new TupleBuilder();
    builder.writeCell(systemCell);
    let __stack = builder.build();
    let codeCell = Cell.fromBoc(Buffer.from(__code, 'base64'))[0];
    let initCell = Cell.fromBoc(Buffer.from(__init, 'base64'))[0];
    let system = await ContractSystem.create();
    let executor = await ContractExecutor.create({ code: initCell, data: new Cell() }, system);
    let res = await executor.get('init', __stack);
    if (!res.success) { throw Error(res.error); }
    if (res.exitCode !== 0 && res.exitCode !== 1) {
        if (B_errors[res.exitCode]) {
            throw new ComputeError(B_errors[res.exitCode].message, res.exitCode, { logs: res.vmLogs });
        } else {
            throw new ComputeError('Exit code: ' + res.exitCode, res.exitCode, { logs: res.vmLogs });
        }
    }
    
    let data = res.stack.readCell();
    return { code: codeCell, data };
}

const B_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
}

export class B implements Contract {
    
    static async init() {
        return await B_init();
    }
    
    static async fromInit() {
        const init = await B_init();
        const address = contractAddress(0, init);
        return new B(address, init);
    }
    
    static fromAddress(address: Address) {
        return new B(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        errors: B_errors
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: 'Message') {
        
        let body: Cell | null = null;
        if (message === 'Message') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetNext(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('getNext', builder.build())).stack;
        const result = loadTupleStateInit(source);
        return result;
    }
    
}