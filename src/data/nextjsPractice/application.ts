import type { ReviewDefinition } from './types';
const M = 'Mid-Level',
  S = 'Senior';
export const applicationReviews: ReviewDefinition[] = [
  {
    slug: 'server-data-direct',
    title: 'Remove the Server Component HTTP round trip to its own API',
    difficulty: M,
    chapter: 'Data fetching',
    file: 'app/products/page.tsx',
    broken: `export default async function Page(){const result=await fetch('http://localhost:3000/api/products');return <pre>{await result.text()}</pre>;}`,
    fixed: `import { listPublicProducts } from '@/lib/products';
export default async function Page(){const products=await listPublicProducts();return <ul>{products.map(product=><li key={product.id}>{product.name}</li>)}</ul>;}
// lib/products is server-only and returns an allowlisted public product DTO.`,
    explanation:
      'A Server Component can call a server data-access function directly. Its own Route Handler adds transport latency, deployment-origin assumptions and a failure mode during build when no application server exists. Keep Route Handlers for external HTTP consumers and reuse the underlying authorized data layer.',
    checks: [
      'Build without a localhost server listening.',
      'Verify external API consumers still use their Route Handler contract.',
      'Inspect the page payload for only the admitted public product fields.',
    ],
    tweak: 'When is an HTTP call from a Server Component appropriate?',
    answer:
      'When the dependency is genuinely a separate service with an HTTP contract. Bound its timeout, caching, credentials and failure policy; do not confuse that service call with an unnecessary loopback to the same application.',
    doc: 'app/getting-started/fetching-data',
  },
  {
    slug: 'parallel-data',
    title: 'Start independent server reads before awaiting them',
    difficulty: M,
    chapter: 'Data fetching',
    file: 'app/overview/page.tsx',
    broken: `import { getRevenue,getOrders } from '@/lib/overview';
export default async function Page(){const revenue=await getRevenue();const orders=await getOrders();return <p>{revenue}: {orders}</p>;}`,
    fixed: `import { getRevenue,getOrders } from '@/lib/overview';
export default async function Page(){const [revenue,orders]=await Promise.all([getRevenue(),getOrders()]);return <p>{revenue}: {orders}</p>;}`,
    explanation:
      'Independent reads need not form a waterfall. Start them together while preserving their authorization and resource budgets. Promise.all fails fast as an observed promise result but does not automatically cancel the other work; use independent Suspense boundaries or settled results when partial success is a product requirement.',
    checks: [
      'Delay each fake dependency and compare start/finish traces.',
      'Fail one read and confirm the chosen recovery behavior.',
      'Load-test the connection pool so parallelizing the page does not overload the database.',
    ],
    tweak: 'What if the second read requires the first result?',
    answer:
      'Then the dependency is real: preserve ordering or redesign the API to batch the work. Parallelizing dependent operations with guessed inputs trades correctness for misleading timing.',
    doc: 'app/getting-started/fetching-data',
  },
  {
    slug: 'request-memoization',
    title: 'Separate React request memoization from persistent caching',
    difficulty: M,
    chapter: 'Data fetching',
    file: 'lib/product.ts',
    broken: `const cache=new Map<string,unknown>();
export async function getProduct(id:string){if(!cache.has(id))cache.set(id,await loadFromDatabase(id));return cache.get(id);}`,
    fixed: `import 'server-only';
import { cache } from 'react';
import { loadFromDatabase } from './database';
export const getProduct=cache(async(id:string)=>loadFromDatabase(id));`,
    explanation:
      'A module Map is process-local, unbounded and may outlive the intended request or tenant context. React cache can deduplicate a shared server function within the relevant render request. It is not durable shared storage, TTL invalidation, or an excuse to omit tenant identity from a query.',
    checks: [
      'Call the same exported function twice during one server render and count reads.',
      'Repeat in a separate request and verify the intended lifecycle.',
      'Test tenant/resource keys and error behavior explicitly.',
    ],
    tweak: 'Why must consumers share the same exported cache wrapper?',
    answer:
      'Creating a new cached function for each consumer creates a different memoization identity. Export the wrapper once, and distinguish argument identity from deep structural equality when passing objects.',
    doc: 'app/guides/caching-without-cache-components',
  },
  {
    slug: 'fetch-cache-default',
    title: 'Make Next.js 15 fetch freshness explicit',
    difficulty: M,
    chapter: 'Caching and revalidation',
    file: 'lib/public-catalog.ts',
    versions: '15-to-16',
    broken: `export async function getCatalog(){return (await fetch('https://catalog.example.com/public')).json();}
// The team assumes this fetch is persistently cached by default.`,
    fixed: `export async function getCatalog(){const response=await fetch('https://catalog.example.com/public',{cache:'force-cache',next:{tags:['public-catalog']}});if(!response.ok)throw new Error('Catalog unavailable');return response.json();}`,
    next15:
      'Fetch is no longer persistently cached by default. Choose force-cache, revalidation or no-store deliberately.',
    next16:
      'The explicit fetch policy still matters. Cache Components adds a separate opt-in rendering/caching model; do not assume enabling it is a syntax-only migration.',
    explanation:
      'The absence of an explicit cache option is not evidence of persistent data caching in Next.js 15. A static route may still produce reused output, and request deduplication may still remove duplicate reads; those observations do not establish the Data Cache lifetime. Tagging only helps data that is actually cached.',
    checks: [
      'Use an origin request counter across production requests.',
      'Compare uncached and explicitly cached variants.',
      'Invalidate the assigned tag from an authenticated allowed context and observe a later read.',
    ],
    tweak: 'What if this endpoint returns user-specific prices?',
    answer:
      'Do not share a public catalog cache entry with personalized prices. Separate public data from tenant/user entitlements and verify all representation dimensions, authorization and HTTP cache layers.',
    doc: 'app/guides/upgrading/version-15',
  },
  {
    slug: 'get-handler-caching',
    title: 'Keep a personalized GET handler out of shared caches',
    difficulty: M,
    chapter: 'Route handlers and APIs',
    file: 'app/api/profile/route.ts',
    broken: `export const dynamic='force-static';
export async function GET(){return Response.json({email:'current-user@example.com'});}`,
    fixed: `import { getVerifiedSession } from '@/lib/auth';
export async function GET(){const session=await getVerifiedSession();if(!session)return Response.json({error:'Unauthorized'},{status:401,headers:{'Cache-Control':'private, no-store'}});return Response.json({name:session.user.name},{headers:{'Cache-Control':'private, no-store'}});}`,
    explanation:
      'Next.js 15 changes GET Route Handler default caching, but a sensitive endpoint should also have deliberate HTTP cache semantics and an authenticated data projection. A static opt-in is inappropriate for current-user data. A session helper is an integration boundary that must verify the actual cookie/token and ownership.',
    checks: [
      'Request as two different users and anonymously.',
      'Inspect response headers through the real CDN/proxy.',
      'Verify the response includes no session token or internal account fields.',
    ],
    tweak: 'Can a public GET handler be cached?',
    answer:
      'Yes, when its representation and invalidation policy are genuinely public. Opt in intentionally under the chosen rendering model and verify deployment-layer behavior; GET alone is not a privacy classification.',
    doc: 'app/api-reference/file-conventions/route',
  },
  {
    slug: 'isr-revalidate',
    title: 'Set a deliberate ISR window without contradictory fetch options',
    difficulty: M,
    chapter: 'Caching and revalidation',
    file: 'app/news/page.tsx',
    broken: `export default async function Page(){const response=await fetch('https://news.example.com/public',{cache:'no-store',next:{revalidate:60}});return <pre>{await response.text()}</pre>;}`,
    fixed: `export default async function Page(){const response=await fetch('https://news.example.com/public',{next:{revalidate:60,tags:['public-news']}});if(!response.ok)throw new Error('News unavailable');return <pre>{await response.text()}</pre>;}`,
    explanation:
      'no-store contradicts a persistent revalidation window. Choose a single freshness policy, then measure the origin reads and stale-serving behavior across the time boundary. This reference targets the non-Cache-Components model; rebuilding, data revalidation and router refresh are different operations.',
    checks: [
      'Run a production build and multiple requests before and after the window.',
      'Introduce an origin failure during revalidation and inspect the served version.',
      'Record which layer stores data and which stores route output.',
    ],
    tweak: 'Would you use a 60-second window for inventory reservations?',
    answer:
      'Not for the authoritative admission decision. Cached catalog availability can be advisory, but the reservation must be validated atomically against current inventory in the system of record.',
    doc: 'app/guides/incremental-static-regeneration',
  },
  {
    slug: 'cache-components-opt-in',
    title: 'Adopt Cache Components as an explicit rendering change',
    difficulty: M,
    chapter: 'Cache Components (16)',
    file: 'next.config.ts',
    versions: '16-only',
    broken: `import type { NextConfig } from 'next';
const config:NextConfig={experimental:{ppr:true}};export default config;`,
    fixed: `import type { NextConfig } from 'next';
const config:NextConfig={cacheComponents:true};
export default config;
// Audit route-segment configuration and put uncached runtime work behind Suspense.`,
    explanation:
      'Cache Components is a deliberate Next.js 16 opt-in, not a claim that every 16 application uses the same model. Audit replaced experimental PPR configuration, route-segment options and request-dependent work. A flag switch without route-level production verification can change what is prerendered and when a page blocks.',
    checks: [
      'Build with the new flag in a disposable 16 project.',
      'Exercise public, cookie-dependent and dynamic-param routes.',
      'Identify unsupported legacy segment options and document a rollback before rollout.',
    ],
    tweak: 'Should you enable it in every app immediately?',
    answer:
      'Evaluate route behavior, deployment/cache support and regression evidence first. Adopt in reviewable steps with explicit cache lifetimes and user-isolation tests rather than treating a new framework feature as a universal performance switch.',
    doc: 'app/getting-started/caching',
  },
  {
    slug: 'cached-function-arguments',
    title: 'Keep request reads outside a shared use cache scope',
    difficulty: M,
    chapter: 'Cache Components (16)',
    file: 'app/products/page.tsx',
    versions: '16-only',
    broken: `import { cookies } from 'next/headers';
export async function Products(){'use cache';const tenant=(await cookies()).get('tenant')?.value;return <p>{tenant}</p>;}`,
    fixed: `import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { cacheLife } from 'next/cache';
async function CachedCatalog({tenant}:{tenant:string}){'use cache';cacheLife('minutes');return <p>Public catalog partition: {tenant}</p>;}
async function TenantCatalog(){const tenant=(await cookies()).get('tenant')?.value||'public';return <CachedCatalog tenant={tenant}/>;}
export default function Page(){return <Suspense fallback={<p>Loading tenant catalog</p>}><TenantCatalog/></Suspense>;}`,
    explanation:
      'A shared cached scope should not read request cookies directly. Extract and authorize runtime identity outside the cache, then pass admitted representation dimensions as arguments. The reference displays a non-sensitive partition label; a cookie string alone must not authorize access to tenant data, and raw session secrets should not become public cache inputs.',
    checks: [
      'Enable Cache Components and build.',
      'Request two admitted tenants and verify partitioned results.',
      'Attempt a forged tenant cookie and enforce authorization before replacing the label with real data.',
    ],
    tweak: 'Does adding the tenant argument solve revocation?',
    answer:
      'No. A key partitions representations but does not validate current membership or define entitlement freshness. Apply server authorization before cache access and choose a revocation-compatible lifetime/invalidation strategy.',
    doc: 'app/api-reference/directives/use-cache',
  },
  {
    slug: 'cache-life-scope',
    title: 'Place cacheLife inside the cached function',
    difficulty: M,
    chapter: 'Cache Components (16)',
    file: 'lib/catalog.ts',
    versions: '16-only',
    broken: `import { cacheLife } from 'next/cache';
cacheLife('hours');
export async function getCatalog(){'use cache';return ['one'];}`,
    fixed: `import { cacheLife } from 'next/cache';
export async function getCatalog(){'use cache';cacheLife({stale:60,revalidate:300,expire:3600});return ['one'];}`,
    explanation:
      'cacheLife belongs inside the function or component whose cache policy it configures, not module initialization. Its stale, revalidate and expire fields express distinct client/server lifetimes. Name those boundaries and the origin failure behavior instead of describing every field as a single universal TTL.',
    checks: [
      'Build with Cache Components enabled.',
      'Verify the function is called in a cache directive scope.',
      'Test cold, warm, stale and expired reads with a controllable origin and documented timing tolerances.',
    ],
    tweak: 'What happens with nested cached functions?',
    answer:
      'Inspect the framework’s nested lifetime rules and measure the outer representation’s effective policy. Avoid hiding unrelated cacheLife calls in generic utilities; keep the lifetime visible at each cached boundary.',
    doc: 'app/api-reference/functions/cacheLife',
  },
  {
    slug: 'cache-tag-assignment',
    title: 'Assign the same tags that later invalidation targets',
    difficulty: M,
    chapter: 'Cache Components (16)',
    file: 'lib/products.ts',
    versions: '16-only',
    broken: `import { cacheTag } from 'next/cache';
export async function product(id:string){'use cache';cacheTag('products');return {id};}
// Mutation invalidates product:<id>, a tag never assigned above.`,
    fixed: `import { cacheTag,cacheLife } from 'next/cache';
export async function product(id:string){'use cache';cacheLife('minutes');cacheTag('products','product:'+id);return {id};}`,
    explanation:
      'Invalidating a name that was never assigned does not refresh the intended entry. Use a server-owned tag vocabulary and distinguish entity entries from list representations. Tags are invalidation metadata; they do not replace cache keys or authorize the underlying product read.',
    checks: [
      'Cache two entities and a list in a production server.',
      'Invalidate an entity tag and observe the affected representation.',
      'Invalidate the list tag after membership changes and verify unrelated domains remain warm.',
    ],
    tweak: 'How do tenant tags change the design?',
    answer:
      'Include trusted tenant scope in tag names and use bounded server-owned identifiers. Prevent a user-controlled webhook from invalidating every tenant, and monitor invalidation fan-out.',
    doc: 'app/api-reference/functions/cacheTag',
  },
  {
    slug: 'revalidate-tag-max',
    title:
      'Choose stale-while-revalidate rather than accidental immediate expiry',
    difficulty: M,
    chapter: 'Caching and revalidation',
    file: 'app/actions.ts',
    versions: '15-to-16',
    broken: `'use server';
import { revalidateTag } from 'next/cache';
export async function publish(){revalidateTag('public-posts');}`,
    fixed: `'use server';
import { revalidateTag } from 'next/cache';
import { authorizePublisher,commitPost } from '@/lib/posts';
export async function publish(){await authorizePublisher();await commitPost();revalidateTag('public-posts','max');}`,
    next15:
      'The 15 baseline commonly uses single-argument revalidateTag. Inspect the exact patched 15.x declarations before changing its call shape.',
    next16:
      'Use revalidateTag(tag, profile), commonly max for SWR. The single-argument form is deprecated; immediate read-your-writes has a separate updateTag API in Server Actions.',
    explanation:
      'Invalidate after the authoritative write commits and choose the consistency contract deliberately. max marks tagged content stale so a later visit can serve stale content while refreshing. It is not a promise that the author immediately sees the just-written representation or that the entire site is eagerly regenerated.',
    checks: [
      'Authenticate a publisher and commit an observable versioned record.',
      'Verify a later visitor can trigger background refresh under the selected profile.',
      'Prove failed writes do not invalidate or announce a published result.',
    ],
    tweak: 'What if the actor must immediately see the new post?',
    answer:
      'In a 16 Server Action, consider updateTag for read-your-own-writes and test the next read. In other contexts use the appropriate documented revalidation profile and a product-specific consistency strategy.',
    doc: 'app/api-reference/functions/revalidateTag',
  },
  {
    slug: 'update-tag-context',
    title: 'Move updateTag out of a Route Handler',
    difficulty: M,
    chapter: 'Cache Components (16)',
    file: 'app/api/revalidate/route.ts',
    versions: '16-only',
    broken: `import { updateTag } from 'next/cache';
export async function POST(){updateTag('products');return Response.json({ok:true});}`,
    fixed: `import { revalidateTag } from 'next/cache';
import { authorizeRevalidation } from '@/lib/revalidation-auth';
export async function POST(request:Request){await authorizeRevalidation(request);revalidateTag('products',{expire:0});return Response.json({ok:true});}`,
    explanation:
      'updateTag is limited to Server Actions. A Route Handler that needs immediate tag expiry uses the documented revalidateTag profile instead, or selects max when stale service is acceptable. The invalidation endpoint still needs authentication and a server-owned tag policy.',
    checks: [
      'Call the defective handler in a real 16 server and observe the unsupported context.',
      'Use an authorized request against the corrected handler.',
      'Confirm the next tagged read fetches fresh data; test rejected callers and replay policy.',
    ],
    tweak: 'Why not expose a GET URL with an arbitrary tag parameter?',
    answer:
      'A public side-effecting GET endpoint can be triggered unintentionally and grants uncontrolled cache fan-out. Use authenticated bounded POST processing and map accepted events to known tags.',
    doc: 'app/api-reference/functions/updateTag',
  },
  {
    slug: 'router-refresh-vs-data',
    title: 'Distinguish router.refresh from server data invalidation',
    difficulty: M,
    chapter: 'Caching and revalidation',
    file: 'app/refresh-button.tsx',
    broken: `'use client';
export default function Refresh(){return <button onClick={()=>location.reload()}>Clear every cache</button>;}`,
    fixed: `'use client';
import { useRouter } from 'next/navigation';
export default function Refresh(){const router=useRouter();return <button onClick={()=>router.refresh()}>Request updated server UI</button>;}
// The mutation boundary must separately revalidate affected server data when required.`,
    explanation:
      'router.refresh requests fresh server-rendered UI and merges the payload while preserving eligible client state. It is not an API for globally purging the Data Cache. If the server data is still cached, a refreshed route can legitimately show the same version.',
    checks: [
      'Refresh a page with an interactive client counter and inspect state preservation.',
      'Repeat while its public data remains cached.',
      'Invalidate the assigned data tag at the mutation boundary and compare the next refresh.',
    ],
    tweak: 'How does revalidatePath differ?',
    answer:
      'It targets a path/layout’s cached route behavior in an allowed server context. Shared data used by other routes may need tag-based invalidation too; write down the read graph before choosing the smallest correct invalidation scope.',
    doc: 'app/api-reference/functions/use-router',
  },
  {
    slug: 'server-action-auth',
    title: 'Authorize every exported Server Action invocation',
    difficulty: M,
    chapter: 'Mutations and forms',
    file: 'app/actions.ts',
    broken: `'use server';
import { db } from '@/lib/db';
export async function removeInvoice(id:string){await db.invoice.delete({where:{id}});}`,
    fixed: `'use server';
import { requireUser } from '@/lib/auth';
import { deleteOwnedInvoice } from '@/lib/invoices';
export async function removeInvoice(id:string){const user=await requireUser();if(!/^[a-z0-9-]{1,64}$/.test(id))return {ok:false};await deleteOwnedInvoice({id,ownerId:user.id});return {ok:true};}
// deleteOwnedInvoice enforces ownership in its database predicate/transaction.`,
    explanation:
      'A Server Action is callable server functionality, not a trusted continuation merely because a hidden button invoked it. Validate the payload and bind the mutation to the authenticated actor at the data layer. Checking ownership in a previous render leaves forged requests and races unaddressed.',
    checks: [
      'Invoke as the owner, a different authenticated user and an anonymous caller.',
      'Forge an ID not shown by the UI.',
      'Verify a failed ownership check changes no record and returns the chosen non-leaking outcome.',
    ],
    tweak: 'Is an encrypted action closure an authorization policy?',
    answer:
      'No. Action identifiers, closure handling and transport protections do not replace checking current identity and object permission when the action executes.',
    doc: 'app/guides/data-security',
  },
  {
    slug: 'use-action-state',
    title: 'Return validation state through React 19 useActionState',
    difficulty: M,
    chapter: 'Mutations and forms',
    file: 'app/contact-form.tsx',
    broken: `'use client';
export default function Form(){return <form><input name="email"/><button onClick={()=>alert('Saved')}>Save</button></form>;}`,
    fixed: `'use client';
import { useActionState } from 'react';
import { saveContact } from './actions';
export default function Form(){const [state,action,pending]=useActionState(saveContact,{message:''});return <form action={action}><label>Email<input name="email" type="email" required/></label><button disabled={pending}>Save</button><p role="status">{state.message}</p></form>;}
// actions.ts exports an authorized server function accepting (previousState, formData) and returning {message:string}.`,
    explanation:
      'The form action owns submission rather than a click handler that reports success before persistence. useActionState exposes returned serializable validation state and pending status. Client constraints improve usability, while the server function must still validate raw FormData and authorize the mutation.',
    checks: [
      'Implement the stated action contract and submit valid and invalid emails.',
      'Verify field errors do not report success.',
      'Exercise a pending submission, keyboard submit and a server failure with a defined recovery path.',
    ],
    tweak:
      'Can JavaScript absence and progressive enhancement be assumed here?',
    answer:
      'Test the actual form/action arrangement and documented hydration behavior. Native form semantics help, but a client implementation, external state and redirects can affect the no-JavaScript path; make the product requirement explicit.',
    doc: 'app/guides/forms',
  },
  {
    slug: 'form-status-parent',
    title: 'Place useFormStatus inside the form it observes',
    difficulty: M,
    chapter: 'Mutations and forms',
    file: 'app/submit-button.tsx',
    broken: `'use client';
import { useFormStatus } from 'react-dom';
export default function Form(){const {pending}=useFormStatus();return <form><button disabled={pending}>Save</button></form>;}`,
    fixed: `'use client';
import { useFormStatus } from 'react-dom';
export default function SubmitButton(){const {pending}=useFormStatus();return <button disabled={pending}>{pending?'Saving…':'Save'}</button>;}
// Render <SubmitButton/> as a descendant of the parent <form action={serverAction}>.`,
    explanation:
      'The hook observes a parent form’s submission status. Calling it in the component that creates the form does not place that hook inside the form’s descendant tree. Keep the submit control small and test the action path rather than adding an unrelated global loading boolean.',
    checks: [
      'Render the button inside a parent action form and delay the action.',
      'Submit via keyboard and confirm pending disables the button.',
      'Render a second independent form and verify statuses remain independent.',
    ],
    tweak: 'Does disabling the button prevent duplicate writes?',
    answer:
      'It improves feedback but is not a server concurrency guarantee. Use a database constraint, idempotency policy or transactional operation appropriate to the mutation, and test retries from a forged or repeated request.',
    doc: 'app/guides/forms',
  },
  {
    slug: 'optimistic-state',
    title: 'Keep optimistic presentation separate from authoritative state',
    difficulty: S,
    chapter: 'Mutations and forms',
    file: 'app/messages.tsx',
    broken: `'use client';
export async function sendMessage(text:string){document.querySelector('ul')!.innerHTML+='<li>'+text+'</li>';await fetch('/api/messages',{method:'POST',body:text});}`,
    fixed: `'use client';
import { useOptimistic } from 'react';
type Message={id:string;text:string;pending?:boolean};
export default function Messages({messages,send}:{messages:Message[];send:(data:FormData)=>Promise<void>}){
 const [visible,add]=useOptimistic(messages,(state:Message[],item:Message)=>[...state,{...item,pending:true}]);
 return <><ul>{visible.map(item=><li key={item.id}>{item.text}{item.pending?' (sending)':''}</li>)}</ul><form action={async data=>{add({id:'pending:'+crypto.randomUUID(),text:String(data.get('text')||'')});await send(data);}}><input name="text"/><button>Send</button></form></>;
}
// send must be a Server Action. Temporary IDs identify concurrent optimistic rows; durable idempotency belongs on the server.`,
    explanation:
      'React owns the DOM, so mutating innerHTML bypasses reconciliation and injects untrusted text. Optimistic state is a temporary projection over authoritative props; use a transition/action context and reconcile success or failure. Temporary rows use unique IDs so identical concurrent drafts do not collide; durable identity and retry behavior still belong to the server contract.',
    checks: [
      'Send a successful message and reconcile server props.',
      'Reject a send and verify the temporary result is not treated as durable.',
      'Admit identical concurrent messages with distinct operation IDs before using the pattern in production.',
    ],
    tweak: 'How do you preserve a failed draft for retry?',
    answer:
      'Model draft/error state separately from the optimistic projection. Associate an operation ID with the retry policy and avoid appending the same authoritative message twice when the original result arrives late.',
    doc: 'app/guides/forms',
  },
  {
    slug: 'redirect-catch',
    title: 'Do not swallow redirect control flow in a catch block',
    difficulty: S,
    chapter: 'Mutations and forms',
    file: 'app/actions.ts',
    broken: `'use server';
import { redirect } from 'next/navigation';
export async function save(){try{redirect('/complete');}catch{return {error:'Save failed'};}}`,
    fixed: `'use server';
import { redirect } from 'next/navigation';
import { authorizeAndSave } from '@/lib/save';
export async function save(){try{await authorizeAndSave();}catch{return {error:'Save failed'};}redirect('/complete');}`,
    explanation:
      'redirect uses framework control flow that must escape the handler. Catch the fallible business operation, then redirect after the catch region. Do not return success before the write commits, and avoid swallowing other framework control-flow signals in broad application error handling.',
    checks: [
      'Verify success navigates to /complete.',
      'Force the business write to fail and verify the action returns its intended error.',
      'Inspect action redirect behavior separately from a direct GET redirect.',
    ],
    tweak: 'Which redirect status should you expect?',
    answer:
      'It depends on context: Server Action and ordinary render/handler redirects have different semantics. Verify the documented status and method-preservation behavior rather than asserting every redirect is a 302.',
    doc: 'app/api-reference/functions/redirect',
  },
  {
    slug: 'route-handler-validation',
    title: 'Validate JSON Route Handler requests without leaking exceptions',
    difficulty: S,
    chapter: 'Route handlers and APIs',
    file: 'app/api/notes/route.ts',
    broken: `export async function POST(request:Request){const body=await request.json();return Response.json({title:body.title.trim()});}`,
    fixed: `export async function POST(request:Request){
 if(request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json')return Response.json({error:'Unsupported media type'},{status:415});
 let body:unknown;try{body=await request.json();}catch{return Response.json({error:'Invalid JSON'},{status:400});}
 if(!body||typeof body!=='object'||!('title' in body)||typeof body.title!=='string'||!body.title.trim()||body.title.length>80)return Response.json({error:'Invalid title'},{status:422});
 return Response.json({title:body.title.trim()},{status:201});
}
// Add authentication, transport body limits and persistence before treating this echo as a write endpoint.`,
    explanation:
      'A TypeScript expectation does not validate an HTTP body. Separate unsupported media, malformed JSON and invalid domain fields, and expose stable client errors rather than server internals. This teaching handler validates and echoes a title; 201 alone does not imply durable persistence.',
    checks: [
      'Send missing/wrong content type, invalid JSON, null and a valid title.',
      'Enforce body-size limits at the receiving server/deployment boundary.',
      'Add an authenticated persistence integration and verify transaction failures separately.',
    ],
    tweak: 'Where should API consumers learn the contract?',
    answer:
      'Publish a schema with status/error shapes and use contract tests. Bound reads before parsing large bodies, and avoid claiming that a Content-Length header alone enforces a trustworthy size limit.',
    doc: 'app/api-reference/file-conventions/route',
  },
  {
    slug: 'webhook-raw-body',
    title: 'Verify a webhook signature over its original bytes',
    difficulty: S,
    chapter: 'Route handlers and APIs',
    file: 'app/api/webhooks/route.ts',
    broken: `export async function POST(request:Request){const json=await request.json();await processEvent(json);return Response.json({ok:true});}`,
    fixed: `import { verifyProviderSignature,commitEventOnce } from '@/lib/webhooks';
export async function POST(request:Request){
 const raw=await request.text();const signature=request.headers.get('provider-signature');
 const event=await verifyProviderSignature(raw,signature);
 if(!event)return Response.json({error:'Invalid signature'},{status:401});
 await commitEventOnce(event);return Response.json({ok:true});
}
// The provider adapter enforces its timestamp/replay rules; commitEventOnce uses durable uniqueness with the business write.`,
    explanation:
      'Parsing and reserializing JSON can change the signed byte sequence. Verify the provider’s documented signature over the admitted raw body before processing the event. Signature validity does not supply durable idempotency, ordering or atomicity; those are explicit responsibilities of the commit boundary.',
    checks: [
      'Use the provider SDK/test vector to verify exact body bytes.',
      'Reject changed bytes, invalid signatures and out-of-window timestamps.',
      'Deliver the same event concurrently and crash between receipt and business mutation.',
    ],
    tweak: 'Can you acknowledge before durable admission?',
    answer:
      'Only if a durable queue/outbox has accepted responsibility. A process-local promise after returning 200 can lose the event on shutdown; a provider may stop retrying after that acknowledgement.',
    doc: 'app/api-reference/file-conventions/route',
  },
];
