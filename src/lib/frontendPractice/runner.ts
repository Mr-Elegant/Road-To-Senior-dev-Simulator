import type { Scenario } from '@/types/scenario';
import type { RunSuiteResult } from '@/lib/evaluation/safeCodeRunner';
import { sameLoanLabOutput } from '@/lib/loanLab/harness';

function workerSource() {
  return `self.onmessage = async ({data}) => {
    const send = self.postMessage.bind(self), stringify = JSON.stringify.bind(JSON), parse = JSON.parse.bind(JSON);
    let candidate;
    try { candidate = new Function('"use strict";\\n' + data.code + '\\n;return typeof solution === "function" ? solution : null;')();
      if (!candidate) throw new Error('Define solution(input).');
    } catch(error) { send({compilationError: String(error.message).slice(0,1000)}); return; }
    try { const actual = await candidate(data.input); const encoded = stringify(actual);
      if (encoded === undefined) { send({undefinedResult:true}); return; }
      if (encoded.length > 64000) throw new Error('Output exceeds 64 KB.');
      send({actual:parse(encoded)});
    } catch(error) { send({runtimeError:String(error && error.message || error).slice(0,1000)}); }
  };`;
}

export function frontendFunctionFrameDocument(): string {
  const source = JSON.stringify(workerSource()).replace(/</g, '\\u003c');
  return `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; child-src blob:; connect-src 'none'; form-action 'none'; base-uri 'none'"><script>
  let initialized=false;
  addEventListener('message',event=>{
    if(initialized||event.source!==parent||event.data!=='frontend-function-init'||!event.ports[0])return;
    initialized=true; const port=event.ports[0]; const source=${source}; let active;
    port.onmessage=({data})=>{
      if(data.cancel){if(active)active();return;}
      const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));let worker;
      try{worker=new Worker(url);}catch(error){URL.revokeObjectURL(url);port.postMessage({id:data.id,compilationError:String(error.message)});return;}
      let finished=false;
      const finish=result=>{if(finished)return;finished=true;clearTimeout(timer);worker.terminate();URL.revokeObjectURL(url);active=undefined;port.postMessage({id:data.id,...result});};
      const timer=setTimeout(()=>finish({timeout:true}),1500);active=()=>finish({cancelled:true});
      worker.onmessage=event=>finish(event.data);worker.onerror=event=>{event.preventDefault();finish({compilationError:event.message||'Worker failed.'});};worker.postMessage(data);
    };port.start();port.postMessage({id:'ready'});
  });</script>`;
}

interface Reply { id: string; actual?: unknown; undefinedResult?: boolean; runtimeError?: string; compilationError?: string; timeout?: boolean; cancelled?: boolean }

export async function runFrontendFunctions(scenario: Scenario, code: string, signal: AbortSignal): Promise<RunSuiteResult> {
  if(code.length>100000)throw new Error('Code exceeds the 100,000 character limit.');
  const frame=document.createElement('iframe');frame.sandbox.add('allow-scripts');frame.hidden=true;frame.title='Frontend JavaScript test runner';frame.referrerPolicy='no-referrer';frame.srcdoc=frontendFunctionFrameDocument();
  const channel=new MessageChannel();
  function exchange(id:string,send:()=>void):Promise<Reply>{
    signal.throwIfAborted();
    return new Promise((resolve,reject)=>{
      const finish=(error?:Error,result?:Reply)=>{clearTimeout(timer);signal.removeEventListener('abort',abort);channel.port1.onmessage=null;if(error)reject(error);else resolve(result!);};
      const abort=()=>finish(new DOMException('Execution cancelled.','AbortError'));
      const timer=setTimeout(()=>finish(new Error('The isolated runner did not respond. Retry the tests.')),5000);
      signal.addEventListener('abort',abort,{once:true});channel.port1.onmessage=({data}:MessageEvent<Reply>)=>{if(data?.id===id)finish(undefined,data);};
      try{send();}catch(error){finish(error instanceof Error?error:new Error('Runner initialization failed.'));}
    });
  }
  const results:RunSuiteResult['results']=[];
  try{
    await exchange('ready',()=>{frame.onload=()=>frame.contentWindow?.postMessage('frontend-function-init','*',[channel.port2]);document.body.appendChild(frame);});
    for(const test of scenario.testCases??[]){
      const start=performance.now();
      const reply=await exchange(test.id,()=>channel.port1.postMessage({id:test.id,code,input:JSON.parse(test.inputDescription)}));
      const infrastructure=reply.compilationError||(reply.timeout?'Execution timed out (1500 ms).':undefined);
      const passed=!infrastructure&&!reply.cancelled&&(test.expectedError?reply.runtimeError===test.expectedError:!reply.runtimeError&&!reply.undefinedResult&&sameLoanLabOutput(reply.actual,JSON.parse(test.expectedOutput)));
      const actual=reply.undefinedResult?'undefined':reply.runtimeError?`Throws: ${reply.runtimeError}`:JSON.stringify(reply.actual);
      results.push({testId:test.id,name:test.name,passed,expectedOutput:test.expectedOutput,actualOutput:actual,logs:[],durationMs:Math.round(performance.now()-start),errorMessage:passed?undefined:infrastructure||`Expected ${test.expectedOutput}; received ${actual??'no result'}.`});
    }
    return{isSupported:true,results,totalTests:results.length,passedTests:results.filter(result=>result.passed).length};
  }finally{channel.port1.postMessage({cancel:true});channel.port1.close();channel.port2.close();frame.remove();}
}
